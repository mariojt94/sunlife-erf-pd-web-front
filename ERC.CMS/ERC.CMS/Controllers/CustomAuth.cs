using ERC.Repository.Repository;
using ERC.Repository.ViewModel;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Formatting;
using System.Threading.Tasks;
using System.Web.Configuration;
using System.Web.Http;

namespace ERC.CMS.Controllers
{
    public class Token
    {
        [JsonProperty("access_token")]
        public string AccessToken { get; set; }
        [JsonProperty("token_type")]
        public string TokenType { get; set; }
        [JsonProperty("expires_in")]
        public int ExpiresIn { get; set; }
        [JsonProperty("refresh_token")]
        public string RefreshToken { get; set; }
        [JsonProperty("error")]
        public string Error { get; set; }
    }
    public class CustomAuth : ApiController
    {
        public SunAdvisorResult CurrentUser { get; set; }
        [Route("api/mobile/token")]
        public async Task<SunAdvisorResult> IsAuth()
        {
            var result = new SunAdvisorResult();
            string resultContent = "";
            var re = Request;
            var headers = re.Headers;
            string token = "";
            string authkey = "";
            string userIdTemp = "";
            SunAdvisorResult data = new SunAdvisorResult();

            userIdTemp = headers.GetValues("userId").First();
            var ee = GenToken(userIdTemp);
            result.ErfToken = ee;

            if (headers.Contains("token") && headers.Contains("authKey"))
            {
                token = headers.GetValues("token").First();
                authkey = headers.GetValues("authkey").First();
                if (!string.IsNullOrEmpty(token) || !string.IsNullOrEmpty(authkey))
                {
                    string forEncrypt = "SunRec" + authkey + "sunLifeRec!31";
                    var encryptedAuthKey = CMS.Helper.MD5Helper.MD5Hash(forEncrypt);

                    using (var client = new HttpClient())
                    {
                        var url = "https://agent.sunlife.co.id/SunAdvisorService/api/SunRecruit/ValidateLoginResponse";

                        var content = new FormUrlEncodedContent(new[]
                        {
                            new KeyValuePair<string, string>("tokenkey", token),
                            new KeyValuePair<string, string>("authKey", encryptedAuthKey),
                        });

                        var request = await client.PostAsync(url, content);
                        resultContent = await request.Content.ReadAsStringAsync();
                        data = JsonConvert.DeserializeObject<SunAdvisorResult>(resultContent.ToString());

                    }

                    //jika result null maka gagal dan jika result = SUCCESS maka berhasil
                    if (data.result == "SUCCESS")
                    {
                        result.message = data.message;
                        result.agentName = data.agentName;
                        result.agentCode = data.agentCode;
                        result.result = data.result;
                        result.IsTokenExists = true;
                        result.IsDataExist = true;
                        result.IsSucced = true;
                    }
                    else
                    {
                        //result.message = "Data tidak di temukan. authorisasi di tolak";
                        result.message = data.message;
                        result.IsTokenExists = true;
                        result.IsDataExist = false;
                        result.IsSucced = false;
                    }

                    if (data.agentCode != null)
                    {
                        var erfToken = GenToken(data.agentCode);
                        result.ErfToken = erfToken;
                    }
                    return result;
                }
                else
                {
                    userIdTemp = headers.GetValues("userId").First();
                    if (string.IsNullOrEmpty(userIdTemp))
                    {
                        result.message = "UserID tidak ada"; ;
                        result.IsTokenExists = false;
                        result.IsDataExist = false;
                        result.IsSucced = false;
                    }
                    else
                    {
                        UserRepository user = new UserRepository();
                        var userData = user.GetUser(userIdTemp);

                        //if (userIdTemp == "SDM")
                        //{
                        //    userIdTemp = "SDM513";
                        //}
                        var erfToken = GenToken(userIdTemp);
                        result.agentCode = userIdTemp;
                        result.ErfToken = erfToken;

                        if (userData == null)
                        {
                            result.IsSucced = false;
                        }
                        else {
                            result.agentName = userData.DisplayName;
                            result.IsSucced = true;
                        }

                        //if (userIdTemp == "S58695")
                        //{
                        //    result.agentName = "Anak agung bagus";
                        //    result.IsSucced = true;
                        //}
                        //else if (userIdTemp == "S54436")
                        //{
                        //    result.agentName = "A A Ayu";
                        //    result.IsSucced = true;
                        //}
                        //else if (userIdTemp == "F07493")
                        //{
                        //    result.agentName = "Ida Ayu Indrani";
                        //    result.IsSucced = true;
                        //}
                        //else if (userIdTemp == "F02433")
                        //{
                        //    result.agentName = "I Made Sukertayasa";
                        //    result.IsSucced = true;
                        //}
                        //else if (userIdTemp == "C06261")
                        //{
                        //    result.agentName = "Ida Ayu Putu Dekiawati";
                        //    result.IsSucced = true;
                        //}
                        //else if (userIdTemp == "SDM")
                        //{
                        //    result.agentName = "S D M";
                        //    result.IsSucced = true;
                        //}
                        //else if (userIdTemp == "RSDH")
                        //{
                        //    result.agentName = "R S D H";
                        //    result.IsSucced = true;
                        //}
                        //else if (userIdTemp == "NSH")
                        //{
                        //    result.agentName = "N S H";
                        //    result.IsSucced = true;
                        //}
                        //else if (userIdTemp == "CAO")
                        //{
                        //    result.agentName = "C A O";
                        //    result.IsSucced = true;
                        //}
                        //else if (userIdTemp == "sylvia")
                        //{
                        //    result.agentName = "S Y L V A";
                        //    result.IsSucced = true;
                        //}
                        //else if (userIdTemp == "AD2")
                        //{
                        //    result.agentName = "AD 2";
                        //    result.IsSucced = true;
                        //}
                        //else if (userIdTemp == "SDM2")
                        //{
                        //    result.agentName = "SDM 2";
                        //    result.IsSucced = true;
                        //}
                        //else if (userIdTemp == "NAD2")
                        //{
                        //    result.agentName = "NAD 2";
                        //    result.IsSucced = true;
                        //}
                        //else if (userIdTemp == "RSDH2")
                        //{
                        //    result.agentName = "RSDH 2";
                        //    result.IsSucced = true;
                        //}
                        //else if (userIdTemp == "NSH2")
                        //{
                        //    result.agentName = "NSH 2";
                        //    result.IsSucced = true;
                        //}
                        //else if (userIdTemp == "CAO2")
                        //{
                        //    result.agentName = "CAO 2";
                        //    result.IsSucced = true;
                        //}
                        //else if (userIdTemp == "S51393")
                        //{
                        //    result.agentName = "YOHANNES  SURYANTO";
                        //    result.IsSucced = true;
                        //}
                        //else if (userIdTemp == "S62451")
                        //{
                        //    result.agentName = "MAHMIANA  KASTERIN";
                        //    result.IsSucced = true;
                        //}
                        //else if (userIdTemp == "S67240")
                        //{
                        //    result.agentName = "AZIZAH";
                        //    result.IsSucced = true;
                        //}
                        //else if (userIdTemp == "S37899")
                        //{
                        //    result.agentName = "S37899 -- test";
                        //    result.IsSucced = true;
                        //}
                        //else if (userIdTemp == "SDM513")
                        //{
                        //    result.agentName = "S D M";
                        //    result.IsSucced = true;
                        //}
                        //else if (userIdTemp == "REG051")
                        //{
                        //    result.agentName = "REG051";
                        //    result.IsSucced = true;
                        //}
                        //else if (userIdTemp == "CONV02")
                        //{
                        //    result.agentName = "CONV02";
                        //    result.IsSucced = true;
                        //}
                        //else if (userIdTemp == "CONV01")
                        //{
                        //    result.agentName = "CONV01";
                        //    result.IsSucced = true;
                        //}
                        //else
                        //{
                        //    result.IsSucced = false;
                        //}

                        //end hardcode
                    }
                }
                return result;
            }
            return result;
        }

        public string GenToken(string userName)
        {
            string baseAddress = WebConfigurationManager.AppSettings["TokenAddress"];
            //string baseAddress = "https://erecruitment.sunrecruit-app.com";
            //string baseAddress = "http://104.154.84.84:5000";

            //string baseAddress = WebConfigurationManager.AppSettings["WebSharedFolderURL"];
            using (var client = new HttpClient())
            {
                var form = new Dictionary<string, string>
               {
                   {"grant_type", "password"},
                   {"username", userName},
                   {"password", "sunlife"},
               };
                var tokenResponse = client.PostAsync(baseAddress + "/token", new FormUrlEncodedContent(form)).Result;
                var token = tokenResponse.Content.ReadAsAsync<Token>(new[] { new JsonMediaTypeFormatter() }).Result;
                if (string.IsNullOrEmpty(token.Error))
                {
                    return token.AccessToken;
                }
                else
                {
                    return "Error";
                }
            }
        }
    }
}