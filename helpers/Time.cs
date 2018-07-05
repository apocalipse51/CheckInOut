using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace IndigoSoft.Reports.Fixa.helpers
{
    public class Time
    {
        public static string[] TimeSpaces(string horaInicial, string horaFinal)
        {
            //Returns the result time of a working day, based on a 8 hours routin
            string tempoI = "00:00:00";
            //Descobrir o tempo do primeiro dia
            var hrIarr = horaInicial.Split(':');
            var hrI = Convert.ToInt32(hrIarr[0]);
            if ((hrI >= 9) && (hrI <= 18))
            {
                var sub = 17 - Convert.ToInt32(hrIarr[0]);
                tempoI = Convert.ToString(sub);
                tempoI = string.Format("{0}:{1}:{2}", tempoI, hrIarr[1], hrIarr[2]);
            }
            string tempoF = "00:00:00";
            //Descobrir o tempo do ultimo dia
            var hrFarr = horaFinal.Split(':');
            var hrF = Convert.ToInt32(hrFarr[0]);
            if ((hrF >= 9) && (hrF <= 18))
            {
                var removeTime = 10;
                if(hrF == 9)
                {
                    removeTime = 9;
                }
                var hr = horaFinal.Split(':');
                var sub = Convert.ToInt32(hr[0]) - removeTime;
                tempoF = Convert.ToString(sub);
                tempoF = string.Format("{0}:{1}:{2}", tempoF, hr[1], hr[2]);
            }
            string[] res = new string[2];
            res[0] = tempoI;
            res[1] = tempoF;
            return res;
        }

        public static int WorkDays(string inicial, string final)
        {
            var arrInicial = inicial.Split('/');
            var arrFinal = final.Split('/');
            var anoInicial = Convert.ToInt32(arrInicial[2]);
            var diaInicial = Convert.ToInt32(arrInicial[0]);
            var mesInicial = Convert.ToInt32(arrInicial[1]);
            DateTime startDate = new DateTime(anoInicial, mesInicial, diaInicial);
            var anoFinal = Convert.ToInt32(arrFinal[2]);
            var diaFinal = Convert.ToInt32(arrFinal[0]);
            var mesFinal = Convert.ToInt32(arrFinal[1]);
            DateTime endDate = new DateTime(anoFinal, mesFinal, diaFinal);
            int days = 0;
            while (startDate.Date <= endDate.Date)
            {
                if (startDate.DayOfWeek != DayOfWeek.Saturday && startDate.DayOfWeek != DayOfWeek.Sunday)
                {
                    days++;
                }
                startDate = startDate.AddDays(1);
            }
            return days;
        }

        public static string SumTimes(string i, string f)
        {
            var arrI = i.Split(':');
            var arrF = f.Split(':');
            int tempoI = (Convert.ToInt32(arrI[0]) * 3600) + (Convert.ToInt32(arrI[1]) * 60) + Convert.ToInt32(arrI[2]);
            int tempoF = (Convert.ToInt32(arrF[0]) * 3600) + (Convert.ToInt32(arrF[1]) * 60) + Convert.ToInt32(arrF[2]);
            int tempoFinal = Convert.ToInt32(tempoI) + Convert.ToInt32(tempoF);
            var hours = Math.Floor(Convert.ToDouble(tempoFinal) / (60 * 60));
            var divisorMinutos = tempoFinal % (60 * 60);
            var minutos = Math.Floor(Convert.ToDouble(divisorMinutos) / 60);
            var divisorSegundos = divisorMinutos % 60;
            var segundos = Math.Ceiling(Convert.ToDouble(divisorSegundos));
            string contador = "";
            string hrs, mn, sc;
            if (hours < 10)
            {
                hrs = "0" + hours + ":";
            }
            else
            {
                hrs = hours +":";
            }

            if (minutos < 10)
            {
                mn = "0"+ minutos +":";
            }
            else
            {
                mn = minutos + ":";
            }

            if (segundos < 10)
            {
                sc = "0"+segundos;
            }
            else
            {
                sc = segundos + "";
            }
            contador = string.Format("{0}{1}{2}", hrs, mn, sc);
            return contador;
        }

        public static string AddHours(string time, int hours)
        {
            var arr = time.Split(':');
            var hora = Convert.ToInt32(arr[0]) + hours;
            var res = string.Format("{0}:{1}:{2}", hora, arr[1], arr[2]);
            return res;
        }
    }
}
