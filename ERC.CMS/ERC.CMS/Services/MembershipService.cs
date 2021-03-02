using ERC.Repository.Repository;
using ERC.Repository.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace ERC.CMS.Services
{
    public class MembershipService
    {
        public MembershipContext ValidateUser(string username, string password)
        {
            username = AesDecrypt.DecryptStringAES(username);
            password = AesDecrypt.DecryptStringAES(password);
            var membershipContext = new MembershipContext();

            var userRepository = new UserRepository();

            var user = userRepository.GetUser(username);

            var passwordValid = isPasswordValid(user, password);

            if (user != null && passwordValid) 
            {
                var roles = new string[] { user.RoleName };

                membershipContext.User = user;

                var identity = new GenericIdentity(user.LoginName);

                membershipContext.Principal = new GenericPrincipal(identity, roles);
            }
            else if (user != null && !passwordValid)
            {
                //update wrong password
                
            }
            //disini update login log
/*            LoginHistoryRepository loginRepo = new LoginHistoryRepository();
            loginRepo.SetLogHistoryLogin(user.LoginName, passwordValid.ToString());*/

            return membershipContext;
        }

        private bool isPasswordValid(UserViewModel user, string password)
        {
            return String.Equals(RijndaelManagedEncryption.DecryptRijndael(user.Password), password);
        }

        public bool IsLocked(string username)
        {
            var userRepository = new UserRepository();
            return userRepository.IsLocked(username);
        }
    }
}