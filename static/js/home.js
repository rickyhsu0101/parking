$(document).ready(function(){
    $("#imageWrapper").fadeIn(400, function(){
        $("#statement1").fadeIn(1000, function(){
            $("#statement2").fadeIn(1000, function(){
                $("#searchWrapper").fadeIn(2000);
            });
        });
    }); 
});
$("#querySearch2").on("input", function(){
    $("#querySearch").val($("#querySearch2").val());
    $("#search").val($("#querySearch2").val());
});
$("#querySearch").on("input", function(){
    $("#querySearch2").val($("#querySearch").val());
    $("#search").val($("#querySearch2").val());
});
$("#search").on("input", function(){
    $("#querySearch").val($("#search").val());
    $("#querySearch2").val($("#search").val());
});
$("#login, #login2").on("click", function(){
    open("/login", "_self");
});
$(document).on("keyup", function(e){
    e.preventDefault();
    if((e.key === "Enter")&& $("#querySearch").val().length > 0){
        localStorage.setItem("query", $("#querySearch").val());
        open("/search", "_self");
    }
});
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
$(window).keydown(function(event){
    if(event.keyCode ==13){
        event.preventDefault();
    }
});