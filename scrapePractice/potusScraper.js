const rp = require('request-promise');
const url = 'https://en.wikipedia.org/wiki/List_of_Presidents_of_the_United_States';
const cheer = require('cheerio');

rp(url)
	.then( html => {
		console.log(cheer('big > a', html).length);
		console.log(cheer('big > a', html));
	})
	.catch( err => {
		console.log(err)
	})