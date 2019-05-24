
var express = require('express');
var exphbs = require('express-handlebars');

var app = express();

app.use(express.static('public'));
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.get('/', function (request, response) {
    response.render('home');
});

app.get('/paginaa', function (request, response) {
    response.render('paginaa');
});

app.get('/paginab', function (request, response) {
    response.render('paginab');
});

console.log("Servidor iniciado...");
app.listen(3000);