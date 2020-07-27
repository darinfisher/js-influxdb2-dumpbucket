# js-influxdb2-dumpbucket

## Copies a bucket from OSS 2.x to Cloud 2
Could easily be modified for others ...

The search criteria are currently hard-coded.
Should change that...

## NOTE
Uses `env.json` for URL, token, bucket, and org
You will need to create this file correctly to run.
```
{
  "url": "http://localhost:9999",
  "token": "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  "org": "example-oss-org",
  "bucket": "old-bucket",
  "dest_url": "https://cloud2.influxdata.com",
  "dest_token": "RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR",
  "dest_org": "example-cloud2-org",
  "dest_bucket": "new-bucket"
}
```
1. Verify the cloud 2 configuration, create the bucket and aquire the read/write token
2. Clone the repo: `git clone https://github.com/darinfisher/js-influxdb2-dumpbucket.git`
3. Initialize to build the dependencies: `cd js-influxdb2-dumpbucket && yarn`
4. Create your env file: `env.json`
5. Verify the `fluxQuery` is defined to get the data you want
6. Run: `node .`



