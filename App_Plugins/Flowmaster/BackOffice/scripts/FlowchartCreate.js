// ---------------
// Save Flowchart
// ---------------

var boxArr = [];
var decisionArr = [];
var existingConnections = [];

function saveBackend(archive) {
    var TA = "";
    $(".dragged-doc").each(function () {
        textVal = $(this).children("textarea").val();
        var umbracoId = ($(this).hasClass("existing") ? parseInt($(this).attr("umbracoId")) : 0);
        var isNew = ($(this).hasClass("existing") ? false : true);

        boxArr.push({
            umbracoId: umbracoId,
            docId: $(this).attr("id").toString(),
            name: textVal,
            colour: $(this).css("background-color").toString(),
            left: parseInt($(this).parent().css("left")),
            top: parseInt($(this).parent().css("top")),
            isNew: isNew,
            delete: false
        });
    });
    $(".dragged-decision").each(function () {
        if ($(this).hasClass("with-text"))
            textVal = $(this).children("textarea").val();
        var type = ($(this).hasClass("with-text") ? "with-text" : "no-text");

        decisionArr.push({
            docId: $(this).attr("id").toString(),
            left: parseInt($(this).parent().css("left")),
            top: parseInt($(this).parent().css("top")),
            type: type,
            text: textVal,
            colour: $(this).css("background-color").toString()
        });
    });
    $(".dragged-end").each(function () {
        decisionArr.push({
            docId: $(this).attr("id").toString(),
            left: parseInt($(this).parent().css("left")),
            top: parseInt($(this).parent().css("top")),
            type: "end",
            text: "",
            colour: $(this).css("background-color").toString()
        });
    });
    console.log(decisionArr)
    var currentId = $("#pageId").val().toString();
    var boxes = JSON.stringify(boxArr);
    var decisions = JSON.stringify(decisionArr);
    var connections = JSON.stringify(existingConnections);
    
    try {
        jQuery.ajax({
            type: "POST",
            url: "/App_Plugins/Flowmaster/BackOffice/EditFlow.aspx/Submit",
            data: "{ id: '" + currentId
                + "', connections: '" + connections
                + "', boxes: '" + boxes
                + "', decisions: '" + decisions
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

// ---------------------------
// Save Flowchart Dialog Flow
// ---------------------------

function save() {
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

// ------------------
// Restore Flowchart
// ------------------

function restoreBackend(archive) {
    try {
        jQuery.ajax({
            type: "POST",
            url: "/App_Plugins/Flowmaster/BackOffice/EditFlow.aspx/Restore",
            data: "{ id: '" + $("#pageId").val().toString()
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

// ------------------------------
// Restore Flowchart Dialog Flow
// ------------------------------

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
                            restoreBackend(true);
                            $(this).siblings(".ui-dialog-titlebar").find("button").remove();
                            $(this).siblings(".ui-dialog-buttonpane").remove();
                            $(this).children("p").text("Restoring and archiving...");
                            $(this).children("img").show();
                        },
                        "No": function () {
                            restoreBackend(false);
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

// --------------------------
// Delete Archived Flowchart
// --------------------------

function deleteArchiveBackend() {
    var currentId = $("#pageId").val().toString();
    try {
        jQuery.ajax({
            type: "POST",
            url: "/App_Plugins/Flowmaster/BackOffice/Delete.aspx/Submit",
            data: "{ id: '" + currentId + "', archive: true }",
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        }).done(function () {
            var index = window.top.location.toString().indexOf("/flowmaster");
            window.top.location = window.top.location.toString().substr(0, index + 11) + "/FlowmasterTree/edit/" + $("#original_id").val();
            window.top.location.reload();
        });
    } catch (e) {
        alert(e);
    }
}

// --------------------------------------
// Delete Archived Flowchart Dialog Flow
// --------------------------------------

function deleteArchive() {
    $("#delete-dialog").dialog({
        resizable: false,
        draggable: false,
        height: 200,
        width: 400,
        modal: true,
        buttons: {
            "Yes": function () {
                deleteArchiveBackend();
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
        Container: "frame",
        DragOptions: { cursor: 'auto', zIndex: 25 },
        PaintStyle: {
            joinstyle: "round",
            lineWidth: 5,
            strokeStyle: "#1d1d1d",
            outlineColor: "transparent",
            outlineWidth: 20
        },
        HoverPaintStyle: { strokeStyle: "#d1d1d1" },
        EndpointHoverStyle: { fillStyle: "#1d1d1d" },
        Overlays: [["Arrow", { location: 1 }]]
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
        maxConnections: 4,
        anchors: ["Right", "Bottom", "Top"]
    },
    FMEnd = {
        endpoint: "Dot",
        paintStyle: { fillStyle: "#1d1d1d", radius: 11 },
        dropOptions: { hoverClass: "hover", activeClass: "active" },
        isSource: false,
        isTarget: true,
        maxConnections: 4,
        anchors: ["Left", "Top", "Bottom"]
    };

    // ---------------------------------------
    // Suspend Drawing and Initialize jsPlumb
    // ---------------------------------------

    instance.doWhileSuspended(function () {


        // --------------------------
        // Initialize Doc Box Labels
        // --------------------------

        initTextarea = function() {
            $(".dragged-doc textarea").each(function () {
                var ta = $(this);
                ta.css("height", "auto");
                ta.css("height", $(this)[0].scrollHeight + 'px');
                var newHeight = ta.height();
                ta.parent().css("height", newHeight);
            });
            normalizeEndpoints();
        }

        // -------------------------------
        // Normalize Location of Endpoints
        // -------------------------------

        var normalizeEndpoints = function () {
            instance.repaintEverything();
            instance.selectEndpoints({ source: $(".dragged-doc") }).setAnchor(FMStart.anchors);
            instance.selectEndpoints({ target: $(".dragged-doc") }).setAnchor(FMEnd.anchors);
        },

        pushConnections = function () {
            existingConnections = [];
            $.each(instance.getConnections(), function (idx, connection) {
                var eps = connection.endpoints;
                if (connection.getOverlay("label" + eps[1].getUuid()) != null)
                    existingConnections.push({
                        source: eps[0].getUuid(),
                        target: eps[1].getUuid(),
                        label: connection.getOverlay("label" + eps[1].getUuid()).label
                    });
                else
                    existingConnections.push({
                        source: eps[0].getUuid(),
                        target: eps[1].getUuid()
                    });
            });
        }

        // ---------------------
        // Connection Functions
        // ---------------------

        function labelHandler(type, connection, edit, docType, eps) {
            var name = $("#" + type + "Label" + docType).val();
            if (edit) {
                if (name != "" && name != null) {
                    connection.getOverlay("label" + eps[1].getUuid()).setLabel(name);
                } else {
                    if (type == "decision")
                        return;
                    connection.removeOverlay("label" + eps[1].getUuid());
                }
            } else {
                if ((name == "" || name == null) && type == "decision") {
                    instance.detach(connection);
                    return;
                }
                if (name != "" && name != null)
                    connection.addOverlay(["Label", {
                        label: name,
                        id: "label" + eps[1].getUuid(),
                        cssClass: "decisionLabel",
                        location: 0.45
                    }]);
            }
        }

        instance.bind("connection", function (info, originalEvent) {
            normalizeEndpoints();
            var eps = info.connection.endpoints;
            if (info.connection.getOverlay("label" + eps[1].getUuid()) != null || info.sourceId.indexOf("decision") == -1) {
                pushConnections();
                return;
            }
            $("#decision-label").dialog({
                width: 350,
                draggable: false,
                modal: true,
                buttons: {
                    "Confirm": function () {
                        labelHandler("decision", info.connection, false, "", eps);
                        normalizeEndpoints();
                        pushConnections();
                        $(this).dialog("close");
                    },
                    Cancel: function () {
                        instance.detach(info.connection);
                        normalizeEndpoints();
                        pushConnections();
                        $(this).dialog("close");
                    }
                }
            });
        });
        instance.bind("click", function (connection, originalEvent) {
            var label = false;
            if (connection.id.indexOf("label") > -1) {
                label = true;
                connection = connection.component;
            }
            var eps = connection.endpoints;
            if (connection.getOverlay("label" + eps[1].getUuid()) != null)
                label = true;

            var type = (connection.sourceId.indexOf("decision") > -1 ? "decision" : "doc");
            var addOrEdit = (label ? "edit" : "add");
            var docType = (connection.sourceId.indexOf("decision") > -1 ? "" : addOrEdit);

            $("#detach-or-" + addOrEdit).dialog({
                resizable: false,
                draggable: false,
                height: 140,
                modal: true,
                buttons: {
                    "Detach connection": function () {
                        instance.detach(connection);
                        normalizeEndpoints();
                        $(this).dialog("close");
                    },
                    "Label...": function () {
                        if (label)
                            $("#" + type + "Label" + docType).val(connection.getOverlay("label" + eps[1].getUuid()).getLabel());
                        $("#" + type + "-label" + docType).dialog({
                            autoOpen: true,
                            width: 350,
                            draggable: false,
                            modal: true,
                            buttons: {
                                "Confirm": function () {
                                    labelHandler(type, connection, label, docType, eps);
                                    normalizeEndpoints();
                                    pushConnections();
                                    $(this).dialog("close");
                                },
                                Cancel: function () {
                                    $(this).dialog("close");
                                }
                            }
                        });
                        $(this).dialog("close");
                    }
                }
            });
        });
        instance.bind("connectionDetached", function (info, originalEvent) {
            normalizeEndpoints();
            pushConnections();
        });
        instance.bind("connectionMoved", function (info, originalEvent) {
            normalizeEndpoints();
            pushConnections();
        });

        instance.addEndpoint('initTest').setVisible(false);

        // ---------------------------
        // Drag/Drop/Delete functions
        // ---------------------------

        var randID = "",
        getRandomInt = function () {
            return Math.floor(Math.random() * (999999)).toString();
        }
        $(".drag").click(function () {
            var newthing = $(this).clone(true);
            randID = getRandomInt();
            draggedId = newthing.attr('id').substring(5);
            draggedClass = "dragged-" + draggedId;
            if (newthing.hasClass("doc")) {
                $('<div class="box-wrap"><div id="' + draggedId + randID + '" class="' + draggedClass + ' new">' +
                  '<textarea placeholder="Procedure Name..." id="TA' + randID + '" onkeyup="initTextarea()"></textarea>' +
                  '<a class="remove">&#10006;</a></div></div>')
                .appendTo("#frame").removeClass("drag");
                initTextarea();
                instance.addEndpoint(draggedId + randID, { uuid: draggedId + randID + "sc" }, FMStart);
                instance.addEndpoint(draggedId + randID, { uuid: draggedId + randID + "tg" }, FMEnd);
            } else if (newthing.hasClass("decision")) {
                if (newthing.hasClass("with-text"))
                    $('<div class="box-wrap"><div id="' + draggedId + randID + '" class="' + draggedClass + ' with-text new">' +
                      '<textarea maxlength="40" placeholder="Decision Text..."></textarea>' +
                      '<a class="remove">&#10006;</a></div></div>')
                     .appendTo("#frame").removeClass("drag");
                else
                    $('<div class="box-wrap"><div id="' + draggedId + randID + '" class="' + draggedClass + ' no-text new">' +
                     '<a class="remove">&#10006;</a></div></div>')
                    .appendTo("#frame").removeClass("drag");
                instance.addEndpoint(draggedId + randID, { anchor: [-0.35, 0.5, -1, 0], uuid: draggedId + randID + "tg" }, FMEnd);                        // left
                instance.addEndpoint(draggedId + randID, { anchor: [0.5, -0.05, 0, -1], maxConnections: 1, uuid: draggedId + randID + "sc1" }, FMStart);  // top
                instance.addEndpoint(draggedId + randID, { anchor: [1.35, 0.5, 1, 0], maxConnections: 1, uuid: draggedId + randID + "sc2" }, FMStart);    // right
                instance.addEndpoint(draggedId + randID, { anchor: [0.5, 1.05, 0, 1], maxConnections: 1, uuid: draggedId + randID + "sc3" }, FMStart);    // bottom
            } else if (newthing.hasClass("end")) {
                $('<div class="box-wrap"><div id="' + draggedId + randID + '" class="' + draggedClass + ' new">' +
                  '<a class="remove">&#10006;</a></div></div>')
                .appendTo("#frame").removeClass("drag");
                instance.addEndpoint(draggedId + randID, { uuid: draggedId + randID + "sc" }, FMStart);
                instance.addEndpoint(draggedId + randID, { uuid: draggedId + randID + "tg" }, FMEnd);
            }
            instance.draggable(jsPlumb.getSelector(".box-wrap"), { grid: [10, 10] });
            attachEvents();
            normalizeEndpoints();
        });

        // ------------------------
        // Initialize on Page Load
        // ------------------------

        function attachEvents() {
            // scroll to top/left 0 when a box is generated
            $(".drag, .decision, .end").click(function (e) {
                e.preventDefault();
                $('.umb-panel-nobody').animate({
                    scrollLeft: 0,
                    scrollTop: 0
                }, 800);
            });
            $(".dragged-doc, .dragged-decision, .dragged-end").click(function () {
                $(".dragged-doc, .dragged-decision, .dragged-end").removeClass('current_procedure');
                $(this).addClass('current_procedure');
            });
            $(document).mouseup(function (e) {
                var container = $("#toolbox, #flowchart_backend .dragged-doc, .colpick");
                if (!container.is(e.target) // if the target of the click isn't the container...
                    && container.has(e.target).length === 0) // ... nor a descendant of the container
                    $(".dragged-doc, .dragged-decision, .dragged-end").removeClass('current_procedure');
            });
            $(".remove").click(function () {
                instance.removeAllEndpoints($(this).parent().attr("id"));
                normalizeEndpoints();
                if ($(this).parent().hasClass("existing") && $(this).parent().hasClass("dragged-doc")) {
                    boxArr.push({
                        umbracoId: parseInt($(this).parent().attr("umbracoId")),
                        docId: $(this).parent().attr("id").toString(),
                        name: "",
                        colour: "",
                        left: 0,
                        top: 0,
                        isNew: false,
                        delete: true
                    });
                }
                $(this).parents(".box-wrap").animate(
                    { height: "0", width: "0" },
                    { duration: 240, complete: function () { $(this).remove() } }
                );
            });
        }

        $(window).load(function () {
            setTimeout(function () {
                window.parent.$("#image_picker").remove();
                $("textarea").each(function () {
                    $(this).val($(this).attr("val"));
                    $(this).keyup(function () {
                        initTextarea();
                    });
                });
                $(".dragged-doc").each(function () {
                    var id = $(this).attr('id').toString();
                    instance.addEndpoint(id, { anchors: FMStart.anchors, uuid: id + "sc" }, FMStart);
                    instance.addEndpoint(id, { anchors: FMEnd.anchors, uuid: id + "tg" }, FMEnd);
                });
                $(".dragged-decision").each(function () {
                    var id = $(this).attr('id').toString();
                    instance.addEndpoint(id, { anchor: [-0.35, 0.499, -1, 0], uuid: id + "tg" }, FMEnd);                       //left
                    instance.addEndpoint(id, { anchor: [0.499, -0.04, 0, -1], uuid: id + "sc1", maxConnections: 1 }, FMStart);//top
                    instance.addEndpoint(id, { anchor: [1.35, 0.499, 1, 0], uuid: id + "sc2", maxConnections: 1 }, FMStart);//right
                    instance.addEndpoint(id, { anchor: [0.499, 1.047, 0, 1], uuid: id + "sc3", maxConnections: 1 }, FMStart);//bottom
                });
                $(".dragged-end").each(function () {
                    instance.addEndpoint($(this).attr('id').toString(), { anchors: FMStart.anchors, uuid: $(this).attr('id').toString() + "sc" }, FMStart);
                    instance.addEndpoint($(this).attr('id').toString(), { anchors: FMEnd.anchors, uuid: $(this).attr('id').toString() + "tg" }, FMEnd);
                });
                instance.draggable(jsPlumb.getSelector(".box-wrap"), { grid: [10, 10] });
                if ($('#FMConnectionsInit').val() != "") {
                    var exCon = JSON.parse($('#FMConnectionsInit').val());
                    for (i = 0; i < exCon.length; i++) {
                        var connection = instance.connect({ uuids: [exCon[i].source, exCon[i].target], fireEvent: false });
                        if (exCon[i].label != null)
                            connection.addOverlay(["Label", {
                                label: exCon[i].label,
                                id: "label" + exCon[i].target,
                                cssClass: "decisionLabel",
                                location: 0.45
                            }]);
                    }
                }
                if ($("#archive_flag").val() == "true") {
                    $('.contLink').css("z-index", "102");
                    $(".contLink").each(function () {
                        var clone = $(this).clone();
                        var parentTop = $(this).parents(".box-wrap").offset().top - 62;
                        var parentLeft = $(this).parents(".box-wrap").offset().left - 110;
                        var top = parentTop + clone.offset().top;
                        var left = parentLeft + clone.offset().left;
                        clone.css({
                            "top": top,
                            "left": left,
                            "background-color": "transparent",
                            "border": 0
                        });
                        clone.removeClass("icon-arrow-right");
                        $("#frame").append(clone);
                    });
                }
                initTextarea();
                attachEvents();
                $(document).tooltip();
                normalizeEndpoints();
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
        return {r: parseInt(r), g: parseInt(g), b: parseInt(b)};
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
                    $('.current_procedure').css('backgroundColor', 'rgb(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ')');
                    $(el).colpickHide();
                },
                onChange: function (hsb, hex, rgb) {
                    $('.current_procedure').css('backgroundColor', 'rgb(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ')');
                }
            });
        }
    }
    colboxInit(6);
});
