using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using ERC.Repository.Repository;
using ERC.Repository.ViewModel;
using System.Text;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Spreadsheet;
using DocumentFormat.OpenXml;
using System.Text.RegularExpressions;
using ERC.Repository.Helper;

namespace ERC.CMS.Controllers
{
    [Authorize]
    public class ProvinceController : ApiController
    {
        ProvinceRepository _provinceRepository;
        ProcessResult _processResult;
        ReadExcelHelper readXHelper = new ReadExcelHelper();
        
        [Route("api/Province/GetProvince")]
        public IHttpActionResult GetProvince()
        {
            _provinceRepository = new ProvinceRepository();
            var data = _provinceRepository.GetProvince();
            return Json(data);
        }

        [Route("api/Province/GetProvinceName")]
        public IHttpActionResult GetProvinceName()
        {
            _provinceRepository = new ProvinceRepository();
            var data = _provinceRepository.GetProvinceName();
            return Json(data);
        }

        [Route("api/Province/GetListProvince")]
        public IHttpActionResult GetListProvince(int page = 1, int rowspPage = 10, string ProvinceCode = null, string ProvinceName = null, string CountryCode = null)
        {
            _provinceRepository = new ProvinceRepository();
            if (page <= 0)
                page = 1;
            var data = _provinceRepository.GetListProvince(page, rowspPage, "%" + ProvinceCode + "%", "%" + ProvinceName + "%", "%" + CountryCode + "%");
            return Json(data);
        }

     /*   [Route("api/Province/Submit")]
        //[ResponseType(typeof(Faq))]
        public IHttpActionResult Submit(ProvinceViewModel data)
        {
            _provinceRepository = new ProvinceRepository();
            CountryRepository _countryRepository = new CountryRepository();
            _processResult = new ProcessResult();
            try
            {
                if (!ModelState.IsValid || data == null)
                {
                    return BadRequest(ModelState);
                }
                if (string.IsNullOrEmpty(data.ProvinceCode) || string.IsNullOrWhiteSpace(data.ProvinceCode))
                {
                    _processResult.message = "Tampilan Kode Provinsi Harus Diisi!";
                    _processResult.isSucceed = false;
                    return Ok(_processResult);
                }
                if (string.IsNullOrEmpty(data.ProvinceName) || string.IsNullOrWhiteSpace(data.ProvinceName))
                {
                    _processResult.message = "Tampilan Nama Provinsi Harus Diisi!";
                    _processResult.isSucceed = false;
                    return Ok(_processResult);
                }
                if (string.IsNullOrEmpty(data.CountryCode) || string.IsNullOrWhiteSpace(data.CountryCode))
                {
                    _processResult.message = "Tampilan Kode Region Harus Diisi!";
                    _processResult.isSucceed = false;
                    return Ok(_processResult);
                }
                else
                {
                    var isValidCountry = _countryRepository.GetCountryByCountryCode(data.CountryCode);
                    if (isValidCountry.ToList().Count == 0)
                    {
                        _processResult.isSucceed = false;
                        _processResult.message = "Kode Region Tidak Valid !";
                        return Ok(_processResult);
                    }
                }

                if (data.Id == 0)
                {
                    var isExist = _provinceRepository.GetProvince(data);
                    if (isExist == null)
                    {
                        _provinceRepository.AddProvince(data);
                        _processResult.isSucceed = true;
                        _processResult.message = "Berhasil Menyimpan Provinsi Baru !";
                    }
                    else
                    {
                        _processResult.isSucceed = false;
                        _processResult.message = "Data sudah ada !";
                    }
                }
                else
                {
                    _provinceRepository.UpdateProvince(data);
                    _processResult.isSucceed = true;
                    _processResult.message = "Berhasil Merubah Provinsi !";
                }


            }
            catch (Exception ex)
            {
                _processResult.isSucceed = false;
                _processResult.message = ex.Message;
            }

            return Ok(_processResult);
        }*/

        [Route("api/Province/DeleteProvince")]
        [HttpPost]
        public string DeleteLocation(ProvinceViewModel data)
        {
            _provinceRepository = new ProvinceRepository();
            try
            {
                _provinceRepository.DeleteProvince(data);

                return "Data provinsi sudah berhasil di hapus !";
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

      /*  [Route("api/Province/Import")]
        [HttpPost]
        public IHttpActionResult ImportData()
        {
            _provinceRepository = new ProvinceRepository();
            CountryRepository _countryRepository = new CountryRepository();
            var processResult = new ProcessResult();
            StringBuilder listError = new StringBuilder();
            StringBuilder listWarning = new StringBuilder();
            try
            {
                System.Web.HttpFileCollection hfc = System.Web.HttpContext.Current.Request.Files;
                if (hfc.Count == 0)
                {
                    processResult.message = "File belum diupload";
                    processResult.isSucceed = false;
                    return Ok(processResult);
                }

                System.Web.HttpPostedFile hpf = hfc[0];

                //validate file extension
                string fileExtension = System.IO.Path.GetExtension(hpf.FileName);
                if (fileExtension.ToLower() != ".xlsx")
                {
                    processResult.message = "Format file harus dalam format .xlsx";
                    processResult.isSucceed = false;
                    return Ok(processResult);
                }

                if (hpf.ContentLength > 0)
                {
                    using (SpreadsheetDocument doc = SpreadsheetDocument.Open(hpf.InputStream, false)) //add reference WindowsBase
                    {
                        WorkbookPart workBookPart = doc.WorkbookPart;

                        IEnumerable<Sheet> sheets = workBookPart.Workbook.Descendants<Sheet>();
                        Sheet sheet = sheets.First();

                        WorksheetPart workSheet = ((WorksheetPart)workBookPart.GetPartById(sheet.Id));
                        string rowNum;
                        using (OpenXmlReader reader = OpenXmlReader.Create(workSheet))
                        {
                            while (reader.Read())
                            {
                                if (reader.ElementType == typeof(Row))
                                {
                                    do
                                    {
                                        if (reader.HasAttributes)
                                        {
                                            rowNum = reader.Attributes.First(a => a.LocalName == "r").Value;
                                            if (Convert.ToInt32(rowNum) > 4)
                                            {
                                                Row r = (Row)reader.LoadCurrentElement();
                                                List<string> DataRows = new List<string>();
                                                var cellEnumerator = readXHelper.GetExcelCellEnumerator(r);

                                                while (cellEnumerator.MoveNext())
                                                {
                                                    var cell = cellEnumerator.Current;
                                                    var value = readXHelper.ReadExcelCell(cell, workBookPart).Trim();
                                                    DataRows.Add(value);
                                                }
                                                try
                                                {
                                                    var model = new ProvinceViewModel();
                                                    var LocationId = DataRows[0];
                                                    if (!string.IsNullOrEmpty(LocationId))
                                                    {
                                                        //Regex regex = new Regex("^[0-9]+$");
                                                        //if (DataRows[0].ToString().Length > 50)
                                                        //{
                                                        //    listError.Append("ERROR ON CELL " + rowNum + ": Location Id Level Max 50 Char || ");
                                                        //}
                                                        if (string.IsNullOrEmpty(DataRows[0].ToString()))
                                                        {
                                                            listError.Append("ERROR ON CELL " + rowNum + ": Province Code tidak boleh kosong  || ");
                                                        }
                                                        if (string.IsNullOrEmpty(DataRows[1].ToString()))
                                                        {
                                                            listError.Append("ERROR ON CELL " + rowNum + ": Province Name tidak boleh kosong || ");
                                                        }
                                                        if (string.IsNullOrEmpty(DataRows[2].ToString()))
                                                        {
                                                            listError.Append("ERROR ON CELL " + rowNum + ": Country Code tidak boleh kosong || ");
                                                        }
                                                        else
                                                        {
                                                            var isValidCountry = _countryRepository.GetCountryByCountryCode(DataRows[2]);
                                                            if (isValidCountry.ToList().Count == 0)
                                                            {
                                                                listWarning.Append("\nWARNING ON CELL " + rowNum + ": Invalid Country Code ");
                                                            }
                                                        }


                                                        if (listError.Length <= 0)
                                                        {
                                                            model.ProvinceCode = DataRows[0];
                                                            model.ProvinceName = DataRows[1];
                                                            model.CountryCode = DataRows[2];
                                                            model.IsActive = true;
                                                            model.IsDelete = false;
                                                            var dataExist = _provinceRepository.GetProvinceByProvinceCode(DataRows[0], DataRows[2]);

                                                            var isValidCountry = _countryRepository.GetCountryByCountryCode(DataRows[2]);
                                                            if (isValidCountry.ToList().Count != 0)
                                                            {
                                                                if (dataExist.ToList().Count == 0)
                                                                {
                                                                    _provinceRepository.AddProvince(model);
                                                                }
                                                                else
                                                                {
                                                                    _provinceRepository.UpdateProvinceOnUpload(model);
                                                                }
                                                            }


                                                        }
                                                    }
                                                }
                                                catch (Exception ex)
                                                {
                                                }
                                            }
                                        }
                                    } while (reader.ReadNextSibling());
                                    break;
                                }
                            }
                        }
                    }
                }

                if (!string.IsNullOrEmpty(listError.ToString()))
                {
                    processResult.message = listError.ToString();
                    processResult.isSucceed = false;
                }
                else
                {
                    processResult.message = "Files Uploaded Successfully";
                    if (!string.IsNullOrEmpty(listWarning.ToString()))
                    {
                        processResult.message += listWarning.ToString();
                    }
                    processResult.isSucceed = true;
                }
            }
            catch (Exception ex)
            {
                processResult.message = ex.Message;
                return Ok(processResult);
            }
            return Ok(processResult);
        }
*/

    }
}