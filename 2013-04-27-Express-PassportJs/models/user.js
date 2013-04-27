// ========================================================================== \\
// | Tutoriel : Form Multi Login avec PassportJS et Bootstrap/Hogan Twitter | \\
// -------------------------------------------------------------------------- \\
// |                                                                      ♥ | \\  
// | Gestion des utilisateurs (stratégie locale)                          ♥ | \\
// +========================================================================+ \\

// On stocke les utilisateurs dans un tableau javascript statique pour l'exemple
// Dans la vraie vie, il faudrait stocker les utilisateurs en base de données avec un mot de passe crypté
var tabUser = [

	// Utilisateurs internes
	{ 'id' : '1', 'login' : 'Dieu', 'password'   : 'secret', 'external' : false, 'nbConn' : 0 },
	{ 'id' : '2', 'login' : 'John', 'password'   : 'Doe'   , 'external' : false, 'nbConn' : 0 },

	// utilisateurs externes (identifier unique fournit par le provider)
	{ 'id' : '3', 'login' : 'Mary', 'identifier' : 'blabla', 'external' : true , 'nbConn' : 0 }

];

/**
 * Retourne l'utilisateur interne possédant le login spécifié
 * @param {string}              loginUser Login à rechercher
 * @param {function(*, object)} callback  Méthode à appeler en retour => (erreur, utilisateur)
 */
var findUserByLogin = function(loginUser, callback) {

	for(idx in tabUser){

		// Utilisateur identifié depuis un service externe
		if(tabUser[idx].external) continue;

		// Utilisateur interne
		if(tabUser[idx].login == loginUser){
			callback(null, tabUser[idx]);
			return;
		}

	}

	// Login indiqué inexistant
	callback(null, null);

};

/**
 * Retourne l'utilisateur possédant l'identifiant spécifié 
 * @param {number}              idUser   ID à rechercher
 * @param {function(*, object)} callback Méthode à appeler en retour => (erreur, utilisateur)
 */
var findUserById = function(idUser, callback) {

	for(idx in tabUser){

		// Utilisateur interne
		if(tabUser[idx].id == idUser){
			callback(null, tabUser[idx]);
			return;
		}

	}

	callback('findUserById | Utilisateur introuvable : ' + idUser, null);

};

/**
 * Retourne l'utilisateur externe possédant l'indentifiant spécifié 
 * On se base sur le champ IDENTIFIER
 * @param {string}              identifier ID à rechercher
 * @param {function(*, object)} callback   Méthode à appeler en retour => (erreur, utilisateur)
 */
var findExternalUserById = function(identifier, callback) {

	for(idx in tabUser){

		// Utilisateur interne
		if(tabUser[idx].internal) continue;

		// Utilisateur externe
		if(tabUser[idx].identifier == identifier){
			callback(null, tabUser[idx]);
			return;
		}

	}

	// Pas d'user correspondant, il sera créé.
	callback(null, null);

};


/**
 * Retourne l'utilisateur possédant l'indentifiant spécifié
 * Si l'utilisateur externe n'existe pas, on le crée avant de le retourner.
 * Utilisateur externe : Utilisateur authentifié via un service externe
 * @param {string}              identifier ID à rechercher
 * @param {function(*, object)} callback   Méthode à appeler en retour => (erreur, utilisateur)
 */
var findOrCreateExternalUserById = function(identifier, callback) {
	
	findExternalUserById(identifier, function(err, user){

		if(err)  { callback(err, null); return; };
		if(user) { callback(err, user); return; };

		var newUser = {
			'id'         : tabUser.length + 1, 
			'login'      : 'Utilisateur externe', // A adapter selon le provider
			'identifier' : identifier, 
			'external'   : true,
			'nbConn'     : 0
		};

		tabUser.push(newUser);
		callback(null, newUser);
		
	});

};


// On exporte les fonctions pouvant être accessibles depuis les autres modules
module.exports = {

	'findUserByLogin'              : findUserByLogin,
	'findUserById'                 : findUserById,
	'findOrCreateExternalUserById' : findOrCreateExternalUserById

}
