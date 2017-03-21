/* 需先執行
 * npm install x-date --verbose
 * npm install system-sleep --verbose
 * npm install diff --verbose
 * npm install http --verbose
 * npm install querystring --verbose
 */
var fs = require('fs');

//0.設定值
var error_hostname = '172.24.41.51';

//1.傳入參數
if (process.argv.length <= 3) {
    console.log("Usage: " + __filename + " path/to/directory fileIdx");
    process.exit(-1);
}
var searchpath = process.argv[2];
var fileIdx = process.argv[3];

//2.取得日期及檔案
require('x-date') ;
var todayStr = new Date().format('yyyy-mm-dd');
var todayFile = 'log_' + todayStr + '_' + fileIdx + '.txt';
console.log('今日: ' + todayStr + ' => ' + todayFile);

var yesday = new Date();
yesday.setDate(yesday.getDate() - 1); // Yesterday!
var yesdayStr = yesday.format('yyyy-mm-dd')
console.log(yesdayStr);
var yesdayFile = 'log_' + yesdayStr + '_' + fileIdx + '.txt';
console.log('昨日: ' + yesdayStr + ' => ' + yesdayFile);

//3.主流程
gen_today_file();
//var sleep = require('system-sleep');
//sleep(10*1000); // sleep for 10 seconds
//sleep(10000);
//var identical = compare_file();
//send_error(identical);

/*產生比對檔*/
function gen_today_file() { 
    var walk = function(dir, done) {
        var results = [];
        fs.readdir(dir, function(err, list) {
            if (err) return done(err);
            var i = 0;
            (function next() {
                var file = list[i++];
                if (!file) return done(null, results);
                file = dir + '/' + file;
                fs.stat(file, function(err, stat) {
                    if (stat && stat.isDirectory()) {
                        walk(file, function(err, res) {
                            results = results.concat(res);
                            next();
                        });
                    } else {
                        results.push(file);
                        next();
                    }
                });
            })();
        });
    };

    var logStream = fs.createWriteStream(todayFile, {'flags': 'w'}); 
    logStream.on('open', function () {
        walk(searchpath, function(err, files) {
            if (err) 
                throw err;

            for (var fileIdx in files) {
                var stats = fs.statSync(files[fileIdx]);
                var buffer = files[fileIdx] + ',' +        
                                stats["size"] + ',' +
                                stats["atime"] + ',' + 
                                stats["mtime"] + ',' +
                                stats["ctime"] + ',' +
                                stats["uid"] + ',' + 
                                stats["gid"] + ',' +
                                (stats["mode"] & 0040000 ? 'd' : '-') +
                                (stats["mode"] & 400 ? 'r' : '-') + (stats["mode"] & 200 ? 'w' : '-') + (stats["mode"] & 100 ? 'x' : '-') +
                                (stats["mode"] & 40 ? 'r' : '-') + (stats["mode"] & 20 ? 'w' : '-') + (stats["mode"] & 10 ? 'x' : '-') +
                                (stats["mode"] & 4 ? 'r' : '-') + (stats["mode"] & 2 ? 'w' : '-') + (stats["mode"] & 1 ? 'x' : '-') + '\n';
                fs.appendFileSync(todayFile, buffer);
                logStream.write(buffer);
            }
            logStream.end();
        });
    }).on('error', function (err) {
        console.log('file has error: ' + err);
    }).on('finish', function () {
        console.log('file has been written');
        
        var identical = compare_file();
        send_error(identical);
    });
}

/*比對檔案*/
function compare_file() {
    var source = "";
    var target = "";

    try {
        source = fs.readFileSync(yesdayFile, 'utf8');
    } catch(e) {
        console.error("error reading " + yesdayFile + ": " + e.message);
        return false;
    }

    try {
        target = fs.readFileSync(todayFile, 'utf8');
    } catch(e) {
        console.error("error reading " + todayFile + ": " + e.message);
        return false;
    }

    var diff = require('diff');
    var results = diff.diffLines(source, target);
    var identical = true;

    results.forEach(function(part) {
      if(part.added) {
        console.log("added:   " + part.value);
        identical = false;
      }
      if(part.removed) {
        console.log("removed: " + part.value);
        identical = false;
      }
    });
    
    console.log("Identical? " + identical);
    return identical;
}

/*傳送錯誤訊息*/
function send_error(identical) {
    if (identical == false) {
        var http = require('http');
        var querystring = require("querystring");
        var keyWordVal = yesdayFile + ' vs. ' + todayFile + ' 不一致.';
        var postData = querystring.stringify({
            'kind' : 9 , 'keyWord' : keyWordVal
        });
        console.log('postData: ' + postData);
        var options = {
            hostname: error_hostname,
            port: 80,
            path: '/warrantweb/Analysis.action',
            method: 'POST',
            headers:{
                "Content-Length":postData.length,
                "Content-Type":"application/x-www-form-urlencoded; charset=UTF-8",        
            }
        };

        var req = http.request(options, function(res) {
            console.log('STATUS: ' + res.statusCode);
            console.log('HEADERS: ' + JSON.stringify(res.headers));
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                console.log('BODY: ' + chunk);
            });
        });

        req.on('error', function(e) {
          console.log('problem with request: ' + e.message);
        });

        // write data to request body
        req.write(postData);
        req.end();
    }
}
/*
function sleep(milliSeconds) {
    var startTime = new Date().getTime();
    while (new Date().getTime() < startTime + milliSeconds);
}*/