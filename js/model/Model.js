define( ['lib/backbone'], function(Backbone){

	return Backbone.Model.extend({

		SITE_URL: "//api.dmail.io/api/",

		getUrl: function() {
		  //console.log("running?", this.isNew(), this.id)
		  if ( this.id !== null ) return this.urlRoot + this.endpoint + "/" + this.id
		  if (this.isNew()) return this.urlRoot + this.endpoint;
		  return this.urlRoot + this.endpoint + (urlRoot.charAt(urlRoot.length - 1) == '/' ? '' : '/') + this.id;
		}

	})

});