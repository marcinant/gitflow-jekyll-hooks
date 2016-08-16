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

	// render scss files only, do not touch _underscored styles.
	// scss files with names starting with _ should contain default variables only
	{
	    "match": ['_site/assets/styles/[a-zA-Z0-9]*.scss'],
	    "fn": function(event, file){
		// console.log('event: ', event);
		if(event == 'change' || event == 'add'){
		    // console.log('sass:', file);
		    var outFile, mapFile;

		    outFile = path.join(path.dirname(file), path.basename(file, '.scss') + '.css');
		    mapFile = path.join(path.dirname(file), path.basename(file, '.scss') + '.css.map');

		    // when we edit scss in dev tools then write back to project
		    fs.copy(file, path.join('../_styles/' + path.basename(file)));
		    
		    sass.render({
			file: file,
			outFile: outFile,
			sourceMap: true
		    }, function(error, result){
			if(!error){
			    fs.writeFileSync(outFile, result.css);
			    fs.writeFileSync(mapFile, result.map);	
			}
		    });
		}
	    }
	},
	
	{
	    "match": ['_site/assets/scripts/*.js'],
	    "fn": function(event, file){
		if(event == 'change' || event == 'add'){
		    fs.copy(file, path.join('../_scripts/' + path.basename(file)));
		}
	    }
	},

	// service worker files
	{
	    "match": ['../_scripts/*.js'],
	    "fn": function(event, file){
		fs.createReadStream(file).pipe(fs.createWriteStream('_site/assets/scripts/'+path.basename(file)));
	    }
	},

	// markup files rendered by generator
	{
	    "match": ['../_includes/*', '../_layouts/*', '../*.html', '../*.md'],
	    "fn": function(event, file){		
		if(event == 'change' || event == 'add') {
		    console.log('jekyll:', file);
		    cp.spawn('jekyll', ['build', '--config' ,'config.yml,../_config.yml', '-s', '../', '-d', './_site/', '--incremental', '--quiet'], {stdio: 'inherit'}).on('close', function(code){
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
