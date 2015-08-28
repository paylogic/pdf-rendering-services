var express = require('express');
var request = require('request');
var path = require('path');
var bodyParser = require('body-parser');

var app = express();

//Routes
var templateRouting = require('./routes/template');
app.use('/template', templateRouting);

var server = app.listen(3001, 'localhost', function () {
    console.log("PDF Templating app is listening at http://%s:%s", server.address().address, server.address().port);
});