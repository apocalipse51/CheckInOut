using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace IndigoSoft.Reports.Fixa.App_Start
{
    public class Restricted : ActionFilterAttribute, IActionFilter
    {
        public Restricted()
        {
        }

        public void OnActionExecuted(ActionExecutedContext filterContext)
        {
        }

        public void OnActionExecuting(ActionExecutingContext filterContext)
        {
            RouteData routeData = filterContext.RouteData;
            string requiredString = routeData.GetRequiredString("controller");
            string str = routeData.GetRequiredString("action");
            if (requiredString == "Usuario" && str == "Login" || requiredString == "Usuario" && str == "Logout")
            {
                return;
            }
            if (filterContext.HttpContext.Session["USUARIO"] == null)
            {
                filterContext.Result = (new RedirectResult("~/Usuario/Login"));
            }
        }
    }
}