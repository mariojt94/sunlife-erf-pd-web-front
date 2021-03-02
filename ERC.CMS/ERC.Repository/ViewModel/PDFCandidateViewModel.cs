using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERC.Repository.ViewModel
{
    public class PDFCandidateViewModel
    {
        public CandidateViewModel CandidateData { get; set; }

        public List<ProfilingQuetionViewModel> ProfilingQuestion { get; set; }

        public DateTime InterviewDate { get; set; }
        public decimal TotalProfilingPoint { get; set; }

        public List<PTKPViewModel> PTKPData { get; set; }
        public LocationViewModel AgencyDirectorLocation { get; set; }

        public CandidateDataPribadiViewModel CandidateDataPribadi { get; set; }
    }
}
