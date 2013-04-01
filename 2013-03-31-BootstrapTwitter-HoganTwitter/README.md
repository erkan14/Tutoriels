# Tutoriel Authentification (Frond-end Twitter, Back-End Node.js)

## Partie 1 (Frond-End)

Ce tutoriel expose la place d'un service d'authentification avec **Node.js** et le module **Passport**.<br />
**Cette première partie se concentre sur la mise en place de l'interface Front-End.**

L'accès au service est sécurisé, l'authentification pouvant s'effectuer via un compte interne à l'application ou à l'aide d'un provider [OpenID](http://openid.net/) ou via un compte Google. Passport permet de gérer l'authentification via une multitude de services (Facebook, Twitter, OAuth, etc).

<p align="center">
  <img src="https://raw.github.com/s4tori/Tutoriels/2013-03-31-BootstrapTwitter-HoganTwitter/master/public/img/welcome.jpg" alt="Interface" />
</p>

**La partie Front-End est fournit par :**

 - [Bootstrap](http://twitter.github.com/bootstrap/) : Framework Front-end CSS/JS par Twitter (CSS compatibles tout périphériques, responsive design, etc)
 - [Hogan](http://twitter.github.com/hogan.js/) : générateur/compilateur de template basé sur [Mustache](http://mustache.github.com/) par Twitter

**La partie back-End est fournit par  (traité lors de la partie 2) :**

- [Node.js](http://nodejs.org/) : Serveur basé sur le moteur Javascript V8 de Chrome
- [Module express](http://expressjs.com/) : Framework d'application Web (support des middlewares)
- [Module passport](http://passportjs.org/) : Gestion de l'authentification (middleware branché à Express)

## Installation

L'installation consiste à télécharger les modules nécessaires au fonctionnement du serveur (via npm). Il suffit ensuite de lancer le serveur node.js.

Configuration de node.js (installation automatique des modules) : 

	$ cd <repertoireDeTravail>
	$ npm install

Vous pouvez ensuite lancer le serveur node.js

    $ node server.js

L'accès à l'application s'effectue à l'adresse : [http://localhost:1337/](http://localhost:1337/).
