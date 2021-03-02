using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Configuration;
using System.Web.Http;
using ERC.Repository.Repository;
using ERC.Repository.ViewModel;

namespace ERC.CMS.Controllers
{
   
    public class ProfileController : ApiController
    {
        UserRepository userRepository;


        [Route("api/Profile/GetAccountForProfile")]
        public IHttpActionResult GetAccountForProfile(string loginName)
        {
            userRepository = new UserRepository();

            var data = userRepository.GetAccountForProfile(loginName);
            return Json(data);
        }

        [Route("api/Profile/GetProfilePicture")]
        public IHttpActionResult GetProfilePicture(string loginName)
        {
            userRepository = new UserRepository();

            var data = userRepository.GetProfilePicture(loginName);
            if (data != null)
            {
                data.Path = WebConfigurationManager.AppSettings["WebSharedFolderURL"] + data.FileName;
            }

            return Json(data);
        }

        [HttpPost]
        [Route("api/Profile/UpdateAccountProfile")]
        public IHttpActionResult UpdateAccountForProfile(UserViewModel dataUser)
        {
            ProcessResult result = new ProcessResult();
            try
            {
                userRepository = new UserRepository();
                userRepository.UpdateAccountProfile(dataUser);

                result.isSucceed = true;
                result.message = "Berhasil mengubah data Profil";
               // return Json(dataUser);
                return Ok(result);
            }
            catch (Exception ex)
            {
                result.isSucceed = false;
                result.message = ex.Message;
                return Ok(result);
            }

        }
    }
}