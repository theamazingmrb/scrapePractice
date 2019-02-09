const rp = require('request-promise');
const url = 'https://losangeles.craigslist.org/search/apa?query=mid+city&max_price=2000&availabilityMode=0&pets_dog=1&sale_date=all+dates';
const cheer = require('cheerio');




function livingSpace(siteAddress, title, price, bedrooms) {
	this.siteAddress = siteAddress;
	this.title = title;
	this.price = price;
	this.bedrooms = bedrooms;

}

rp(url)
	.then( html => {


		const apps = {};

		for(let i=0; i < 20; i++){

			 siteAddress = (cheer('p.result-info > a', html)[i].attribs.href)
			 // items.price = (cheer('p.result-info > span'))

			 title = cheer('p.result-info > .result-title', html)[i].children[0].data
	         price = cheer('.result-price', html)[i].children[0].data
	         // items.bedrooms = cheer('.housing', html)[0].children[0].data
			 
		
	         let bed = '';
			 cheer('.housing', html)[i].children[0].data.split('').map((letter, index) => {
			 	if( letter != ' ' && letter != '-' && letter != '\n'){ 
			 		bed += letter
			 	}	
			 })



			 apps[i] = new livingSpace(siteAddress,title,price,bed)

			 console.log(apps)

		};
	
	})
	.catch( err => {
		console.log(err)
	})




		// const urls = [];
		// for(let i=0; i < 45; i++) {
		// 	urls.push(cheer('big > a', html)[i].attribs.href);
		// }
		// console.log(urls)



		// 		function livingSpace(siteAddress, title, price, bedrooms) {
		// 	this.siteAddress = siteAddress;
		// 	this.title = title;
		// 	this.price = price;
		// 	this.bedrooms = bedrooms;

		// }

		
		// const items = {title: '', siteAddress: '', bedrooms: '', price: ''};

		//  items.siteAddress = (cheer('p.result-info > a', html)[0].attribs.href)
		//  // items.price = (cheer('p.result-info > span'))

		//  items.title = cheer('p.result-info > .result-title', html)[0].children[0].data
  //        items.price = cheer('.result-price', html)[0].children[0].data
  //        // items.bedrooms = cheer('.housing', html)[0].children[0].data
		 
	
  //        let bed = '';
		//  cheer('.housing', html)[0].children[0].data.split('').map((letter, index) => {
		//  	if( letter != ' ' && letter != '-' && letter != '\n'){ 
		//  		bed += letter
		//  	}	
		//  })


		//  var housing1 = new livingSpace((cheer('p.result-info > a', html)[0].attribs.href), cheer('p.result-info > .result-title', html)[0].children[0].data, cheer('.result-price', html)[0].children[0].data, bed)

		//  console.log(housing1)