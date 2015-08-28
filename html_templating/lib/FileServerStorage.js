var fs = require('fs')
var request = require('request');


function FileServerStorage(){};

FileServerStorage.prototype._handleFile = function _handleFile (req, file, cb) {
	if(file.fieldname == "background" || file.fieldname == "template"){
		file.path = 'http://localhost/' + req.params.templateName + '/' + file.fieldname;
	}else{
		file.path = 'http://localhost/' + req.params.templateName + '/' + file.fieldname + '/' + file.originalname;
	}
    file.stream.pipe(request.put(file.path), cb(null, file));
}

//If something went wrong this function tries to remove the file from the fileserver
FileServerStorage.prototype._removeFile = function _removeFile (req, file, cb) {
	console.log('Something went wrong, trying to remove file: ' + file.path);
  	request.del(file.path, cb);
}

module.exports = function () {
  return new FileServerStorage()
}