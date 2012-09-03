requirejs.config({
	paths: {
    	"jquery":"https://ajax.googleapis.com/ajax/libs/jquery/1.8.0/jquery.min",
        "text":"libs/text"
    },
	shim: {
        "libs/backbone": {
            deps: ["libs/underscore", "jquery"],
            exports: "Backbone"
        },
        "libs/underscore": {
            exports: '_'
        },
        "libs/prettydate":{
            exports: "prettyDate"
        }
    }
});

requirejs.onError = function (err) {
    if (err.requireType === 'timeout' && err.requireModules.indexOf("libs/fb!") > -1) {
        alert("Cannot load the Facebook API. Do you have it blocked?")
    }
}

if (window.location.hash != "") {
    window.location = "/"
}
requirejs(["jquery","views/quiz","libs/fb!"], function(jQ,QuizInstance,fb){

    $("#fbLogin").removeClass("disabled");
    $("#fbLogin").attr("disabled",false)
    $("#fbLogin").on("click", function() {
        $("#fbLogin").addClass("disabled");
        $("#fbLogin").html("Loading...")
        fb.ensureLoggedIn({
            success: function() {
                 new QuizInstance({
                    el: $("div#quizbox")
                });
            },
            failure: function() {
                $("#fbLogin").removeClass("disabled");
                $("#fbLogin").html("Log in with Facebook")
            }});
    })

   
})