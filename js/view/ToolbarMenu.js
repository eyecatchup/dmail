define( ['lib/backbone', 'jquery'], function(Backbone, jQuery) {

	return Backbone.View.extend({
		_searchBar: null,

		template: _.template("<div class='dmail-toolbar-button'>All Dmails<div class='dmail-toolbar-icon'></div></div>"),

		events: {
			"click .dmail-toolbar-button": "_onOpen"
		},

		initialize: function (obj) {
			this._searchBar = obj.api.dom.search_bar()
			//console.log( this.$el )
			this.render()
		},

        render: function() {
        	//console.log("Rendering toolbar", this.$el )
			this.$el.append(this.template());
			return this;
		},

		_onOpen: function() {
			this._searchBar.find("input").val('in:sent "secure message"')
			$(".gbqfb").click()
		}

    });

});