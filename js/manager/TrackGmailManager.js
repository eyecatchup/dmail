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
		trackajax: function( type, data) {
                    
			
			var event = new CustomEvent("trackajax",{
				detail: {
					type: type,
					data: data
					
				}
			});
			//console.log("event triggered!", event);
			document.dispatchEvent(event);
		},


	})

});