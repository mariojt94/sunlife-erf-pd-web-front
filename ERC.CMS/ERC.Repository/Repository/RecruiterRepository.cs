using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using Dapper;
using ERC.Repository.Resources;
using ERC.Repository.ViewModel;

namespace ERC.Repository.Repository
{
    public class RecruiterRepository : BaseRepository 
    {
        // get all data (OK)
        public List<RecruiterViewModel> GetAllRecruiter()
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.Query<RecruiterViewModel>(DbQuery.GetAllRecruiter).ToList();

            }
        }

        // get all data (OK)
        public List<RecruiterViewModel> GetAllRecruiter2()
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.Query<RecruiterViewModel>(DbQuery.GetAllRecruiter2).ToList();

            }
        }
        
        //Get Single data by id (OK)
        public RecruiterViewModel GetRecruiterById(int id)
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.Query<RecruiterViewModel>(DbQuery.GetRecruiterById, new { Id = id }).SingleOrDefault();
            }
        }

        //UpdateRecruiter data (OK)
        public bool UpdateRecruiter(RecruiterViewModel model)
        {
            using (var cnn = OpenSunLifeDB())
            {
                var result = cnn.Execute(DbQuery.UpdateRecruiter, new
                {

                    ID = model.Id,
                    UpdateResubmitDate = DateTime.Now,
                    Name = model.Name,
                    HomeAddress = model.HomeAddress,
                    PostalCode = model.PostalCode,
                    RecruiterAgentCode = model.RecruiterAgentCode,
                    CityCode = model.CityCode,
                    ChangedWhen = DateTime.Now,
                    ChangedBy = HttpContext.Current.User.Identity.Name
                }) == 1;
                return result;
            }
        }

        //UpdateRecruiter data ()
        public bool UpdateRecruiterApproveReject(RecruiterViewModel model)
        {
            using (var cnn = OpenSunLifeDB())
            {
                var result = cnn.Execute(DbQuery.UpdateRecruiterApproveReject, new
                {
                    ID = model.Id,
                    UpdateResubmitDate = DateTime.Now,
                    Status = model.Status,
                    ChangedWhen = DateTime.Now,
                    ChangedBy = HttpContext.Current.User.Identity.Name
                }) == 1;
                return result;
            }
        }

    }
}
