using System;
using System.Collections;
using System.Collections.Generic;
using System.Web;
using System.Web.Http;
using System.Web.Hosting;
using System.Web.Services;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Net;
using System.Net.Http.Formatting;
using System.Xml;
using System.Xml.Linq;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;

using Newtonsoft.Json;

using Umbraco.Core;
using Umbraco.Core.IO;
using Umbraco.Core.Models;
using Umbraco.Core.Services;
using Umbraco.Web.WebApi;
using Umbraco.Web.Mvc;
using Umbraco.Web.Trees;
using Umbraco.Web.Models.Trees;

using umbraco.BusinessLogic.Actions;
using umbraco.cms.presentation.Trees;

using flowmasterAPIControllerProject.Models;
using System.Web.Mvc;


namespace flowmasterAPIControllerProject.Models
{
    public class Box
    {
        public string docId { get; set; }
        public int umbracoId { get; set; }
        public string name { get; set; }
        public int left { get; set; }
        public int top { get; set; }
        public bool isNew { get; set; }
        public bool delete { get; set; }
        public string colour { get; set; }
    }

    public class Decision
    {
        public string docId { get; set; }
        public int left { get; set; }
        public int top { get; set; }
        public string type { get; set; }
        public string text { get; set; }
        public string colour { get; set; }
    }

    public class Employee
    {
        public string id { get; set; }
        public string name { get; set; }
        public string position { get; set; }
        public string imgUrl { get; set; }
        public int left { get; set; }
        public int top { get; set; }
        public string colour { get; set; }
    }

    public class Chart
    {
        public int id { get; set; }
        public int chartId { get; set; }
        public string name { get; set; }
        public string connections { get; set; }
        public string time { get; set; }
    }

    public class Flowchart : Chart
    {
        public List<Box> boxes { get; set; }
        public List<Decision> decisions { get; set; }
    }

    public class Orgchart : Chart
    {
        public List<Employee> employees { get; set; }
    }

    public class flowchartModel
    {
        public List<Flowchart> flowcharts { get; set; }

        public flowchartModel()
        {
            flowcharts = new List<Flowchart>();
        }
    }

    public class orgchartModel
    {
        public List<Orgchart> orgcharts { get; set; }

        public orgchartModel()
        {
            orgcharts = new List<Orgchart>();
        }
    }

    public static class FlowmasterMethods
    {
        public static string rootPath;
        public static string xmlPath;
        public static string archivePath;
        public static XDocument xmlConfig;
        public static XDocument archiveConfig;

        public static ContentService contentService;
        public static IContentTypeService contentTypeService;

        public static int orgchartsFolderId;
        public static int flowchartsFolderId;
        public static int flowchartsArchiveFolderId;

        static FlowmasterMethods()
        {
            rootPath = HostingEnvironment.ApplicationPhysicalPath;
            xmlPath = Path.Combine(rootPath, "App_Plugins\\Flowmaster\\BackOffice\\content\\Flowmaster.xml");
            archivePath = Path.Combine(rootPath, "App_Plugins\\Flowmaster\\BackOffice\\content\\FlowmasterArchive.xml");
            xmlConfig = XDocument.Load(xmlPath);
            archiveConfig = XDocument.Load(archivePath);

            contentService = new ContentService();
            contentTypeService = ApplicationContext.Current.Services.ContentTypeService;

            orgchartsFolderId = contentService.GetContentOfContentType(contentTypeService.GetContentType("OrganizationalCharts").Id).FirstOrDefault().Id;
            flowchartsFolderId = contentService.GetContentOfContentType(contentTypeService.GetContentType("Flowcharts").Id).FirstOrDefault().Id;
            flowchartsArchiveFolderId = contentService.GetContentOfContentType(contentTypeService.GetContentType("FlowchartsArchive").Id).FirstOrDefault().Id;

        }

        // ----------------
        // GENERAL METHODS
        // ----------------

        public static List<Chart> getChartsOfType(string type, bool archive)
        {
            List<Chart> existingCharts = new List<Chart>();
            var config = xmlConfig;
            if (archive)
                config = archiveConfig;
            foreach (XElement chart in config.Root.Descendants(type))
            {
                var node = new Chart
                {
                    id = Convert.ToInt16(chart.Attribute("id").Value),
                    chartId = Convert.ToInt16(chart.Attribute("chartId").Value),
                    name = (string)chart.Element("name")
                };
                existingCharts.Add(node);
            }
            return existingCharts;
        }

        public static void createChartXml(Chart c, string type)
        {
            xmlConfig.Root.Add(new XElement(type,
                new XAttribute("chartId", c.chartId),
                new XAttribute("id", c.id),
                new XElement("name", c.name),
                new XElement("connections"),
                new XElement("boxes")
            ));
            xmlConfig.Save(xmlPath);
        }

        public static void updateFCXml(Flowchart c, string type)
        {
            XElement updateNode = (from node in xmlConfig.Descendants(type)
                                   where (string)node.Attribute("id").Value == c.id.ToString()
                                   select node).First();

            updateNode.SetElementValue("connections", c.connections);
            XElement boxes = updateNode.Element("boxes");
            boxes.Descendants().Remove();
            foreach (Box box in c.boxes)
            {
                boxes.Add(new XElement("box",
                    new XAttribute("id", box.docId),
                    new XAttribute("umbracoId", box.umbracoId),
                    new XAttribute("name", box.name),
                    new XAttribute("colour", box.colour),
                    new XAttribute("left", box.left),
                    new XAttribute("top", box.top)
                ));
            }
            foreach (Decision decision in c.decisions)
            {
                boxes.Add(new XElement("decision",
                    new XAttribute("id", decision.docId),
                    new XAttribute("type", decision.type),
                    new XAttribute("left", decision.left),
                    new XAttribute("top", decision.top),
                    new XAttribute("colour", decision.colour),
                    decision.type == "with-text" ? new XAttribute("text", decision.text) : null
                ));
            }
            xmlConfig.Save(xmlPath);
        }

        public static void updateOCXml(Orgchart c, string type)
        {
            XElement updateNode = (from node in xmlConfig.Descendants(type)
                                   where (string)node.Attribute("id").Value == c.id.ToString()
                                   select node).First();

            updateNode.SetElementValue("connections", c.connections);
            XElement boxes = updateNode.Element("boxes");
            boxes.Descendants().Remove();
            foreach (Employee employee in c.employees)
            {
                boxes.Add(new XElement("employee",
                    new XAttribute("id", employee.id),
                    new XAttribute("name", employee.name),
                    new XAttribute("position", employee.position),
                    new XAttribute("imgUrl", employee.imgUrl),
                    new XAttribute("left", employee.left),
                    new XAttribute("top", employee.top),
                    new XAttribute("colour", employee.colour)
                ));
            }
            xmlConfig.Save(xmlPath);
        }

        // ------------------
        // ARCHIVE FLOWCHART
        // ------------------

        public static void ArchiveFlow(string id)
        {
            XElement selectedNode = (from node in xmlConfig.Descendants("Flowchart")
                                     where (string)node.Attribute("id").Value == id
                                     select node).First();

            // COPYING TO CONTENT ARCHIVE
            var flowchartNode = contentService.GetById(Convert.ToInt32(id));
            var product = contentService.Copy(flowchartNode, flowchartsArchiveFolderId, false);
            product.Name = selectedNode.Element("name").Value.ToString() + " " + DateTime.Now.ToString();

            // PUBLISHING ARCHIVE + CHILDREN
            contentService.SaveAndPublishWithStatus(product);
            foreach (var child in product.Children())
                contentService.SaveAndPublishWithStatus(child);

            // BUILDING ARCHIVE FOR XML
            XElement archiveNode = new XElement(selectedNode);
            XElement archiveBoxes = archiveNode.Element("boxes");
            var archiveID = product.Id;

            foreach (var child in product.Children())
            {
                string boxID = (string)child.GetValue("boxID");
                string newUmbID = child.Id.ToString();
                XElement boxNode = (from node in archiveBoxes.Descendants()
                                    where (string)node.Attribute("id").Value == boxID
                                    select node).First();
                boxNode.SetAttributeValue("umbracoId", newUmbID);
            }

            archiveNode.SetAttributeValue("id", archiveID);
            archiveNode.SetAttributeValue("time", DateTime.Now.ToString());

            archiveConfig.Root.AddFirst(archiveNode);
            archiveConfig.Save(archivePath);
        }

        // ------------
        // EDIT METHODS
        // ------------

        public static void EditOrg(string id, string connections, List<Employee> nodes, bool archive)
        {
            Orgchart c = new Orgchart();
            c.id = Convert.ToInt32(id);
            c.connections = connections;
            c.employees = nodes;

            if (archive)
            {
                XElement currentNode = (from node in xmlConfig.Descendants("OrgChart")
                                        where (string)node.Attribute("id").Value == id
                                        select node).First();

                IEnumerable<int> archiveList = (from node in archiveConfig.Descendants("OrgChart")
                                                where (string)node.Attribute("chartId").Value == id
                                                select Convert.ToInt32(node.Attribute("id").Value)).ToList();

                int archiveID = (archiveList.Count().Equals(0) ? 1 : archiveList.Max() + 1);

                XElement archiveNode = new XElement(currentNode);
                archiveNode.SetAttributeValue("id", archiveID);
                archiveNode.SetAttributeValue("time", DateTime.Now.ToString());
                archiveConfig.Root.AddFirst(archiveNode);
                archiveConfig.Save(archivePath);
            }
            updateOCXml(c, "OrgChart");
        }

        public static void EditFlow(string id, string connections, List<Box> boxes, List<Decision> decisions)
        {
            Flowchart c = new Flowchart();
            c.id = Convert.ToInt32(id);
            c.connections = connections;
            c.decisions = decisions;

            XElement currentNode = (from node in xmlConfig.Descendants("Flowchart")
                                    where (string)node.Attribute("id").Value == id
                                    select node).First();

            foreach (Box box in boxes.Where(b => b.isNew))
            {
                var product = contentService.CreateContent(box.name, Convert.ToInt16(id), "FlowchartItem", 0);
                product.SetValue("boxID", box.docId);
                contentService.SaveAndPublishWithStatus(product);
                box.umbracoId = product.Id;
            }

            c.boxes = new List<Box>();
            foreach (Box box in boxes)
            {
                if (box.delete)
                {
                    IContent product = contentService.GetById(box.umbracoId);
                    contentService.Delete(product);
                }
                else
                    c.boxes.Add(box);
            }

            updateFCXml(c, "Flowchart");

            foreach (Box box in boxes.Where(b => !b.delete && !b.isNew))
            {
                IContent productCont = contentService.GetById(box.umbracoId);
                if (productCont.Name != box.name)
                {
                    productCont.Name = box.name;
                    contentService.SaveAndPublishWithStatus(productCont);
                }
            }
        }

        // ---------------
        // CREATE METHODS
        // ---------------

        public static string CreateChart(string chartName, string type)
        {
            if (string.IsNullOrEmpty(chartName))
                return null;

            string chartType = (type == "Flowchart" ? "Flowchart" : "OrganizationalChart");
            int folderId = (type == "Flowchart" ? flowchartsFolderId : orgchartsFolderId);

            var product = contentService.CreateContent(chartName, folderId, chartType, 0);
            contentService.SaveAndPublishWithStatus(product);
            int umbId = product.Id;

            List<int> IDs = new List<int>();
            var charts = getChartsOfType(type, false);
            foreach (Chart chart in charts)
            {
                if (type == "Flowchart")
                    IDs.Add(Convert.ToInt32(chart.chartId));
                else
                    IDs.Add(Convert.ToInt32(chart.id));
            }
            int genId = (charts.Count().Equals(0) ? 1 : IDs.Max() + 1);

            int chartId = (type == "Flowchart" ? genId : umbId);
            int id = (type == "Flowchart" ? umbId : genId);

            Chart c = new Chart
            {
                id = umbId,
                chartId = chartId,
                name = chartName
            };
            createChartXml(c, type);
            return umbId.ToString();
        }

        // --------------
        // RENAME METHOD
        // --------------

        public static void Rename(string id, string newName)
        {
            XElement currentNode = (from node in xmlConfig.Root.Elements()
                                    where (string)node.Attribute("id") == id
                                    select node).First();
            currentNode.SetElementValue("name", newName);
            xmlConfig.Save(xmlPath);

            IContent product = contentService.GetById(Convert.ToInt16(id));
            product.Name = newName;
            contentService.SaveAndPublishWithStatus(product);
        }

        // ---------------
        // DELETE METHODS
        // ---------------

        public static void DeleteWhole(string id)
        {
            XElement elem = (from node in xmlConfig.Root.Elements()
                             where (string)node.Attribute("id").Value == id
                             select node).First();
            string chartId = (string)elem.Attribute("chartId").Value;
            string type = elem.Name.ToString();

            elem.Remove();
            xmlConfig.Save(xmlPath);

            IEnumerable<XElement> archiveList = (from node in archiveConfig.Root.Elements()
                                                 where (string)node.Attribute("chartId").Value == chartId
                                                 select node).ToList();

            foreach (XElement assocArchive in archiveList)
                assocArchive.Remove();
            archiveConfig.Save(archivePath);

            IContent chartCont = contentService.GetById(Convert.ToInt16(id));
            contentService.Delete(chartCont);

            if (type == "Flowchart")
            {
                foreach (XElement assocArchive in archiveList)
                {
                    string productID = (string)assocArchive.Attribute("id").Value;
                    IContent product = contentService.GetById(Convert.ToInt16(productID));
                    contentService.Delete(product);
                }
            }
        }

        public static void DeleteArchive(string id)
        {
            XElement elem = (from node in archiveConfig.Descendants()
                             where (string)node.Attribute("id") == id
                             select node).First();
            elem.Remove();
            archiveConfig.Save(archivePath);
            if (elem.Name.ToString() == "Flowchart")
            {
                IContent product = contentService.GetById(Convert.ToInt16(id));
                contentService.Delete(product);
            }
        }

        // ------------------------
        // RESTORE FLOWCHART METHOD
        // ------------------------
        
        public static void RestoreFlow(string id, bool archive)
        {
            var restoreContNode = contentService.GetById(Convert.ToInt32(id));

            XElement restoreNode = (from node in archiveConfig.Descendants("Flowchart")
                                    where (string)node.Attribute("id").Value == id
                                    select node).First();

            XElement activeNode = (from node in xmlConfig.Descendants("Flowchart")
                                    where (string)node.Attribute("chartId") == (string)restoreNode.Attribute("chartId")
                                    select node).First();               
            
            if (archive)
                ArchiveFlow((string)activeNode.Attribute("id").Value);
            
            contentService.Delete(contentService.GetById(Convert.ToInt32(activeNode.Attribute("id").Value)));
            
            restoreContNode.Name = (string)restoreNode.Element("name");
            contentService.Move(restoreContNode, flowchartsFolderId);

            
            activeNode.Remove();

            XElement newNode = new XElement(restoreNode);
            XAttribute time = newNode.Attribute("time");
            time.Remove();

            restoreNode.Remove();
            xmlConfig.Root.Add(newNode);

            xmlConfig.Save(xmlPath);
            archiveConfig.Save(archivePath);
        }
    }
}
