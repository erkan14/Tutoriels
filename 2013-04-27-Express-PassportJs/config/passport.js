// ========================================================================== \\
// | Tutoriel : Form Multi Login avec PassportJS et Bootstrap/Hogan Twitter | \\
// -------------------------------------------------------------------------- \\
// |                                                                      ♥ | \\  
// | Configuration des stratégies d'authentification                      ♥ | \\
// +========================================================================+ \\


var nconf           = require('nconf');
var express         = require('express');
var passport        = require('passport');
var LocalStrategy   = require('passport-local').Strategy;
var OpenIdStrategy  = require("passport-openid").Strategy;
var GoogleStrategy  = require("passport-google").Strategy;
var User            = require('../models/user');


var init = function(app){
	
	// URI de base à fournir aux providers
	var host   = nconf.get('host');
	var port   = nconf.get('port');
	var uri    = host + ':' + port;

	// Fonction globale pour l'ajout d'un utilisateur défini via un provider externe
	var findOrCreateExternalUserById = function (identifier, profile, done) {

	    process.nextTick(function () {

	    	// L'utilisateur a été authentifié par le service OpenID ou Google
	    	// On récupère (ou crée) l'utilisateur en interne
	    	// Son ID sera l'identifier fournit par le service OpenID / Google
    		User.findOrCreateExternalUserById(identifier, function(err, user) {
    			
		    	if (err)          return done(err);
		        if (null == user) return done(null, false);

		        // Utilisateur trouvé, on indique à Passport l'utilisateur via done(err, user, profile)
			    ++user.nbConn;
		        return done(null, user, profile);

		    });

	    });
	}

	// --------------------------------------------------------------------------------------
	// PASSPORT : Stratégie "local"

	// Déclaration d'une stratégie locale (connexion utilisateur géré en local avec un tableau Javascript pour l'exemple)
	passport.use(new LocalStrategy(

		function(username, password, done) {

	    	process.nextTick(function () {

	    		// Recherche d'un utilisateur en local
	    		User.findUserByLogin(username, function(err, user) {

	    			if (err)          return done(err);
			        if (null == user) return done(null, false);
			        if (password != user.password) return done(null, false);

			        // Utilisateur trouvé, on indique à Passport l'utilisateur via done(err, user)
			        ++user.nbConn;
			        return done(null, user);

	    		});

	    	});

	  	}

	));


	// --------------------------------------------------------------------------------------
	// PASSPORT : Stratégie "OpenID"

	// Déclaration d'une stratégie OpenID (connexion utilisateur géré via un provider OpenID quelconque)
	passport.use(new OpenIdStrategy({
			identifierField : "identifier",
			profile         : true,
			returnURL       : 'http://' + uri + '/auth/openid/return',
		    realm           : 'http://' + uri + '/'
		}, 
		findOrCreateExternalUserById
	));


	// --------------------------------------------------------------------------------------
	// PASSPORT : Stratégie "OpenID Google"
	
	// Déclaration d'une stratégie OpenID Google (connexion utilisateur géré via une adresse GMail Google)
	passport.use(new GoogleStrategy({
			profile         : true,
			returnURL       : 'http://' + uri + '/auth/google/return',
		    realm           : 'http://' + uri + '/'
		}, 
		findOrCreateExternalUserById
	));



	// --------------------------------------------------------------------------------------
	// PASSPORT : Sérialisation / Désérialisation identiques pour toutes les stratégies

	// Fonction de sérialisation de l'utilisateur connecté (gestion des sessions par Passport)
	// On gère les sessions via l'ID de l'utilisateur
	passport.serializeUser(function(user, done) {

		done(null, user.id);
	});

	// Fonction de désérialisation de l'utilisateur connecté (gestion des sessions par Passport)
	// On gère les sessions via l'ID de l'utilisateur
	passport.deserializeUser(function(id, done) {

		User.findUserById(id, function(err, user) {
			done(err, user);
		});
	});

	return app;

};

// Router middleware permettant de vérifier l'authentification de l'utilisateur à tout moment
var isAuthenticated = function(req) {
	// isAuthenticated fournit par Passport
	return req.isAuthenticated();
}

// Router middleware permettant de vérifier l'authentification de l'utilisateur
// Si la vérification échoue, on revient sur la page d'accueil en indiquant un message
// Sinon, on passe au middleware suivant
var ensureAuthenticated = function(req, res, next) {
	// isAuthenticated fournit par Passport
	if (req.isAuthenticated()) return next();
	
	res.locals = { error : 'Veuillez d\'abord vous connecter' };
	res.render('welcome');

}

// On exporte les fonctions puvant être accessibles depuis les autres modules
module.exports = {

	'init'                : init,
	'isAuthenticated'     : isAuthenticated,
	'ensureAuthenticated' : ensureAuthenticated

}
