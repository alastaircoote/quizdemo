define(["views/slideview","models","text!viewtemplates/comment.html","libs/underscore","util","libs/prettydate"], function(SlideView,Models,CommentTemplate,_,util,prettyDate) {

	var commentList = SlideView.extend({
		tagName:"div",
		className:"slidePanel",
		initialize: function() {
			/* Adding a whole bunch of dummy data for the purposes of this demo */

			 var dummyComments = [
		        "It's been being swept under the rug for a long time -- because it'll cost billions of $$s.",
		        "I think they're listening. Our veterans are a national treasure.",
		        "We need to stop putting troops in war zones with no clear goal, mission, or exit strategy. We also can't fight a tribal or guerilla war that will drag on for years in countries half way around the world.",
		        "After over a trillion dollars (debt), 100s of thousands of innocent deaths, seems they gave up looking for WMDs"
		    ];

		    var comments = [];
	        var lastTime = new Date().valueOf();
	        for(var x=0;x<4;x++) {

	            lastTime -= util.randomBetween(10000,180000);

	            comments.push(new Models.Comment({
	                person: this.model.models[x],
	                text: dummyComments[x],
	                time: new Date(lastTime).toISOString()
	            }));
	        }

	        this.model = comments;
		},
		render: function() {
			var self=this;
			var commentTarget = this.$el.find("#comments");
			_.each(this.model, function(comment) {
				var viewInstance = new commentView({
					model: comment
				});
				commentTarget.append(viewInstance.el);
				viewInstance.render();

			})
		}
	});

	var commentView = Backbone.View.extend({
		tagName:"li",
		initialize: function() {
			var self = this;
			var pModel = this.model.get("person");
			pModel.on("change:score",function() {
				self.$el.find("span.points").html(pModel.get("score") + " points")
			})
		},
		render: function() {
			var renderModel = {
				personScore: this.model.get("person").get("score"),
				personName: this.model.get("person").get("firstName"),
				personImage: this.model.get("person").get("picture"),
				text: this.model.get("text"),
				time: this.model.get("time")
			}
			this.$el.html(_.template(CommentTemplate,renderModel));
			_.each(this.$el.find("time"),function(time){
				$(time).html(prettyDate($(time).attr("title")))
			})
		}
	});

	return commentList;

});