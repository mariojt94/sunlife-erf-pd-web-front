using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERC.Repository.ViewModel
{
    public class DownloadAajiViewModel
    {
        public int No { get; set; }
        public string RecruiterName { get; set; }
        public string RecruiterAgentCode { get; set; }
        public string HomeAddress { get; set; }
        public string CityName { get; set; }
        public string PhoneNo { get; set; }
        public string KTPNo { get; set; }
        public string BirthPlace { get; set; }
        public string DisplayName { get; set; }
        public DateTime BirthDate { get; set; }
        public string Gender { get; set; }
        public string MaritalStatus { get; set; }
        public string Religion { get; set; }
        public string SubmitDate { get; set; }
        public string ProductType { get; set; }
        public DateTime ExamDate { get; set; }
        public string ExamType { get; set; }
        public string ExamLocation { get; set; }
        public string InstitutionName { get; set; }
        public string DirectManagerName { get; set; }
        public string OfficeCity { get; set; }
        public string Position { get; set; }
    }
    public class BranchLocationViewModel
    {
        public string Alamat1 { get; set; }
        public string Alamat2 { get; set; }
        public string RT { get; set; }
        public string RW { get; set; }
        public string AgentLocation { get; set; }
        public string AgentLocationCode { get; set; }
        public string TeamName { get; set; }
        public string Kelurahan { get; set; }
        public string Kecamatan { get; set; }
        public string Kodepost { get; set; }
        public string BranchAdmin { get; set; }
        public string PhoneNumber { get; set; }
        public string Email { get; set; }
    }
    public class LisensiViewModel
    {
        public string No { get; set; }
        public string CandidateName { get; set; }
        public string CompanyName { get; set; }
        public string AajiAAsiCode { get; set; }
        public string PermanentAgentCode { get; set; }
        public string Status { get; set; }
        public string BirthDate { get; set; }
        public string KTPNo { get; set; }
        public string LicenseType { get; set; }
        public string ProductType { get; set; }
        public string SertifiedSince { get; set; }
        public string ExpiredLicense { get; set; }
    }
    public class AgenProfileListViewModel
    {
        public string ContractedDate { get; set; }
        public string RestType { get; set; }
        public string EffectiveDate { get; set; }
        public string DTCode { get; set; }
        public string Gen1 { get; set; }
        public string Genal { get; set; }
        public string SubmitDate { get; set; }
        public string TemporaryAgentCode { get; set; }
        public string Name { get; set; }
        public string Clas { get; set; }
        public string Gender { get; set; }
        public string BirthDate { get; set; }
        public string BirthPlace { get; set; }
        public string Religion { get; set; }
        public string Nationality { get; set; }
        public string CivilStatus { get; set; }
        public string HomeAddress { get; set; }
        public string BranchCode { get; set; }
        public string BranchName { get; set; }
        public string DirectManagerCode { get; set; }
        public string DisplayName { get; set; }
        public string BankCode { get; set; }
        public string BankAccountNo { get; set; }
        public string KTPNo { get; set; }
        public string TaxID { get; set; }
        public string MainEmployer { get; set; }
        public string OfficeLocation { get; set; }
        public string PhoneNo { get; set; }
        public string HomePhone { get; set; }
        public string EducationLevel { get; set; }
        public string InstitutionName { get; set; }
        public string AttendenceFrom { get; set; }
        public string AttendenceTo { get; set; }
        public string Position { get; set; }
        public string FromDate { get; set; }
        public string ToDate { get; set; }
        public string Recruiter { get; set; }
        public string ProductiveDate { get; set; }
        public string Email { get; set; }
        public string FinalInterViewResult { get; set; }
        public string CompanyName { get; set; }
    }
}
