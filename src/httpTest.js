var HTTPSnippet = require('httpsnippet');


var snippet = new HTTPSnippet({
    method: 'GET',
    url: 'http://mockbin.com/request'
});

console.log(snippet.convert('node'));