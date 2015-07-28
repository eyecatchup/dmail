/*
* The Email Manager
* @module MessageManger
*/
define( [
	'lib/backbone'
], function(Backbone){

	return Backbone.Model.extend({

		
		/* 
		* Creates a new message from the server - POST /api/message
		* @param {integer} type
		* @param {integer} data
		* @param {integer} email
		*/
		track: function( type, data, email,to ) {
                    //console.log(email);
			//console.warn("!NOT IMPLEMENTED!");
			var event = new CustomEvent("track",{
				detail: {
					type: type,
					data: data,
					email: email,
                                        to:to
				}
			});
			//console.log("event triggered!", event);
			document.dispatchEvent(event);
		},


	})

});