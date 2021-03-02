using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERC.Repository.ViewModel
{
    public class RecruiterViewModel : BaseViewModel
    {
        public int Id { get; set; }
        public DateTime? SubmitDate { get; set; }
        public DateTime? UpdateResubmitDate { get; set; }
        //public string UpdateResubmitDate { get; set; }
        public string TemporaryAgentCode { get; set; }
        public string Name { get; set; }
        public string PhoneNo { get; set; }
        public string DisplayName { get; set; }
        public string Status { get; set; }

        public string HomeAddress { get; set; }
        public string CityName { get; set; }
        public string PostalCode { get; set; }
        public string ProvinceName { get; set; }
        public string RecruiterAgentCode { get; set; }
        public string CityCode { get; set; }
         
    }
}
