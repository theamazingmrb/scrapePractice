var nodeMailer = require("nodemailer");
const rp = require("request-promise");
const url = "https://losangeles.craigslist.org/search/apa?postal=90019&max_price=1900&max_bedrooms=2&availabilityMode=0&pets_dog=1&sale_date=all+dates";
const cheer = require("cheerio");
var apps = {};
var htmlTemplate = "";

console.log("here now")

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

});