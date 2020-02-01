var express = require("express"),
	path = require("path"),
	nodeMailer = require("nodemailer");
require("dotenv").config();
var app = express();
var port = 3000;
app.listen(port, function(req, res) {
	console.log("Server is running at port: ", port);
});
const rp = require("request-promise");
const url =
	"https://losangeles.craigslist.org/search/apa?postal=90019&max_price=1900&max_bedrooms=2&availabilityMode=0&pets_dog=1&sale_date=all+dates";
// const url = 'https://losangeles.craigslist.org/search/apa?query=mid+city&max_price=2000&availabilityMode=0&pets_dog=1&sale_date=all+dates';
//const url='https://losangeles.craigslist.org/search/apa?postal=90019&max_price=1900&max_bedrooms=2&availabilityMode=0&pets_dog=1&sale_date=all+dates';
const cheer = require("cheerio");
var apps = {};
var htmlTemplate = "";
// setInterval(logTest, 3000);

// function logTest(){
// 	console.log("Hey there every 300000 ms")
// }

function livingSpace(siteAddress, title, price, bedrooms) {
	this.siteAddress = siteAddress;
	this.title = title;
	this.price = price;
	this.bedrooms = bedrooms;
}

rp(url).then(html => {
	console.log("rp sent");

	for (let i = 0; i < 15; i++) {
		siteAddress = cheer("p.result-info > a", html)[i].attribs.href;

		title = cheer("p.result-info > .result-title", html)[i].children[0]
			.data;
		price = cheer(".result-price", html)[i].children[0].data;

		let bed = "";

		if (cheer(".housing", html)[i].children[0] != undefined) {
			cheer(".housing", html)
				[i].children[0].data.split("")
				.map((letter, index) => {
					if (letter != " " && letter != "-" && letter != "\n") {
						bed += letter;
					}
				});
		}

		console.log( i +  " ===== " + bed)

		apps[i] = new livingSpace(siteAddress, title, price, bed);

		if (
			apps[i].title.includes("STUDIO") ||
			apps[i].title.includes("Studio") ||
			apps[i].title.includes("studio")
		) {
			console.log("fo guck youself");
		} else {
			htmlTemplate += `<p> <span style="color:red;"> Site Adress:  </span> ${apps[i].siteAddress}<br/> Title: ${apps[i].title} <br/> Price : ${apps[i].price} <br/> Bedrooms: ${apps[i].bedrooms}</p>`;
		}
	}

	let myapps = htmlTemplate;

	console.log(myapps);

	console.log("GO TIME!!!!!!");

	let transporter = nodeMailer.createTransport({
		host: "smtp.gmail.com",
		port: 465,
		secure: true,
		auth: {
			user: process.env.DB_EMAIL_SENDER,
			pass: process.env.DB_EMAIL_PASSWORD
		}
	});

	let mailOptions = {
		from: `"Billie H" <${process.env.DB_EMAIL_RECIPIENT1}>`, // sender address
		to: `${process.env.DB_EMAIL_RECIPIENT1},${process.env.DB_EMAIL_RECIPIENT2}`, // list of receivers
		//  to: `${process.env.DB_EMAIL_RECIPIENT1}`,
		subject: "Apartment List for Today", // Subject line
		// html: '<div class="content">' +  myapps.toString() + '</div>'  // html body
		html: myapps
	};

	// transporter.sendMail(mailOptions, (error, info) => {
	// 	if (error) {
	// 		return console.log(error);
	// 	}
	// 	console.log("Message %s sent: %s", info.messageId, info.response);
	// 	res.render("index");
	// });
});

////////////////?WORKING SONSONSOSNONSONSONS .///////////////////
// rp(url)
// 	.then( html => {

// 		for(let i=0; i < 20; i++){

// 			 siteAddress = (cheer('p.result-info > a', html)[i].attribs.href)
// 			 // items.price = (cheer('p.result-info > span'))

// 			 title = cheer('p.result-info > .result-title', html)[i].children[0].data
// 	         price = cheer('.result-price', html)[i].children[0].data
// 	         // items.bedrooms = cheer('.housing', html)[0].children[0].data

// 	         let bed = '';
// 			 cheer('.housing', html)[i].children[0].data.split('').map((letter, index) => {
// 			 	if( letter != ' ' && letter != '-' && letter != '\n'){
// 			 		bed += letter
// 			 	}
// 			 })

// 			 apps[i] = new livingSpace(siteAddress,title,price,bed)
// 			 htmlTemplate += `<p> <span style="color:red;"> Site Adress:  </span> ${apps[i].siteAddress}<br/> Title: ${apps[i].title} <br/> Price : ${apps[i].price} <br/> Bedrooms: ${apps[i].bed} </p>`

// 		};

// 	  // let myapps = JSON.stringify(apps);

// 	//	let myapps = JSON.stringify(htmlTemplate);

// 		let myapps = htmlTemplate;

// 		console.log(myapps)

// 		console.log("GO TIME!!!!!!")

// 		    let transporter = nodeMailer.createTransport({
// 		      host: 'smtp.gmail.com',
// 		      port: 465,
// 		      secure: true,
// 		      auth: {
// 		          user: process.env.DB_EMAIL_SENDER,
// 		          pass: process.env.DB_EMAIL_PASSWORD
// 		      }
// 		  });
// 		  let mailOptions = {
// 		      from: `"Billie H" <${process.env.DB_EMAIL_RECIPIENT1}>`, // sender address
// 		      to: `${process.env.DB_EMAIL_RECIPIENT1},${process.env.DB_EMAIL_RECIPIENT2}`, // list of receivers
// 		    //  to: `${process.env.DB_EMAIL_RECIPIENT1}`,
// 		      subject: "Apartment List for Today", // Subject line
// 		     // html: '<div class="content">' +  myapps.toString() + '</div>'  // html body
// 		 	  html: myapps
// 		  };

// 		  transporter.sendMail(mailOptions, (error, info) => {
// 		      if (error) {
// 		          return console.log(error);
// 		      }
// 		      console.log('Message %s sent: %s', info.messageId, info.response);
// 		          res.render('index');
// 		      });

// 			})
// 			.catch( err => {
// 				console.log(err)
// 			})
