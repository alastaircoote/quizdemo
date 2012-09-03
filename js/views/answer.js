define(["views/slideview","libs/underscore","text!viewtemplates/answer.html"], function(SlideView,_,AnswerTemplate) {
	return SlideView.extend({
		className:"slidepanel slideout answer",
		events:{
			"click .showscores": "showscores"
		},
		render: function() {
			var text = "";
			if (!this.model.get("didAnswer")) {
				text = "You didn't answer!"
			} else {
				text = "That's " + (this.model.get("rightOrWrong") ? "right" : "wrong") + "!"
			}
			this.$el.html(_.template(AnswerTemplate,{
				rightOrWrongText: text,
				correctAnswer: this.model.get("question").get("answer"),
				incorrectAnswer: this.model.get("question").get("incorrectAnswer")
			}));
		},
		showscores: function() {
			var self = this;
			this.slideOut(function(){
				self.options.quizInstance.updateScores();
			})
		}
	})
});