var express = require("express");
var app = express();
var port = 8080;
var bodyParser = require("body-parser");
var request = require("request");
var cors = require('cors');

//configure the app to use bodyParser
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json());
app.use(cors());
app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-type, Accept, X-Access-Token, X-key");
  if(req.method === "OPTIONS") {
    res.status(200).end();
  } else {
    next();
  }
});

app.use(express.static(__dirname +'/../client'));
//Use GET reguest to get the data from the json file
app.get('/api/v1/data', function(req, res){
 request({url:'https://app.upguard.com/api/v1/nodes/6347/scan_details.json', 
   headers: {
    Authorization: 'Token token="50d16425888ab0798d5660d70e9aa43b92a54d5dc518cac5bd1f35a7fea3447633ca7606ace40bebc8f52a4639c0cfb49b855af47a9aa5098e97d75b51101bff"',
    contentType:"json"
   }
 },
  function(err, resp, body) {
    if (!err && resp.statusCode == 200) {
      var newBody = body;
      newBody = JSON.parse(newBody);
      newBody.data = JSON.parse(newBody.data)        
    }
    res.json(newBody);
});

})

app.listen(port, function() {
 console.log("i am running " + port);
})


module.exports = app;