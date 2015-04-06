<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Delete.aspx.cs" MasterPageFile="/Umbraco/masterpages/umbracoDialog.Master" Inherits="Flowmaster.App_Plugins.Flowmaster.BackOffice.Delete" %>
<%@ Register Namespace="umbraco" TagPrefix="umb" Assembly="umbraco" %>
<%@ Register TagPrefix="cc1" Namespace="umbraco.uicontrols" Assembly="controls" %>
<%@ Register TagPrefix="umb" Namespace="ClientDependency.Core.Controls" Assembly="ClientDependency.Core" %>

<asp:Content ContentPlaceHolderID="body" runat="server">
    <script type="text/javascript">
        function callDelete() {
            var id = UmbClientMgr.mainTree().getActionNode().nodeId.toString();
            try {
                jQuery.ajax({
                    type: "POST",
                    url: "/App_Plugins/Flowmaster/BackOffice/Delete.aspx/Submit",
                    data: "{ id: '" + id + "', archive: false}",
                    contentType: "application/json; charset=utf-8",
                    dataType: "json"
                }).done(function () {
                    var index = window.top.location.toString().indexOf("/flowmaster");
                    window.top.location = window.top.location.toString().substr(0, index + 11);
                    window.top.location.reload();
                });
            } catch (e) {
                alert(e);
            }
        }
    </script>
    <div class="umb-pane">
        <h5 class="ng-binding">Delete Chart</h5>
        <p>Are you sure you want to delete this Chart?</p>
        <a onclick="callDelete();" class="btn btn-primary">Delete</a>
    </div>

</asp:Content>
