define([
	'js/transport/Transport'
], function(Transport){

	return Transport.extend({

		_endpoint: null,

		initialize: function() {
			//console.log("Transport constructed");
		},

		create: function( Model ) {
			
			var url = "/" + this._endpoint
			var method = "POST";

			// Serialize the payload from the model

		},

		retrieve: function() {

		},

		update: function() {

		},

		delete: function() {

		}

	})

});