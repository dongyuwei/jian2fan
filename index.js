var fs = require('fs');
var path = require('path');
var OpenCC = require('opencc');


if (process.argv.length !== 3) {
    console.log("Usage: " + __filename + " path/to/html/template/directory");
    process.exit(1);
}

var dir = process.argv[2];

var content = [];
var items = fs.readdirSync(dir);

for (var i = 0; i < items.length; i++) {
    content.push(fs.readFileSync(path.join(dir, items[i]), 'utf-8'));
}

var map = {};
var opencc = new OpenCC('s2tw.json');
var reg = /{{_\('(.*?)'\)}}/gi;
var results;
while ((results = reg.exec(content.join(' '))) !== null) {
    map[results[1]] = opencc.convertSync(results[1]);
}

var tw = [], zh = [];
for(var key in map){
    tw.push('msgid "' + key + '"\nmsgstr "' + map[key] + '"');
    zh.push('msgid "' + key + '"\nmsgstr ""');
}

fs.writeFileSync('./zh.txt', zh.join('\n\n'), 'utf-8');
fs.writeFileSync('./tw.txt', tw.join('\n\n'), 'utf-8');
console.log('translations have been write to ./tw.txt ');
