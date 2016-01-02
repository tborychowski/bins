'use strict';

const drivelist = require('drivelist');
const bytes = require('bytes');
const handlers = {
	win32: require('./bin-win32'),
	linux: require('./bin-linux'),
	// darwin: require('./bin-darwin')
};
const Bin = handlers[process.platform];


function getBins () {
	return new Promise((resolve, reject) => {
		drivelist.list((err, disks) => {
			if (err) return reject(err);
			disks = disks
				.filter(d => !!d.mountpoint)
				.map(d => {
					return { mountpoint: d.mountpoint, path: Bin.getPath(d.mountpoint) };
				});
			resolve(disks);
		});
	});
}


function getStats (bins) {
	let sizes = bins.map(bin => Bin.getItemCount(bin).then(Bin.getSize));
	return Promise.all(sizes);
}


function total (bins) {
	let size = bins.reduce((pv, cv) =>  pv + cv.size, 0);
	let items = bins.reduce((pv, cv) =>  pv + cv.items, 0);
	return { size, items, hsize: bytes(size), bins };
}


module.exports = {
	get: () => getBins().then(getStats),
	total
};
