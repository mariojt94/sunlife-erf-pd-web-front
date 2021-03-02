using System;

namespace ERC.Repository.ViewModel
{
    public class ResultTestViewModel
    {
        public int Id { get; set; }
        public string AgentName { get; set; }
        public string AgentCode { get; set; }
        public string ExamCode { get; set; }
        public string ExamLocation { get; set; }
        public DateTime ExamDate { get; set; }
        public string ExamSession { get; set; }
        public string ExamResult { get; set; }
        public string ExamProduct { get; set; }
        public string AajiCode { get; set; }
        public string AasiCode { get; set; }
        public string CertificateNumber { get; set; }
        public bool IsPassed { get; set; }
        public string Error { get; set; }
        public string Url { get; set; }
        public int Length { get; set; }
        public string ExpiredLicense { get; set; }
        public string LicenseType { get; set; }
    }
}