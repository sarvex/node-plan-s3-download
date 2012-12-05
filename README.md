See [node-plan](https://github.com/superjoe30/node-plan).

See also [node-plan-s3-upload](https://github.com/superjoe30/node-plan-s3-upload).

### input

  * `s3Url` - s3 path to download
  * `makeTemp` - a function which generates a tempfile and accepts a suffix

### output

  * `tempPath` - path to the temp file where the s3 file was saved

### options

  * `s3Key`
  * `s3Secret`
  * `s3Bucket`

### exports

  * `bucket` - copied directly from options
