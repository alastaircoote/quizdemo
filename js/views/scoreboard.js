define(["libs/backbone","libs/underscore","text!viewtemplates/scoreboardentry.html","util"], function(Backbone,_,ScoreboardEntryTemplate,util) {

	var scoreboardEntry = Backbone.View.extend({
		tagName:"li",
		initialize: function() {
			this.model.on("change:highlighted",this.highlightChange,this);
		},
		render: function() {
			this.$el.html(_.template(ScoreboardEntryTemplate,this.model.toJSON()));
		},
		highlightChange: function() {
			if (this.model.get("highlighted") === true) {
				this.$el.addClass("highlighted");
				$("#userImg").prop("src",this.model.get("pictureLarge"));
				$("#userImg").css("visibility","visible")
			} else {
				$("#userImg").css("visibility","hidden");
				this.$el.removeClass("highlighted")
			}
		},
		updateScore:function(ret) {
			var pScore = this.$el.find("p.score");
			var currentScore = parseInt(pScore.html());
			var targetScore = this.model.get("score");
			var update = function() {
				if (currentScore < targetScore) {
					currentScore++;
					pScore.html(currentScore);
					setTimeout(update,200);
				} else {
					ret();
				}
			}

			update();
		}
	})




	return Backbone.View.extend({
		tagName:"ol",
		className:"scoreboard",
		render: function() {
			this.subViews = [];
			var entries = [];
			var self = this;
			_.each(this.model.models, function(model){
				var sb = new scoreboardEntry({
					model: model
				});
				self.$el.append(sb.el);
				sb.render();
				self.subViews.push(sb);
			})
		},
		refreshScores: function() {
			var x = 0;
			var self = this;
			var refreshView = function() {
				self.subViews[x].updateScore(function() {
					x++;
					if (x < self.subViews.length) {
						setTimeout(refreshView,200)
					}
				});
				
			}

			refreshView();
		}
	});
})