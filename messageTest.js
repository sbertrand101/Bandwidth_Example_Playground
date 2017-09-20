var Bandwidth = require("node-bandwidth");
var client = new Bandwidth({
    userId    : "u-h5pfhxsbwhwc5sg6inak3my",
    apiToken  : "t-7fmk5furqa4lxkt6pkgdefq",
    apiSecret : "vs6vzet3lakjf2mwju5bqga4otyy7frqoanmsiq"
});
var message = {
    from: "+18282224140", // <-- This must be a Bandwidth number on your account
    to: "+18286385873",
    text: "Thank you for subscribing to Unicorn Enterprises!",
    callbackUrl: "https://sdfhoiuebvasdfi.com/",
    callbackTimeout: "2000",
    fallbackUrl: "https://requestb.in/1fiokod1"
};

client.Message.send(message)
.then(function(message) {
    console.log("Message sent with ID " + message.id);
})
.catch(function(err) {
    console.log(err.message);
});