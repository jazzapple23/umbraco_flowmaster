$(document).ready(function () {

    $('body').bind('touchstart', function () { });

    //On load
    $(".dragged-doc").click(function () {
        var id = parseInt($(this).attr("umbracoid"));
        $("#loaderSpin").show();
        $.ajax({
            type: "POST",
            url: "/App_Plugins/Flowmaster/BackOffice/Content.aspx/GetContent",
            data: "{ nodeId: '" + id + "' }",
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        }).done(function (response) {
            $("#loaderSpin").hide();
            $("#box_content").html(response.d);
        });
    });

    $(".dragged-doc").each(function () {
        var elem = $(this);
        var id = parseInt($(this).attr("umbracoid"));
        $.ajax({
            type: "POST",
            url: "/App_Plugins/Flowmaster/BackOffice/Content.aspx/GetContent",
            data: "{ nodeId: '" + id + "' }",
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        }).done(function (response) {
            if (response.d.length.toString() != "0")
                elem.append('<a type="button" class="content-link" data-remodal-target="box_content" title="View Details">i</a>');
        });
    });

    //zoom in and out flowchart
    (function () {
        var $section = $('#flowchart_frontend, #orgchart_frontend');
        var $panzoom = $section.find('#frame').panzoom({
            // Default cursor style for the element
            increment: 0.3,
            minScale: 0.1,
            cursor: "default",
            $zoomIn: $section.find(".zoom-in"),
            $zoomOut: $section.find(".zoom-out"),
            $zoomRange: $section.find(".zoom-range"),
            $reset: $section.find(".reset")
        });
        $('#flowchart_frontend .dragged-doc button').on('mousedown touchstart', function (e) {
            e.stopImmediatePropagation();
        });
        $("#flowchart_frontend .dragged-doc a").click(function (event) {
            event.preventDefault();
            var url = $(this).attr('href');
            window.open(url, '_self');
        });
        $panzoom.parent().on('mousewheel.focal', function (e) {
            e.preventDefault();
            var delta = e.delta || e.originalEvent.wheelDelta;
            var zoomOut = delta ? delta < 0 : e.originalEvent.deltaY > 0;
            $panzoom.panzoom('zoom', zoomOut, {
                increment: 0.3,
                animate: true,
                focal: e
            });
            $('#flowchart_frontend .dragged-doc button').on('touches', 'changedTouches', 'targetTouches', function (e) {
                e.stopImmediatePropagation();
            });
        });
    })();

    (function ($, eventNames) {
        $('#flowchart_frontend .dragged-doc button').on('pointerdown mousedown touchstart', function (e) {
            e.stopImmediatePropagation();
        });
    });
});
