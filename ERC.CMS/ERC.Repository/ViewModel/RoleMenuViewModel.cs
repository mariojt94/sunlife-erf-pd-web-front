using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERC.Repository.ViewModel
{
    public class GroupMenuViewModel
    {
        public int Id { get; set; }
        public int GroupId { get; set; }
        public string GroupName { get; set; }
        public int MenuId { get; set; }
        public string MenuName { get; set; }
        public bool View { get; set; }
        public bool Add { get; set; }
        public bool Edit { get; set; }
        public bool Delete { get; set; }

        public bool IsActive { get; set; }
        public bool IsDelete { get; set; }
        public int Length { get; set; }

        //additional untuk menampilkan halaman
        public string Url { get; set; }
    }

    public class RoleMenuViewModel
    {
        public int Id { get; set; }
        public int RoleId { get; set; }
        public string RoleName { get; set; }
        public int MenuId { get; set; }
        public string MenuName { get; set; }
        public bool View { get; set; }
        public bool Add { get; set; }
        public bool Edit { get; set; }
        public bool Delete { get; set; }

        public bool IsActive { get; set; }
        public bool IsDelete { get; set; }
        public int Length { get; set; }

        //additional untuk menampilkan halaman
        public string Link { get; set; }
    }
}
