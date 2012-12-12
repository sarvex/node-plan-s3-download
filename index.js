var path = require('path')
  , s3 = require('s3');

module.exports = {
  start: function(done) {
    var self = this;
    var opts = {
      key: self.options.s3Key,
      secret: self.options.s3Secret,
      bucket: self.options.s3Bucket,
    };
    var client, err;
    try {
      client = s3.createClient(opts);
    } catch (err) {
      done(err);
      return;
    }
    self.exports.bucket = self.options.s3Bucket;
    self.emit('update');

    // consume the s3 url
    var s3Url = self.context.s3Url;
    delete self.context.s3Url;

    self.context.tempPath = self.context.makeTemp({
      suffix: path.extname(s3Url)
    });

    var downloader = client.download(s3Url, self.context.tempPath);
    downloader.on('error', function (err) {
      done(err);
    });
    downloader.on('progress', function(amountDone, amountTotal) {
      self.exports.amountDone = amountDone;
      self.exports.amountTotal = amountTotal;
      self.emit('progress');
    });
    downloader.on('end', function() {
      done();
    });
  }
};
