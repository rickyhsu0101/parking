$(document).ready(function(){
    $('.sidenav').sidenav();
    $('.collapsible').collapsible();
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
            $("#currentEmail").text(email);
            $("#createForm").addClass("noneDisplay");
            $("#loginForm").addClass("noneDisplay");
            $("#signoutForm").removeClass("noneDisplay");
            $("#login, #login2").text(email);
            database.ref("users/" + email.split(".")[0]).once("value", function(snapshot){
                var data = snapshot.val();
                $("#emailInfo").text(email);
                $("#account").text(data.accountType);
                $("#accountInfo").removeClass("noneDisplay");
                generateCurrentReservation(data.currentRes);
                $("#reservation").removeClass("noneDisplay");
                generateHistory(data.history);
                $("#history").removeClass("noneDisplay");
                generateFavorites(data.favorite);
                $("#favorites").removeClass("noneDisplay");
                generateReviews(data.reviews);
                $("#reviews").removeClass("noneDisplay");
                if(data.accountType == "Lot Owner"){
                    generateLot(data.lot);
                    $("#parkingLots").removeClass("noneDisplay");
                }
            });
            currentUser = user;
        }
    }else{
        $("#createForm").addClass("noneDisplay");
        $("#loginForm").removeClass("noneDisplay");
        $("#signoutForm").addClass("noneDisplay");
        $("#login, #login2").text("Login");
        currentUser = null;
        resetAccountInfo();
    }
});
function resetAccountInfo(){
    $("#accountInfo").addClass("noneDisplay");
    $("#reservation").addClass("noneDisplay");
    $("#history").addClass("noneDisplay");
    $("#favorites").addClass("noneDisplay");
    $("#reviews").addClass("noneDisplay");
    $("#parkingLots").addClass("noneDisplay");
    $("#reservationContent").empty();
    $("#historyContent").empty();
    $("#favoriteContent").empty();
    $("#reviewsContent").empty();
    $("#parkingContent").empty();
}
function generateCurrentReservation(data){
    var source = $("#currentRes-template").html();
    var template = Handlebars.compile(source);
    $.each(data, function(key, value){
        if(key != "dummy"){
            var context = { 
                time: key,
                lotName: value.lotName,
                duration: value.duration + " hr",
                amountDue: "$" + value.amountDue
            };
            var html = template(context);
            $("#reservationContent").append(html);
        }
        
    });
}
function generateHistory(data){
    var source = $("#history-template").html();
    var template = Handlebars.compile(source);
    $.each(data, function(key, value){
        if(key != "dummy"){
            var context = {
                time: key,
                lotName: value.lotName,
                duration: value.duration + " min",
                amountDue: "$" + value.amountDue
            }
            if(value.paid){
                context.paid = "true";
            }else{
                context.paid = "false";
            }
            var html = template(context);
            $("#historyContent").append(html);
        }
        
    });
    
}
function generateFavorites(data){
    var source = $("#favorites-template").html();
    var template = Handlebars.compile(source);
    $.each(data, function(key, value){
        if(key!= "default"){
            var context = {
                lot: key,
                visited: value.visited
            };
            database.ref("parking/" + key).once("value", function(snapshot){
                var data = snapshot.val();
                context.location = data.location;
                context.rate = data.rate;
                var html = template(context);
                $("#favoriteContent").append(html);
            });
        }
    });
}
function generateReviews(data){
    var source = $("#reviews-template").html();
    var template = Handlebars.compile(source);
    $.each(data, function(key, value){
        if(key!="dummy"){
            var context = {
                time: key,
                lotName: value.parkingLot,
                duration: value.duration,
                comment: value.comment
            };
            var html = template(context);
            $("#reviewsContent").append(html);
        }
    });
}
function generateLot(data){
    var source = $("#parkingLots-template").html();
    var template = Handlebars.compile(source);
    $.each(data, function(key, value){
        console.log(value);
        if(key!="dummy"){
            var context = {
                lot: key,
                location: value.address,
                rate: value.rate + "/hr",
            }
            var html = template(context);
            $("#parkingContent").append(html);
        }
    });
}
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
            accountType: "Parker",
            currentRes: {
                dummy: "dummy"
            },
            favorite: {
                default: "dummy"
            },
            history: {
                dummy: "dummy"
            },
            reviews: {
                dummy: "dummy"
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

$(document).on("click", ".visit", function(){
    sessionStorage.setItem("selectedLot", $(this).attr("data-parkingLot"));
     open("/lot", "_self");    
});
$(document).on("click", ".remove", function(){
    var lotName = $(this).attr("data-remove");
    var element = $(this);
    var data = null;
    database.ref("users/" + currentUser.email.split(".")[0] + "/favorite").once("value", function(snapshot){
        data = snapshot.val();
        delete data[lotName];
        database.ref("users/" + currentUser.email.split(".")[0] + "/favorite/" + lotName).remove();
        element.parent().parent().parent().remove();
    }); 
});
$("#querySearch2").on("input", function(){
    $("#querySearch").val($("#querySearch2").val());
});
$("#querySearch").on("input", function(){
    $("#querySearch2").val($("#querySearch").val());
});
