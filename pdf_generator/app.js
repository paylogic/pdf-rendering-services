var express = require('express');
var phantom = require('phantom');
var bodyParser  = require('body-parser');
var phantomController = require('./lib/phantom_renderer');

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/:url', function(req, res){
    phantomController.renderPdf(res, {url: "http://localhost/index/populated/" + req.params.url});
    res.sendStatus(200);
});

var server = app.listen(3002, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("Example app listening at http://%s:%s", host, port);
})