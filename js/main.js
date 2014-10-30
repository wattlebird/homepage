function calculatePosition (widthWindow, heightWindow, x, y) {
    if(widthWindow/heightWindow<1920/1080){
        return [Math.floor(x * heightWindow / 1080), Math.floor(y * heightWindow / 1080)];
    }else{
        return [Math.floor(x * widthWindow / 1920), Math.floor(y * widthWindow / 1920)];
    }
};

function randomIdx (max_int) {
    return Math.floor(max_int * Math.random());
};

$(document).ready(function(){
    var widthWindow = $(window).width();
	var heightWindow = $(window).height();
    var random = randomIdx(8);
    $("main").css({
        "background-image": "url(img/bg-" + random + ".jpg)"
    });
	if (widthWindow/heightWindow<1920/1080){
        $("main").css({
            "background-size": "auto "+heightWindow
        });
    }else{
        $("main").css({
            "background-size": widthWindow
        });
    }

    
    var bgno="";
    if(random<10){
        bgno="0"+random;
    }else{
        bgno=""+random;
    }
    $.getJSON("js/quote_"+bgno+".json", function (data) {
        var quotecards = $.map(data, function (item, idx) {
            var listitem = $('<li id="msg-' + idx + '"></li>');
            var quotecard = $('<div class="card ' + item.author + ' group"></div>');
            $('<img src="img/icon_' + item.author + '.png" />').appendTo(quotecard);
            $('<p>' + item.content + '</p>').appendTo(quotecard);
            var newposition = calculatePosition(widthWindow, heightWindow, item.x, item.y);
            listitem.css({
                "left": newposition[0],
                "top": newposition[1]
            });
            listitem.append(quotecard);
            listitem.on("mouseenter", function (e) {
                $(this).find(".card").fadeIn();
            });
            listitem.on("mouseleave", function (e) {
                $(this).find(".card").fadeOut();
            });
            return listitem;
        });
        $(".quotes").html(quotecards)
    });
});