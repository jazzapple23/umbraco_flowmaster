'use strict';
(function () {

    function docCreatorEditController($scope, $rootScope, $routeParams, $element, $http, dialogService) {

        $scope.openMediaPicker = function () {
            dialogService.mediaPicker({ template: '/views/common/dialogs/mediaPicker.html', callback: populatePicture });
        }
        function populatePicture(item) {
            jQuery('iframe#right').contents().find('.current_employee:eq(0)').attr("emp-img", item.image + "?anchor=center&mode=crop&width=255&height=300");
            jQuery('iframe#right').contents().find('.current_employee:eq(0)').find(".emp-icon").show();
        }

        $scope.id = $routeParams.id;
        var archive, elemName, nodeName, boxes, existingConnections, anArchiveId, chartId, archiveId, originalId;
        var archiveHtml, newest = "";

        var xmlArchive = new XMLHttpRequest();
        xmlArchive.open("GET", "/App_Plugins/Flowmaster/BackOffice/content/FlowmasterArchive.xml?t=" + Math.random(), false);
        xmlArchive.send();
        var xmlDOMArchive = xmlArchive.responseXML;

        var xml = new XMLHttpRequest();
        xml.open("GET", "/App_Plugins/Flowmaster/BackOffice/content/Flowmaster.xml?t=" + Math.random(), false);
        xml.send();
        var xmlDOM = xml.responseXML;

        archiveId = jQuery(xmlDOMArchive).find("Flowchart#" + $scope.id).attr("id");

        function loadChart(archiveId) {
            
            archive = (archiveId != null ? true : false);
            var xmlType = (archive ? xmlDOMArchive : xmlDOM);
            var xmlId = (archive ? archiveId : $scope.id);
            chartId = jQuery(xmlType).find("#" + xmlId).attr("chartId");
            elemName = jQuery(xmlType).find("#" + xmlId)[0].nodeName;
            var xmlNode = jQuery(xmlType).find("[chartId='" + chartId + "'][id='" + xmlId + "']");

            nodeName = xmlNode.find("name").text();
            existingConnections = xmlNode.find("connections").text();
            boxes = "";

            if (elemName == "Flowchart")
            {
                xmlNode.find("box").each(function () {
                    boxes +=
                    '<div class="box-wrap" style="left: ' + jQuery(this).attr("left") + 'px; top: ' + jQuery(this).attr("top") + 'px;">' +
                    '<div umbracoid="' + jQuery(this).attr("umbracoId") + '" id="' + jQuery(this).attr("id") + '" class="dragged-doc existing" style="background-color: ' + jQuery(this).attr("colour") + ';">' +
                    '<textarea val="' + jQuery(this).attr("name") + '"></textarea>' +
                    '<a class="remove">✖</a>' +
                    '<a class="contLink icon-arrow-right" title="Open &quot;' + jQuery(this).attr("name") + '&quot; in Content" target="_blank" href="/umbraco#/content/content/edit/' + jQuery(this).attr("umbracoId") + '"></a>' +
                    '</div></div>';
                });
                xmlNode.find("decision").each(function () {
                    var type = (jQuery(this).attr("type") == "end" ? 'end' : 'decision');
                    var subType = (jQuery(this).attr("type") == "end" ? '' : jQuery(this).attr("type"));
                    var textPart = (subType == "with-text" ? '<textarea val="' + jQuery(this).attr("text") + '"></textarea>' : '');
                    boxes +=
                    '<div class="box-wrap" style="left: ' + jQuery(this).attr("left") + 'px; top: ' + jQuery(this).attr("top") + 'px;">' +
                    '<div id="' + jQuery(this).attr("id") + '" class="dragged-' + type + ' ' + subType + ' existing" style="background-color: ' + jQuery(this).attr("colour") + ';">' +
                    textPart +
                    '<a class="remove">✖</a>' +
                    '</div></div>';
                });
            }
            else
            {
                xmlNode.find("employee").each(function () {
                    boxes +=
                    '<div id="' + jQuery(this).attr("id") + '" class="dragged-emp" style="background-color:' + jQuery(this).attr("colour") + '; left: ' + jQuery(this).attr("left") + 'px; top: ' + jQuery(this).attr("top") + 'px; height: 50px; width: 130px;" emp-img="' + jQuery(this).attr("imgUrl").toString() + '">' +
                    '<input type="text" placeholder="Position" name="position"  value="' + jQuery(this).attr("position") + '" maxlength="35">' +
                    '<input type="text" placeholder="Name" name="name" value="' + jQuery(this).attr("name") + '" maxlength="35">' +
                    '<a class="remove">✖</a>' +
                    '<a class="emp-icon"></a>' +
                    '</div>';
                });
            }

            if (elemName == "Flowchart") {
                $scope.legacyPath = decodeURIComponent("/App_Plugins/Flowmaster/BackOffice/EditFlow.aspx");
                originalId = jQuery(xmlDOM).find("[chartId='" + chartId + "']").attr("id");
                newest = (archive ? "<a href='/umbraco/#/flowmaster/FlowmasterTree/edit/" + originalId + "' target='_top' id='current_version' class='btn'>Newest</a>" : "");
                if (jQuery(xmlDOMArchive).find("[chartId='" + chartId + "']").size() < 1)
                    archiveHtml = "";
                else if (jQuery(xmlDOMArchive).find("[chartId='" + chartId + "']").size() < 2 && archive)
                    archiveHtml = "<a  href='/umbraco/#/flowmaster/FlowmasterTree/edit/" + originalId + "' target='_top' style='position:relative;top:-2px;left:14px;' id='current_version' class='btn'>Newest</a>";
                else
                    archiveHtml = "<a id='view_archive'>View Other Versions</a><div id='archive_list'><h5>Archive</h5>" + newest;

                jQuery(xmlDOMArchive).find("[chartId='" + chartId + "']").each(function () {
                    if (jQuery(this).attr("id") != $scope.id)
                        archiveHtml += "<a href='/umbraco/#/flowmaster/FlowmasterTree/edit/" + jQuery(this).attr("id") + "' target='_top' class='archive_item'>" + jQuery(this).attr("time") + "</a>";
                });

            } else if (elemName == "OrgChart") {
                $scope.legacyPath = decodeURIComponent("/App_Plugins/Flowmaster/BackOffice/EditOrg.aspx");
                jQuery('iframe#right').load(function () { jQuery('iframe#right').contents().find('#archive_id').val(archiveId); });
                newest = (archive ? "<a id='current_version' class='btn'>Newest</a>" : "");

                // Archive Actions
                if (jQuery(xmlDOMArchive).find("[chartId='" + $scope.id + "']").size() < 1)
                    archiveHtml = "";
                else if (jQuery(xmlDOMArchive).find("[chartId='" + $scope.id + "']").size() < 2 && archive)
                    archiveHtml = "<a style='position:relative;top:-2px;left:14px;' id='current_version' class='btn'>Newest</a>"
                else
                    archiveHtml = "<a id='view_archive'>View Other Versions</a><div id='archive_list'><h5>Archive</h5>" + newest;

                // Show the rest of the archived items
                jQuery(xmlDOMArchive).find("[chartId='" + chartId + "']").each(function () {
                    if (jQuery(this).attr("id") != archiveId)
                        archiveHtml += "<a class='archive_item' id='" + jQuery(this).attr("id") + "'>" + jQuery(this).attr("time") + "</a>";
                });
            }
        }

        //Initialize Page

        loadChart(archiveId);

        var iFrame = jQuery('iframe#right');
        jQuery('iframe#right').load(function () {
            iFrame.contents().find('#frame').html(boxes);
            iFrame.contents().find('#FMConnectionsInit').val(existingConnections);
            iFrame.contents().find('#pageId').val($scope.id);
            iFrame.contents().find('#chart_title').html(nodeName + archiveHtml);

            if (elemName == "Flowchart") {
                iFrame.contents().find('#archive_flag').val(archive);
                iFrame.contents().find('#original_id').val(originalId);

            } else if (elemName == "OrgChart") {
                iFrame.contents().find('.archive_item').click(function () {
                    document.getElementById('right').contentWindow.location.reload();
                    loadChart(jQuery(this).attr('id'));
                });
                iFrame.contents().find('#current_version').click(function () {
                    document.getElementById('right').contentWindow.location.reload();
                    loadChart();
                });
            }

            iFrame.contents().find('#view_archive').mouseenter(function () {
                iFrame.contents().find("#archive_list").fadeIn(500);
            });
            iFrame.contents().find('#archive_list').mouseleave(function () {
                jQuery(this).fadeOut(500);
            });

            if (archive) {
                iFrame.contents().find("#FMToolbar #save").text("Restore");
                iFrame.contents().find("#FMToolbar #save").attr("onclick", "restore();return false;");
                iFrame.contents().find("#FMToolbar").append(
                    '<a id="delete" style="background-color:red;color:white;" class="btn" onclick="deleteArchive();return false;">Delete from Archive</a>'
                );
                iFrame.contents().find('#frame').append(
                    "<div id='disable-actions' style='position:fixed;width:100vw;height:100vh;top:99px;left:0;z-index:101;'></div>"
                );
                var disHeight = iFrame.contents().find('#disable-actions').height();
                var disWidth = iFrame.contents().find('#disable-actions').width();
                iFrame.contents().find('#disable-actions').css("height", disHeight - 114);
                iFrame.contents().find('#disable-actions').css("width", disWidth - 15);
            } else
                iFrame.contents().find("#FMToolbar #save").attr("onclick", "save();return false;");

            iFrame.contents().find(".dragged-doc .remove").click(function () {
                UmbClientMgr.mainWindow().UmbSpeechBubble.ShowMessage('<%= umbraco.BasePages.BasePage.speechBubbleIcon %>', 'Warning', 'Any content associated with this step will be removed once you click Save.');
                jQuery(".alert-info").css("background-color", "#ff3322");
            });
        });
    };
    angular.module("umbraco").controller('Flowmaster.FlowmasterTree.EditController', docCreatorEditController);
})();
