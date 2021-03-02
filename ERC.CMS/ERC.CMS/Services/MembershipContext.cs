using ERC.Repository.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace ERC.CMS.Services
{
    public class MembershipContext
    {
        public IPrincipal Principal { get; set; }
        public UserViewModel User { get; set; }
        public bool IsValid { get; set; }
        public string ErrorMessage { get; set; }
    }
}