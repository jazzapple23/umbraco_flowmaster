<%@ Page Language="C#" MasterPageFile="/umbraco/masterpages/umbracoPage.Master" AutoEventWireup="true" CodeBehind="EditOrg.aspx.cs" Inherits="Flowmaster.App_Plugins.Flowmaster.BackOffice.EditOrg" ValidateRequest="False"%>

<%@ OutputCache Location="None" %>
<%@ Import Namespace="Umbraco.Core" %>
<%@ Import Namespace="Umbraco.Core.IO" %>
<%@ Register TagPrefix="cc1" Namespace="umbraco.uicontrols" Assembly="controls" %>
<%@ Register TagPrefix="umb" Namespace="ClientDependency.Core.Controls" Assembly="ClientDependency.Core" %>

<asp:Content ID="DocTypeContent" ContentPlaceHolderID="DocType" runat="server">
    <!DOCTYPE html>
</asp:Content>

<asp:Content ContentPlaceHolderID="head" runat="server"> 
    <link rel="stylesheet" href="//code.jquery.com/ui/1.11.2/themes/smoothness/jquery-ui.css">
    <script src="assets/jquery-2.1.1.min.js" type="text/javascript"></script>
    <script src="assets/jquery-ui-1.11.2.min.js" type="text/javascript"></script>
    <script src="assets/jquery.jsPlumb-1.7.2.min.js" type="text/javascript"></script>
    <script src="assets/colpick.js" type="text/javascript"></script>
    <link rel="stylesheet" href="//code.jquery.com/ui/1.11.2/themes/smoothness/jquery-ui.css">
    <link rel="stylesheet" href="assets/colpick.css">

    <link rel="stylesheet" type="text/css" href="/Css/Orgchart Custom.css" />
    <link rel="stylesheet" href="styles/OrgChartCreate.css" /> 
    <script src="scripts/OrgChartCreate.js" type="text/javascript"></script>
</asp:Content>

<asp:Content ContentPlaceHolderID="body" runat="server">
    <cc1:UmbracoPanel runat="server">
        <div class="umb-panel-header"><h1 id="chart_title"></h1></div>
        <cc1:Pane runat="server">
            <div id="orgchart_backend">
                <input type="hidden" id="pageId" />
                <input type="hidden" id="archive_id" />
                <asp:literal id="connectionsOrg" runat="server"><input type="hidden" id="FMConnectionsInit"/></asp:literal>
                <div id="initTest" style="display:none;"></div>
	            <div id="toolbox">
                    <p>Employee</p>
                    <div id="drag-emp" class="drag"></div>
                    <p>Colour Picker</p>
                    <div class="color_boxes">
                        <div id="color-box1" class="color-box1"></div>
                        <div id="color-box2" class="color-box2"></div>
                        <div id="color-box3" class="color-box3"></div>
                        <div id="color-box4" class="color-box4"></div>
                        <div id="color-box5" class="color-box5"></div>
                        <div id="color-box6" class="color-box6"></div>
                    </div>
	            </div>
	            <div id="frame">
	            </div>
                <div id="FMToolbar">
                    <a id="save" class="btn btn-primary">Save</a>
                </div>
                <div id="save-dialog" title="Save" style="display: none;">
                    <p style="font-size:17px;display:inline;">Would you like to archive the last saved version of this org chart?</p>
                    <img style="display:none;margin-left:15px;" src="/umbraco/assets/img/Flowmaster/loading.gif" height="100" />
                </div>
                <div id="restore-dialog" title="Restore" style="display: none;">
                    <p style="font-size:17px;display:inline;">Are you sure you would like to restore this version?</p>
                    <img style="display:none;margin-left:15px;" src="/umbraco/assets/img/Flowmaster/loading.gif" height="100" />
                </div>
                <div id="delete-dialog" title="Delete" style="display: none;">
                    <p style="font-size:17px;display:inline;">Are you sure you would like to delete this version from the Archive?</p>
                    <img style="display:none;margin-left:15px;" src="/umbraco/assets/img/Flowmaster/loading.gif" height="100" />
                </div>
                <div id="detach-connection" title="Detach connection?"></div>
                <div id="employee-image" style="display:none;">
                    <input type="hidden" id="active-emp" />
                    <ul class="unstyled list-icons ng-scope">
                        <li style="padding-left: 21px;"><i class="icon icon-delete red"></i><a href="#" style="outline:none;" id="rem-emp-img">Remove</a></li>
                    </ul>
                    <img style="width: 255px;  margin-bottom: 30px;" />
                </div>
            </div>
        </cc1:Pane>
    </cc1:UmbracoPanel>
</asp:Content>
