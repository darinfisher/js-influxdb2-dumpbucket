
'use strict'

const {
  url, token, org, bucket,
  dest_url, dest_token, dest_org, dest_bucket
} = require( './env.json' );

const { InfluxDB, FluxTableMetaData, Point, HttpError } = require( '@influxdata/influxdb-client' );

// keys we don't want to save
const delKeys = [ "result", "table", "_start", "_stop", "_time", "_value", "_field", "_measurement" ];

// need to auto-detect field types ...
const dataTypes = {
  'auth_result': 'stringField',
  'suspicious': 'booleanField'
};

function sleep(ms) {
  return new Promise( resolve => setTimeout( resolve, ms ) );
}

var wfunc;    // InfluxDB write class
function writeAPI() {
  if ( !wfunc ) wfunc = new InfluxDB( { url: dest_url, token: dest_token } ).getWriteApi( dest_org, dest_bucket, 'ms' );
  return wfunc;
}

var rfunc;    // InfluxDB read class
function readAPI() {
  if ( !rfunc ) rfunc = new InfluxDB( { url, token } ).getQueryApi( org );
  return rfunc;
}

function clearObject( obj ) {
  if ( !obj ) return( cb( "Error clearing the object: NO OBJECT!" ) );
  delKeys.forEach( function( el ) { 
    if ( typeof( obj[el] ) != undefined ) delete obj[el]; 
  } );
  return obj;
}

function buildPoint( obj, cb ) {
  if ( !obj ) return( cb( "Error building the point: NO OBJECT!" ) );
  const point = new Point( obj._measurement );
  point.timestamp( new Date( obj._time ).getTime() );
  point[dataTypes[obj._field]]( obj._field, obj._value );
  obj = clearObject( obj );
  Object.keys( obj ).forEach( function( k ) {
    point.tag( k, obj[k] );
  } );
  return cb( null, point );
}

function writeRecord( rec, cb ) {
  writeAPI().writePoint( rec );
  return( cb() );
}

function processRec( rec, cb ) {
  if ( !rec ) return( cb( "Error processing record: NO RECORD!" ) );
  buildPoint( rec, function( err, point ) {
    if ( err ) return( cb( err ) );
    writeRecord( point, function( err ) { return cb( err ) } );
  } );
}

function getData( cb ) {
  const r = readAPI();
  const fluxQuery = 'from( bucket:"' + bucket + '" ) |> range( start: -200d ) |> filter( fn: (r) => r._measurement == "auth_activity" )';

  let count = 0;
  let totalc = 0;
  r.queryRows( fluxQuery, {
    next( row, tableMeta ) {
      // if throttling is needed, here is a good place to do that
      const o = tableMeta.toObject( row );
      count++;
      totalc++;
      processRec( o, function( err ) { count--; } );
    },
    error( error ) { return( cb( error ) ); },
    complete() {
      while ( count > 0 ) { sleep( 1 ); console.log( 'getData() count:' + count ); }
      writeAPI().flush()
        .then( () => { 
          writeAPI()
            .close()
            .then( () => { return( cb() ); } )
            .catch( e => { return( cb( e ) ); } )
        } )
        .catch( e => { return ( cb( e ) ); } );
    }
  } );
}

getData( function( err ) {
  if ( err ) return( console.log( err ); );
  console.log( 'Complete transfer of ' + totalc + ' records.' );
} );

