var fs = require('fs');
var startTag = '<footer>';

fs.readFile('footer.html', function(err, menuData) {
  if(err) throw err;
  var menu = menuData.toString().split("\n");
  // Read the files supplied as parameters to replace their content
  var argv = process.argv.slice(2);
  argv.forEach(function (val) {
    fs.readFile(val, function(err, data) {
      if(err) throw err;
      var array = data.toString().split("\n");
      var output = [];
      var replacingFlag = false;
      var indent = '';
      for(const line of array) {
        if(line == indent + '</footer>') {
          replacingFlag = false;
        }
        if(replacingFlag == false) {
          output.push(line);
        }

        if(line.trim() == startTag) {
          replacingFlag = true;
          indent = line.substr(0, line.indexOf(startTag));
          for(const menuLine of menu) {
            output.push(indent + '  ' + menuLine);
          }
        }
      }
      var content = output.join('\n');
      fs.writeFile(val, content, function(err) {
        if(err) throw err;
      });
    });
  });
});

