define( ['lib/backbone'], function(Backbone){

	return Backbone.Collection.extend({

		SITE_URL: "//api.dmail.io/api/message",

		initialize: function() {
			this.urlRoot = this.SITE_URL + this.urlRoot;
		},

		getUrl: function() {
		  console.log("running?", this.isNew(), this.id)
		  if ( this.id !== null ) return this.urlRoot + this.endpoint + "/" + this.id
		  if (this.isNew()) return this.urlRoot + this.endpoint;
		  return this.urlRoot + this.endpoint + (urlRoot.charAt(urlRoot.length - 1) == '/' ? '' : '/') + this.id;
		}

	})

});