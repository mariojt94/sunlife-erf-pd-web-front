using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using ERC.Repository.Repository;
using ERC.Repository.ViewModel;

namespace ERC.CMS.Controllers
{
    [Authorize]
    public class PsikotesController : ApiController
    {
        PsikotesRepository psikotesRepository;

        [Route("api/Psikotes/AddHasilPsikotes")]
        public IHttpActionResult SubmitHasilPsikotes(CandidatePsikotesHasilViewModel data)
        {
            ProcessResult result = new ProcessResult();
            try
            {
                psikotesRepository = new PsikotesRepository();
                psikotesRepository.AddHasilPsikotes(data);

                result.isSucceed = true;
                result.message = "data berhasil disimpan";
            }
            catch (Exception x)
            {
                result.isSucceed = false;
                result.message = x.Message;

                return Ok(result);
            }

            return Ok(result);
        }


        [Route("api/Psikotes/AddJawabanPsikotes")]
        public IHttpActionResult SubmitJawbanPsikotes(CandidatePsikotesJawabanViewModel[] data)
        {
            ProcessResult result = new ProcessResult();
            try
            {
                psikotesRepository = new PsikotesRepository();
                psikotesRepository.AddJawabanPsikotes(data);

                result.isSucceed = true;
                result.message = "data berhasil disimpan";
            }
            catch (Exception x)
            {
                result.isSucceed = false;
                result.message = x.Message;

                return Ok(result);
            }

            return Ok(result);
        }
    }
}