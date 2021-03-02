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
    public class CityRepository : BaseRepository
    {
        public IEnumerable<CityViewModel> GetCityTemplate()
        {
            var sql = "select c.CityCode, c.Name, p.ProvinceCode,p.ProvinceName, co.CountryCode, co.CountryName from City c left join Province p on c.ProvinceCode = c.ProvinceCode left join Country co on co.CountryCode = p.CountryCode";
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.Query<CityViewModel>(sql, new {  });
            }
        }
        public CityViewModel GetCity(CityViewModel data)
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.QuerySingleOrDefault<CityViewModel>(DbQuery.GetCityById, new { Id = data.Id });
            }
        }
        public CityViewModel GetCityByName(string CityName)
        {
            using (var cnn = OpenSunLifeDB())
            {
                var sql = "select * from City where Name = @CityName";
                return cnn.QuerySingleOrDefault<CityViewModel>(sql, new { CityName = CityName });
            }
        }
        public CityViewModel GetCityByCode(CityViewModel data)
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.QuerySingleOrDefault<CityViewModel>(DbQuery.GetCityByCode, new { CityCode = data.CityCode });
            }
        }

        public object GetCity()
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.Query<CityViewModel>(DbQuery.GetCity);
            }
        }

        public IEnumerable<CityViewModel> GetListCity(int page, int rowspPage, string citycode, string name, string province)
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.Query<CityViewModel>(DbQuery.GetListCity, new { PageNumber = page, RowsPage = rowspPage, CityCode = "%" + citycode + "%", Name = "%" + name + "%", Province = "%" + province + "%" });
            }
        }

        public IEnumerable<CityViewModel> GetDataCity()
        {
            using (var cnn = OpenSunLifeDB())
            {
                var sql = "select * from city";
                return cnn.Query<CityViewModel>(sql);
            }
        }

        public IEnumerable<CityViewModel> GetDataTemplateCity()
        {
            using (var cnn = OpenSunLifeDB())
            {
                var sql = "select c.CityCode,c.Name,p.ProvinceCode,p.ProvinceName,co.CountryCode,co.CountryName from city c left join Province p on c.ProvinceCode = p.ProvinceCode left join Country co on p.CountryCode = co.CountryCode";
                return cnn.Query<CityViewModel>(sql);
            }
        }


        public void AddCity(CityViewModel data)
        {
            using (var cnn = OpenSunLifeDB())
            {
                cnn.Execute(DbQuery.AddCity, new
                {
                    Name = data.Name,
                    CityCode = data.CityCode,
                    ProvinceCode = data.provinceCode,
                    IsActive = data.IsActive,
                    isDelete = data.IsDelete,
                    CreatedWhen = DateTime.Now.ToString("MM/dd/yyyy"),
                    CreatedBy = HttpContext.Current.User.Identity.Name,
                    ChangedWhen = DateTime.Now.ToString("MM/dd/yyyy"),
                    ChangedBy = HttpContext.Current.User.Identity.Name,
                });
            }
        }

        public void UpdateCity(CityViewModel data)
        {
            using (var cnn = OpenSunLifeDB())
            {
                cnn.Execute(DbQuery.UpdateCity, new
                {
                    Id = data.Id,
                    Name = data.Name,
                    ProvinceCode = data.provinceCode,
                    CityCode = data.CityCode,
                    IsActive = data.IsActive,
                    IsDelete = data.IsDelete,
                    ChangedWhen = DateTime.Now.ToString("MM/dd/yyyy"),
                    ChangedBy = HttpContext.Current.User.Identity.Name,
                });
            }
        }

        public void DeleteCity(CityViewModel data)
        {
            using (var cnn = OpenSunLifeDB())
            {
                cnn.Execute(DbQuery.DeleteCity, new
                {
                    Id = data.Id,
                    ChangedWhen = DateTime.Now.ToString("MM/dd/yyyy"),
                    ChangedBy = HttpContext.Current.User.Identity.Name,
                });
            }
        }
    }
}
