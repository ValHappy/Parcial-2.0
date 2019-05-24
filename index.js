
var express = require('express');
var exphbs = require('express-handlebars');
var MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
var dateTime = require('node-datetime');

// Inicialización Express
var app = express();
app.use(express.static('public'));
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Inicialización Mongo
const url = 'mongodb://localhost:27017';
const dbName = 'parcial2';
const client = new MongoClient(url);

app.get('/', function (request, response) {
    response.render('home');
});

app.get('/paginaa', function (request, response) {
    insertarVisita(response, 'paginaa');
});

app.get('/paginab', function (request, response) {
    insertarVisita(response, 'paginab');
});

app.get('/paginac', function (request, response) {
    insertarVisita(response, 'paginac');
});

function insertarVisita(response, pagina) {
    client.connect(function (err) {
        assert.equal(null, err);
        const db = client.db(dbName);
        const collection = db.collection('visitas');
        var fch = dateTime.create();
        var fecha = fch.format('d-m-Y');
        var hora = fch.format('H:M:S');
        var visita = {
            pagina: pagina,
            fecha: fecha,
            hora: hora
        };
        collection.insertOne(visita, function (err) {
            assert.equal(err, null);
            response.render(pagina);
        });
    });
}

console.log("Servidor iniciado...");
app.listen(3000);