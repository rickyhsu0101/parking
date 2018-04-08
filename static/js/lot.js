
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
            currentUser = user;
        }
    }else{
        $("#login, #login2").text("Login");
    }
});
function setUpSlots(lotName){
    $("#seatDiv").empty();
    database.ref("parking").once("value", function(snapshot){
        var data = snapshot.val();
        var lotData = data[lotName];
        var source = $("#slot-template").html();
        var template = Handlebars.compile(source);
        $.each(lotData.slots, function(key, value){
            var context = {
                seatId: key
            }
            var html = template(context);
            $("#seatDiv").append(html);
        });
    });
}
$(window).keydown(function(event){
    if(event.keyCode ==13){
        event.preventDefault();
    }
}); 
$(document).ready(function(){
    $('.materialboxed').materialbox();
    $('select').formSelect();
    $("#lotName").text(localStorage.getItem("selectedLot"));
    setUpSlots(localStorage.getItem("selectedLot"));
});
var seat = null;
$(document).on("click", ".slot", function(){
    seat = $(this).find("h4").text();
    //minute reset
    $("#startSelect option:not(#default)").each(function(){
        $(this).removeClass("disabled");
    });
    database.ref("parking/" + localStorage.getItem("selectedLot") + "/slots/" + seat).once("value", function(snapshot){
        var data = snapshot.val();
        $.each(data, function(key, value){
            if(value.status == "reserved"){
                $("#startSelect option[value = '"+key+"']").addClass("disabled");
            }
        });
        $("#first").addClass("noneDisplay");
        $("#second").removeClass("noneDisplay");
    });
    $("#startSelect").formSelect();
});

$(document).on("change", "#startSelect", function(){
    $("#endSelect").empty();
    $("#endSelect").formSelect();
    console.log("hello");
    var value = parseInt($(this).val());
    console.log(value);
    var counter = 0;
    for(var i = value; i < 24; i++){
        if($("#startSelect option[value='"+i+"']").hasClass("disabled")){
            break;
        }
        console.log(i);
        if(counter<3){
            var text = $("#startSelect option[value='"+(i+1)+"']").html();
            
            $("#endSelect").append("<option value='"+(i+1)+"'>"+text+"</option>");
            $("#endSelect").formSelect();
            counter++;
        }else{
            break;
        }
    }
});
$("#reserveButton").on("click", function(){
    var startIndexInc = parseInt($("#startSelect").find(":selected").val());
    var endIndexExc = parseInt($("#endSelect").find(":selected").val());
    database.ref("parking/" + localStorage.getItem("selectedLot")+"/slots/"+seat).once("value", function(snapshot){
        console.log(seat);
        console.log(snapshot);
        var data = snapshot.val();
        console.log(data);
        for(var i = startIndexInc; i < endIndexExc; i++){
            data[""+i].status = "reserved";
            data[""+i].user = currentUser.email;
        }
        database.ref("parking/" + localStorage.getItem("selectedLot")+"/slots/"+seat).set(data);
    });
    database.ref("users/" + currentUser.email.split(".")[0]).once("value", function(snapshot){
        var data = snapshot.val();
        var date = moment().format('MM-DD-YY') + " ";
        date += $("#startSelect option[value='"+startIndexInc+"']").text();
        database.ref("parking/" + localStorage.getItem("selectedLot")).once("value", function(snapshot){
            var rate = snapshot.val().rate;
            data.currentRes[date] = {
                amountDue: rate*(endIndexExc-startIndexInc),
                duration: endIndexExc-startIndexInc,
                lotName: localStorage.getItem("selectedLot")
            }
            database.ref("users/" + currentUser.email.split(".")[0]).set(data);
            $("#first").removeClass("noneDisplay");
            $("#second").addClass("noneDisplay");
        });
    });
});
$("#cancelButton").on("click", function(){
    $("#first").removeClass("noneDisplay");
    $("#second").addClass("noneDisplay");
});