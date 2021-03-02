using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dapper;
using ERC.Repository.Resources;
using ERC.Repository.ViewModel;

namespace ERC.Repository.Repository
{
    public class PsikotesRepository : BaseRepository
    {
        public string AddHasilPsikotes(CandidatePsikotesHasilViewModel data)
        {
            var status = "SUBMIT";

            using (var cnn = OpenSunLifeDB())
            {
                cnn.Execute(DbQuery.AddHasilPsikotes, new
                {
                    loginName = data.LoginName,
                    mostD = data.MostD,
                    mostI = data.MostI,
                    mostS = data.MostS,
                    mostC = data.MostC,
                    mostStar = data.MostStar,
                    leastD = data.LeastD,
                    leastI = data.LeastI,
                    leastS = data.LeastS,
                    leastC = data.LeastC,
                    leastStar = data.LeastStar,
                    changeD = data.ChangeD,
                    changeI = data.ChangeI,
                    changeS = data.ChangeS,
                    changeC = data.ChangeC,
                    submitDate = DateTime.Now
                });
            }

            return status;
        }


        public string AddJawabanPsikotes(CandidatePsikotesJawabanViewModel[] data)
        {
            var status = "SUBMIT";

            foreach (CandidatePsikotesJawabanViewModel item in data)
            {
                using (var cnn = OpenSunLifeDB())
                {
                    cnn.Execute(DbQuery.AddJawabanPsikotes, new
                    {
                        loginName = item.LoginName,
                        noPertanyaan = item.NoPertanyaan,
                        row = item.Row,
                        value = item.Value,
                        submitDate = DateTime.Now
                    });
                }
            }

            return status;
        }
    }
}
