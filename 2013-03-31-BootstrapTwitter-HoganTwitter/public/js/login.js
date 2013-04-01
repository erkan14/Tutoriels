/**
 * Fonctions utilitaires sur la page de login 
 */
$(function(){
	
	var $form = $('#formLogin');

	if($form.get(0) != null) {

		// Mise en place des intéractions utilisateur
		$('#buttonLocal') .on('click', function (){ enableProvider('local');  });
		$('#buttonOpenId').on('click', function (){ enableProvider('openId'); });
		$('#username')    .on('keyup', function (){ enableSubmit('local');    });
		$('#password')    .on('keyup', function (){ enableSubmit('local');    });
		$('#identifier')  .on('keyup', function (){ enableSubmit('openId');   });

		// Cas spécial où on sélectionne une valeur depuis l'autocompletion d'historique du navigateur
		$(document).on("input", '#identifier', function() { enableSubmit('openId'); }); // live()
		$("#identifier").change(function() { enableSubmit('openId'); }); // IE

		// Par défaut, on sélectionne le provider OpenID
		enableProvider('openId');

	}
	
	/**
	 * Activation / désactivation d'un élément DOM
	 * @param {object}  $elem  Elément Jquery
	 * @param {boolean} enable Etat à donnée à l'élément (true : activer, false : désactiver)
	 */
	function enableElement($elem, enable){
		if(enable) $elem.removeAttr("disabled");
		else $elem.attr("disabled", "disabled");
	}
	
	/**
	 * Affiche le formulaire en fonction du provider sélectionné 
     * @param {String} type Provider sélectionné
	 */
	function enableProvider(type){
		
		switch(type){

			case 'local' :
				$form.get(0).setAttribute('action', '/auth/local');
				$('#identifier', $form).closest('.control-group').hide();
				$('#username',   $form).closest('.control-group').show();
				$('#password',   $form).removeAttr("disabled");
				enableSubmit(type);
				break;

			case 'openId' :
				$form.get(0).setAttribute('action', '/auth/openid');
				$('#identifier', $form).closest('.control-group').show();
				$('#username',   $form).closest('.control-group').hide();
				$('#password',   $form).attr("disabled", "disabled");
				enableSubmit(type);
				break;

		}
	}
	
	/**
	 * Affiche le bouton de validation du formulaire en fonction des champs renseignés
     * @param {String} type Provider sélectionné
	 */
	function enableSubmit(type){
		
		switch(type){

			case 'local' :
				var val = $('#username', $form).val() + $('#password', $form).val();
				enableElement( $('button[type=submit]', $form), val.length > 0);
				break;

			case 'openId' :
				var val = $('#identifier', $form).val();
				enableElement( $('button[type=submit]', $form), val.length > 0);
				break;

		}
	}
    
});
