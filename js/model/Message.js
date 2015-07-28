define( ['js/model/Model'], function(Model){
	//console.log("site", Model.SITE_URL)
	return Model.extend({

		urlRoot: 'message',

		defaults: {
			id:  null,
			sender_email: null,
			encrypted_message: null,
			client_key: null,
			date_created: null
		},

		initialize: function() {
			this.urlRoot = this.SITE_URL + this.urlRoot;
		},

		getEmailMessage: function () {
			var buttonCSS = "background: #4BB8B2; border: 1px solid #24A7A0; color: white; font-size: 15px; padding: 8px 11px; border-radius: 5px;"
			return "<div rel='dmail'><code style='color: white'>KEY=" + this.get('id') + "&CLIENT="+this.get('client_key')+"</code></div><br/>" +
			"This secure message was sent using Dmail. To view this message, simply click the button below" +
			"<table style='width:100%;margin:50px 0px 20px 0px;'>" +
				"<tr><td align='center'>" +
				"<p><a href='https://mail.delicious.com/view/?id="+ this.get('id') +"&key="+this.get('client_key')+"' style='"+buttonCSS+"' target='_blank'>View Message</a></p>" +
				"</td></tr></table>"+
			"<table style='width:100%;'>" +
				"<tr><td align='center'>" +
				"<p style='color: #78848C'>Secure message sent via <a href='https://mail.delicious.com' target='_blank'>Dmail</a></p><a href='https://mail.delicious.com'><img src='https://ci6.googleusercontent.com/proxy/1LA4dNWLlpHURkS8kgptFqToZhD9KJK-H8friavEtC9WzalIDtysc060sY3yKHmi8eIb2IWyrTv4a5UTXT4TLTfzW-5NVsBidOv440Syeg=s0-d-e1-ft#http://s3.amazonaws.com/dmail-assets/dmail-logo-small.jpg'/></a>"
				"</td></tr></table>"
		}

	})

});