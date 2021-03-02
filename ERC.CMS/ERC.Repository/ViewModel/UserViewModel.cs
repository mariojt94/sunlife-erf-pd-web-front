using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERC.Repository.ViewModel
{
    public class TrainingViewModel
    {
        public string Temporary { get; set; }
        public string AgentCode { get; set; }
        public string GSGCode { get; set; }
        public string DatePassed { get; set; }
        public string AgentLocation { get; set; }
    }
    public class UserRoleViewModel : UserViewModel
    {
        public List<MenuViewModel> ListMenu { get; set; }
    }
    public class UserViewModel : BaseViewModel
    {
        public string Id { get; set; }
        public string LoginName { get; set; }
        public string DisplayName { get; set; }
        public string NamaDepan { get; set; }
        public string NamaBelakang { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
        public int RoleID { get; set; }
        public string RoleName { get; set; }
        public string AgentCode { get; set; }
        public string PhoneNo { get; set; }
        public string Gender { get; set; }
        public string SourceCandidate { get; set; }
        public string ManagerLoginName { get; set; }
        public string SeniorManagerLoginName { get; set; }
        public int Length { get; set; }
        public bool IsSubmittedPDF { get; set; }
        public string RejectBy { get; set; }
        public bool AllLeaderApproved { get; set; }

        //untuk di profile
        public string RefName { get; set; }

        public string DirectorLoginName { get; set; }
        public string TeamId { get; set; }

        public DateTime JoinDate { get; set; }
        public string JoinDateDisplay { get; set; }
        public string LastLoginDateDisplay { get; set; }
        public string NoKTP { get; set; }
        public DateTime BirthDate { get; set; }
        public byte IsActive { get; set; }
        public bool IsDeleted { get; set; }
        public string Photo { get; set; }
        public bool? IsPD { get; set; }

        //additional property for Change Password
        public string InputOldPassword { get; set; }
        public string InputNewPassword { get; set; }
        public string InputConfirmationNewPassword { get; set; }

        //for forget password
        public string Link { get; set; }
        public DateTime CreateDate { get; set; }
        public DateTime ConfirmDate { get; set; }
        public int WrongPassword { get; set; }
        public int BusinessTypeId { get; set; }
        public string BusinessTypeName { get; set; }
        public string TeamCode { get; set; }
        public string TeamName { get; set; }
        public string LocationName { get; set; }
        public string LocationCode { get; set; }

        public string HiringDate { get; set; }
        public string StatusEffective { get; set; }
        //for acces
        public string Url { get; set; }
        public string Status { get; set; }
        public bool PemilikKPM { get; set; }

    }

    public class ApprovalHierarkiManagementViewModel
    {
        public int Id { get; set; }
        public string LocationCode { get; set; }
        public string ApproveCode { get; set; }
        public int Sequence { get; set; }
        public int LevelId { get; set; }
        public bool IsActive { get; set; }
        public bool IsDelete { get; set; }
    }
}
