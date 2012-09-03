define(["libs/swfobject","libs/underscore","libs/backbone"],function(yt) {
    return Backbone.View.extend({
    	initialize: function() {
        	var self = this;
    		var id = this.$el.prop("id");
        	window.onYouTubePlayerReady = function() {
    			self.player = $("#"+id)[0];
    			
                self.player.setVolume(100);
                self.player.addEventListener("onStateChange", "ytPlayChange")
                $(self.player).css("visibility","hidden");
                self.trigger("loaded");
    		}

		    swfobject.embedSWF("http://www.youtube.com/apiplayer?enablejsapi=1&version=3",id , "100%", "100%", "9.0.0","",{},{allowscriptaccess: "always"});

    	},
        showPlayer: function() {
            $(this.player).css("visibility","visible");
        },
        hidePlayer: function() {
            $(this.player).css("visibility","hidden");
        },
        playIntroVideo: function(ret) {
            var self=this;
            this.player.setVolume(100);
            this.showPlayer();
            this.player.loadVideoById("muXgOM1w2rI",22);
            this.checkForEnd(29, function(){
                self.hidePlayer();
                ret();
            })
        },
        checkForEnd: function(seconds,doRet) {
            var self = this;
            var playCheck = function() {
                if (self.player.getCurrentTime() >= seconds) {
                    self.player.stopVideo();
                    if (doRet) doRet();
                } else {
                    setTimeout(playCheck,100);
                }
            }
            playCheck();
        },
        playCountdown: function() {
            this.player.setVolume(20);
            this.player.loadVideoById("u2mqqCMu-LM",0);
            this.checkForEnd(14.5);
        },
        playScoresVideo: function(ret) {
            var self = this;
            this.player.setVolume(20);
            this.showPlayer();
            this.player.loadVideoById("M53__MaMrpU",2549);
            this.checkForEnd(2553, function(){
                self.hidePlayer();
                ret();
            })
        }
    });
})
