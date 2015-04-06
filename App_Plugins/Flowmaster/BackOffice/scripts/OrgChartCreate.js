// ---------------
// Save OrgChart
// ---------------

var employeeArr = [];
var existingConnections = [];

function saveBackend(archive) {
    var boxes = "";
    $(".dragged-emp").each(function () {
        var name = $(this).children("input[name='name']").val();
        var pos = $(this).children("input[name='position']").val();
        employeeArr.push({
            id: $(this).attr("id"),
            name: name,
            position: pos,
            imgUrl: $(this).attr("emp-img").toString(),
            left: parseInt($(this).css("left")),
            top: parseInt($(this).css("top")),
            colour: $(this).css("background-color")
        });
    });
    var currentId = $("#pageId").val().toString();
    var connections = JSON.stringify(existingConnections);
    var nodes = JSON.stringify(employeeArr);
    try {
        jQuery.ajax({
            type: "POST",
            url: "/App_Plugins/Flowmaster/BackOffice/EditOrg.aspx/Submit",
            data: "{ id: '" + currentId
                    + "', connections: '" + connections
                    + "', nodes: '" + nodes
                    + "', archive: '" + archive
                    + "'}",
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        }).done(function () {
            window.top.location.reload();
        });
    } catch (e) {
        alert(e);
    }
}

// --------------------------
// Save OrgChart Dialog Flow
// --------------------------

function save(){
    $("#save-dialog").dialog({
        resizable: false,
        draggable: false,
        height: 200,
        width: 400,
        modal: true,
        buttons: {
            "Yes": function () {
                saveBackend(true);
                $(this).siblings(".ui-dialog-titlebar").find("button").remove();
                $(this).siblings(".ui-dialog-buttonpane").remove();
                $(this).children("p").text("Saving and archiving...");
                $(this).children("img").show();
            },
            "No": function () {
                saveBackend(false);
                $(this).siblings(".ui-dialog-titlebar").find("button").remove();
                $(this).siblings(".ui-dialog-buttonpane").remove();
                $(this).children("p").text("Saving...");
                $(this).children("img").show();
            }
        }
    });
}

// -----------------------------
// Restore OrgChart Dialog Flow
// -----------------------------

function restore() {
    $("#restore-dialog").dialog({
        resizable: false,
        draggable: false,
        height: 200,
        width: 400,
        modal: true,
        buttons: {
            "Yes": function () {
                $("#save-dialog").dialog({
                    resizable: false,
                    draggable: false,
                    height: 200,
                    width: 400,
                    modal: true,
                    buttons: {
                        "Yes": function () {
                            deleteArchiveBackend(false);
                            saveBackend(true);
                            $(this).siblings(".ui-dialog-titlebar").find("button").remove();
                            $(this).siblings(".ui-dialog-buttonpane").remove();
                            $(this).children("p").text("Restoring and archiving...");
                            $(this).children("img").show();
                        },
                        "No": function () {
                            deleteArchiveBackend(false);
                            saveBackend(false);
                            $(this).siblings(".ui-dialog-titlebar").find("button").remove();
                            $(this).siblings(".ui-dialog-buttonpane").remove();
                            $(this).children("p").text("Restoring...");
                            $(this).children("img").show();
                        }
                    }
                });
                $(this).dialog("close");
            },
            "No": function () { $(this).dialog("close"); }
        }
    });
}

// -------------------------
// Delete Archived OrgChart
// -------------------------

function deleteArchiveBackend(reload) {
    var currentId = $("#archive_id").val().toString();
    try {
        jQuery.ajax({
            type: "POST",
            url: "/App_Plugins/Flowmaster/BackOffice/Delete.aspx/Submit",
            data: "{ id: '" + currentId + "', archive: true }",
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        }).done(function () {
            if(reload)
                window.top.location.reload();
        });
    } catch (e) {
        alert(e);
    }
}

// -------------------------------------
// Delete Archived OrgChart Dialog Flow
// -------------------------------------

function deleteArchive() {
    $("#delete-dialog").dialog({
        resizable: false,
        draggable: false,
        height: 200,
        width: 400,
        modal: true,
        buttons: {
            "Yes": function () {
                deleteArchiveBackend(true);
                $(this).siblings(".ui-dialog-titlebar").find("button").remove();
                $(this).siblings(".ui-dialog-buttonpane").remove();
                $(this).children("p").text("Deleting from archive...");
                $(this).children("img").show();
            },
            "No": function () { $(this).dialog("close"); }
        }
    });
}

jsPlumb.ready(function () {

    // -------------------
    // Connector Defaults
    // -------------------

    var instance = jsPlumb.getInstance({
        Container:"frame",
	    DragOptions: { cursor: 'auto', zIndex: 25 },
	    PaintStyle: {
	        joinstyle: "round",
	        lineWidth: 5,
	        strokeStyle: "#1d1d1d",
	        outlineColor: "transparent",
	        outlineWidth: 20
	    },
	    HoverPaintStyle: { strokeStyle: "#d1d1d1" },
	    EndpointHoverStyle: { fillStyle: "#1d1d1d" }
    }),

    // ------------------
    // Endpoint Defaults
    // ------------------

    FMStart = {
        endpoint: "Dot",
        paintStyle: { strokeStyle: "#1d1d1d", radius: 7, lineWidth: 3 },
        connector: ["Flowchart", { stub: 25, gap: 8, cornerRadius: 5, alwaysRespectStubs: false }],
        isSource: true,
        isTarget: false,
        maxConnections:100,
        anchors: [
            ["Bottom"], ["Right"]
        ]
    },
    FMEnd = {
        endpoint: "Dot",
        paintStyle: { fillStyle: "#1d1d1d", radius: 11 },
        dropOptions: { hoverClass: "hover", activeClass: "active" },
        isSource: false,
        isTarget: true,
        maxConnections:10,
        anchors: [
            ["Top"], ["Left"]
        ]
    };

    // ---------------------------------------
    // Suspend Drawing and Initialize jsPlumb
    // ---------------------------------------

    instance.doWhileSuspended(function () {

        pushConnections = function () {
            existingConnections = [];
            $.each(instance.getConnections(), function (idx, connection) {
                var eps = connection.endpoints;
                existingConnections.push({
                    source: eps[0].getUuid(),
                    target: eps[1].getUuid()
                });
            });
        }

        // ---------------------
        // Connection Functions
        // ---------------------

        instance.bind("connection", function (info, originalEvent) {
            pushConnections();
        });
        instance.bind("click", function (connection, originalEvent) {
                $("#detach-connection").dialog({
                    resizable: false,
                    draggable: false,
                    modal:true,
                    height:80,
                    buttons: {
                        "OK": function () {
                            instance.detach(connection);
                            $(this).dialog("close");
                        },
                        "Cancel": function () {
                            $(this).dialog("close");
                        }
                    }
                });
        });
        instance.bind("connectionDetached", function (info, originalEvent) {
            pushConnections();
        });
        instance.bind("connectionMoved", function (info, originalEvent) {
        });

        instance.addEndpoint('initTest').setVisible(false);

        // ---------------------------
        // Drag/Drop/Delete functions
        // ---------------------------

        var randID = "",
        getRandomInt = function(){
            return Math.floor(Math.random() * (999999)).toString();
        }
        $(".drag").click(function () {
            var newthing = $(this).clone(true);
            randID = getRandomInt();
            draggedId = newthing.attr('id').substring(5);
            draggedClass = "dragged-" + draggedId;
            $('<div id="' + draggedId + '-' + randID + '" class="' + draggedClass + '" emp-img>' +
                '<input type="text" placeholder="Position" name="position" maxlength="35"/>' +
                '<input type="text" placeholder="Name" name="name" maxlength="35"/>' +
                '<a class="remove">&#10006;</a>' +
                '<a class="emp-icon"></a></div>').removeClass("drag")
            .appendTo("#frame");
            instance.addEndpoint(draggedId + "-" + randID, { anchor: FMStart.anchors[0], uuid: draggedId + "-" + randID + "sc1" }, FMStart);
            instance.addEndpoint(draggedId + "-" + randID, { anchor: FMStart.anchors[1], uuid: draggedId + "-" + randID + "sc2" }, FMStart);
            instance.addEndpoint(draggedId + "-" + randID, { anchor: FMEnd.anchors[0], uuid: draggedId + "-" + randID + "tg1" }, FMEnd);
            instance.addEndpoint(draggedId + "-" + randID, { anchor: FMEnd.anchors[1], uuid: draggedId + "-" + randID + "tg2" }, FMEnd);
            instance.draggable(jsPlumb.getSelector(".dragged-emp"), { grid: [90, 130] });
            attachEvents();
        });

        $(document).on('click', '.remove', function () {
            instance.removeAllEndpoints($(this).parent().attr("id"));
            if ($(this).parent().hasClass("existing"))
                deleteMembers.push($(this).attr("id"));
            window.parent.$("#image_picker").hide();
            $(this).parent().animate(
                { height: "0", width: "0" },
                { duration: 240, complete: function () { $(this).remove() } }
            );
        });

        // ------------------------
        // Initialize on Page Load
        // ------------------------

        function attachEvents() {
            // scroll to top/left 0 when a box is generated
            $(".drag-emp").click(function (e) {
                e.preventDefault();
                $('.umb-panel-nobody').animate({
                    scrollLeft: 0,
                    scrollTop: 0
                }, 800);
            });
            $(".dragged-emp").click(function () {
                $(".dragged-emp").removeClass('current_employee');
                $(this).addClass('current_employee');
                window.parent.$("#image_picker").show();
            });
            $(document).mouseup(function (e) {
                var container = $(".dragged-emp, .colpick, #toolbox");
                if (!container.is(e.target) && container.has(e.target).length === 0)
                    $(".dragged-emp").removeClass('current_employee');
                window.parent.$("#image_picker").hide();
            });
            // EMPLOYEE IMAGE
            $(".emp-icon").click(function () {
                var title = $(this).siblings("[name=name]").val() + " - " + $(this).siblings("[name=position]").val();
                $("#employee-image img").attr("src", $(this).parent().attr("emp-img"));
                $("#active-emp").val($(this).parent().attr("id"));
                setTimeout(function () {
                    $("#employee-image").dialog({
                        title: title,
                        draggable: false,
                        modal: true,
                        height: "auto",
                        width: 270,
                        position: { my: "center", at: "center", of: $(".umbracoPage") }
                    });
                    $("#rem-emp-img").focusout();
                }, 30);
            });
            $("#rem-emp-img").click(function () {
                $('#' + $("#active-emp").val()).attr("emp-img", "");
                $('#' + $("#active-emp").val()).find('.emp-icon').hide();
                $('#employee-image').dialog('close');
            });
        }

        $(window).load(function () {
            setTimeout(function () {
                $(".dragged-emp").each(function () {
                    instance.addEndpoint($(this).attr('id').toString(), { anchor: FMStart.anchors[0], uuid: $(this).attr('id').toString() + "sc1" }, FMStart);
                    instance.addEndpoint($(this).attr('id').toString(), { anchor: FMStart.anchors[1], uuid: $(this).attr('id').toString() + "sc2" }, FMStart);
                    instance.addEndpoint($(this).attr('id').toString(), { anchor: FMEnd.anchors[0], uuid: $(this).attr('id').toString() + "tg1" }, FMEnd);
                    instance.addEndpoint($(this).attr('id').toString(), { anchor: FMEnd.anchors[1], uuid: $(this).attr('id').toString() + "tg2" }, FMEnd);
                    if ($(this).attr("emp-img") != "")
                        $(this).find(".emp-icon").show();
                });
                instance.draggable(jsPlumb.getSelector(".dragged-emp"), { grid: [90, 130] });
                if ($('#FMConnectionsInit').val() != "") {
                    var exCon = JSON.parse($('#FMConnectionsInit').val());
                    for (i = 0; i < exCon.length; i++)
                        var connection = instance.connect({ uuids: [exCon[i].source, exCon[i].target], fireEvent: false });
                }
                attachEvents();
                pushConnections();
            }, 30);
        });
    });
    // --------------------------
    // Initialize Colpick Plugin
    // --------------------------

    function rgbToObj(rgbString) {
        var second = rgbString.substr(rgbString.indexOf(',') + 1);
        var third = second.substr(second.indexOf(',') + 1);

        var r = rgbString.substr(4, rgbString.indexOf(',') - 4);
        var g = second.substr(1, second.indexOf(',') - 1);
        var b = third.substr(1, third.indexOf(')') - 1);
        return { r: parseInt(r), g: parseInt(g), b: parseInt(b) };
    }

    function colboxInit(num) {
        for (var i = num; i > 0; i--) {
            $('.color-box' + i).colpick({
                colorScheme: 'dark',
                submit: 1,
                layout: 'rgb',
                color: rgbToObj($('#color-box' + i).css('background-color')),
                onSubmit: function (hsb, hex, rgb, el) {
                    $(el).css('background-color', 'rgb(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ')');
                    $('.current_employee').css('backgroundColor', 'rgb(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ')');
                    $(el).colpickHide();
                },
                onChange: function (hsb, hex, rgb) {
                    $('.current_employee').css('backgroundColor', 'rgb(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ')');
                }
            });
        }
    }
    colboxInit(6);

});
