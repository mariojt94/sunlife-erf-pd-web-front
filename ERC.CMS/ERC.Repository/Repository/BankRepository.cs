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
    public class BankRepository : BaseRepository
    {
        public void UnDeleteBank(BankViewModel data)
        {
            using (var cnn = OpenSunLifeDB())
            {
                cnn.Execute(DbQuery.UnDeleteBank, new
                {
                    BankCode = data.BankCode,
                    ChangedWhen = DateTime.Now,
                    ChangedBy = HttpContext.Current.User.Identity.Name
                });
            }
        }
        public BankViewModel GetDeletedBank(BankViewModel data)
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.QuerySingleOrDefault<BankViewModel>(DbQuery.GetDeletedBank, new { BankCode = data.BankCode.ToUpper() });
            }
        }

        public IEnumerable<BankViewModel> GetBank() {
            using (var cnn = OpenSunLifeDB()) {
                return cnn.Query<BankViewModel>(DbQuery.GetBank);
            }
        }
        public IEnumerable<BankViewModel> GetListBank(int page, int rowspPage, string bankName)
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.Query<BankViewModel>(DbQuery.GetListBank, new { PageNumber = page, RowsPage = rowspPage, BankName = "%" + bankName + "%" });
            }
        }
        public BankViewModel GetBankById(BankViewModel data)
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.QuerySingleOrDefault<BankViewModel>(DbQuery.GetBankById, new { ID = data.ID });
            }
        }
        public BankViewModel GetBankByCode(BankViewModel data)
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.QuerySingleOrDefault<BankViewModel>(DbQuery.GetBankByCode, new { BankCode = data.BankCode.ToUpper() });
            }
        }

        public void AddNewBank(BankViewModel data)
        {
            using (var cnn = OpenSunLifeDB())
            {
                cnn.Execute(DbQuery.AddNewBank, new
                {
                    BankCode = data.BankCode.ToUpper(),
                    BankName = data.BankName,
                    IsActive = data.IsActive,
                    CreatedWhen = DateTime.Now,
                    CreatedBy = HttpContext.Current.User.Identity.Name,
                    ChangedWhen = DateTime.Now,
                    ChangedBy = HttpContext.Current.User.Identity.Name
                });
            }
        }

        public void UpdateBank(BankViewModel data)
        {
            using (var cnn = OpenSunLifeDB())
            {
                cnn.Execute(DbQuery.UpdateBank, new
                {
                    BankCode = data.BankCode.ToUpper(),
                    BankName = data.BankName,
                    IsActive = data.IsActive,
                    ChangedWhen = DateTime.Now,
                    ChangedBy = HttpContext.Current.User.Identity.Name,
                    ID = data.ID
                });
            }
        }

        public void UpdateBankByBankCode(BankViewModel data)
        {
            using (var cnn = OpenSunLifeDB())
            {
                cnn.Execute(DbQuery.UpdateBankByBankCode, new
                {
                    BankCode = data.BankCode.ToUpper(),
                    BankName = data.BankName,
                    IsActive = data.IsActive,
                    ChangedWhen = DateTime.Now,
                    ChangedBy = HttpContext.Current.User.Identity.Name,
                    ID = data.ID
                });
            }
        }

        public void Delete(BankViewModel data)
        {
            using (var cnn = OpenSunLifeDB())
            {
                cnn.Execute(DbQuery.DeleteBank, new
                {
                    ID = data.ID,
                    ChangedWhen = DateTime.Now,
                    ChangedBy = HttpContext.Current.User.Identity.Name
                });
            }
        }

    } //
}
