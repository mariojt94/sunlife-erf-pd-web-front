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
    public class ProvinceRepository : BaseRepository
    {
        public ProvinceViewModel GetProvince(ProvinceViewModel data)
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.QuerySingleOrDefault<ProvinceViewModel>(DbQuery.GetProvinceByProvinceCountryCode, new { ProvinceCode = data.ProvinceCode, CountryCode = data.CountryCode });
            }
        }

        public List<ProvinceViewModel> GetProvinceName()
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.Query<ProvinceViewModel>(DbQuery.GetProvinceName).ToList();
            }
        }


        public ProvinceViewModel GetProvinceByProvinceCode(ProvinceViewModel data)
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.QuerySingleOrDefault<ProvinceViewModel>(DbQuery.GetProvinceByProvinceCode, new { ProvinceCode = data.ProvinceCode });
            }
        }

        public ProvinceViewModel GetProvinceByName(string ProvinceName)
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.QuerySingleOrDefault<ProvinceViewModel>("select * from province where ProvinceName = @ProvinceName ", new { ProvinceName = ProvinceName });
            }
        }
        public object GetProvince()
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.Query<ProvinceViewModel>(DbQuery.GetListProvince);
            }
        }

        public IEnumerable<ProvinceViewModel> GetListProvince(int page, int rowspPage, string provincecode, string provincename, string countrycode)
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.Query<ProvinceViewModel>(DbQuery.GetListProvince, new { PageNumber = page, RowsPage = rowspPage, ProvinceCode = provincecode, ProvinceName = provincename, CountryCode = countrycode });
            }
        }

        public void AddProvince(ProvinceViewModel data)
        {
            using (var cnn = OpenSunLifeDB())
            {
                cnn.Execute(DbQuery.AddProvince, new
                {
                    ProvinceCode = data.ProvinceCode.ToUpper(),
                    ProvinceName = data.ProvinceName,
                    CountryCode = data.CountryCode,
                    IsActive = data.IsActive,
                    isDelete = data.IsDelete,
                    CreatedWhen = DateTime.Now.ToString("MM/dd/yyyy"),
                    CreatedBy = HttpContext.Current.User.Identity.Name,
                    ChangedWhen = DateTime.Now.ToString("MM/dd/yyyy"),
                    ChangedBy = HttpContext.Current.User.Identity.Name,
                });
            }
        }

        public void UpdateProvince(ProvinceViewModel data)
        {
            using (var cnn = OpenSunLifeDB())
            {
                cnn.Execute(DbQuery.UpdateProvince, new
                {
                    Id = data.Id,
                    ProvinceCode = data.ProvinceCode.ToUpper(),
                    ProvinceName = data.ProvinceName,
                    CountryCode = data.CountryCode,
                    IsActive = data.IsActive,
                    isDelete = data.IsDelete,
                    ChangedWhen = DateTime.Now.ToString("MM/dd/yyyy"),
                    ChangedBy = HttpContext.Current.User.Identity.Name,
                });
            }
        }

        public void UpdateProvinceOnUpload(ProvinceViewModel data)
        {
            using (var cnn = OpenSunLifeDB())
            {
                cnn.Execute(DbQuery.UpdateProvinceOnUpload, new
                {
                    Id = data.Id,
                    ProvinceCode = data.ProvinceCode.ToUpper(),
                    ProvinceName = data.ProvinceName,
                    CountryCode = data.CountryCode,
                    IsActive = data.IsActive,
                    isDelete = data.IsDelete,
                    ChangedWhen = DateTime.Now.ToString("MM/dd/yyyy"),
                    ChangedBy = HttpContext.Current.User.Identity.Name,
                });
            }
        }

        public void DeleteProvince(ProvinceViewModel data)
        {
            using (var cnn = OpenSunLifeDB())
            {
                cnn.Execute(DbQuery.DeleteProvince, new
                {
                    Id = data.Id,
                    ChangedWhen = DateTime.Now.ToString("MM/dd/yyyy"),
                    ChangedBy = HttpContext.Current.User.Identity.Name,
                });
            }
        }

        public IEnumerable<ProvinceViewModel> GetProvinceByProvinceCode(string provincecode, string countrycode)
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.Query<ProvinceViewModel>(DbQuery.GetProvinceByProvinceCountryCode, new
                {
                    ProvinceCode = provincecode,
                    CountryCode = countrycode,
                });
            }
        }
    }
}
