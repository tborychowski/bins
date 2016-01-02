'use strict';

const OS = require('os');
const FS = require('fs');
const Path = require('path');
const Exec = require('child_process').exec;


function getPath (disk) {
	let path = Path.join(disk, '$Recycle.bin');
	let subs;
	try { subs = FS.readdirSync(path); }
	catch (e) {}
	if (!subs || !subs.length) return path;

	return subs
		.map(p => Path.join(path, p))
		.filter(p => {
			try { FS.readdirSync(p); return true; }
			catch(e) { return false; }	// ignore if cannot access
		})[0];
}

function getItemCount (bin) {
	return new Promise(resolve => {
		FS.readdir(bin.path, (err, items) => {
			bin.items = Math.floor(err ? 0: items.length / 2);
			return resolve(bin);
		});
	});
}

function getSize (bin) {
	return new Promise((resolve, reject) => {
		Exec('dir /-c ' + bin.path + '\\$R*', (err, stdout) => {
			if (err) return reject(err);
			let oar = ('' + stdout).trim().split(OS.EOL);
			let line = oar[oar.length - 2];
			if (line) line = line.trim().replace(/.+\s+(\d+) bytes/ig, '$1');
			bin.size = bin.items ? parseInt(line, 10) : 0;
			return resolve(bin);
		});
	});
}

module.exports = {
	getPath,
	getSize,
	getItemCount
};
