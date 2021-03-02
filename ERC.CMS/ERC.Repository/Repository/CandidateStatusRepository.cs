using Dapper;
using ERC.Repository.Resources;
using ERC.Repository.ViewModel;
using System;
using System.Linq;

namespace ERC.Repository.Repository
{
    public class CandidateStatusRepository : BaseRepository
    {
        public void AddManagerApproval(CandidateStatusViewModel data)
        {

            using (var cnn = OpenSunLifeDB())
            { 
                var isExist = cnn.Query(DbQuery.GetCandidateStatusById, new { CandidateId = data.CandidateID }).FirstOrDefault();
                if (isExist == null) {
                    cnn.Execute(DbQuery.AddManagerApproval, new
                    {
                        Date = DateTime.Now.ToString("MM/dd/yyyy"),
                        CandidateId = data.CandidateID,
                        RecruiterLoginName = data.RecruiterLoginName,
                        ManagerLoginName = data.ManagerLoginName,
                        Status = data.Status
                    });

                }
            }
        }
    }
}
