using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Formatting;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using Umbraco.Core;
using Umbraco.Core.Logging;
using Umbraco.Web;
using Umbraco.Web.Models.ContentEditing;
using Umbraco.Web.Models.Trees;

namespace Flowmaster
{
    public class MyApplication : ApplicationEventHandler
    {
        protected override void ApplicationStarting(UmbracoApplicationBase umbracoApplication, ApplicationContext applicationContext)
        {
            System.Web.Http.GlobalConfiguration.Configuration.MessageHandlers.Add(new HideFlowmasterNodes());
        }
    }

    public class HideFlowmasterNodes : System.Net.Http.DelegatingHandler
    {
        protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            var user = UmbracoContext.Current.Security.CurrentUser;
            //if (user != null && user.Name != "admin")
            //{
                switch (request.RequestUri.AbsolutePath.ToLower())
                {
                    case "/umbraco/backoffice/umbracotrees/applicationtree/getapplicationtrees":
                        return FilterAllowedNodes(request, cancellationToken, user);
                    case "/umbraco/backoffice/umbracotrees/contenttree/getnodes":
                        return FilterAllowedChildren(request, cancellationToken, user);
                    case "/umbraco/backoffice/umbracotrees/legacytree/getnodes":
                        return FilterAllowedDocTypes(request, cancellationToken, user);
                    default:
                        return base.SendAsync(request, cancellationToken);
                }
            //}
            //return base.SendAsync(request, cancellationToken);
        }

        private Task<HttpResponseMessage> FilterAllowedNodes(HttpRequestMessage request, CancellationToken cancellationToken, Umbraco.Core.Models.Membership.IUser user)
        {
            return base.SendAsync(request, cancellationToken)
                .ContinueWith(task =>
                {
                    var response = task.Result;
                    try
                    {
                        var data = response.Content;
                        var parent = (SectionRootNode)((ObjectContent<SectionRootNode>)(data)).Value;
                        foreach (var node in parent.Children)
                        {
                            var nodeId = Convert.ToInt32(node.Id);
                            var n = new umbraco.NodeFactory.Node(nodeId);
                            var docType = n.NodeTypeAlias;
                            if (nodeId != -1 && (docType == "Flowcharts" || docType == "OrganizationalCharts" || docType == "FlowchartsArchive"))
                            {
                                node.CssClasses.Add("hide");
                            }
                        }

                    }
                    catch (Exception ex)
                    {
                        // Log
                    }
                    return response;
                });
        }
        private Task<HttpResponseMessage> FilterAllowedChildren(HttpRequestMessage request, CancellationToken cancellationToken, Umbraco.Core.Models.Membership.IUser user)
        {
            return base.SendAsync(request, cancellationToken)
                .ContinueWith(task =>
                {
                    var response = task.Result;
                    try
                    {
                        var data = response.Content;
                        var nodes = ((ObjectContent)(data)).Value as List<TreeNode>;
                        foreach (var node in nodes)
                        {
                            var nodeId = Convert.ToInt32(node.ParentId);
                            var n = new umbraco.NodeFactory.Node(nodeId);
                            var parentDocType = n.NodeTypeAlias;
                            if (parentDocType == "Flowchart" || parentDocType == "Flowcharts" || parentDocType == "FlowchartsArchive" || parentDocType == "OrganizationalCharts")
                            {
                                node.CssClasses.Add("hide");
                            }
                        }

                    }
                    catch (Exception ex)
                    {
                        // Log
                    }

                    return response;
                });
        }
        private Task<HttpResponseMessage> FilterAllowedDocTypes(HttpRequestMessage request, CancellationToken cancellationToken, Umbraco.Core.Models.Membership.IUser user)
        {
            return base.SendAsync(request, cancellationToken)
                .ContinueWith(task =>
                {
                    var response = task.Result;
                    try
                    {
                        var data = response.Content;
                        var nodes = ((ObjectContent)(data)).Value as List<TreeNode>;
                        foreach (var node in nodes)
                        {
                            var docTypeName = node.Name.ToString();
                            if (docTypeName == "Flowchart Item" || docTypeName == "Flowchart" || docTypeName == "Organizational Chart" || docTypeName == "Flowcharts" || docTypeName == "Flowcharts Archive" || docTypeName == "Organizational Charts")
                                node.CssClasses.Add("hide");
                        }

                    }
                    catch (Exception ex)
                    {
                        // Log
                    }

                    return response;
                });
        }
    }
}
