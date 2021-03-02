using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERC.Repository.ViewModel
{
    public class CandidateViewModel
    {
        public int ID { get; set; }
        public int CandidateId { get; set; }
        public int Level { get; set; }
        public string RecruiterAgentCode { get; set; }
        public int GroupLevel { get; set; }
        public string RecruiterName { get; set; }
        //Data Pribadi
        public string AgentCode { get; set; }
        public string AgentName { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string NoKTP { get; set; }
        public DateTime BirthDate { get; set; }
        public string Gender { get; set; }
        public string GenderName { get; set; }
        public string HomeAddress { get; set; }
        public string CurrentAddress { get; set; }
        public int CityId { get; set; }
        public string CityName { get; set; }
        public string PostalCode { get; set; }
        public string TemporaryAgentCode { get; set; }
        public string Status { get; set; }

        //Data NPWP
        public int NPWPNo { get; set; }
        public string NPWPName { get; set; }
        public string NPWPAddress { get; set; }
        public string NPWPCity { get; set; }
        public DateTime NPWPRegistrationDate { get; set; }

        //Data Bank
        public string BankAccountName { get; set; }
        public string BankAccountNo { get; set; }
        public string BankName { get; set; }
        public string Branch { get; set; }

        //list Education
        public List<Education> Educations { get; set; }

        //list Experience
        public List<Experience> Experiences { get; set; }

        public string IsHaveOtherIncome { get; set; }
        public string OtherIncomeDesription { get; set; }
        public bool DocumentCheckingFlag { get; set; }
        public bool AllLeaderApproveFlag { get; set; }
        public bool AajiPassedFlag { get; set; }
        public bool ELearningPassedFlag { get; set; }
        
        // data untuk recruitment page 1

        //data agency
        public int TeamId { get; set; }
        public string TeamCode { get; set; }
        public string TeamName { get; set; }

        public CandidateAajiExamViewModel AajiExam { get; set; }

    }
}
