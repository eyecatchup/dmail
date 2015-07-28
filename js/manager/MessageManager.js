/*
 * The Message Manager
 * @module MessageManger
 */
define(['lib/backbone', 'js/model/Message', 'lib/GibberishAES', 'lib/email-addresses'], function (Backbone, Message, GibberishAES, emailAddresses) {

    return Backbone.Model.extend({
        MESSAGE_CREATED: "message.encrypted",
        MESSAGE_DECRYPTED: "message.decrypted",
        MESSAGE_DESTROYED: "message.destroyed",
        MESSAGE_DESTROY_FAILED: "message.destroy.failed",
        MESSAGE_RETRIEVED: "message.retrieved",
        MESSAGE_UNAVAILABLE: "message.unavailable",
        MESSAGE_SENT: "message.sent",
        SERVER_ERROR: "server.error",
        initialize: function (obj) {
            //console.log("constructing message manager")
        },
        /* 
         * Retrieves a message from the server - GET /api/message/:publicKey
         */
        get: function (publicKey) {
            var self = this;
            //console.log("::Dmail::Message->Get( "+publicKey+" )")
            var message = new Message();
            message.set({id: publicKey})
            response = message.fetch({
                headers: {'identified_email': localStorage.getItem("dmid")},
                success: function (message, response, options) {
                    //console.log("got it from the server!", message, response, options)
                    //console.log("yty",response.encrypted_message);
                    // Translations since property names are different server side vs. client
                    message.set("encrypted_message", response.encrypted_message)
                    message.set("date_created", response.dateCreated)
                    self.trigger(self.MESSAGE_RETRIEVED, message)
                },
                error: function (message, xhr, options) {
                    self.trigger(self.MESSAGE_UNAVAILABLE, message)
                }
            })
            return message
        },
        /* 
         * Creates a new message from the server - POST /api/message
         * @param {integer} id
         * @param {integer} sender_email
         */
        create: function (id, senderEmail, body) {

//			console.log("::Dmail::Create", id, senderEmail, body)
//                        console.log("message",this.$el); 
            var self = this;
            var clientKey = this._createClientKey();
            var encryptedMessage = GibberishAES.enc(body, clientKey);

            var message = new Message({
                encrypted_message: encryptedMessage,
                sender_email: senderEmail,
                client_key: clientKey
            });
            //console.log(message);
            // Save Message
            response = message.save({
                encrypted_message: encryptedMessage,
                sender_email: senderEmail
            },
            {
                contentType: "application/json",
                headers: {'identified_email': localStorage.getItem("dmid")},
                success: function (model, response, options) {

                    //console.log("Success saving!", response, options );
                    var Data = JSON.parse(localStorage.getItem("DmailData"));
                    Data.message_id = response.message_id;
                    localStorage.setItem("DmailData", JSON.stringify(Data));
                    //console.log("checj",localStorage.getItem("DmailData"));
                    message.set("id", response.message_id);
                    self.trigger(self.MESSAGE_SENT, message);
                    self.trigger(self.MESSAGE_CREATED, message);
                },
                error: function (model, response, options) {
                    console.error("Error saving!", response, options)
                    self.trigger(self.SERVER_ERROR, {class: "Message", method: "save", response: response.statusText})
                }
            });


            // Return the model itself, it is a promise at this stage
            return message;

        },
        /* 
         * Retrieves the message via public key- GET /api/message/:publicKey
         * @param {string} publicKey
         * @param {string} publicKey
         */
        decrypt: function (message, clientKey) {
            var body = message.get("encrypted_message");
            //console.log(body, clientKey, "<!---- Encryption")	
            var decryptedBody = GibberishAES.dec(body, clientKey);
            return decryptedBody
        },
        /* 
         * Creates a new message from the server - POST /api/message
         * @param {string} publicKey
         * @param {string} senderEmail
         */
        destroy: function (message) {
            var self = this;
            // Bind callbacks
            message.on("change", function () {
                //console.log("Message::Destroying")
            });

            message.on("request", function () {
                //console.log(" - Message::HTTPRequest")
            });

            message.on("sync", function () {
                //console.log("Sync complete!")
                self.trigger(self.MESSAGE_DESTROYED, {message: message})
            });

            // Destroy Message
            response = message.destroy({headers: {'identified_email': localStorage.getItem("dmid")},
                success: function (model, response, options) {
                    //console.log("Success destroy!", model, response, options )
                    self.trigger(self.MESSAGE_DESTROYED, {message: "{encrypted_message}", message_key: "10sdf9sdf9s12z"})
                },
                error: function (model, response, options) {
                    //console.error("Error destroy!",response.statusText )
                    // uncomment to test this before code is ready 
                    self.trigger(self.MESSAGE_DESTROY_FAILED, {message: "{encrypted_message}", message_key: "10sdf9sdf9s12z"})
                }
            });
        },
        findMessageMeta: function (string) {
            var $elem = $(string);

            // Decode the message and change the body to be the right thing
            $elem.find("[rel='dmail']").first().find("code").find("wbr").remove() // google liks to insert word break opportunities... 
            keys = $elem.find("[rel='dmail']").first().find("code").html();
            var publicKey = keys.split("&amp;")[0].split("=")[1]
            var clientKey = keys.split("&amp;")[1].split("=")[1]
            return {publicKey: publicKey, clientKey: clientKey}
        },
        _createClientKey: function () {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                        .toString(16)
                        .substring(1);
            }
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                    s4() + '-' + s4() + s4() + s4();
        }

    })

});