var currentDiv = 0;

function saveArticleNr() {
    $("div[rel|='selected']").attr('title', $('#article_input').val());
}

function getArticleNr() {
    var articleNr = $("div[rel|='selected']").attr('title');
    $('#article_input').val(articleNr);
    $('#article_form').css('display', 'block');
}

function selectArea(area_id) {
    deselectAll();

    var area = $('div#area_' + area_id);

    if ($.browser.msie) {
        area.css('background', 'white');
    } else {
        area.css('background', 'rgba(255,255,255,0.8)');
    }

    area.css('border', '2px black solid');
    area.attr('rel', 'selected');
    area.resizable('enable');
    area.draggable('enable');
    area.resizable({ containment: $('div#wrapper') });
    area.draggable({ containment: $('div#wrapper') });
    getArticleNr();
}

function deselectAll() {
    $('[id^=area_]').css('border', '1px black solid');
    $('[id^=area_]').css('background', 'white');
    $('[id^=area_]').attr('rel', 'not_selected');
    $('[id^=area_]').resizable('disable');
    $('[id^=area_]').draggable('disable');
    $('#article_form').css('display', 'none');
}

function deleteArea() {
    var area_id = $("div[rel|='selected']")
        .attr('id')
        .split('area_');
    var selectListArea = $("a[href='javascript:selectArea(" + area_id[1] + ");']");
    var selectListBr = selectListArea.next();
    $("div[rel|='selected']").remove();
    selectListArea.remove();
    selectListBr.remove();
}

function deleteAllAreas() {
    $('[id^=area_]').remove();
    $('div#arealist').html('');
}

function getBasePath() {
    var imgPath = window.location.pathname.split('/');
    var basePath = '';

    for (i = 1; i < imgPath.length - 1; i++) {
        basePath += imgPath[i] + '\\';
    }

    return basePath;
}

function generateImageMap() {
    var imageSrc = $('img#photo').attr('src');

    $.get('./generate.html').success(function(data) {
        $('.generated-result').html(data);
        $('.generated-result')
            .find('#generated-image')
            .attr('src', imageSrc);

        var imageMapAreas = '<map name="generatedMap" id="imageMap">';

        $('[id^=area_]').each(function() {
            var x1 = parseInt(this.style.left);
            var y1 = parseInt(this.style.top);
            var x2 = x1 + parseInt(this.style.width);
            var y2 = y1 + parseInt(this.style.height);
            var title = $(this).attr('title');
            imageMapAreas +=
                '<area shape="rect" title="Spana in ' +
                title +
                '" coords="' +
                x1 +
                ',' +
                y1 +
                ',' +
                x2 +
                ',' +
                y2 +
                '" href="#' +
                title +
                '" alt="' +
                title +
                '">';
        });

        imageMapAreas += '</map>';

        $('.generated-result').append(imageMapAreas);
    });
}

function changeImage(image) {
    currentDiv = 0;
    deselectAll();
    deleteAllAreas();
    $('img#photo').attr('src', 'images/' + image);
    $('img#preview_photo').attr('src', 'images/' + image);
}

$(document).ready(function() {
    var drawRect = false;

    $('img#photo').mousedown(function(e) {
        //Don't bind to div#wrapper because the created areas will get this trigger also
        //Making new areas when clicking inside an existing area.
        e.preventDefault();

        drawRect = true;
        currentDiv = currentDiv + 1;
        deselectAll();

        var x = e.pageX - $('img#photo').offset().left - 20;
        var y = e.pageY - $('img#photo').offset().top - 20;
        var width = 10;
        var height = 10;

        var newDiv =
            "<div id='area_" +
            currentDiv +
            "' title='' rel='selected' onclick='selectArea(" +
            currentDiv +
            ");' style='position: absolute; top: " +
            y +
            'px; left: ' +
            x +
            'px; width: ' +
            width +
            'px; height: ' +
            height +
            "px;'></div>";
        var newAreaList = "<a href='javascript:selectArea(" + currentDiv + ");'>Area " + currentDiv + '</a><br>';
        $('div#wrapper').append(newDiv);
        $('div#arealist').append(newAreaList);

        selectArea(currentDiv);
    });

    $('div#wrapper').mousemove(function(e) {
        if (drawRect == true) {
            var divPos = $('div#area_' + currentDiv).position();
            var divWidth = e.pageX - this.offsetLeft - divPos.left - 10;
            var divHeight = e.pageY - this.offsetTop - divPos.top - 10;
            $('div#area_' + currentDiv).css('width', divWidth);
            $('div#area_' + currentDiv).css('height', divHeight);
        }
    });

    $(document).mouseup(function() {
        drawRect = false;
    });

    $('div#wrapper').mouseleave(function() {
        drawRect = false;
    });

    $('img#photo').bind('dragstart', function() {
        return false;
    });

    $(document).keydown(function(e) {
        var code = e.keyCode ? e.keyCode : e.which;

        if (code == 27 || code == 13) {
            //Abort if pressed ESC or ENTER
            drawRect = false;
        }
        if (code == 37) {
            //Move to the left
            var newLeft = parseInt($("div[rel|='selected']").css('left')) - 3;
            $("div[rel|='selected']").css('left', newLeft);
            return false;
        }
        if (code == 39) {
            //Move to the right
            var newLeft = parseInt($("div[rel|='selected']").css('left')) + 3;
            $("div[rel|='selected']").css('left', newLeft);
            return false;
        }
        if (code == 38) {
            //Move up
            var newLeft = parseInt($("div[rel|='selected']").css('top')) - 3;
            $("div[rel|='selected']").css('top', newLeft);
            return false;
        }
        if (code == 40) {
            //Move to down
            var newTop = parseInt($("div[rel|='selected']").css('top')) + 3;
            $("div[rel|='selected']").css('top', newTop);
            return false;
        }
    });
});
