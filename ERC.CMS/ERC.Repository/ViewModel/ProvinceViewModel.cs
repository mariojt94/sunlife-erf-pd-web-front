using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERC.Repository.ViewModel
{
    public class ProvinceViewModel
    {
        public int Id { get; set; }
        public string ProvinceCode { get; set; }
        public string ProvinceName { get; set; }
        public string CountryCode { get; set; }
        public string CountryName { get; set; }
        public bool IsActive { get; set; }
        public bool IsDelete { get; set; }
        public int Length { get; set; }
    }
}
