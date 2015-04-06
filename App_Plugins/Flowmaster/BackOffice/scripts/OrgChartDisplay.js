jsPlumb.ready(function () {

    //instance (defaults)
    var instance = jsPlumb.getInstance({
        Container: "frame",
        PaintStyle: {
            joinstyle: "round",
            lineWidth: 5,
            strokeStyle: "#1d1d1d",
            outlineColor: "transparent"
        }
    }),

	//endpoints and connectors
	FMStart = {
	    endpoint: "Dot",
	    paintStyle: { strokeStyle: "#1d1d1d", radius: 1, lineWidth: 3},
	    connector: ["Flowchart", { stub: 25, gap: 0, cornerRadius: 5, alwaysRespectStubs: false }],
	    isSource: true,
	    isTarget: false,
	    maxConnections: 100,
	    anchors: [["Bottom"], ["Right"]]
	},
    FMEnd = {
        endpoint: "Dot",
        paintStyle: { fillStyle: "#1d1d1d", radius: 1 },
        dropOptions: { hoverClass: "hover", activeClass: "active" },
        isSource: false,
        isTarget: true,
        maxConnections: 10,
        anchors: [["Top"], ["Left"]]
    };

    // --------------------
    // Initialize!
    // --------------------
	instance.addEndpoint('initTest').setVisible(false);

	setTimeout(function () {
	    $(".dragged-emp").each(function () {
	        instance.addEndpoint($(this).attr('id').toString(), { anchor: FMStart.anchors[0], uuid: $(this).attr('id').toString() + "sc1" }, FMStart);
	        instance.addEndpoint($(this).attr('id').toString(), { anchor: FMStart.anchors[1], uuid: $(this).attr('id').toString() + "sc2" }, FMStart);
	        instance.addEndpoint($(this).attr('id').toString(), { anchor: FMEnd.anchors[0], uuid: $(this).attr('id').toString() + "tg1" }, FMEnd);
	        instance.addEndpoint($(this).attr('id').toString(), { anchor: FMEnd.anchors[1], uuid: $(this).attr('id').toString() + "tg2" }, FMEnd);
	        if ($(this).attr("emp-img") != "") {
	            $(this).find(".emp-icon").show();
	            $(this).append("<img class='emp-img' src='" + $(this).attr("emp-img") + "' />");
	        }
	    });
	    if ($('#FMConnectionsInit').val() != "") {
	        var exCon = JSON.parse($('#FMConnectionsInit').val());
	        for (i = 0; i < exCon.length; i++)
	            var connection = instance.connect({ uuids: [exCon[i].source, exCon[i].target], fireEvent: false });
	    }
	    $("._jsPlumb_endpoint:not(._jsPlumb_endpoint_connected)").remove();
	    instance.selectEndpoints().setEnabled(false);

	    // EMPLOYEE IMAGE
	    $(".emp-icon").hover(function () {
	        $(this).parent().css("z-index", "30");
	        $(this).siblings(".emp-img").fadeIn();
	    }, function () {
	        $(this).siblings(".emp-img").fadeOut({
	            complete: function () {
	                $(this).parent().css("z-index", "20");
	            }
	        });
	    });
	}, 50);
	
});	
