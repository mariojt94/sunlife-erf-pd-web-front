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
    public class ProfilingRepository : BaseRepository
    {
        public IEnumerable<ProfilingQuetionViewModel> GetListProfilingQuestion(int page, int rowspPage, string description)
        {
            using (var cnn = OpenSunLifeDB())
            {
                var data = cnn.Query<ProfilingQuetionViewModel>(DbQuery.GetListProfilingQuestion, new { PageNumber = page, RowsPage = rowspPage, Description = "%" + description + "%" });
                return data;
            }
        }
        public IEnumerable<ProfilingOptionViewModel> GetListProfilingOption(int page, int rowspPage, string description, int QuestionID)
        {
            using (var cnn = OpenSunLifeDB())
            {
                var data = cnn.Query<ProfilingOptionViewModel>(DbQuery.GetListProfilingOption, new { PageNumber = page, RowsPage = rowspPage, Description = "%" + description + "%", QuestionID = QuestionID });
                return data;
            }
        }
        public ProfilingQuetionViewModel GetProfilingQuetion(int Id)
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.QuerySingleOrDefault<ProfilingQuetionViewModel>(DbQuery.GetProfilingQuestionById, new { ID = Id });
            }
        }
        public int AddProfilingQuestion(ProfilingQuetionViewModel data)
        {
            var returnId = 0;
            using (var cnn = OpenSunLifeDB())
            {
                returnId = cnn.Query<int>(DbQuery.AddProfilingQuestion, new
                {
                    Description = data.Description,
                    IsActive = data.IsActive,
                    GroupID = data.GroupID,
                    CreatedBy = HttpContext.Current.User.Identity.Name,
                    CreatedWhen = DateTime.Now.ToString("MM/dd/yyyy"),
                    ChangedBy = HttpContext.Current.User.Identity.Name,
                    ChangedWhen = DateTime.Now.ToString("MM/dd/yyyy")
                }).Single();
            }
            return returnId;
        }
        public void UpdateProfilingQuestion(ProfilingQuetionViewModel data)
        {
            using (var cnn = OpenSunLifeDB())
            {
                cnn.Execute(DbQuery.UpdateProfilingQuestion, new
                {
                    ID = data.ID,
                    Description = data.Description,
                    GroupID = data.GroupID,
                    IsActive = data.IsActive,
                    ChangedBy = HttpContext.Current.User.Identity.Name,
                    ChangedWhen = DateTime.Now.ToString("MM/dd/yyyy")
                });
            }
        }
        public ProfilingOptionViewModel GetProfilingOption(int Id)
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.QuerySingleOrDefault<ProfilingOptionViewModel>(DbQuery.GetProfilingOptionById, new { ID = Id });
            }
        }

        public ProfilingOptionViewModel GetprofilingBySequenceID(int SequenceID, int QuestionID)
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.QuerySingleOrDefault<ProfilingOptionViewModel>(DbQuery.GetProfilingOptionBySequenceID, new { SequenceID = SequenceID, QuestionID = QuestionID });
            }

        }
        public void AddProfilingOption(ProfilingOptionViewModel data)
        {
            using (var cnn = OpenSunLifeDB())
            {
                cnn.Execute(DbQuery.AddProfilingOption, new
                {
                    QuestionID = data.QuestionId,
                    Description = data.Description,
                    Sequence = data.Sequence,
                    Point = data.Point,
                    IsActive = data.IsActive,
                    CreatedWho = HttpContext.Current.User.Identity.Name,
                    CreatedWhen = DateTime.Now.ToString("MM/dd/yyyy"),
                    ChangedWho = HttpContext.Current.User.Identity.Name,
                    ChangedWhen = DateTime.Now.ToString("MM/dd/yyyy")
                });
            }
        }
        public void UpdateProfilingOption(ProfilingOptionViewModel data)
        {
            using (var cnn = OpenSunLifeDB())
            {
                cnn.Execute(DbQuery.UpdateProfilingOption, new
                {
                    ID = data.ID,
                    Description = data.Description,
                    Sequence = data.Sequence,
                    Point = data.Point,
                    IsActive = data.IsActive,
                    ChangedWho = HttpContext.Current.User.Identity.Name,
                    ChangedWhen = DateTime.Now.ToString("MM/dd/yyyy")
                });
            }
        }
        public int SequenceProfilOptionValidation(int questionId, int sequence)
        {
            var count = 0;
            using (var cnn = OpenSunLifeDB())
            {
                count = cnn.QueryFirstOrDefault<int>("SELECT COUNT(*) FROM ProfilingOption WHERE Sequence = @Sequence AND QuestionID = @QuestionID AND IsActive = @IsActive", new { Sequence = sequence, QuestionID = questionId, IsActive = 1 });
            }
            return count;
        }
        public void DeleteProfilingQuestion(int Id)
        {
            using (var cnn = OpenSunLifeDB())
            {
                cnn.Execute(DbQuery.DeleteProfilingQuestion, new
                {
                    Id = Id,
                    ChangedWhen = DateTime.Now.ToString("MM/dd/yyyy"),
                    ChangedBy = HttpContext.Current.User.Identity.Name,
                });
            }
        }
        public void DeleteProfilingOption(int Id)
        {
            using (var cnn = OpenSunLifeDB())
            {
                cnn.Execute(DbQuery.DeleteProfilingOption, new
                {
                    Id = Id
                });
            }
        }
        public IEnumerable<ProfilingQuetionViewModel> GetQuestion(int GroupId)
        {
            using (var cnn = OpenSunLifeDB())
            {
                var data = cnn.Query<ProfilingQuetionViewModel>(DbQueryPortal.GetQuestion, new { GroupID = GroupId });
                return data;
            }
        }
        public IEnumerable<ProfilingOptionViewModel> GetOption(int QuestionId)
        {
            using (var cnn = OpenSunLifeDB())
            {
                var data = cnn.Query<ProfilingOptionViewModel>(DbQuery.GetOption, new { QuestionID = QuestionId });
                return data;
            }
        }
        public int InsertHeader(int CandidateId, int TotalScore, string RecommendedPosition)
        {
            var returnId = 0;
            using (var cnn = OpenSunLifeDB())
            {
                returnId = cnn.Query<int>(DbQuery.AddCandidateProfilingHeader, new
                {
                    CandidateID = CandidateId,
                    TotalScore = TotalScore,
                    RecommendedPosition = RecommendedPosition,
                    CreateDate = DateTime.Now
                }).Single();
            }
            return returnId;
        }
        public int NewHeader(int CandidateId, decimal TotalScore, string RecommendedPosition)
        {
            var returnId = 0;
            using (var cnn = OpenSunLifeDB())
            {
                returnId = cnn.Query<int>(DbQuery.AddNewProfilingHeader, new
                {
                    CandidateID = CandidateId,
                    TotalScore = TotalScore,
                    RecommendedPosition = RecommendedPosition,
                    CreateDate = DateTime.Now
                }).Single();
            }

            return returnId;
        }
        public decimal GetPoint(int OptionId)
        {
            decimal result = 0;
            using (var cnn = OpenSunLifeDB())
            {
                //result = cnn.Query<decimal>("SELECT Point FROM ProfilingOption WHERE ID = '" + OptionId + "'").SingleOrDefault();
                result = cnn.Query<decimal>("SELECT Point FROM ProfilingOption WHERE ID = @OptionId", new { OptionId = OptionId }).SingleOrDefault();
            }
            return result;
        }

        public int CekAnswer(int HeaderId, int QuestionID)
        {
            var count = 0;
            using (var cnn = OpenSunLifeDB())
            {
                //count = cnn.Query<int>("SELECT COUNT(*) FROM CandidateProfilingAnswer where HeaderID = " + HeaderId + " and QuestionID = " + QuestionID).FirstOrDefault();
                count = cnn.Query<int>("SELECT COUNT(*) FROM CandidateProfilingAnswer where HeaderID = @HeaderId  and QuestionID = @QuestionID", new { HeaderId = HeaderId, QuestionID = QuestionID }).FirstOrDefault();
            }
            return count;
        }
        public int InsertAnswer(int HeaderId, int QuestionID, int OptionId, string Description, decimal Point)
        {
            var returnId = 0;
            using (var cnn = OpenSunLifeDB())
            {
                returnId = cnn.Query<int>(DbQueryPortal.AddCandidateProfilingAnswer, new
                {
                    HeaderId = HeaderId,
                    QuestionID = QuestionID,
                    Description = Description,
                    Answer = OptionId,
                    Point = Point
                }).Single();
            }
            return returnId;
        }
        public void UpdateAnswer(int HeaderId, int QuestionID, int OptionId, string Description, decimal Point)
        {
            using (var cnn = OpenSunLifeDB())
            {
                cnn.Execute(DbQueryPortal.UpdateCandidateProfilingAnswer, new
                {
                    HeaderId = HeaderId,
                    QuestionID = QuestionID,
                    Description = Description,
                    Answer = OptionId,
                    Point = Point
                });
            }
        }
        public void InsertOption(ProfilingOptionViewModel data, int answerId)
        {
            using (var cnn = OpenSunLifeDB())
            {
                cnn.Execute(DbQuery.AddCandidateProfilingOption, new
                {
                    AnswerID = answerId,
                    Description = data.Description,
                    Point = data.Point
                });
            }
        }
        public void InsertOptionMobile(int answerId, string description, decimal point)
        {
            using (var cnn = OpenSunLifeDB())
            {
                cnn.Execute(DbQuery.AddCandidateProfilingOption, new
                {
                    AnswerID = answerId,
                    Description = description,
                    Point = point
                });
            }
        }
        public int GetGroupByCandidate(int CandidateId)
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.Query<int>(DbQueryPortal.GetGroupByCandidate, new { CandidateId = CandidateId }).FirstOrDefault();
            }
        }
/*        public int GetRecPositionId(decimal Point, int GroupId)
        {
            using (var cnn = OpenSunLifeDB())
            {
                int recPosition = 0;
                var listProfilingMatrix = cnn.Query<ProfilingMatrixViewModel>(DbQuery.GetAllProfilingMatrix, new { Point = Point, GroupId = GroupId });
                if (listProfilingMatrix != null)
                {
                    recPosition = listProfilingMatrix.Select(a => a.RoleId).FirstOrDefault();
                }
                return recPosition;
            }
        }*/
        public string GetRecPosition(int RoleId)
        {
            using (var cnn = OpenSunLifeDB())
            {
                string recPosition = cnn.Query<string>(DbQuery.GetRoleName, new { ID = RoleId }).FirstOrDefault();
                return recPosition;
            }
        }
        public void UpdateHeader(decimal Point, int RecPosition, int HeaderId)
        {
            using (var cnn = OpenSunLifeDB())
            {
                cnn.Execute(DbQuery.UpdateScoreRecPositionHeader, new
                {
                    TotalScore = Point,
                    RecommendedPosition = RecPosition,
                    ID = HeaderId
                });
            }
        }
        public decimal GetSumPoint(int HeaderId)
        {
            var Point = 0m;
            using (var cnn = OpenSunLifeDB())
            {
                //Point = cnn.Query<decimal>("select SUM(Point) from CandidateProfilingAnswer where HeaderId = " + HeaderId).FirstOrDefault();
                Point = cnn.Query<decimal>("select SUM(Point) from CandidateProfilingAnswer where HeaderId = @HeaderId", new { HeaderId = HeaderId }).FirstOrDefault();
            }
            return Point;
        }
        public IEnumerable<GroupViewModel> GetGroup()
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.Query<GroupViewModel>(DbQuery.GetGroupLevel);
            }
        }
        public void RejectCandidate(int CandidateId)
        {
            using (var cnn = OpenSunLifeDB())
            {
                cnn.Execute("UPDATE Candidate SET Status = 'REJECT' WHERE ID = @CandidateId", new { CandidateId = CandidateId });
                //cnn.Execute("UPDATE Candidate SET Status = 'REJECT' WHERE ID = " + CandidateId);
            }
        }
        public IEnumerable<ProfilingQuetionViewModel> GetQuestionMobile()
        {
            using (var cnn = OpenSunLifeDB())
            {
                var data = cnn.Query<ProfilingQuetionViewModel>(DbQueryPortal.GetQuestionMobile);
                return data;
            }
        }
/*        public IEnumerable<GroupPositionMinimumScoreModel> GetPositionMinimumScore()
        {
            using (var cnn = OpenSunLifeDB())
            {
                var listGroup = cnn.Query<GroupPositionMinimumScoreModel>("SELECT DISTINCT [Group] GroupId FROM ProfilingMatrix");
                foreach (var item in listGroup)
                {
                    item.ListPosition = cnn.Query<PositionMinimumScoreModel>(DbQuery.GetPositionMinimumScore, new { GroupId = item.GroupId }).ToList();
                }
                return listGroup;
            }
        }*/
        public int NewHeaderMobile(int CandidateId, decimal TotalScore, string RecommendedPosition)
        {
            var returnId = 0;
            using (var cnn = OpenSunLifeDB())
            {
                returnId = cnn.Query<int>(DbQuery.AddNewProfilingHeaderMobile, new
                {
                    CandidateID = CandidateId,
                    TotalScore = TotalScore,
                    RecommendedPosition = RecommendedPosition,
                    CreateDate = DateTime.Now
                }).Single();
            }
            return returnId;
        }

        public CandidateLevelViewModel GetProfilingResult(string candidateId)
        {

            using (var cnn = OpenSunLifeDB())
            {
                var data = cnn.QuerySingle<CandidateLevelViewModel>(DbQuery.GetCandidateProfillingLevel2, new { CandidateID = candidateId });
                return data;
            }
        }

        public bool IsRegistered(string candidateId)
        {

            using (var cnn = OpenSunLifeDB())
            {
                var result = true;
                //var data = cnn.Query<DateTime?>("Select SubmitDate from candidate where id = @CandidateId ", new { CandidateID = candidateId }).FirstOrDefault();
                var data = cnn.Query<int>("select top 1 1 from CandidateProfilingHeader where CandidateID = @CandidateId and IsComplete = @IsComplete and RecommendedPosition in (@recom) order by CreateDate", new { CandidateId = candidateId, IsComplete = 1, recom = "'0','-'" }).FirstOrDefault();
                if (data == 1)
                {
                    result = false;
                }
                return result;
            }
        }

    }
}
