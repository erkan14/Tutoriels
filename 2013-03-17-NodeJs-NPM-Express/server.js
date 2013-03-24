// --------------------------------------------------------------------------
// Chargement de l'ensemble des modules
var express = require('express');

// --------------------------------------------------------------------------
// Configuration d'Express
const app = express();
app.set('host', 'localhost');
app.set('port', 1337);

// On définie les middlewares qui seront en charge de traiter toutes les requêtes
// L'ordre de définition des middlewares est important (appelés les uns après les autres)
app.configure(function() {
	app.use(express.logger('dev'));                 // Affichage des requêtes sur la console ('default', 'short', 'tiny', 'dev')
	app.use(express.bodyParser());                  // Permet de parser les messages envoyés par le client (req.body défini)
	app.use(app.router);                            // Router (requetes app.VERB, VERB = GET, POST ...)
	app.use(express.static(__dirname + '/public')); // Répertoire des fichiers statiques (page HTML, CSS, etc)
});

// --------------------------------------------------------------------------
// Configuration du middleware router (permet la capture de liens)
// Format app.VERB(<lien>, <callback>), avec VERB = [get, post, put, delete, all (= tous les types)]

// On capture l'accès au lien /monArticle/ suivi d'un identifiant
// On retourne une réponse extra simple au navigateur pour l'exemple
// Test : http://localhost:1337/monArticle/10
app.get('/monArticle/:id', function(req, res, next){
	res.send('Article demandé : ' + req.params.id);
	// On pourrait immaginer la récupération d'un article depuis une base de données
	// Puis le retour d'une page WEB via un générateur de template (comme Jade, HoganJs, EJV, etc)
	// CF. app.engine(ext, callback) : http://expressjs.com/api.html#app.engine
});

// --------------------------------------------------------------------------
// Lancement du serveur
app.listen(app.get('port'));
console.log('Serveur en écoute : ' + app.get('host') + ':' + app.get('port') + '/');
