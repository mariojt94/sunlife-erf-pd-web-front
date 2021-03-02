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
    public class GlobalConfigurationRepository : BaseRepository
    {
        public IEnumerable<GlobalConfigurationViewModel> GetListGlobalConfiguration(int page, int rowspPage, string Keyword)
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.Query<GlobalConfigurationViewModel>(DbQuery.GetListGlobalConfiguration, new { PageNumber = page, RowsPage = rowspPage, Keyword = "%" + Keyword + "%" });
            }
        }

        public GlobalConfigurationViewModel GetDataByKeyword(string Keyword)
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.QueryFirstOrDefault<GlobalConfigurationViewModel>(DbQuery.GetGlobalConfigurationByKeyword, new { Keyword = Keyword });
            }
        }

        public void AddNew(GlobalConfigurationViewModel data)
        {
            using (var cnn = OpenSunLifeDB())
            {
                cnn.Execute(DbQuery.AddGlobalConfiguration, new
                {
                    Keyword = data.Keyword,
                    Keygroup = data.KeyGroup,
                    Value = data.Value,
                    CreatedBy = HttpContext.Current.User.Identity.Name,
                    CreatedWhen = DateTime.Now,
                    ChangedWhen = DateTime.Now,
                    ChangedBy = HttpContext.Current.User.Identity.Name
                });
            }
        }

        public void Update(GlobalConfigurationViewModel data)
        {
            using (var cnn = OpenSunLifeDB())
            {
                cnn.Execute(DbQuery.UpdateGlobalConfiguration, new
                {
                    Keygroup = data.KeyGroup,
                    Value = data.Value,
                    ChangedWhen = DateTime.Now,
                    ChangedBy = HttpContext.Current.User.Identity.Name,
                    Keyword = data.Keyword
                });
            }
        }

        public void Delete(GlobalConfigurationViewModel data)
        {
            using (var cnn = OpenSunLifeDB())
            {
                cnn.Execute(DbQuery.DeleteConfiguration, new
                {
                    Keyword = data.Keyword
                });
            }
        }

        public void IncrementRunningNumberValue(int OldValue, string Keyword)
        {
            using (var cnn = OpenSunLifeDB())
            {
                //cnn.Execute("UPDATE GlobalConfiguration SET Value = " + (OldValue + 1) + " WHERE Keyword = '" + Keyword + "'");
                cnn.Execute("UPDATE GlobalConfiguration SET Value = @OldValue WHERE Keyword = @Keyword", new { OldValue = (OldValue + 1), Keyword=Keyword });
            }
        }

    }
}
