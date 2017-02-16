var fs = require('fs');
var startTag = '<meta charset="utf-8">';

var argv = process.argv.slice(2);
argv.forEach(function (val) {
  fs.readFile(val, function(err, data) {
    if(err) throw err;
    var array = data.toString().split("\n");
    var output = [];
    var replacingFlag = false;
    var indent = '';
    for(const line of array) {
      output.push(line);

      if(line.trim() == startTag) {
        output.push('<meta name="viewport" content="width=device-width, initial-scale=1.0">');
      }
    }
    var content = output.join('\n');
    fs.writeFile(val, content, function(err) {
      if(err) throw err;
    });
  });
});

