using ERC.Repository.Helper;
using ERC.Repository.Repository;
using ERC.Repository.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace ERC.CMS.Controllers
{
    [Authorize]
    public class GlobalConfigurationController : ApiController
    {
        GlobalConfigurationRepository repository = new GlobalConfigurationRepository();
        ProcessResult processResult = new ProcessResult();
        ReadExcelHelper readXHelper = new ReadExcelHelper();
       // RoleMenuRepository roleMenuRepository = new RoleMenuRepository();

        [Route("api/GlobalConfiguration/GetList")]
        public IHttpActionResult GetListGlobalConfiguration(int page = 1, int rowspPage = 10, string Keyword = null)
        {
            var data = repository.GetListGlobalConfiguration(page, rowspPage, Keyword);
            return Json(data);
        }

        [Route("api/GlobalConfiguration/Submit")]
        public IHttpActionResult Submit(GlobalConfigurationViewModel data)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

               // var access = roleMenuRepository.getAccessMenu(data.Url);

                if (string.IsNullOrEmpty(data.Keyword) || string.IsNullOrWhiteSpace(data.Keyword))
                {
                    processResult.isSucceed = false;
                    processResult.message = "Kata Kunci Harus Diisi";
                    return Ok(processResult);
                }

                if (string.IsNullOrEmpty(data.KeyGroup) || string.IsNullOrWhiteSpace(data.KeyGroup))
                {
                    processResult.isSucceed = false;
                    processResult.message = "Grup Harus Diisi";
                    return Ok(processResult);
                }

                if (string.IsNullOrEmpty(data.Value) || string.IsNullOrWhiteSpace(data.Value))
                {
                    processResult.isSucceed = false;
                    processResult.message = "Nilai Harus Diisi";
                    return Ok(processResult);
                }

                var isExist = repository.GetDataByKeyword(data.Keyword);
                if (isExist == null)
                {
                    repository.AddNew(data);
                    processResult.isSucceed = true;
                    processResult.message = "Berhasil Menyimpan Data Baru";
                }
                else
                {
                    repository.Update(data);
                    processResult.isSucceed = true;
                    processResult.message = "Berhasil Mengubah Data";
                }
            }
            catch (Exception ex)
            {
                processResult.isSucceed = false;
                processResult.message = ex.Message;
            }
            return Ok(processResult);
        }


        [Route("api/GlobalConfiguration/Delete")]
        [HttpPost]
        public string Delete(GlobalConfigurationViewModel data)
        {
            try
            {
                repository.Delete(data);
                return "Data Berhasil Dihapus";
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

    }
}
