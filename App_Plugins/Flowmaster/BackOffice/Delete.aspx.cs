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
    public partial class Delete : System.Web.UI.Page
    {
        void Page_Load(object sender, System.EventArgs e)
        {
        }
        [WebMethod]
        public static void Submit(string id, bool archive)
        {
            if(archive)
                flowmasterAPIControllerProject.Models.FlowmasterMethods.DeleteArchive(id);
            else
                flowmasterAPIControllerProject.Models.FlowmasterMethods.DeleteWhole(id);
        }
    }
}
