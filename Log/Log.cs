using System;
using System.Diagnostics;
using System.IO;
using System.Web.Helpers;

namespace IndigoSoft.Reports.Fixa.Log
{
    public class Log
    {
        public static void GeraLog(string valor)
        {
            try
            {
                var nomeArquivo = String.Format("LogReportFixa{0}.txt", DateTime.Now.ToString("yyyyMMdd"));
                var local = System.AppDomain.CurrentDomain.BaseDirectory.ToString();
                using (StreamWriter outputFile = new StreamWriter(@local + nomeArquivo, true))
                {
                    outputFile.WriteLine(String.Format("{0} {1} - {2}", DateTime.Now.ToShortDateString(), DateTime.Now.ToShortTimeString(), valor));
                }
            }
            catch (Exception)
            {
                
            }

        }
    }
}