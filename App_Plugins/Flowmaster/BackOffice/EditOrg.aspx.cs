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
    public partial class EditOrg : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
        }
        [WebMethod]
        public static void Submit(string id, string connections, string nodes, bool archive)
        {
            List<Employee> modelEmployees = new List<Employee>();
            dynamic employeeNodes = JsonConvert.DeserializeObject(nodes);
            foreach (dynamic item in employeeNodes)
            {
                Employee modelEmployee = new Employee();
                modelEmployee.id = item.id.ToString();
                modelEmployee.name = item.name.ToString();
                modelEmployee.position = item.position.ToString();
                modelEmployee.imgUrl = item.imgUrl.ToString();
                modelEmployee.left = item.left;
                modelEmployee.top = item.top;
                modelEmployee.colour = item.colour.ToString();
                modelEmployees.Add(modelEmployee);
            }
            flowmasterAPIControllerProject.Models.FlowmasterMethods.EditOrg(id, connections, modelEmployees, archive);
        }
    }
}
