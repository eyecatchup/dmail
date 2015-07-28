define( ['lib/backbone', 'jquery'], function(Backbone, jQuery) {

	return Backbone.View.extend({
		_searchBar: null,

		template: _.template("<div id='popup1' class='overlay'><div class='popup'><a class='close' href='#'>×</a><div class='header'><div style='text-align: center;padding-top: 4px;'><img src='"+chrome.extension.getURL("img/logo-128.png")+"' style='width:50px;'><h4 style='margin-top: -37px;margin-left: 150px;font-size: 32px'><b>Dmail</b></h4></div></div><div class='content'><div><img src='"+chrome.extension.getURL("img/gradient.png")+"' style='width: 100%;height: 365px;'></div><div ><img src='"+chrome.extension.getURL("img/dmail-compose-mock.png")+"' class='mailimg'></div></div><div class='footer'><p>Welcome to Dmail</p></div></div>"),

		events: {
			"click .close": "_close"
		},

		initialize: function (obj) {
                    console.log("screen");
	            this.render();		
		},
                
                render:function(){
                    
                    this.$el.append(this.template());
			return this;
                },
                _close: function(){
                    $('#popup1').hide();
                }
        

		

    });

});