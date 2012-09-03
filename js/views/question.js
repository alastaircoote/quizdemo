define(["views/slideview","models","text!statecapitals.json","libs/underscore","text!viewtemplates/question.html","views/answer","util"],
	function(SlideView,Models,stateCapitals,_,QuestionTemplate,AnswerView,util) {
	stateCapitals = JSON.parse(stateCapitals);
	stateCapitals.sort(function randOrd(){
	  return (Math.round(Math.random())-0.5);
	});

	var currentIndex = 0;
	var getNextState = function() {
		currentIndex++;
		if (currentIndex == stateCapitals.length - 1) {
			currentIndex = 0;
		}
		return stateCapitals[currentIndex];
	}

	return SlideView.extend({
		tagName:"div",
		className:"slidepanel question slideout",
		initialize: function() {
			var nextState = getNextState();

			/* Hacky way to get the 'incorrect' answer we'll say some contestants gave */

			var randomStateIndex = currentIndex;
			while (randomStateIndex == currentIndex) {
				randomStateIndex = util.randomBetween(0,stateCapitals.length-1);
			}

			this.model = new Models.Question({
				question: "What city is the capital of " + nextState.state + "?",
				answer: nextState.capital,
				incorrectAnswer: stateCapitals[randomStateIndex].capital
			});
		},
		events:{
			"submit form": "formSubmit"
		},
		formSubmit: function(e) {
			e.preventDefault();
			this.answered = true;
			this.secondsAnswered = this._currentSeconds;
			this.answerProvided = this.answerInput.val();
			this.$el.addClass("answered");
			this.answerOutput.html(this.answerProvided);
		},
		render: function() {
			this.$el.html(_.template(QuestionTemplate,this.model.toJSON()));
			this.secondHand = this.$el.find(".secondhand");
			this.timerText = this.$el.find(".timer");
			this.answerInput = this.$el.find("input[type=text]");
			this.answerOutput = this.$el.find("span.answerOutput")
			this.answerButton = this.$el.find("input[type=submit]");

			this.answerInput.focus();
			
		},
		startTimer: function() {
			this.options.quizInstance.videoPlayer.playCountdown();
			
			this._currentSeconds = -1;
			this.timerTick();
		},
		timerTick: function() {
			var self = this;
			this._currentSeconds++;
			this.secondHand.css("transform","rotate(" + ((90/15) * this._currentSeconds) + "deg)");
			this.timerText.html(15 - this._currentSeconds);
			if (this._currentSeconds < 15) {
				setTimeout(function() {
					self.timerTick();
				},1000);
			} else {
				this.answerButton.hide();
				setTimeout(function(){
					self.showAnswer();
				},1000);
			}
		},
		showAnswer: function() {
			var self = this;
			var answer = new Models.Answer({
				didAnswer: this.answered,
				rightOrWrong: this.model.isCorrect(this.answerProvided),
				question: this.model
			});
		
			var allUsers = [];
			$.merge(allUsers, this.options.quizInstance.contestants.models);
			$.merge(allUsers, this.options.quizInstance.commenters.models);

			_.each(allUsers, function(contestant){
				/* If current user */
				if (contestant.get("id") == self.options.quizInstance.me.id) {
					if (answer.get("rightOrWrong") != true) return;
					contestant.set("score",contestant.get("score") + (15 - self.secondsAnswered));
					return;
				}
				/* Again, hack to make up the answers for our made up users */
				if (util.randomBetween(1,4) > 1) {
					var secondsTaken = util.randomBetween(1,15);
					contestant.set("score", contestant.get("score") + (15 - secondsTaken));
				}
			})
			var answerView = new AnswerView({
				model:answer,
				quizInstance: this.options.quizInstance
			});
			$("#rightPanel").append(answerView.el);
			answerView.render();
			this.slideOut(function() {
				answerView.slideIn();
			})
		}

	})

});