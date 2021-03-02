using ERC.Repository.Repository;
using ERC.Repository.ViewModel;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Configuration;
using System.Web.Http;
using System.Web.Http.Description;
using Newtonsoft.Json;

namespace ERC.CMS.Controllers
{
    [Authorize]
    public class FileUploadController : ApiController
    {
        FileUploadRepository fileUploadRepository = new FileUploadRepository();

        [HttpPost]
        [Route("api/FileUpload/Submit/ATFAMLGOOGLE")]
        public IHttpActionResult Upload(string type)
        {
            var _fileUploadController = new FileUploadController();
            //var _agentCodeRepository = new AgentCodeRepository();
            ProcessResult _result = new ProcessResult();

            try
            {
                string sPath = WebConfigurationManager.AppSettings["SharedFolderURL"];
                string user = WebConfigurationManager.AppSettings["SharedFolderUser"];
                string password = WebConfigurationManager.AppSettings["SharedFolderPassword"];
                string sFileExtension = WebConfigurationManager.AppSettings["FileExtension"];

                System.Web.HttpFileCollection hfc = System.Web.HttpContext.Current.Request.Files;
                if (hfc.Count == 0)
                {
                    _result.isSucceed = false;
                    _result.message = "File belum dipilih";
                    return Ok(_result);
                }

                for (int i = 0; i < hfc.Count; i++)
                {
                    System.Web.HttpPostedFile hpf = hfc[i];
                    //validate ext
                    string fileExtension = System.IO.Path.GetExtension(hpf.FileName);
                    if (!sFileExtension.Contains(fileExtension.ToLower()))
                    {
                        _result.isSucceed = false;
                        _result.message = "Format file is incorrect";
                        return Ok(_result);
                    }

                    if (hpf.ContentLength > 0)
                    {
                        if (!File.Exists(Path.Combine(sPath, Path.GetFileName(hpf.FileName))))
                        {
                            var splitedName = hpf.FileName.Split('_');
                            var TempAgentCode = splitedName[0];
                            var TypeFile = splitedName[1].Split('.');
                            if (type == "atfaml")
                            {
                                if (TypeFile[0].ToLower().Contains("aml") || TypeFile[0].ToLower().Contains("atf"))
                                {
                                    //cek agentcode jika ada _> upload file, insert ke fileupload dan candidatefile
                                    //var isExist = _agentCodeRepository.GetCandidateByTempAgentCode(TempAgentCode);
                                    //if (isExist != null)
                                    {
                                        hpf.SaveAs(sPath + Path.GetFileName(hpf.FileName));
                                        fileUploadRepository.AddFileUpload(new FileUploadViewModel()
                                        {
                                            FileName = hpf.FileName,
                                            Path = WebConfigurationManager.AppSettings["WebSharedFolderURL"] + Path.GetFileName(hpf.FileName)
                                        });

                                        //insert ke CandidateFile
                                        var FileId = fileUploadRepository.GetFileID(hpf.FileName);
                                        if (FileId != 0)
                                        {
                                            //var documentCek = new DocumentCheckRepository();
                                            //documentCek.InsertCandidateFile(TypeFile[0].ToUpper(), isExist.ID, FileId);
                                        }
                                    }
                                }
                                else
                                {
                                    _result.isSucceed = false;
                                    _result.message = "Pastikan Nama File Dengan Format TempAgentCode_ATF / TempAgentCode_AML";
                                    return Ok(_result);
                                }
                            }
                            else if (type == "google")
                            {
                                if (TypeFile[0].ToLower().Contains("google"))
                                {
                                    TypeFile[0] = "Google";
                                    //cek agentcode jika ada _> upload file, insert ke fileupload dan candidatefile
                                    //var isExist = _agentCodeRepository.GetCandidateByTempAgentCode(TempAgentCode);
                                    //if (isExist != null)
                                    {
                                        hpf.SaveAs(sPath + Path.GetFileName(hpf.FileName));
                                        fileUploadRepository.AddFileUpload(new FileUploadViewModel()
                                        {
                                            FileName = hpf.FileName,
                                            Path = WebConfigurationManager.AppSettings["WebSharedFolderURL"] + Path.GetFileName(hpf.FileName)
                                        });

                                        //insert ke CandidateFile
                                        var FileId = fileUploadRepository.GetFileID(hpf.FileName);
                                        if (FileId != 0)
                                        {
                                            //var documentCek = new DocumentCheckRepository();
                                            //documentCek.InsertCandidateFile(TypeFile[0], isExist.ID, FileId);
                                        }
                                    }
                                }
                                else
                                {
                                    _result.isSucceed = false;
                                    _result.message = "Pastikan Nama File Dengan Format TempAgentCode_GOOGLE";
                                    return Ok(_result);
                                }
                            }
                        }
                        else
                        {
                            _result.isSucceed = false;
                            _result.message = "File Is Already Exist " + hpf.FileName;
                            return Ok(_result);
                        }
                    }
                }
                _result.isSucceed = true;
                _result.message = "Data has been Uploaded Succesfully";
                return Ok(_result);
            }
            catch (Exception exc)
            {
                //validate file maximum size
                if (exc.Message == "Maximum request length exceeded.")
                {
                    HttpRuntimeSection section = ConfigurationManager.GetSection("system.web/httpRuntime") as HttpRuntimeSection;
                    _result.isSucceed = false;
                    _result.message = "File is too large " + section.MaxRequestLength.ToString() + " KB";
                    return Ok(_result);
                }
                else
                {
                    _result.message = exc.Message;
                    return Ok(_result);
                }
            }
        }

        [Route("api/FileUpload/GetListATFAML")]
        public IHttpActionResult GetListATFAML(string fileName = null, int page = 1, int rowsPage = 10)
        {
            var data = fileUploadRepository.GetListATFAML(fileName, page, rowsPage);
            return Json(data);
        }

        [Route("api/FileUpload/GetListGoogle")]
        public IHttpActionResult GetListGoogle(string fileName = null, int page = 1, int rowsPage = 10)
        {
            var data = fileUploadRepository.GetListGoogle(fileName, page, rowsPage);
            return Json(data);
        }

        [Route("api/FileUpload/GetListFileUpload")]
        public IHttpActionResult GetListFileUpload(string fileName = null, int page = 1, int rowsPage = 10)
        {
            var data = fileUploadRepository.GetListFileUpload(fileName, page, rowsPage);
            return Json(data);
        }

        [HttpGet]
        [Route("api/FileUpload/GetDokumenCandidate")]
        [ResponseType(typeof(CandidateDokumenViewModel))]
        public IHttpActionResult GetDokumenCandidate(string loginName)
        {
            var data = fileUploadRepository.GetDokumenCandidate(loginName);

            foreach (var item in data)
            {
                item.Path = WebConfigurationManager.AppSettings["WebSharedFolderURL"] + item.FileName;
            }
            return Json(data);
        }


        [Route("api/FileUpload/CobaSubmit")]
        [HttpPost]
        public IHttpActionResult SubmitCV()
        {
            var processResult = new ProcessResult();
            try
            {
                var repository = new FileUploadRepository();
                string sPath = WebConfigurationManager.AppSettings["SharedFolderURLPD"];
                string relativePath = sPath;
                //string relativePath = "\\FileUpload\\";
                string allowedExtensions = WebConfigurationManager.AppSettings["FileExtensionPdf"];

                if (!ModelState.IsValid) return BadRequest(ModelState);

                //string valPekerjaan =  HttpContext.Current.Request.Params.Get("params") ;
                
                var jsonStringLogin = HttpContext.Current.Request.Form.Get("LoginName");        //cara ngambil dr formdata ato key value object
                var jsonStringType = HttpContext.Current.Request.Form.Get("type");
                //var model = JsonConvert.DeserializeObject<CandidateDokumenViewModel>(jsonString);


                if (HttpContext.Current.Request.Files.Count == 0)
                {
                    processResult.isSucceed = true;
                    processResult.message = "Data Dokumen berhasil disimpan";
                }

                CandidateDokumenViewModel model = new CandidateDokumenViewModel();
                //get the posted files  
                foreach (string fileName in HttpContext.Current.Request.Files)
                {
         

                    HttpPostedFile file = HttpContext.Current.Request.Files[fileName];          //HttpPostedFile buat ngakses files yg diupload as collection
                    if (file == null) throw new HttpResponseException(HttpStatusCode.BadRequest);

                    string fileExtension = Path.GetExtension(file.FileName);
                    if (!allowedExtensions.Contains(fileExtension.ToLower()))
                    {
                        processResult.message = "Format file tidak sesuai";
                        processResult.isSucceed = false;
                        return Ok(processResult);
                    }
                    
                    string renamedFile = Guid.NewGuid() + fileExtension;
                    file.SaveAs(Path.Combine(sPath, renamedFile));                              //si HttpPostedFile juga bisa save as
                    model.Path = relativePath + renamedFile;
                    model.FileName = renamedFile;
                    model.LoginName = jsonStringLogin;

                    if (fileName.Contains("CV")) model.Type = "CV";
                    else if (fileName.Contains("IJAZAH")) model.Type = "IJAZAH";
                    else if (fileName.Contains("FOTO")) model.Type = "FOTO";
                    else if (fileName.Contains("KTP")) model.Type = "KTP";
                    else if (fileName.Contains("REKENING")) model.Type = "REKENING";
                    else if (fileName.Contains("LAIN-LAIN")) model.Type = "LAIN-LAIN";
                    else if (fileName.Contains("NPWP")) model.Type = "NPWP";
                    //model.Type = fileName;
                    processResult.isSucceed = true;
                    processResult.message = "Data Dokumen berhasil disimpan";
                    repository.UploadDokumen(model);
                }

                //processResult.isSucceed = model.Id == 0 ? repository.InsertCategory(model) : repository.UpdateCategory(model);
                
                return Ok(processResult);
            }
            catch (Exception ex)
            {
                processResult.message = ex.Message;
                processResult.isSucceed = false;
                return Ok(processResult);
            }
        }

        [Route("api/FileUpload/GetDokumenPDF")]
        [HttpGet]
        [ResponseType(typeof(CandidateDokumenViewModel))]
        public IHttpActionResult GetDokumenPDF(string loginName)
        {
            var data = fileUploadRepository.GetDokumenPDF(loginName);
            foreach (var item in data)
            {
                item.Path = WebConfigurationManager.AppSettings["WebSharedFolderURL"] + item.FileName;
            }
            return Json(data);
        }

        [HttpPost]
        [Route("api/FileUpload/Deletedokumen")]
        public IHttpActionResult DeleteKontak(CandidateDokumenViewModel[] docs)
        {
            ProcessResult result = new ProcessResult();
            try
            {
                var data = fileUploadRepository.DeleteCandidateDocument(docs);

                result.isSucceed = true;
                result.message = "sukses dihapus";
            }
            catch (Exception ex)
            {
                result.isSucceed = false;
                result.message = ex.Message;
                return Ok(result);
            }
            return Ok(result);
        }

        [HttpPost]
        [Route("api/FileUpload/DeleteDokumenByName")]
        public IHttpActionResult DeleteKontakByName(List<CandidateDokumenViewModel> docs)
        {
            ProcessResult result = new ProcessResult();
            try
            {
                var data = fileUploadRepository.DeleteCandidateDocumentByName(docs);

                result.isSucceed = true;
                result.message = "sukses dihapus";
            }
            catch (Exception ex)
            {
                result.isSucceed = false;
                result.message = ex.Message;
                return Ok(result);
            }
            return Ok(result);
        }

        [Route("api/FileUpload/GetDokumenPDFSendEmail")]
        [HttpGet]
        [ResponseType(typeof(CandidateDokumenViewModel))]
        public IHttpActionResult GetDokumenPDFSendEmail(string loginName)
        {
            var data = fileUploadRepository.GetDokumenPDF(loginName);
            return Json(data);
        }

        [Route("api/FileUpload/Submit")]
        [HttpPost]
        public IHttpActionResult Submit()
        {
            var processResult = new ProcessResult();
            try
            {
                string sPath = WebConfigurationManager.AppSettings["SharedFolderURL"];
                string user = WebConfigurationManager.AppSettings["SharedFolderUser"];
                string password = WebConfigurationManager.AppSettings["SharedFolderPassword"];
                string sFileExtension = WebConfigurationManager.AppSettings["FileExtension"];

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
                if (!sFileExtension.Contains(fileExtension.ToLower()))
                {
                    processResult.message = "Format file tidak sesuai";
                    processResult.isSucceed = false;
                    return Ok(processResult);
                }


                if (hpf.ContentLength > 0)
                {
                    // Check duplicate
                    if (!File.Exists(Path.Combine(sPath, Path.GetFileName(hpf.FileName))))
                    {
                        // Save file in folder
                        hpf.SaveAs(sPath + Path.GetFileName(hpf.FileName));

                        // Insert into table FileUpload
                        FileUploadViewModel fileUpload = new FileUploadViewModel();
                        fileUpload.FileName = hpf.FileName;
                        fileUpload.Path = WebConfigurationManager.AppSettings["WebSharedFolderURL"] + Path.GetFileName(hpf.FileName);
                        fileUploadRepository.AddFileUpload(fileUpload);
                    }
                }

                processResult.message = "Berhasil Mengunggah File";
                processResult.isSucceed = true;

            }
            catch (Exception ex)
            {
                //validate file maximum size
                if (ex.Message == "Maximum request length exceeded.")
                {
                    HttpRuntimeSection section = ConfigurationManager.GetSection("system.web/httpRuntime") as HttpRuntimeSection;
                    processResult.message = "Ukuran File Tidak Bisa Lebih Dari " + section.MaxRequestLength.ToString() + " KB";
                    return Ok(processResult);
                }
                else
                {
                    processResult.message = ex.Message;
                    return Ok(processResult);
                }
            }
            return Ok(processResult);


        }

        [Route("api/FileUpload/DeleteFileUpload")]
        [HttpPost]
        public IHttpActionResult DeleteFileUpload(FileUploadViewModel fileUpload)
        {
            var processResult = new ProcessResult();
            string sPath = WebConfigurationManager.AppSettings["SharedFolderURL"];

            try
            {
                File.Delete(sPath + fileUpload.FileName);
                fileUploadRepository.DeleteFileUpload(fileUpload.ID);
                //delete candidate file
                fileUploadRepository.DeleteCandidateFile(fileUpload.ID);
                processResult.message = "Berhasil Menghapus Data";
                processResult.isSucceed = true;
            }
            catch (Exception ex)
            {
                processResult.message = ex.Message;
                return Ok(processResult);
            }
            return Ok(processResult);
        }

        [Route("api/FileUpload/Base64Image")]
        public IHttpActionResult UploadBase64Image(FileUploadViewModel fileUpload)
        {
            var processResult = new ProcessResult();
            string sPath = WebConfigurationManager.AppSettings["SharedFolderURL"];
            try
            {
                var base64 = fileUpload.Base64String;
                //create base 64, then insert table file pelengkap
                var userLogin = HttpContext.Current.User.Identity.Name;
                var fileName = userLogin + "_" + DateTime.Now.ToString("ddMMyyhhmmss") + ".txt";
                string dirProject = System.AppDomain.CurrentDomain.BaseDirectory;
                string logFilePath = dirProject + "FileUpload\\";
                fileUpload.Path = logFilePath + Path.GetFileName(fileName);
                fileUpload.FileName = fileName;
                fileUpload.Base64String = base64;
                CreateTxtBase64Image(fileUpload);
                int returnFileId = fileUploadRepository.UploadFile(fileUpload);

                processResult.message = "Berhasil Mengunggah File";
                processResult.isSucceed = true;
                processResult.returnValue = returnFileId.ToString() + "#" + base64;
            }
            catch (Exception ex)
            {
                processResult.isSucceed = false;
                processResult.message = ex.Message;
            }

            return Ok(processResult);
        }

        public void CreateTxtBase64Image(FileUploadViewModel fileUpload)
        {
            StreamWriter log;
            FileStream fileStream = null;
            DirectoryInfo logDirInfo = null;
            FileInfo logFileInfo;

            string logFilePath = fileUpload.Path;
            logFileInfo = new FileInfo(logFilePath);

            logDirInfo = new DirectoryInfo(logFileInfo.DirectoryName);
            if (!logDirInfo.Exists) logDirInfo.Create();
            if (!logFileInfo.Exists)
            {
                fileStream = logFileInfo.Create();
            }
            else
            {
                fileStream = new FileStream(logFilePath, FileMode.Append);
            }
            log = new StreamWriter(fileStream);

            //log.WriteLine("Candidate ID : " + model.CandidateID);

            log.WriteLine(fileUpload.Base64String);

            log.Close();
        }
    }
}