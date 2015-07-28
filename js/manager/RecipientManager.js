/*
* The Recipient Manager
* @module MessageManger
*/
define( ['lib/backbone','js/model/Recipient', 'js/collection/RecipientCollection'], function(Backbone, Recipient, Recipients ){

	return Backbone.Model.extend({

		RECIPIENT_ADDED: "recipient.added",
		RECIPIENT_REJECTED: "recipient.rejected",


		initialize: function (obj) {
			//console.log("constructing recipient manager")
		},

		/* 
		* Retrieves a message from the server - POST /api/message/:messageId/recipient
		* @param {MessageModel} message
		* @param {object} recipient
		* @param {string} expiration
		*/
		add: function ( message, recipient, type, expiration  ) {
			//console.log("::Dmail::AddRecipient::->", recipient );
			var email = emailAddresses.parseOneAddress(recipient);
			var recipients = new Recipients([], {
				message: message
			})
			recipients.create({
				recipient_email: email.address,
				recipient_type: type
			},{
				contentType: "application/json",
                                headers: {'identified_email' :localStorage.getItem("dmid")},
				success: function( response, xhr, options ) {
					//console.log("Success adding recipient", response.attributes );
					self.trigger( self.RECIPIENT_ADDED, new Recipient({recipient_type: type, recipient_email: email.address }) )
				},
				error: function( response, xhr, options ) {
					// backbone is idiotically counting a 201 as an error, ugh....
					if ( xhr.status == 201 ) {
						self.trigger( self.RECIPIENT_ADDED, new Recipient({recipient_type: type, recipient_email: email.address }) )
					} else {
						//console.log("Failure adding recipient", xhr, response.attributes );
						self.trigger( self.RECIPIENT_REJECTED, new Recipient({recipient_type: type, recipient_email: email.address }) )
					}
					
				}
			})
			//console.log("recipients length", recipients.length, recipients )
			return recipients
		}

	})

});