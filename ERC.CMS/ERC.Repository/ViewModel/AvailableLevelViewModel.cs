using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERC.Repository.ViewModel
{
    public class AvailableLevelViewModel
    {
        public int Id { get; set; }
        public string RoleName { get; set; }
        public int MinimumScore { get; set; }
        public string Status { get; set; }

        //additional untuk add contact
        public int GroupId { get; set; }
        public string GroupName { get; set; }

        //additional utuk perbandingan hirarki level di add rectuitmentform
        public int HierarkiLevel { get; set; }

    }
}
