define( ['lib/backbone', 'jquery'], function(Backbone, jQuery) {

	return Backbone.View.extend({
		_searchBar: null,

		template: _.template("<div class='tip'><div class='logo-tool'><img src='"+chrome.extension.getURL("img/logo-128.png")+"' style='width: 40px;margin-right: 66px;margin-top:9px;'><h3 class='text'>Dmail</h3></div> <div class='border-content'></div><div class='text-content'><p>Hit 'Send with Dmail' to send secure messages to anyone, regardless of whether or not they have Dmail. You can revoke a message sent with Dmail at any time, and recipients can never forward the message without your knowledge.</p><p>Finally, sent email has a delete button.</p></div><button type='button' class='button-tool'>Got it!</button><img src='"+chrome.extension.getURL("img/arrw.png")+"' class='arrow-down'></div>"),
                
		events: {
			"click .button-tool":"_tool",
                        "keypress":"_destroy"
                        
		},

		initialize: function (obj) {
                    console.log("screen");
	            this.render();		
		},
                
                render:function(){
                    
                    this.$el.append(this.template());
			return this;
                },
                _tool: function(){
                    localStorage.setItem("tooltip",1);
                    $(".tip").remove();
                },
                _destroy:function(e){
                    var code = e.keyCode || e.which;
                    if(code==27){
                        
                        localStorage.setItem("tooltip",1);
                    $(".tip").remove();
                    }
                }
           

    });

});