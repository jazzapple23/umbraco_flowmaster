using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Net.Http.Formatting;
using Umbraco.Core;
using Umbraco.Core.IO;
using Umbraco.Web.Models.Trees;
using Umbraco.Web.Mvc;
using Umbraco.Web.Trees;
using umbraco.BusinessLogic.Actions;
using System.Xml;
using System.Xml.Linq;
using System.IO;
using System.Web.Hosting;
using umbraco.interfaces;
using umbraco.cms.presentation.Trees;

namespace Flowmaster
{
    [PluginController("flowmaster")]
    [Umbraco.Web.Trees.Tree("flowmaster", "FlowmasterTree", "Flowmaster")]
    public class FlowmasterTreeController : TreeController
    {
        protected override Umbraco.Web.Models.Trees.TreeNodeCollection GetTreeNodes(string id, FormDataCollection queryStrings)
        {
            string rootPath = HostingEnvironment.ApplicationPhysicalPath;
            var path = Path.Combine(rootPath, "App_Plugins\\Flowmaster\\BackOffice\\content\\Flowmaster.xml");
            XDocument config = XDocument.Load(path);

            if (id == Constants.System.Root.ToInvariantString())
            {
                var nodes = new Umbraco.Web.Models.Trees.TreeNodeCollection { };
                var route = string.Format("flowmaster/", "");
                nodes.Add(CreateTreeNode("1998", id, queryStrings, "Flowcharts", "icon-network-alt", true, route));//icon-network, icon-split, icon-forking
                nodes.Add(CreateTreeNode("1999", id, queryStrings, "Organizational Charts", "icon-mindmap", true, route));//icon-path, icon-mindmap
                return nodes;
            }
            if (id == "1998")
            {
                var nodes = new Umbraco.Web.Models.Trees.TreeNodeCollection { };
                foreach (XElement docManager in config.Root.Descendants("Flowchart"))
                    nodes.Add(CreateTreeNode(docManager.Attribute("id").Value, id, queryStrings, (string)docManager.Element("name"), "icon-item-arrangement"));
                return nodes;
            }
            if (id == "1999")
            {
                var nodes = new Umbraco.Web.Models.Trees.TreeNodeCollection { };
                foreach (XElement docManager in config.Root.Descendants("OrgChart"))
                    nodes.Add(CreateTreeNode(docManager.Attribute("id").Value, "1999", queryStrings, (string)docManager.Element("name"), "icon-item-arrangement"));
                return nodes;
            }
            else
                return new Umbraco.Web.Models.Trees.TreeNodeCollection { };
        }

        protected override Umbraco.Web.Models.Trees.MenuItemCollection GetMenuForNode(string id, FormDataCollection queryStrings)
        {
            string rootPath = HostingEnvironment.ApplicationPhysicalPath;
            var path = Path.Combine(rootPath, "App_Plugins\\Flowmaster\\BackOffice\\content\\Flowmaster.xml");
            int i = 0;
            XDocument config = XDocument.Load(path);
            foreach (XElement docManager in config.Root.Descendants())
                i++;
            var menu = new Umbraco.Web.Models.Trees.MenuItemCollection();
            if (id == "1998" || id == "1999")
            {
                var create = new Umbraco.Web.Models.Trees.MenuItem("create", "Create");
                create.Icon = "add";
                menu.Items.Add(create);
            }
            else if (id != Constants.System.Root.ToInvariantString())
            {
                var rename = new Umbraco.Web.Models.Trees.MenuItem("rename", "Rename");
                rename.Icon = "edit";
                menu.Items.Add(rename);
                if (i != 1)
                {
                    var delete = new Umbraco.Web.Models.Trees.MenuItem("delete", "Delete");
                    delete.Icon = "trash";
                    menu.Items.Add(delete);
                }
            }
            return menu;
        }
    }
}
