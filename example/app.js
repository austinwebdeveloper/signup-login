var loopback = require("signup-login-module");
let bodyParser = require('body-parser')
var path = require('path');
let mongoose = require('mongoose')
var api = require('./routes/api')
var index = require('./routes/index');
var http = require('http');

var dbConfig = {"name":"","options":{

        "host": "ds159180.mlab.com",
        "port": 59180,
        "url": "",
        "database": "heroku_6mwrhsmk",
        "password": "efg45fou5nnj8t27nq7leuhv7j",
        "user": "heroku_6mwrhsmk",
        "connector": "mongodb" 
    }};

var database = new loopback.datasource(dbConfig);
mongoose.connect("mongodb://heroku_6mwrhsmk:efg45fou5nnj8t27nq7leuhv7j@ds159180.mlab.com:59180/heroku_6mwrhsmk")
var port = new loopback.port(5050); 

var modelConfig = {

    "name": "Student",
    "base": "User",
    "properties": {
        "email": {
            "type": "string",
            "required": true,
			"lowercase": true
        },
        "firstName": {
            "type": "string"
        },
        "lastName": {
            "type": "string"
        },
        "fullName":{
            "type":"string"
        },
        "userName": {
            "type": "string"
        },
        "password": {
            "type": "string",
            "required": true
        },
        "phone": {
            "type": "number"
        }
    }
};
var model = new loopback.model(modelConfig);



var app= loopback.app;

app.set('views', (__dirname + '/views'));
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

 
app.use('/', index);
app.use('/api', api); 
app.start()

module.exports = app;