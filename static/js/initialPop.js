var config = {
    apiKey: "AIzaSyCJ8dUGpXA1TwSk7DZncx3XLSYuCKvNwSE",
    authDomain: "parking-40a6e.firebaseapp.com",
    databaseURL: "https://parking-40a6e.firebaseio.com",
    projectId: "parking-40a6e",
    storageBucket: "parking-40a6e.appspot.com",
    messagingSenderId: "310491178257"
};
var currentUser = null;
firebase.initializeApp(config);
var database = firebase.database();
var auth = firebase.auth();
auth.onAuthStateChanged(function(user){
    if(user){
        if(user!=null){
            var email = user.email;
            $("#login, #login2").text(email);
        }
    }else{
        $("#login, #login2").text("Login");
    }
});


$(document).ready(function(){
    database.ref("parking").once("value", function(snapshot){
        var obj = {};
        console.log(snapshot);
        $.each(snapshot.val(), function(key, value){
            value.slots = {};
            console.log(value);
            for(var i = 1; i < 10; i++){
                value.slots["A-" + i] = {};
                value.slots["A-" + i]["04-08-18"] = {};
                value.slots["A-" + i]["04-09-18"] = {};
                value.slots["A-" + i]["04-10-18"] = {};
                $.each(value.slots["A-"+i], function(key){
                    for(var j = 0; j < 24; j++){
                        value.slots["A-"+i][j]={
                            status: "open",
                            user: "none"
                        }
                    }
                });
            }
            obj[key] = value;
        });
        database.ref("parking").set(obj);
    })
});
