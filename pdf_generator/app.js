var express = require('express');
var phantom = require('phantom');
var bodyParser  = require('body-parser');
var phantomController = require('./lib/phantom_renderer');

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('*', function(req, res){
	console.log(req.url);
    phantomController.renderPdf(res, {url: "http://localhost/" + req.url}, function(path){
    	res.status(201).json({path: path});
    });
});

var server = app.listen(3002, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("PDF Generator listening at http://%s:%s", host, port);
})