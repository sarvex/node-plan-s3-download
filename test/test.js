var definition = require('../')
  , Plan = require('plan')
  , assert = require('assert')
  , fs = require('fs')
  , path = require('path')
  , s3 = require('s3')
  , makeTemp = require('temp').path

var tmpFilePath = path.join(__dirname, "tmp.foo");
var remoteUrl = "/node-plan-s3-upload/test.foo";

describe("s3-download", function() {
  beforeEach(function(done) {
    fs.writeFile(tmpFilePath, "abcd", function(err) {
      if (err) return done(err);
      var client = s3.createClient({
        key: process.env.S3_KEY,
        secret: process.env.S3_SECRET,
        bucket: process.env.S3_BUCKET,
      });
      var uploader = client.upload(tmpFilePath, remoteUrl);
      uploader.on('error', done);
      uploader.on('end', done);
    });
  });
  afterEach(function(done) {
    fs.unlink(tmpFilePath, done);
  });
  it("works", function(done) {
    var task = Plan.createTask(definition, 's3-download', {
      url: '/{uuid}/{brace}}/{brace}ext/blah{ext}',
      s3Key: process.env.S3_KEY,
      s3Secret: process.env.S3_SECRET,
      s3Bucket: process.env.S3_BUCKET,
    });
    var plan = new Plan();
    plan.addTask(task);
    plan.on('error', done);
    plan.on('end', function(results) {
      assert.ok(results.tempPath);
      assert.ok(/\.foo$/.test(results.tempPath), "results tempPath should use same extension as remote file")
      assert.strictEqual(task.exports.bucket, process.env.S3_BUCKET);
      done();
    });
    plan.start({
      s3Url: remoteUrl,
      makeTemp: makeTemp,
    });
  });
});
