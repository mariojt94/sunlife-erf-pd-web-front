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
    public class MenuRepository : BaseRepository
    {
        public MenuViewModel GetMenu(MenuViewModel data)
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.QuerySingleOrDefault<MenuViewModel>(DbQuery.GetMenuById, new { Id = data.Id });
            }
        }
        //untuk dropdown
        public IEnumerable<MenuViewModel> GetMenu()
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.Query<MenuViewModel>(DbQuery.GetMenu);
            }
        }
        public IEnumerable<MenuViewModel> GetListMenu(int page, int rowspPage, string title)
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.Query<MenuViewModel>(DbQuery.GetListMenu, new { PageNumber = page, RowsPage = rowspPage, Title = "%" + title + "%" });
            }
        }

        public void UpdateMenu(MenuViewModel data)
        {
            using (var cnn = OpenSunLifeDB())
            {
                cnn.Execute(DbQuery.UpdateMenu, new
                {
                    Id = data.Id,
                    Icon = data.Icon,
                    Title = data.Title,
                    Link = data.Link,
                    ChangedWhen = DateTime.Now.ToString("MM/dd/yyyy"),
                    ChangedBy = HttpContext.Current.User.Identity.Name,
                });

            }
        }
    }
}
