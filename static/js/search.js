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