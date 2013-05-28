var bot = require('nodemw');
exports.info = function(req,res){
  var client = new bot({
    server: 'en.wikipedia.org',  // host name of MediaWiki-powered site
    path: '/w',                  // path to api.php script
    debug: false                // is more verbose when set to true
  });
  client.getArticle('New York',function (response){
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(response);
    res.end();
  });
}