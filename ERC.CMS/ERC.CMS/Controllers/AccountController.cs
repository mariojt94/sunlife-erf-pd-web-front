using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Spreadsheet;
using ERC.Repository.Helper;
using ERC.Repository.Repository;
using ERC.Repository.ViewModel;
using System;
using System.Collections.Generic;
using System.Data;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Http;
using System.Web.Http.Description;
using System.Web.Script.Serialization;
using System.Xml;
using System.Xml.Serialization;

namespace ERC.CMS.Controllers
{
    public class CheckElearningAccount
    {
        public string AgentCode { get; set; }
        public string Password { get; set; }
        public string BirthDate { get; set; }
    }

    //[Authorize]
    public class AccountController : ApiController
    {
        // GET: Account

        JavaScriptSerializer serializer = new JavaScriptSerializer();
        ReadExcelHelper readXHelper = new ReadExcelHelper();
        UserRepository userRepository;
        //RoleMenuRepository roleMenuRepository = new RoleMenuRepository();

        [HttpGet]
        [AllowAnonymous]
        [Route("api/Account/decrypt")]
        public IHttpActionResult a(string Date)
        {
            if (string.IsNullOrEmpty(Date))
            {
                return Json("empty Params");
            }

            CultureInfo ci = new CultureInfo("id-ID");

            var dt = Convert.ToDateTime(Date);
            var generatePassword = dt.ToString("ddMMMyyyy", ci);
            var generatedPWd = RijndaelManagedEncryption.EncryptRijndael(generatePassword).ToString();
            var encryptedPwd = RijndaelManagedEncryption.DecryptRijndael(generatedPWd).ToString();
            return Json(generatedPWd + " -- " + encryptedPwd);
            //return Json(RijndaelManagedEncryption.EncryptRijndael(generatePassword).ToString());
        }
        [HttpGet]
        [AllowAnonymous]
        [Route("api/Account/GFG6CP4b43tnVJ31kCheckCCurrentApproval")]
        public IHttpActionResult GFG6CP4b43tnVJ31kCheckCCurrentApproval(string agentcode)
        {
            UserRepository up = new UserRepository();
            List<String> agentcodelist = new List<string>();
            agentcodelist.Add(agentcode);
            try
            {
                up.UpdateAllExistingPendingApproval(agentcodelist);
            }
            catch (Exception)
            {
                return Ok("gagal update hirarki " + agentcode);
            }
            return Ok(true);
        }


        [HttpGet]
        [AllowAnonymous]
        [Route("api/Account/GFG6CP4b43tnVJ31kCheckPasswordElearning")]
        public IHttpActionResult b()
        {
            List<UserViewModel> temp = new List<UserViewModel>();
            UserRepository userRepository = new UserRepository();

            temp = (userRepository.GetErecruiterElearningAccount().ToList());
            //Boolean result = false;
            string updatedLoginName = "";
            foreach (var item in temp)
            {
                    CultureInfo ci = new CultureInfo("id-ID");
                    var cDate = Convert.ToDateTime(item.BirthDate);
                    var generatePassword = cDate.ToString("ddMMMyyyy", ci);

                    item.Password = (RijndaelManagedEncryption.DecryptRijndael(item.Password).ToString());
                    var genPWd = RijndaelManagedEncryption.EncryptRijndael(generatePassword);

                    if (!item.Password.Equals(generatePassword))
                    {
                        //update elearning pwd
                        //userRepository.UpdateElearningPassword(item.AgentCode, genPWd);
                        updatedLoginName += string.Concat(": ", item.AgentCode, "  - pwd existing :: ", item.Password, " pwd gen server :: ", generatePassword);
                    }
            }
            return Ok(updatedLoginName);
        }

        [HttpGet]
        [AllowAnonymous]
        [Route("api/Account/c2d")]
        public IHttpActionResult c()
        {
            //return Json(Convert.ToDateTime(id));
            return Json(RijndaelManagedEncryption.DecryptRijndael("h4gWxm94jTcwyl2Eh0+xEw==").ToString());
        }

        [Route("api/Account/GetManager")]
        public IHttpActionResult GetManager(string agentCode = null, string displayName = null, int page = 1, int rowsPage = 10)
        {
            userRepository = new UserRepository();
            var data = userRepository.GetManager(agentCode, string.Concat("%", displayName, "%"), page, rowsPage);
            return Json(data);
        }

        //ini untuk dropdown menu filter search
        [Route("api/Account/GetManagers")]
        public IHttpActionResult GetManagers()
        {
            userRepository = new UserRepository();
            var data = userRepository.GetAllManagers();

            return Json(data);
        }

        [Route("api/Account/GetListUser")]
        public IHttpActionResult GetListUser(string displayName = null, int page = 1, int rowspPage = 10, string role = null)
        {
            userRepository = new UserRepository();
            var data = userRepository.GetListUser(displayName, page, rowspPage, role);
            return Json(data);
        }

        [Route("api/Account/GetUser")]
        public IHttpActionResult GetUser(string loginName)
        {
            loginName = AesDecrypt.DecryptStringAES(loginName);
            userRepository = new UserRepository();
            var data = userRepository.GetUser(loginName);
            return Json(data);
        }

        [Route("api/Account/GetListRecruiterAgentCode")]
        public IHttpActionResult GetListRecruiterAgentCode(int page = 1, int rowspPage = 10, string TeamCode = null, string AgentCode = null, string DisplayName = null)
        {
            userRepository = new UserRepository();
            var data = userRepository.GetListRecruiterAgentCode(page, rowspPage, TeamCode, AgentCode, DisplayName);
            return Json(data);
        }

        [Route("api/Account/GetCurrentUser")]
        public IHttpActionResult GetCurrentUser()
        {
            userRepository = new UserRepository();
            string loginName = HttpContext.Current.User.Identity.Name;
            var data = userRepository.GetUser(loginName);
            return Json(data);
        }

        //[Route("api/Account/Unlock")]
        //[ResponseType(typeof(UserViewModel))]
        //public IHttpActionResult Unlock(UserViewModel user)
        //{
        //    var processResult = new ProcessResult();
        //    userRepository = new UserRepository();
        //    try
        //    {
        //        userRepository.Unlock(user);
        //        processResult.isSucceed = true;
        //        processResult.message = "Akun Berhasil Di Reset";
        //        return Ok(processResult);
        //    }
        //    catch (Exception ex)
        //    {
        //        processResult.isSucceed = false;
        //        processResult.message = ex.Message;
        //        return Ok(processResult);
        //    }
        //}
        [HttpGet]
        [Route("api/Account/GetEmailDate")]
        public IHttpActionResult GetEmailDate(string email)
        {
            userRepository = new UserRepository();
            var data = userRepository.GetEmailCreatedDate(email);
            return Json(data);
        }

       [HttpGet]
       [Route("api/Account/GetEmailAndLoginName")]
       [ResponseType(typeof(UserViewModel[]))]
        public IHttpActionResult GetEmailAndLoginName(string email, string loginName)
        {
            userRepository = new UserRepository();
            var data = userRepository.GetEmailAndLoginName(email,loginName);
            return Json(data);
        }
        
        [HttpGet]
       [Route("api/Account/GetPassword")]
       [ResponseType(typeof(UserViewModel[]))]
       public IHttpActionResult GetPassword(string loginName, string password)
        {
            userRepository = new UserRepository();
            var data = userRepository.GetPassword(loginName, password);
            return Json(data);
        }


        [AllowAnonymous]
        [Route("api/Account/Submit")]
        [ResponseType(typeof(UserViewModel))]
        public IHttpActionResult Submit(UserViewModel user)
        {
            var processResult = new ProcessResult();
            try
            {

                userRepository = new UserRepository();
                //var access = roleMenuRepository.getAccessMenu(user.Url);

                var isExist = userRepository.GetAccount(user.AgentCode);

                //wk
                var getAccount = true;


                //if (user.Id == "0" || (user.Id != "0" && user.Password != isExist.Password && user.Password != ""))
                //validasi belom selesai
                if (user.Password != "")
                {
                    user.Password = RijndaelManagedEncryption.EncryptRijndael(user.Password);
                }
                else
                {
                    user.Password = isExist.Password;
                }

                if (isExist == null)
                {
                    user.CreateDate = DateTime.Now;
                    user.CreatedBy = HttpContext.Current.User.Identity.Name;
                    user.LoginName = userRepository.AddUser(user);

                    var recruitmentRepo = new RecruitmentFormRepository();
                    //recruitmentRepo.AddCandidate(ConvertModel(user));
                    processResult.message = "Berhasil Menyimpan User Baru!";
                    processResult.isSucceed = true;

                }
            }
            catch (Exception ex)
            {
                processResult.isSucceed = false;
                processResult.message = ex.Message;
            }

            return Ok(processResult);
        }


        [AllowAnonymous]
        [Route("api/Account/toSendEmail")]
        [ResponseType(typeof(CandidateDokumenViewModel))]
        public IHttpActionResult SubmitToSendEMail(string loginName, string email, string status,string name) //
        {
            var processResult = new ProcessResult();
            try
            {
                userRepository = new UserRepository();
                userRepository.ToSendEmail(loginName, email, status, name);

            }
            catch (Exception ex)
            {
                processResult.isSucceed = false;
                processResult.message = ex.Message;
            }

            return Ok(processResult);
        }

        [Route("api/Account/GetPDFSubmitStatus")]
        public IHttpActionResult GetPDFSubmitStatus(string loginName)
        {
            userRepository = new UserRepository();
            var data = userRepository.GetPDFSubmitStatus(loginName);
            return Json(data);
        }
        //backup
        /*[Route("api/Account/Submit")]
        [ResponseType(typeof(UserViewModel))]
        public IHttpActionResult Submit(UserViewModel user)
        {
            var processResult = new ProcessResult();
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                userRepository = new UserRepository();
                var access = roleMenuRepository.getAccessMenu(user.Url);

                user.LoginName = user.AgentCode;

                CultureInfo ci = new CultureInfo("id-ID");
                //var generatePassword = user.BirthDate.ToString("ddMMMyyyy", ci);
                if ((String.IsNullOrEmpty(user.Password) || String.IsNullOrWhiteSpace(user.Password)) && user.Id == "0")
                {
                    processResult.message = "Password Harus Diisi!";
                    processResult.isSucceed = false;
                    return Ok(processResult);
                }

                if (String.IsNullOrEmpty(user.AgentCode) || String.IsNullOrWhiteSpace(user.AgentCode))
                {
                    processResult.message = "Nama Harus Diisi!";
                    processResult.isSucceed = false;
                    return Ok(processResult);
                }
                if (string.IsNullOrEmpty(user.Email))
                {
                    processResult.message = "Email Harus diisi";
                    processResult.isSucceed = false;
                    return Ok(processResult);
                }
                if (string.IsNullOrEmpty(user.DisplayName) || string.IsNullOrWhiteSpace(user.DisplayName))
                {
                    processResult.message = "Tampilan Nama Harus Diisi!";
                    processResult.isSucceed = false;
                    return Ok(processResult);
                }
                if (Convert.ToString(user.RoleID) == "")
                {
                    processResult.message = "Akses Harus Diisi!";
                    processResult.isSucceed = false;
                    return Ok(processResult);
                }

                var isExist = userRepository.GetAccount(user.AgentCode);

                if (user.Id == "0" || (user.Id != "0" && user.Password != isExist.Password && user.Password != ""))
                {
                    user.Password = RijndaelManagedEncryption.EncryptRijndael(user.Password);
                }
                else
                {
                    user.Password = isExist.Password;
                }

                if (isExist == null)
                {
                    if (access != null && access.Add)
                    {
                        user.CreateDate = DateTime.Now;
                        user.CreatedBy = HttpContext.Current.User.Identity.Name;
                        userRepository.AddUser(user);
                        processResult.message = "Berhasil Menyimpan User Baru!";
                        processResult.isSucceed = true;
                    }
                    else
                    {
                        processResult.isSucceed = false;
                        processResult.message = "Anda tidak memiliki ijin untuk mengubah data !";
                    }
                }
                else
                {
                    userRepository.UpdateUser(user);
                    processResult.message = "Berhasil Mengubah Data User!";
                    processResult.isSucceed = true;
                }

            }
            catch (Exception ex)
            {
                processResult.isSucceed = false;
                processResult.message = ex.Message;
            }

            return Ok(processResult);
        }*/

        [Route("api/Account/EmailChangePasswordAccount")]
        [ResponseType(typeof(UserViewModel))]
        public IHttpActionResult SubmitEmailForgotPassword(UserViewModel user)
        {
            var processResult = new ProcessResult();

            try
            {
                userRepository = new UserRepository();         
                userRepository.GenerateForgotPassword(user);
                processResult.isSucceed = true;
                processResult.message = "berhasil dikirim silahkan cek email untuk reset password";
            }
            catch (Exception ex)
            {
                processResult.isSucceed = false;
                processResult.message = ex.Message;
            }
            return Ok(processResult);
        }

        [HttpPost]
        [Route("api/Account/ValidateChangePassLink")]
        //[ResponseType(typeof(UserViewModel))]
        public IHttpActionResult ValidateLink([FromBody] string email)
        {
            var processResult = new ProcessResult();
            try
            {
                userRepository = new UserRepository();
                //userRepository.GenerateForgotPassword(user.Email);
                var check = userRepository.CheckLinkReset(email);

                if (check == false)
                {
                    processResult.isSucceed = false;
                    return Ok(processResult);
                }


            }
            catch (Exception ex)
            {
                processResult.isSucceed = false;
                processResult.message = ex.Message;
            }
            processResult.isSucceed = true;
            return Ok(processResult);
            //return Ok(processResult);
        }


        [Route("api/Account/GetUserFromForgot")]
        public IHttpActionResult GetUserFromForgot(string link)
        {
            //loginName = AesDecrypt.DecryptStringAES(loginName);
            userRepository = new UserRepository();
            var data = userRepository.GetUserFromForgot(link);
            return Json(data);
        }

        //[Route("api/Account/ChangePasswordUserpp")]
        [ResponseType(typeof(UserViewModel))]
        public IHttpActionResult ChangePass(UserViewModel user )
        {
            var processResult = new ProcessResult();
            userRepository = new UserRepository();

            try
            {
                userRepository.SetPassword(user);

                processResult.message = "Berhasil mengganti kata sandi";
                processResult.isSucceed = true;
            }
            catch (Exception ex)
            {
                processResult.isSucceed = false;
                processResult.message = ex.Message;
            }

            return Ok(processResult);
        }

        [Route("api/Account/ChangePasswordUser")]
        [ResponseType(typeof(UserViewModel))]
        public IHttpActionResult ChangePassword(UserViewModel user)
        {
            var processResult = new ProcessResult();
            try
            {
/*                if (!ModelState.IsValid)
                {
                    processResult.message = "Gagal Mengubah Password";
                    processResult.isSucceed = false;
                    return Ok(processResult);
                }*/

                userRepository = new UserRepository();
                var currentUser = userRepository.GetUser(user.LoginName);

                if (String.IsNullOrEmpty(user.InputOldPassword))
                {
                    processResult.message = "Kata Sandi Lama Harus Diisi";
                    processResult.isSucceed = false;
                    return Ok(processResult);
                }
                //validasi syarat password
/*                if (!PasswordIsValid(user.InputNewPassword))
                {
                    processResult.message = "Kata Sandi Minimal 8 Karakter dan Terdapat Satu Huruf Kapital";
                    processResult.isSucceed = false;
                    return Ok(processResult);
                }*/

                if (String.IsNullOrEmpty(user.InputConfirmationNewPassword))
                {
                    processResult.message = "Konfirmasi Kata Sandi Harus Diisi";
                    processResult.isSucceed = false;
                    return Ok(processResult);
                }

                if (user.InputNewPassword != user.InputConfirmationNewPassword)
                {
                    processResult.message = "Konfirmasi Kata Sandi Tidak Sesuai Dengan Kata Sandi Baru";
                    processResult.isSucceed = false;
                    return Ok(processResult);
                }

                //var tes = RijndaelManagedEncryption.DecryptRijndael(currentUser.Password);
                if (currentUser.Password == RijndaelManagedEncryption.EncryptRijndael(user.InputOldPassword))
                {
                    user.Password = RijndaelManagedEncryption.EncryptRijndael(user.InputNewPassword);
                    user.ChangedWhen = DateTime.Now;
                    user.ChangedBy = HttpContext.Current.User.Identity.Name;


                    userRepository.SetPassword(user);
                    processResult.message = "Berhasil Mengubah Kata Sandi";
                    processResult.isSucceed = true;

                    //validasi projek lama
                    /*var access = roleMenuRepository.getAccessMenu(user.Url);
                    if (access != null && access.Edit)
                    {
                        //set password nya disini
                        userRepository.SetPassword(user);
                        processResult.message = "Berhasil Mengubah Kata Sandi";
                        processResult.isSucceed = true;
                    }
                    else
                    {
                        processResult.message = "Anda tidak memiliki ijin untuk mengubah data";
                        processResult.isSucceed = false;
                    }
*/                }
                else
                {
                    processResult.message = "Kata Sandi Lama Salah";
                    processResult.isSucceed = false;
                    return Ok(processResult);
                }
            }
            catch (Exception ex)
            {
                processResult.isSucceed = false;
                processResult.message = ex.Message;
            }
            return Ok(processResult);
        }

        [Route("api/Account/ChangePasswordUserForgot")]
        [ResponseType(typeof(UserViewModel))]
        public IHttpActionResult ChangePasswordUserForgot(UserViewModel user)
        {
            var processResult = new ProcessResult();
            try
            {
                userRepository = new UserRepository();
                //validasi syarat password
                /*                if (!PasswordIsValid(user.InputNewPassword))
                                {
                                    processResult.message = "Kata Sandi Minimal 8 Karakter dan Terdapat Satu Huruf Kapital";
                                    processResult.isSucceed = false;
                                    return Ok(processResult);
                                }*/

                if (String.IsNullOrEmpty(user.InputConfirmationNewPassword))
                {
                    processResult.message = "Konfirmasi Kata Sandi Harus Diisi";
                    processResult.isSucceed = false;
                    return Ok(processResult);
                }

                if (user.InputNewPassword != user.InputConfirmationNewPassword)
                {
                    processResult.message = "Konfirmasi Kata Sandi Tidak Sesuai Dengan Kata Sandi Baru";
                    processResult.isSucceed = false;
                    return Ok(processResult);
                }

                user.Password = RijndaelManagedEncryption.EncryptRijndael(user.InputNewPassword);
                user.ChangedWhen = DateTime.Now;
                //user.ChangedBy = HttpContext.Current.User.Identity.Name;


                userRepository.SetPassword(user);
                userRepository.ExpiringChangePasswordUser(user);
                processResult.isSucceed = true;
                processResult.message = "Berhasil Mengubah Kata Sandi";

                //var tes = RijndaelManagedEncryption.DecryptRijndael(currentUser.Password);
                
            }
            catch (Exception ex)
            {
                processResult.isSucceed = false;
                processResult.message = ex.Message;
            }
            return Ok(processResult);
        }


        // DELETE api/<controller>/5
        [Route("api/Account/DeleteUser")]
        [ResponseType(typeof(UserViewModel))]
        [HttpPost]
        public string DeleteUser(UserViewModel data)
        {
            try
            {

              // var access = roleMenuRepository.getAccessMenu(data.Url);

               // if (access != null && access.Delete)
                {
                    userRepository = new UserRepository();
                    data.ChangedWhen = DateTime.Now;
                    data.ChangedBy = HttpContext.Current.User.Identity.Name;
                    userRepository.DeleteUser(data.LoginName);
                    return "Berhasil Menghapus Data";
                }
               /// else
                {
                    return "Anda tidak memiliki ijin untuk menghapus data !";
                }

            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        [Route("api/Account/ChangePasswordGrid")]
        [ResponseType(typeof(UserViewModel))]
        public IHttpActionResult ChangePasswordGrid(UserViewModel user)
        {
            var processResult = new ProcessResult();
            try
            {

                if (!ModelState.IsValid)
                {
                    processResult.message = "failed";
                    processResult.isSucceed = false;
                    return Ok(processResult);
                }

                userRepository = new UserRepository();
                var currentUser = userRepository.GetUser(user.LoginName);

                if (!String.IsNullOrEmpty(user.InputNewPassword))
                {

                    if (!PasswordIsValid(user.InputNewPassword))
                    {
                        processResult.message = "Password must be at least 8 character including a Uppercase letter, a Lowercase letter and a Number";
                        processResult.isSucceed = false;
                        return Ok(processResult);
                    }
                    if (user.InputNewPassword != user.InputConfirmationNewPassword)
                    {
                        processResult.message = "New password isn't same with confirmation password.";
                        processResult.isSucceed = false;
                        return Ok(processResult);
                    }

                    else
                    {
                        user.Password = RijndaelManagedEncryption.EncryptRijndael(user.InputNewPassword);
                        user.ChangedWhen = DateTime.Now;
                        user.ChangedBy = HttpContext.Current.User.Identity.Name;

                       // var access = roleMenuRepository.getAccessMenu(user.Url);
                       // if (access != null && access.Edit)
                        {
                            userRepository.SetPassword(user);
                            processResult.message = "Berhasil Mengubah Kata Sandi";
                            processResult.isSucceed = true;
                        }
                      //  else
                        {
                            processResult.message = "Anda tidak memiliki ijin umtuk mengubah data";
                            processResult.isSucceed = false;
                        }


                        //userRepository.SetPassword(user);
                        //processResult.message = "Password Successfully Changed !";
                        //processResult.isSucceed = true;
                        return Ok(processResult);
                    }
                }
                else
                {
                    processResult.message = "Please fill password";
                    processResult.isSucceed = false;
                    return Ok(processResult);
                }
            }
            catch (Exception ex)
            {
                processResult.message = ex.Message;
                processResult.isSucceed = false;
                return Ok(processResult);
            }
        }

        public static bool PasswordIsValid(string password)
        {
            //string regex = @"^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[-+_!@#$%^&*.,?]).{8,}$";
            string regex = @"^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$";

            return Regex.IsMatch(password, regex);
        }

        [Route("api/Account/ImportUser")]
        [HttpPost]
        public IHttpActionResult ImportUser()
        {
            userRepository = new UserRepository();
          //  TeamRepository teamRepo = new TeamRepository();
            var processResult = new ProcessResult();
       //     RoleRepository roleRepo = new RoleRepository();
        //    LocationRepository locationRepo = new LocationRepository();

       //     var listLocation = locationRepo.GetLocationOnly();
   //         var listTeam = teamRepo.GetTeamOnly();
    //        var listRole = roleRepo.GetAllRole();

            List<String> listPwdEncrypted = new List<String>();
            List<String> listPwdDecrypted = new List<String>();
            var CurrentPwd = "";
            //var tempUser = new List<UserViewModel>();
            var tempUser = new DataTable();
            tempUser.Columns.AddRange(new DataColumn[18] {
                new DataColumn("LoginName", typeof(string)),
                new DataColumn("Password", typeof(string)),
                new DataColumn("Email", typeof(string)),
                new DataColumn("RoleID", typeof(int)),
                new DataColumn("DisplayName", typeof(string)),
                new DataColumn("AgentCode", typeof(string)),
                new DataColumn("Gender", typeof(string)),
                new DataColumn("PhoneNo", typeof(string)),
                new DataColumn("IsActive", typeof(bool)),
                new DataColumn("IsDeleted", typeof(bool)),
                new DataColumn("CreatedWhen", typeof(DateTime)),
                new DataColumn("CreatedBy", typeof(string)),
                new DataColumn("ChangedWhen", typeof(DateTime)),
                new DataColumn("ChangedBy", typeof(string)),
                new DataColumn("TeamCode", typeof(string)),
                new DataColumn("LocationCode", typeof(string)),
                new DataColumn("HiringDate", typeof(string)),
                new DataColumn("StatusEffective", typeof(string))
            });

            StringBuilder listError = new StringBuilder();
            try
            {
                System.Web.HttpFileCollection hfc = System.Web.HttpContext.Current.Request.Files;
                if (hfc.Count == 0)
                {
                    processResult.message = "File belum diupload";
                    processResult.isSucceed = false;
                    return Ok(processResult);
                }

                System.Web.HttpPostedFile hpf = hfc[0];

                //validate file extension
                string fileExtension = System.IO.Path.GetExtension(hpf.FileName);
                if (fileExtension.ToLower() != ".xlsx")
                {
                    processResult.message = "Format file harus dalam format .xlsx";
                    processResult.isSucceed = false;
                    return Ok(processResult);
                }

                //if (hpf.FileName.ToLower() != "userlist.xlsx")
                //{
                //    processResult = new ProcessResult();
                //    //processResult.message = "Pastikan nama file yang anda upload sesuai dengan menu upload yang dipilih (team.xlsx). Nama file yang anda upload tidak sesuai dengan menu upload";
                //    processResult.message = "Pastikan nama file yang diupload sesuai dengan menu upload yang dipilih => (userlist.xlsx).";
                //    processResult.isSucceed = false;
                //    return Ok(processResult);
                //}

                if (hpf.ContentLength > 0)
                {
                    using (SpreadsheetDocument doc = SpreadsheetDocument.Open(hpf.InputStream, false))
                    {
                        WorkbookPart workBookPart = doc.WorkbookPart;
                        IEnumerable<Sheet> sheets = workBookPart.Workbook.Descendants<Sheet>();
                        Sheet sheet = sheets.First();

                        WorksheetPart workSheet = ((WorksheetPart)workBookPart.GetPartById(sheet.Id));
                        string rowNum;

                        using (OpenXmlReader reader = OpenXmlReader.Create(workSheet))
                        {
                            while (reader.Read())
                            {
                                if (reader.ElementType == typeof(Row))
                                {
                                    do
                                    {
                                        if (reader.HasAttributes)
                                        {
                                            rowNum = reader.Attributes.First(a => a.LocalName == "r").Value;
                                            if (Convert.ToInt32(rowNum) > 1)
                                            {
                                                Row r = (Row)reader.LoadCurrentElement();
                                                List<string> DataRows = new List<string>();
                                                var cellEnumerator = readXHelper.GetExcelCellEnumerator(r);

                                                while (cellEnumerator.MoveNext())
                                                {
                                                    var cell = cellEnumerator.Current;
                                                    var value = readXHelper.ReadExcelCell(cell, workBookPart).Trim();
                                                    DataRows.Add(value);
                                                }
                                                try
                                                {
                                                    var model = new UserViewModel();
                                                    var currentListerror = new StringBuilder();
                                                    var KodeAgen = DataRows[0];
                                                    if (!string.IsNullOrEmpty(KodeAgen))
                                                    {
                                                        if (DataRows[0] == null || string.IsNullOrEmpty(DataRows[0].ToString()))
                                                        {
                                                            currentListerror.Append(string.Concat("\nError On Cell ", rowNum, ": Kode Agen Kosong"));
                                                        }
                                                        else if (DataRows[0].ToString().Length > 20)
                                                        {
                                                            currentListerror.Append(string.Concat("\nError On Cell ", rowNum, ": LoginName Max 20 Char"));
                                                        }

                                                        if (DataRows[1] == null || string.IsNullOrEmpty(DataRows[1].ToString()))
                                                        {
                                                            currentListerror.Append(string.Concat("\nError On Cell ", rowNum, ": Nama Agen Kosong"));
                                                        }

                                                        if (DataRows[3] == null || string.IsNullOrEmpty(DataRows[3].ToString()))
                                                        {
                                                            currentListerror.Append(string.Concat("\nError On Cell ", rowNum, ": Email Kosong"));
                                                        }

                                                        if (DataRows[2] == null || string.IsNullOrEmpty(DataRows[2].ToString()))
                                                        {
                                                            currentListerror.Append(string.Concat("\nError On Cell ", rowNum, ": Level Agen Kosong"));
                                                        }
                                                        else
                                                        {
                                                            // cek level
                                                          //  var data = listRole.Where(x => x.RoleName.ToLower() == DataRows[2].ToString().ToLower()).FirstOrDefault();
                                                           // if (data == null)
                                                            {
                                                                currentListerror.Append(string.Concat("\nError On Cell ", rowNum, ": Role Name " + DataRows[2] + " tidak terdaftar"));
                                                            }
                                                    //        else
                                                            {
                                                     //           DataRows[2] = data.Id.ToString();
                                                            }
                                                        }

                                                        if (DataRows[4] == null || string.IsNullOrEmpty(DataRows[4].ToString()))
                                                        {
                                                            currentListerror.Append(string.Concat("\nError On Cell ", rowNum, ": Lokasi Kosong"));
                                                        }
                                                        else
                                                        {
                                                            if (DataRows[4] != "-")
                                                            {
                                                          //      var data = listLocation.Where(x => x.AgentLocation.ToLower().Trim() == DataRows[4].ToString().ToLower().Trim()).FirstOrDefault();
                                                           //     if (data == null)
                                                                {
                                                                    currentListerror.Append(string.Concat("\nError On Cell ", rowNum, ": Lokasi " + DataRows[4] + " tidak terdaftar"));
                                                                }
                                                            //    else
                                                                {
                                                        //            DataRows[4] = data.AgentLocationCode;
                                                                }
                                                            }
                                                        }

                                                        if (DataRows[5] == null || string.IsNullOrEmpty(DataRows[5].ToString()))
                                                        {
                                                            currentListerror.Append(string.Concat("\nError On Cell ", rowNum, ": Status Kosong"));
                                                        }

                                                        if (DataRows[6] == null || string.IsNullOrEmpty(DataRows[6].ToString()))
                                                        {
                                                            currentListerror.Append(string.Concat("\nError On Cell ", rowNum, ": Hiring Date Kosong"));
                                                        }

                                                        if (DataRows[7] == null || string.IsNullOrEmpty(DataRows[7].ToString()))
                                                        {
                                                            currentListerror.Append(string.Concat("\nError On Cell ", rowNum, ": Status Effective  Kosong"));
                                                        }

                                                        if (DataRows[8] == null || string.IsNullOrEmpty(DataRows[7].ToString()))
                                                        {
                                                            currentListerror.Append(string.Concat("\nError On Cell ", rowNum, ": Password Kosong"));
                                                        }

                                                        if (DataRows[9] == null || string.IsNullOrEmpty(DataRows[9].ToString()))
                                                        {
                                                            currentListerror.Append(string.Concat("\nError On Cell ", rowNum, ": Team Code Kosong"));
                                                        }
                                                        else
                                                        {
                                                         //   var data = listTeam.Where(x => x.TeamCode == (DataRows[9])).FirstOrDefault();
                                                            if (DataRows[9] != "-")
                                                            {
                                                         //       if (data == null)
                                                                {
                                                                    currentListerror.Append(string.Concat("\nError On Cell ", rowNum, ": Team Code " + DataRows[9] + " tidak terdaftar"));
                                                                }
                                                            }
                                                        }

                                                        if (DataRows[10] == null || string.IsNullOrEmpty(DataRows[10].ToString()))
                                                        {
                                                            currentListerror.Append(string.Concat("\nError On Cell ", rowNum, ": Gender Kosong"));
                                                        }
                                                    }
                                                    else
                                                    {
                                                        currentListerror.Append(string.Concat("\nError On Cell ", rowNum, ": Nama Agen Kosong"));
                                                    }

                                                    if (currentListerror.Length <= 0)
                                                    {
                                                        //bool isActive = (DataRows[5] == "A" ? true : false); diubah karena isActive nilainya 1 0 di db
                                                        byte isActive = (DataRows[5] == "A" ? Convert.ToByte(1) : Convert.ToByte(0));
                                                        string firstName = DataRows[1].Split(' ')[0];
                                                        string email = string.Empty;
                                                        email = DataRows[3];
                                                        var HiringDate = "-";
                                                        var StatusEffective = "-";

                                                        if (DataRows[6] != null && !string.IsNullOrEmpty(DataRows[5]))
                                                        {
                                                            if (DataRows[6] != "-")
                                                            {
                                                                //HiringDate = DateTime.FromOADate(Convert.ToDouble(DataRows[6])).ToShortDateString();
                                                                HiringDate = Convert.ToDateTime(DataRows[6]).ToShortDateString();
                                                            }

                                                        }
                                                        if (DataRows[7] != null && !string.IsNullOrEmpty(DataRows[6]))
                                                        {
                                                            if (DataRows[7] != "-")
                                                            {
                                                                //StatusEffective = DateTime.FromOADate(Convert.ToDouble(DataRows[7])).ToShortDateString();
                                                                StatusEffective = Convert.ToDateTime(DataRows[7]).ToShortDateString();
                                                            }
                                                        }

                                                        if (listPwdDecrypted == null || (listPwdDecrypted.Count == 0) || (listPwdDecrypted != null && !listPwdDecrypted.Contains(DataRows[8])))
                                                        {
                                                            listPwdDecrypted.Add(DataRows[8]);
                                                            var tmp = RijndaelManagedEncryption.EncryptRijndael(DataRows[8]);
                                                            CurrentPwd = tmp;
                                                            listPwdEncrypted.Add(tmp);
                                                        }
                                                        else
                                                        {
                                                            var indexnya = listPwdDecrypted.IndexOf(DataRows[8]);
                                                            CurrentPwd = listPwdEncrypted[indexnya];
                                                        }

                                                        model = new UserViewModel
                                                        {
                                                            LoginName = DataRows[0].ToString().ToUpper(),
                                                            AgentCode = DataRows[0].ToString().ToUpper(),
                                                            DisplayName = DataRows[1].ToString().ToUpper(),
                                                            RoleID = Convert.ToInt32(DataRows[2]),
                                                            LocationCode = DataRows[4].ToString().ToUpper(),
                                                            IsActive = isActive,
                                                            HiringDate = HiringDate,
                                                            StatusEffective = StatusEffective,
                                                            Password = CurrentPwd,
                                                            TeamCode = DataRows[9].Equals("-") ? null : DataRows[9].ToString().ToUpper(),
                                                            Gender = DataRows[10],
                                                            Email = email,
                                                            IsDeleted = false,
                                                            CreatedWhen = DateTime.Now,
                                                            ChangedWhen = DateTime.Now,
                                                            CreatedBy = HttpContext.Current.User.Identity.Name,
                                                            ChangedBy = HttpContext.Current.User.Identity.Name,
                                                        };

                                                        tempUser.Rows.Add(model.LoginName, model.Password, model.Email, model.RoleID, model.DisplayName, model.AgentCode, model.Gender, model.PhoneNo, model.IsActive, model.IsDeleted, model.CreatedWhen, model.CreatedBy, model.ChangedWhen, model.ChangedBy, model.TeamCode, model.LocationCode, model.HiringDate, model.StatusEffective);
                                                        //userRepository.AddUpdateUser(model);

                                                        //var isExist = userRepository.GetAccount(model.AgentCode);
                                                        //if (isExist == null)
                                                        //{
                                                        //    //userRepository.AddUser(model);
                                                        //}
                                                        //else
                                                        //{
                                                        //    //userRepository.UpdateUser(model);
                                                        //}
                                                    }

                                                    listError.Append(currentListerror);
                                                }
                                                catch (Exception ex)
                                                {
                                                    string message = ex.Message;
                                                    string undefinedColumn = "Index was out of range";
                                                    var result = message.Contains(undefinedColumn);
                                                    if (result)
                                                    {
                                                        listError.Append("\nTerdapat bebrapa kolom yang tidak sesuai template");
                                                    }
                                                    else
                                                    {
                                                        listError.Append(ex.Message);
                                                    }
                                                }
                                            }
                                        }
                                    } while (reader.ReadNextSibling());
                                    break;
                                }
                            }
                        }
                    }
                }

                userRepository.BulkInsertUpdate(tempUser);

                if (!string.IsNullOrEmpty(listError.ToString()))
                {
                    processResult.message = listError.ToString();
                    processResult.isSucceed = false;
                }
                else
                {
                    processResult.message = "Berhasil Import Data";
                    processResult.message += listError.ToString();
                    processResult.isSucceed = true;
                }

            }
            catch (Exception ex)
            {
                processResult.message = ex.Message;
                processResult.message += listError.ToString();
                return Ok(processResult);
            }
            return Ok(processResult);
        }

        #region "userRole"
        [Route("api/Account/GetCurrentUserRole")]
        public IHttpActionResult GetCurrentUserRole(string loginname)
        {
            userRepository = new UserRepository();
            var data = userRepository.GetCurrentUserRole(loginname);
            return Json(data);
        }

        [Route("api/Account/GetListAdmin")]
        public IHttpActionResult GetListAdmin(string displayName = null, int page = 1, int rowspPage = 10, string role = null)
        {
            userRepository = new UserRepository();
            var data = userRepository.GetListAdmin(displayName, page, rowspPage, role);
            return Json(data);
        }

        [Route("api/Account/SubmitUserRole")]
        public IHttpActionResult SubmitUserRole(UserRoleViewModel data)
        {
            var processResult = new ProcessResult();
            processResult.isSucceed = false;
            try
            {
                userRepository = new UserRepository();

                if (string.IsNullOrEmpty(data.LoginName))
                {
                    processResult.message = "UserID harus diisi";
                }
                else if (string.IsNullOrEmpty(data.DisplayName))
                {
                    processResult.message = "Username harus diisi";
                }
                else if (string.IsNullOrEmpty(data.Password))
                {
                    processResult.message = "Password harus diisi";
                }
                else if (data.ListMenu.Count() == 0)
                {
                    processResult.message = "Daftar Menu Tidak Boleh Kosong";
                }
                else
                {
                    var isExist = userRepository.CekLoginName(data.LoginName);

                    if (data.Id == "0") //new
                    {
                        if (isExist > 0)
                        {
                            processResult.message = "UserID " + data.LoginName + " sudah digunakan";
                        }
                        else
                        {
                            userRepository.SubmitUserRole(data, false);
                            processResult.message = "Berhasil menyimpan data baru";
                            processResult.isSucceed = true;
                        }
                    }
                    else if (data.Id == "1") //update
                    {
                        userRepository.SubmitUserRole(data, true);
                        processResult.isSucceed = true;
                        processResult.message = "Berhasil mengubah data";
                    }
                }
            }
            catch (Exception ex)
            {
                processResult.message = ex.Message;
                processResult.isSucceed = false;
            }
            return Ok(processResult);
        }
        #endregion
    }
}