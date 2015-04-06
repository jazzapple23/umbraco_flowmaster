<%@ Page Language="C#" MasterPageFile="/umbraco/masterpages/umbracoPage.Master" AutoEventWireup="true" CodeBehind="EditFlow.aspx.cs" Inherits="Flowmaster.App_Plugins.Flowmaster.BackOffice.EditFlow" ValidateRequest="False" %>
<%@ OutputCache Location="None" %>
<%@ Import Namespace="Umbraco.Core" %>
<%@ Import Namespace="Umbraco.Core.IO" %>
<%@ Register TagPrefix="cc1" Namespace="umbraco.uicontrols" Assembly="controls" %>
<%@ Register TagPrefix="umb" Namespace="ClientDependency.Core.Controls" Assembly="ClientDependency.Core" %>

<asp:Content ID="DocTypeContent" ContentPlaceHolderID="DocType" runat="server">
    <!doctype html>
</asp:Content>

<asp:Content ContentPlaceHolderID="head" runat="server">
    <script src="assets/jquery-2.1.1.min.js" type="text/javascript"></script>
    <script src="assets/jquery-ui-1.11.2.min.js" type="text/javascript"></script>
    <script src="assets/jquery.jsPlumb-1.7.2.min.js" type="text/javascript"></script>
    <script src="assets/colpick.js" type="text/javascript"></script>
    <link rel="stylesheet" href="//code.jquery.com/ui/1.11.2/themes/smoothness/jquery-ui.css">
    <link rel="stylesheet" href="assets/colpick.css">
    
    <link rel="stylesheet" type="text/css" href="/Css/Flowchart Custom.css" />
    <link rel="stylesheet" href="styles/FlowchartCreate.css" />
    <script src="scripts/FlowchartCreate.js" type="text/javascript"></script>
</asp:Content>

<asp:Content ContentPlaceHolderID="body" runat="server">
    <cc1:UmbracoPanel runat="server">
        <div class="umb-panel-header"><h1 id="chart_title"></h1></div>
        <cc1:Pane runat="server">
            <div id="flowchart_backend">
                <input type="hidden" id="pageId" />
                <input type="hidden" id="archive_flag" />
                <input type="hidden" id="original_id" />
                <asp:Literal ID="connectionsFlow" runat="server"><input type="hidden" id="FMConnectionsInit" /></asp:Literal>
                <div id="initTest" style="display: none;"></div>
                <div id="toolbox">
                    <p>Procedure</p>
                    <div id="drag-doc" class="drag doc"></div>
                    <p>Decision (no text in box)</p>
                    <div id="drag-decision" class="drag decision no-text"></div>
                    <p>Decision (with text in box)</p>
                    <div id="drag-decision" class="drag decision with-text"></div>
                    <p>Start / End</p>
                    <div id="drag-end" class="drag end"></div>
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
                    <a id="save" class="btn btn-primary" onclick="save()">Save</a>
                </div>
                <div id="save-dialog" title="Save" style="display: none;">
                    <p style="font-size:17px;display:inline;">Would you like to archive the last saved version of this flowchart?</p>
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
                <div id="detach-or-add" title="What would you like to do?"></div>
                <div id="detach-or-edit" title="What would you like to do?"></div>
                <div id="decision-label" title="Decision Label" style="display: none;">
                    <p class="validateTips">Please enter an outcome.</p>
                    <label for="decisionLabel">Label</label>
                    <input type="text" name="decisionLabel" maxlength="30" id="decisionLabel" class="text ui-widget-content ui-corner-all">
                    <input type="submit" tabindex="-1" style="position: absolute; top: -1000px">
                </div>
                <div id="doc-labeladd" title="Add Label?" style="display:none;">
                    <label for="docLabeladd">Label</label>
                    <input type="text" name="docLabeladd" maxlength="30" id="docLabeladd" class="text ui-widget-content ui-corner-all">
                    <input type="submit" tabindex="-1" style="position:absolute; top:-1000px">
                </div>
                <div id="doc-labeledit" title="Edit Label" style="display:none;">
                    <label for="docLabeledit">Label</label>
                    <input type="text" name="docLabeledit" maxlength="30" id="docLabeledit" class="text ui-widget-content ui-corner-all">
                    <input type="submit" tabindex="-1" style="position:absolute; top:-1000px">
                </div>
            </div>
        </cc1:Pane>
    </cc1:UmbracoPanel>
</asp:Content>
