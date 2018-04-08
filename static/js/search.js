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
$(document).ready(function(){
    performSearch(localStorage.getItem("query"));
});
function performSearch(searchString){
    $("#results").empty();

    var location = geocodingAPICall(searchString);
    var results = placesAPICall(location);
    var source = $("#result-template").html();
    var template = Handlebars.compile(source);

    database.ref("parking").once("value", function(snapshot){
        var data = snapshot.val();
        results.forEach(function(result){
            if(result.name in data){
                if(result.formatted_address == data[result.name].address){
                    var context = {
                        name: result.name,
                        address: result.formatted_address
                    }
                    var html = template(context);
                    $("#results").append(html);
                }
            }
        });
    });
    if(results.length !=0){
        results.forEach(function(data){
            //search data base

        });
    }else{

    }
}
function placesAPICall(location){
    var queryBase = "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/textsearch/json?";
    var apiKey = "AIzaSyADdit8FiUeJ3wyTLLyyjK7fa6-NSD1tK4";

    var searchString = localStorage.getItem("query");
    var q = queryBase + "key=" + apiKey;
    q += "&query=parking";
    q += "&location=" + location.lat + "," + location.lng;
    q += "&type=parking&radius=500";
    var results = null;
    $.ajax({
        url: q,
        method: "GET",
        async: false
    }).done(function(response){
        results = response.results;
        console.log(results);
    });
    return results;
}
function geocodingAPICall(qString){
    var query = "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/geocode/json?";
    var apiKey = "AIzaSyCQq7AZHxs_uOCZ4eiWKCP3CWKO4bh_li8";
    query += "key=" + apiKey;
    query += "&address=" + qString;
    var result = null;
    $.ajax({
        url: query,
        method: "GET",
        async: false
    }).done(function(response){
        result =  response.results[0].geometry.location;
    });
    return result;
}
$(document).on("keyup", function(e){
    e.preventDefault();
    if((e.key === "Enter")&& $("#querySearch").val().length > 0){
        performSearch($("#querySearch").val());
        $("#querySearch").val("");
        $("#querySearch2").val("");
        $("#search").val("");
    }
});
$(document).on("click", ".result", function(){
    localStorage.setItem("selectedLot", $(this).find("h4").text());
    open("/lot", "_self");
});
$(window).keydown(function(event){
    if(event.keyCode ==13){
        event.preventDefault();
    }
});