/*
  |--------------------------------------------------------------------------
  | Browser-sync config file
  |--------------------------------------------------------------------------
  |
  | For up-to-date information about the options:
  |   http://www.browsersync.io/docs/options/
  |
  | There are more options than you see here, these are just the ones that are
  | set internally. See the website for more info.
  |
  |
*/
cp = require('child_process');
fs = require('fs-extra');
path = require('path');
sass = require('node-sass');

module.exports = {
    "ui": false,
    "files": [
	'_site',
	{
	    "match": ['../_styles/*.*css'],
	    "fn": function(event, file){
		// console.log('sass:', file);
		var outFile = path.basename(file, '.scss');
		outFile = '_site/' + outFile + '.css';
		// console.log('css:', outFile);	    
		sass.render({
		    file: file,
		    outFile: outFile
		}, function(error, result){
		    if(!error){
			fs.writeFile(outFile, result.css, function(err){
			    // 
			});
		    }
		});
	    }
	}, {
	    "match": ['../_scripts/*.js'],
	    "fn": function(event, file){
		fs.createReadStream(file).pipe(fs.createWriteStream('_site/assets/scripts/'+path.basename(file)));
	    }
	}, {
	    "match": ['../_includes/*', '../_layouts/*', '../*.html', '../*.md'],
	    "fn": function(event, file){		
		if(event === 'change') {
		    console.log('jekyll:', file);
		    cp.spawn('jekyll', ['build', '--config' ,'_config.yml,../_config.yml', '-s', '../', '-d', './_site/', '--incremental', '--quiet'], {stdio: 'inherit'}).on('close', function(code){
			if (code > 0) {
			    console.log('child process exited with code: ' + code);
			}
		    });
		}
	    }
	}],
    "watchOptions": {
	"ignoreInitial": true,
	"ignored": "*.txt"
    },
    "server": "_site",
    "proxy": false,
    "port": 3000,
    "middleware": false,
    "serveStatic": [],
    "ghostMode": {
        "clicks": true,
        "scroll": true,
        "forms": {
            "submit": true,
            "inputs": true,
            "toggles": true
        }
    },
    "logLevel": "info",
    "logPrefix": "BS",
    "logConnections": false,
    "logFileChanges": true,
    "logSnippet": true,
    "rewriteRules": false,
    "open": "local",
    "browser": "default",
    "xip": false,
    "hostnameSuffix": false,
    "reloadOnRestart": false,
    "notify": true,
    "scrollProportionally": true,
    "scrollThrottle": 0,
    "scrollRestoreTechnique": "window.name",
    "scrollElements": [],
    "scrollElementMapping": [],
    "reloadDelay": 0,
    "reloadDebounce": 0,
    "plugins": [],
    "injectChanges": true,
    "startPath": null,
    "minify": true,
    "host": null,
    "codeSync": true,
    "timestamps": true,
    "clientEvents": [
        "scroll",
        "scroll:element",
        "input:text",
        "input:toggles",
        "form:submit",
        "form:reset",
        "click"
    ],
    "socket": {
        "socketIoOptions": {
            "log": false
        },
        "socketIoClientConfig": {
            "reconnectionAttempts": 50
        },
        "path": "/browser-sync/socket.io",
        "clientPath": "/browser-sync",
        "namespace": "/browser-sync",
        "clients": {
            "heartbeatTimeout": 5000
        }
    },
    "tagNames": {
        "less": "link",
        "scss": "link",
        "css": "link",
        "jpg": "img",
        "jpeg": "img",
        "png": "img",
        "svg": "img",
        "gif": "img",
        "js": "script"
    }
};
