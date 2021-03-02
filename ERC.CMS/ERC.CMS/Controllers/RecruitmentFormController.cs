using ERC.Repository.Repository;
using ERC.Repository.ViewModel;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Configuration;
using System.Data;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Configuration;
using System.Web.Http;
using System.Web.Http.Description;
using Microsoft.Owin.Security.Provider;
using Microsoft.Reporting.WebForms;

namespace ERC.CMS.Controllers
{
    [Authorize]
    public class RecruitmentFormController : ApiController
    {
        RecruitmentFormRepository recruitmentFormRepository;

        [AllowAnonymous]
        [Route("api/Recruitment/GetRecruitmentSource")]
        public IHttpActionResult GetRecruitmentSource()
        {
            recruitmentFormRepository = new RecruitmentFormRepository();

            var data = recruitmentFormRepository.GetRecruitmentSource();
            return Json(data);
        }


        [Route("api/Recruitment/Submit")]
        public IHttpActionResult SubmitDataPribadi(CandidateDataPribadiViewModel data)
        {
            ProcessResult result = new ProcessResult();
            try
            {
                //data.Status = "NEW";
                data.AllLeaderApproved = false;
                data.IsDeleted = false;

                recruitmentFormRepository = new RecruitmentFormRepository();
                recruitmentFormRepository.AddCandidate(data);

                recruitmentFormRepository.UpdateAccountDetails(data);

                result.isSucceed = true;
                result.message = "Data Berhasil Di simpan";

            }
            catch (Exception x)
            {
                result.isSucceed = false;
                result.message = "data pribadi: " + x.Message;
                //result.message = "Data Kandidat gagal Di SUBMIT";

                return Ok(result);

                }
            return Ok(result);
        }

        [Route("api/Recruitment/SubmitDataDomisili")]
        public IHttpActionResult SubmitDataDomisili(CandidateDataDomisiliViewModel data)
        {
            ProcessResult result = new ProcessResult();
            try
            {
                recruitmentFormRepository = new RecruitmentFormRepository();
                

                recruitmentFormRepository.AddCandidateDataDomisili(data);
                result.isSucceed = true;
                result.message = "data berhasil disimpan";
            }
            catch (Exception x)
            {
                result.isSucceed = false;
                result.message = "data domisili: " + x.Message;
                
                return Ok(result);

            }
            return Ok(result);
        }

        [Route("api/Recruitment/SubmitDataRekeningNpwp")]
        public IHttpActionResult SubmitDataRekeningNpwp(CandidateDataRekeningNpwpViewModel data)
        {
            ProcessResult result = new ProcessResult();
            try
            {
                recruitmentFormRepository = new RecruitmentFormRepository();
                recruitmentFormRepository.AddCandidateRekeningNpwp(data);
                result.isSucceed = true;
                result.message = "data berhasil disimpan";
            }
            catch (Exception x)
            {
                result.isSucceed = false;
                result.message = "data npwp: " + x.Message;
                return Ok(result);

            }
            return Ok(result);
        }

        [Route("api/Recruitment/SubmitDataKesehatan")]
        public IHttpActionResult SubmitDataKondisiKesehatan(CandidateDataKondisiKesehatanViewModel data)
        {
            ProcessResult result = new ProcessResult();
            try
            {
                recruitmentFormRepository = new RecruitmentFormRepository();
                recruitmentFormRepository.AddCandidateKondisiKesehatan(data);
                result.isSucceed = true;
                result.message = "data berhasil disimpan";
            }
            catch (Exception x)
            {
                result.isSucceed = false;
                result.message = "data kesehatan: " + x.Message;
                return Ok(result);
            }
            return Ok(result);
        }

        [Route("api/Recruitment/GetCandidateProgress")]
        public IHttpActionResult GetCandidateProgress()
        {
            string data;
            ProcessResult result = new ProcessResult();
            try
            {
                recruitmentFormRepository = new RecruitmentFormRepository();
                var fileUploadRepo = new FileUploadRepository();
                var userRepository = new UserRepository();
                var loginName = User.Identity.Name;

                var listCdp = recruitmentFormRepository.GetCandidateDataPribadi(loginName);

                if (listCdp.Count == 0) data = "rekrutmenDataPribadi";
                else if (recruitmentFormRepository.GetKontak(loginName).Count == 0) data = "rekrutmenKontak";
                else if (listCdp[0] != null && !listCdp[0].IsKeluargaComplete) data = "rekrutmenDataKeluarga"; //todo
                else if (recruitmentFormRepository.GetCandidateDataPendidikan(loginName).Count == 0) data = "rekrutmenPendidikan";
                else if (recruitmentFormRepository.GetCandidateExperiencePekerjaan(loginName).Count == 0 
                         || recruitmentFormRepository.GetCandidateExperienceBahasa(loginName).Count == 0
                         || recruitmentFormRepository.GetCandidateExperienceMinat(loginName).Count == 0
                         || recruitmentFormRepository.GetCandidateExperiencePlusMin(loginName).Count == 0 ) data = "rekrutmenPekerjaan";
                else
                {
                    var listFile = fileUploadRepo.GetDokumenCandidate(loginName);
                    if (listFile.Count == 0 
                        || listFile.FirstOrDefault(p => p.Type == "CV") == null
                        || listFile.FirstOrDefault(p => p.Type == "IJAZAH") == null || listFile.FirstOrDefault(p => p.Type == "REKENING") == null
                        || listFile.FirstOrDefault(p => p.Type == "KTP") == null || listFile.FirstOrDefault(p => p.Type == "FOTO") == null) data = "rekrutmenDokumen";
                    //else if (recruitmentFormRepository.GetPsikotesHasil(loginName) == null) data = "rekrutmenPsikotes";
                    else if (recruitmentFormRepository.GetIsFinishPapikostik(loginName) == false) data = "rekrutmenPapikostik";
                    else if (recruitmentFormRepository.GetCandidateDataPTKP(loginName).Count == 0) data = "rekrutmenPTKP";
                    else if (!userRepository.GetPDFSubmitStatus(loginName).IsSubmittedPDF) data = "rekrutmenReview";
                    else data = "rekrutmenDataPribadi";
                }

                result.isSucceed = true;
                result.message = "data Pribadi berhasil disimpan";
            }
            catch (Exception x)
            {
                result.isSucceed = false;
                result.message = "data rencana: " + x.Message;
                return Ok(result);
            }

            return Json(data);
        }

        [Route("api/Recruitment/SubmitDataRencanaPribadi")]
        public IHttpActionResult SubmitDataRencanaPribadi(CandidateDataRencanaPribadiViewModel data)
        {
            ProcessResult result = new ProcessResult();
            try
            {
                recruitmentFormRepository = new RecruitmentFormRepository();
                recruitmentFormRepository.AddCandidateRencanaPribadi(data);
                result.isSucceed = true;
                result.message = "data Pribadi berhasil disimpan";
            }
            catch (Exception x)
            {
                result.isSucceed = false;
                result.message = "data rencana: " + x.Message;
                return Ok(result);
            }

            return Ok(result);
        }

        [Route("api/Recruitment/SubmitDataCandidatePTKP")]
        public IHttpActionResult SubmitDataCandidatePTKP(CandidateDataPTKPViewModel data)
        {
            ProcessResult result = new ProcessResult();
            try
            {
                recruitmentFormRepository = new RecruitmentFormRepository();
                recruitmentFormRepository.AddCandidateDataPTKP(data);
                result.isSucceed = true;
                result.message = "data PTKP berhasil disimpan";
            }
            catch (Exception x)
            {
                result.isSucceed = false;
                result.message = x.Message;
                return Ok(result);
            }

            return Ok(result);
        }


        [Route("api/Recruitment/GetAgama")]
        public IHttpActionResult GetAgama()
        {
            recruitmentFormRepository = new RecruitmentFormRepository();

            var data = recruitmentFormRepository.GetAgama();
            return Json(data);
        }

        [Route("api/Recruitment/GetGender")]
        public IHttpActionResult GetGender()
        {
            recruitmentFormRepository = new RecruitmentFormRepository();

            var data = recruitmentFormRepository.GetGender();
            return Json(data);
        }
        

        [Route("api/Recruitment/GetStatusPerkawinan")]
        public IHttpActionResult GetStatusPerkawinan()
        {
            recruitmentFormRepository = new RecruitmentFormRepository();

            var data = recruitmentFormRepository.GetStatusPerkawinan();
            return Json(data);
        }

        [Route("api/Recruitment/GetDataPTKP")]
        public IHttpActionResult GetDataPTKP()
        {
            recruitmentFormRepository = new RecruitmentFormRepository();

            var data = recruitmentFormRepository.GetDataPTKP();
            return Json(data);
        }

        [Route("api/Recruitment/GetCandidateDataPTKP")]
        public IHttpActionResult GetCandidateDataPTKP(string loginName)
        {
            recruitmentFormRepository = new RecruitmentFormRepository();

            var data = recruitmentFormRepository.GetCandidateDataPTKP(loginName);
            return Json(data);
        }



        [HttpGet]
        [Route("api/Recruitment/GetDataDomisili")]
        [ResponseType(typeof(CandidateDataDomisiliViewModel[]))]
        public IHttpActionResult GetCandidateDataDomisili(string loginName)
        {
            recruitmentFormRepository = new RecruitmentFormRepository();
            var data = recruitmentFormRepository.GetCandidateDataDomisili(loginName);
            return Json(data);
        }

        [HttpGet]
        [Route("api/Recruitment/GetDataPribadi")]
        [ResponseType(typeof(CandidateDataPribadiViewModel[]))]
        public IHttpActionResult GetCandidateDataPribadi(string loginName)
        {
            recruitmentFormRepository = new RecruitmentFormRepository();
            var userRepo = new UserRepository();
            var data = recruitmentFormRepository.GetCandidateDataPribadi(loginName);
            return Json(data);
        }

        [HttpGet]
        [Route("api/Recruitment/GetDataPribadi2")]
        [ResponseType(typeof(CandidateDataPribadiViewModel[]))]
        public IHttpActionResult GetCandidateDataPribadi2(string loginName)
        {
            recruitmentFormRepository = new RecruitmentFormRepository();
            var userRepo = new UserRepository();
            var data = recruitmentFormRepository.GetCandidateDataPribadi(loginName);
            if (data.Count == 0)
            {
                data = new List<CandidateDataPribadiViewModel> { ConvertModel(userRepo.GetAccount(loginName)) };
            }

            return Json(data);
        }


        private CandidateDataPribadiViewModel ConvertModel(UserViewModel data)
        {
            return new CandidateDataPribadiViewModel
            {
                LoginName = data.LoginName,
                NamaLengkap = data.DisplayName,
                Email = data.Email,
                PhoneNo = data.PhoneNo
            };
        }

        [HttpGet]
        [Route("api/Recruitment/GetStatusAppNotif")]
        [ResponseType(typeof(CandidateDataPribadiViewModel[]))]
        public IHttpActionResult GetStatusAppNotif(string loginName)
        {
            recruitmentFormRepository = new RecruitmentFormRepository();
            var data = recruitmentFormRepository.GetStatusAppNotif(loginName);
            return Json(data);
        }

        [HttpPost]
        [Route("api/Recruitment/SetStatusAppNotif1")]
        public IHttpActionResult SetStatusAppNotif1(string loginName)
        {
            ProcessResult result = new ProcessResult();
            try
            {
                recruitmentFormRepository = new RecruitmentFormRepository();
                recruitmentFormRepository.SetStatusAppNotif1(loginName);

                result.isSucceed = true;
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
        [Route("api/Recruitment/SetStatusAppNotif2")]
        public IHttpActionResult SetStatusAppNotif2(string loginName)
        {
            ProcessResult result = new ProcessResult();
            try
            {
                recruitmentFormRepository = new RecruitmentFormRepository();
                recruitmentFormRepository.SetStatusAppNotif2(loginName);

                result.isSucceed = true;
            }
            catch (Exception ex)
            {
                result.isSucceed = false;
                result.message = ex.Message;
                return Ok(result);
            }
            return Ok(result);
        }


        [HttpGet]
        [Route("api/Recruitment/GetDataRekeningNPWP")]
        [ResponseType(typeof(CandidateDataRekeningNpwpViewModel[]))]
        public IHttpActionResult GetCandidateDataRekeningNPWP(string loginName)
        {
            recruitmentFormRepository = new RecruitmentFormRepository();
            var data = recruitmentFormRepository.GetCandidateDataRekeningNPWP(loginName);
            return Json(data);
        }

        [HttpGet]
        [Route("api/Recruitment/GetDataKesehatan")]
        [ResponseType(typeof(CandidateDataKondisiKesehatanViewModel[]))]
        public IHttpActionResult GetCandidateDataKondisiKesehatan(string loginName)
        {
            recruitmentFormRepository = new RecruitmentFormRepository();
            var data = recruitmentFormRepository.GetCandidateDataKondisiKesehatan(loginName);
            return Json(data);
        }

        [HttpGet]
        [Route("api/Recruitment/GetDataRencanaPribadi")]
        [ResponseType(typeof(CandidateDataRencanaPribadiViewModel[]))]
        public IHttpActionResult GetCandidateDataRencanaPribadi(string loginName)
        {
            recruitmentFormRepository = new RecruitmentFormRepository();
            var data = recruitmentFormRepository.GetCandidateDataRencanaPribadi(loginName);
            return Json(data);
        }

        [Route("api/Recruitment/SubmitKontak")]
        public IHttpActionResult SubmitKontak(CandidateKontakDaruratViewModel[] data)
        {
            ProcessResult result = new ProcessResult();
            try
            {
                recruitmentFormRepository = new RecruitmentFormRepository();
                recruitmentFormRepository.AddCandidateKontak(data);

                result.isSucceed = true;
                result.message = "data kontak berhasil disimpan";
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
        [Route("api/Recruitment/DeleteKontak")]
        public IHttpActionResult DeleteKontak(CandidateKontakDaruratViewModel[] data)
        {
            ProcessResult result = new ProcessResult();
            try
            {
                recruitmentFormRepository = new RecruitmentFormRepository();
                recruitmentFormRepository.DeleteCandidateKontak(data);

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

        [HttpGet]
        [Route("api/Recruitment/GetKontak")]
        [ResponseType(typeof(CandidateKontakDaruratViewModel[]))]
        public IHttpActionResult GetKontak(string loginName)
        {
            recruitmentFormRepository = new RecruitmentFormRepository();
            var data = recruitmentFormRepository.GetKontak(loginName);
            return Json(data);
        }


        [Route("api/Recruitment/SubmitDataKeluarga")]
        public IHttpActionResult SubmitDataKeluarga(CandidateKeluargaViewModel[] data)
        {
            ProcessResult result = new ProcessResult();
            try
            {
                recruitmentFormRepository = new RecruitmentFormRepository();
                recruitmentFormRepository.AddCandidateKeluarga(data);
                recruitmentFormRepository.UpdateIsKeluargaComplete(User.Identity.Name);

                result.isSucceed = true;
                result.message = "data berhasil disimpan";
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
        [Route("api/Recruitment/DeleteKeluarga")]
        public IHttpActionResult DeleteKeluarga(CandidateKeluargaViewModel[] data)
        {
            ProcessResult result = new ProcessResult();
            try
            {
                recruitmentFormRepository = new RecruitmentFormRepository();
                recruitmentFormRepository.DeleteCandidateKeluarga(data);

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

        [HttpGet]
        [Route("api/Recruitment/GetCandidateDataSaudara")]
        [ResponseType(typeof(CandidateKeluargaViewModel[]))]
        public IHttpActionResult GetCandidateDataSaudara(string loginName)
        {
            recruitmentFormRepository = new RecruitmentFormRepository();
            var data = recruitmentFormRepository.GetCandidateDataSaudara(loginName);
            return Json(data);
        }

        [HttpGet]
        [Route("api/Recruitment/GetCandidateDataKeluarga")]
        [ResponseType(typeof(CandidateKeluargaViewModel[]))]
        public IHttpActionResult GetCandidateDataKeluarga(string loginName)
        {
            recruitmentFormRepository = new RecruitmentFormRepository();
            var data = recruitmentFormRepository.GetCandidateDataKeluarga(loginName);
            return Json(data);
        }


        [Route("api/Recruitment/GetLevelPendidikan")]
        public IHttpActionResult GetLevelPendidikan()
        {
            recruitmentFormRepository = new RecruitmentFormRepository();

            var data = recruitmentFormRepository.GetLevelPendidikan();
            return Json(data);
        }

        [HttpGet]
        [Route("api/Recruitment/GetCandidateDataPendidikan")]
        [ResponseType(typeof(CandidatePendidikanViewModel[]))]
        public IHttpActionResult GetCandidateDataPendidikan(string loginName)
        {
            recruitmentFormRepository = new RecruitmentFormRepository();
            var data = recruitmentFormRepository.GetCandidateDataPendidikan(loginName);
            return Json(data);
        }

        [Route("api/Recruitment/SubmitDataPendidikan")]
        public IHttpActionResult SubmitDataPendidikan(CandidatePendidikanViewModel[] data)
        {
            ProcessResult result = new ProcessResult();
            try
            {
                
                recruitmentFormRepository = new RecruitmentFormRepository();
                recruitmentFormRepository.AddCandidatePendidikan(data);

                result.isSucceed = true;
                result.message = "data berhasil disimpan";
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
        [Route("api/Recruitment/DeletePendidikan")]
        public IHttpActionResult DeletePendidikan(CandidatePendidikanViewModel[] data)
        {
            ProcessResult result = new ProcessResult();
            try
            {
                recruitmentFormRepository = new RecruitmentFormRepository();
                recruitmentFormRepository.DeleteCandidatePendidikan(data);

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
        [Route("api/Recruitment/submitPekerjaan")]
        public IHttpActionResult SubmitPekerjaan(CandidateExperienceAllVIewModel data)
        {
            ProcessResult result = new ProcessResult();
            try
            {

                //ambil value dari params di js kalo bentuknya params
                /*var valPekerjaan = "[" + HttpContext.Current.Request.Params.Get("Pekerjaan") + "]";
                var listPekerjaan = JsonConvert.DeserializeObject<List<CandidateExperiencePekerjaanViewModel>>(valPekerjaan);

                var valOrganisasi = "[" + HttpContext.Current.Request.Params.Get("Organisasi") + "]";
                var listOrganisasi = JsonConvert.DeserializeObject<List<CandidateExperienceOrganisasiViewModel>>(valOrganisasi);

                var valPrestasi = "[" + HttpContext.Current.Request.Params.Get("Prestasi") + "]";
                var listPrestasi = JsonConvert.DeserializeObject<List<CandidateExperiencePrestasiViewModel>>(valPrestasi);

                var valBahasa = "["+HttpContext.Current.Request.Params.Get("Bahasa")+"]";
                var listBahasa = JsonConvert.DeserializeObject<List<CandidateExperienceBahasaViewModel>>(valBahasa);

                var valKeahlian = "[" + HttpContext.Current.Request.Params.Get("Keahlian") + "]";
                var listKeahlian = JsonConvert.DeserializeObject<List<CandidateExperienceKeahlianViewModel>>(valKeahlian);

                var valMinat = "[" + HttpContext.Current.Request.Params.Get("Minat") + "]";
                var listMinat = JsonConvert.DeserializeObject<List<CandidateExperienceMinatViewModel>>(valMinat);
                data.Minat = listMinat;

                var valPlusMin = "[" + HttpContext.Current.Request.Params.Get("PlusMin") + "]";
                var listPlusMin = JsonConvert.DeserializeObject<List<CandidateExperiencePlusMinViewModel>>(valPlusMin);


                //taro lagi di viewmodel
                CandidateExperienceAllVIewModel dataValue = new CandidateExperienceAllVIewModel();
                dataValue.Pekerjaan = listPekerjaan;
                dataValue.Organisasi = listOrganisasi;
                dataValue.Prestasi = listPrestasi;
                dataValue.Bahasa = listBahasa;
                dataValue.Keahlian = listKeahlian;
   
                dataValue.PlusMin = listPlusMin;*/

                recruitmentFormRepository = new RecruitmentFormRepository();
                recruitmentFormRepository.AddCandidateDataPekerjaan(data);

                result.isSucceed = true;
                result.message = "data berhasil disimpan";
                return Ok(result);
            }
            catch (Exception ex)
            {
                result.isSucceed = false;
                result.message = ex.Message;
                return Ok(result);
            }
        }

        [HttpGet]
        [Route("api/Recruitment/GetCandidateExperiencePekerjaan")]
        [ResponseType(typeof(CandidateExperiencePekerjaanViewModel[]))]
        public IHttpActionResult GetCandidateExperiencePekerjaan(string loginName)
        {
            recruitmentFormRepository = new RecruitmentFormRepository();
            var data = recruitmentFormRepository.GetCandidateExperiencePekerjaan(loginName);
            return Json(data);
        }

        [HttpPost]
        [Route("api/Recruitment/DeletePekerjaan")]
        public IHttpActionResult DeletePekerjaan(CandidateExperiencePekerjaanViewModel[] data)
        {
            ProcessResult result = new ProcessResult();
            try
            {
                recruitmentFormRepository = new RecruitmentFormRepository();
                recruitmentFormRepository.DeleteCandidatePkerjaan(data);

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

        
        [HttpGet]
        [Route("api/Recruitment/GetCandidateExperienceOrganisasi")]
        [ResponseType(typeof(CandidateExperienceOrganisasiViewModel[]))]
        public IHttpActionResult GetCandidateExperienceOrganisasi(string loginName)
        {
            recruitmentFormRepository = new RecruitmentFormRepository();
            var data = recruitmentFormRepository.GetCandidateExperienceOrganisasi(loginName);
            return Json(data);
        }
        [HttpPost]
        [Route("api/Recruitment/DeleteOrganisasi")]
        public IHttpActionResult DeleteOrganisasi(CandidateExperienceOrganisasiViewModel[] data)
        {
            ProcessResult result = new ProcessResult();
            try
            {
                recruitmentFormRepository = new RecruitmentFormRepository();
                recruitmentFormRepository.DeleteCandidateOrganisasi(data);

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

        
        [HttpGet]
        [Route("api/Recruitment/GetCandidateExperiencePrestasi")]
        [ResponseType(typeof(CandidateExperiencePrestasiViewModel[]))]
        public IHttpActionResult GetCandidateExperiencePrestasi(string loginName)
        {
            recruitmentFormRepository = new RecruitmentFormRepository();
            var data = recruitmentFormRepository.GetCandidateExperiencePrestasi(loginName);
            return Json(data);
        }
        [HttpPost]
        [Route("api/Recruitment/DeletePrestasi")]
        public IHttpActionResult DeletePrestasi(CandidateExperiencePrestasiViewModel[] data)
        {
            ProcessResult result = new ProcessResult();
            try
            {
                recruitmentFormRepository = new RecruitmentFormRepository();
                recruitmentFormRepository.DeleteCandidatePrestasi(data);

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

        
        [HttpGet]
        [Route("api/Recruitment/GetCandidateExperienceBahasa")]
        [ResponseType(typeof(CandidateExperienceBahasaViewModel[]))]
        public IHttpActionResult GetCandidateExperienceBahasa(string loginName)
        {
            recruitmentFormRepository = new RecruitmentFormRepository();
            var data = recruitmentFormRepository.GetCandidateExperienceBahasa(loginName);
            return Json(data);
        }
        [HttpPost]
        [Route("api/Recruitment/DeleteBahasa")]
        public IHttpActionResult DeleteBahasa(CandidateExperienceBahasaViewModel[] data)
        {
            ProcessResult result = new ProcessResult();
            try
            {
                recruitmentFormRepository = new RecruitmentFormRepository();
                recruitmentFormRepository.DeleteCandidateBahasa(data);

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


        [HttpGet]
        [Route("api/Recruitment/GetCandidateExperienceKeahlian")]
        [ResponseType(typeof(CandidateExperienceKeahlianViewModel[]))]
        public IHttpActionResult GetCandidateExperienceKeahlian(string loginName)
        {
            recruitmentFormRepository = new RecruitmentFormRepository();
            var data = recruitmentFormRepository.GetCandidateExperienceKeahlian(loginName);
            return Json(data);
        }
        [HttpPost]
        [Route("api/Recruitment/DeleteKeahlian")]
        public IHttpActionResult DeleteKeahlian(CandidateExperienceKeahlianViewModel[] data)
        {
            ProcessResult result = new ProcessResult();
            try
            {
                recruitmentFormRepository = new RecruitmentFormRepository();
                recruitmentFormRepository.DeleteCandidateKeahlian(data);

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
        
        [HttpGet]
        [Route("api/Recruitment/GetCandidateExperiencePlusMin")]
        [ResponseType(typeof(CandidateExperiencePlusMinViewModel[]))]
        public IHttpActionResult GetCandidateExperiencePlusMin(string loginName)
        {
            recruitmentFormRepository = new RecruitmentFormRepository();
            var data = recruitmentFormRepository.GetCandidateExperiencePlusMin(loginName);
            return Json(data);
        }
        [HttpPost]
        [Route("api/Recruitment/DeletePlusMin")]
        public IHttpActionResult DeleteKeahlian(CandidateExperiencePlusMinViewModel[] data)
        {
            ProcessResult result = new ProcessResult();
            try
            {
                recruitmentFormRepository = new RecruitmentFormRepository();
                recruitmentFormRepository.DeleteCandidatePlusMin(data);

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


        [HttpGet]
        [Route("api/Recruitment/GetCandidateExperienceMinat")]
        [ResponseType(typeof(CandidateExperienceMinatViewModel[]))]
        public IHttpActionResult GetCandidateExperienceMinat(string loginName)
        {
            recruitmentFormRepository = new RecruitmentFormRepository();
            var data = recruitmentFormRepository.GetCandidateExperienceMinat(loginName);
            return Json(data);
        }

        [HttpGet]
        [Route("api/Recruitment/GetJadwalInterview1")]
        public IHttpActionResult GetJadwalInterview1(string loginName)
        {
            recruitmentFormRepository = new RecruitmentFormRepository();
            var data = recruitmentFormRepository.GetJadwalInterview1(loginName);
            return Json(data);
        }

        [HttpGet]
        [Route("api/Recruitment/GetJadwalInterview2")]
        public IHttpActionResult GetJadwalInterview2(string loginName)
        {
            recruitmentFormRepository = new RecruitmentFormRepository();
            var data = recruitmentFormRepository.GetJadwalInterview2(loginName);
            return Json(data);
        }

        [HttpGet]
        [Route("api/Recruitment/GetDataTraining")]
        public IHttpActionResult GetDataTraining(string loginName)
        {
            recruitmentFormRepository = new RecruitmentFormRepository();
            var data = recruitmentFormRepository.GetDataTraining(loginName);
            return Json(data);
        }

        [HttpGet]
        [Route("api/Recruitment/GetStatusJadwalInterview")]
        public IHttpActionResult GetStatusJadwal(string loginName)
        {
            recruitmentFormRepository = new RecruitmentFormRepository();
            var data = recruitmentFormRepository.GetStatusJadwalInterview(loginName);
            return Json(data);
        }

        [HttpGet]
        [Route("api/Recruitment/GetPsikotesHasil")]
        public IHttpActionResult GetPsikotesHasil(string loginName)
        {
            recruitmentFormRepository = new RecruitmentFormRepository();
            var data = recruitmentFormRepository.GetPsikotesHasil(loginName);
            return Json(data);
        }

        [HttpGet]
        [Route("api/Recruitment/GetPapikostikSoal")]
        public IHttpActionResult GetPapikostikSoal()
        {
            recruitmentFormRepository = new RecruitmentFormRepository();
            var data = recruitmentFormRepository.GetPapikostikSoal();
            return Json(data);
        }

        [HttpGet]
        [Route("api/Recruitment/GetPapikostikJawaban")]
        public IHttpActionResult GetPapikostikJawaban(string loginName)
        {
            recruitmentFormRepository = new RecruitmentFormRepository();
            var data = recruitmentFormRepository.GetPapikostikJawaban(loginName);
            return Json(data);
        }

        [HttpGet]
        [Route("api/Recruitment/GetIsFinishPapikostik")]
        public IHttpActionResult GetIsFinishPapikostik(string loginName)
        {
            recruitmentFormRepository = new RecruitmentFormRepository();
            var data = recruitmentFormRepository.GetIsFinishPapikostik(loginName);
            return Json(data);
        }

        [Route("api/Recruitment/SaveJawabanSoalPapikostik")]
        [ResponseType(typeof(List<SavePapikostikViewModel>))]
        [HttpPost]
        public IHttpActionResult SaveJawabanSoalPapikostik(List<SavePapikostikViewModel> listjawabanPapikostik)
        {
            ProcessResult result = new ProcessResult();
            try
            {
                recruitmentFormRepository = new RecruitmentFormRepository();
                var data = recruitmentFormRepository.SaveOrUpdateJawabanSoalPapikostik(listjawabanPapikostik);

                result.message = "Jawaban Telah Tersimpan";
                result.isSucceed = true;
                return Ok(result);
            }
            catch (Exception ex)
            {
                result.message = ex.Message;
                result.isSucceed = false;
                return Ok(result);
            }
            
        }
                
        [HttpPost]
        [Route("api/Recruitment/SaveIsFinishPapikostik")]
        public IHttpActionResult SaveIsFinishPapikostik(string loginName)
        {
            ProcessResult result = new ProcessResult();
            try
            {
                recruitmentFormRepository = new RecruitmentFormRepository();
                var data = recruitmentFormRepository.SaveIsFinishPapikostik(loginName);

                result.message = "Jawaban Telah Tersimpan";
                result.isSucceed = true;
                return Ok(result);
            }
            catch (Exception ex)
            {
                result.message = ex.Message;
                result.isSucceed = false;
                return Ok(result);
            }
            
        }

        [HttpGet]
        [Route("api/Recruitment/GetStatusCandidate")]
        public IHttpActionResult GetStatusCandidate(string loginName)
        {
            recruitmentFormRepository = new RecruitmentFormRepository();
            var data = recruitmentFormRepository.GetStatusCandidate(loginName);
            return Json(data);
        }
        

        [Route("api/RecuitmentForm/Submit")]
        public IHttpActionResult Submit(CandidateViewModel data)
        {
            ProcessResult result = new ProcessResult();
            try
            {
                WriteLog(data);
                recruitmentFormRepository = new RecruitmentFormRepository();
                var status = recruitmentFormRepository.AddFormReqruitment(data);
                result.isSucceed = true;
                if (status == "SUBMIT" && data.isPendingDocument == false)
                {
                    result.message = "Data Kandidat Berhasil Di SUBMIT";
                }
                else if (status == "SUBMIT" && data.isPendingDocument == true)
                {
                    result.message = "Data Kandidat Berhasil Diperbarui";
                }
                else if (status == "RulesApproval")
                {
                    result.isSucceed = false;
                    result.message = "Rules Appoval Tidak Ditemukan";
                }
                else if (status == "Hierarki")
                {
                    result.isSucceed = false;
                    result.message = "Hierarki Tidak Ditemukan";
                }
                else if (status == "DokumenPelengkap")
                {
                    result.isSucceed = false;
                    result.message = "Dokumen Pelengkap Harus Di Unggah";
                }
                else
                {
                    result.message = "Data Kandidat Berhasil Disimpan Sebagai DRAFT";
                }

                return Ok(result);
            }
            catch (Exception ex)
            {

                result.isSucceed = false;
                result.message = ex.Message.ToString();

                // Get stack trace for the exception with source file information
                var st = new StackTrace(ex, true);
                // Get the top stack frame
                var frame = st.GetFrame(0);
                // Get the line number from the stack frame
                var line = frame.GetFileLineNumber();
                return Ok(result);
            }
        }

        [Route("api/RecuitmentForm/GetCandidate")]
        public CandidateViewModel GetData(int candidateid)
        {
            recruitmentFormRepository = new RecruitmentFormRepository();
            var data = recruitmentFormRepository.GetData(candidateid);
            return data;
            //ProcessResultT<CandidateViewModel> processResult = new ProcessResultT<CandidateViewModel>();
            //try
            //{
            //    recruitmentFormRepository = new RecruitmentFormRepository();
            //    var data = recruitmentFormRepository.GetData(candidateid);
            //    var CekHierarki = data.RecruiterAgentCode;

            //    processResult.isSucceed = true;
            //    processResult.message = "Succeed Get Data Candidate";
            //}
            //catch (Exception ex)
            //{
            //    processResult.isSucceed = true;
            //    processResult.message = ex.Message;
            //}
            //return Ok(processResult);.
        }

        [HttpGet]
        [Route("api/FilePelengkap/LoadPhoto")]
        public IEnumerable<CandidateFileViewModel> LoadPhoto(int candidateId)
        {
            recruitmentFormRepository = new RecruitmentFormRepository();
            var data = recruitmentFormRepository.GetDataPelengkap(candidateId);
            return data;
        }

        [Route("api/UploadFileDataPelengkap/UploadFile")]
        [HttpPost]
        public IHttpActionResult UploadFile(String type = null, int candidateID = 0)
        {
            var processResult = new ProcessResult();
            try
            {
                string sPath = WebConfigurationManager.AppSettings["SharedFolderURL"];
                string user = WebConfigurationManager.AppSettings["SharedFolderUser"];
                string password = WebConfigurationManager.AppSettings["SharedFolderPassword"];
                string sFileExtension = WebConfigurationManager.AppSettings["FileExtensionPdf"];

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

                var returnFileId = 0;
                var fileName = "";
                if (hpf.ContentLength > 0)
                {
                    // Check duplicate
                    var userLogin = HttpContext.Current.User.Identity.Name;
                    fileName = userLogin + "_" + DateTime.Now.ToString("ddMMyyhhmmss") + fileExtension;
                    if (!File.Exists(Path.Combine(sPath, Path.GetFileName(fileName))))
                    {
                        // Save file in folder

                        hpf.SaveAs(sPath + Path.GetFileName(fileName));

                        // Insert into table FileUpload
                        recruitmentFormRepository = new RecruitmentFormRepository();
                        FileUploadViewModel fileUpload = new FileUploadViewModel();
                        fileUpload.FileName = fileName;
                        fileUpload.Path = WebConfigurationManager.AppSettings["WebSharedFolderURL"] + Path.GetFileName(fileName);
                        returnFileId = recruitmentFormRepository.UploadFile(fileUpload);
                        fileName = fileUpload.Path;

                        //mukti 15 oktober 2k19
                        if (type != null && candidateID != 0)
                        {
                            if (type.ToLower() == "aml")
                            {
                                recruitmentFormRepository.AddCandidateFile("AML", returnFileId, candidateID);
                            }
                            else if (type.ToLower() == "atf")
                            {
                                recruitmentFormRepository.AddCandidateFile("ATF", returnFileId, candidateID);
                            }
                            else if (type.ToLower() == "google")
                            {
                                recruitmentFormRepository.AddCandidateFile("GOOGLE", returnFileId, candidateID);
                            }
                        }
                        //mukti 15 oktober 2k19
                    }
                }

                processResult.message = "Berhasil Mengunggah File";
                processResult.isSucceed = true;
                processResult.returnValue = returnFileId.ToString() + "#" + fileName;
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
                    processResult.isSucceed = false;
                    processResult.message = ex.Message;
                    return Ok(processResult);
                }
            }
            return Ok(processResult);
        }

        [Route("api/RecruitmentForm/RescheduleAajiExam")]
        public IHttpActionResult RescheduleAaji(CandidateAajiExamViewModel data)
        {

            ProcessResult _result = new ProcessResult();
            RecruitmentFormRepository _repository = new RecruitmentFormRepository();
            try
            {
                data.IsReschedule = true;
                var msg = _repository.RescheduleAaji(data);
                _result.message = msg;
                //if (msg.Contains("Jadwal tidak bisa di pilih, jadwal tidak boleh kurang dari H-"))
                if (msg.Contains("Jadwal Aaji Anda Masih Menunggu Persetujuan Admin"))
                {
                    _result.isSucceed = false;
                }
                else
                {
                    _result.isSucceed = true;
                }
            }
            catch (Exception ex)
            {
                _result.message = ex.Message.ToString();
                _result.isSucceed = false;
            }
            return Json(_result);
        }

        [Route("api/RecuitmentForm/GetManagerData")]
        public IHttpActionResult GetManagerData(int candidateRoleId)
        {
            recruitmentFormRepository = new RecruitmentFormRepository();
            string loginname = HttpContext.Current.User.Identity.Name;
            var data = recruitmentFormRepository.GetManager(loginname, candidateRoleId);
            return Ok(data);
        }

        [Route("api/RecruitmentForm/GetPTKP")]
        public IHttpActionResult GetPTKP()
        {
            recruitmentFormRepository = new RecruitmentFormRepository();
            var data = recruitmentFormRepository.GetPTKP();
            return Ok(data);
        }

        [HttpGet]
        [Route("api/RecruitmentForm/GeneratePDF")]
        public IHttpActionResult GeneratePDF(string loginName)
        {
            // Variables. dont remove
            Warning[] warnings;
            string[] streamIds;
            string mimeType;
            string encoding;
            string extension;
            try
            {
                recruitmentFormRepository = new RecruitmentFormRepository();
                CandidateDataPribadiViewModel data = recruitmentFormRepository.GetCandidateDataPribadiPDF(loginName);


                DataTable dtCandidateViewModel = ToDataTable<CandidateDataPribadiViewModel>(data);
                var dsCandidate = new DataSet();
                dsCandidate.Tables.Add(dtCandidateViewModel.Copy());


                var dir = AppDomain.CurrentDomain.BaseDirectory;
                // Setup the report viewer object and get the array of bytes
                ReportViewer viewer = new ReportViewer {ProcessingMode = ProcessingMode.Local};
                viewer.LocalReport.ReportPath = dir + @"Content\ReportTemplates\untitled.rdl";
                viewer.LocalReport.EnableExternalImages = true;
                viewer.LocalReport.DataSources.Clear();

                //var dataKontak = recruitmentFormRepository.GetKontak(loginName);
                //DataTable dtKontak = ToDataTable(dataKontak);
                //var dsKontak = new DataSet();
                //dsKontak.Tables.Add(dtKontak.Copy());

                var dsKontak = new DataSet();
                var contacts = recruitmentFormRepository.GetKontakPDF(loginName);
                var kontak2 = new List<CandidateKontakDaruratViewModel>();

                for (int i = 0; i < contacts.Count; i++)
                {
                    if (i % 2 == 0)
                    {
                        CandidateKontakDaruratViewModel tempcontact;
                        if (i < contacts.Count - 1)
                        {
                            tempcontact = new CandidateKontakDaruratViewModel
                            {
                                Alamat = contacts[i].Alamat,
                                NamaLengkap = contacts[i].NamaLengkap,
                                NoTelepon = contacts[i].NoTelepon,
                                Hubungan = contacts[i].Hubungan,
                                Alamat2 = contacts[i + 1].Alamat,
                                NamaLengkap2 = contacts[i + 1].NamaLengkap,
                                NoTelepon2 = contacts[i + 1].NoTelepon,
                                Hubungan2 = contacts[i + 1].Hubungan
                            };
                        }
                        else
                        {
                            tempcontact = new CandidateKontakDaruratViewModel
                            {
                                Alamat = contacts[i].Alamat,
                                NamaLengkap = contacts[i].NamaLengkap,
                                NoTelepon = contacts[i].NoTelepon,
                                Hubungan = contacts[i].Hubungan
                            };
                        }

                        kontak2.Add(tempcontact);
                    }

                }
                dsKontak.Tables.Add(ToDataTable(kontak2).Copy());

                var dataAccount = recruitmentFormRepository.GetAccountForProfilePDF(loginName);
                DataTable dtAccount = ToDataTable(dataAccount);
                var dsAccount = new DataSet();
                dsAccount.Tables.Add(dtAccount.Copy());

/*            var pdfmodel = new PDFCandidateViewModel();
            pdfmodel.Gender
            pdfmodel.IsLaki = pdfmodel.Gender == "L" ? true : false;
            pdfmodel.IsWantia = pdfmodel.Gender == "L" ?  false:true ;
 */
                // PDFMODEL.TanggalLahirString =PDFMODEL.tanggallahir.ToString("dd-MM-yyyy");
                //var string = new DateTime().ToString("dd-MM-yyyy");

                var domisili = recruitmentFormRepository.GetCandidateDataDomisili(loginName);
                DataTable dtDomisili = ToDataTable(domisili);
                var dsDomisili = new DataSet();
                dsDomisili.Tables.Add(dtDomisili.Copy());

                var rekeningNPWP = recruitmentFormRepository.GetCandidateDataRekeningNPWPPDF(loginName);
/*                rekeningNPWP[0].NomorNPWP =
                    rekeningNPWP[0].NomorNPWP.substring(0, 2) +
                    "." +
                    $scope.fieldRekNpwp.nomorNPWP.substring(2, 5) +
                    "." +
                    $scope.fieldRekNpwp.nomorNPWP.substring(5, 8) +
                    "." +
                    $scope.fieldRekNpwp.nomorNPWP.substring(8, 9) +
                    "-" +
                    $scope.fieldRekNpwp.nomorNPWP.substring(9, 12) +
                    "." +
                    $scope.fieldRekNpwp.nomorNPWP.substring(12, 15); 
                    $scope.fieldRekNpwp.nomorNPWP =
                        $scope.fieldRekNpwp.nomorNPWP
                }*/
                DataTable dtRekeningNPWP = ToDataTable(rekeningNPWP);
                var dsRekeningNPWP = new DataSet();
                dsRekeningNPWP.Tables.Add(dtRekeningNPWP.Copy());

                PDFCandidateDataKondisiKesehatanViewModel kondisi = recruitmentFormRepository.GetKondisiKesehatanPDF(loginName);
                switch (kondisi.IsSehat)
                {
                    case "Ya":
                        kondisi.YaSehat = true;
                        kondisi.KondisiKesehatan = "";
                        break;

                    case "Tidak":
                        kondisi.TidakSehat = true;
                        break;
                }

                switch (kondisi.IsPernahDirawat)
                {
                    case "Ya":
                        kondisi.YaPernahDirawat = true;
                        var tahunDirawat = kondisi.TanggalSakit.Year;
                        var bulanDirawat = kondisi.TanggalSakit.Month;
                        kondisi.TanggalSakitConvert = bulanDirawat + " / " + tahunDirawat;
                        break;

                    case "Tidak":
                        kondisi.TidakPernahDirawat = true;
                        kondisi.TanggalSakitConvert = "";
                        break;
                }

                switch (kondisi.IsHamil)
                {
                    case "Ya":
                        kondisi.YaHamil = true;
                        break;

                    case "Tidak":
                        kondisi.TidakHamil = true;
                        break;
                }

                DataTable dtKondisi = ToDataTable<PDFCandidateDataKondisiKesehatanViewModel>(kondisi);
                var dsKondisi = new DataSet();
                dsKondisi.Tables.Add(dtKondisi.Copy());

                PDFCandidateDataRencanaPribadiViewModel rencanaPribadi = recruitmentFormRepository.GetRencanaPribadiPDF(loginName);
                switch (rencanaPribadi.RencanaMenikah)
                {
                    case "Ya":
                        rencanaPribadi.YaBerencanaMenikah = true;
                        var tahunMenikah = rencanaPribadi.TanggalRencanaMenikah.Year;
                        var bulanMenikah = rencanaPribadi.TanggalRencanaMenikah.Month;
                        rencanaPribadi.TanggalRencanaMenikahConvert = bulanMenikah + " / " + tahunMenikah;
                        break;

                    case "Tidak":
                        rencanaPribadi.TidakBerencanaMenikah = true;
                        rencanaPribadi.TanggalRencanaMenikahConvert = "";
                        break;
                }

                switch (rencanaPribadi.RencanaPunyaAnak)
                {
                    case "Ya":
                        rencanaPribadi.YaBerencanaPunyaAnak = true;
                        var tahunAnak = rencanaPribadi.TanggalRencanaPunyaAnak.Year;
                        var bulanAnak = rencanaPribadi.TanggalRencanaPunyaAnak.Month;
                        rencanaPribadi.TanggalRencanaPunyaAnakConvert = bulanAnak + " / " + tahunAnak;
                        break;

                    case "Tidak":
                        rencanaPribadi.TidakBerencanaPunyaAnak = true;
                        rencanaPribadi.TanggalRencanaPunyaAnakConvert = "";
                        break;
                }
                switch (rencanaPribadi.RencanaLanjutKuliah)
                {
                    case "Ya":
                        rencanaPribadi.YaBerencanaLanjutKuliah = true;
                        var tahunKuliah = rencanaPribadi.TanggalRencanaKuliah.Year;
                        var bulanKuliah = rencanaPribadi.TanggalRencanaKuliah.Month;
                        rencanaPribadi.TanggalRencanaKuliahConvert = bulanKuliah + " / " + tahunKuliah;
                        break;

                    case "Tidak":
                        rencanaPribadi.TidakBerencanaLanjutKuliah = true;
                        rencanaPribadi.TanggalRencanaKuliahConvert = "";
                        break;
                }
                switch (rencanaPribadi.RencanaNaikHaji)
                {
                    case "Ya":
                        rencanaPribadi.YaBerencanaNaikHaji = true;
                        var tahunHaji = rencanaPribadi.TanggalRencanaNaikHaji.Year;
                        var bulanHaji = rencanaPribadi.TanggalRencanaNaikHaji.Month;
                        rencanaPribadi.TanggalRencanaNaikHajiConvert = bulanHaji + " / " + tahunHaji;
                        break;

                    case "Tidak":
                        rencanaPribadi.TidakBerencanaNaikHaji = true;
                        rencanaPribadi.TanggalRencanaNaikHajiConvert = "";
                        break;
                }

                
               DataTable dtrencanaPribadi = ToDataTable<PDFCandidateDataRencanaPribadiViewModel>(rencanaPribadi);
                var dsRencanaPribadi = new DataSet();
                dsRencanaPribadi.Tables.Add(dtrencanaPribadi.Copy());

                var dsKeluarga = new DataSet();
                dsKeluarga.Tables.Add(ToDataTable(recruitmentFormRepository.GetCandidateDataKeluargaPDF(loginName))
                    .Copy());

                var ibu = recruitmentFormRepository.GetCandidateDataIbu(loginName);
                DataTable dtIbu = ToDataTable(ibu);
                var dsIbu = new DataSet();
                dsIbu.Tables.Add(dtIbu.Copy());

                var spouse = recruitmentFormRepository.GetCandidateDataSpouse(loginName);
                DataTable dtSpouse = ToDataTable(spouse);
                var dsSpouse = new DataSet();
                dsSpouse.Tables.Add(dtSpouse.Copy());

                var pendidikan = recruitmentFormRepository.GetCandidateDataPendidikanPDF(loginName);
                DataTable dtPendidikan = ToDataTable(pendidikan);
                var dsPendidikan = new DataSet();
                dsPendidikan.Tables.Add(dtPendidikan.Copy());

                var pendidikanNon = recruitmentFormRepository.GetCandidateDataPendidikanNonPDF(loginName);
                DataTable dtPendidikanNon = ToDataTable(pendidikanNon);
                var dsPendidikanNon = new DataSet();
                dsPendidikanNon.Tables.Add(dtPendidikanNon.Copy());

                var organisasi = recruitmentFormRepository.GetCandidateExperienceOrganisasi(loginName);
                DataTable dtOrganisasi = ToDataTable(organisasi);
                var dsOrganisasi = new DataSet();
                dsOrganisasi.Tables.Add(dtOrganisasi.Copy());

                var prestasi = recruitmentFormRepository.GetCandidateExperiencePrestasi(loginName);
                DataTable dtPrestasi = ToDataTable(prestasi);
                var dsPrestasi = new DataSet();
                dsPrestasi.Tables.Add(dtPrestasi.Copy());

                List<CandidateExperienceKeahlianViewModel> keahlian = recruitmentFormRepository.GetCandidateExperienceKeahlian(loginName);
                DataTable dtKeahlian = ToDataTable(keahlian);
                var dsKeahlian = new DataSet();
                dsKeahlian.Tables.Add(dtKeahlian.Copy());

                List<CandidateExperiencePlusMinViewModel> plusmin = recruitmentFormRepository.GetCandidateExperiencePlusMin(loginName);
                DataTable dtPlusmin = ToDataTable(plusmin);
                var dsPlusmin = new DataSet();
                dsPlusmin.Tables.Add(dtPlusmin.Copy());

                PDFCandidateDataPribadiViewModel gender = recruitmentFormRepository.GetGenderPDF(loginName);
                if (gender.JenisKelamin == "M")
                {
                    gender.IsMale = true;
                }
                else if (gender.JenisKelamin == "F")
                {
                    gender.IsFemale = true;
                }

                DataTable dtGender = ToDataTable<PDFCandidateDataPribadiViewModel>(gender);
                var dsGender = new DataSet();
                dsGender.Tables.Add(dtGender.Copy());

                PDFCandidateDataPribadiViewModel statusPernikahan =
                    recruitmentFormRepository.GetStatusPernikahanPDF(loginName);
                if (statusPernikahan.StatusPernikahan == "BM")
                /*if (statusPernikahan.StatusPernikahan == "S")*/
                {
                    statusPernikahan.IsSingle = true;
                }
                else if (statusPernikahan.StatusPernikahan == "ME")
                /*else if (statusPernikahan.StatusPernikahan == "M")*/
                {
                    statusPernikahan.IsMarried = true;
                }
                else if (statusPernikahan.StatusPernikahan == "JA" || statusPernikahan.StatusPernikahan == "DA")
                {
                    statusPernikahan.IsWidowed = true;
                }

                DataTable dtStatusPernikahan = ToDataTable<PDFCandidateDataPribadiViewModel>(statusPernikahan);
                var dsStatusPernikahan = new DataSet();
                dsStatusPernikahan.Tables.Add(dtStatusPernikahan.Copy());

                var bahasa = recruitmentFormRepository.GetExperienceBahasaPDF(loginName);
                foreach (var elemen in bahasa)
                {

                    switch (elemen.Membaca)
                    {
                        case "SANGAT BAIK":
                            elemen.IsMembacaSangatBaik = true;
                            break;
                        case "BAIK":
                            elemen.IsMembacaBaik = true;
                            break;
                        case "CUKUP":
                            elemen.IsMembacaCukup = true;
                            break;
                        case "KURANG":
                            elemen.IsMembacaKurang = true;
                            break;
                    }

                    switch (elemen.Menulis)
                    {
                        case "SANGAT BAIK":
                            elemen.IsMenulisSangatBaik = true;
                            break;
                        case "BAIK":
                            elemen.IsMenulisBaik = true;
                            break;
                        case "CUKUP":
                            elemen.IsMenulisCukup = true;
                            break;
                        case "KURANG":
                            elemen.IsMenulisKurang = true;
                            break;
                    }

                    switch (elemen.Berbicara)
                    {
                        case "SANGAT BAIK":
                            elemen.IsBerbicaraSangatBaik = true;
                            break;
                        case "BAIK":
                            elemen.IsBerbicaraBaik = true;
                            break;
                        case "CUKUP":
                            elemen.IsBerbicaraCukup = true;
                            break;
                        case "KURANG":
                            elemen.IsBerbicaraKurang = true;
                            break;
                    }
                }

                DataTable dtBahasa = ToDataTable(bahasa);
                var dsBahasa = new DataSet();
                dsBahasa.Tables.Add(dtBahasa.Copy());

                viewer.LocalReport.DataSources.Add(new ReportDataSource("Bahasa", dsBahasa.Tables[0]));


                var minat = recruitmentFormRepository.GetCandidateExperienceMinat(loginName);
                DataTable dtMinat = ToDataTable(minat);
                var dsMinat = new DataSet();
                dsMinat.Tables.Add(dtMinat.Copy());

                var pekerjaan = recruitmentFormRepository.GetCandidateExperiencePekerjaan(loginName);
                DataTable dtPekerjaan = ToDataTable(pekerjaan);
                var dsPekerjaan = new DataSet();
                dsPekerjaan.Tables.Add(dtPekerjaan.Copy());

                //RDLC FILE CAN CONTAIN MULTIPLE DATASOURCES 
                viewer.LocalReport.DataSources.Add(new ReportDataSource("Candidate", dsCandidate.Tables[0]));
                viewer.LocalReport.DataSources.Add(new ReportDataSource("Kontak", dsKontak.Tables[0]));
                viewer.LocalReport.DataSources.Add(new ReportDataSource("Account", dsAccount.Tables[0]));
                viewer.LocalReport.DataSources.Add(new ReportDataSource("Domisili", dsDomisili.Tables[0]));
                viewer.LocalReport.DataSources.Add(new ReportDataSource("Keluarga", dsKeluarga.Tables[0]));
                viewer.LocalReport.DataSources.Add(new ReportDataSource("Ibu", dsIbu.Tables[0]));
                viewer.LocalReport.DataSources.Add(new ReportDataSource("Spouse", dsSpouse.Tables[0]));
                viewer.LocalReport.DataSources.Add(new ReportDataSource("Pendidikan", dsPendidikan.Tables[0]));
                viewer.LocalReport.DataSources.Add(new ReportDataSource("PendidikanNon", dsPendidikanNon.Tables[0]));
                viewer.LocalReport.DataSources.Add(new ReportDataSource("Organisasi", dsOrganisasi.Tables[0]));
                viewer.LocalReport.DataSources.Add(new ReportDataSource("Prestasi", dsPrestasi.Tables[0]));
                viewer.LocalReport.DataSources.Add(new ReportDataSource("Keahlian", dsKeahlian.Tables[0]));
                viewer.LocalReport.DataSources.Add(new ReportDataSource("PlusMin", dsPlusmin.Tables[0]));
                viewer.LocalReport.DataSources.Add(new ReportDataSource("Gender", dsGender.Tables[0]));
                viewer.LocalReport.DataSources.Add(new ReportDataSource("StatusPernikahan", dsStatusPernikahan.Tables[0]));
                viewer.LocalReport.DataSources.Add(new ReportDataSource("Minat", dsMinat.Tables[0]));
                viewer.LocalReport.DataSources.Add(new ReportDataSource("Pekerjaan", dsPekerjaan.Tables[0]));
                viewer.LocalReport.DataSources.Add(new ReportDataSource("RekeningNPWP", dsRekeningNPWP.Tables[0]));
                viewer.LocalReport.DataSources.Add(new ReportDataSource("KondisiKesehatan", dsKondisi.Tables[0]));
                viewer.LocalReport.DataSources.Add(new ReportDataSource("RencanaPribadi", dsRencanaPribadi.Tables[0]));
                /*viewer.LocalReport.DataSources.Add(new ReportDataSource("image", dsDokumenCv.Tables[0]));*/



                //buat image dibikin parameter. define disini dulu di report builder tinggal masukin di parameter
                ReportParameter[] paras = new ReportParameter[8];
                string filePath1 = @"file:\" + dir + @"\Content\Images\pdf-icon.png";
                //string imageCv = @"file:\" + dir + data.PathImageCV;
                //string imageKtp= @"file:\" + dir + data.PathImageKTP;
                //string imageFoto = @"file:\" + dir + data.PathImageFoto;
                //string imageNpwp= @"file:\" + dir + data.PathImageNPWP;
                //string imageIjazah= @"file:\" + dir + data.PathImageIjazah;
                //string imageRekening = @"file:\" + dir + data.PathImageRekening;
                //string imageLain = @"file:\" + dir + data.PathImageLain
                string imageCv = WebConfigurationManager.AppSettings["WebSharedFolderURL"] + data.PathImageCV;
                string imageKtp = WebConfigurationManager.AppSettings["WebSharedFolderURL"] + data.PathImageKTP;
                string imageFoto = WebConfigurationManager.AppSettings["WebSharedFolderURL"] + data.PathImageFoto;
                string imageNpwp = WebConfigurationManager.AppSettings["WebSharedFolderURL"] + data.PathImageNPWP;
                string imageIjazah = WebConfigurationManager.AppSettings["WebSharedFolderURL"] + data.PathImageIjazah;
                string imageRekening = WebConfigurationManager.AppSettings["WebSharedFolderURL"] + data.PathImageRekening;
                string imageLain = WebConfigurationManager.AppSettings["WebSharedFolderURL"] + data.PathImageLain;

                if (imageCv.Contains(".pdf")) imageCv = filePath1;
                if (imageKtp.Contains(".pdf")) imageKtp = filePath1;
                if (imageFoto.Contains(".pdf")) imageFoto = filePath1;
                if (imageNpwp.Contains(".pdf")) imageNpwp = filePath1;
                if (imageIjazah.Contains(".pdf")) imageIjazah = filePath1;
                if (imageRekening.Contains(".pdf")) imageRekening = filePath1;
                if (imageLain.Contains(".pdf")) imageLain = filePath1;
                

                paras[0] = new ReportParameter("image1path", filePath1, false);
                paras[1] = new ReportParameter("ImageCV", imageCv, false);
                paras[2] = new ReportParameter("ImageKTP", imageKtp, false);
                paras[3] = new ReportParameter("ImageFoto", imageFoto, false);
                paras[4] = new ReportParameter("ImageNPWP", imageNpwp, false);
                paras[5] = new ReportParameter("ImageIjazah", imageIjazah, false);
                paras[6] = new ReportParameter("ImageRekening", imageRekening, false);
                paras[7] = new ReportParameter("ImageLain", imageLain, false);
                viewer.LocalReport.SetParameters(paras);


                byte[] bytes = viewer.LocalReport.Render("PDF", null, out mimeType, out encoding, out extension,
                    out streamIds, out warnings);
                Stream stream = new MemoryStream(bytes);


                var fileName =
                    "candidate" + loginName + DateTime.Now.ToString("ddMMyy") + "." + extension; //ddMMyyhhmmss
                //HttpResponseMessage httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK);
                //httpResponseMessage.Content = new StreamContent(stream);
                //httpResponseMessage.Content.Headers.ContentDisposition = new System.Net.Http.Headers.ContentDispositionHeaderValue("attachment");
                //httpResponseMessage.Content.Headers.ContentDisposition.FileName = fileName;
                //httpResponseMessage.Content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("application/octet-stream");

                ////// Now that you have all the bytes representing the PDF report, buffer it and send it to the client.
                //response.Buffer = true;
                //response.Clear();
                //response.ContentType = mimeType;
                //response.AddHeader("content-disposition", "attachment; filename=" + fileName + "." + extension);
                //response.BinaryWrite(bytes); // create the file
                //response.Flush(); // send it to the client to download

                string sPath = WebConfigurationManager.AppSettings["SharedFolderURLPD"];
                //string sPath = AppDomain.CurrentDomain.BaseDirectory + @"File/" + fileName;

                if (!Directory.Exists(sPath)) Directory.CreateDirectory(sPath);
                using (FileStream fs = File.Create(sPath + fileName))
                    // using (FileStream fs = File.Create(sPath + fileName))
                    //using (FileStream fs = File.Create(sPath+"/" + fileName))
                {
                    fs.Write(bytes, 0, bytes.Length);
                }

                File.Copy(sPath + fileName, AppDomain.CurrentDomain.BaseDirectory + @"File/" + fileName, true);
                //File.Copy(sPath + fileName, AppDomain.CurrentDomain.BaseDirectory + @"File/" + fileName, true);

                CandidateDokumenViewModel model = new CandidateDokumenViewModel();
                var uploadRepository = new FileUploadRepository();

                //model.Path = AppDomain.CurrentDomain.BaseDirectory + @"File/" + fileName;
                model.Path = "ERFPDFiles/" + fileName;
                model.FileName = fileName;
                model.LoginName = loginName;
                model.Type = "PDFSUBMIT";

                var checkPdfExist = uploadRepository.GetDokumenPDF(loginName);
                if (checkPdfExist.Count == 0)
                {
                    uploadRepository.UploadDokumen(model);
                }
                else
                {
                    foreach (var elemen in checkPdfExist)
                    {
                        if (elemen.LoginName == loginName && elemen.Type == "PDFSUBMIT")
                        {
                            uploadRepository.UpdateDokumenPDF(model);
                        }

/*                    else
                    {
                        uploadRepository.UploadDokumen(model);
                    }*/
                    }
                }


                var result = new ProcessResult
                {
                    isSucceed = true,
                    message = "OK",
                };
                result.CustomField.Add("filename", fileName);
                return Ok(result);
            }
            catch (Exception e)
            {
                return Ok(e.Message);
            }
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("api/RecruitmentForm/getPDFForCMS")]
        public HttpResponseMessage testdian(string loginName)
        {
            var temp = GeneratePDF2(loginName);
            HttpResponseMessage httpResponseMessage = null;
            httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK);
            httpResponseMessage.Content = new ByteArrayContent(temp);
            httpResponseMessage.Content.Headers.ContentDisposition = new System.Net.Http.Headers.ContentDispositionHeaderValue("attachment");
            httpResponseMessage.Content.Headers.ContentDisposition.FileName = "candidate"+loginName+".pdf";
            httpResponseMessage.Content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("application/octet-stream");
            return httpResponseMessage;
            //return Ok();
        }

        [HttpGet]
        [AllowAnonymous]
        [Route("api/RecruitmentForm/GeneratePDF2")]
        public byte[] GeneratePDF2(string loginName)
        {
            // Variables. dont remove
            Warning[] warnings;
            string[] streamIds;
            string mimeType;
            string encoding;
            string extension;
            try
            {
                recruitmentFormRepository = new RecruitmentFormRepository();
                CandidateDataPribadiViewModel data = recruitmentFormRepository.GetCandidateDataPribadiPDF(loginName);
                if (data.StatusJadwalInterview1 == "SUCCESS")
                {
                    data.IsPassedTheFirst = true;
                }

                if (data.StatusJadwalInterview1 == "OK" || data.StatusJadwalInterview1 == null)
                {
                    if (data.Status == "REJECT")
                    {
                        data.IsNotPassedTheFirst = true;
                    }
                }

                if (data.StatusJadwalInterview2 == "SUCCESS")
                {
                    data.IsPassedTheSecond = true;
                }

                if (data.StatusJadwalInterview1 == "OK" || data.StatusJadwalInterview1 == null)
                {
                    if (data.Status == "REJECT")
                    {
                        data.IsNotPassedTheFirst = true;
                    }
                }

                if (data.Status == "APPROVED")
                {
                    data.IsApproved = true;
                }

                if (data.Status == "REJECT" || data.Status == "REJECT (Leader)")
                {
                    data.IsRejected = true;
                }
                
                DataTable dtCandidateViewModel = ToDataTable<CandidateDataPribadiViewModel>(data);
                var dsCandidate = new DataSet();
                dsCandidate.Tables.Add(dtCandidateViewModel.Copy());


                var dir = AppDomain.CurrentDomain.BaseDirectory;
                // Setup the report viewer object and get the array of bytes
                ReportViewer viewer = new ReportViewer { ProcessingMode = ProcessingMode.Local };
                viewer.LocalReport.ReportPath = dir + @"Content\ReportTemplates\UntitledRecruiter.rdl";
                viewer.LocalReport.EnableExternalImages = true;
                viewer.LocalReport.DataSources.Clear();

                //var dataKontak = recruitmentFormRepository.GetKontak(loginName);
                //DataTable dtKontak = ToDataTable(dataKontak);
                //var dsKontak = new DataSet();
                //dsKontak.Tables.Add(dtKontak.Copy());

                var dsKontak = new DataSet();
                dsKontak.Tables.Add(ToDataTable(recruitmentFormRepository.GetKontakPDF(loginName)).Copy());

                var dataAccount = recruitmentFormRepository.GetAccountForProfilePDF(loginName);
                DataTable dtAccount = ToDataTable(dataAccount);
                var dsAccount = new DataSet();
                dsAccount.Tables.Add(dtAccount.Copy());



                /*            var pdfmodel = new PDFCandidateViewModel();
                            pdfmodel.Gender
                            pdfmodel.IsLaki = pdfmodel.Gender == "L" ? true : false;
                            pdfmodel.IsWantia = pdfmodel.Gender == "L" ?  false:true ;
                 */
                // PDFMODEL.TanggalLahirString =PDFMODEL.tanggallahir.ToString("dd-MM-yyyy");
                //var string = new DateTime().ToString("dd-MM-yyyy");

                var domisili = recruitmentFormRepository.GetCandidateDataDomisili(loginName);
                DataTable dtDomisili = ToDataTable(domisili);
                var dsDomisili = new DataSet();
                dsDomisili.Tables.Add(dtDomisili.Copy());

                var rekeningNPWP = recruitmentFormRepository.GetCandidateDataRekeningNPWPPDF(loginName);
                DataTable dtRekeningNPWP = ToDataTable(rekeningNPWP);
                var dsRekeningNPWP = new DataSet();
                dsRekeningNPWP.Tables.Add(dtRekeningNPWP.Copy());

                PDFCandidateDataKondisiKesehatanViewModel kondisi = recruitmentFormRepository.GetKondisiKesehatanPDF(loginName);
                switch (kondisi.IsSehat)
                {
                    case "Ya":
                        kondisi.YaSehat = true;
                        kondisi.KondisiKesehatan = "";
                        break;

                    case "Tidak":
                        kondisi.TidakSehat = true;
                        break;
                }

                switch (kondisi.IsPernahDirawat)
                {
                    case "Ya":
                        kondisi.YaPernahDirawat = true;
                        var tahunDirawat = kondisi.TanggalSakit.Year;
                        var bulanDirawat = kondisi.TanggalSakit.Month;
                        kondisi.TanggalSakitConvert = bulanDirawat + " / " + tahunDirawat;
                        break;

                    case "Tidak":
                        kondisi.TidakPernahDirawat = true;
                        kondisi.TanggalSakitConvert = "";
                        break;
                }

                switch (kondisi.IsHamil)
                {
                    case "Ya":
                        kondisi.YaHamil = true;
                        break;

                    case "Tidak":
                        kondisi.TidakHamil = true;
                        break;
                }

                DataTable dtKondisi = ToDataTable<PDFCandidateDataKondisiKesehatanViewModel>(kondisi);
                var dsKondisi = new DataSet();
                dsKondisi.Tables.Add(dtKondisi.Copy());

                PDFCandidateDataRencanaPribadiViewModel rencanaPribadi = recruitmentFormRepository.GetRencanaPribadiPDF(loginName);
                switch (rencanaPribadi.RencanaMenikah)
                {
                    case "Ya":
                        rencanaPribadi.YaBerencanaMenikah = true;
                        var tahunMenikah = rencanaPribadi.TanggalRencanaMenikah.Year;
                        var bulanMenikah = rencanaPribadi.TanggalRencanaMenikah.Month;
                        rencanaPribadi.TanggalRencanaMenikahConvert = bulanMenikah + " / " + tahunMenikah;
                        break;

                    case "Tidak":
                        rencanaPribadi.TidakBerencanaMenikah = true;
                        rencanaPribadi.TanggalRencanaMenikahConvert = "";
                        break;
                }

                switch (rencanaPribadi.RencanaPunyaAnak)
                {
                    case "Ya":
                        rencanaPribadi.YaBerencanaPunyaAnak = true;
                        var tahunAnak = rencanaPribadi.TanggalRencanaPunyaAnak.Year;
                        var bulanAnak = rencanaPribadi.TanggalRencanaPunyaAnak.Month;
                        rencanaPribadi.TanggalRencanaPunyaAnakConvert = bulanAnak + " / " + tahunAnak;
                        break;

                    case "Tidak":
                        rencanaPribadi.TidakBerencanaPunyaAnak = true;
                        rencanaPribadi.TanggalRencanaPunyaAnakConvert = "";
                        break;
                }
                switch (rencanaPribadi.RencanaLanjutKuliah)
                {
                    case "Ya":
                        rencanaPribadi.YaBerencanaLanjutKuliah = true;
                        var tahunKuliah = rencanaPribadi.TanggalRencanaKuliah.Year;
                        var bulanKuliah = rencanaPribadi.TanggalRencanaKuliah.Month;
                        rencanaPribadi.TanggalRencanaKuliahConvert = bulanKuliah + " / " + tahunKuliah;
                        break;

                    case "Tidak":
                        rencanaPribadi.TidakBerencanaLanjutKuliah = true;
                        rencanaPribadi.TanggalRencanaKuliahConvert = "";
                        break;
                }
                switch (rencanaPribadi.RencanaNaikHaji)
                {
                    case "Ya":
                        rencanaPribadi.YaBerencanaNaikHaji = true;
                        var tahunHaji = rencanaPribadi.TanggalRencanaNaikHaji.Year;
                        var bulanHaji = rencanaPribadi.TanggalRencanaNaikHaji.Month;
                        rencanaPribadi.TanggalRencanaNaikHajiConvert = bulanHaji + " / " + tahunHaji;
                        break;

                    case "Tidak":
                        rencanaPribadi.TidakBerencanaNaikHaji = true;
                        rencanaPribadi.TanggalRencanaNaikHajiConvert = "";
                        break;
                }


                DataTable dtrencanaPribadi = ToDataTable<PDFCandidateDataRencanaPribadiViewModel>(rencanaPribadi);
                var dsRencanaPribadi = new DataSet();
                dsRencanaPribadi.Tables.Add(dtrencanaPribadi.Copy());

                var dsKeluarga = new DataSet();
                dsKeluarga.Tables.Add(ToDataTable(recruitmentFormRepository.GetCandidateDataKeluargaPDF(loginName))
                    .Copy());

                var ibu = recruitmentFormRepository.GetCandidateDataIbu(loginName);
                DataTable dtIbu = ToDataTable(ibu);
                var dsIbu = new DataSet();
                dsIbu.Tables.Add(dtIbu.Copy());

                var spouse = recruitmentFormRepository.GetCandidateDataSpouse(loginName);
                DataTable dtSpouse = ToDataTable(spouse);
                var dsSpouse = new DataSet();
                dsSpouse.Tables.Add(dtSpouse.Copy());

                var pendidikan = recruitmentFormRepository.GetCandidateDataPendidikanPDF(loginName);
                DataTable dtPendidikan = ToDataTable(pendidikan);
                var dsPendidikan = new DataSet();
                dsPendidikan.Tables.Add(dtPendidikan.Copy());

                var pendidikanNon = recruitmentFormRepository.GetCandidateDataPendidikanNonPDF(loginName);
                DataTable dtPendidikanNon = ToDataTable(pendidikanNon);
                var dsPendidikanNon = new DataSet();
                dsPendidikanNon.Tables.Add(dtPendidikanNon.Copy());

                var organisasi = recruitmentFormRepository.GetCandidateExperienceOrganisasi(loginName);
                DataTable dtOrganisasi = ToDataTable(organisasi);
                var dsOrganisasi = new DataSet();
                dsOrganisasi.Tables.Add(dtOrganisasi.Copy());

                var prestasi = recruitmentFormRepository.GetCandidateExperiencePrestasi(loginName);
                DataTable dtPrestasi = ToDataTable(prestasi);
                var dsPrestasi = new DataSet();
                dsPrestasi.Tables.Add(dtPrestasi.Copy());

                List<CandidateExperienceKeahlianViewModel> keahlian = recruitmentFormRepository.GetCandidateExperienceKeahlian(loginName);
                DataTable dtKeahlian = ToDataTable(keahlian);
                var dsKeahlian = new DataSet();
                dsKeahlian.Tables.Add(dtKeahlian.Copy());

                List<CandidateExperiencePlusMinViewModel> plusmin = recruitmentFormRepository.GetCandidateExperiencePlusMin(loginName);
                DataTable dtPlusmin = ToDataTable(plusmin);
                var dsPlusmin = new DataSet();
                dsPlusmin.Tables.Add(dtPlusmin.Copy());

                PDFCandidateDataPribadiViewModel gender = recruitmentFormRepository.GetGenderPDF(loginName);
                if (gender.JenisKelamin == "M")
                {
                    gender.IsMale = true;
                }
                else if (gender.JenisKelamin == "F")
                {
                    gender.IsFemale = true;
                }

                DataTable dtGender = ToDataTable<PDFCandidateDataPribadiViewModel>(gender);
                var dsGender = new DataSet();
                dsGender.Tables.Add(dtGender.Copy());

                PDFCandidateDataPribadiViewModel statusPernikahan =
                    recruitmentFormRepository.GetStatusPernikahanPDF(loginName);
                if (statusPernikahan.StatusPernikahan == "BM")
                {
                    statusPernikahan.IsSingle = true;
                }
                else if (statusPernikahan.StatusPernikahan == "ME")
                {
                    statusPernikahan.IsMarried = true;
                }
                else if (statusPernikahan.StatusPernikahan == "JA" || statusPernikahan.StatusPernikahan == "DA")
                {
                    statusPernikahan.IsWidowed = true;
                }

                DataTable dtStatusPernikahan = ToDataTable<PDFCandidateDataPribadiViewModel>(statusPernikahan);
                var dsStatusPernikahan = new DataSet();
                dsStatusPernikahan.Tables.Add(dtStatusPernikahan.Copy());

                var bahasa = recruitmentFormRepository.GetExperienceBahasaPDF(loginName);
                foreach (var elemen in bahasa)
                {

                    switch (elemen.Membaca)
                    {
                        case "SANGAT BAIK":
                            elemen.IsMembacaSangatBaik = true;
                            break;
                        case "BAIK":
                            elemen.IsMembacaBaik = true;
                            break;
                        case "CUKUP":
                            elemen.IsMembacaCukup = true;
                            break;
                        case "KURANG":
                            elemen.IsMembacaKurang = true;
                            break;
                    }

                    switch (elemen.Menulis)
                    {
                        case "SANGAT BAIK":
                            elemen.IsMenulisSangatBaik = true;
                            break;
                        case "BAIK":
                            elemen.IsMenulisBaik = true;
                            break;
                        case "CUKUP":
                            elemen.IsMenulisCukup = true;
                            break;
                        case "KURANG":
                            elemen.IsMenulisKurang = true;
                            break;
                    }

                    switch (elemen.Berbicara)
                    {
                        case "SANGAT BAIK":
                            elemen.IsBerbicaraSangatBaik = true;
                            break;
                        case "BAIK":
                            elemen.IsBerbicaraBaik = true;
                            break;
                        case "CUKUP":
                            elemen.IsBerbicaraCukup = true;
                            break;
                        case "KURANG":
                            elemen.IsBerbicaraKurang = true;
                            break;
                    }

                }
                DataTable dtBahasa = ToDataTable(bahasa);
                var dsBahasa = new DataSet();
                dsBahasa.Tables.Add(dtBahasa.Copy());

                viewer.LocalReport.DataSources.Add(new ReportDataSource("Bahasa", dsBahasa.Tables[0]));


                var minat = recruitmentFormRepository.GetCandidateExperienceMinat(loginName);
                DataTable dtMinat = ToDataTable(minat);
                var dsMinat = new DataSet();
                dsMinat.Tables.Add(dtMinat.Copy());

                var pekerjaan = recruitmentFormRepository.GetCandidateExperiencePekerjaan(loginName);
                DataTable dtPekerjaan = ToDataTable(pekerjaan);
                var dsPekerjaan = new DataSet();
                dsPekerjaan.Tables.Add(dtPekerjaan.Copy());

                var channelData = recruitmentFormRepository.GetLokasiHirarki(loginName);
                switch (channelData.Channel)
                {
                    case "C1":
                        channelData.IsDMTM = true;
                        break;
                    case "C2":
                        channelData.IsInBranch = true;
                        break;
                    case "C3":
                        channelData.IsLainnya = true;
                        break;
                }
                switch (channelData.Region)
                {
                    case "JAKARTA REGION":
                        channelData.IsInJakarta = true;
                        break;
                    case "OUT REGION":
                        channelData.IsOutJakarta = true;
                        break;
                }
                switch (channelData.Kota)
                {
                    case "KOTA BESAR":
                        channelData.IsBesar = true;
                        break;
                    case "KOTA KECIL":
                        channelData.IsKecil = true;
                        break;
                }
                DataTable dtChannelData = ToDataTable<LokasiDanHirarkiViewModelPDF>(channelData);
                var dsChannelData = new DataSet();
                dsChannelData.Tables.Add(dtChannelData.Copy());

                var posisiData = recruitmentFormRepository.GetLokasiHirarki(loginName);
                switch (posisiData.Posisi)
                {
                    case "IA":
                        posisiData.IsIA = true;
                        posisiData.Leader = "ASM";
                        break;
                    case "SIA":
                        posisiData.IsSIA = true;
                        posisiData.Leader = "ASM";
                        break;
                    case "EIA":
                        posisiData.IsEIA = true;
                        posisiData.Leader = "ASM";
                        break;
                    case "ASM":
                        posisiData.IsASM = true;
                        posisiData.Leader = "RSM";
                        break;
                    case "SASM":
                        posisiData.IsSASM = true;
                        posisiData.Leader = "RSM";
                        break;
                    case "EASM":
                        posisiData.IsEASM = true;
                        posisiData.Leader = "RSM";
                        break;
                    case "RSM":
                        posisiData.IsRSM = true;
                        break;
                    case "TMR":
                        posisiData.IsTMR = true;
                        posisiData.Leader = "ASM";
                        break;
                    case "STMR":
                        posisiData.IsSTMR = true;
                        posisiData.Leader = "ASM";
                        break;
                    case "ETMR":
                        posisiData.IsETMR = true;
                        posisiData.Leader = "ASM";
                        break;
                    case "PTMR":
                        posisiData.IsPTMR = true;
                        posisiData.Leader = "ASM";
                        break;
                    case "GL":
                        posisiData.IsGL = true;
                        posisiData.Leader = "RSM";
                        break;
                   case "SGL":
                        posisiData.IsSGL = true;
                        posisiData.Leader = "RSM";
                        break;
                   case "EGL":
                        posisiData.IsEGL = true;
                        posisiData.Leader = "RSM";
                        break;
                   case "LAINNYA":
                        posisiData.IsLAINNYA = true;
                        break;
                }
                DataTable dtPosisiData = ToDataTable<LokasiDanHirarkiViewModelPDF>(posisiData);
                var dsPosisiData = new DataSet();
                dsPosisiData.Tables.Add(dtPosisiData.Copy());

                var namaSubBranch = recruitmentFormRepository.GetSubBranchName(loginName);
                DataTable dtNamaSubBranch = ToDataTable<LokasiDanHirarkiViewModelPDF>(namaSubBranch);
                var dsNamaSubBranch = new DataSet();
                dsNamaSubBranch.Tables.Add(dtNamaSubBranch.Copy());

                var namaInterviewer = recruitmentFormRepository.GetJadwalInterview(loginName);
                DataTable dtNamaInterviewer = ToDataTable<JadwalInterviewViewModel>(namaInterviewer);
                var dsNamaInterviewer = new DataSet();
                dsNamaInterviewer.Tables.Add(dtNamaInterviewer.Copy());


                //RDLC FILE CAN CONTAIN MULTIPLE DATASOURCES 
                viewer.LocalReport.DataSources.Add(new ReportDataSource("Candidate", dsCandidate.Tables[0]));
                viewer.LocalReport.DataSources.Add(new ReportDataSource("Kontak", dsKontak.Tables[0]));
                viewer.LocalReport.DataSources.Add(new ReportDataSource("Account", dsAccount.Tables[0]));
                viewer.LocalReport.DataSources.Add(new ReportDataSource("Domisili", dsDomisili.Tables[0]));
                viewer.LocalReport.DataSources.Add(new ReportDataSource("Keluarga", dsKeluarga.Tables[0]));
                viewer.LocalReport.DataSources.Add(new ReportDataSource("Ibu", dsIbu.Tables[0]));
                viewer.LocalReport.DataSources.Add(new ReportDataSource("Spouse", dsSpouse.Tables[0]));
                viewer.LocalReport.DataSources.Add(new ReportDataSource("Pendidikan", dsPendidikan.Tables[0]));
                viewer.LocalReport.DataSources.Add(new ReportDataSource("PendidikanNon", dsPendidikanNon.Tables[0]));
                viewer.LocalReport.DataSources.Add(new ReportDataSource("Organisasi", dsOrganisasi.Tables[0]));
                viewer.LocalReport.DataSources.Add(new ReportDataSource("Prestasi", dsPrestasi.Tables[0]));
                viewer.LocalReport.DataSources.Add(new ReportDataSource("Keahlian", dsKeahlian.Tables[0]));
                viewer.LocalReport.DataSources.Add(new ReportDataSource("PlusMin", dsPlusmin.Tables[0]));
                viewer.LocalReport.DataSources.Add(new ReportDataSource("Gender", dsGender.Tables[0]));
                viewer.LocalReport.DataSources.Add(new ReportDataSource("StatusPernikahan",
                    dsStatusPernikahan.Tables[0]));
                viewer.LocalReport.DataSources.Add(new ReportDataSource("Minat", dsMinat.Tables[0]));
                viewer.LocalReport.DataSources.Add(new ReportDataSource("Pekerjaan", dsPekerjaan.Tables[0]));
                viewer.LocalReport.DataSources.Add(new ReportDataSource("RekeningNPWP", dsRekeningNPWP.Tables[0]));
                viewer.LocalReport.DataSources.Add(new ReportDataSource("KondisiKesehatan", dsKondisi.Tables[0]));
                viewer.LocalReport.DataSources.Add(new ReportDataSource("RencanaPribadi", dsRencanaPribadi.Tables[0]));
                viewer.LocalReport.DataSources.Add(new ReportDataSource("Channel", dsChannelData.Tables[0]));
                viewer.LocalReport.DataSources.Add(new ReportDataSource("Posisi", dsPosisiData.Tables[0]));
                viewer.LocalReport.DataSources.Add(new ReportDataSource("NamaBranch", dsNamaSubBranch.Tables[0]));
                viewer.LocalReport.DataSources.Add(new ReportDataSource("Interviewer", dsNamaInterviewer.Tables[0]));
                /*viewer.LocalReport.DataSources.Add(new ReportDataSource("image", dsDokumenCv.Tables[0]));*/



                //buat image dibikin parameter. define disini dulu di report builder tinggal masukin di parameter
                ReportParameter[] paras = new ReportParameter[4];
                string filePath1 = @"file:\" + dir + @"\Content\Images\img-cat.jpg";
                //string imageCv = @"file:\" + dir + data.PathImageCV;
                string imageKtp = @"file:\" + dir + data.PathImageKTP;
                string imageFoto = @"file:\" + dir + data.PathImageFoto;
                string imageNpwp = @"file:\" + dir + data.PathImageNPWP;

                paras[0] = new ReportParameter("image1path", filePath1, false);
                //paras[1] = new ReportParameter("ImageCV", imageCv, false);
                paras[1] = new ReportParameter("ImageKTP", imageKtp, false);
                paras[2] = new ReportParameter("ImageFoto", imageFoto, false);
                paras[3] = new ReportParameter("ImageNPWP", imageNpwp, false);
                
                viewer.LocalReport.SetParameters(paras);



                byte[] bytes = viewer.LocalReport.Render("PDF", null, out mimeType, out encoding, out extension,
                    out streamIds, out warnings);
                Stream stream = new MemoryStream(bytes);


                var fileName =
                    "candidate" + loginName + DateTime.Now.ToString("ddMMyy") + "." + extension; //ddMMyyhhmmss
                          
                return bytes;
            }
            catch (Exception e)
            {
                return new byte[]{};
            }
        }

        public void WriteLog(CandidateViewModel model)
        {
            StreamWriter log;
            FileStream fileStream = null;
            DirectoryInfo logDirInfo = null;
            FileInfo logFileInfo;

            string dirProject = System.AppDomain.CurrentDomain.BaseDirectory;
            string logFilePath = dirProject + "Log\\";
            logFilePath = logFilePath + model.RecruiterAgentCode + "_web_" + model.AgentName + "_" + DateTime.Now.ToString("dd-MM-yyyy hh-mm-ss tt") + "." + "txt";
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

            string json = JsonConvert.SerializeObject(model, Formatting.Indented);
            log.Write(json);
            log.Close();
        }

        #region DataTable stuff
        private static DataTable ToDataTable<T>(IList<T> data)
        {
            PropertyDescriptorCollection properties = TypeDescriptor.GetProperties(typeof(T));
            DataTable table = new DataTable();
            foreach (PropertyDescriptor prop in properties)
            {
                table.Columns.Add(prop.Name, Nullable.GetUnderlyingType(prop.PropertyType) ?? prop.PropertyType);
            }
            foreach (T item in data)
            {
                DataRow row = table.NewRow();
                foreach (PropertyDescriptor prop in properties)
                    row[prop.Name] = prop.GetValue(item) ?? DBNull.Value;
                table.Rows.Add(row);
            }
            return table;
        }

        private static DataTable ToDataTable<T>(object item)
        {
            PropertyDescriptorCollection properties = TypeDescriptor.GetProperties(typeof(T));
            DataTable table = new DataTable();
            foreach (PropertyDescriptor prop in properties)
            {
                table.Columns.Add(prop.Name, Nullable.GetUnderlyingType(prop.PropertyType) ?? prop.PropertyType);
            }
                DataRow row = table.NewRow();
                foreach (PropertyDescriptor prop in properties)
                    row[prop.Name] = prop.GetValue(item) ?? DBNull.Value;
                table.Rows.Add(row);
            return table;
        }

        //private static DataTable AddImageColumn( lstImages)
        //{
        //        dt.Columns.Add(column);
        //    DataRow row = table.NewRow();
        //    foreach (PropertyDescriptor prop in properties)
        //        row[prop.Name] = prop.GetValue(item) ?? DBNull.Value;
        //    table.Rows.Add(row);
        //    return table;
        //}
        #endregion
    }
}