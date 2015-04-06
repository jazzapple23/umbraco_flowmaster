using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using Umbraco.Core;

namespace Flowmaster.App_Plugins.Flowmaster.BackOffice
{
    public partial class Content : System.Web.UI.Page
    {
        [WebMethod]
        public static string GetContent(int nodeId)
        {
            var contentService = new Umbraco.Core.Services.ContentService();
            var node = contentService.GetById(nodeId);
            string content = "";
            if (node != null)
            {
                if (node.GetValue("boxContent") != null && !string.IsNullOrWhiteSpace(node.GetValue("boxContent").ToString()))
                    content = node.GetValue("boxContent").ToString();
            }
            return content;
        }
    }
}
