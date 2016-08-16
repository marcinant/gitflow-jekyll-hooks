'use strict';
var bs = require('browser-sync').create();
var fs = require('fs-extra');
var bsconf = require('./bs-config.js');

const mkdirp = require('mkdirp-promise');
const exec = require('child-process-promise').exec;

let setScripts  = mkdirp('./_site/assets/scripts')
    .then((result) => console.log('Directory created:\n', result));

let setStyles  = mkdirp('./_site/assets/styles')
    .then((result) => console.log('Directory created:\n', result));

let setMarkup = exec('jekyll build -s ../ -d ./_site')
    .then((result) => console.log('Markup generated:\n', result.stdout));

Promise.all([setScripts, setStyles, setMarkup]).then(value => {
    bs.init(bsconf, () => {
	fs.copy('../_scripts', './_site/assets/scripts');
	fs.copy('../_styles', './_site/assets/styles');
    });
}, reason => {
    console.log(reason);
});
