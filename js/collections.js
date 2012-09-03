define(["libs/backbone","models"], function(bb,Models) {
	var personList = Backbone.Collection.extend({
		model: Models.Person
	});


	return {
		PersonList:personList
	}
})