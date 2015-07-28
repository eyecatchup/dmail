define( ['lib/backbone', 'js/model/Recipient'], function(Backbone, Recipient ){

	var Recipients = Backbone.Collection.extend({

	  model: Recipient,
	  urlRoot: '//api.dmail.io/api/message/:messageId/recipient/',

	  initialize: function( data, options) {
	  	if ( typeof options == "undefined" ) {
	  		console.error("An options object is required.")
	  		return null;
	  	}
	  	if ( typeof options.message == "undefined" ) {
	  		console.error("A message VO must be provided in order to construct this collection.")
	  	}
	  	this.url = this.urlRoot.replace(":messageId", options.message.get("id") )
	  }

	});

	return Recipients;

});