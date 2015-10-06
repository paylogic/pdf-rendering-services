var phantom = require('phantom');
var request = require('request');
var crypto = require('crypto');
var fs = require('fs');
var child_process = require('child_process');

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
                    request.get("http://localhost/index/background.pdf").pipe(fs.createWriteStream('./tmp/background.pdf').on('finish', function(){
                        child_process.execSync("pdftk ./tmp/background.pdf background ./tmp/" + filename + " output ./tmp/output.pdf");
                        fs.createReadStream("./tmp/output.pdf").pipe(request.put("http://localhost/index/populated/" + filename));
                        fs.unlinkSync("./tmp/" + filename);
                        fs.unlinkSync("./tmp/output.pdf");
                        fs.unlinkSync("./tmp/background.pdf");
                        cb("http://localhost/index/populated/" + filename);
                    }));
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