using System;

namespace ERC.Repository.ViewModel
{
    public class CandidateWorkExperienceInInsuranceViewModel
    {
        public int Id { get; set; }
        public string CompanyName { get; set; }
        public string LastPosition { get; set; }
        public string MainOfficeAddress { get; set; }
        public string HasBeenJoinFor { get; set; }
        public DateTime TerminateDate { get; set; }
        public string OldAgentCode { get; set; }
        //additional untuk validasi data apakah data baru atau bukan
        public string StatusData { get; set; }
    }
}
