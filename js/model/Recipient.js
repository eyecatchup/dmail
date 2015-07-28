define( ['lib/backbone'], function(Backbone){

	return Backbone.Model.extend({

		defaults: {
			recipient_type: null,
			recipient_email: null
		},

		initialize: function() {
			//console.log("email constructed")
		}

	})

});