using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Spreadsheet;
using ERC.Repository.Helper;
using ERC.Repository.Repository;
using ERC.Repository.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Text.RegularExpressions;
using System.Web.Http;

namespace ERC.CMS.Controllers
{
    [Authorize]
    public class BankController : ApiController
    {
        BankRepository repository = new BankRepository();
        ProcessResult processResult = new ProcessResult();
        ReadExcelHelper readXHelper = new ReadExcelHelper();
        //RoleMenuRepository roleMenuRepository = new RoleMenuRepository();

        [Route("api/Bank/GetBank")]
        public IHttpActionResult GetBank()
        {
            var data = repository.GetBank();
            return Json(data);
        }

        [Route("api/Bank/GetListBank")]
        public IHttpActionResult GetListBank(int page = 1, int rowspPage = 10, string bankName = null)
        {
            var data = repository.GetListBank(page, rowspPage, bankName);
            return Json(data);
        }

        [Route("api/Recruitment/GetBank")]
        public IHttpActionResult GetGender()
        {

            var data = repository.GetBank();
            return Json(data);
        }

        [Route("api/Bank/Submit")]
        public IHttpActionResult Submit(BankViewModel data)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                if (string.IsNullOrEmpty(data.BankCode) || string.IsNullOrWhiteSpace(data.BankName))
                {
                    processResult.message = "Bank Code dan Bank Name Harus Diisi!";
                    processResult.isSucceed = false;
                    return Ok(processResult);
                }

                var cekBankCode = repository.GetBankByCode(data);
                if (cekBankCode == null)
                {
                    cekBankCode = repository.GetDeletedBank(data);
                    if (cekBankCode == null)
                    {
                        repository.AddNewBank(data);
                        processResult.isSucceed = true;
                        processResult.message = "Berhasil Menyimpan Data Baru";
                    }
                    else
                    {
                        repository.UnDeleteBank(data);
                        repository.UpdateBankByBankCode(data);
                        processResult.isSucceed = true;
                        processResult.message = "Berhasil Menyimpan Data Baru";
                    }
                }
                else
                {
                    if (data.ID != 0)
                    {
                        repository.UpdateBank(data);
                        processResult.isSucceed = true;
                        processResult.message = "Berhasil Mengubah Data";
                    }
                    else
                    {
                        processResult.isSucceed = false;
                        processResult.message = "Kode Bank Sudah Ada";
                    }
                }

                //var isExist = repository.GetBankById(data);
                //if (isExist == null)
                //{
                //    repository.AddNewBank(data);
                //    processResult.isSucceed = true;
                //    processResult.message = "Berhasil Menyimpan Data Baru";
                //}
                //else
                //{
                //    repository.UpdateBank(data);
                //    processResult.isSucceed = true;
                //    processResult.message = "Berhasil Mengubah Data";
                //}
            }
            catch (Exception ex)
            {
                processResult.isSucceed = false;
                processResult.message = ex.Message;
            }

            return Ok(processResult);
        }

        [Route("api/Bank/Import")]
        [HttpPost]
        public IHttpActionResult ImportData()
        {
            var processResult = new ProcessResult();
            StringBuilder listError = new StringBuilder();
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

                //if (hpf.FileName.ToLower() != "bank.xlsx")
                //{
                //    processResult.message = "Pastikan nama file yang diupload sesuai dengan menu upload yang dipilih => (Bank.xlsx).";
                //    processResult.isSucceed = false;
                //    return Ok(processResult);
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
                                            //if (Convert.ToInt32(rowNum) > 4)
                                            if (Convert.ToInt32(rowNum) > 1)
                                                {
                                                    Row r = (Row)reader.LoadCurrentElement();
                                                List<string> DataRows = new List<string>();
                                                var cellEnumerator = readXHelper.GetExcelCellEnumerator(r);
                                                StringBuilder Currentlisterror = new StringBuilder();

                                                while (cellEnumerator.MoveNext())
                                                {
                                                    var cell = cellEnumerator.Current;
                                                    var value = readXHelper.ReadExcelCell(cell, workBookPart).Trim();
                                                    DataRows.Add(value);
                                                }
                                                try
                                                {
                                                    var model = new BankViewModel();
                                                    var description = DataRows[0];
                                                    if (!string.IsNullOrEmpty(description))
                                                    {
                                                        Regex regex = new Regex("^[0-9]+$");
                                                        if (DataRows[0].ToString().Length > 20)
                                                        {
                                                            Currentlisterror.Append("ERROR ON CELL " + rowNum + ": Bank Code Max 20 Char");
                                                        }
                                                        if (DataRows[1].ToString().Length > 50)
                                                        {
                                                            Currentlisterror.Append("\nERROR ON CELL " + rowNum + ": Bank Name Max 50 Char");
                                                        }

                                                        if (Currentlisterror.Length <= 0)
                                                        {
                                                            model.BankCode = DataRows[0];
                                                            model.BankName = DataRows[1];
                                                            model.IsActive = true;
                                                            model.IsDelete = false;
                                                            //var cekBankCode = repository.GetBankByCode(model);
                                                            //if (cekBankCode == null)
                                                            //{
                                                            var cekBankCode = repository.GetBankByCode(model);
                                                            if (cekBankCode == null)
                                                            {
                                                                repository.AddNewBank(model);
                                                            }
                                                            else
                                                            {
                                                                repository.UnDeleteBank(model);
                                                                repository.UpdateBankByBankCode(model);
                                                            }
                                                            //}
                                                            //else
                                                            //{
                                                            //    repository.UpdateBank(model);
                                                            //}
                                                        }
                                                    }

                                                    if (Currentlisterror.Length > 0)
                                                        listError.Append(Currentlisterror);
                                                }
                                                catch (Exception ex)
                                                {
                                                    string message = ex.Message;
                                                    string undefinedColumn = "Index was out of range";
                                                    var result = message.Contains(undefinedColumn);
                                                    if (result)
                                                    {
                                                        listError.Append("\nTerdapat beebrapa kolom yang tidak sesuai template");
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
                    processResult.message = "Berhasil mengunggah data";
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

        [Route("api/Bank/Delete")]
        [HttpPost]
        public string Delete(BankViewModel data)
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
