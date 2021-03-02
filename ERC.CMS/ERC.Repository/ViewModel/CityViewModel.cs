using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERC.Repository.ViewModel
{
    public class CityViewModel
    {
        public int Id { get; set; }
        public string CityCode { get; set; }
        public string Name { get; set; }
        public string Province { get; set; }
        public string ProvinceName { get; set; }
        public bool IsActive { get; set; }
        public bool IsDelete { get; set; }
        public int Length { get; set; }
        public string Url { get; set; }
        public string provinceCode { get; set; }
        public string CountryCode { get; set; }
        public string CountryName { get; set; }
    }
}
