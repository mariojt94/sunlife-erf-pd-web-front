using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERC.Repository.ViewModel
{
    public class CandidatePsikotesHasilViewModel
    {
        public int ID { get; set; }
        public string LoginName { get; set; }
        public int MostD { get; set; }
        public int MostI { get; set; }
        public int MostS { get; set; }

        public int MostC { get; set; }
        public int MostStar { get; set; }
        public int LeastD { get; set; }
        public int LeastI { get; set; }
        public int LeastS { get; set; }
        public int LeastC { get; set; }
        public int LeastStar { get; set; }
        public int ChangeD { get; set; }
        public int ChangeI { get; set; }
        public int ChangeS { get; set; }
        public int ChangeC { get; set; }
        public int ChangeStar { get; set; }
        public DateTime SubmitDate { get; set; }
    }
}
