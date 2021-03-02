using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Serialization;

namespace ERC.Repository.ViewModel
{
    [XmlRoot("CandidateViewModel")]
    public class CandidateViewModel
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public string CurrentAddress { get; set; }
        public string City { get; set; }
        public string PostalCode { get; set; }
        public int Rt { get; set; }
        public int Rw { get; set; }
        public string Province { get; set; }
        public string LoginName { get; set; }

        public string CityName { get; set; }
       
        [XmlElement("AajiStatus")]
        public string AajiStatus { get; set; }
        [XmlElement("ID")]

        public int CandidateId { get; set; }
        [XmlElement("Level")]
        public string Level { get; set; }
        [XmlElement("LevelName")]
        public string LevelName { get; set; }
        [XmlElement("RecruiterAgentCode")]
        public string RecruiterAgentCode { get; set; }
        [XmlElement("RecruiterLocationCode")]
        public string RecruiterLocationCode { get; set; }
        [XmlElement("GroupLevel")]
        public int GroupLevel { get; set; }
        [XmlElement("RecruiterName")]
        public string RecruiterName { get; set; }
        [XmlElement("RecruiterMail")]
        public string RecruiterMail { get; set; }
        [XmlElement("PhoneNo")]
        public string PhoneNo { get; set; }
        //Data Pribadi
        [XmlElement("AgentCode")]
        public string AgentCode { get; set; }
        [XmlElement("AgentName")]
        public string AgentName { get; set; }
        [XmlElement("Name")]
        public string Names { get; set; }
        [XmlElement("Email")]
        public string Email { get; set; }
        [XmlElement("KTPNo")]
        public string KTPNo { get; set; }
        [XmlElement("BirthDate")]
        public DateTime BirthDate { get; set; }
        [XmlElement("Gender")]
        public string Gender { get; set; }
        [XmlElement("GenderName")]
        public string GenderName { get; set; }
        [XmlElement("HomeAddress")]
        public string HomeAddress { get; set; }
        [XmlElement("CurrentAddress")]
        public string CurrentAddresses { get; set; }
        [XmlElement("SubmitDate")]
        public DateTime SubmitDate { get; set; }
        [XmlElement("DayOfSubmitDate")]
        public string DayOfSubmitDate { get; set; }
        [XmlElement("CityCode")]
        public string CityCode { get; set; }
        [XmlElement("CityName")]
        public string TemporaryAgentCode { get; set; }
        [XmlElement("Status")]
        public string Status { get; set; }
        [XmlElement("PropertyOwnershipStatus")]
        public string PropertyOwnershipStatus { get; set; }
        [XmlElement("BirthPlace")]
        public string BirthPlace { get; set; }
        [XmlElement("HomePhone")]
        public string HomePhone { get; set; }
        [XmlElement(" Income")]
        public Decimal? Income { get; set; }
        [XmlElement("VirtualAccount")]
        public string VirtualAccount { get; set; }
        //Data NPWP
        [XmlElement("NPWPNo")]
        public string NPWPNo { get; set; }
        [XmlElement("NPWPName")]
        public string NPWPName { get; set; }
        [XmlElement("NPWPRelationWith")]
        public string NPWPRelationWith { get; set; }

        //Data Bank
        [XmlElement("BankCode")]
        public string BankCode { get; set; }
        [XmlElement("BankAccountName")]
        public string BankAccountName { get; set; }
        [XmlElement("BankAccountNo")]
        public string BankAccountNo { get; set; }
        [XmlElement("BankName")]
        public string BankName { get; set; }
        [XmlElement("Branch")]
        public string Branch { get; set; }        //list Education

        [XmlElement("Educations")]
        public List<CandidateEducationViewModel> Educations { get; set; }

        //list Experience
        [XmlElement("Experiences")]
        public List<CandidateExperienceViewModel> Experiences { get; set; }
        [XmlElement("References")]
        public List<CandidateReferenceViewModel> References { get; set; }
        [XmlElement("Relations")]
        public List<CandidateRelationInInsuranceViewModel> Relations { get; set; }
        [XmlElement("WorkExperiences")]
        public List<CandidateWorkExperienceInInsuranceViewModel> WorkExperiences { get; set; }
        [XmlElement("AvailableLevels")]
        public List<AvailableLevelViewModel> AvailableLevels { get; set; }
        //data tanggaungan kandidat
        [XmlElement("Dependencies")]
        public List<CandidateDependencyViewModel> Dependencies { get; set; }
        [XmlElement("DocumentCheckingFlag")]
        public bool DocumentCheckingFlag { get; set; }
        [XmlElement("AllLeaderApproveFlag")]
        public bool AllLeaderApproveFlag { get; set; }
        [XmlElement("AajiPassedFlag")]
        public bool AajiPassedFlag { get; set; }
        [XmlElement("ELearningPassedFlag")]
        public bool ELearningPassedFlag { get; set; }

        // data untuk recruitment page 1

        //data agency
        [XmlElement("TeamId")]
        public int TeamId { get; set; }
        [XmlElement("TeamCode")]
        public string TeamCode { get; set; }
        [XmlElement("TeamName")]
        public string TeamName { get; set; }
        [XmlElement("AajiExam")]
        public CandidateAajiExamViewModel AajiExam { get; set; }
        [XmlElement("Background")]
        public List<string> Background { get; set; }

        //Elearning Account
        [XmlElement("LoginName")]
        public string LoginNames { get; set; }
        [XmlElement("Password")]
        public string Password { get; set; }
        [XmlElement("RoleID")]
        public int RoleID { get; set; }
        [XmlElement("TypeID")]
        public int TypeID { get; set; }

        // aaji exam id
        [XmlElement("AajiExamId")]
        public string AajiExamId { get; set; }

        [XmlElement("isPendingDocument")]
        public bool isPendingDocument { get; set; }

        //digunakan ketika level hirarki kandidat lebih kecil di banding hirarki si recruiter
        [XmlElement("HierarkiLevel")]
        public int HierarkiLevel { get; set; }
        [XmlElement("AgencyDirector")]
        public string AgencyDirector { get; set; }
        [XmlElement("RecruiterPosition")]
        public string RecruiterPosition { get; set; }

        //untuk submit data manager untuk sementara tidak di gunakan dlu
        [XmlElement("ManagerAgentCode")]
        public string ManagerAgentCode { get; set; }
        [XmlElement("MaritalStatus")]
        public string MaritalStatus { get; set; }
        [XmlElement("SpouseName")]
        public string SpouseName { get; set; }
        [XmlElement("SpouseBirthDate")]
        public DateTime SpouseBirthDate { get; set; }

        [XmlElement("CurrentPostalCode")]
        public int CurrentPostalCode { get; set; }
        [XmlElement("CurrentCityCode")]
        public string CurrentCityCode { get; set; }
        [XmlElement("CurrentCityName")]
        public string CurrentCityName { get; set; }
        [XmlElement("Religion")]
        public string Religion { get; set; }
        [XmlElement("PTKPHeader")]
        public string PTKPHeader { get; set; }
        [XmlElement("PTKPDetail")]
        public int PTKPDetail { get; set; }
        [XmlElement("PTKPDetailValue")]
        public string PTKPDetailValue { get; set; }
        [XmlElement("RecruiterSignature")]
        public string RecruiterSignature { get; set; }
        [XmlElement("CandidateSignature")]
        public string CandidateSignature { get; set; }
        [XmlElement("RecommendedPosition")]
        public string RecommendedPosition { get; set; }

        //Photo Pelengkap
        [XmlElement("photoKtpId")]
        public int photoKtpId { get; set; }
        [XmlElement("photoDiriId")]
        public int photoDiriId { get; set; }
        [XmlElement("photoNpwpId")]
        public int photoNpwpId { get; set; }
        [XmlElement("photoKkId")]
        public int photoKkId { get; set; }
        [XmlElement("photoBukuTabunganId")]
        public int photoBukuTabunganId { get; set; }
        [XmlElement("photoBuktiTransferId")]
        public int photoBuktiTransferId { get; set; }
        //string untuk base64 mobile
        [XmlElement("photoKtpbase64")]
        public string photoKtpbase64 { get; set; }
        [XmlElement("photoBukuTabunganbase64")]
        public string photoBukuTabunganbase64 { get; set; }
        [XmlElement("photoDiribase64")]
        public string photoDiribase64 { get; set; }
        [XmlElement("photoKkbase64")]
        public string photoKkbase64 { get; set; }
        [XmlElement("photoNpwpbase64")]
        public string photoNpwpbase64 { get; set; }
        [XmlElement("photoBuktiTransferbase64")]
        public string photoBuktiTransferbase64 { get; set; }
        [XmlElement("LocationCode")]
        public string LocationCode { get; set; }
        [XmlElement("LocationName")]
        public string LocationName { get; set; }

        [XmlElement("ManagerName")]
        public string ManagerName { get; set; }
        [XmlElement("ManagerLocation")]
        public string ManagerLocation { get; set; }
        [XmlElement("ManagerPosition")]
        public string ManagerPosition { get; set; }
        [XmlElement("isAd")]
        public bool isAd { get; set; }

        [XmlElement("UserLoginName")]
        public string UserLoginName { get; set; }
        [XmlElement("UserLoginCode")]
        public string UserLoginCode { get; set; }

        [XmlElement("Pertanyaan1")]
        public string Pertanyaan1 { get; set; }
        [XmlElement("Pertanyaan2")]
        public string Pertanyaan2 { get; set; }
        [XmlElement("Pertanyaan3")]
        public string Pertanyaan3 { get; set; }
        [XmlElement("Pertanyaan4")]
        public string Pertanyaan4 { get; set; }

        [XmlElement("AgentDirectorLocation")]
        public string AgentDirectorLocation { get; set; }
        [XmlElement("AgentDirectorLocationCode")]
        public string AgentDirectorLocationCode { get; set; }
    }
}

