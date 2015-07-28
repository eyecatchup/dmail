define([
	'js/transport/RestfulTransport'
], function(RestfulTransport){

	return RestfulTransport.extend({

		_endpoint: "api/message",

		initialize: function() {
			//console.log("Message Transport constructed");
		}

	})

});