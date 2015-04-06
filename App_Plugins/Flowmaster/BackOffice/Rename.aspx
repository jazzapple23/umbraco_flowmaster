<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Rename.aspx.cs" MasterPageFile="/Umbraco/masterpages/umbracoDialog.Master" Inherits="Flowmaster.App_Plugins.Flowmaster.BackOffice.Rename" %>
<%@ Register Namespace="umbraco" TagPrefix="umb" Assembly="umbraco" %>
<%@ Register TagPrefix="cc1" Namespace="umbraco.uicontrols" Assembly="controls" %>
<%@ Register TagPrefix="umb" Namespace="ClientDependency.Core.Controls" Assembly="ClientDependency.Core" %>

<asp:Content ContentPlaceHolderID="body" runat="server">
    <script type="text/javascript">
        jQuery(function () {
            for (var i = 0; i < document.forms[0].length; i++) {
                if (document.forms[0][i].type == 'text') {
                    document.forms[0][i].focus();
                    break;
                }
            }
            jQuery("#CName").keypress(function (event) {
                if (event.which == 13) {
                    event.preventDefault();
                    callRename();
                }
            });
        });
        function callRename() {
            var id = UmbClientMgr.mainTree().getActionNode().nodeId.toString();
            var newName = jQuery("#CName").val().toString();
            try {
                jQuery.ajax({
                    type: "POST",
                    url: "/App_Plugins/Flowmaster/BackOffice/Rename.aspx/Submit",
                    data: "{ id: '" + id + "', newName: '" + newName + "'}",
                    contentType: "application/json; charset=utf-8",
                    dataType: "json"
                }).done(function () {
                    window.top.location.reload();
                });
            } catch (e) {
                alert(e);
            }
        }
    </script>
    <div class="umb-pane">
        <h5 class="ng-binding">Rename this Chart?</h5>
        <input type="text" placeholder="New Chart Name..." id="CName" />
        <a onclick="callRename();" class="btn btn-primary">Rename</a>
    </div>
</asp:Content>
