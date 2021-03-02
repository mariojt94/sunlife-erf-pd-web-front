using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using ERC.Repository.Repository;
using ERC.Repository.ViewModel;
using System.Text;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Spreadsheet;
using DocumentFormat.OpenXml;
using ERC.Repository.Helper;

namespace ERC.CMS.Controllers
{
    [Authorize]
    public class CityController : ApiController
    {
        CityRepository cityRepository = new CityRepository();
        ProcessResult _processResult;
       // RoleMenuRepository _roleMenuRepository;
        ProcessResult processResult = new ProcessResult();
        ReadExcelHelper readXHelper = new ReadExcelHelper();

        [Route("api/City/GetCity")]
        public IHttpActionResult GetCity()
        {
            var data = cityRepository.GetCity();
            return Json(data);
        }

        [Route("api/City/GetListCity")]
        public IHttpActionResult GetListCity(int page = 1, int rowspPage = 10, string citycode = null, string name = null, string province = null)
        {
            var data = cityRepository.GetListCity(page, rowspPage, citycode, name, province);
            return Json(data);
        }

        [Route("api/City/Submit")]
        public IHttpActionResult Submit(CityViewModel data)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                //jagain 
                _processResult = new ProcessResult();
              //  _roleMenuRepository = new RoleMenuRepository();
              //  var access = _roleMenuRepository.getAccessMenu(data.Url);
                var isDuplicate = cityRepository.GetCityByCode(data);


                if (data.Name == "" || string.IsNullOrWhiteSpace(data.Name))
                {
                    _processResult.message = "Tampilan Kota Harus Diisi!";
                    _processResult.isSucceed = false;
                    return Ok(_processResult);
                }
                if (string.IsNullOrEmpty(data.ProvinceName) || string.IsNullOrWhiteSpace(data.ProvinceName))
                {
                    _processResult.message = "Tampilan Provinsi Harus Diisi!";
                    _processResult.isSucceed = false;
                    return Ok(_processResult);
                }


                if (string.IsNullOrEmpty(data.CityCode.ToString()))
                {
                    _processResult.message = "Tampilan Kota Harus Diisi!";
                    _processResult.isSucceed = false;
                    return Ok(_processResult);
                }
                else
                {
                    if (isDuplicate != null && isDuplicate.IsDelete == false && data.Id == 0)
                    {
                        _processResult.message = "Kode Kota sudah digunakan!";
                        _processResult.isSucceed = false;
                        return Ok(_processResult);
                    }
                }

                var isExist = cityRepository.GetCity(data);

                if (isExist == null)
                {
              //      if (access != null && access.Add)
                    {
                        if (isDuplicate != null && isDuplicate.IsDelete == true)
                        {
                            data.Id = isDuplicate.Id;
                            data.IsActive = true;
                            data.IsDelete = false;
                            cityRepository.UpdateCity(data);
                        }
                        else
                        {
                            cityRepository.AddCity(data);
                        }

                        _processResult.isSucceed = true;
                        _processResult.message = "Berhasil Menyimpan Kota Baru !";
                    }
            //        else
                    {
                        _processResult.message = "Anda tidak diizinkan menambah data Kota !";
                        _processResult.isSucceed = false;
                    }

                }
                else
                {

              //      if (access != null && access.Edit)
                    {
                        cityRepository.UpdateCity(data);
                        _processResult.isSucceed = true;
                        _processResult.message = "Berhasil mengubah data Kota !";
                    }
             //       else
                    {
                        _processResult.message = "Anda tidak diizinkan mengubah data Kota !";
                        _processResult.isSucceed = false;
                    }

                }
            }
            catch (Exception ex)
            {
                _processResult.isSucceed = false;
                _processResult.message = ex.Message;
            }

            return Ok(_processResult);
        }

        [Route("api/City/Import")]
        [HttpPost]
        public IHttpActionResult ImportData()
        {
            var processResult = new ProcessResult();
            StringBuilder listError = new StringBuilder();
            var provinceRepository = new ProvinceRepository();
            var provinceViewModel = new ProvinceViewModel();
            try
            {
                System.Web.HttpFileCollection hfc = System.Web.HttpContext.Current.Request.Files;
                if (hfc.Count == 0)
                {
                    processResult.message = "File belum diupload";
                    processResult.isSucceed = false;
                    return Ok(processResult);
                }


           //     _roleMenuRepository = new RoleMenuRepository();
         //       var access = _roleMenuRepository.getAccessMenu("#!/city");

           //     if (access == null || !access.Add && !access.Edit)
                {
                    processResult = new ProcessResult();
                    processResult.message = "Anda tidak memiliki ijin untuk mengupload data";
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

                //if (hpf.FileName.ToLower() != "city.xlsx")
                //{
                //    _processResult = new ProcessResult();
                //    _processResult.message = "Pastikan nama file yang diupload sesuai dengan menu upload yang dipilih => (City.xlsx).";
                //    _processResult.isSucceed = false;
                //    return Ok(_processResult);
                //}

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
                                            if (Convert.ToInt32(rowNum) > 1)
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
                                                    var model = new CityViewModel();
                                                    var description = DataRows[0];
                                                    cityRepository = new CityRepository();
                                                    StringBuilder currentListError = new StringBuilder();
                                                    if (!string.IsNullOrEmpty(description))
                                                    {
                                                        if (DataRows[0] == null || string.IsNullOrEmpty(DataRows[0].ToString()) || string.IsNullOrWhiteSpace(DataRows[0].ToString()))
                                                            currentListError.Append("\nERROR ON CELL " + rowNum + ": Kode Kota Harus Diiisi ");
                                                        if (DataRows[1] == null || string.IsNullOrEmpty(DataRows[1].ToString()) || string.IsNullOrWhiteSpace(DataRows[1].ToString()))
                                                            currentListError.Append("\nERROR ON CELL " + rowNum + ": Nama Kota Harus Diiisi");
                                                        if (DataRows[2] == null || string.IsNullOrEmpty(DataRows[2].ToString()) || string.IsNullOrWhiteSpace(DataRows[2].ToString()))
                                                        {
                                                            currentListError.Append("\nERROR ON CELL " + rowNum + ": Kode Provinsi Harus Diisi ");
                                                        }
                                                        else if (DataRows[3] == null || string.IsNullOrEmpty(DataRows[2].ToString()) || string.IsNullOrWhiteSpace(DataRows[2].ToString()))
                                                        {
                                                            currentListError.Append("\nERROR ON CELL " + rowNum + ": Nama Provinsi Harus Diiisi ");
                                                        }
                                                        else if (DataRows[4] == null || string.IsNullOrEmpty(DataRows[4].ToString()) || string.IsNullOrWhiteSpace(DataRows[4].ToString()))
                                                        {
                                                            currentListError.Append("\nERROR ON CELL " + rowNum + ": Kode Negara Harus Diiisi ");
                                                        }
                                                        else if (DataRows[5] == null || string.IsNullOrEmpty(DataRows[5].ToString()) || string.IsNullOrWhiteSpace(DataRows[5].ToString()))
                                                        {
                                                            currentListError.Append("\nERROR ON CELL " + rowNum + ": Nama Negara Harus Diiisi ");
                                                        }
                                                        else
                                                        {
                                                            string KodeKota = DataRows[0];
                                                            string NamaKota = DataRows[1];
                                                            string KodeProvinsi = DataRows[2];
                                                            string NamaProvinsi = DataRows[3];
                                                            string KodeNegara = DataRows[4];
                                                            string NamaNegara = DataRows[5];

                                                          /*  CountryRepository countryRepo = new CountryRepository();
                                                            var dataCountry = new CountryViewModel() { CountryCode = KodeNegara, CountryName = NamaNegara, IsActive = true, IsDelete = false };
                                                            var dataC = countryRepo.GetCountryByCode(dataCountry);
                                                            if (dataC == null)
                                                            {
                                                                countryRepo.AddNewCountry(dataCountry);
                                                            }*/

                                                            ProvinceRepository provinceRepo = new ProvinceRepository();
                                                            var dataProvince = new ProvinceViewModel() { ProvinceCode = KodeProvinsi, ProvinceName = NamaProvinsi, CountryCode = KodeNegara, CountryName = NamaNegara, IsActive = true, IsDelete = false  };
                                                            var dataP = provinceRepo.GetProvinceByProvinceCode(dataProvince);
                                                            if (dataP == null)
                                                            {
                                                                provinceRepo.AddProvince(dataProvince);
                                                            }

                                                            CityRepository cityRepo = new CityRepository();
                                                            var dataCity = new CityViewModel() { CityCode = KodeKota, Name = NamaKota, provinceCode = KodeProvinsi, IsActive = true, IsDelete = false };
                                                            var dataCi = cityRepo.GetCityByCode(dataCity);
                                                            if (dataCi == null)
                                                            {
                                                                cityRepo.AddCity(dataCity);
                                                            }
                                                            else
                                                            {
                                                                //currentListError.Append("\nERROR ON CELL " + rowNum + ": City Code (" + DataRows[0] + ")  sudah ada didatabase ");
                                                                cityRepo.UpdateCity(dataCity);
                                                            }
                                                        }
                                                    }
                                                    else
                                                    {
                                                        currentListError.Append("\nERROR ON CELL " + rowNum + ": Kode Kota Harus Diiisi ");
                                                        listError.Append(currentListError);
                                                        break;
                                                    }
                                                    listError.Append(currentListError);
                                                }
                                                catch (Exception ex)
                                                {
                                                    string message = ex.Message;
                                                    string undefinedColumn = "Index was out of range";
                                                    var result = message.Contains(undefinedColumn);
                                                    if (result)
                                                    {
                                                        listError.Append("\nTerdapat beberapa kolom yang tidak sesuai template");
                                                    }
                                                    else
                                                    {
                                                        listError.Append(ex.Message);
                                                    }
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
                    processResult.message += listError.ToString();
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

        [Route("api/City/DeleteCity")]
        //[ResponseType(typeof(CityViewModel))]
        [HttpPost]
        public IHttpActionResult DeleteCity(CityViewModel data)
        {
            try
            {
                _processResult = new ProcessResult();
         //       _roleMenuRepository = new RoleMenuRepository();
        //        var access = _roleMenuRepository.getAccessMenu(data.Url); //link url yang sedang active
        //        if (access.Delete == false)
                {
                    _processResult.message = "Anda tidak diizinkan untuk menghapus data Kota !";
                    _processResult.isSucceed = false;
                }
        //        else
                {
                    cityRepository.DeleteCity(data);
                    _processResult.message = "Data Kota berhasil di hapus !";
                    _processResult.isSucceed = true;
                }
            }
            catch (Exception ex)
            {
                _processResult.message = ex.Message;
                _processResult.isSucceed = false;
            }
            return Ok(_processResult);
        }
    }
}