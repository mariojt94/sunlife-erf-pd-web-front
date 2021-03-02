using ERC.Repository.Repository;
using ERC.Repository.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;

namespace ERC.CMS.Controllers
{
    [Authorize]
    public class ProfilingController : ApiController
    {
        ProfilingRepository repository = new ProfilingRepository();
       // RoleMenuRepository roleRepository = new RoleMenuRepository();
        // GET: Profiling Question
        [Route("api/profiling/GetListProfiling")]
        public IHttpActionResult GetListProfilingQuestion(int page = 1, int rowspPage = 10, string Description = null)
        {
            var data = repository.GetListProfilingQuestion(page, rowspPage, Description);
            return Json(data);
        }

        // GET: Profiling Option
        [Route("api/profiling/GetListProfilingOption")]
        public IHttpActionResult GetListProfilingOption(int page = 1, int rowspPage = 10, string Description = null, int QuestionID = 0)
        {
            var data = repository.GetListProfilingOption(page, rowspPage, Description, QuestionID);
            return Json(data);
        }

        [Route("api/profiling/Submit")]
        [ResponseType(typeof(ProfilingQuetionViewModel))]
        public IHttpActionResult Submit(ProfilingQuetionViewModel data)
        {
            var processResult = new ProcessResult();
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                var isExist = repository.GetProfilingQuetion(data.ID);
               // var access = roleRepository.getAccessMenu(data.Url);
                if (isExist == null)
                {
                    if (string.IsNullOrEmpty(data.Description) || string.IsNullOrWhiteSpace(data.Description))
                    {
                        processResult.message = "Description Harus Diisi !";
                        processResult.isSucceed = false;
                        return Ok(processResult);
                    }
                    if (data.GroupID == 0)
                    {
                        processResult.message = "Group Level Harus Dipilih !";
                        processResult.isSucceed = false;
                        return Ok(processResult);
                    }

                   // if (access != null && access.Add)
                    {
                        var returnId = repository.AddProfilingQuestion(data);
                        processResult.isSucceed = true;
                        processResult.message = "Berhasil Menyimpan Data Baru";
                        processResult.returnValue = Convert.ToString(returnId);
                    }
                    //else
                    {
                        processResult.isSucceed = false;
                        processResult.returnValue = string.Empty;
                        processResult.message = "Anda tidak memiliki ijin untuk menambah data";
                    }
                }
                else
                {
                    if (string.IsNullOrEmpty(data.Description) || string.IsNullOrWhiteSpace(data.Description))
                    {
                        processResult.message = "Description Harus Diisi !";
                        processResult.isSucceed = false;
                        processResult.returnValue = string.Empty;
                        return Ok(processResult);
                    }

                 //   if (access != null && access.Edit)
                    {
                        repository.UpdateProfilingQuestion(data);
                        processResult.isSucceed = true;
                        processResult.message = "Berhasil mengubah data";
                    }
                //    else
                    {
                        processResult.isSucceed = false;
                        processResult.message = "Anda tidak memiliki ijin untuk mengubah data";
                    }
                }
            }
            catch (Exception ex)
            {
                processResult.isSucceed = false;
                processResult.message = ex.Message;
            }

            return Ok(processResult);
        }

        [Route("api/profiling/SubmitProfilingOption")]
        [ResponseType(typeof(ProfilingOptionViewModel))]
        public IHttpActionResult SubmitProfilingOption(ProfilingOptionViewModel data)
        {
            var processResult = new ProcessResult();
            try
            {
                var isExist = repository.GetProfilingOption(data.ID);
                var seqExist = repository.GetprofilingBySequenceID(data.Sequence, data.QuestionId);

                if (isExist == null)
                {
                    if (string.IsNullOrEmpty(data.Description))
                    {
                        processResult.message = "Description Harus Diisi !";
                        processResult.isSucceed = false;
                        return Ok(processResult);
                    }
                    if (data.Sequence == 0)
                    {
                        processResult.message = "Sequence Harus Diisi !";
                        processResult.isSucceed = false;
                        return Ok(processResult);
                    }
                    if (data.Point == 0)
                    {
                        processResult.message = "Point Harus Diisi !";
                        processResult.isSucceed = false;
                        return Ok(processResult);
                    }

                    if (seqExist != null)
                    {
                        processResult.message = "Sequence (" + data.Sequence + ") sudah digunakan !";
                        processResult.isSucceed = false;
                        return Ok(processResult);
                    }
                    repository.AddProfilingOption(data);
                    processResult.isSucceed = true;
                    processResult.message = "Berhasil Menyimpan Data Baru";
                }
                else
                {
                    if (string.IsNullOrEmpty(data.Description))
                    {
                        processResult.message = "Description Harus Diisi !";
                        processResult.isSucceed = false;
                        return Ok(processResult);
                    }
                    if (data.Sequence == 0)
                    {
                        processResult.message = "Sequence Harus Diisi !";
                        processResult.isSucceed = false;
                        return Ok(processResult);
                    }
                    if (data.Point == 0)
                    {
                        processResult.message = "Point Harus Diisi !";
                        processResult.isSucceed = false;
                        return Ok(processResult);
                    }

                    repository.UpdateProfilingOption(data);
                    processResult.isSucceed = true;
                    processResult.message = "Berhasil mengubah data";
                }
            }
            catch (Exception ex)
            {
                processResult.isSucceed = false;
                processResult.message = ex.Message;
            }

            return Ok(processResult);
        }

        [Route("api/profiling/DeleteProfilingQuestion")]
        [HttpPost]
        public string DeleteProfilingQuestion(ProfilingQuetionViewModel data)
        {
            try
            {
                //var access = roleRepository.getAccessMenu(data.Url);
                //if (access != null && access.Delete)
                {
                    repository.DeleteProfilingQuestion(data.ID);
                    return "Berhasil Menghapus Data";
                }
               // else
                {
                    return "Anda tidak memiliki ijin untuk menghapus data";
                }
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        [Route("api/profiling/DeleteProfilingOption")]
        [HttpPost]
        public string DeleteProfilingOption(ProfilingOptionViewModel data)
        {
            try
            {
                repository.DeleteProfilingOption(data.ID);
                return "Berhasil Menghapus Data";
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        [Route("api/profilingAgent/NewHeader")]
        public IHttpActionResult NewHeader(int CandidateId)
        {
            var headerId = 0;
            ProcessResult processResult = new ProcessResult();
            try
            {
                headerId = repository.NewHeader(CandidateId, 0, "-");
                processResult.isSucceed = true;
                processResult.message = "Success";
                processResult.returnValue = headerId.ToString();
            }
            catch (Exception ex)
            {
                processResult.isSucceed = false;
                processResult.message = ex.Message;
            }
            return Ok(processResult);
        }

        [Route("api/profilingAgent/GetQuestion")]
        public IHttpActionResult GetQuestion(int GroupId)
        {
            var data = repository.GetQuestion(GroupId);
            if (data != null)
            {
                foreach (var item in data)
                {
                    item.Option = repository.GetOption(item.ID).ToList();
                }
            }
            return Json(data);
        }

        [Route("api/profilingAgent/GetGroupId")]
        public IHttpActionResult GetGroupId(int CandidateId)
        {
            var data = repository.GetGroupByCandidate(CandidateId);
            return Json(data);
        }

        /*[Route("api/profiling/NextQuestion")]
        public void NextQuestion(HeaderDetailViewModel data)
        {
            try
            {
                var IsUpdate = repository.CekAnswer(data.HeaderId, data.QuestionId);
                var getPoint = repository.GetPoint(Convert.ToInt32(data.OptionId));
                if (IsUpdate == 0)
                {
                    var answerId = repository.InsertAnswer(data.HeaderId, data.QuestionId, data.OptionId, data.QuestionDescription, getPoint);
                    //Insert Ke CandidateProfilingOption
                    //ambil option by question id
                    var ListOption = repository.GetOption(Convert.ToInt32(data.QuestionId));
                    foreach (var itemOption in ListOption)
                    {
                        repository.InsertOption(itemOption, answerId);
                    }
                }
                else
                {
                    repository.UpdateAnswer(data.HeaderId, data.QuestionId, data.OptionId, data.QuestionDescription, getPoint);
                }
            }
            catch (Exception ex)
            {
                var tes = ex.Message;
            }
        }*/

     /*   [Route("api/profilingAgent/UpdateScore")]
        public IHttpActionResult UpdateScore(int HeaderId, int GroupId, int CandidateId)
        {
            var processResult = new ProcessResult();
            try
            {
                var point = 0m;
                point = repository.GetSumPoint(HeaderId);
                //update point header
                //var candidateId = repository
                var recPositionId = repository.GetRecPositionId(point, GroupId);
                repository.UpdateHeader(point, recPositionId, HeaderId);
                var recPosition = "";

                if (recPositionId == 0)
                {
                    recPosition = "NotRecommended";
                    //repository.RejectCandidate(CandidateId);
                    processResult.isSucceed = false;
                    processResult.message = "Candidate Tidak Direkomendasikan";
                }
                else
                {
                    recPosition = repository.GetRecPosition(recPositionId);
                    processResult.isSucceed = true;
                    processResult.message = "";
                }
                processResult.returnValue = point + "#" + recPosition;
            }
            catch (Exception ex)
            {
                processResult.isSucceed = false;
                processResult.message = ex.Message;
            }
            return Ok(processResult);
        }*/

        [Route("api/profiling/GetGroup")]
        public IHttpActionResult GetGroup()
        {
            var data = repository.GetGroup();
            return Json(data);
        }

        [Route("api/profiling/RejectCandidate")]
        public IHttpActionResult RejectCandidate(int CandidateId)
        {
            ProcessResult processResult = new ProcessResult();
            try
            {
                repository.RejectCandidate(CandidateId);
                processResult.isSucceed = true;
                processResult.message = "Berhasil Mereject Kandidat";
            }
            catch (Exception ex)
            {
                processResult.isSucceed = false;
                processResult.message = ex.Message;
            }
            return Ok(processResult);
        }

        [HttpGet]
        [Route("api/profiling/CheckIsRegistered")]
        public IHttpActionResult CheckIsRegistered(string CandidateId)
        {
            ProcessResult processResult = new ProcessResult();
            try
            {
                var isRegistered = repository.IsRegistered(CandidateId);
                var lastscore = new CandidateLevelViewModel();
                if (isRegistered)
                {

                    lastscore = repository.GetProfilingResult(CandidateId);

                }
                processResult.isSucceed = true;
                processResult.message = "";
                processResult.CustomField.Add("IsRegistered", isRegistered);
                processResult.CustomField.Add("Result",lastscore);
            }
            catch (Exception ex)
            {
                processResult.isSucceed = false;
                processResult.message = ex.Message;
            }
            return Ok(processResult);
        }

    }//
}
