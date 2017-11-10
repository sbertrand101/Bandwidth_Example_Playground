//HOW TO FORWARD A CALL
/*
Forwards a call by bridging together an incoming phone call to an outgoing phone call.
When an incoming call is initiated, meaning someone calls the BW phone number, 
the BW number makes an outgoing call to another number.
These two calls then get bridged to connect the callers on the other side of the BW number.
*/

var Bandwidth = require("node-bandwidth");
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var http = require("http").Server(app);


// Go to dev.bandwidth.com, look under Account -> API Information -> Credentials OR .zsrh file
var client = new Bandwidth({
    userId    : process.env.BANDWIDTH_USER_ID,
    apiToken  : process.env.BANDWIDTH_API_TOKEN,
    apiSecret : process.env.BANDWIDTH_API_SECRET
});



//REQUIRED CODE
app.use(bodyParser.json());

app.set('port', (process.env.PORT || 3000));
http.listen(app.get('port'), function(){
    console.log('listening on *: ' + app.get('port'));
});

const getBaseUrlFromReq = (req) => {
    return 'http://' + req.hostname;
};
app.get("/", function (req, res) {
    console.log(req); 
    res.send("Bandwdith_Forward_A_Call");
});

//PHONE NUMBERS
let toNumber = "+19198251926"; //test by calling conference room
//----Bandwidth Number to call: (704) 266-3397 to test code-----

//OUTBOUND CALLS
app.post('/out-call', function (req, res) {         
    var this_url2 = getBaseUrlFromReq(req);
    if (req.body.eventType === 'answer') {
        console.log("Incoming CallId: " + req.body.tag);
        console.log("Outgoing CallId: " + req.body.callId);
        console.log(req);
        client.Bridge.create({
            bridgeAudio: true,
            callIds : [req.body.tag, req.body.callId]
        })
        .then(function (bridge) {
            console.log("BridgeId: " + bridge.id);
            console.log("---Call has been bridged----");
        })
        .catch(function(err){
            console.log(err);
            console.log("----Could not bridge the call----");
        });
    }
    else if (req.body.eventType === "hangup"){                  
        console.log(req.body);
        console.log("----Your call has hungup----");
    }
    else{
        console.log(req.body);
    }
});

//INBOUND CALLS
app.post('/in-call', function (req, res) {             
    if (req.body.eventType === "incomingcall"){
        console.log("Incoming callId: " + req.body.callId);  
        var this_url1 = getBaseUrlFromReq(req);
        createCallWithCallback(req.body.to, this_url1, req.body.callId);
    }
    else{
        console.log(req.body);
    }
});

//Method to create outbound call with '/out-call' callback url, tag used to store inbound callId
var createCallWithCallback = function(FromBWnumber, this_url, inbound_callid){ 
    return client.Call.create({
        from: FromBWnumber,
        to: toNumber,
        callbackUrl: this_url + '/out-call',
        tag: inbound_callid
    })
    .then(function (call) {
        console.log("Outgoing call Id: " + call.callId);
        console.log(call);
        console.log("----Outbound call has been created----");
    })
    .catch(function(err){
        console.log(err);
        console.log("---Outbound call could not be created---");
    })
};




