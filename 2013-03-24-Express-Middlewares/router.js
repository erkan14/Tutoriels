// --------------------------------------------------------------------------
// Configuration d'Express

var express = require('express');
const app   = express();

// On définie les middlewares qui seront en charge de traiter toutes les requêtes
// L'ordre de définition des middlewares est important (middleware appelés les uns après les autres)
app.configure(function() {

      app.use(express.bodyParser());   // Permet de parser les messages envoyés par le client (req.body défini)
      app.use(app.router);             // Router (requetes app.VERB, VERB = GET, POST ...)

}).listen(1337);

// On capture l'accès au lien /monLien (méthode GET)
app.get('/monLien', function(req, res, next){
   res.send('Détecté : /monLien | méthode GET');
});

// On capture l'accès au lien /monLien (méthode POST)
app.post('/monLien', function(req, res, next){
   res.send('Détecté : /monLien | méthode POST');
});

// On capture l'accès au lien /monLien2 (méthode GET, POST, PUT, DELETE)
app.all('/monLien2', function(req, res, next){
   res.send('Détecté : ' + req.route.path + ' | Protocole ' + req.route.method);
});

console.log('+---------------------------------------------------+');
console.log('|               Test Router EXPRESS 3.0             |');
console.log('+---------------------------------------------------+');
console.log('');
console.log('Serveur HTTP  : http://localhost:1337/');
console.log('');
