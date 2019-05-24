
var express = require('express');
var exphbs = require('express-handlebars');
var MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
var dateTime = require('node-datetime');
var Pusher = require('pusher');

// Inicialización Express
var app = express();
app.use(express.static('public'));
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Inicialización Mongo
const url = 'mongodb://localhost:27017';
const dbName = 'parcial2';
const client = new MongoClient(url);

// Inicialización Pusher
var pusher = new Pusher({
    appId: '788469',
    key: '48aa33fe9a6470da8fd8',
    secret: '552daf810dcce5d42fba',
    cluster: 'us2',
    encrypted: true
});

app.get('/', function (request, response) {
    response.render('home');
});

app.get('/paginaa', function (request, response) {
    insertarVisita(response, 'paginaa', 'Página A');
});

app.get('/paginab', function (request, response) {
    insertarVisita(response, 'paginab', 'Página B');
});

app.get('/paginac', function (request, response) {
    insertarVisita(response, 'paginac', 'Página C');
});

app.get('/admin', function (request, response) {
    obtenerVisitas(response, 'admin');
});

function insertarVisita(response, pagina, paginaTexto) {
    client.connect(function (err) {
        assert.equal(null, err);
        const db = client.db(dbName);
        const collection = db.collection('visitas');
        let fch = dateTime.create();
        let fecha = fch.format('d-m-Y');
        let hora = fch.format('H:M:S');
        let visita = {
            pagina: paginaTexto,
            fecha: fecha,
            hora: hora
        };
        collection.insertOne(visita, function (err) {
            assert.equal(err, null);
            enviarMensaje(response, pagina);
        });
    });
}

function obtenerVisitas(response, pagina) {
    client.connect(function (err) {
        assert.equal(null, err);
        const db = client.db(dbName);
        const visitas = db.collection('visitas');
        visitas.find({}).sort({_id:-1}).toArray(function (err, docs) {
            assert.equal(err, null);
            let visitasA = 0;
            let visitasB = 0;
            let visitasC = 0;
            docs.forEach(visita => {
                if (visita.pagina == 'Página A') {
                    visitasA += 1;
                } else if (visita.pagina == 'Página B') {
                    visitasB += 1;
                } else if (visita.pagina == 'Página C') {
                    visitasC += 1;
                } else {
                    // Nada
                }
            });
            contexto = {
                visitaA: visitasA,
                visitaB: visitasB,
                visitaC: visitasC,
                visitas: docs
            };
            response.render(pagina, contexto);
        });
    });
}

function enviarMensaje(response, pagina){
    client.connect(function (err) {
        assert.equal(null, err);
        const db = client.db(dbName);
        const visitas = db.collection('visitas');
        visitas.find({}).sort({_id:-1}).toArray(function (err, docs) {
            assert.equal(err, null);
            let visitasA = 0;
            let visitasB = 0;
            let visitasC = 0;
            docs.forEach(visita => {
                if (visita.pagina == 'Página A') {
                    visitasA += 1;
                } else if (visita.pagina == 'Página B') {
                    visitasB += 1;
                } else if (visita.pagina == 'Página C') {
                    visitasC += 1;
                } else {
                    // Nada
                }
            });
            contexto = {
                visitaA: visitasA,
                visitaB: visitasB,
                visitaC: visitasC,
                visitas: docs
            };
            pusher.trigger('admin', 'agregar-visita', contexto);
            response.render(pagina);
        });
    });
}

console.log("Servidor iniciado...");
app.listen(3000);