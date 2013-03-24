// Demo Express 3.0 et utilisation des middlewares
// -----------------------------------------------
// Les accès aux ressources :
//   * http://localhost:1337/				>> Ressource statique index.html
//   * http://localhost:1337/index.html		>> Ressource statique index.html
//   * http://localhost:1337/hello.txt		>> Ressource statique hello.txt	
// sont assurés par le middleware STATIC
// 
// Les accès aux pages :
//   * http://localhost:1337/monArticle/10	>> Envoi d'une réponse HTTP
//   * http://localhost:1337/dead/			>> Test de la provocation d'une erreur
//   * http://localhost:1337/deadHandler/	>> Test de la capture d'une erreur
//   * http://localhost:1337/rep/blablabla	>> Test de l'accès à une page quelconque
// sont assurés par le middleware ROUTER (et éventuellement middleware d'erreur)

// --------------------------------------------------------------------------
// Chargement de l'ensemble des modules

var express    = require('express');

// --------------------------------------------------------------------------
// Configuration d'Express

const app = express();
app.set('host', 'localhost');
app.set('port', 1337);

// On définie les middlewares qui seront en charge de traiter toutes les requêtes
// L'ordre de définition des middlewares est important (middleware appelés les uns après les autres)
app.configure(function() {
	
	// Définition des middlewares standard
	app.use(express.logger('dev'));						// Affichage des requêtes sur la console ('default', 'short', 'tiny', 'dev')
	app.use(express.bodyParser());      				// Permet de parser les messages envoyés par le client (req.body défini)
	app.use(express.methodOverride());					// Simulation PUT et DELETE via <input type="hidden" name="_method" value="put" />
	app.use(app.router);                            	// Router (requetes app.VERB, VERB = GET, POST ...)
	app.use(express.static(__dirname + '/public')); 	// Répertoire des fichiers statiques (page HTML, CSS, etc)
	
	// Définition des middlewares de gestion d'erreur
	app.use(demoErrorHandler); 												// Traitement des erreurs de type "demo" (voir "/deadHandler")
	app.use(express.errorHandler({dumpExceptions:true, showStack:true}));	// Si une erreur 500 intervient, Express retourne un rapport au format HTML
});


// --------------------------------------------------------------------------
// Configuration du middleware router
// Middleware un peu spécial qui permet la capture de liens
// Format app.VERB(<lien>, <callback>)
// Avec VERB = get, post, put, delete, all (= tous les types)

// Page d'accueil - Pour l'exemple, on trace le passage et indique à Express qu'on peut passer au module suivant
// "express.static" va rediriger automatiquement vers la ressource par défaut "index.html"
// Test : http://localhost:1337/
app.get('/', function(req, res, next){
	console.log("Accès à la racine du site");
	next(); // On ne traite pas cette requête, on passe au middleware suivant (express.static)
});

// On capture l'accès au lien /monArticle/ suivi d'un identifiant
// On retourne une réponse extra simple au navigateur pour l'exemple
// Test : http://localhost:1337/monArticle/10
app.get('/monArticle/:id', function(req, res, next){
	res.send('Article demandé : ' + req.params.id);
	// On pourrait immaginer la récupération d'un article depuis une base de données
	// Puis le retour d'une page WEB via un générateur de template (comme Jade, HoganJs, EJV, etc)
	// CF. app.engine(ext, callback) : http://expressjs.com/api.html#app.engine
});

// On capture tous les liens commencant par "rep"
// On redirige systématiquement vers la page d'accueil
// Test : http://localhost:1337/rep/blablabla
app.all('/rep/*', function(req, res, next){
	console.log("Redirection vers la page d'accueil");
	res.redirect('/');
});

// Lien pour provoquer une erreur
// le middleware d'erreur générique "express.errorHandler" va retourner au navigateur une erreur plus "propre"
// Test : http://localhost:1337/dead/
app.get('/dead', function(req, res){
	next(); // next pas défini
});

// Lien pour provoquer une erreur
// le dernier middleware "demoErrorHandler" va capturer l'erreur
// Test : http://localhost:1337/deadHandler/
app.get('/deadHandler', function(req, res, next){
	next({ "type" : "demo",  "monErreur" : "Test du lancement d'une erreur" }); // next pas défini
});


// --------------------------------------------------------------------------
// Configuration des middlewares d'erreur (Error-handling middleware)

// Un middleware de gestion d'erreur est une fonction définissant 4 paramètres (ERR, req, res, next)
// Utilisé si un middleware stantard plante ou appel next(<objet décrivant l'erreur>)

// Middlewares de gestion d'erreur de type "demo"
// Un middleware d'erreur DOIT être défini sur la base de 4 paramètres (sinon c'est un middleware standard)
function demoErrorHandler(err, req, res, next) {

	// On traite l'erreur
	if(err.type &&  err.type == 'demo'){
		console.log('Erreur Demo capturé', err.monErreur);
		res.send(500, err.monErreur);
		return;
	}
    
    // On ne traite pas l'erreur et passe au middleware d'erreur suivant
    console.log('Erreur pas traitée ici... On passe au handler suivant (express.errorHandler)');
	next(err);
    
}

// --------------------------------------------------------------------------
// Lancement du serveur

app.listen(app.get('port'));

console.log('+---------------------------------------------------+');
console.log('|                  Test EXPRESS 3.0                 |');
console.log('+---------------------------------------------------+');
console.log('');
console.log('Serveur HTTP  : http://' + app.get('host') + ':' + app.get('port') + '/');
console.log('');
