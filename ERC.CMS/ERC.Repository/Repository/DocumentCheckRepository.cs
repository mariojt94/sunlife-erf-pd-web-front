using Dapper;
using ERC.Repository.Helper;
using ERC.Repository.Resources;
using ERC.Repository.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace ERC.Repository.Repository
{
    public class DocumentCheckRepository : BaseRepository
    {
        public IEnumerable<DocumentCheckViewModel> GetListDocumentCheck(int page, int rowspPage, string teamcode, string recruiteragentcode, string candidateName, string level, string recruiterName, string nameBranch, string statusDoc, string fromDate, string toDate)
        {
            nameBranch = (nameBranch == null) ? nameBranch : string.Concat("%", nameBranch, "%");
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.Query<DocumentCheckViewModel>(DbQuery.GetListDocumentCheck, new { PageNumber = page, RowsPage = rowspPage, TeamCode = teamcode, RecruiterAgentCode = recruiteragentcode, CandidateName = '%' + candidateName + '%', RecruiterName = string.Concat("%", recruiterName, "%"), NameBranch = nameBranch, StatusDoc = statusDoc, DariTanggal = fromDate, SampaiTanggal = toDate, Level = level });
            }
        }

        public int GetAtfAmlGoogleStatus(int CandidateID)
        {
            var sql = "select count(ID) from CandidateFile where CandidateID=@CandidateID and LOWER(Type) in ('aml','atf','google')";
            //var sql = "select count(ID) from CandidateFile where CandidateID=@CandidateID and LOWER(Type) in ('fotodiri','ktp','kk')";
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.QueryFirstOrDefault<int>(sql, new { CandidateID = CandidateID});
            }
        }
        public void AddDocumentCheck(DocumentCheckViewModel data)
        {
            using (var cnn = OpenSunLifeDB())
            {
                var isExist = cnn.Query(DbQuery.GetCandidateDocumentCheck, new { CandidateId = data.CandidateId });

                if (isExist.ToList().Count != 0)
                {
                    cnn.Execute(DbQuery.updateDocumentCheck, new
                    {
                        CandidateId = data.CandidateId,
                        Status = data.Status,
                        Reason = data.Reason
                    });
                }
                else
                {
                    cnn.Execute(DbQuery.AddDocumentCheck, new
                    {
                        CandidateId = data.CandidateId,
                        Status = data.Status,
                        Reason = data.Reason
                    });
                }

            }
        }

        public void SetStatusDocument(DocumentCheckViewModel data)
        {
            using (var cnn = OpenSunLifeDB())
            {
                //email untuk leader
                var _notificationHelper = new NotificationHelper();
                var recruiter = cnn.Query<UserViewModel>("SELECT DisplayName, Email FROM Account WHERE AgentCode = @RecruiterAgentCode", new { RecruiterAgentCode = data.RecruiterAgentCode }).FirstOrDefault();
                var body = "";

                if (data.Status == "REJECT")
                {
                    body = "Dear " + recruiter.DisplayName + ", <br /><br />" +
                                           "Data dengan A/n " + data.CandidateName + " (" + data.TemporaryAgentCode + ") telah di tolak oleh admin checking. Terima Kasih <br /><br />" +
                                           "Best Regards, <br /> Sunlife eRecruit";
                }
                else if (data.Status == "NEED REVISION")
                {
                    body = "Dear " + recruiter.DisplayName + ", <br /><br />" +
                                           "Data dengan A/n " + data.CandidateName + " (" + data.TemporaryAgentCode + ") masih terdapat dokumen yang pending. Harap segera melengkapi. Terima Kasih <br /><br />" +
                                           "Best Regards, <br /> Sunlife eRecruit";
                }
                else
                {
                    body = "Dear " + recruiter.DisplayName + ", <br /><br />" +
                                           "Data dengan A/n " + data.CandidateName + " (" + data.TemporaryAgentCode + ") sudah di terima oleh Admin. Terima Kasih <br /><br />" +
                                           "Best Regards, <br /> Sunlife eRecruit";
                }

                //update ChangedWhen untuk last update di dashboard
                cnn.Execute("UPDATE Candidate SET ChangedWhen = '" + DateTime.Now.ToString("MM'/'dd'/'yyyy HH:mm:ss") + "' WHERE ID = '" + data.CandidateId + "'");

                if (recruiter.Email != null || !string.IsNullOrEmpty(recruiter.Email))
                {
                    _notificationHelper.SendEmail("Email Notification eRecruit " + data.Status + " Document", recruiter.Email, body);
                }
            }
        }

        public void UpdateDocCheckFlag(int CandidateId)
        {
            using (var cnn = OpenSunLifeDB())
            {
                cnn.Execute("UPDATE Candidate SET DocumentCheckingFlag = @flag WHERE ID = @id", new {id =  CandidateId, flag = 1 });
            }
        }

        public void InsertCandidateFile(string FileType, int CandidateId, int FileId)
        {
            using (var cnn = OpenSunLifeDB())
            {
                //var dataExisting = cnn.QueryFirstOrDefault<CandidateFileViewModel>("SELECT * FROM CandidateFile WHERE Type = '" + FileType + "' AND CandidateID = " + CandidateId);
                var dataExisting = cnn.QueryFirstOrDefault<CandidateFileViewModel>("SELECT * FROM CandidateFile WHERE Type =  @type AND CandidateID =@id", new { type = FileType, id = CandidateId });
                if (dataExisting == null)
                {
                    //insert baru
                    cnn.Execute(DbQuery.AddCandidateFile, new
                    {
                        CandidateID = CandidateId,
                        Type = FileType,
                        FileID = FileId,
                        CreatedBy = HttpContext.Current.User.Identity.Name,
                        CreatedWhen = DateTime.Now,
                        ChangedBy = HttpContext.Current.User.Identity.Name,
                        ChangedWhen = DateTime.Now
                    });
                }
                else
                {
                    //update
                    cnn.Execute(DbQuery.UpdateCandidateFile, new
                    {
                        CandidateID = CandidateId,
                        Type = FileType,
                        FileID = FileId,
                        ChangedBy = HttpContext.Current.User.Identity.Name,
                        ChangedWhen = DateTime.Now
                    });
                }
            }
        }

        public IEnumerable<DocumentCheckViewModel> GetDataReport()
        {
            using (var cnn = OpenSunLifeDB())
            {
                var data = cnn.Query<DocumentCheckViewModel>(DbQuery.GetListDocumentCheckReport);
                return data;
            }
        }
    }
}
