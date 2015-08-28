var httpProxy = require('http-proxy');
var http = require('http');
var url = require('url');

var proxy = httpProxy.createProxyServer({});
 
var server = http.createServer(function(req, res) {
    var service = url.parse(req.url).pathname.split('/')[1];
    req.url = url.parse(req.url).pathname.replace(service + "/", "");
    switch(service){
        case 'pdf_generator':
            proxy.web(req, res, {target: 'http://127.0.0.1:3002'});
            break;
        case 'html_templating':
            proxy.web(req, res, {target: 'http://127.0.0.1:3001'});
            break;
        default:
            res.statusCode = 404;
            res.end('"' + service + '" service not found');
    }
});

//Error checking
proxy.on('error', function (err, req, res) {
    console.log(err);
    res.writeHead(500, {
        'Content-Type': 'text/plain'
    });
    res.end('Something went wrong. And we are reporting a custom error message.');
});
 
console.log("Services manager listening on port 3000");
server.listen(3000);