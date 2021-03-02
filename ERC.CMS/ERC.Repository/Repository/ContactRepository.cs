using Dapper;
using ERC.Repository.Resources;
using ERC.Repository.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace ERC.Repository.Repository
{
    public class ContactRepository : BaseRepository
    {
        public int addContact(QuickContactViewModel data)
        {
            var phonenumber = data.PhoneNo;
            string sFirstCharacter = phonenumber.Substring(0, 1);
            if (sFirstCharacter == "0")
            {
                phonenumber.Remove(0, 1);
            }
            phonenumber = "62" + phonenumber;
            using (var cnn = OpenSunLifeDB())
            {
                var CandidateId = cnn.Query<int>(DbQueryPortal.AddQuickContact, new
                {
                    RecruiterAgentCode = data.RecruiterAgentCode,
                    Level = data.Level,
                    Name = data.Name,
                    BirthDate = data.BirthDate.ToString("MM/dd/yyyy"),
                    CityCode = data.CityCode,
                    Gender = data.Gender,
                    PhoneNo = phonenumber,
                    Profession = data.Profession,
                    JoinDate = DateTime.Now.ToString("MM/dd/yyyy"),
                    GroupLevel = data.GroupLevel,
                    CreatedWhen = DateTime.Now.ToString("MM/dd/yyyy"),
                    CreatedBy = HttpContext.Current.User.Identity.Name,
                    ChangedWhen = DateTime.Now.ToString("MM/dd/yyyy"),
                    ChangedBy = HttpContext.Current.User.Identity.Name,
                    IDFromMobile = data.IDFromMobile
                }).Single();
                return CandidateId;
            }
        }
        public int addContactMobile(QuickContactViewModel data)
        {
            using (var cnn = OpenSunLifeDB())
            {
                var phonenumber = data.PhoneNo;
                string sFirstCharacter = phonenumber.Substring(0, 1);
                if (sFirstCharacter == "0")
                {
                    phonenumber.Remove(0, 1);
                }
                phonenumber = "62" + phonenumber;
                var CandidateId = cnn.Query<int>(DbQueryPortal.AddQuickContact, new
                {
                    RecruiterAgentCode = data.RecruiterAgentCode,
                    Level = data.Level,
                    Name = data.Name,
                    BirthDate = data.BirthDate.ToString("MM/dd/yyyy"),
                    CityCode = data.CityCode,
                    Gender = data.Gender,
                    PhoneNo = phonenumber,
                    Profession = data.Profession,
                    JoinDate = DateTime.Now.ToString("MM/dd/yyyy"),
                    GroupLevel = data.GroupLevel,
                    CreatedWhen = DateTime.Now.ToString("MM/dd/yyyy"),
                    CreatedBy = "Mobile",
                    ChangedWhen = DateTime.Now.ToString("MM/dd/yyyy"),
                    ChangedBy = "Mobile",
                    IDFromMobile = data.IDFromMobile
                }).Single();
                return CandidateId;
            }
        }
        public IEnumerable<AvailableLevelViewModel> getContactLevel()
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.Query<AvailableLevelViewModel>(DbQueryPortal.GetContactListLevel);
            }
        }
        public DetailContactViewModel GetContactDetail(string id)
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.QuerySingleOrDefault<DetailContactViewModel>(DbQueryPortal.GetContactDetail, new { CandidateId = id });
            }
        }
        public int CekHierarkiRecruiter(string candidateId)
        {
            int count = 0;
            //var datamanager = new CandidateManagerVewModel();
            using (var cnn = OpenSunLifeDB())
            {
                //string candidateroleid = cnn.QueryFirstOrDefault<string>("SELECT Level FROM Candidate WHERE ID = " + candidateId);
                string candidateroleid = cnn.QueryFirstOrDefault<string>("SELECT Level FROM Candidate WHERE ID = @candidateId", new { candidateId = candidateId });

                //string recruiterAgentCode = cnn.QueryFirstOrDefault<string>("SELECT RecruiterAgentCode FROM Candidate WHERE ID = " + candidateId);
                string recruiterAgentCode = cnn.QueryFirstOrDefault<string>("SELECT RecruiterAgentCode FROM Candidate WHERE ID = @candidateId", new { candidateId = candidateId });

                if (!string.IsNullOrEmpty(candidateroleid) && !string.IsNullOrEmpty(recruiterAgentCode))
                {
                    //ambil posisi tertinggi
                    //var latesthierarkilevel = cnn.QueryFirstOrDefault<int>("select value from GlobalConfiguration where Keyword='HighestHierarkiLevel'");
                    var latesthierarkilevel = cnn.QueryFirstOrDefault<int>("select value from GlobalConfiguration where Keyword=@Keyword", new { Keyword = "HighestHierarkiLevel" });

                    //ambil level jabatan yang di pilih si kandidat
                    //var candidatehierarkilevel = cnn.QueryFirstOrDefault<int>("select top 1 HierarkiLevel from RoleHierarki where RoleId = " + candidateroleid);
                    var candidatehierarkilevel = cnn.QueryFirstOrDefault<int>("select top 1 HierarkiLevel from RoleHierarki where RoleId = @candidateroleid", new { candidateroleid = candidateroleid });


                    //jika si kandidat memilih jabatan terakhir maka tidak akan ada direct manaager
                    if (candidatehierarkilevel < (latesthierarkilevel - 1))
                    {
                        //lama ambil hanya + 1 saja tidak mencari ke atas lagi
                        //var data = cnn.QueryFirstOrDefault<CandidateManagerVewModel>(DbQueryPortal.GetManager, new { RecruiterLoginName = recruiterloginname, CandidateRoleId = candidateroleid });
                        //var recruiterhierarkilevel = cnn.QueryFirstOrDefault<int>("select top 1 HierarkiLevel from RoleHierarki rh join Account a on a.RoleID = rh.RoleId where a.AgentCode = '" + recruiterAgentCode + "'");
                        var recruiterhierarkilevel = cnn.QueryFirstOrDefault<int>("select top 1 HierarkiLevel from RoleHierarki rh join Account a on a.RoleID = rh.RoleId where a.AgentCode = @recruiterAgentCode", new { recruiterAgentCode = recruiterAgentCode });


                        if (recruiterhierarkilevel > candidatehierarkilevel)
                        {
                            //direct manager = perekrut
                            //count = cnn.QueryFirstOrDefault<int>(@"select count(*) from Account A
                            //left join Role R on A.RoleID = r.ID
                            //left join Team T on T.TeamCode = a.TeamCode
                            //where A.AgentCode = '" + recruiterAgentCode + "' and A.IsDeleted != 1");

                            count = cnn.QueryFirstOrDefault<int>(@"select count(*) from Account A
                            left join Role R on A.RoleID = r.ID
                            left join Team T on T.TeamCode = a.TeamCode
                            where A.AgentCode = @recruiterAgentCode and A.IsDeleted != @isDelete", new
                            {
                                recruiterAgentCode = recruiterAgentCode,
                                isDelete = 1
                            });
                        }
                        else
                        {

                            //get all manager from recruiter
                            var temp = cnn.Query<CandidateManagerVewModel>(@"select ApproverCode as AgentCode , HierarkiLevel as ManagerHierarki, a.DisplayName,r.RoleName as ManagerPosition
                            from ApprovalHierarki ah
                            left join Account a on a.AgentCode = ah.ApproverCode
                            left join RoleHierarki rh on rh.RoleId = ah.levelid
                            left join Role r on r.id = a.RoleID
                            left join team t on t.TeamCode = a.TeamCode 
                            where ah.AgentCode = @recruiterAgentCode order by HierarkiLevel desc", new
                            {
                                recruiterAgentCode = recruiterAgentCode
                            });
                            //get list level manager
                            var tempListLevelManager = new List<int>();
                            foreach (var item in temp)
                            {
                                tempListLevelManager.Add(item.ManagerHierarki);
                            }
                            //sortir list level manager berdasarkan terkecil
                            tempListLevelManager.Sort();
                            bool done = false;
                            int index = 0;
                            //loop bandingkan jika level manager lebih besar di bandingkan level yang di pilih si kandidat maka si manager itu yang 
                            //akan menjadi direct managernya
                            while (!done)
                            {
                                if (tempListLevelManager[index] > candidatehierarkilevel)
                                {
                                    done = true;
                                    count = count + 1;
                                }
                                index++;
                            }
                        }
                    }
                }
                return count;
            }
        }
        public IEnumerable<QuickContactViewModel> GetContact1(GetContactViewModel datas)
        {
            using (var cnn = OpenSunLifeDB())
            {
                var listExclude = new int[] { };
                if (!string.IsNullOrEmpty(datas.excludeContact))
                {
                   listExclude = datas.excludeContact.Split(',').Select(int.Parse).ToArray();
                }


                var data = cnn.Query<QuickContactViewModel>(DbQueryPortal.GetContactMobileNew, new { AgentCode = datas.agentCode, excludeContact = listExclude});

                //foreach (var item in data)
                //{
                //    var getPhoto = GetProfilePhotoDiri(item.Id);
                //    if (getPhoto != null) {
                //        item.Photo = getPhoto.Base64;
                //    }
                //}

                return data;
            }
        }
        public IEnumerable<QuickContactViewModel> GetContact(string agentCode, int page, int rowspPage, string name, int filter)
        {

            using (var cnn = OpenSunLifeDB())
            {
                //filter 0 = semua data
                //filter 1 = Pengisian RF
                //filter 2 = Menunggu Persetujuan
                //filter 3 = Menunggu Proses Dokumen Cek
                //filter 4 = Menunggu Hasil Elearning
                //filter 5 = Menunggu Hasil Ujian AAJI
                //filter 6 = Agen Aktif
                name = "%" + name + "%";
                IEnumerable<QuickContactViewModel> data = null;
                if (filter == 0)
                {
                    data = cnn.Query<QuickContactViewModel>(DbQueryPortal.GetContactAsc, new { AgentCode = agentCode, Name = name, RowsPage = rowspPage, PageNumber = page });
                }
                else if (filter == 1)
                {
                    data = cnn.Query<QuickContactViewModel>(DbQueryPortal.GetContactFilteredRFForm, new { AgentCode = agentCode, Name = name, RowsPage = rowspPage, PageNumber = page });
                }
                else if (filter == 2)
                {
                    data = cnn.Query<QuickContactViewModel>(DbQueryPortal.GetContactFilteredWaitingApproval, new { AgentCode = agentCode, Name = name, RowsPage = rowspPage, PageNumber = page });
                }
                else if (filter == 3)
                {
                    data = cnn.Query<QuickContactViewModel>(DbQueryPortal.GetContactFilteredWaitingDocumentCheck, new { AgentCode = agentCode, Name = name, RowsPage = rowspPage, PageNumber = page });
                }
                else if (filter == 4)
                {
                    data = cnn.Query<QuickContactViewModel>(DbQueryPortal.GetContactFilteredWaitingElearning, new { AgentCode = agentCode, Name = name, RowsPage = rowspPage, PageNumber = page });
                }
                else if (filter == 5)
                {
                    data = cnn.Query<QuickContactViewModel>(DbQueryPortal.GetContactFilteredWaitingAAJIExam, new { AgentCode = agentCode, Name = name, RowsPage = rowspPage, PageNumber = page });
                }
                else if (filter == 6)
                {
                    data = cnn.Query<QuickContactViewModel>(DbQueryPortal.GetContactFilteredActiveAgent, new { AgentCode = agentCode, Name = name, RowsPage = rowspPage, PageNumber = page });
                }
                return data;
            }
        }
        public void updateContact(QuickContactViewModel data)
        {
            throw new NotImplementedException();
        }
        public void DeleteContact(int id)
        {
            using (var cnn = OpenSunLifeDB())
            {
                cnn.Execute(DbQuery.DeleteQuickContact, new
                {
                    Id = id,
                    ChangedWhen = DateTime.Now.ToString("MM/dd/yyyy"),
                    ChangedBy = HttpContext.Current.User.Identity.Name
                });
            }
        }
        public void DeleteContactMobile(int id, string loginname)
        {
            using (var cnn = OpenSunLifeDB())
            {
                cnn.Execute(DbQuery.DeleteQuickContact, new
                {
                    Id = id,
                    ChangedWhen = DateTime.Now.ToString("MM/dd/yyyy"),
                    ChangedBy = loginname
                });
            }
        }
        public string GetProfilePhoto(string CandidateId)
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.Query<string>(DbQueryPortal.GetUserPhoto, new { ID = CandidateId }).FirstOrDefault();
            }
        }
        public CandidateFileViewModel GetProfilePhotoDiri(int CandidateId)
        {
            using (var cnn = OpenSunLifeDB())
            {
                var query = "SELECT cf.CandidateID, cf.Type, fu.FileName, fu.Path, cf.FileID " +
                "FROM CandidateFile cf JOIN FileUpload fu on cf.FileID = fu.ID " +
                "WHERE Type = @Type AND cf.CandidateID = @CandidateId";

                var data = cnn.Query<CandidateFileViewModel>(query, new { Type = "FotoDiri", CandidateId = CandidateId }).FirstOrDefault();
                if (data != null)
                {
                    var isExist = System.IO.File.Exists(data.Path);
                    if (isExist)
                    {
                        data.Base64 = System.IO.File.ReadAllText(data.Path);
                    }
                }

                //try
                //{
                //    data.Base64 = System.IO.File.ReadAllText(data.Path);
                //}
                //catch (Exception)
                //{
                //    data.Base64 = null;
                //}
                return data;
            }
        }
        public object Get(string id)
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.QuerySingle<CandidateFileViewModel>(DbQuery.DeleteQuickContact, new { @CandidateId = id });
            }
        }
        public CandidateScoreViewModel GetCandidateScore(string id)
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.QuerySingle<CandidateScoreViewModel>(DbQueryPortal.GetProfillingHeaderScore, new { @CandidateId = id });
            }
        }
        public void UpdateUserPhoto(int CandidateId, int PhotoId)
        {
            using (var cnn = OpenSunLifeDB())
            {
                cnn.Execute(DbQueryPortal.UpdateUserPhoto, new
                {
                    ID = CandidateId,
                    PhotoId = PhotoId
                });
            }
        }
        public DetailContactViewModel GetContactDetailMobile(int id)
        {
            using (var cnn = OpenSunLifeDB())
            {
                var data = cnn.QuerySingleOrDefault<DetailContactViewModel>(DbQueryPortal.GetContactDetail, new { CandidateId = id });
                ////var getPhoto = GetProfilePhotoDiri(id);
                //if (getPhoto != null)
                //{
                //    data.Photo = getPhoto.Base64;
                //}
                return data;
            }
        }

        public void GenerateVirtualAccount(string candidateId)
        {

            using (var cnn = OpenSunLifeDB())
            {
                string recruiterAgentCode = HttpContext.Current.User.Identity.Name;
                var data = cnn.QueryFirstOrDefault<string>("select top 1 virtualaccount from candidate where Id = @CandidateId", new { CandidateId = candidateId });

                //cek jika virtual account tidak ada maka buat virtual account
                if (data == null)
                {

                    string agentcodeforva = recruiterAgentCode.Substring(1, 5);
                    string runningnumber = "0";
                    string finalva = "";
                    //cek existing contact yang sudah di buat berdasarkan recruiter agent code
                    string latestVA = cnn.QueryFirstOrDefault<string>("select top 1 virtualaccount from candidate where recruiteragentcode = @RecruiterAgentCode order by virtualaccount desc", new { RecruiterAgentCode = recruiterAgentCode });

                    //cek jika sudah ada atau blum 
                    if (latestVA == null)
                    {
                        //buat va untuk pertama kali
                        runningnumber = "0001";
                    }
                    else
                    {
                        //ambil va terakhir + 1
                        //hardcode 
                        int intLatestVa = Convert.ToInt32(latestVA.Substring(5, 4));
                        intLatestVa = intLatestVa + 1;

                        if (intLatestVa < 10)
                        {
                            runningnumber = "000" + intLatestVa;
                        }
                        else if (intLatestVa < 100)
                        {
                            runningnumber = "00" + intLatestVa;
                        }
                        else if (intLatestVa < 1000)
                        {
                            runningnumber = "0" + intLatestVa;
                        }
                        else
                        {
                            runningnumber = intLatestVa.ToString();
                        }
                    }
                    finalva = agentcodeforva + runningnumber;

                    //update va to db
                    cnn.Execute("update candidate set virtualaccount=@FinalVa where id = @CandidateId", new { FinalVa = finalva, CandidateId = candidateId });

                }
            }

        }

        public void GenerateVirtualAccountMobile(int candidateId, string agentCode)
        {

            using (var cnn = OpenSunLifeDB())
            {
                string recruiterAgentCode = agentCode;
                var data = cnn.QueryFirstOrDefault<string>("select top 1 virtualaccount from candidate where Id = @CandidateId", new { CandidateId = candidateId });

                //cek jika virtual account tidak ada maka buat virtual account
                if (data == null)
                {

                    string agentcodeforva = recruiterAgentCode.Substring(1, 5);
                    string runningnumber = "0";
                    string finalva = "";
                    //cek existing contact yang sudah di buat berdasarkan recruiter agent code
                    string latestVA = cnn.QueryFirstOrDefault<string>("select top 1 virtualaccount from candidate where recruiteragentcode = @RecruiterAgentCode order by virtualaccount desc", new { RecruiterAgentCode = recruiterAgentCode });

                    //cek jika sudah ada atau blum 
                    if (latestVA == null)
                    {
                        //buat va untuk pertama kali
                        runningnumber = "0001";
                    }
                    else
                    {
                        //ambil va terakhir + 1
                        //hardcode 
                        int intLatestVa = Convert.ToInt32(latestVA.Substring(5, 4));
                        intLatestVa += 1;

                        if (intLatestVa < 10)
                        {
                            runningnumber = "000" + intLatestVa;
                        }
                        else if (intLatestVa < 100)
                        {
                            runningnumber = "00" + intLatestVa;
                        }
                        else if (intLatestVa < 1000)
                        {
                            runningnumber = "0" + intLatestVa;
                        }
                        else
                        {
                            runningnumber = intLatestVa.ToString();
                        }
                    }
                    finalva = agentcodeforva + runningnumber;

                    //update va to db
                    cnn.Execute("update candidate set virtualaccount=@FinalVa where id = @CandidateId", new { FinalVa = finalva, CandidateId = candidateId });

                }
            }

        }

        public int GetCountContact(string agentCode)
        {

            using (var cnn = OpenSunLifeDB())
            {

                var total = cnn.QueryFirstOrDefault<int>("select Count(id) as Total from Candidate  where RecruiterAgentCode=@AgentCode and IsDeleted!= 1 ", new { AgentCode = agentCode });


                if (total == 0)
                {
                    total = 0;
                }

                return total;
            }
        }

        public int isContactExist(string id)
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.Query<int>("select top 1 1 from candidate where IDFromMobile = @IDFromMobile", new { IDFromMobile = id }).FirstOrDefault();
            }
        }
    }
}
