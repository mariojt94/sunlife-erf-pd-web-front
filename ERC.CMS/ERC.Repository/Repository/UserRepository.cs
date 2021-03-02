using ERC.Repository.ViewModel;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using ERC.Repository.Resources;
using Dapper;
using System.Web;
using System.Data;
using System.Globalization;
using System.Text;
using ERC.Repository.Helper;

namespace ERC.Repository.Repository
{
    public class UserRepository : BaseRepository
    {
        NotificationHelper NotificationHelper = new NotificationHelper();
        public String testGetXML() {
            using (var cnn = OpenSunLifeDB())
            {
                var sql = @"SELECT *, 
	(select ce.Id, CandidateId, CompanyName, QuitReason, Position, ToDate, FromDate
        from candidateexperience ce
        join candidate c on ce.CandidateId = c.Id
        where c.Id = 80 FOR XML PATH('Experiences'), type),
	(select id,candidateid,companyname, lastposition, mainofficeaddress, hasbeenjoinfor,terminatedate,oldagentcode 
        from CandidateWorkExperienceInInsurance
        where candidateid = 80 FOR XML PATH('Experiences'), type),
	(select Id,CandidateId,InstitutionName,YearFrom,YearTo,Level from CandidateEducation where CandidateID = 80
	FOR XML PATH('Educations'), type)
	from dbo.GetCandidateData(80)
FOR XML PATH(''), type, root ('CandidateViewModel')
";
                return cnn.Query<String>(sql, new { }).FirstOrDefault();
            }
        }

        public IEnumerable<UserViewModel> GetErecruiterElearningAccount()
        {
            using (var cnn = OpenSunLifeElearningDB())
            {
                var sql = "select LoginName AgentCode, Password, BirthDate from account where CreatedWho like '%ERECRUIT%'";
                return cnn.Query<UserViewModel>(sql, new { });
            }
        }
        public void UpdateElearningPassword(string AgentCode, string Password)
        {
            using (var cnn = OpenSunLifeElearningDB())
            {
                var sql = "update Account set password = @password where loginname = @loginname";
                cnn.Query<UserViewModel>(sql, new { password  = Password, loginname = AgentCode });
            }
        }

        public IEnumerable<String> GetRecruiterCodeOnApprovalListByLocationCandidate(string listlocation)
        {
            using (var cnn = OpenSunLifeDB())
            {
                var sql = "select a.RecruiterCode from ApprovalList a left join candidate c on a.CandidateId = c.ID where c.LocationCode in (" + listlocation + ") and a.ApprovalDate is null group by a.RecruiterCode";
                return cnn.Query<String>(sql, new { });
            }

        }

        public IEnumerable<UserViewModel> GetDataAgen()
        {
            using (var cnn = OpenSunLifeDB())
            {
                var sql = "select loginname, displayname, r.rolename, l.agentlocation LocationName, case when (a.isactive = 1) then 'A' else 'NA' end status, a.hiringdate, a.statuseffective,a.password,a.teamcode,a.gender from account a left join role r on a.roleid = r.id left join location l on l.agentlocationcode = a.locationcode";
                return cnn.Query<UserViewModel>(sql);
            }
        }
        public IEnumerable<UserViewModel> GeteRfUser()
        {
            using (var cnn = OpenSunLifeDB())
            {
                var sql = "select a.LoginName, r.RoleName, case a.IsActive when 1 then 'Aktif' else 'Tidak Aktif' end Status from Account a left join role r on r.ID = a.RoleID where IsDeleted != 1";
                return cnn.Query<UserViewModel>(sql);
            }
        }
        public IEnumerable<DocumentCheckViewModel> GetSubmitedCandidate()
        {
            using (var cnn = OpenSunLifeDB())
            {
                var sql = "SELECT TemporaryAgentCode, Name CandidateName, Status FROM [eRecruit].[dbo].[Candidate] where Status = 'SUBMIT' AND TemporaryAgentCode IS NOT NULL";
                return cnn.Query<DocumentCheckViewModel>(sql);
            }
        }

        public IEnumerable<DocumentCheckViewModel> GetApprovedDocument()
        {
            using (var cnn = OpenSunLifeDB())
            {
                var sql = @"select Name CandidateName, TemporaryAgentCode, dc.Status, cd.Status [CandidateStatus], dc.Reason from Candidate cd  left join DocumentCheck dc on cd.ID = dc.CandidateId
where dc.Status = 'APPROVE' and cd.TemporaryAgentCode IS NOT NULL";
                return cnn.Query<DocumentCheckViewModel>(sql);
            }
        }

        public IEnumerable<DocumentCheckViewModel> GetPendingDocument()
        {
            using (var cnn = OpenSunLifeDB())
            {
                var sql = @"select Name CandidateName, TemporaryAgentCode, dc.Status, cd.Status [CandidateStatus], dc.Reason from Candidate cd  left join DocumentCheck dc on cd.ID = dc.CandidateId
where (dc.Status = 'NEED REVISION') and cd.TemporaryAgentCode IS NOT NULL";
                return cnn.Query<DocumentCheckViewModel>(sql);
            }
        }

        public IEnumerable<UserViewModel> GetListUser(string displayName, int page, int rowspPage, string role)
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.Query<UserViewModel>(DbQuery.GetListUser, new { displayName = displayName + "%", roleId = "%" + role + "%", PageNumber = page, RowsPage = rowspPage });
            }
        }
        public IEnumerable<UserViewModel> GetListUserTemplate()
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.Query<UserViewModel>(DbQuery.GetListUserTemplate, new { });
            }
        }

        public UserViewModel GetUser(string loginName)
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.QuerySingleOrDefault<UserViewModel>(DbQuery.GetUser, new { loginName = loginName });
            }
        }


        public string GetUserFromForgot(string link)
        {
            using (var cnn = OpenSunLifeDB())
            {//SELECT LoginName FROM ForgotPassword WHERE Link = @link
                return cnn.QuerySingleOrDefault<string>(DbQueryPortal.GetLoginNameFromForgot, new { Link = link });
            }
        }
        public UserViewModel GetAccount(string agentCode)
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.QuerySingleOrDefault<UserViewModel>(DbQueryPortal.GetAccount, new { AgentCode = agentCode });
            }
        }
        public UserViewModel GetUserMobile(string agentCode)
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.QuerySingleOrDefault<UserViewModel>(DbQueryPortal.GetUserMobile, new { AgentCode = agentCode });
            }
        }
        public UserViewModel GetUserActive(string loginName)
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.QuerySingleOrDefault<UserViewModel>(DbQueryPortal.GetUser, new { loginName = loginName });
            }
        }
        public IEnumerable<RecruiterAgentCodeViewModel> GetListRecruiterAgentCode(int page, int rowspPage, string teamCode, string agentCode, string displayName)
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.Query<RecruiterAgentCodeViewModel>(DbQuery.GetListRecruiterAgentCode, new { PageNumber = page, RowsPage = rowspPage, TeamCode = teamCode, AgentCode = agentCode, DisplayName = displayName });
            }
        }
        public UserViewModel GetUserPhoto(string loginName)
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.QuerySingleOrDefault<UserViewModel>("select Photo from Account where LoginName = @loginName", new { loginName = loginName });
            }
        }
        public int CekLoginName(string LoginName)
        {
            using (var cnn = OpenSunLifeDB())
            {
                var tes = cnn.QueryFirstOrDefault<int>(DbQuery.GetAccountByLoginName, new { loginName = LoginName });
                return tes;
            }
        }

        public UserViewModel GetEmailCreatedDate(string email)
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.QuerySingleOrDefault<UserViewModel>(DbQuery.GetEmailCreatedDate, new { Email = email });
            
            }
        }
        public string AddUser(UserViewModel user)
        {
            var result = "";
            user.RejectBy = null;
            user.AllLeaderApproved = false;
            user.IsDeleted = false;
            using (var cnn = OpenSunLifeDB())
            {
                //from RecruitmentFormRepository
                var AppUrlErecruit = ConfigurationManager.AppSettings["AppUrlErecruit"];
                var AppUrlErecruitPD = ConfigurationManager.AppSettings["AppUrlErecruitPD"];
                var RunningNumber = cnn.Query<int>(DbQueryPortal.GetValueGlobalConfiguration, new { Keyword = "TemporaryAgentCode" }).FirstOrDefault();
                user.LoginName = "U" + String.Format("{0:00000}", RunningNumber);
                result = user.LoginName;
                cnn.Execute("UPDATE GlobalConfiguration SET Value = @Value WHERE Keyword = @keyword", new { Value = (RunningNumber + 1), keyword = "TemporaryAgentCode" });
                user.RoleID = 14;
                user.AgentCode = user.LoginName ;
                user.IsActive = 1;
                //user.IsDeleted = 0;
               
                cnn.Execute(DbQuery.AddUser, new
                {
                    LoginName = user.LoginName,
                    Password = user.Password,
                    Email = user.Email.ToUpper(),
                    user.RoleID,
                    NamaDepan = user.NamaDepan.ToUpper(),
                    NamaBelakang = user.NamaBelakang.ToUpper(),
                    DisplayName = user.NamaDepan.ToUpper() + " " + user.NamaBelakang.ToUpper(),
                    AgentCode = user.AgentCode,
                    Gender = user.Gender,
                    PhoneNo = user.PhoneNo,
                    TeamCode = user.TeamCode,
                    LocationCode = user.LocationCode,
                    IsActive = user.IsActive,
                    IsDeleted = user.IsDeleted,
                    CreatedWhen = user.CreateDate,
                    CreatedBy = "user",
                    ChangedWhen = DateTime.Now,
                    ChangedBy = HttpContext.Current.User.Identity.Name,
                    HiringDate = user.HiringDate,
                    StatusEffective = user.StatusEffective,
                    SourceCandidate = user.SourceCandidate
                });

                //cnn.Execute(DbQuery.AddCandidateFromRegister, new
                //{
                //    namaLengkap = user.NamaDepan +" "+ user.NamaBelakang,
                //    loginName = user.LoginName.ToUpper(),
                //    tanggalSubmit = DateTime.Now,
                //    tanggalUpdate = DateTime.Now,
                //    changedBy = HttpContext.Current.User.Identity.Name,
                //    rejectBy = user.RejectBy,
                //    allLeaderApproved = user.AllLeaderApproved,
                //    isDeleted = user.IsDeleted,
                //    status= user.Status,
                //    temporaryAgentCode = user.LoginName.ToUpper()
                    
                //});

                var email = user.Email;
                var decryptPassword = RijndaelManagedEncryption.DecryptRijndael(user.Password);
                if (email != null && !string.IsNullOrEmpty(email))
                {
                    var body = "Hi " + user.NamaDepan.ToUpper() + " " + user.NamaBelakang.ToUpper() + "," + " <br /><br />" + 
                               "Selamat! Akun Anda sudah dapat di gunakan, " +
                               "silahkan klik tautan berikut " + AppUrlErecruitPD + " untuk masuk kembali dan gunakan UserID yang terlampir dalam email ini."
                                + " <br />" + "UserID" + "&nbsp; &nbsp; &nbsp; &nbsp;" +":"+ user.LoginName + " <br />" +
                               //"dan password " + data.BirthDate.ToString("ddMMMyyyy", CultureInfo.CreateSpecificCulture("id-ID")) + "<br /><br />" +
                               "Terimakasih telah bergabung dengan Sun Life <br /><br />" +
                               "Salam, <br />" +
                               "Sun Life Recruitment Team";
                    NotificationHelper.SendEmail("Sun Life eRecruitment Account Verification", email, body);
                }

            }

            return result;
        }

        public bool GetPassword(string loginName, string password)
        {
            using (var cnn = OpenSunLifeDB())
            {
                var inputPass = RijndaelManagedEncryption.EncryptRijndael(password);
               
               UserViewModel tes = cnn.QuerySingleOrDefault<UserViewModel>(DbQuery.GetPassword, new { LoginName = loginName });
                if (tes.Password != inputPass)
                {
                    return false;
                }
                    return true;
                }
        }

        public bool ToSendEmail(string loginName, string email, string status, string name)
        {
            var AppUrlErecruit = ConfigurationManager.AppSettings["AppUrlErecruit"];
            var AppUrlErecruitPD = ConfigurationManager.AppSettings["AppUrlErecruitPD"];
           
            DateTime submitDatePDF = DateTime.Now;
            using (var cnn = OpenSunLifeDB())
            {
                var result = true;
/*                var data1 = new CandidateDokumenViewModel();
                UserRepository userRepository = new UserRepository();
                var data = userRepository.GetAccountForProfile(loginName);
                string email = data.Email;*/
                if (status == "null")
                {
                    cnn.Execute(DbQuery.UpdateCandidateStatus, new
                    {
                        loginName = loginName,
                        status = "NEW",
                        tanggalGlobal = DateTime.Now
                        
                    });
                }

                if (email != null && !string.IsNullOrEmpty(email))
                {
                    var body = "Hi "+ name +", "+" <br /> <br />" +
                               "Aplikasi Anda sudah kami terima, silahkan menunggu proses selanjutnya. " + " <br />" +
                               "Anda dapat memantau status Aplikasi Anda melalui tautan " + AppUrlErecruitPD + " <br />" +
                               "Jika ada pertanyaan lebih lanjut silahkan menghubungi kami di (021) 5289 0000 (senin sampai jumat 09.00-17.00)" + " <br /> <br />" +
                               "Salam, <br />" +
                               "Sun Life Recruitment Team";
                    NotificationHelper.SendEmail("[Notifikasi] Aplikasi Anda Sudah di Terima", email, body);

                    cnn.Execute(DbQuery.UpdateSubmittedPDF, new { loginName = loginName, email = email, submitDatePDF = submitDatePDF });
                }
                return result;
            }     
        }
        public UserViewModel GetPDFSubmitStatus(string loginName)
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.Query<UserViewModel>(DbQuery.GetPDFSubmitStatus, new { loginName = loginName }).SingleOrDefault();
            }

        }
        public UserViewModel GetAccountForProfile(string loginName)
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.Query<UserViewModel>(DbQuery.GetAccountForProfile, new { loginName = loginName }).SingleOrDefault();
            }

        }

        public CandidateDokumenViewModel GetProfilePicture(string loginName)
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.Query<CandidateDokumenViewModel>(DbQuery.GetProfilePicture, new { loginName = loginName }).SingleOrDefault();
            }
        }

        public void UpdateAccountProfile(UserViewModel user)
        {
            using (var cnn = OpenSunLifeDB())
            {
                cnn.Execute(DbQuery.UpdateAccountProfile, new
                {
                    loginName = user.LoginName,
                    namaDepan = user.NamaDepan,
                    namaBelakang = user.NamaBelakang,
                    displayName = user.NamaDepan + " " + user.NamaBelakang,
                    email = user.Email,
                    phoneNo = user.PhoneNo,
                    changedWhen = DateTime.Now,
                });
            }
        }

        public void UpdateUser(UserViewModel user)
        {
            using (var cnn = OpenSunLifeDB())
            {
                cnn.Execute(DbQuery.UpdateUser, new
                {
                    RoleID = user.RoleID,
                    IsActive = user.IsActive,
                    IsDeleted = user.IsDeleted,
                    DisplayName = user.DisplayName,
                    Email = user.Email,
                    Gender = user.Gender,
                    AgentCode = user.AgentCode,
                    PhoneNo = user.PhoneNo,
                    TeamCode = user.TeamCode,
                    LocationCode = user.LocationCode,
                    Password = user.Password,
                    ChangedWhen = DateTime.Now,
                    ChangedBy = HttpContext.Current.User.Identity.Name,
                    HiringDate = user.HiringDate,
                    StatusEffective = user.StatusEffective
                });
            }
        }
        public void BulkInsertUpdate(DataTable data)
        {
            using (var cnn = OpenSunLifeDB())
            {
                cnn.Execute("exec dbo.Update_Account @tblAccount", new { tblAccount = data.AsTableValuedParameter("dbo.AccountType") });
                //Bulk insert into temp table
            }
        }

        public void AddUpdateUser(UserViewModel user)
        {
            using (var cnn = OpenSunLifeDB())
            {
                var sql = @"if exists(select LoginName from Account where LoginName = @LoginName)
                                update Account 
                                set RoleID = @RoleID, 
                                IsActive = @IsActive, 
                                IsDeleted = @IsDeleted, 
                                DisplayName = @DisplayName,
                                ChangedWhen = @ChangedWhen, 
                                ChangedBy = @ChangedBy,
                                Gender = @Gender,
                                PhoneNo = @PhoneNo,
                                TeamCode = @TeamCode,
                                LocationCode = @LocationCode,
                                Email = @Email,
                                Password = @Password,
                                HiringDate = @HiringDate,
                                StatusEffective = @StatusEffective
                                where AgentCode = @AgentCode 
                            else
                                insert into Account  (LoginName, Password, Email, RoleID, DisplayName, AgentCode, Gender, PhoneNo, TeamCode, LocationCode,
                                IsActive, IsDeleted, CreatedWhen, CreatedBy, ChangedWhen, ChangedBy, HiringDate, StatusEffective)  Values (@LoginName, @Password,
                                @Email,  @RoleID, @DisplayName, @AgentCode, @Gender, @PhoneNo, @TeamCode, @LocationCode, @IsActive, @IsDeleted, 
                                @CreatedWhen, @CreatedBy, @ChangedWhen, @ChangedBy, @HiringDate, @StatusEffective)
                            ";
                cnn.Execute(sql, new
                {
                    LoginName = user.LoginName,
                    Password = user.Password,
                    Email = user.Email,
                    RoleID = user.RoleID,
                    DisplayName = user.DisplayName,
                    AgentCode = user.AgentCode,
                    Gender = user.Gender,
                    PhoneNo = user.PhoneNo,
                    TeamCode = user.TeamCode,
                    LocationCode = user.LocationCode,
                    IsActive = user.IsActive,
                    IsDeleted = user.IsDeleted,
                    CreatedWhen = user.CreateDate,
                    CreatedBy = user.CreatedBy,
                    ChangedWhen = DateTime.Now,
                    ChangedBy = HttpContext.Current.User.Identity.Name,
                    HiringDate = user.HiringDate,
                    StatusEffective = user.StatusEffective
                });
            }
        }
        public void DeleteUser(string loginName)
        {
            using (var cnn = OpenSunLifeDB())
            {
                cnn.Execute(DbQuery.DeleteUser, new
                {
                    LoginName = loginName,
                    ChangedBy = HttpContext.Current.User.Identity.Name,
                    ChangedWhen = DateTime.Now
                });
            }
        }
        public bool CekAgentCode(string agentcode)
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.QueryFirstOrDefault<bool>("select count(*) from candidate where TemporaryAgentCode = @agentcode", new { agentcode = agentcode });
            }
        }
        public void SetPassword(UserViewModel user)
        {
            using (var cnn = OpenSunLifeDB())
            {
                cnn.Execute(DbQuery.ChangePasswordUser,
                    new
                    {
                        password = user.Password,
                        loginName = user.LoginName,
                        changedWhen = user.ChangedWhen
                    });
            }
        }

        public void ExpiringChangePasswordUser(UserViewModel user)
        {
            using (var cnn = OpenSunLifeDB())
            {
                cnn.Execute(DbQuery.ExpiringChangePasswordUser,
                    new
                    {
                        isActive = false,
                        confirmDate = DateTime.Now,
                        loginName = user.LoginName,
                        });
            }
        }
/*
            the origin
        public void SetPassword(UserViewModel user)
        {
            using (var cnn = OpenSunLifeDB())
            {
                cnn.Execute(DbQuery.ChangePasswordUser,
                    new
                    {
                        Password = user.Password,
                        LoginName = user.LoginName
                    });
            }
        }*/
        public bool CekEmailUser(string email)
        {
            using (var cnn = OpenSunLifeDB())
            {
                string sql = "SELECT COUNT(*) FROM Account WHERE Email = @Email";
                var count = cnn.Query<int>(sql, new { Email = email }).Single();
                if (count > 0)
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
        }
        public IEnumerable<UserViewModel> GetAllManagers()
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.Query<UserViewModel>(DbQuery.GetAllManager);
            }
        }
        public IEnumerable<UserViewModel> GetManager(string agentcode, string displayname, int page, int rowspPage)
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.Query<UserViewModel>(DbQuery.GetListManager, new { PageNumber = page, RowsPage = rowspPage, DisplayName = '%' + displayname + '%', AgentCode = agentcode });
            }
        }

        public UserViewModel GetEmailAndLoginName(string email,string loginName)
        {
            var ret = "test";
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.Query<UserViewModel>(DbQuery.GetEmailAndLoginName, new { email = email, loginName = loginName }).SingleOrDefault();
            }
            
        }

        public string GenerateForgotPassword(UserViewModel user)
        {
            var AppUrlErecruit = ConfigurationManager.AppSettings["AppUrlErecruit"];
            var AppUrlErecruitPD = ConfigurationManager.AppSettings["AppUrlErecruitPD"];
            try
            {
                using (var cnn = OpenSunLifeDB())

                {
                    var validDate = DateTime.Now.AddDays(-1);
                    //var data = cnn.Query<UserViewModel>("SELECT * FROM ForgotPassword WHERE Email = '" + email + "' AND IsActive = 1 AND CreateDate > '" + validDate + "'").FirstOrDefault();
                    var data = cnn.Query<UserViewModel>("SELECT * FROM ForgotPassword WHERE Email = @email AND LoginName = @loginName AND IsActive = @IsActive AND CreateDate > @createDate", new { email = user.Email, loginName = user.LoginName, createDate = validDate, IsActive = 1 }).FirstOrDefault();
                    if (data != null)
                    {
                        return data.Link;
                    }
                    else
                    {
                        //masuk ke database forgotpassword
                        //var account = cnn.Query<UserViewModel>("SELECT * FROM Account WHERE Email = '" + email + "' AND IsActive = 1 AND IsDeleted = 0").FirstOrDefault();
                        var account = cnn.Query<UserViewModel>("SELECT * FROM Account WHERE Email = @email AND LoginName = @loginName AND IsActive = @IsActive AND IsDeleted = @IsDelete", new { email = user.Email, loginName = user.LoginName, IsActive = 1, IsDelete = 0 }).FirstOrDefault();
                        var guid = Guid.NewGuid();
                        string link = guid.ToString().Replace("-", string.Empty);

                        //link ini mending ditaro di web.config kalo udah ada domain resmi dll nya

                        cnn.Execute("INSERT INTO ForgotPassword (LoginName, Email, Link, CreateDate, IsActive) VALUES (@loginname,@email,@link,@date,@isactive)", new { loginname = account.LoginName, email = user.Email, link = link, date = DateTime.Now, isactive = account.IsActive });
                        //string generateLink = "http://localhost:50525/#!/changePassword/" + link; //+ account.LoginName;
                        string generateLink = AppUrlErecruitPD +"/#!/changePassword/" + link; //+ account.LoginName;

                        //kirim email 
                        var emailSend = account.Email;
                        var decryptPassword = RijndaelManagedEncryption.DecryptRijndael(account.Password);
                        if (emailSend != null && !string.IsNullOrEmpty(emailSend))
                        {
                            var body = "Halo, anda telah meminta untuk reset password. " +
                                       "Silahkan masukan password baru di " + generateLink +
                                       //"dan password " + data.BirthDate.ToString("ddMMMyyyy", CultureInfo.CreateSpecificCulture("id-ID")) + "<br /><br />" +
                                       "<br /><br />" +
                                       "Best Regards, <br /><br />" +
                                       "Sunlife eRecruit";
                            NotificationHelper.SendEmail("Reset Password Account Sunlife ERecruit", user.Email, body);
                        }

                        return link;
                    }
                }
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }
        public bool ResetPassword(UserViewModel model)
        {
            using (var cnn = OpenSunLifeDB())
            {
                try
                {
                    var validDate = DateTime.Now.AddDays(-1);
                    //var data = cnn.Query<UserViewModel>("SELECT * FROM ForgotPassword WHERE Link = '" + model.Link + "' AND IsActive = 1 AND CreateDate > '" + validDate + "'").FirstOrDefault();
                    var data = cnn.Query<UserViewModel>("SELECT * FROM ForgotPassword WHERE Link = @link AND IsActive = @IsActive AND CreateDate > @date", new { link = model.Link, date = validDate, IsActive = 1 }).FirstOrDefault();
                    if (data != null)
                    {
                        var encryptPassword = RijndaelManagedEncryption.EncryptRijndael(model.InputNewPassword);
                        cnn.Execute("UPDATE Account SET Password = '" + encryptPassword + "', WrongPassword = @WrongPassword WHERE LoginName = @loginname", new { loginname = data.LoginName, WrongPassword = 0 });
                        //cnn.Execute("UPDATE ForgotPassword SET IsActive = 0, ConfirmDate = '" + DateTime.Now + "' WHERE Link = '" + model.Link + "'");
                        cnn.Execute("UPDATE ForgotPassword SET IsActive = @IsActive, ConfirmDate = @date WHERE Link = @link", new { date = DateTime.Now, link = model.Link, IsActive = 1 });
                    }
                    return true;
                }
                catch (Exception ex)
                {
                    return false;
                }
            }
        }

        public bool CheckLinkReset(string linkEmail)
        {
            using (var cnn = OpenSunLifeDB())
            {
                string sql = "SELECT COUNT(*) FROM ForgotPassword WHERE Link = @link";
                var count = cnn.Query<int>(sql, new { Link = linkEmail }).Single();
                if (count > 0)
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
/*            try
            {
                using (var cnn = OpenSunLifeDB())
                {
                    var check = cnn.Query<UserViewModel>("SELECT * FROM ForgotPassword WHERE Link = @link", new { Link = linkEmail}).FirstOrDefault();
                    if (linkEmail == check.Link)
                    {
                        return true;
                    }
                    return false;
                }

                
            }
            catch (Exception ex)
            {
                return false;
            }*/
            
            }
        public bool IsLocked(string loginName)
        {
            using (var cnn = OpenSunLifeDB())
            {
                var wrongPassword = cnn.Query<int>("SELECT WrongPassword FROM Account WHERE LoginName = @login AND IsActive = @isactive AND IsDeleted = @isdelete", new { login = loginName, isactive = 1, isdelete = 0 }).FirstOrDefault();
                if (wrongPassword >= 3)
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
        }
        public IEnumerable<CandidateViewModel> GetRekening(string From, string To)
        {
            using (var cnn = OpenSunLifeDB())
            {
                string sql = "select c.TemporaryAgentCode AgentCode, c.Name ,c.BankAccountNo, b.BankCode,b.BankName from Candidate C left join Bank b on c.BankCode = b.BankCode  where ActiveDate is not null and convert(date,activedate) between convert(date,@From) and convert(date,@To)";
                if (string.IsNullOrEmpty(From) && string.IsNullOrEmpty(To))
                {
                    sql = "select c.TemporaryAgentCode AgentCode, c.Name,c.BankAccountNo, b.BankCode,b.BankName from Candidate C left join Bank b on c.BankCode = b.BankCode WHERE ActiveDate is not null";
                    return cnn.Query<CandidateViewModel>(sql);
                }
                return cnn.Query<CandidateViewModel>(sql, new { From = From, To = To });
            }
        }
        public IEnumerable<UserViewModel> GetEmailSunlife(string From, string To)
        {
            using (var cnn = OpenSunLifeDB())
            {
                var data = new List<UserViewModel>();
                string sql = "select TemporaryAgentCode LoginName,Name DisplayName,Email,CreatedWhen from Candidate where TemporaryAgentCode is not null and Email is not null and convert(datetime,CreatedWhen) between convert(datetime,@From) and convert(datetime,@To)";
                if (string.IsNullOrEmpty(From) && string.IsNullOrEmpty(To))
                {
                    sql = "select TemporaryAgentCode LoginName,Name DisplayName,Email,CreatedWhen from Candidate where TemporaryAgentCode is not null and Email is not null";
                    data = cnn.Query<UserViewModel>(sql).ToList();
                }

                data = cnn.Query<UserViewModel>(sql, new { From = From, To = To }).ToList();

                foreach (var item in data)
                {
                    var firstName = item.DisplayName.Split(' ');
                    item.Email = string.Concat(firstName[0].Replace(".", ""), ".", item.LoginName, "@sunlife.co.id");
                }

                return data;
            }
        }
        public IEnumerable<string> GetDataTraining(string From, string To)
        {
            using (var cnn = OpenSunLifeDB())
            {
                //get list candidate passed training
                string sql = "select Concat(c.TemporaryAgentCode,',','436',',',CONVERT(VARCHAR(12),convert(datetime, convert(varchar(30), c.ElearningPassedDate), 101),103),',',l.AgentLocation)  from Candidate c left join Location l on l.AgentlocationCode = c.LocationCode where Status != @Status AND ELearningPassedFlag = @ELearningPassedFlag and convert(date,c.ElearningPassedDate) between convert(date,@From) and convert(date,@To)";
                if (string.IsNullOrEmpty(From) && string.IsNullOrEmpty(To))
                {
                    sql = "select Concat(c.TemporaryAgentCode,',','436',',',CONVERT(VARCHAR(12),convert(datetime, convert(varchar(30), c.ElearningPassedDate), 101),103),',',l.AgentLocation)  from Candidate c left join Location l on l.AgentlocationCode = c.LocationCode where IsDelete != 1 and Status != @Status AND ELearningPassedFlag = @ELearningPassedFlag";
                    return cnn.Query<string>(sql, new { Status = "Reject", ELearningPassedFlag = 1 });
                }

                return cnn.Query<string>(sql, new { From = From, To = To, IsDelete = 1, Status = "Reject", ELearningPassedFlag = 1 });
            }
        }

        public IEnumerable<AgenProfileListViewModel> GetProfileAgentList(string From, string To)
        {
            using (var cnn = OpenSunLifeDB())
            {
                string sql = "";
                if (string.IsNullOrEmpty(From) && string.IsNullOrEmpty(To))
                {
                    //productive date
                    //(case when c.ActiveDate is null and c.ElearningPassedDate is null then c.ChangedWhen
                    //when c.ElearningPassedDate is not null and c.ActiveDate is null then c.ElearningPassedDate
                    //when c.ActiveDate is not null then c.ActiveDate else c.CreatedWhen end)

                    sql = @"select format(c.SubmitDate,'dd/MM/yyyy') SubmitDate,'RES' [RestType], (case when c.ActiveDate is null then format(c.ActiveDate,'dd/MM/yyyy') else format(dateadd(month,datediff(month,0,c.ActiveDate),0),'dd/MM/yyyy') end) ContractedDate, c.TemporaryAgentCode, upper(c.Name) Name,upper(r.RoleName)  Clas,(case c.Gender when 'L' then 'M' else 'F' end) Gender, CONVERT(varchar(12),c.BirthDate,103) BirthDate, upper(c.BirthPlace) BirthPlace, upper(c.Religion) Religion, (case co.CountryCode when 'IO' then 'INDONESIA' else 'INDONESIA' end) Nationality,(case when lower(c.MaritalStatus) = 'menikah' then 'M' else 'S' end) CivilStatus,upper(concat(c.HomeAddress,' ',ci.Name,' ',c.CurrentPostalCode)) HomeAddress,a.TeamCode BranchCode ,Upper(e.TeamName)BranchName,c.DirectManagerCode,upper(a.DisplayName) DisplayName,c.BankCode,c.BankAccountNo,c.KTPNo,c.NPWPNo TaxID,'NO' MainEmployer, format(dateadd(month,datediff(month,0,c.ActiveDate),0),'dd/MM/yyyy') EffectiveDate,'' DTCode,'' Gen1,'' Genal,c.HomePhone,upper(l.AgentLocation) OfficeLocation,c.PhoneNo,Upper(ce.Level)  [EducationLevel],upper(ce.InstitutionName) InstitutionName,ce.YearFrom AttendenceFrom,ce.YearTo AttendenceTo,upper(cex.CompanyName) CompanyName, upper(cex.Position) Position,format(convert(datetime,(cast(cex.fromdate as varchar(20)) + ' 00:00:00.000')),'dd/MM/yyyy') [FromDate],format(cex.ToDate,'dd/MM/yyyy') [ToDate],c.RecruiterAgentCode Recruiter,case when c.ActiveDate is null then format(c.SubmitDate,'dd/MM/yyyy') else format(c.ActiveDate, 'dd/MM/yyyy') end [ProductiveDate], upper(c.Email) [Email],convert(int,ch.TotalScore) [FinalInterviewResult] from Candidate c left join Account a on a.LoginName=c.DirectManagerCode left join (select * from (select row_number() over (partition by CandidateId order by YearFrom desc) Num, CandidateID,InstitutionName,YearFrom,YearTo,Level from CandidateEducation) as x where x.Num = 1) ce on ce.CandidateID=c.ID left join city cc on cc.CityCode=c.CityCode left join Province p on p.ProvinceCode=cc.ProvinceCode left join Country co on co.CountryCode=p.CountryCode left join (select * from (
select Row_number() over (partition by candidateid order by totalscore desc) num, * from CandidateProfilingHeader) t where t.num = 1) ch on ch.CandidateID = c.ID left join Location l on l.AgentLocationCode=c.LocationCode left join (select * from (
select Row_number() over (partition by candidateid order by todate desc) num,* from CandidateExperience) t where t.num = 1) cex on cex.CandidateID = c.ID left join role r on r.ID=c.Level left join team e on e.TeamCode=a.TeamCode left join City ci on c.CurrentCityCode = ci.CityCode
where c.SubmitDate is not null";
                    return cnn.Query<AgenProfileListViewModel>(sql);
                }
                else
                {
                    sql = @"select format(c.SubmitDate,'dd/MM/yyyy') SubmitDate,'RES' [RestType], (case when c.ActiveDate is null then format(c.ActiveDate,'dd/MM/yyyy') else format(dateadd(month,datediff(month,0,c.ActiveDate),0),'dd/MM/yyyy') end) ContractedDate, c.TemporaryAgentCode, upper(c.Name) Name,upper(r.RoleName)  Clas,(case c.Gender when 'L' then 'M' else 'F' end) Gender, CONVERT(varchar(12),c.BirthDate,103) BirthDate, upper(c.BirthPlace) BirthPlace, upper(c.Religion) Religion, (case co.CountryCode when 'IO' then 'INDONESIA' else 'INDONESIA' end) Nationality,(case when lower(c.MaritalStatus) = 'menikah' then 'M' else 'S' end) CivilStatus,upper(concat(c.HomeAddress,' ',ci.Name,' ',c.CurrentPostalCode)) HomeAddress,a.TeamCode BranchCode ,Upper(e.TeamName)BranchName,c.DirectManagerCode,upper(a.DisplayName) DisplayName,c.BankCode,c.BankAccountNo,c.KTPNo,c.NPWPNo TaxID,'NO' MainEmployer, format(dateadd(month,datediff(month,0,c.ActiveDate),0),'dd/MM/yyyy') EffectiveDate,'' DTCode,'' Gen1,'' Genal,c.HomePhone,upper(l.AgentLocation) OfficeLocation,c.PhoneNo,Upper(ce.Level)  [EducationLevel],upper(ce.InstitutionName) InstitutionName,ce.YearFrom AttendenceFrom,ce.YearTo AttendenceTo,upper(cex.CompanyName) CompanyName, upper(cex.Position) Position,format(convert(datetime,(cast(cex.fromdate as varchar(20)) + ' 00:00:00.000')),'dd/MM/yyyy') [FromDate],format(cex.ToDate,'dd/MM/yyyy') [ToDate],c.RecruiterAgentCode Recruiter,case when c.ActiveDate is null then format(c.SubmitDate,'dd/MM/yyyy') else format(c.ActiveDate, 'dd/MM/yyyy') end [ProductiveDate], upper(c.Email) [Email],convert(int,ch.TotalScore) [FinalInterviewResult] from Candidate c left join Account a on a.LoginName=c.DirectManagerCode left join (select * from (select row_number() over (partition by CandidateId order by YearFrom desc) Num, CandidateID,InstitutionName,YearFrom,YearTo,Level from CandidateEducation) as x where x.Num = 1) ce on ce.CandidateID=c.ID left join city cc on cc.CityCode=c.CityCode left join Province p on p.ProvinceCode=cc.ProvinceCode left join Country co on co.CountryCode=p.CountryCode left join (select * from (
select Row_number() over (partition by candidateid order by totalscore desc) num, * from CandidateProfilingHeader) t where t.num = 1) ch on ch.CandidateID = c.ID left join Location l on l.AgentLocationCode=c.LocationCode left join (select * from (
select Row_number() over (partition by candidateid order by todate desc) num,* from CandidateExperience) t where t.num = 1) cex on cex.CandidateID = c.ID left join role r on r.ID=c.Level left join team e on e.TeamCode=a.TeamCode left join City ci on c.CurrentCityCode = ci.CityCode
where c.SubmitDate is not null and FORMAT(c.SubmitDate,'MM/dd/yyyy') between @From and @To";
                }
                return cnn.Query<AgenProfileListViewModel>(sql, new { From = From, To = To }).Distinct();
            }
        }

        public IEnumerable<UserViewModel> GetListRecruiterAgentCode()
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.Query<UserViewModel>("select LoginName, RoleId from Account");
            }
        }

        public IEnumerable<LisensiViewModel> GetLisensi(string From, string To)
        {
            using (var cnn = OpenSunLifeDB())
            {
                //get list candidate passed training
                string sql = @"select ROW_NUMBER() over (order by c.Id) No, c.Name CandidateName ,'PT SUN LIFE FINANCIAL INDONESIA' CompanyName, CONCAT(r.AajiCode,(case when r.AasiCode is not null and len(r.aasicode) > 0 then ', ' + AasiCode end)) AAjiAAsiCode,'Active' Status, c.PermanentAgentCode,CONVERT(varchar(12),c.BirthDate,103) BirthDate,c.KTPNo,r.LicenseType,r.ExamProduct ProductType,case when (len(r.ExpiredLicense)>0) then format(DATEADD(year,-2,r.ExpiredLicense),'dd/MM/yyyy') else null end SertifiedSince,format(convert(datetime,r.ExpiredLicense),'dd/MM/yyyy') ExpiredLicense from ResultExam r
left join Candidate c on c.TemporaryAgentCode = r.AgentCode where c.IsDeleted != 1 and c.Status != 'REJECT' and c.ActiveDate is not null and convert(date,c.ActiveDate)  between convert(date,@From) and convert(date,@To)";
                if (string.IsNullOrEmpty(From) && string.IsNullOrEmpty(To))
                {
                    sql = @"select ROW_NUMBER() over (order by c.Id) No, c.Name CandidateName ,'PT SUN LIFE FINANCIAL INDONESIA' CompanyName, CONCAT(r.AajiCode,(case when r.AasiCode is not null and len(r.aasicode) > 0 then ', ' + AasiCode end)) AAjiAAsiCode,'Active' Status, c.PermanentAgentCode,CONVERT(varchar(12),c.BirthDate,103) BirthDate,c.KTPNo,r.LicenseType,r.ExamProduct ProductType,case when (len(r.ExpiredLicense)>0) then format(DATEADD(year,-2,r.ExpiredLicense),'dd/MM/yyyy') else null end SertifiedSince,format(convert(datetime,r.ExpiredLicense),'dd/MM/yyyy') ExpiredLicense from ResultExam r
left join Candidate c on c.TemporaryAgentCode = r.AgentCode where c.IsDeleted != 1 and c.Status != 'REJECT' and c.ActiveDate is not null";
                    return cnn.Query<LisensiViewModel>(sql);
                }
                return cnn.Query<LisensiViewModel>(sql, new { From = From, To = To });
            }
        }
        public IEnumerable<string> GetAgis(string From, string To)
        {
            using (var cnn = OpenSunLifeDB())
            {
                //get list candidate passed training
                string sql = @"select UPPER(concat(c.PermanentAgentCode,'#',1,'#',C.DirectManagerCode,'#',convert(varchar(12),dateadd(month,datediff(month,0,c.ActiveDate),0),103),'#',ree.RoleName,'#','#','CAN','#',(case c.Gender when 'L' then 'Mr' else 'Mrs' end),'#',(CASE WHEN CHARINDEX(' ', c.name) > 0 THEN SUBSTRING(c.name,CHARINDEX(' ',c.name)+1, ( LEN(c.name) - CHARINDEX(' ',c.name)+1) ) ELSE '' END),'#',(left(c.name, CHARINDEX(' ', c.name + ' ') -1)),'#',(case c.Gender when 'L' then 'M' else 'F' end),'#',(case c.MaritalStatus when 'Menikah' then 'M' else 'S' end),'#','IND','#',convert(varchar(12),c.BirthDate,103),'#',REPLACE(C.BirthPlace,',','.'),'#',c.Religion,'#',c.KTPNo,'#',c.NPWPNo,'#',REPLACE(c.HomeAddress,',','.'),'#','#','#',c.CityCode,'#',c.PostalCode,'#','RES2','#',REPLACE(c.CurrentAddress,',','.'),'#','#','#',c.CurrentCityCode,'#',c.CurrentPostalCode,'#','RES','#',(case when l.NameBranch is not null then '' else l.AgentLocationCode end),'#',convert(varchar(12),dateadd(month,datediff(month,0,c.ActiveDate),0),103),'##','#',c.PhoneNo,'#',c.PhoneNo,'#',(CASE WHEN CHARINDEX(' ', replace(c.SpouseName,',','.')) > 0 THEN SUBSTRING(replace(c.SpouseName,',','.'),CHARINDEX(' ',replace(c.SpouseName,',','.'))+1, ( LEN(replace(c.SpouseName,',','.')) - CHARINDEX(' ',replace(c.SpouseName,',','.'))+1) ) ELSE '' END),'#',(left(replace(c.SpouseName,',','.'), CHARINDEX(' ', replace(c.SpouseName,',','.') + ' ') -1)),'#',Convert(varchar(12),c.SpouseBirthDate,103),'#',(case when C.MaritalStatus = 'Menikah' and c.Gender = 'L' then 'Wife'  when C.MaritalStatus = 'Menikah' and c.Gender = 'P' then 'Husband' else null end)
,'#',cd.CandidateDepend,'#',(case when ce.Level  = 'S3' then 'DO' when ce.Level = 'S2' then 'MA' when ce.Level = 'S1' then 'CO' when ce.Level = 'D3' or ce.Level  = 'Diploma' then 'TE' when ce.Level = 'SMA' or ce.Level = 'SLTA' then 'SE' end),'#',replace(ce.InstitutionName,',','.'),'#',ce.YearFrom,'#',ce.YearTo,'#',REPLACE(cexp.CompanyName,',','.'),'#',cexp.Position,'#',YEAR(cexp.FromDate),'#',year(ToDate),'#',c.RecruiterAgentCode,'#','RCTRB','#',convert(varchar(12),dateadd(month,datediff(month,0,c.ActiveDate),0),103),'#',ac.TeamCode
)) from Candidate c left join Account ac on ac.LoginName = c.RecruiterAgentCode left join Role r on r.id=ac.RoleID left join (

select ID CandidateId, case when ((len(t.CandidateDepend) - len(replace(t.CandidateDepend,'#','')))) = 3 then CONCAT(t.CandidateDepend,'########') 
  when ((len(t.CandidateDepend) - len(replace(t.CandidateDepend,'#','')))) = 7 then CONCAT(t.CandidateDepend,'####')
  when ((len(t.CandidateDepend) - len(replace(t.CandidateDepend,'#','')))) = 11 then t.CandidateDepend
  when (t.CandidateDepend is null) then '###########' end CandidateDepend
  from(
SELECT 
  c.ID,
  STUFF((
    SELECT '# ' + ( (CASE WHEN CHARINDEX(' ', replace(cd.name,',','.')) > 0 THEN SUBSTRING(replace(cd.name,',','.'),CHARINDEX(' ',replace(cd.name,',','.'))+1, ( LEN(cd.name) - CHARINDEX(' ',replace(cd.name,',','.'))+1) ) ELSE '' END) )  + '#' + (left(replace(CD.Name,',','.'), CHARINDEX(' ', replace(CD.Name,',','.') + ' ') -1)) + '#' + CONVERT(varchar(12),cd.BirthDate,103)+ '#' + 'Child'
    FROM Candidate c left join (select * from (select row_number() over (partition by CandidateId order by BirthDate asc) Num, * from CandidateDependencies) as x where x.Num <=3) cd on c.id=cd.CandidateId
    WHERE (cd.CandidateId = Results.CandidateId) 
    FOR XML PATH(''),TYPE).value('(./text())[1]','VARCHAR(MAX)')
  ,1,2,'') AS CandidateDepend
FROM Candidate c left join (select * from (select row_number() over (partition by CandidateId order by BirthDate asc) Num, * from CandidateDependencies) as x where x.Num <=3) Results on c.id=Results.CandidateId 
GROUP BY c.ID,Results.CandidateId) t
) cd on cd.CandidateId=c.ID left join (select * from (select row_number() over (partition by CandidateId order by YearFrom desc) Num, CandidateID,InstitutionName,YearFrom,YearTo,Level from CandidateEducation) as x where x.Num = 1) ce on ce.CandidateID=c.ID 
left join (select * from (select row_number() over (partition by CandidateId order by ToDate desc) Num, * from CandidateExperience) as x where x.Num = 1) cexp on cexp.CandidateID=c.ID left join Location l on l.AgentLocationCode=c.LocationCode left join Role ree on ree.id=c.Level
where c.ActiveDate is not null and c.Status != 'REJECT' and c.PermanentAgentCode is not null and ac.TeamCode is not null and format(c.ActiveDate,'MM/dd/yyyy') between @From and @To order by c.ChangedWhen desc
";
                if (string.IsNullOrEmpty(From) && string.IsNullOrEmpty(To))
                {
                    sql = @"
select UPPER(concat(c.PermanentAgentCode,'#',1,'#',C.DirectManagerCode,'#',convert(varchar(12),dateadd(month,datediff(month,0,c.ActiveDate),0),103),'#',ree.RoleName,'#','#','CAN','#',(case c.Gender when 'L' then 'Mr' else 'Mrs' end),'#',(CASE WHEN CHARINDEX(' ', c.name) > 0 THEN SUBSTRING(c.name,CHARINDEX(' ',c.name)+1, ( LEN(c.name) - CHARINDEX(' ',c.name)+1) ) ELSE '' END),'#',(left(c.name, CHARINDEX(' ', c.name + ' ') -1)),'#',(case c.Gender when 'L' then 'M' else 'F' end),'#',(case c.MaritalStatus when 'Menikah' then 'M' else 'S' end),'#','IND','#',convert(varchar(12),c.BirthDate,103),'#',REPLACE(C.BirthPlace,',','.'),'#',c.Religion,'#',c.KTPNo,'#',c.NPWPNo,'#',REPLACE(c.HomeAddress,',','.'),'#','#','#',c.CityCode,'#',c.PostalCode,'#','RES2','#',REPLACE(c.CurrentAddress,',','.'),'#','#','#',c.CurrentCityCode,'#',c.CurrentPostalCode,'#','RES','#',(case when l.NameBranch is not null then '' else l.AgentLocationCode end),'#',convert(varchar(12),dateadd(month,datediff(month,0,c.ActiveDate),0),103),'##','#',c.PhoneNo,'#',c.PhoneNo,'#',(CASE WHEN CHARINDEX(' ', replace(c.SpouseName,',','.')) > 0 THEN SUBSTRING(replace(c.SpouseName,',','.'),CHARINDEX(' ',replace(c.SpouseName,',','.'))+1, ( LEN(replace(c.SpouseName,',','.')) - CHARINDEX(' ',replace(c.SpouseName,',','.'))+1) ) ELSE '' END),'#',(left(replace(c.SpouseName,',','.'), CHARINDEX(' ', replace(c.SpouseName,',','.') + ' ') -1)),'#',Convert(varchar(12),c.SpouseBirthDate,103),'#',(case when C.MaritalStatus = 'Menikah' and c.Gender = 'L' then 'Wife'  when C.MaritalStatus = 'Menikah' and c.Gender = 'P' then 'Husband' else null end)
,'#',cd.CandidateDepend,'#',(case when ce.Level  = 'S3' then 'DO' when ce.Level = 'S2' then 'MA' when ce.Level = 'S1' then 'CO' when ce.Level = 'D3' or ce.Level  = 'Diploma' then 'TE' when ce.Level = 'SMA' or ce.Level = 'SLTA' then 'SE' end),'#',replace(ce.InstitutionName,',','.'),'#',ce.YearFrom,'#',ce.YearTo,'#',REPLACE(cexp.CompanyName,',','.'),'#',cexp.Position,'#',YEAR(cexp.FromDate),'#',year(ToDate),'#',c.RecruiterAgentCode,'#','RCTRB','#',convert(varchar(12),dateadd(month,datediff(month,0,c.ActiveDate),0),103),'#',ac.TeamCode
)) from Candidate c left join Account ac on ac.LoginName = c.RecruiterAgentCode left join Role r on r.id=ac.RoleID left join (

select ID CandidateId, case when ((len(t.CandidateDepend) - len(replace(t.CandidateDepend,'#','')))) = 3 then CONCAT(t.CandidateDepend,'########') 
  when ((len(t.CandidateDepend) - len(replace(t.CandidateDepend,'#','')))) = 7 then CONCAT(t.CandidateDepend,'####')
  when ((len(t.CandidateDepend) - len(replace(t.CandidateDepend,'#','')))) = 11 then t.CandidateDepend
  when (t.CandidateDepend is null) then '###########' end CandidateDepend
  from(
SELECT 
  c.ID,
  STUFF((
    SELECT '# ' + ( (CASE WHEN CHARINDEX(' ', replace(cd.name,',','.')) > 0 THEN SUBSTRING(replace(cd.name,',','.'),CHARINDEX(' ',replace(cd.name,',','.'))+1, ( LEN(cd.name) - CHARINDEX(' ',replace(cd.name,',','.'))+1) ) ELSE '' END) )  + '#' + (left(replace(CD.Name,',','.'), CHARINDEX(' ', replace(CD.Name,',','.') + ' ') -1)) + '#' + CONVERT(varchar(12),cd.BirthDate,103)+ '#' + 'Child'
    FROM Candidate c left join (select * from (select row_number() over (partition by CandidateId order by BirthDate asc) Num, * from CandidateDependencies) as x where x.Num <=3) cd on c.id=cd.CandidateId
    WHERE (cd.CandidateId = Results.CandidateId) 
    FOR XML PATH(''),TYPE).value('(./text())[1]','VARCHAR(MAX)')
  ,1,2,'') AS CandidateDepend
FROM Candidate c left join (select * from (select row_number() over (partition by CandidateId order by BirthDate asc) Num, * from CandidateDependencies) as x where x.Num <=3) Results on c.id=Results.CandidateId 
GROUP BY c.ID,Results.CandidateId) t
) cd on cd.CandidateId=c.ID left join (select * from (select row_number() over (partition by CandidateId order by YearFrom desc) Num, CandidateID,InstitutionName,YearFrom,YearTo,Level from CandidateEducation) as x where x.Num = 1) ce on ce.CandidateID=c.ID 
left join (select * from (select row_number() over (partition by CandidateId order by ToDate desc) Num, * from CandidateExperience) as x where x.Num = 1) cexp on cexp.CandidateID=c.ID left join Location l on l.AgentLocationCode=c.LocationCode left join Role ree on ree.id=c.Level
where c.ActiveDate is not null and c.Status != 'REJECT' and c.PermanentAgentCode is not null and ac.TeamCode is not null order by c.ChangedWhen desc";
                    return cnn.Query<string>(sql);
                }
                return cnn.Query<string>(sql, new { From = From, To = To });
            }
        }
        public IEnumerable<BranchLocationViewModel> GetBranchLocation(string From, string To)
        {
            using (var cnn = OpenSunLifeDB())
            {
                //get list candidate passed training
                string sql = @"select * from (select TeamCode AgentLocationCode,TeamName, '' AgentLocation, '' Email,'' PhoneNumber, '' BranchAdmin, null CreatedWhen
                                from Team union all select '' AgentLocationCode, NameBranch TeamName, AgentLocation, Email,PhoneNumber,BranchAdmin, CreatedWhen CreatedWhen from Location where NameBranch is not null and IsDelete != 1) t";
                if (!string.IsNullOrEmpty(From) && !string.IsNullOrEmpty(To))
                {
                    sql = sql + " where t.CreatedWhen is not null and CONVERT(date,CreatedWhen) between @From and @To";
                    return cnn.Query<BranchLocationViewModel>(sql, new { From = From, To = To });
                }
                return cnn.Query<BranchLocationViewModel>(sql);
            }
        }

        public void UpdateAllExistingPendingApproval(List<String> ListUpdatedHierarkiAgent)
        {
            string sql = "";
            string statusApprovalAs = "";
            string currentAd = "";
            NotificationHelper notificationHelper = new NotificationHelper();
            ApprovalFormRepository approvalFormRepository = new ApprovalFormRepository();

            var hierarki = new HierarkiViewModel();
            using (var cnn = OpenSunLifeDB())
            {
                sql = "select al.*,c.Level CandidateLevel, c.status from approvallist al left join candidate c on al.candidateid=c.id where al.approvaldate is null and al.statusapproval is null--and al.isactive = 1  c.status != 'reject' and order by candidateid asc";
                var listPendingApproval = cnn.Query<ApprovalProgressViewModel>(sql);
                if (listPendingApproval != null && listPendingApproval.Count() > 0)
                {
                    foreach (var item in listPendingApproval)
                    {
                        hierarki = new HierarkiViewModel();
                        var isAgentExistOnUpdated = ListUpdatedHierarkiAgent.Where(x => x == item.RecruiterCode).FirstOrDefault();
                        var currentApprovalCode = cnn.Query<string>("select top 1 ApproverCode from approvallist where CandidateId = @CandidateId order by id desc", new { CandidateId = item.CandidateId }).FirstOrDefault();
                        if (isAgentExistOnUpdated != null)
                        {
                            int countCurrentApproval = cnn.Query<int>("select count(id) from ApprovalList where CandidateId = @CandidateId and ApprovalDate is not null and StatusApproval is not null", new { CandidateId = item.CandidateId }).FirstOrDefault();
                            var candidateData = cnn.QueryFirstOrDefault<CandidateViewModel>(DbQueryPortal.GetCandidate, new { CandidateId = item.CandidateId });


                            var rulesApproval = cnn.Query<ApprovalRuleViewModel>("SELECT ApprovalLevelId FROM ApprovalRules WHERE CandidateLevel = @Level and isdelete = @IsDelete", new { Level = item.CandidateLevel, IsDelete = 0 });

                            StringBuilder sb = new StringBuilder();
                            int[] listApp;
                            foreach (var items in rulesApproval)
                            {
                                sb.Append("'" + items.ApprovalLevelId + "',");
                            }

                            listApp = rulesApproval.Select(x => Convert.ToInt32(x.ApprovalLevelId)).ToArray();
                            //GET LIST APPROVER BY RULE APPROVAL 
                            var listApprover = sb.ToString().Remove(sb.Length - 1);

                            if (countCurrentApproval == 0)
                            {
                                statusApprovalAs = "(Direct Manager)";
                                //currentApprovalCode = cnn.Query<string>("select ApproverCode from approvallist where CandidateId = @CandidateId", new { CandidateId = item.CandidateId }).FirstOrDefault();

                                hierarki = cnn.Query<HierarkiViewModel>("SELECT top 1 ah.*,a.DisplayName ApproverName FROM ApprovalHierarki ah left join account a on ah.ApproverCode=a.LoginName WHERE ah.AgentCode = @AgentCode AND ah.LevelId IN @listApprover and ah.isdelete = @IsDelete order by ah.sequence", new { AgentCode = item.RecruiterCode, IsDelete = 0, listApprover = listApp }).FirstOrDefault();

                                if (candidateData.Level == "5")
                                {
                                    hierarki = cnn.Query<HierarkiViewModel>("SELECT top 1 ah.*,a.DisplayName ApproverName FROM ApprovalHierarki ah left join account a on ah.ApproverCode=a.LoginName WHERE ah.AgentCode = @AgentCode AND ah.LevelId IN @listApprover and ah.isdelete = @IsDelete and a.LoginName = @DirectManagerCode order by ah.sequence", new { AgentCode = candidateData.RecruiterAgentCode, IsDelete = 0, listApprover = listApp, DirectManagerCode = candidateData.ManagerAgentCode }).FirstOrDefault(); ;
                                }

                                if (hierarki != null)
                                {
                                    if (hierarki.ApproverCode != currentApprovalCode)
                                    {
                                        cnn.Execute("update ApprovalList set ApproverCode = @ResultApprovalCode where id = @CurrentApprovalId and ApprovalDate is null", new { ResultApprovalCode = hierarki.ApproverCode, CurrentApprovalId = item.ID });
                                        if (item.ApproverCode != null)
                                        {
                                            //send to recruiter
                                            var body = "Waiting approve by " + string.Concat(hierarki.ApproverCode, " - ", hierarki.ApproverName);
                                            var title = candidateData.AgentName;
                                            notificationHelper.SendNotification("Leader Approval", item.RecruiterCode, title, body, "INFORMASI", candidateData.ID, item.ID);

                                            //notif ke next approval
                                            body = "Calon Agen (" + candidateData.AgentName + ") yang telah di rekrut oleh perekrut (" + item.RecruiterCode + " - " + candidateData.RecruiterName + ") menunggu persetujuan anda.";
                                            notificationHelper.SendNotification(candidateData.TemporaryAgentCode, hierarki.ApproverCode, "Menunggu Approval " + statusApprovalAs, body, "APPROVAL", candidateData.ID, item.ID);

                                            //hapus existing inbox
                                            cnn.Execute("delete from Inbox where CandidateId = @candidateId and (ToMail = @oldApprovalAgentCode or body like @oldApprovalAgentCode2)", new { candidateId = candidateData.ID, oldApprovalAgentCode = currentApprovalCode, oldApprovalAgentCode2 = string.Concat("%", currentApprovalCode, "%") });

                                            ////email untuk APPROVER
                                            var ApproverData = cnn.Query<UserViewModel>("SELECT DisplayName, Email FROM Account WHERE AgentCode = @AgentCode", new { AgentCode = item.ApproverCode }).FirstOrDefault();
                                            if (ApproverData.Email != null && ApproverData.Email != "" && !string.IsNullOrEmpty(ApproverData.Email))
                                            {
                                                if (ApproverData.Email != "-")
                                                {
                                                    body = "Dear " + ApproverData.DisplayName + ", <br /><br />" +
                                                    "Calon Agen " + candidateData.AgentName + " yang telah direkrut oleh Perekrut ( " + candidateData.RecruiterAgentCode + " - " + candidateData.RecruiterName + " ) menunggu persetujuan anda. <br /><br />" +
                                                    "Saya #LebihBaik, Sun Life #LebihBaik Indonesia #LebihBaik with the power of Sunlifers!" +
                                                    "Regards, <br /> Sunlife eRecruit";
                                                    notificationHelper.SendEmail("Email Notification eRecruit Approval", ApproverData.Email, body);
                                                }
                                            }

                                            //email untuk recruiter
                                            if (candidateData.RecruiterMail != null && candidateData.RecruiterMail != "" && !string.IsNullOrEmpty(candidateData.RecruiterMail))
                                            {
                                                if (candidateData.RecruiterMail != "-")
                                                {
                                                    body = "Waiting approve by " + string.Concat(hierarki.ApproverCode, " - ", hierarki.ApproverName);
                                                    notificationHelper.SendEmail(candidateData.AgentName, candidateData.RecruiterMail, body);
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            else
                            {
                                var cekCountApprovalList = cnn.Query<ApprovalProgressViewModel>("SELECT * FROM ApprovalList WHERE CandidateId = @CandidateId and ApprovalDate is not null  and StatusApproval is not null", new { CandidateId = candidateData.ID });
                                StringBuilder lsc = new StringBuilder();
                                if (cekCountApprovalList.Count() > 0)
                                {
                                    foreach (var itemx in cekCountApprovalList)
                                    {
                                        lsc.Append("'" + itemx.ApproverCode + "',");
                                    }
                                }

                                var listApproverCodeExist = lsc.ToString().Remove(lsc.Length - 1);

                                if (countCurrentApproval >= 1)
                                {
                                    if (countCurrentApproval == 1)
                                    {
                                        hierarki = approvalFormRepository.GetAdNadApprover(listApproverCodeExist, candidateData.ID, candidateData.RecruiterAgentCode, candidateData.Level);

                                        if (candidateData.RecruiterLocationCode != candidateData.LocationCode && candidateData.Level != "5" && countCurrentApproval == 2)
                                            hierarki = approvalFormRepository.GetNextApprover(listApprover, listApproverCodeExist, candidateData.ID, candidateData.RecruiterAgentCode);
                                    }
                                    else
                                    {
                                        hierarki = approvalFormRepository.GetNextApprover(listApprover, listApproverCodeExist, candidateData.ID, candidateData.RecruiterAgentCode);
                                    }
                                }

                                if ((candidateData.Level == "4" || candidateData.Level == "5") && cekCountApprovalList.Count() == 1 && candidateData.LocationCode == candidateData.RecruiterLocationCode)
                                {
                                    statusApprovalAs = " AD/NAD " + (hierarki != null ? hierarki.BranchName : "");
                                    //statusApprovalAs = " (Pemilik Lokasi)";
                                    var currentAds = "";
                                    currentAd = cekCountApprovalList.Select(x => x.ApproverCode).First();
                                    currentAds = hierarki.ApproverCode;
                                    hierarki.ApproverCode = currentAd;
                                }

                                var approvalIdDirect = 0;

                                //ini tambahan biar approvalnya ad 2 kali
                                if (cekCountApprovalList.Count() == 1 || (candidateData.LocationCode != candidateData.RecruiterLocationCode && cekCountApprovalList.Count() == 2 && (hierarki != null && hierarki.LevelId < 7)))
                                {
                                    statusApprovalAs = " (Pemilik Lokasi)";
                                }
                                //else {
                                //    statusApprovalAs = " AD/NAD " + (hierarki != null ? hierarki.BranchName : "");
                                //}

                                //approval
                                if (hierarki != null && hierarki.ApproverCode != currentApprovalCode)
                                {
                                    var idApproval = item.ID;
                                    cnn.Execute("update ApprovalList set ApproverCode = @ResultApprovalCode where id = @CurrentApprovalId and ApprovalDate is null", new { ResultApprovalCode = hierarki.ApproverCode, CurrentApprovalId = item.ID });
                                    if (hierarki.ApproverCode != candidateData.RecruiterAgentCode)
                                    {

                                        var body = "Waiting approve by " + string.Concat(hierarki.ApproverCode, " - ", hierarki.ApproverName);
                                        var title = candidateData.AgentName;
                                        notificationHelper.SendNotification("Leader Approval", candidateData.RecruiterAgentCode, candidateData.AgentName, body, "INFORMASI", candidateData.ID, idApproval);

                                        //send notif to next approval
                                        body = "Calon Agen (" + candidateData.AgentName + ") yang telah di rekrut oleh perekrut (" + candidateData.RecruiterAgentCode + " - " + candidateData.RecruiterName + ") menunggu persetujuan anda.";
                                        notificationHelper.SendNotification(candidateData.RecruiterName, hierarki.ApproverCode, "Menunggu Approval" + statusApprovalAs, body, "APPROVAL", candidateData.ID, idApproval);

                                        //email untuk leader
                                        var ApproverData = approvalFormRepository.GetAccountByAgentCode(hierarki.AgentCode);
                                        if (ApproverData.Email != null && ApproverData.Email != "" && !string.IsNullOrEmpty(ApproverData.Email))
                                        {
                                            if (ApproverData.Email != "-")
                                            {
                                                body = "Dear " + ApproverData.DisplayName + ", <br /><br />" +
                                                "Calon Agen " + candidateData.AgentName + " yang telah direkrut oleh Perekrut ( " + candidateData.RecruiterAgentCode + " - " + candidateData.RecruiterName + " ) menunggu persetujuan anda. <br /><br />" +
                                                "Saya #LebihBaik, Sun Life #LebihBaik Indonesia #LebihBaik with the power of Sunlifers!" +
                                                "Regards, <br /> Sunlife eRecruit";
                                                notificationHelper.SendEmail("Email Notification eRecruit Approval " + statusApprovalAs, ApproverData.Email, body);
                                            }
                                        }
                                    }
                                    else
                                    {
                                        approvalIdDirect = idApproval;
                                        var body = "Waiting approve by " + string.Concat(hierarki.ApproverCode, " - ", hierarki.ApproverName);
                                        var title = candidateData.AgentName;
                                        notificationHelper.SendNotification("Leader Approval", candidateData.RecruiterAgentCode, candidateData.AgentName, body, "INFORMASI", candidateData.ID, approvalIdDirect);

                                        //send notif to next approval
                                        body = "Calon Agen (" + candidateData.AgentName + ") yang telah di rekrut oleh perekrut (" + candidateData.RecruiterAgentCode + " - " + candidateData.RecruiterName + ") menunggu persetujuan anda.";
                                        notificationHelper.SendNotification(candidateData.RecruiterAgentCode, hierarki.ApproverCode, "Menunggu Approval" + statusApprovalAs, body, "APPROVAL", candidateData.ID, idApproval);

                                        //email untuk leader
                                        var ApproverData = approvalFormRepository.GetAccountByAgentCode(hierarki.AgentCode);
                                        if (ApproverData.Email != null && ApproverData.Email != "" && !string.IsNullOrEmpty(ApproverData.Email))
                                        {
                                            if (ApproverData.Email != "-")
                                            {
                                                body = "Dear " + ApproverData.DisplayName + ", <br /><br />" +
                                                "Calon Agen " + candidateData.AgentName + " yang telah direkrut oleh Perekrut ( " + candidateData.RecruiterAgentCode + " - " + candidateData.AgentName + " ) menunggu persetujuan anda. <br /><br />" +
                                                "Saya #LebihBaik, Sun Life #LebihBaik Indonesia #LebihBaik with the power of Sunlifers!" +
                                                "Regards, <br /> Sunlife eRecruit";
                                                notificationHelper.SendEmail("Email Notification eRecruit Approval " + statusApprovalAs, ApproverData.Email, body);
                                            }
                                        }
                                    }
                                }
                            } //end if 
                        }
                    } //end for
                }
            }
        }

        public IEnumerable<DownloadAajiViewModel> DownloadAaji(string From, string To)
        {
            string sql = @"select ROW_NUMBER() over (order by ae.examdate asc) [No], c.Name RecruiterName,c.TemporaryAgentCode RecruiterAgentCode,c.HomeAddress, ci.Name CityName, c.PhoneNo, c.KTPNo, c.BirthPlace,le.DisplayName DirectManagerName, c.BirthDate, c.Gender, (case when lower(c.MaritalStatus) = 'menikah' then 'M' else 'S' end) MaritalStatus,
c.Religion, c.SubmitDate, aed.ProductType,ae.ExamDate, ae.ExamType, l.Name ExamLocation, ce.level InstitutionName
from AajiExamDetail aed
left join AajiExam ae on ae.ID=aed.AajiExamId left join Candidate c on c.ID = aed.CandidateId 
left join City ci on ci.CityCode=c.CityCode left join Account a on a.LoginName = c.RecruiterAgentCode
left join ExamLocation l on l.ID=ae.ExamLocationId left join Account le on le.LoginName = c.DirectManagerCode
left join (select * from (select ROW_NUMBER() over (partition by CandidateId order by yearto) No, CandidateID, InstitutionName, YearFrom,YearTo,Level from CandidateEducation ) x where x.No = 1) ce on ce.CandidateID=c.ID where convert(date,ae.ExamDate) between convert(date,@From) and  convert(date,@To)";
            using (var cnn = OpenSunLifeDB())
            {
                if (string.IsNullOrEmpty(From) && string.IsNullOrEmpty(To))
                {
                    sql = @"select ROW_NUMBER() over (order by ae.examdate asc) [No], c.Name RecruiterName,c.TemporaryAgentCode RecruiterAgentCode,c.HomeAddress, ci.Name CityName, c.PhoneNo, c.KTPNo, c.BirthPlace,le.DisplayName DirectManagerName, c.BirthDate, c.Gender, (case when lower(c.MaritalStatus) = 'menikah' then 'M' else 'S' end) MaritalStatus,
c.Religion, c.SubmitDate, aed.ProductType,ae.ExamDate, ae.ExamType, l.Name ExamLocation, ce.level InstitutionName
from AajiExamDetail aed
left join AajiExam ae on ae.ID=aed.AajiExamId left join Candidate c on c.ID = aed.CandidateId 
left join City ci on ci.CityCode=c.CityCode left join Account a on a.LoginName = c.RecruiterAgentCode
left join ExamLocation l on l.ID=ae.ExamLocationId left join Account le on le.LoginName = c.DirectManagerCode
left join (select * from (select ROW_NUMBER() over (partition by CandidateId order by yearto) No, CandidateID, InstitutionName, YearFrom,YearTo,Level from CandidateEducation ) x where x.No = 1) ce on ce.CandidateID=c.ID";

                    return cnn.Query<DownloadAajiViewModel>(sql);
                }
                return cnn.Query<DownloadAajiViewModel>(sql, new { From = From, To = To });
            }
        }
        #region UserRole
        public IEnumerable<UserViewModel> GetListAdmin(string displayName, int page, int rowspPage, string role)
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.Query<UserViewModel>(DbQuery.GetListAdmin, new { displayName = "%" + displayName + "%", roleId = role, PageNumber = page, RowsPage = rowspPage });
            }
        }
        public void SubmitUserRole(UserRoleViewModel data, bool status)
        {
            var dt = DateTime.Now.ToString("MM'/'dd'/'yyyy HH:mm:ss");
            int groupId = 0;
            string Password = AesDecrypt.IsBase64String(data.Password) ? data.Password : RijndaelManagedEncryption.EncryptRijndael(data.Password);
            using (var cnn = OpenSunLifeDB())
            {
                if (!status)
                {
                    //insert ke account
                    cnn.Execute("insert into Account (LoginName, Password, DisplayName, Email, IsActive, RoleID, CreatedBy, CreatedWhen, ChangedBy, ChangedWhen, AgentCode) values (@LoginName, @Password, @DisplayName, @Email, @IsActive, @RoleID, @CreatedBy, @CreatedWhen, @ChangedBy, @ChangedWhen, @AgentCode)", new { LoginName = data.LoginName, Password = Password, DisplayName = data.DisplayName, Email = "-", IsActive = 1, RoleID = 1, CreatedBy = "admin", CreatedWhen = dt, ChangedBy = "admin", ChangedWhen = dt, AgentCode = data.LoginName });

                    //insert ke group
                    groupId = cnn.QueryFirstOrDefault<int>("insert into [Group] OUTPUT Inserted.ID values (@GroupName, @IsActive, @CreatedWhen, @CreatedBy, @ChangedWhen, @IsDelete, @ChangedBy)", new { GroupName = data.LoginName, IsActive = 1, CreatedWhen = dt, CreatedBy = "admin", ChangedWhen = dt, IsDelete = 0, ChangedBy = dt });

                    //insert ke user group
                    //GroupId 1 = admin
                    cnn.Execute("insert into UserGroup (LoginName,GroupId,IsActive,IsDelete,CreatedWhen,CreatedBy,ChangedWhen,ChangedBy) values (@LoginName,@GroupId,@IsActive,@IsDelete,@CreatedWhen,@CreatedBy,@ChangedWhen,@ChangedBy)", new { LoginName = data.LoginName, GroupId = 1, IsActive = 1, IsDelete = 0, CreatedWhen = dt, CreatedBy = "admin", ChangedWhen = dt, ChangedBy = "admin" });
                    cnn.Execute("insert into UserGroup (LoginName,GroupId,IsActive,IsDelete,CreatedWhen,CreatedBy,ChangedWhen,ChangedBy) values (@LoginName,@GroupId,@IsActive,@IsDelete,@CreatedWhen,@CreatedBy,@ChangedWhen,@ChangedBy)", new { LoginName = data.LoginName, GroupId = groupId, IsActive = 1, IsDelete = 0, CreatedWhen = dt, CreatedBy = "admin", ChangedWhen = dt, ChangedBy = "admin" });
                }
                else
                {
                    //update account
                    cnn.Execute("update Account set Password = @Password, DisplayName = @DisplayName, IsActive = @IsActive, ChangedBy = @ChangedBy, ChangedWhen  = @ChangedWhen, RoleId =  @RoleId where LoginName = @LoginName", new { LoginName = data.LoginName, Password = Password, DisplayName = data.DisplayName, Email = "-", IsActive = data.IsActive, RoleID = 1, CreatedBy = "admin", CreatedWhen = dt, ChangedBy = "admin", ChangedWhen = dt });

                    groupId = cnn.QueryFirst<int>("select id from [Group] where GroupName = @GroupName and id != 1", new { GroupName = data.LoginName });
                    //update user group
                    //cnn.Execute("update UserGroup set GroupId = @GroupId, IsActive = @IsActive,IsDelete = @IsDelete,CreatedWhen = @CreatedWhen,CreatedBy = @CreatedBy,ChangedWhen=@ChangedWhen,ChangedBy=@ChangedBy where LoginName = @LoginName", new {  IsActive = 1, IsDelete = 0, CreatedWhen = dt, CreatedBy = "admin", ChangedWhen = dt, ChangedBy = "admin", LoginName = data.LoginName, GroupId = groupId});
                }



                //delete existing groupMenu
                cnn.Execute("delete from GroupMenu where groupId = @groupId", new { groupId = groupId });

                //insert ke menu
                foreach (var item in data.ListMenu)
                {
                    int menuId;
                    menuId = cnn.QueryFirstOrDefault<int>("select Id from menu where Title = @title", new { title = item.Title });
                    if (menuId != 0)
                    {
                        cnn.Execute("INSERT INTO GroupMenu (GroupId,MenuId,[View],[Add],Edit,[Delete],IsActive,IsDelete,CreatedWhen,CreatedBy,ChangedWhen,ChangedBy) values (@GroupId,@MenuId,@View,@Add,@Edit,@Delete,@IsActive,@IsDelete,@CreatedWhen,@CreatedBy,@ChangedWhen,@ChangedBy)", new { GroupId = groupId, MenuId = menuId, View = 1, Add = 1, Edit = 1, Delete = 1, IsActive = 1, IsDelete = 0, CreatedWhen = dt, CreatedBy = "admin", ChangedWhen = dt, ChangedBy = "admin" });
                    }
                }
            }
        }

        public IEnumerable<string> GetCurrentUserRole(string userName)
        {
            using (var cnn = OpenSunLifeDB())
            {
                var data = cnn.Query<string>("select m.Title from GroupMenu gm left join[Group] g on g.id = gm.GroupId  left join Menu m on m.ID = gm.MenuId where g.GroupName = @groupName and gm.IsDelete = 0 and gm.IsActive = 1", new { groupName = userName });
                return data;
            }
        }
        #endregion
    }
}
