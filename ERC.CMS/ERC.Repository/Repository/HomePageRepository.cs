using Dapper;
using ERC.Repository.Resources;
using ERC.Repository.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web;

namespace ERC.Repository.Repository
{

    public class HomePageRepository : BaseRepository
    {
        public IEnumerable<object> GetDataChart2(int flag)
        {
            string username = HttpContext.Current.User.Identity.Name;
            var userRepository = new UserRepository();
            var model = userRepository.GetUser(username);
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.Query<object>("EXEC GetDataForChart2 @agentCode, @flag", new { agentCode = model.AgentCode, flag = flag.ToString() });
            }
        }
        public IEnumerable<ChartViewModel> GetDataChart(int flag, int flagcms)
        {
            string username = HttpContext.Current.User.Identity.Name;
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.Query<ChartViewModel>("EXEC GETDATACHART @flag, @flagcms,@username", new { flag = flag.ToString(), flagcms = flagcms.ToString(), username = username });
            }
        }
        public IEnumerable<object> GetDataChartMobile(int flag, int flagcms, string username)
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.Query<object>("EXEC GetDataForChart2 @username, @flag ", new { username = username, flag = flag });
            }
        }
        //tidak di pakai
        public IEnumerable<TotalRecruitmentViewModel> GetTotalRecruitmentAgent(string recruitmentAgentCode)
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.Query<TotalRecruitmentViewModel>(DbQuery.GetTotalRecruitmentAgent, new { RecruitmentAgentCode = recruitmentAgentCode });
            }
        }
        public DashboardActivitySummaryViewModel GetListActivitySummary(string loginname, int month, int year)
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.Query<DashboardActivitySummaryViewModel>(DbQueryPortal.GetDashboardActivitySummaryPerMonth, new { RecruiterAgentCode = loginname, Month = month, Year = year }).FirstOrDefault();
            }
        }
        public DashboardActivitySummaryViewModel GetListActivitySummaryMobile(string loginname, int month, int year)
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.Query<DashboardActivitySummaryViewModel>(DbQueryPortal.GetDashboardActivitySummaryPerMonthMobile, new { RecruiterAgentCode = loginname, Month = month, Year = year }).FirstOrDefault();
            }
        }
        public IEnumerable<DashboardCandidateProcessViewModel> GetDashboardListCandidateProcessMobile(string loginname, int month, int year)
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.Query<DashboardCandidateProcessViewModel>(DbQueryPortal.GetDashboardListCandidateProsesMobile, new { RecruiterAgentCode = loginname, Month = month, Year = year });
            }
        }
        public IEnumerable<DashboardCandidateProcessViewModel> GetDashboardListCandidateProcess(string loginname, int month, int year, int PageNumber, int RowsPage)
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.Query<DashboardCandidateProcessViewModel>(DbQueryPortal.GetDashboardListCandidateProses, new { RecruiterAgentCode = loginname, Month = month, Year = year, PageNumber = PageNumber, RowsPage = RowsPage });
            }
        }
    }
}
