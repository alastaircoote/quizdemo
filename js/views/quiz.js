define(["libs/fb!","jquery","videoplayer","collections","views/scoreboard","views/comments","models","util","libs/backbone","views/question"],
	function(fb,$,VideoPlayer,Collections,ScoreboardView,CommentView,Models,util,Backbone,QuestionView){
		return Backbone.View.extend({
			tagName:"div",
			_quizStarted:false,
			events:{
				"click": function() {
					this.startQuiz();
				}
			},
			initialize: function() {
				var self = this;
				$(".thisUserImg").attr("src","http://graph.facebook.com/" + fb.userId + "/picture")

			    this.videoPlayer = new VideoPlayer({
			    	el: $("#videoPlaceholder")
			    });
			    var contestants, commenters, me;

			    fb.me(function(meObj) {
			        self.me = meObj;
			        self.loadComments();
			    })

			    fb.getRandomFriends(7, function(people) {
			        self.contestants = new Collections.PersonList(people.models.splice(0,4));
			        self.commenters =  new Collections.PersonList(people.models);

			        self.scoreBoard = new ScoreboardView({
			            el:$("#contestantList"),
			            model:self.contestants
			        });
			        self.scoreBoard.render();

			        self.loadComments();
			        self.$el.css("display","block")

			        // temp
			       // self.startQuiz();
			    });

			    $("#userImg").on("load", function(){
			    	$(this).css("margin-top",0 - (this.height/2));
			    })

			},
			loadComments: function() {
				// me and commenters are loaded via separate calls- we need both.
		        if (!this.commenters || !this.me) return;
		        this.commenters.add(this.me,{at:2});
		        this.commentsView = new CommentView({
		            model:this.commenters,
		            el:$("#startPanel")
		        });
		        this.commentsView.render();
			},
			startQuiz: function() {
				if (this._quizStarted) return;
				this._quizStarted = true;
				var self = this;

				var start = function(){
					self.commentsView.slideOut(function() {
						self.highlightedUser = self.contestants.models[util.randomBetween(0,self.contestants.models.length-1)];
						self.highlightedUser.set("highlighted",true);
						var question = new QuestionView({
							quizInstance: self
						});
						$("#rightPanel").append(question.el)
						question.render();
						question.slideIn(function(){
							question.startTimer();
						})
					})
				};

				if (self._introShown) {
					start();
					return;
				}
				this.videoPlayer.playIntroVideo(function() {
					start();
					self._introShown = true;
				});
			},
			updateScores: function() {
				var self = this;
				this._quizStarted = false;

				this.commentsView.$el.find(".becontestant").html("Next question");
				this.highlightedUser.set("highlighted",false);
				this.commentsView.slideIn(function() {
					self.videoPlayer.playScoresVideo(function() {
						self.scoreBoard.refreshScores();
					});
				});
			}
	});

});