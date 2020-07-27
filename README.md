# js-influxdb2-dumpbucket

## Copies a bucket from OSS 2.x to Cloud 2
Could easily be modified for others ...

The search criteria are currently hard-coded.
Will change that...

## NOTE
Uses 'env.json' for URL, token, bucket, and org
You will need to create this file correctly to run.
```
{
  "url": "",
  "token": "",
  "org": "",
  "bucket": "",
  "dest_url": "",
  "dest_token": "",
  "dest_org": "",
  "dest_bucket": "",
}
```
1. Clone the repo
2. Initialize to build the dependencies: `yarn init`
3. Create your env file: env.json
4. Run: `node .`



