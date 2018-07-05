using System.Web;
using System.Web.Optimization;

namespace IndigoSoft.Reports.Fixa
{
    public class BundleConfig
    {
        public BundleConfig()
        {
        }

        public static void RegisterBundles(BundleCollection bundles)
        {
            ScriptBundle scriptBundle = new ScriptBundle("~/bundles/jquery");
            string[] strArrays = new string[] { "~/Scripts/jquery-{version}.js" };
            bundles.Add(scriptBundle.Include(strArrays));
            ScriptBundle scriptBundle1 = new ScriptBundle("~/bundles/jqueryui");
            string[] strArrays1 = new string[] { "~/Scripts/jquery-ui-{version}.js" };
            bundles.Add(scriptBundle1.Include(strArrays1));
            ScriptBundle scriptBundle2 = new ScriptBundle("~/bundles/jqueryval");
            string[] strArrays2 = new string[] { "~/Scripts/jquery.unobtrusive*", "~/Scripts/jquery.validate*", "~/Scripts/fnReloadAjax.js" };
            bundles.Add(scriptBundle2.Include(strArrays2));
            ScriptBundle scriptBundle3 = new ScriptBundle("~/bundles/modernizr");
            string[] strArrays3 = new string[] { "~/Scripts/modernizr-*" };
            bundles.Add(scriptBundle3.Include(strArrays3));
            StyleBundle styleBundle = new StyleBundle("~/Content/css");
            string[] strArrays4 = new string[] { "~/Content/site.css" };
            bundles.Add(styleBundle.Include(strArrays4));
            StyleBundle styleBundle1 = new StyleBundle("~/Content/themes/base/css");
            string[] strArrays5 = new string[] { "~/Content/themes/base/jquery.ui.core.css", "~/Content/themes/base/jquery.ui.resizable.css", "~/Content/themes/base/jquery.ui.selectable.css", "~/Content/themes/base/jquery.ui.accordion.css", "~/Content/themes/base/jquery.ui.autocomplete.css", "~/Content/themes/base/jquery.ui.button.css", "~/Content/themes/base/jquery.ui.dialog.css", "~/Content/themes/base/jquery.ui.slider.css", "~/Content/themes/base/jquery.ui.tabs.css", "~/Content/themes/base/jquery.ui.datepicker.css", "~/Content/themes/base/jquery.ui.progressbar.css", "~/Content/themes/base/jquery.ui.theme.css" };
            bundles.Add(styleBundle1.Include(strArrays5));
        }
    }
}