// ========================================================================== \\
// | Tutoriel : Form Multi Login - Partie 1 : Frond-End                     | \\
// -------------------------------------------------------------------------- \\
// |                                                             2013-03-31 | \\
// | Voir README.md pour plus d'informations                              ♥ | \\
// +========================================================================+ \\

// --------------------------------------------------------------------------
// Chargement des modules (depuis node_modules et le répertoire config)

var nconf      = require('nconf');
var express    = require('express');
var myConfig   = require('./config/config');
var myRoutes   = require('./config/routes');

// --------------------------------------------------------------------------
// Chargement des variables de configuration

nconf.file({ file: 'settings.json' });

// --------------------------------------------------------------------------
// Chargement de l'ensemble des modules

const app = express();
myConfig(app);			// Configuration de Express
myRoutes(app);			// Configuration du routage


// --------------------------------------------------------------------------
// Lancement du serveur

app.listen(nconf.get('port'));

console.log('+---------------------------------------------------+');
console.log('|                 Tutoriel s4tori                   |');
console.log('+---------------------------------------------------+');
console.log('');
console.log('Serveur HTTP : http://' + nconf.get('host') + ':' + nconf.get('port') + '/');
console.log('');
