using Dapper;
using ERC.Repository.Repository;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml;

namespace ERC.Repository.Helper
{
    public class GenerateCode : BaseRepository
    {
        public string AajiExam()
        {
            string sql = "select top 1 right(ExamCode,7) from aajiexam order by ExamCode desc";
            using (var cnn = OpenSunLifeDB())
            {
                var lastRunNum = "";
                var data = cnn.QueryFirstOrDefault<string>(sql);
                if (string.IsNullOrEmpty(data))
                {
                    lastRunNum = "0000001";
                }
                else
                {
                    var temp = Convert.ToInt32(data);
                    lastRunNum = String.Format(CultureInfo.InvariantCulture, "{0:0000000}", temp + 1);
                }
                return string.Concat("P-", lastRunNum);
            }
        }
    }
    public static class Base64Helper
    {
        public static string Base64Encode(string plainText)
        {
            var plainTextBytes = System.Text.Encoding.UTF8.GetBytes(plainText);
            return System.Convert.ToBase64String(plainTextBytes);
        }
        public static string Base64Decode(string base64EncodedData)
        {
            var base64EncodedBytes = System.Convert.FromBase64String(base64EncodedData);
            return System.Text.Encoding.UTF8.GetString(base64EncodedBytes);
        }
    }

    public class TinyUrl
    {
        // bit.ly API Key
        // TODO: Go to http://bit.ly/ to get your API login and key
        private const string _apiLogin = "o_37th8i13au";
        private const string _apiKey = "R_569abdae127940a6b1051457dc5496e1";

        /// <summary>
        /// Returns a tiny bit.ly tiny URL for the given URL.
        /// </summary>
        /// <param name="url">The URL to be shortened</param>
        /// <returns>The tiny URL</returns>
        public static string GetTinyUrl(string url)
        {
            // Request tiny URL via bit.ly API
            XmlDocument doc = new XmlDocument();
            doc.Load(String.Format("http://api.bit.ly/v3/shorten?login={0}&apiKey={1}&longUrl={2}&format=xml",
                _apiLogin, _apiKey, UrlEncode(url)));

            // Test for error response
            string status_code = ReadValue(doc, "/response/status_code");
            string status_txt = ReadValue(doc, "/response/status_txt");
            if (status_code != "200" || status_txt != "OK")
                throw new Exception(String.Format("bit.ly response indicates error ({0} {1})",
                    status_code, status_txt));

            // Return tiny URL
            return ReadValue(doc, "/response/data/url");
        }

        protected static string ReadValue(XmlDocument doc, string xpath)
        {
            XmlNode node = doc.SelectSingleNode(xpath);
            if (node == null)
                throw new Exception(String.Format("bit.ly response missing expected path (\"{0}\")", xpath));
            return node.InnerText.Trim();
        }

        protected static string UrlEncode(string s)
        {
            StringBuilder builder = new StringBuilder();
            foreach (char c in s)
            {
                if (IsSafeUrlCharacter(c))
                    builder.Append(c);
                else if (c == ' ')
                    builder.Append('+');
                else
                    builder.AppendFormat("%{0:X2}", (int)c);
            }
            return builder.ToString();
        }

        protected static bool IsSafeUrlCharacter(char c)
        {
            if ((c >= 'a' && c <= 'z') ||
                (c >= 'A' && c <= 'Z') ||
                (c >= '0' && c <= '9'))
                return true;

            if (c == '(' ||
                c == ')' ||
                c == '*' ||
                c == '-' ||
                c == '.' ||
                c == '_' ||
                c == '!')
                return true;

            return false;
        }
    }

    public static class CustomHelper
    {
        public static string ConvertDate(string currentFormat, string outputFormat, string dateTimenya)
        {
            DateTime tempEffectiveDate = DateTime.ParseExact(dateTimenya, currentFormat, CultureInfo.InvariantCulture);
            return tempEffectiveDate.ToString(outputFormat);
        }
        public static bool IsValidDate(string datetimenya, string currentForm) {
            var result = false;
            DateTime output = new DateTime();
            if (DateTime.TryParseExact(datetimenya, currentForm, CultureInfo.InvariantCulture,
                       DateTimeStyles.None, out output)) {
                result = true;

            }
            else
            {
                result = false;
            }

            return result;
        }
        public static bool IsValidDouble(string doubleVal) {
            var result = false;
            try
            {
                Convert.ToDouble(doubleVal);
                result = true;
            }
            catch (Exception)
            {
            }
            return result;
        }
    }


}
