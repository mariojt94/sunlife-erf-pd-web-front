using ERC.Repository.Resources;
using ERC.Repository.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dapper;
using System.Web;

namespace ERC.Repository.Repository
{
    public class ApprovalFormRepository : BaseRepository
    {
        public CandidateViewModel GetDataPdf(int candidateId)
        {
            var candidate = new CandidateViewModel();
            var education = new List<CandidateEducationViewModel>();
            using (var cnn = OpenSunLifeDB())
            {
                var datacandidate = cnn.QuerySingleOrDefault<CandidateViewModel>(DbQuery.GetCandidate, new { CandidateId = candidateId });
                candidate = datacandidate;

                var dataexperience = cnn.Query<CandidateExperienceViewModel>(DbQuery.GetCandidateExperience, new { CandidateId = candidateId });
                candidate.Experiences = dataexperience.ToList();

                var dataeducation = cnn.Query<CandidateEducationViewModel>(DbQuery.GetCandidateEducation, new { CandidateId = candidateId });
                candidate.Educations = dataeducation.ToList();
            }
            return candidate;
        }
        public IEnumerable<ApprovalFormViewModel> GetListApproval(string loginname, int page, int rowspPage)
        {
            using (var cnn = OpenSunLifeDB())
            {
                //return cnn.Query<ApprovalFormViewModel>(DbQuery.GetListApproval, new { LoginName = loginname });
                //var AgentCode = cnn.Query<string>(DbQueryPortal.GetAgentCodeByLoginName, new { LoginName = loginname }).FirstOrDefault();
                var data = cnn.Query<ApprovalFormViewModel>(DbQueryPortal.GetListApprovalWeb, new { ApproverCode = loginname, PageNumber = page, RowsPage = rowspPage });

                return data;
            }
        }
        public DetailApprovalFormViewModel GetDetailApproval(int candidateid)
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.QuerySingle<DetailApprovalFormViewModel>(DbQueryPortal.GetDetailApproval, new { CandidateId = candidateid });
            }
        }
        public void ActionApprove(int Id, string status, string Reason, int CandidateId)
        {
            using (var cnn = OpenSunLifeDB())
            {
                cnn.Execute(DbQueryPortal.SetApprovalAction, new
                {
                    StatusApproval = status,
                    Reason = Reason,
                    ApprovalDate = DateTime.Now.ToString("MM'/'dd'/'yyyy HH:mm:ss"),
                    ID = Id
                });

                //cnn.Execute("UPDATE Candidate SET ChangedWhen = '" + DateTime.Now.ToString("MM'/'dd'/'yyyy HH:mm:ss") + "' WHERE ID = '" + CandidateId + "'");
                //ini tambah filed statusreject if status is reject ke table candidate
                cnn.Execute("UPDATE Candidate SET ChangedWhen = @ChangedWhen WHERE ID = @CandidateId", new { ChangedWhen = DateTime.Now.ToString("MM'/'dd'/'yyyy HH:mm:ss"), CandidateId = CandidateId });
            }
        }
        public ApprovalProgressViewModel GetApprovalById(int Id)
        {
            using (var cnn = OpenSunLifeDB())
            {
                //return cnn.Query<ApprovalProgressViewModel>("SELECT * FROM ApprovalList WHERE  IsActive = 1 and ID = " + Id).FirstOrDefault();
                return cnn.Query<ApprovalProgressViewModel>("SELECT * FROM ApprovalList WHERE IsActive = @IsActive and ID = @Id", new { IsActive = 1, Id = Id }).FirstOrDefault();
            }
        }
        public UserViewModel GetAccount(string AgentCode)
        {
            using (var cnn = OpenSunLifeDB())
            {
                //return cnn.Query<UserViewModel>("SELECT * FROM Account WHERE AgentCode = '" + AgentCode + "'").FirstOrDefault();
                return cnn.Query<UserViewModel>("SELECT * FROM Account WHERE AgentCode = @AgentCode", new { AgentCode = AgentCode }).FirstOrDefault();
            }
        }
        public string RejectCandidate(int CandidateId)
        {
            using (var cnn = OpenSunLifeDB())
            {
                //return cnn.Query<string>("UPDATE Candidate SET Status = 'REJECT' WHERE ID = " + CandidateId).FirstOrDefault();
                return cnn.Query<string>("UPDATE Candidate SET Status = 'REJECT' WHERE ID = @CandidateId", new { CandidateId = CandidateId }).FirstOrDefault();
            }
        }

        public IEnumerable<ApprovalProgressViewModel> GetApprovalProgress(int Page, int RowsPage, int CandidateId)
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.Query<ApprovalProgressViewModel>(DbQueryPortal.GetApprovalProgress, new { PageNumber = Page, RowsPage = RowsPage, CandidateId = CandidateId });
            }
        }
        public IEnumerable<ApprovalProgressViewModel> GetApprovalProgressMobile(int CandidateId)
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.Query<ApprovalProgressViewModel>(DbQueryPortal.GetApprovalProgressMobile, new { CandidateId = CandidateId });
            }
        }
        public IEnumerable<ApprovalProgressViewModel> GetAllProgressByCandidate(int CandidateId)
        {
            using (var cnn = OpenSunLifeDB())
            {
                //return cnn.Query<ApprovalProgressViewModel>("SELECT * FROM ApprovalList WHERE  IsActive = 1 and CandidateId = " + CandidateId);
                return cnn.Query<ApprovalProgressViewModel>("SELECT * FROM ApprovalList WHERE  IsActive = @IsActive and CandidateId = @CandidateId", new { CandidateId = CandidateId, IsActive = 1 });
            }
        }
        public void UpdateFlagApprovalLeader(int CandidateId)
        {
            using (var cnn = OpenSunLifeDB())
            {
                //cnn.Execute("UPDATE Candidate SET AllLeaderApproveFlag = 1 WHERE ID = " + CandidateId);
                cnn.Execute("UPDATE Candidate SET AllLeaderApproveFlag = @flag WHERE ID = @CandidateId", new { flag = 1, CandidateId = CandidateId });
            }
        }
        //delete list approval ketika document chekc di reject admin
        public void DeleteListApprovel(int candidateId)
        {

            using (var cnn = OpenSunLifeDB())
            {
                cnn.Execute(DbQuery.DeleteListApproval, new
                {
                    CandidateId = candidateId
                });
            }
        }
        public int CountDocumentCheckByCandidateId(int CandidateId)
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.QueryFirstOrDefault<int>(DbQueryPortal.CountDocumentCheckByCandidateId, new { CandidateId = CandidateId });
            }
        }
        public IEnumerable<ApprovalRuleViewModel> GetListApprovalByLevel(string Level)
        {
            using (var cnn = OpenSunLifeDB())            {
                //return cnn.Query<ApprovalRuleViewModel>("SELECT * FROM ApprovalRules WHERE CandidateLevel = " + Level + " and isdelete = 0");
                return cnn.Query<ApprovalRuleViewModel>("SELECT * FROM ApprovalRules WHERE CandidateLevel = @Level and isdelete = @isDelete", new { Level = Level, isdelete = 0 });
            }
        }

        public HierarkiViewModel GetNextApprover(string listLevel, string listApproverCode, int CandidateId, string agentCode)
        {
            using (var cnn = OpenSunLifeDB())
            {
                //var locationAgenCode = cnn.QueryFirst<string>("select top 1 LocationCode from account where LoginName = @LoginName", new { LoginName = agentCode });
                var locationAgenCode = cnn.QueryFirst<string>("select a.LocationCode from Candidate c left join Account a on c.DirectManagerCode=a.LoginName where c.Id = @ID", new { ID = CandidateId });
                var locationCandidateCode = cnn.QueryFirst<string>("select LocationCode from Candidate where Id = @ID", new { ID = CandidateId });
                var candidateLevel = cnn.QueryFirst<string>("select top 1 Level from candidate where id = @id", new { id = CandidateId });
                if (locationAgenCode.ToLower() == locationCandidateCode.ToLower())
                {
                    var data = new HierarkiViewModel();

                    try
                    {
                        //ini new multi sdm
                        data = cnn.QueryFirstOrDefault<HierarkiViewModel>(@"select * from (
SELECT ah.*, t.TeamName BranchName, a.DisplayName ApproverName FROM ApprovalHierarki ah left join account a on a.LoginName = ah.ApproverCode left join Team t on a.teamcode = t.teamcode WHERE ah.AgentCode = @agentCode and ah.isdelete = 0 union all select ID,AgentCode,ApproverCode,LevelId,IsActive,IsDelete,Sequence, BranchName, ApproverName from (
select ROW_NUMBER() over (partition by ahm.locationcode,ahm.levelid order by ahm.id asc) no, 1 ID, @agentCode AgentCode, ahm.ApproveCode ApproverCode, ahm.LevelId, ahm.IsActive, ahm.IsDelete, ahm.Sequence,te.TeamName BranchName,ax.DisplayName ApproverName from ApprovalHierarkiManagement ahm left join account ax on ax.LoginName = ahm.ApproveCode left join Team te on ax.teamcode = te.teamcode where ahm.LocationCode = @locationCode) x where x.no = 1) ah where ah.AgentCode = @agentCode AND ah.LevelId IN(" + listLevel + ") and ah.isdelete = @isdelete and ah.ApproverCode not in(" + listApproverCode + ") AND ah.LevelId > @LevelNAD AND ah.LevelId != @LevelFC order by ah.sequence", new
                        {
                            agentCode = agentCode,
                            isdelete = 0,
                            LevelNAD = 6,
                            LevelFC = 14,
                            LocationCode = locationCandidateCode
                        });
                    }
                    catch (Exception ex)
                    {
                        var test = ex.Message;
                    }

                    return data;
                }
                else //ini jika lokasi berbeda
                {
                    int roleId = 5;
                    bool changedAD = false;

                    var isAdExstinAppro = cnn.Query<string>("select roleid from account where agentcode in (" + listApproverCode + ")");
                    var countListApproverCode = listApproverCode.Split(',').Count();
                    //if ((isAdExstinAppro.Contains("5") || isAdExstinAppro.Contains("6")) && countListApproverCode > 2) //sebelumnya 1 / 3
                    if ((isAdExstinAppro.Contains("5") || (isAdExstinAppro.Contains("6") && candidateLevel == "5")))
                    {
                        changedAD = true;
                    }

                    if ((isAdExstinAppro.Contains("5") || (isAdExstinAppro.Contains("6"))) && countListApproverCode >= 3) //sebelumnya 1 / 3
                    {
                        roleId = 7;
                    }

                    if (candidateLevel == "5")
                    {
                        var listApproverByLocation = cnn.QueryFirstOrDefault<LocationViewModel>("select top 1 * from location where AgentLocationCode = @AgentLocationCode", new { AgentLocationCode = locationCandidateCode });
                        var CountApproverHM = cnn.QueryFirstOrDefault<int>("select count(*) from ApprovalHierarkiManagement where LocationCode = @AgentLocationCode and IsDelete = @IsDeleted and IsActive = @IsActive", new { AgentLocationCode = locationCandidateCode, IsDeleted = 0, IsActive = 1 });

                        var data = new HierarkiViewModel();
                        //ini untuk jika insert lokasi baru
                        if ((listApproverByLocation.CreatedBy.ToLower() != "admin" && CountApproverHM == 0))
                        {

                            data = cnn.QueryFirstOrDefault<HierarkiViewModel>(@"select * from (SELECT ah.*, a.DisplayName ApproverName, t.TeamName BranchName FROM ApprovalHierarki ah left join account a on a.LoginName = ah.ApproverCode
left join team t on a.teamcode = t.teamcode WHERE ah.AgentCode = @agentCode and ah.isdelete = 0 union all select ID,AgentCode,ApproverCode,LevelId,IsActive,IsDelete,Sequence,ApproverName,BranchName from (select ROW_NUMBER() over (partition by ahm.locationcode,ahm.levelid order by ahm.id asc) no, 1 ID, @agentCode AgentCode, ahm.ApproveCode ApproverCode, ahm.LevelId, ahm.IsActive, ahm.IsDelete, ahm.Sequence, ax.DisplayName ApproverName, tx.TeamName BranchName  from ApprovalHierarkiManagement ahm left join Account ax on ahm.ApproveCode=ax.LoginName 
left join team tx on tx.teamcode = ax.teamcode where ahm.LocationCode = @locationCode) x where x.no = 1) ah where ah.AgentCode = @agentCode AND ah.LevelId IN(" + listLevel + ") and ah.isdelete = @isdelete and ah.ApproverCode not in(" + listApproverCode + ") AND ah.LevelId > @LevelNAD AND ah.LevelId != @LevelFC order by ah.sequence", new
                            {
                                agentCode = agentCode,
                                isdelete = 0,
                                LevelNAD = 6,
                                LevelFC = 14,
                                LocationCode = locationAgenCode
                            });
                        }
                        else
                        {
                            //ini jika lokasi sudah ada
                            if (!changedAD)
                            {
                                data = cnn.QueryFirstOrDefault<HierarkiViewModel>("select top 1 @AgentCode [AgentCode],a.AgentCode [ApproverCode], a.DisplayName ApproverName from Account a left join RoleHierarki r on a.RoleID = r.RoleId where (a.RoleID >= @roleId and a.RoleId != @LevelFC) AND a.IsDeleted = 0 AND a.IsActive = 1 and a.LocationCode = @LocationCode and a.AgentCode not in (select ApproverCode from ApprovalList where IsActive = 1 and RecruiterCode = @AgentCode and CandidateId = @CandidateId) and r.roleId in (select ApprovalLevelId from ApprovalRules where CandidateLevel = @candidateLevel  and IsDelete = 0) order by r.HierarkiLevel asc", new { AgentCode = agentCode, LocationCode = locationCandidateCode, CandidateId = CandidateId, candidateLevel = (Convert.ToInt32(candidateLevel) - 1), roleId = roleId, LevelFC = 14 });
                            }
                            else
                            {
                                //data = cnn.QueryFirstOrDefault<HierarkiViewModel>(@"select * from (
                                //    SELECT top 1 1 ID, @agentCode AgentCode, a.AgentCode ApproverCode,a.RoleId LevelId, a.IsActive, a.IsDeleted, 5 Sequence, a.DisplayName ApproverName FROM ACCOUNT a left join location l on a.locationcode = l.agentlocationcode where (a.RoleID >= @roleId and a.RoleId != @LevelFC) AND a.IsDeleted = 0 AND a.IsActive = 1 and a.LocationCode = @LocationCode and (a.LoginName = l.PemilikKPM or l.PemilikKPM is null) 
                                //    union all select ID,AgentCode,ApproverCode,LevelId,IsActive,IsDelete,Sequence, ApproverName from (select ROW_NUMBER() over (partition by ahm.locationcode,ahm.levelid order by id asc) no, 1 ID, @agentCode AgentCode, ahm.ApproveCode ApproverCode, ahm.LevelId, ahm.IsActive, ahm.IsDelete, ahm.Sequence, ax.DisplayName ApproverName  from ApprovalHierarkiManagement ahm left join Account ax on ahm.ApproveCode=ax.LoginName where ahm.LocationCode = @LocationCode) x where x.no = 1) ah WHERE ah.AgentCode = @agentCode AND ah.LevelId IN(" + listLevel + ") and ah.isdeleted = 0 and ah.ApproverCode not in(" + listApproverCode + ") AND ah.LevelId >= @LevelNAD AND ah.LevelId != @LevelFC order by ah.Sequence", new
                                //{
                                //    agentCode = agentCode,
                                //    isdelete = 0,
                                //    LevelNAD = 5,
                                //    LevelFC = 14,
                                //    LocationCode = locationCandidateCode,
                                //    roleId = roleId
                                //});

                                //gw edit tanpa lokasi tapip by pemilikkpm aja
                                data = cnn.QueryFirstOrDefault<HierarkiViewModel>(@"select * from (
                                    select top 1 1 ID, @agentCode AgentCode, a.AgentCode ApproverCode,a.RoleId LevelId, a.IsActive, a.IsDeleted, 5 Sequence, a.DisplayName ApproverName from Location l left join Account a on l.pemilikKPM = a.loginname where (a.RoleID >= @roleId and a.RoleId != @LevelFC) AND a.IsDeleted = 0 AND a.IsActive = 1 and l.AgentLocationCode = @LocationCode and (a.LoginName = l.PemilikKPM or l.PemilikKPM is null) 
                                    union all select ID,AgentCode,ApproverCode,LevelId,IsActive,IsDelete,Sequence, ApproverName from (select ROW_NUMBER() over (partition by ahm.locationcode,ahm.levelid order by id asc) no, 1 ID, @agentCode AgentCode, ahm.ApproveCode ApproverCode, ahm.LevelId, ahm.IsActive, ahm.IsDelete, ahm.Sequence, ax.DisplayName ApproverName  from ApprovalHierarkiManagement ahm left join Account ax on ahm.ApproveCode=ax.LoginName where ahm.LocationCode = @LocationCode) x where x.no = 1) ah WHERE ah.AgentCode = @agentCode AND ah.LevelId IN(" + listLevel + ") and ah.isdeleted = 0 and ah.ApproverCode not in(" + listApproverCode + ") AND ah.LevelId >= @LevelNAD AND ah.LevelId != @LevelFC order by ah.Sequence", new
                                {
                                    agentCode = agentCode,
                                    isdelete = 0,
                                    LevelNAD = 5,
                                    LevelFC = 14,
                                    LocationCode = locationCandidateCode,
                                    roleId = roleId
                                });
                            }
                        }

                        return data;
                    }
                    else //ini jika rekrut selain AD
                    {
                        //ini untuk ad / pemilik lokasi di lokasi yg berbeda
                        var data = new HierarkiViewModel();
                        if (roleId == 5) //ini jika approval terakhir adalah ad
                        {
                            //data = cnn.QueryFirstOrDefault<HierarkiViewModel>("select top 1 @AgentCode [AgentCode],a.AgentCode [ApproverCode], a.DisplayName ApproverName, t.teamname BranchName from Account a left join RoleHierarki r on a.RoleID = r.RoleId left join team t on t.teamcode = a.teamcode left join Location l on a.LocationCode = l.AgentLocationCode where (a.RoleID >= @roleId and a.RoleId != @LevelFC) AND a.IsDeleted = 0 AND a.IsActive = 1 and a.LocationCode = @LocationCode and a.AgentCode not in (select ApproverCode from ApprovalList where  IsActive = 1 and RecruiterCode = @AgentCode and CandidateId = @CandidateId) and r.roleId in (select ApprovalLevelId from ApprovalRules where CandidateLevel = @candidateLevel  and IsDelete = 0)  and (a.LoginName = l.PemilikKPM or l.PemilikKPM is null) order by r.HierarkiLevel asc", new { AgentCode = agentCode, LocationCode = locationCandidateCode, CandidateId = CandidateId, candidateLevel = candidateLevel, roleId = roleId, LevelFC = 14 });

                            data = cnn.QueryFirstOrDefault<HierarkiViewModel>("select top 1 @AgentCode [AgentCode],a.AgentCode [ApproverCode], a.DisplayName ApproverName, t.teamname BranchName from Account a left join RoleHierarki r on a.RoleID = r.RoleId left join team t on t.teamcode = a.teamcode left join Location l on a.LocationCode = l.AgentLocationCode where (a.RoleID >= @roleId and a.RoleId != @LevelFC) AND a.IsDeleted = 0 AND a.IsActive = 1 and a.AgentCode not in (select ApproverCode from ApprovalList where  IsActive = 1 and RecruiterCode = @AgentCode and CandidateId = @CandidateId) and r.roleId in (select ApprovalLevelId from ApprovalRules where CandidateLevel = @candidateLevel  and IsDelete = 0)  and (a.LoginName = l.PemilikKPM or l.PemilikKPM is null)  and l.agentlocationcode = @LocationCode order by r.HierarkiLevel asc", new { AgentCode = agentCode, LocationCode = locationCandidateCode, CandidateId = CandidateId, candidateLevel = candidateLevel, roleId = roleId, LevelFC = 14 });

                            if (data == null)
                            {
                                //data = cnn.QueryFirstOrDefault<HierarkiViewModel>(@"select * from (SELECT ah.* FROM ApprovalHierarki ah left join account a on a.LoginName = ah.ApproverCode WHERE ah.AgentCode = @agentCode and ah.isdelete = 0 union all  select ID,AgentCode,ApproverCode,LevelId,IsActive,IsDelete,Sequence from (select ROW_NUMBER() over (partition by locationcode,levelid order by id asc) no, 1 ID, @agentCode AgentCode, ApproveCode ApproverCode, LevelId, IsActive, IsDelete, Sequence  from ApprovalHierarkiManagement where LocationCode = @locationCode) x where x.no = 1) ah WHERE ah.AgentCode = @agentCode AND ah.LevelId IN(" + listLevel + ") and ah.isdelete = @isdelete and ah.ApproverCode not in(" + listApproverCode + ") AND ah.LevelId > @LevelNAD AND ah.LevelId != @LevelFC order by ah.Sequence", new

                                data = cnn.QueryFirstOrDefault<HierarkiViewModel>(@"select* from (SELECT ah.*, a.DisplayName ApproverName FROM ApprovalHierarki ah left join account a on a.LoginName = ah.ApproverCode WHERE ah.AgentCode = @agentCode and ah.isdelete = 0 union all select ID, AgentCode, ApproverCode, LevelId, IsActive, IsDelete, Sequence, ApproverName from (select ROW_NUMBER() over(partition by ah.locationcode, ah.levelid order by ah.id asc) no, 1 ID, @agentCode AgentCode, ah.ApproveCode ApproverCode, ah.LevelId, ah.IsActive, ah.IsDelete, ah.Sequence,  ax.DisplayName ApproverName from ApprovalHierarkiManagement ah left join Account ax on ah.approvecode = ax.loginname where ah.LocationCode = @locationCode) x where x.no = 1) ah where ah.AgentCode = @agentCode AND ah.LevelId IN(" + listLevel + ") and ah.isdelete = @isdelete and ah.ApproverCode not in(" + listApproverCode + ") AND ah.LevelId > @LevelNAD AND ah.LevelId != @LevelFC order by ah.sequence", new
                                {
                                    agentCode = agentCode,
                                    isdelete = 0,
                                    LevelNAD = 6,
                                    LevelFC = 14,
                                    LocationCode = locationCandidateCode
                                });
                            }
                        }
                        else if (roleId == 7) //ini sdm
                        {
                            if (!changedAD)
                            {
                                data = cnn.QueryFirstOrDefault<HierarkiViewModel>("select top 1 @AgentCode [AgentCode],a.AgentCode [ApproverCode], a.DisplayName ApproverName from Account a left join RoleHierarki r on a.RoleID = r.RoleId where (a.RoleID >= @roleId and a.RoleId != @LevelFC) AND a.IsDeleted = 0 AND a.IsActive = 1 and a.LocationCode = @LocationCode and a.AgentCode not in (select ApproverCode from ApprovalList where IsActive = 1 and RecruiterCode = @AgentCode and CandidateId = @CandidateId) and r.roleId in (select ApprovalLevelId from ApprovalRules where CandidateLevel = @candidateLevel  and IsDelete = 0) order by r.HierarkiLevel asc", new { AgentCode = agentCode, LocationCode = locationCandidateCode, CandidateId = CandidateId, candidateLevel = (Convert.ToInt32(candidateLevel) - 1), roleId = roleId, LevelFC = 14 });
                            }
                            else
                            {
                                data = cnn.QueryFirstOrDefault<HierarkiViewModel>(@"select * from (SELECT  top 1 1 ID, @agentCode AgentCode, AgentCode ApproverCode, RoleId LevelId, IsActive, IsDeleted, 5 Sequence, DisplayName ApproverName FROM ACCOUNT where (RoleID >= @roleId and RoleId != @LevelFC) AND IsDeleted = 0 AND IsActive = 1 and LocationCode = @LocationCode union all  select ID,AgentCode,ApproverCode,LevelId,IsActive,IsDelete,Sequence, ApproverName from (select ROW_NUMBER() over (partition by ahm.locationcode,ahm.levelid order by id asc) no, 1 ID, @agentCode AgentCode, ahm.ApproveCode ApproverCode, ahm.LevelId, ahm.IsActive, ahm.IsDelete, ahm.Sequence, ax.DisplayName ApproverName  from ApprovalHierarkiManagement ahm left join Account ax on ahm.ApproveCode=ax.LoginName where ahm.LocationCode = @locationCode) x where x.no = 1) ah WHERE ah.AgentCode = @agentCode AND ah.LevelId IN(" + listLevel + ") and ah.isdeleted = 0 and ah.ApproverCode not in(" + listApproverCode + ") AND ah.LevelId >= @LevelNAD AND ah.LevelId != @LevelFC order by ah.Sequence", new
                                {
                                    agentCode = agentCode,
                                    isdelete = 0,
                                    LevelNAD = 5,
                                    LevelFC = 14,
                                    LocationCode = locationCandidateCode,
                                    roleId = roleId
                                });
                            }
                        }

                        return data;
                    }
                }

            }
        }

        public HierarkiViewModel GetAdNadApprover(string listApproverCode, int CandidateId, string agentCode, string level)
        {
            string listLevel = "5";
            if (level == "5")
            {
                listLevel = "6";
            }

            using (var cnn = OpenSunLifeDB())
            {
                var DATA = cnn.QueryFirstOrDefault<HierarkiViewModel>("SELECT top 1 ah.*,a.DisplayName ApproverName, t.teamname BranchName FROM ApprovalHierarki ah left join account a on a.LoginName=ah.ApproverCode left join Team t on a.teamcode = t.teamcode WHERE ah.AgentCode = @agentCode AND ah.LevelId IN(" + listLevel + ") and ah.isdelete = @isdelete order by ah.sequence", new { agentCode = agentCode, isdelete = 0 });

                if (DATA == null)
                {
                    //int a = Convert.ToInt32(listLevel) + 1;
                    listLevel = "5,6";
                    //DATA = cnn.QueryFirstOrDefault<HierarkiViewModel>("SELECT top 1 ah.*,a.DisplayName ApproverName, t.teamname BranchName FROM ApprovalHierarki ah left join account a on a.LoginName=ah.ApproverCode left join Team t on a.teamcode = t.teamcode WHERE ah.AgentCode = @agentCode AND ah.LevelId IN(" + listLevel + ") and ah.isdelete = @isdelete order by ah.sequence", new { agentCode = agentCode, isdelete = 0 });
                    DATA = cnn.QueryFirstOrDefault<HierarkiViewModel>("SELECT top 1 ah.*,a.DisplayName ApproverName, t.teamname BranchName FROM ApprovalHierarki ah left join account a on a.LoginName=ah.ApproverCode left join Team t on a.teamcode = t.teamcode WHERE ah.AgentCode = @agentCode AND ah.LevelId IN(" + listLevel + ") and ah.isdelete = @isdelete order by ah.sequence, ah.levelid desc", new { agentCode = agentCode, isdelete = 0 });

                }

                return DATA;
            }
        }

        public int AddAprovalList(int Candidate, string recruiterAgentCode, string AgentCodeApprover)
        {
            using (var cnn = OpenSunLifeDB())
            {
                //cnn.Execute("INSERT INTO ApprovalList(CandidateId, RecruiterCode, ApproverCode, IsActive) VALUES('" + Candidate + "', '" + recruiterAgentCode + "', '" + AgentCodeApprover + "',1)");
                var data = cnn.Query<int>("INSERT INTO ApprovalList(CandidateId, RecruiterCode, ApproverCode, IsActive) VALUES(@Candidate,@recruiterAgentCode, @AgentCodeApprover,@IsActive);SELECT CAST(SCOPE_IDENTITY() as int);", new { Candidate = Candidate, recruiterAgentCode = recruiterAgentCode, AgentCodeApprover = AgentCodeApprover, IsActive = 1 }).FirstOrDefault();
                return data;
            }
        }

        public UserViewModel GetAccountByAgentCode(string AgentCode)
        {
            using (var cnn = OpenSunLifeDB())
            {
                //return cnn.QueryFirstOrDefault<UserViewModel>("SELECT DisplayName, Email FROM Account WHERE AgentCode = '" + AgentCode + "'");
                return cnn.QueryFirstOrDefault<UserViewModel>("SELECT DisplayName, Email FROM Account WHERE AgentCode = @AgentCode", new { AgentCode = AgentCode });
            }
        }


        #region mobile
        public IEnumerable<ApprovalFormViewModel> GetApprovalListMobile(string LoginName)
        {
            using (var cnn = OpenSunLifeDB())
            {
                //return cnn.Query<ApprovalFormViewModel>(DbQuery.GetListApproval, new { LoginName = loginname });
                var AgentCode = cnn.Query<string>(DbQueryPortal.GetAgentCodeByLoginName, new { LoginName = LoginName }).FirstOrDefault();
                return cnn.Query<ApprovalFormViewModel>(DbQueryPortal.GetListApproval, new { ApproverCode = AgentCode });
            }
        }
        public DetailApprovalFormViewModel GetDetailApprovalMobile(int CandidateId)
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.QuerySingle<DetailApprovalFormViewModel>(DbQueryPortal.GetDetailApproval, new { CandidateId = CandidateId });
            }
        }
        #endregion mobile
    }
}
