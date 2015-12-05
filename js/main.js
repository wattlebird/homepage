($(document).ready(function(){
  $("#item1").on("mouseenter", function(){
    $(this).siblings().filter("img").attr("src", "img/twit.png");
    $("#item5").fadeIn(100);
  }).on("mouseout", function(){
    $(this).siblings().filter("img").attr("src", "img/headimg.png");
    $("#item5").fadeOut(100);
  })
  $("#item2").on("mouseenter", function(){
    $(this).siblings().filter("img").attr("src", "img/home.png");
    $("#item6").fadeIn(100);
  }).on("mouseout", function(){
    $(this).siblings().filter("img").attr("src", "img/headimg.png");
    $("#item6").fadeOut(100);
  })
  $("#item3").on("mouseenter", function(){
    $(this).siblings().filter("img").attr("src", "img/tech.png");
    $("#item7").fadeIn(100);
  }).on("mouseout", function(){
    $(this).siblings().filter("img").attr("src", "img/headimg.png");
    $("#item7").fadeOut(100);
  })
  $("#item4").on("mouseenter", function(){
    $(this).siblings().filter("img").attr("src", "img/culture.png");
    $("#item8").fadeIn(100);
  }).on("mouseout", function(){
    $(this).siblings().filter("img").attr("src", "img/headimg.png");
    $("#item8").fadeOut(100);
  })
}))()
