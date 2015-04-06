using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Newtonsoft.Json;

using flowmasterAPIControllerProject.Models;
using System.Web.Mvc;
using System.Web.Services;

namespace Flowmaster.App_Plugins.Flowmaster.BackOffice
{
    public partial class EditFlow : System.Web.UI.Page
    {
        void Page_Load(object sender, System.EventArgs e)
        {
        }
        [WebMethod]
        public static void Submit(string id, string connections, string boxes, string decisions, bool archive)
        {
            if(archive)
                flowmasterAPIControllerProject.Models.FlowmasterMethods.ArchiveFlow(id);
            List<Box> modelBoxes = new List<Box>();
            dynamic boxNodes = JsonConvert.DeserializeObject(boxes);
            foreach (dynamic item in boxNodes)
            {
                Box modelBox = new Box();
                if (!(bool)item.isNew)
                    modelBox.umbracoId = Convert.ToInt32(item.umbracoId);
                modelBox.delete = (bool)item.delete;
                modelBox.docId = item.docId;
                modelBox.name = item.name.ToString();
                modelBox.colour = item.colour.ToString();
                modelBox.left = item.left;
                modelBox.top = item.top;
                modelBox.isNew = (bool)item.isNew;
                modelBoxes.Add(modelBox);
            }
            List<Decision> modelDecisions = new List<Decision>();
            dynamic decNodes = JsonConvert.DeserializeObject(decisions);
            foreach (dynamic item in decNodes)
            {
                Decision modelDec = new Decision();
                modelDec.docId = item.docId;
                modelDec.type = item.type.ToString();
                modelDec.left = item.left;
                modelDec.top = item.top;
                modelDec.colour = item.colour.ToString();
                if (item.text != "")
                    modelDec.text = item.text.ToString();
                modelDecisions.Add(modelDec);
            }
            flowmasterAPIControllerProject.Models.FlowmasterMethods.EditFlow(id, connections, modelBoxes, modelDecisions);
        }
        [WebMethod]
        public static void Restore(string id, bool archive)
        {
            flowmasterAPIControllerProject.Models.FlowmasterMethods.RestoreFlow(id, archive);
        }
    }
}
