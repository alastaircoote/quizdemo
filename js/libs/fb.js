define(["util","models","collections"],function(util,Models,Collections) {

    var fbFuncs = function(fb, authResponse) {
        this.fb = fb;
        //this.userId = authResponse.userID;
    };

    fbFuncs.prototype = {
        getRandomFriends: function(num,ret) {
            var self = this;
            this.fb.api("/me/friends?limit=" + (num * 10) + "&fields=id,first_name,username", function(friends){
                var alreadyGot = [];
                var users = [];
                for (var x=0;x<num;x++) {
                    var rand = util.randomBetween(0,friends.data.length);
                    while(alreadyGot.indexOf(rand) > -1) {
                        rand = util.randomBetween(0,friends.data.length);
                    }
                    user = friends.data[rand];
                    users.push(self._personFromGraphAPI(user));
                    alreadyGot.push(rand);
                }
                ret(new Collections.PersonList(users));

            });
        },
        ensureLoggedIn: function(funcs) {
            var self = this;
            var res = this.fb.getAuthResponse();
            if (res == null || res.authResponse == null) {
                self.fb.login(function(r) {
                    if (r.authResponse) {
                        self.userId = r.authResponse.userID;
                        funcs.success();
                    } else {
                        funcs.failure();
                    }
                })
            } else {
                self.userId = res.authResponse.userID;
                funcs.success();
            }
            
        },
        _personFromGraphAPI: function(response) {
            return new Models.Person({
                firstName: response.first_name,
                picture: "http://graph.facebook.com/" + response.id + "/picture",
                pictureNormal:"http://graph.facebook.com/" + response.id + "/picture?type=normal",
                pictureLarge:"http://graph.facebook.com/" + response.id + "/picture?type=large",
                score:0,
                handle: response.username,
                highlighted:false,
                id: response.id
            });
        },
        me: function(ret){
            var self = this;
            if(this._meObj) {
                ret(this._meObj);
                return;
            }
            this.fb.api("/me",function(response) {
                self._meObj = self._personFromGraphAPI(response);
                ret(self._meObj);
            })
        }
    };


    var fbInstance;
    

    return {
		load: function(name, req, onLoad, config) {
            window.fbAsyncInit = function() {
                
                FB.init({
                    appId: "175122949290241",
                    channelUrl: "//" + window.location.host + "/channel.html",
                    status: true,
                    cookie: true,
                    xfbml: false,
                    oauth: true,
                });

                /*FB.getLoginStatus(function(res){
                   if (res.authResponse == null) {
                        var url = "https://www.facebook.com/dialog/oauth?" +$.param({
                            client_id: config.fbAppId,
                            redirect_uri: "http://" + window.location.host + "/"
                        });
                        window.location = url;
                    } else {
                        
                    }
                })*/
                if (!fbInstance) fbInstance = new fbFuncs(FB)
                onLoad(fbInstance);
                
      		};

            (function(d){              
                var js, id = 'facebook-jssdk'; if (d.getElementById(id)) {return;}
                var fbroot = d.createElement("div"); fbroot.id = "fb-root";
                d.body.appendChild(fbroot);

                js = d.createElement('script'); js.id = id; js.async = true;
                js.src = "//connect.facebook.net/en_US/all.js";
                d.getElementsByTagName('head')[0].appendChild(js);
            }(document));   
		}
	}
})