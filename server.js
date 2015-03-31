var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    session = require('cookie-session'),
    homeRoutes = require('./lib/routes/home');

app.use(session({
    keys: [process.env.SESSION_KEY]
}));



app.use('/', homeRoutes);

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use(express.static(__dirname + '/public'));
app.use( bodyParser.json() );

app.listen(process.env.PORT || 3000);

module.exports = app;