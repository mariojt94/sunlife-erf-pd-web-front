using ERC.Repository.Repository;
using ERC.Repository.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;

namespace ERC.CMS.Controllers
{
    [Authorize]
    public class CandidateStatusController : ApiController
    {
        CandidateStatusRepository _candidateStatusRepository;
        ProcessResult _processResult;

        [Route("api/CandidateStatus/AddManagerApproval")]
        public IHttpActionResult AddManagerApproval(CandidateStatusViewModel data)
        {
            _candidateStatusRepository = new CandidateStatusRepository();
            _processResult = new ProcessResult();
            try
            {
                data.Date = DateTime.Now;
                _candidateStatusRepository.AddManagerApproval(data);
                _processResult.isSucceed = true;
                _processResult.message = "Data Activity Contact Log [" + data.Status + "] berhasil di simpan !";

            }
            catch (Exception e)
            {
                _processResult.isSucceed = true;
                _processResult.message = e.ToString();
            }
            return Ok(_processResult);
        }
    }
}