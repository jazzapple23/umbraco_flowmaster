jsPlumb.ready(function () {

    //instance (defaults)
    var instance = jsPlumb.getInstance({
        Container: "frame",
        PaintStyle: {
            joinstyle: "round",
            lineWidth: 5,
            strokeStyle: "#1d1d1d",
            outlineColor: "transparent"
        },
        Overlays: [["Arrow", { location: 1 }]]
    }),

	//endpoints and connectors
	FMStart = {
	    endpoint: "Dot",
	    paintStyle: { strokeStyle: "#1d1d1d", radius: 1, lineWidth: 3 },
	    connector: ["Flowchart", { stub: 25, gap: -3, cornerRadius: 5, alwaysRespectStubs: false }],
	    isSource: true,
	    isTarget: false,
	    maxConnections: 3,
	    anchor: ["Right", "Bottom", "Top"]
	},
    FMEnd = {
        endpoint: "Dot",
        paintStyle: { fillStyle: "#1d1d1d", radius: 1 },
        dropOptions: { hoverClass: "hover", activeClass: "active" },
        isSource: false,
        isTarget: true,
        maxConnections: 3,
        anchors: ["Left", "Top", "Bottom"]
    };

    // ------------
    // Initialize!
    // ------------

	instance.addEndpoint('initTest').setVisible(false);

	$(window).load(function () {
	    setTimeout(function () {
	        $(".dragged-doc").each(function () {
	            instance.addEndpoint($(this).attr('id').toString(), { uuid: $(this).attr('id').toString() + "sc" }, FMStart);
	            instance.addEndpoint($(this).attr('id').toString(), { uuid: $(this).attr('id').toString() + "tg" }, FMEnd);
	        });
	        $(".dragged-decision").each(function () {
	            instance.addEndpoint($(this).attr('id').toString(), { anchor: [-0.35, 0.5, -1, 0], uuid: $(this).attr('id').toString() + "tg" }, FMEnd);                        //left
	            instance.addEndpoint($(this).attr('id').toString(), { anchor: [0.5, -0.05, 0, -1], uuid: $(this).attr('id').toString() + "sc1", maxConnections: 1 }, FMStart);  //top
	            instance.addEndpoint($(this).attr('id').toString(), { anchor: [1.35, 0.5, 1, 0], uuid: $(this).attr('id').toString() + "sc2", maxConnections: 1 }, FMStart);    //right
	            instance.addEndpoint($(this).attr('id').toString(), { anchor: [0.5, 1.05, 0, 1], uuid: $(this).attr('id').toString() + "sc3", maxConnections: 1 }, FMStart);    //bottom
	        });
	        $(".dragged-end").each(function () {
	            instance.addEndpoint($(this).attr('id').toString(), { anchors: FMStart.anchors, uuid: $(this).attr('id').toString() + "sc" }, FMStart);
	            instance.addEndpoint($(this).attr('id').toString(), { anchors: FMEnd.anchors, uuid: $(this).attr('id').toString() + "tg" }, FMEnd);
	        });
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
	        $("._jsPlumb_endpoint:not(._jsPlumb_endpoint_connected)").remove();
	        instance.selectEndpoints().setEnabled(false);
	    }, 100);
	});
	
});	
