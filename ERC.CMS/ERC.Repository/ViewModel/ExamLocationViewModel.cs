using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERC.Repository.ViewModel
{
    public class ExamLocationViewModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string CityId { get; set; }
        public string CityCode { get; set; }
        public string CityName { get; set; }
        public int Capacity { get; set; }
        public int RegisteredUser { get; set; }
        public string ExamType { get; set; }
        public bool IsActive { get; set; }
        public bool IsDelete { get; set; }
        public int Length { get; set; }

        public string Url { get; set; }

    }

    public class ExamLocationViewModelMobile
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string CityId { get; set; }
        public string CityCode { get; set; }
        public string CityName { get; set; }
        public int Capacity { get; set; }
        public string ExamType { get; set; }
        public bool IsActive { get; set; }
        public bool IsDelete { get; set; }
        public int Length { get; set; }

        public string Url { get; set; }

    }
}
