<%@ Control Language="C#" AutoEventWireup="true" %>
<%@ Import namespace="System" %>
<%@ Import namespace="System.Collections.Generic" %>
<%@ Import namespace="System.Linq" %>
<%@ Import namespace="System.Web" %>
<%@ Import namespace="Umbraco.Core" %>
<%@ Import namespace="Umbraco.Core.Services" %>

<script runat="server">
public void Page_Load(object sender, EventArgs e)
{
	var contentService = new ContentService();
	var contentTypeService = ApplicationContext.Current.Services.ContentTypeService;

	var orgchartsFolder = contentService.GetContentOfContentType(contentTypeService.GetContentType("OrganizationalCharts").Id).FirstOrDefault();
	var flowchartsFolder = contentService.GetContentOfContentType(contentTypeService.GetContentType("Flowcharts").Id).FirstOrDefault();
	var flowchartsArchiveFolder = contentService.GetContentOfContentType(contentTypeService.GetContentType("FlowchartsArchive").Id).FirstOrDefault();

	contentService.SaveAndPublishWithStatus(orgchartsFolder);
	contentService.SaveAndPublishWithStatus(flowchartsFolder);
	contentService.SaveAndPublishWithStatus(flowchartsArchiveFolder);
}
</script>
<html>
<body>
<h4>Installation Complete!</h4>
<p>Now to go the Flowmaster section and start creating interactive flowcharts and orgcharts!</p>
<p>If the Flowmaster section does not appear in the sections on the left of the page, please follow these instructions:</p>
<ol>
    <li>Go to the "Users" section</li>
    <li>Click on the "Users" folder and select your user</li>
    <li>Tick "Flowmaster" in the "Sections" tickboxes</li>
    <li>Refresh the page. The Flowmaster section should be visible on the left now.</li>
    <li>Make sure you do this for all users who will need access to the Flowmaster.</li>
</ol>
</body>
</html>
