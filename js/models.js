define(["libs/backbone"], function(bb) {
	var person = Backbone.Model.extend({
		score:0
	})

	var comment = Backbone.Model.extend({});

	var question = Backbone.Model.extend({
		isCorrect: function(answerAttempt) {
			if (!answerAttempt) return false;
			return this.get("answer").toLowerCase() == answerAttempt.toLowerCase();
		}
	});

	var answer = Backbone.Model.extend({

	})


	return {
		Person:person,
		Comment:comment,
		Question:question,
		Answer:answer
	}
})