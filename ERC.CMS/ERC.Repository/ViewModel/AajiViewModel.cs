using System;

namespace ERC.Repository.ViewModel
{
    public class AajiViewModel
    {
        public int Id { get; set; }
        public string ExamCode { get; set; }
        public DateTime ExamDate { get; set; }
        public int Capacity { get; set; }
        public int RegisteredUser { get; set; }
        public int ExamLocationID { get; set; }
        public string LocationName { get; set; }
        public string Note { get; set; }
        public bool IsActive { get; set; }
        public bool IsDelete { get; set; }
        public string Location { get; set; }
        public string City { get; set; }
        public int Length { get; set; }
    }
}
