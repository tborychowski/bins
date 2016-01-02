'use strict';
const Path = require('path');
const Exec = require('child_process').execFile;
const Apple = require('run-applescript');
const rimraf = require('rimraf');
const list = require('./list');


function rm (path) {
	return new Promise(resolve => rimraf(path, err => resolve(!err)));
}


function emptyBins (bins) {
	bins = bins.map(bin => Path.join(bin.path, '*')).map(rm);
	return Promise.all(bins)
		.then(res => res.reduce((p, c) => p && c, true));	// [true, true, false] => false
}


const empty = {
	linux  : () => list.get().then(emptyBins),
	darwin : () => Apple('tell app "Finder" to if (count of items in trash) > 0 then empty trash'),
	win32  : () => {
		return new Promise((resolve, reject) => {
			Exec(Path.join(__dirname, '..', 'lib', 'empty-bin.exe'), (err, res) => {
				return err ? reject(err) : resolve(res);
			});
		});
	}
};


module.exports = empty[process.platform];
