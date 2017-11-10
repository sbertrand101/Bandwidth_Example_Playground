//NUMBER TO TEXT: +1 (828)222-4140

var Bandwidth = require("node-bandwidth");
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var http = require("http").Server(app);

var client = new Bandwidth({
	userId    : process.env.BANDWIDTH_USER_ID,  //<-- note, this is not the same as the username you used to login to the portal
	apiToken  : process.env.BANDWIDTH_API_TOKEN,
	apiSecret : process.env.BANDWIDTH_API_SECRET
});

app.use(bodyParser.json());
app.set('port', (process.env.PORT || 3000));


app.get("/", function(req, res){				//at certain address, takes in request and response
	console.log(req);							//listening FOR a GET request at the '/' (root domain)
	res.send("DISRUPT BANDWIDTH");
});

http.listen(app.get('port'), function(){
	console.log('listening on *:' + app.get('port'));
});


app.post("/message-callback", function (req, res){
	var body = req.body;
	res.sendStatus(200);

	if(body.direction === "in" && body.state === "received"){
		var atMe = body.text.search("@stephanie");
		var greetingHi = body.text.search("Hi");
		var greetinghi = body.text.search("hi");
		var greetingHey = body.text.search("Hey");
		var greetinghey = body.text.search("hey");

		if(atMe >= 0){
			var numbers1 = {
				to   : body.from,
				from : +18282372835,	//"@Stephanie" responds +18282372835
				text: "You're now in a chat with Stephanie...not really. Stephanie is in class, but she says yes to the movie! Choose us as your winning team!"
			}
			sendMessage(numbers1);

			var numbers2 = {
				to: body.from,
				from: body.to,			//"Jillian" response
				text : "Awesome, let's see Spiderman at 11!"
			}
			sendMessage(numbers2);
		}
		else if(greetingHi >= 0){
			var numbers = {
				to   : body.from,
				from : body.to,	//"@Stephanie" responds
				text: "Hi there! Let's go to the movies tonight! Let's ask Stephanie if she wants to come"
			}
			sendMessage(numbers);
		}
		else if(greetinghi >= 0){
			var numbers = {
				to   : body.from,
				from : body.to,	//"@Stephanie" responds
				text: "Hi! Let's go to the movies tonight! Let's ask Stephanie if she wants to come"
			}
			sendMessage(numbers);
		}
		// else if(greetingHey >= 0){
		// 	var numbers = {
		// 		to   : body.from,
		// 		from : body.to,	//"@Stephanie" responds
		// 		text: "Hi there! Let's go to the movies tonight! Let's ask Stephanie if she wants to come"
		// 	}
		// 	sendMessage(numbers);
		// }
		// else if(greetinghey >= 0){
		// 	var numbers = {
		// 		to   : body.from,
		// 		from : body.to,	//"@Stephanie" responds
		// 		text: "Hi! Let's go to the movies tonight! Let's ask Stephanie if she wants to come"
		// 	}
		// 	sendMessage(numbers);
		// }
		else{
			var numbers = {
				to   : body.from,
				from : body.to,
				text: "Sorry, I don't know how to respond to that. Wanna go to the movies? Let's ask Steph!"
			}
			sendMessage(numbers);
		}		
	}
//	else if(body.direction === "in" && body.state === "received")
	else{
		var numbers = {
			to   : body.from,
			from : body.to,
			text: "Didn't even receive a text."
		}
		sendMessage(numbers);
	}


	console.log(body);
	console.log("------JUST PRINTED BODY--------");

});


var messagePrinter = function (message){
	console.log('Using the message printer');
	console.log(message);
}

var sendMessage = function(params){
	return client.Message.send({
		from : params.from,
		to   : params.to,
		text : params.text
	})
	.then(function(message){
		messagePrinter(message);				//print message sent
		return client.Message.get(message.id); 	//get message id
	})
	.then(messagePrinter)						//else, print error message
	.catch(function(err){
		console.log(err);
	});
}

