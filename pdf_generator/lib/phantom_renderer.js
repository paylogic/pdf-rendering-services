var phantom = require('phantom');
var request = require('request');
var crypto = require('crypto');
var fs = require('fs');

var session;

//Gets the phantomJS session, if it doesn't exist yet it creates a new one
getPhantomSession = function(cb) {
    if (!session) {
        phantom.create(function(_session){
            session = _session;
            return cb(session);
        });
    }else{
        return cb(session);
    }
};

exports.renderPdf = function(res, options, cb) {
    getPhantomSession(function(session){
        session.createPage(function(page) {
            page.open(options.url, function (status) {
                page.set('paperSize', { format : 'A4'});
                var filename = crypto.randomBytes(12).toString('hex') + '.pdf';
                page.render("./tmp/" + filename, function(){
                    page.close();
                    fs.createReadStream("./tmp/" + filename).pipe(request.put("http://localhost/index/populated/" + filename));
                    fs.unlinkSync("./tmp/" + filename);
                });
            }); 
        });
    });
};

//If the process exits, close PhantomJS process
process.on('exit', function(code, signal) {
    if(session){
        session.exit();
    }
});