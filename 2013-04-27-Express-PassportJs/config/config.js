// ========================================================================== \\
// | Tutoriel : Form Multi Login avec PassportJS et Bootstrap/Hogan Twitter | \\
// -------------------------------------------------------------------------- \\
// |                                                                      ♥ | \\  
// | Configuration des middleswares                                       ♥ | \\
// +========================================================================+ \\


var express  = require('express');
var passport = require('passport');
var hogan    = require('hogan-express');


module.exports = function(app){

	// --------------------------------------------------------------------------
	// Configuration de HoganJs Twitter

	app.configure(function(){
		app.set('view engine', 'html');                     // Fichiers *.HTML correspondent à des vues à générer
		app.engine('html', hogan);                          // Fichiers *.HTML rendu via HoganJs
		app.set('layout', 'layout');                        // Vue globale par défaut (views/layout.html)
		app.set('views', __dirname + '/../views')           // Chemin vers les fichiers templates (répertoire views)
		//app.enable('view cache');                         // Mise en cache des vues (true par défaut en production)
	});

	// --------------------------------------------------------------------------
	// Configuration d'Express
	
	// On définie les middlewares qui seront en charge de traiter toutes les requêtes
	// L'ordre de définition des middlewares est important (middleware appelés les uns après les autres)
	app.configure(function() {

		app.use(express.logger('dev'));                     // Affichage des requêtes sur la console ('default', 'short', 'tiny', 'dev')
		app.use(express.static(__dirname + '/../public'));  // Répertoire des fichiers statiques (Image, CSS, etc), desservie sans autorisation

		// Gestion des sessions pour l'authentification
		app.use(express.cookieParser());
		app.use(express.session({ secret: 'keyboard cat' }));

		// PassPort pour l'authentification
		// On a placé le middleware STATIC avant Passport pour ne pas provoquer l'appel de deserializeUser pour les ressources statiques
		// Par contre, chaque vue HTML (fournit par le middleware ROUTER défini plus bas) devra passer l'étape d'authentification
		app.use(passport.initialize());                     // Initialisation de PassPort
		app.use(passport.session());                        // Session stockant l'utilisateur connecté
		
		app.use(express.bodyParser());                      // Recupération des messages envoyés par le client (req.body)
		app.use(app.router);                                // Router (requetes app.VERB, VERB = GET, POST ...)
		
		app.use(express.errorHandler({dumpExceptions: true, showStack: true})); // Si une erreur 500 intervient, Express retourne un rapport au format HTML
		
	});

	return app;

};
