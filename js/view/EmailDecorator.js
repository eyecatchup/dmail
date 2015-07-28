define( [
	'lib/backbone', 
	'jquery'
], function( Backbone, jQuery ) {

	return Backbone.View.extend({

		_rendered: false,
		_api: null,
		_compose: null,
		_message: null,
		footer:  _.template("<div class='dmail-message-decorator-footer'>Secure message sent with Dmail<img src='https://s3.amazonaws.com/dmail-assets/dmail-logo-white.png'/></div>"),

		initialize: function (obj) {
			//console.log("obj", obj)
			var self = this;
			this.app = obj.app
			var manager = this.app.getManager("message");
			this._api = obj.api;
			this._email = obj.email;
			this.publicKey = this.app.getManager("message").findMessageMeta( this._email.body() ).publicKey
			this.clientKey = this.app.getManager("message").findMessageMeta( this._email.body() ).clientKey
			

			// This is potentially buggy since its not on the right model but rather to a singleton that COULD get off track
			manager.on( manager.MESSAGE_RETRIEVED, $.proxy( this._onReady, self ) );	
			this._message = manager.get( this.publicKey )
			manager.on( manager.MESSAGE_UNAVAILABLE, $.proxy( this._onUnavailable, self ) );	
		},
                events: {
			"click .dmail-message-decorator-footer": "_onPointer"
		},

                _onPointer:function(){
                    var url=window.open('https://mail.delicious.com', '_blank');
                },
		_onUnavailable: function () {
			this.$el.append(this.footer());
			this.$el.addClass("dmail-message-decorator")
			this.$el.find(".a3s div:first-child").html("This message has been destroyed and is no longer available.")
		},

		_onReady: function() {
			//console.log( "message ready!" );
			if ( !this._rendered ) {
				this._rendered = true;
				this.render();
			}
		},

        render: function() {
        	// Check to see if this email 
        	var self = this;
			this.$el.append(this.footer());
			this.$el.addClass("dmail-message-decorator")
			body = this.app.getManager("message").decrypt( this._message, this.clientKey )
			//console.log("its overriding the body now!", this.$el.find(".a3s>div") )
			this.$el.find(".a3s").first().html(body)
			if ( this._email.from().email == this._api.get.user_email() ) {
				this.$el.find("tr.acZ").first().append("<td role='button' class='dmail-revoke-button'>Revoke Email</td>")
				// If the local user is the sender show a revoke button
				//console.log( "Adding revoke button", this._api.get.user_email(), this._email.from().email )
				this.$el.find(".dmail-revoke-button").on( "click", $.proxy( self._onRevoke, self )  );
				this.app.getManager("tracking").track( "message.view", {}, this._api.get.user_email());
                                var res=self
			}
                        return false;
		},

		

		_onRevoke: function ( event ) {
			//console.log("revoke", this.publicKey, this.clientKey, this._api.add_modal_window )
			var self = this;
			this._api.tools.add_modal_window('Destroy Message', 'Destroying this message will revoke access from all recipients including yourself. Do you want to proceed?',
			function( event, remove ) {
				self.app.getManager("message").destroy( self._message );
                self.app.getManager("tracking").track( "revoke.mail", {}, self._email.from().email);
				window.location.href = "#inbox";
				remove();
			});

		}


    });

});
