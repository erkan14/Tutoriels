// ========================================================================== \\
// | Tutoriel : Form Multi Login - Partie 1 : Frond-End                     | \\
// -------------------------------------------------------------------------- \\
// |                                                                      ♥ | \\
// | Configuration des routages Express (app.VERB)                        ♥ | \\
// +========================================================================+ \\


var express    = require('express');


module.exports = function(app){

	// --------------------------------------------------------------------------------------
	// Pages de l'application

	// Page d'accueil
	app.get('/', function(req, res, next){
		
		res.render('welcome');

	});

	// Page d'accueil - Erreur lors de la connexion
	app.get('/error', function(req, res, next){

		// On génère la vue en indiquant à HoganJS l'erreur à afficher dans la vue
		res.locals = { error : 'Login ou mot de passe incorrecte. Veuillez réessayer.' };
		return res.render('welcome');

	});

	// Page protégée
	app.get('/private', function(req, res, next){

		// On génère la vue en indiquant à HoganJS les infos de l'user à afficher dans la vue
		res.locals = { 'user' : { 'login' : 'John Doe', 'nbConn' : '1', 'type' : 'interne' } };
		return res.render('private');

	});

	// Demande de déconnexion
	app.get('/logout', function(req, res){

		res.redirect('/');

	});

	// --------------------------------------------------------------------------------------
	// ROUTES : Demande de connexion | Stratégie "local"

	// Demande de connexion | Stratégie "local"
	app.post('/auth/local', function(req, res, next) { 
		res.redirect('/private');
	});

	// --------------------------------------------------------------------------------------
	// ROUTES : Demandes de connexion | Stratégie "OpenID"

	// Demande de connexion | Stratégie "OpenID"
	app.post('/auth/openid', function(req, res, next) { 
		res.redirect('/private');
	});

	// --------------------------------------------------------------------------------------
	// ROUTES : Demandes de connexion | Stratégie "OpenID Google"

	// Demande de connexion | Stratégie "OpenID Google"
	app.get('/auth/google', function(req, res, next) { 
		res.redirect('/private');
	});

	return app;

}
