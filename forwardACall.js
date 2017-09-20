//Number to call: +1828-307-2634

var Bandwidth = require("node-bandwidth");
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var http = require("http").Server(app);

var client = new Bandwidth({
    userId    : "u-h5pfhxsbwhwc5sg6inak3my",
    apiToken  : "t-7fmk5furqa4lxkt6pkgdefq",
    apiSecret : "vs6vzet3lakjf2mwju5bqga4otyy7frqoanmsiq"
});

app.use(bodyParser.json());
app.set('port', (process.env.PORT || 4000));

app.get("/", function(req, res){                //at certain address, takes in request and response
    console.log(req);                           //listening FOR a GET request at the '/' (root domain)
    res.send("My Recording Audio Example");
});

http.listen(app.get('port'), function(){
    console.log('listening on *:' + app.get('port'));
});

app.post("/call-callback", function (req, result){
    var body = req.body;
    result.sendStatus(200);                         //letting the invoker sending the push request say 'we're good' 

    if (body.eventType === "answer"){
        client.Call.speakSentence(body.callId, "Hello, how are you today?")
        .then(function (res) {})
        .catch(function (err){
            console.log(err);
        }); 
    }
    else if (body.eventType === "speak" && body.state === "PLAYBACK_STOP"){     
        return client.Call.enableRecording(body.callId)
        .then(function (res) {
            console.log("---------Recording---------");
        })
        .catch(function(err){
            console.log(err);
            console.log("Wasn't able to start recording");
        });
    }
    else{
        console.log(body);
        console.log("----------------")
    }
});