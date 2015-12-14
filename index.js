var fs = require('fs');
var path = require('path');
var OpenCC = require('opencc');
var po2json = require('po2json');


if (process.argv.length < 4) {
    console.log("Usage: " + __filename + " path/to/html/template/directory  path/to/messages.pot");
    process.exit(1);
}

var dir = process.argv[2];

var translated = po2json.parseFileSync(process.argv[3], {
    fuzzy: true,
    format: 'mf'
});

var content = [];
var items = fs.readdirSync(dir);

for (var i = 0; i < items.length; i++) {
    content.push(fs.readFileSync(path.join(dir, items[i]), 'utf-8'));
}
content = content.join(' ');

var map = {};
var opencc = new OpenCC('s2tw.json');

// match {{ _(' ') }} or {{ _(" ") }}
var reg = /{{\s*_\((['|"])(.*?)\1\)\s*}}/gi;

var results;
while ((results = reg.exec(content)) !== null) {
    map[results[2]] = opencc.convertSync(results[2]);
}

var tw = [], zh = [];
for(var key in map){
    if(!(key in translated)){
        tw.push('msgid "' + key + '"\nmsgstr "' + map[key] + '"');
        zh.push('msgid "' + key + '"\nmsgstr ""');
    }
}

fs.writeFileSync('./zh.txt', zh.join('\n\n'), 'utf-8');
fs.writeFileSync('./tw.txt', tw.join('\n\n'), 'utf-8');
console.log('translations have been write to ./tw.txt and ./zh.txt ');
