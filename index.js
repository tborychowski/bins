'use strict';

const list = require('./src/list');
const empty = require('./src/empty');

module.exports = { list, empty };



list.get()
	.then(bins => {
		// console.log(1, bins);
		return bins;
	})
	.then(list.total)
	.then(bins => {
		console.log(2, bins);
	})
	.catch(console.error.bind(console));



// empty().then(res => {
// 	console.log('empty', res);
// });
