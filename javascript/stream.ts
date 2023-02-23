import stream from "stream";
import fs from "fs";
export const liner = new stream.Transform({ objectMode: true });

liner._transform = function (chunk, encoding, done) {
  var data = chunk.toString();
  if (this._lastLineData) data = this._lastLineData + data;

  var lines = data.split("\n");
  this._lastLineData = lines.splice(lines.length - 1, 1)[0];

  lines.forEach(this.push.bind(this));
  done();
};

liner._flush = function (done) {
  if (this._lastLineData) this.push(this._lastLineData);
  this._lastLineData = null;
  done();
};

var source = fs.createReadStream("test.txt");

(function () {
  source.pipe(liner);
  liner.on("readable", function () {
    var line;
    while (null !== (line = liner.read())) {
      let processedLine = line?.replace(/\r/, "");
      console.log(processedLine + " sobhan");
    }
  });
})();
