var express = require('express');
var app = express();
var request = require('request');
const bodyParser = require('body-parser');

const twilio = require('twilio')

require('dotenv');
const accountSid = "AC85aa1607823114fab149a3e8c26ad443";
const authToken = "f01014fa0fc7ac2723e6c81515038c07" ;
const client = require('twilio')(accountSid, authToken);
const MessagingResponse = require('twilio').twiml.MessagingResponse;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));



app.post('/incoming', (req, res) => {
  
  const twiml = new MessagingResponse();
  if(req.body.Body.toLowerCase().trim()!="hi" && req.body.Body.toLowerCase().trim()!="hello" && req.body.Body.toLowerCase().trim()!="test" && req.body.Body.toLowerCase().trim()!="help"){
  request('https://coronavirus-19-api.herokuapp.com/countries/'+req.body.Body, function (error, response, body) {
    body = JSON.parse(body)
    console.log(body);
    
   if (body == '') {
      body = body
    }

    const msg = twiml.message(body['country'] + '\n\n' + body['todayCases']+ '\n\n' +body['todayDeaths']+ '\n\n' +body['cases']+ '\n\n' +body['active']+ '\n\n' +body['deaths']+ '\n\n' +body['recovered']+ '\n\n' +body['critical'])
    res.writeHead(200, { 'Content-Type': 'text/xml' })
    res.end(twiml.toString())})}
  else{
    var msg = twiml.message(`*Hey 👋*
.
Try it out - send me anything you want to know about about covid statistics in your country`)
    res.writeHead(200, {'Content-Type': 'text/html'});
  res.end(twiml.toString());
  }
  console.log(req.body)
});

app.post('/check', function(req, res) {
  console.log(req.body.Body)
});
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});


app.listen(process.env.PORT, () => {
    console.log("Server is listening on Port:", process.env.PORT);
  });