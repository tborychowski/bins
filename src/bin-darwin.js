'use strict';

const OS = require('os');
const FS = require('fs');
const Path = require('path');
const Exec = require('child_process').execFile;


function getPath (disk) {
	let uid = process.getuid(), homedir = OS.homedir(), path;
	if (disk === '/') path = Path.join(homedir, '.Trash');
	else path = Path.join(disk, '.Trashes', uid);
	return path;
}

function getItemCount (bin) {
	return new Promise(resolve => {
		FS.readdir(bin.path, (err, items) => {
			bin.items = (err ? 0: items.length);
			return resolve(bin);
		});
	});
}

function getSize (bin) {
	return new Promise((resolve, reject) => {
		Exec('du', ['-sk', bin.path], (err, stdout) => {
			if (err) return reject(err);
			bin.size = parseInt(('' + stdout).trim().split('\t')[0], 10);
			bin.size = bin.items ? bin.size * 1024 : 0;
			return resolve(bin);
		});
	});
}


module.exports = {
	getPath,
	getSize,
	getItemCount
};
