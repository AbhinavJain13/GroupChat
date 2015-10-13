var express = require('express');

app = express();

app.use(express.static(__dirname+"/static"));

app.set('views', (__dirname+"/views"));

app.set('view engine', 'ejs');

var server = app.listen(8000,function() {
	console.log("Listening on port 8000");
})

var route = require('./routes/routes.js')(app, server);
