define(["libs/backbone"], function(Backbone) {
	return Backbone.View.extend({
		slideIn: function(func) {
			this.$el.removeClass("slideout");
			setTimeout(func,200);
		},
		slideOut: function(func) {
			this.$el.addClass("slideout");
			setTimeout(func,200);
		}
	})
});