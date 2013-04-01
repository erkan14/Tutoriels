// ========================================================================== \\
// | Tutoriel : Form Multi Login - Partie 1 : Frond-End                     | \\
// -------------------------------------------------------------------------- \\
// |                                                                      ♥ | \\  
// | Configuration des middleswares                                       ♥ | \\
// +========================================================================+ \\


var express  = require('express');
var hogan    = require('hogan-express');


module.exports = function(app){

	// --------------------------------------------------------------------------
	// Configuration de HoganJs Twitter

	app.configure(function(){
		app.set('view engine', 'html');						// Fichiers *.HTML correspondent à des vues à générer
		app.engine('html', hogan);							// Fichiers *.HTML rendu via HoganJs
		app.set('layout', 'layout');       					// Vue globale par défaut (views/layout.html)
		app.set('views', __dirname + '/../views')			// Chemin vers les fichiers templates (répertoire views)
		//app.enable('view cache');							// Mise en cache des vues (true par défaut en production)
	});

	// --------------------------------------------------------------------------
	// Configuration d'Express
	
	// On définie les middlewares qui seront en charge de traiter toutes les requêtes
	// L'ordre de définition des middlewares est important (middleware appelés les uns après les autres)
	app.configure(function() {

		app.use(express.logger('dev'));						// Affichage des requêtes sur la console ('default', 'short', 'tiny', 'dev')
		app.use(express.static(__dirname + '/../public')); 	// Répertoire des fichiers statiques (Image, CSS, etc)
		
		app.use(express.bodyParser());      				// Recupération des messages envoyés par le client (req.body)
		app.use(app.router);                            	// Router (requetes app.VERB, VERB = GET, POST ...)
		
		app.use(express.errorHandler({dumpExceptions: true, showStack: true})); // Si une erreur 500 intervient, Express retourne un rapport au format HTML
		
	});

	return app;

};
