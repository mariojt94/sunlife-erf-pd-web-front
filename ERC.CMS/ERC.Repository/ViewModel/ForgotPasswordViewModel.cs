using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERC.Repository.ViewModel
{
    public class ForgotPasswordViewModel : BaseViewModel
    {
        //coba dulu, ini sebenernya udah ada di userviewmodel
        public string Id { get; set; }
        public string LoginName { get; set; }
        public string Email { get; set; }
        public byte IsActive { get; set; }
        public string Link { get; set; }
        public DateTime CreateDate { get; set; }
        public DateTime ConfirmDate { get; set; }
    }
}
