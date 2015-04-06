<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Create.aspx.cs" MasterPageFile="/Umbraco/masterpages/umbracoDialog.Master" Inherits="Flowmaster.App_Plugins.Flowmaster.BackOffice.Create" %>

<%@ Register Namespace="umbraco" TagPrefix="umb" Assembly="umbraco" %>
<%@ Register TagPrefix="cc1" Namespace="umbraco.uicontrols" Assembly="controls" %>
<%@ Register TagPrefix="umb" Namespace="ClientDependency.Core.Controls" Assembly="ClientDependency.Core" %>

<asp:Content ContentPlaceHolderID="body" runat="server">
    <style>
        input, textarea{width:250px;}
    </style>
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
                    createChart();
                }
            });

            var chartType = parent.document.getElementById("left").getAttribute("charttype").toString();
            var chartTypeText = (chartType == "Flowchart" ? "Flowchart" : "Organizational Chart");

            jQuery(".umb-pane h5.ng-binding").text("Create a New " + chartTypeText);
            jQuery("#create").text("Create " + chartTypeText);

        });
        function createChart() {
            var chartType = parent.document.getElementById("left").getAttribute("charttype").toString();
            var chartTypeText = (chartType == "Flowchart" ? "Flowchart" : "Organizational Chart");
            var chartName = jQuery("#CName").val().toString();
            if (chartName == "") {
                jQuery("#errorMessageName").css("visibility", "visible");
            } else {
                try {
                    jQuery.ajax({
                        type: "POST",
                        url: "/App_Plugins/Flowmaster/BackOffice/Create.aspx/Submit",
                        data: "{ chartName: '" + chartName + "', chartType: '" + chartType + "'}",
                        contentType: "application/json; charset=utf-8",
                        dataType: "json"
                    }).done(function (data) {
                        var index = window.top.location.toString().indexOf("/flowmaster");
                        window.top.location = window.top.location.toString().substr(0, index + 11) + "/FlowmasterTree/edit/" + data.d;
                        window.top.location.reload();
                    });
                } catch (e) {
                    alert(e);
                }
            }
        }
    </script>
    <div class="umb-pane">
        <h5 class="ng-binding">Create a New Chart</h5>
        <asp:TextBox placeholder="Enter Chart Name..." ClientIDMode="Static" runat="server" ID="CName"></asp:TextBox>
        <p style="color:red;visibility:hidden;" id="errorMessageName">You must enter a name.</p>
        <asp:LinkButton runat="server" ClientIDMode="Static" ID="create" CssClass="btn btn-primary" Text="Create Chart" OnClientClick="createChart();return false;"></asp:LinkButton>
    </div>
</asp:Content>
