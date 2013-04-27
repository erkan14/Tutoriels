// ========================================================================== \\
// | Tutoriel : Form Multi Login avec PassportJS et Bootstrap/Hogan Twitter | \\
// -------------------------------------------------------------------------- \\
// |                                                                      ♥ | \\
// | Configuration des routages Express (app.VERB)                        ♥ | \\
// +========================================================================+ \\


var express    = require('express');
var passport   = require('passport');
var myPassport = require('./passport');


module.exports = function(app){

	// --------------------------------------------------------------------------------------
	// Pages de l'application

	// Page d'accueil - On redirige vers la page principale si l'utilisateur est déjà connecté
	app.get('/', function(req, res, next){

		if(myPassport.isAuthenticated(req)) res.redirect('/private');
		else res.render('welcome');

	});

	// Page d'accueil - Erreur lors de la connexion
	app.get('/error', function(req, res, next){

		// On génère la vue en indiquant à HoganJS l'erreur à afficher dans la vue
		res.locals = { error : 'Login ou mot de passe incorrecte. Veuillez réessayer.' };
		return res.render('welcome');

	});

	// Page protégée
	app.get('/private', myPassport.ensureAuthenticated, function(req, res, next){

		// On génère la vue en indiquant à HoganJS les infos de l'user à afficher dans la vue
		res.locals = { 'user' : { 'login' : req.user.login, 'nbConn' : req.user.nbConn, 'type' : req.user.external ? 'externe' : 'interne' } };
		return res.render('private');

	});

	// Demande de déconnexion
	app.get('/logout', function(req, res){

		req.logout();
		res.redirect('/');

	});

	// --------------------------------------------------------------------------------------
	// Politique des identifications possibles

	// Fonction générique effectuant le routage après l'authentification par Passport avec le provider indiqué
	var authenticateStrategy = function(strategy, req, res, next) {
		
		// Callback = fonction done(err, user, info) appelé depuis passport.js
		passport.authenticate(strategy, function(err, user, info) {


			console.log('--------------------------------- ');
			console.log('passport.authenticate ' + strategy);
			console.log('req  : ', req.route.method, req.route.path);
			console.log('err  : ', err);
			console.log('user : ', user);
			console.log('info : ', info);
			console.log('--------------------------------- ');

			// Authentification échouée
			if (err || !user) { 
				return res.redirect('/error');
			}

			// Authentification réussit, on demande la création d'une session par Passport
			req.login(user, function(err) {

				if (err) { return next(err); }
				return res.redirect('/private');

			});

		})(req, res, next);

	}

	// --------------------------------------------------------------------------------------
	// ROUTES : Demande de connexion | Stratégie "local"

	// Demande de connexion | Stratégie "local"
	app.post('/auth/local', function(req, res, next) { 
		authenticateStrategy('local', req, res, next);
	});

	// --------------------------------------------------------------------------------------
	// ROUTES : Demandes de connexion | Stratégie "OpenID"

	// 1 - Demande d'authentification chez un provider particulier
	//     Prend en paramètre un identifiant OpenID
	//     L'utilisateur va être redirigé vers le provider spécifié pour authentification
	app.post("/auth/openid", passport.authenticate("openid"));

	// 2 - Après authentification, le provider redirige vers notre application (returnURL)
	//     On finit l'étape d'authentification en vérifiant l'état de l'authentification
	app.get("/auth/openid/return", function(req, res, next) {
		authenticateStrategy('openid', req, res, next);
	});

	// --------------------------------------------------------------------------------------
	// ROUTES : Demandes de connexion | Stratégie "OpenID Google"

	// 1 - Demande d'authentification Google
	//     Ne prend aucun paramètre particulier
	//     L'utilisateur va être redirigé vers Google pour authentification
	app.get('/auth/google', passport.authenticate('google')); 

	// 2 - Après authentification, le provider redirige vers notre application (returnURL)
	//     On finit l'étape d'authentification en vérifiant l'état de l'authentification
	app.get('/auth/google/return', function(req, res, next) {
		authenticateStrategy('google', req, res, next);
	});



	return app;

}
