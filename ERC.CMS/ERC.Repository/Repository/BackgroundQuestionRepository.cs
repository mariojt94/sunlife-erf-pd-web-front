using ERC.Repository.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dapper;
using ERC.Repository.Resources;
using System.Web;

namespace ERC.Repository.Repository
{
    public class BackgroundQuestionRepository : BaseRepository
    {
        public BackgroundQuestionViewModel GetBackgroundQuestion(BackgroundQuestionViewModel data)
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.QuerySingleOrDefault<BackgroundQuestionViewModel>(DbQuery.GetBackgroundQuestionById, new { Id = data.Id });
            }
        }

        public IEnumerable<BackgroundQuestionViewModel> GetListBackgroundQuestion(int page, int rowspPage, string description)
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.Query<BackgroundQuestionViewModel>(DbQuery.GetListBackgroundQuestion, new { PageNumber = page, RowsPage = rowspPage, Description = description });
            }
        }

        public IEnumerable<BackgroundQuestionViewModel> GetAllBackgroundQuestion()
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.Query<BackgroundQuestionViewModel>("SELECT * FROM BackgroundQuestion WHERE IsActive = 1 AND IsDelete = 0");
            }
        }

        public void AddBackgroundQuestion(BackgroundQuestionViewModel data)
        {
            using (var cnn = OpenSunLifeDB())
            {
                cnn.Execute(DbQuery.AddBackgroundQuestion, new
                {
                    Description = data.Description,
                    IsActive = data.IsActive,
                    isDelete = data.IsDelete,
                    CreatedWhen = DateTime.Now.ToString("MM/dd/yyyy"),
                    CreatedBy = HttpContext.Current.User.Identity.Name,
                    ChangedWhen = DateTime.Now.ToString("MM/dd/yyyy"),
                    ChangedBy = HttpContext.Current.User.Identity.Name,
                });
            }
        }

        public void UpdateBackgroundQuestion(BackgroundQuestionViewModel data)
        {
            using (var cnn = OpenSunLifeDB())
            {
                cnn.Execute(DbQuery.UpdateBackgroundQuestion, new
                {
                    Id = data.Id,
                    Description = data.Description,
                    IsActive = data.IsActive,
                    isDelete = data.IsDelete,
                    ChangedWhen = DateTime.Now.ToString("MM/dd/yyyy"),
                    ChangedBy = HttpContext.Current.User.Identity.Name,
                });
            }
        }

        public void DeleteBackgroundQuestion(BackgroundQuestionViewModel data)
        {
            using (var cnn = OpenSunLifeDB())
            {
                cnn.Execute(DbQuery.DeleteBackgroundQuestion, new
                {
                    Id = data.Id,
                    ChangedWhen = DateTime.Now.ToString("MM/dd/yyyy"),
                    ChangedBy = HttpContext.Current.User.Identity.Name,
                });
            }
        }
    }
}
