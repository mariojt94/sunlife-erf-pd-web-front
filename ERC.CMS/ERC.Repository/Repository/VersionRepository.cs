using System.Collections.Generic;
using ERC.Repository.ViewModel;
using ERC.Repository.Resources;
using Dapper;

namespace ERC.Repository.Repository
{
    public class VersionRepository : BaseRepository
    {
        public IEnumerable<VersionViewModel> GetListVersion(int page = 1, int rowspPage = 10)
        {
            using (var cnn = OpenSunLifeElearningDB())
            {
                return cnn.Query<VersionViewModel>(DbQuery.GetListVersion, new { page = page, rowspPage = 10});
            }
        }

        public string GetCurrentVersion() {
            using (var cnn = OpenSunLifeElearningDB())
            {
                return cnn.QueryFirstOrDefault<string>("select top 1 Version from Version");
            }
        }

        public void UpdateVersion(int Id, string Version)
        {
            using (var cnn = OpenSunLifeElearningDB())
            {
                cnn.Execute(DbQuery.UpdateVersion, new { Id = Id, Version = Version });
            }
        }
    }
}