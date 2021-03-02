using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Configuration;
using ERC.Repository.ViewModel;
using Dapper;

namespace ERC.Repository.Repository
{
    public class OAuthClientRepository : BaseRepository
    {
        public OAuthClientViewModel GetOAuthClient(string Id)
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.QuerySingleOrDefault<OAuthClientViewModel>(@"select * from OAuthClient where Id = @Id;", new { Id = Id });
            }
        }
    }
}
