$(document).ready(function(){
    $('.sidenav').sidenav();
  });
var config = {
    apiKey: "AIzaSyCJ8dUGpXA1TwSk7DZncx3XLSYuCKvNwSE",
    authDomain: "parking-40a6e.firebaseapp.com",
    databaseURL: "https://parking-40a6e.firebaseio.com",
    projectId: "parking-40a6e",
    storageBucket: "parking-40a6e.appspot.com",
    messagingSenderId: "310491178257"
};
firebase.initializeApp(config);
var database = firebase.database();
var auth = firebase.auth();
auth.onAuthStateChanged(function(user){
    if(user){
        if(user!=null){
            var email = user.email;
            $("#currentEmail").text(email);
            $("#createForm").addClass("noneDisplay");
            $("#loginForm").addClass("noneDisplay");
            $("#signoutForm").removeClass("noneDisplay");
            $("#login, #login2").text(email);
        }
    }else{
        $("#createForm").addClass("noneDisplay");
        $("#loginForm").removeClass("noneDisplay");
        $("#signoutForm").addClass("noneDisplay");
        $("#login, #login2").text("Login");
    }
});
function login(){
    var email = $("#email").val();
    var password = $("#password").val();
    var error = false;
    auth.signInWithEmailAndPassword(email, password).catch(function (err){
        $("#email").val("");
        $("#password").val("");
        console.log(err);
        M.toast({
            html: err.message
        });
        error = true;
    });
    if(!error){
      
    }
}
function create(){
    var email = $("#emailCreate").val().trim();
    var password = $("#passwordCreate").val();
    var error = false;
    auth.createUserWithEmailAndPassword(email, password).catch(function(err){
        $("#emailCreate").val("");
        $("#passwordCreate").val("");
        console.log(err);
        M.toast({
            html: err.message
        });
        error = true;
    });
    if(!error){
        var object = {};
        object[email.split(".")[0]] = {
            watchList: {
                example: "nothing"
            }
        };
        database.ref("users").update(object);
    }
}
function logout(){
    auth.signOut().catch(function (err){
        console.log(err);
        M.toast({
            html: err.message
        });
    });
}
$("#createLink").on("click", function(){
    $("#loginForm").addClass("noneDisplay");
    $("#createForm").removeClass("noneDisplay");
});
$("#loginLink").on("click", function(){
    $("#createForm").addClass("noneDisplay");
    $("#loginForm").removeClass("noneDisplay");
});
$("#createButton").on("click", create);
$("#loginButton").on("click", login);
$("#logoutButton").on("click",logout);
