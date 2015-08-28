var express = require('express');
var crypto = require('crypto');
var multer = require('multer');
var request = require('request');
var jade = require('jade');
var router = express.Router();

var storage = require('../lib/FileServerStorage.js')();

var upload = multer({storage: storage}).fields(
	[
		{name: 'js'},
		{name: 'background', maxCount: 1},
		{name: 'img'},
		{name: 'css'},
		{name: 'template', maxCount: 1},
	]
);

router.post('/:templateName', upload, function(req, res) {
	res.sendStatus(201);
});


var bodyParser = require('body-parser');

router.post('/:templateName/populate',bodyParser.json(), function(req, res) {
	var templateName = req.params.templateName
	request.get("http://localhost/" + templateName + "/template", function(error, response, body){
		if(response.statusCode != 200){
			res.sendStatus(response.statusCode);
		}else{
			var html = jade.compile(body)(req.body);
			var filename = crypto.createHash('md5').update(html).digest('hex');
			opts = {
				url: "http://localhost/" + templateName + "/populated/" + filename + ".html",
				body: html,
			}
			request.put(opts, function(error, response, body){
				res.sendStatus(201);
			});
		}
	});
});

module.exports = router;
