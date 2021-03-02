using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Http.Description;
using System.Web.Script.Serialization;
using ERC.Repository.Repository;
using ERC.Repository.ViewModel;

namespace ERC.CMS.Controllers
{
    public class RecruiterController : ApiController
    {
        JavaScriptSerializer serializer = new JavaScriptSerializer();
        RecruiterRepository repository;

        // (sudah OK)
        [Route("api/recruiter/GetAll")]
        [ResponseType(typeof(RecruiterViewModel))]
        public IHttpActionResult GetAll()
        {
            repository = new RecruiterRepository();
            var roles = repository.GetAllRecruiter();
            /*foreach (var a in roles)
            {
                a.UpdateResubmitDate = 
            }*/
            return Json(roles);
        }

        // (sudah OK)
        [Route("api/recruiter/GetAll2")]
        [ResponseType(typeof(RecruiterViewModel))]
        public IHttpActionResult GetAll2()
        {
            repository = new RecruiterRepository();
            var roles = repository.GetAllRecruiter2();
            /*foreach (var a in roles)
            {
                a.UpdateResubmitDate = 
            }*/
            return Json(roles);
        }
        

        // (sudah OK)
        [Route("api/recruiter/GetOne")]
        [ResponseType(typeof(RecruiterViewModel))]
        public IHttpActionResult GetOneRecruterByIdControl(int id)
        {
            var repository = new RecruiterRepository();
            var result = repository.GetRecruiterById(id);
            if (result == null)
            {
                return NotFound();
            }
            //return Ok(serializer.Serialize(result));
            return Json(result);
        }

        // (sudah OK)
        [Route("api/recruiter/UpdateRecruiter")]
        [ResponseType(typeof(RecruiterViewModel))]
        [HttpPost]
        public IHttpActionResult UpdateRecruiterControl(RecruiterViewModel model)
        {
            var processResult = new ProcessResult();

            try
            {
                var repository = new RecruiterRepository();

                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                if (string.IsNullOrEmpty(model.Name))
                {
                    processResult.message = "Name must be filled !";
                    processResult.isSucceed = false;
                    return Ok(processResult);
                }

                repository.UpdateRecruiter(model);

                processResult.message = "Data has been updated!";
                processResult.isSucceed = true;
                return Ok(processResult);
            }
            catch (Exception ex)
            {
                processResult.message = ex.Message;
                processResult.isSucceed = false;
                return Ok(processResult);
            }
        }

        [Route("api/recruiter/UpdateRecruiterApproveReject")]
        [ResponseType(typeof(RecruiterViewModel))]
        [HttpPost]
        public IHttpActionResult UpdateRecruiterApproveRejectControl(RecruiterViewModel model)
        {
            var processResult = new ProcessResult();

            try
            {
                var repository = new RecruiterRepository();

                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                if (string.IsNullOrEmpty(model.Name))
                {
                    processResult.message = "Name must be filled !";
                    processResult.isSucceed = false;
                    return Ok(processResult);
                }

                repository.UpdateRecruiterApproveReject(model);

                processResult.message = "Data has been updated!";
                processResult.isSucceed = true;
                return Ok(processResult);
            }
            catch (Exception ex)
            {
                processResult.message = ex.Message;
                processResult.isSucceed = false;
                return Ok(processResult);
            }
        }

    }
}