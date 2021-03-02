using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using ERC.Repository.Repository;
using ERC.Repository.ViewModel;

namespace ERC.CMS.Controllers
{
    [Authorize]
    public class MenuController : ApiController
    {
        MenuRepository _menuRepository;
        ProcessResult _processResult;

        [Route("api/Menu/GetListMenu")]
        public IHttpActionResult GetListMenu(int page = 1, int rowspPage = 10, string Title = null)
        {
            _menuRepository = new MenuRepository();
            var data = _menuRepository.GetListMenu(page, rowspPage, Title);
            return Json(data);
        }

        [Route("api/Menu/Submit")]
        public IHttpActionResult Submit(MenuViewModel data)
        {
            _processResult = new ProcessResult();
            _menuRepository = new MenuRepository();
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                if (string.IsNullOrEmpty(data.Icon) || string.IsNullOrWhiteSpace(data.Icon))
                {
                    _processResult.message = "Tampilan Icon Harus Diisi!";
                    _processResult.isSucceed = false;
                    return Ok(_processResult);
                }
                if (string.IsNullOrEmpty(data.Title) || string.IsNullOrWhiteSpace(data.Title))
                {
                    _processResult.message = "Tampilan Title Harus Diisi!";
                    _processResult.isSucceed = false;
                    return Ok(_processResult);
                }
                _menuRepository.UpdateMenu(data);
                _processResult.isSucceed = true;
                _processResult.message = "Berhasil mengubah data Menu !";

            }
            catch (Exception ex)
            {
                _processResult.isSucceed = false;
                _processResult.message = ex.Message;
            }

            return Ok(_processResult);
        }
    }
}