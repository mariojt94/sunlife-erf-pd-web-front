using Dapper;
using ERC.Repository.Helper;
using ERC.Repository.Resources;
using ERC.Repository.ViewModel;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;
using System.Xml.Serialization;
using DocumentFormat.OpenXml.Bibliography;

namespace ERC.Repository.Repository
{
    public class RecruitmentFormRepository : BaseRepository
    {
        NotificationHelper NotificationHelper = new NotificationHelper();

        public List<CandidateViewModel> GetListCandidateDetail()
        {
            var list = new List<CandidateViewModel>();
            var sql = @"select a.ID from (
                        select ID, case when(UpdateReSubmitDate is null) then SubmitDate else UpdateReSubmitDate end [submitdate] from candidate
                        where submitdate is not null) a order by a.submitdate desc";
            using (var cnn = OpenSunLifeDB())
            {
                var data = cnn.Query<int>(sql);
                if (data.Count() > 0)
                {
                    foreach (var item in data)
                    {
                        XmlSerializer serializer = new XmlSerializer(typeof(CandidateViewModel));
                        var xmlString = GetDataDC(item);
                        using (TextReader reader = new StringReader(xmlString))
                        {
                            CandidateViewModel currentData = (CandidateViewModel) serializer.Deserialize(reader);

                            list.Add(currentData);
                        }
                    }
                }
            }

            return list;
        }

        public List<ReferralCodeViewModel> GetRecruitmentSource()
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.Query<ReferralCodeViewModel>(DbQuery.GetRecruitmentSource).ToList();
            }
        }

        public List<AgamaViewModel> GetAgama()
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.Query<AgamaViewModel>(DbQuery.GetAgama).ToList();
            }
        }

        public List<GenderViewModel> GetGender()
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.Query<GenderViewModel>(DbQuery.GetGender).ToList();
            }
        }

        public List<StatusPerkawinanViewModel> GetStatusPerkawinan()
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.Query<StatusPerkawinanViewModel>(DbQuery.GetStatusPerkawinan).ToList();
            }
        }
        public List<DataPTKPViewModel> GetDataPTKP()
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.Query<DataPTKPViewModel>(DbQuery.GetDataPTKP).ToList();
            }
        }

        public List<CandidateDataPribadiViewModel> GetCandidateDataPribadi(string loginName)
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.Query<CandidateDataPribadiViewModel>(DbQuery.GetCandidateDataPribadi,
                    new {loginName = loginName}).ToList();
            }
        }
        public List<CandidateDataPribadiViewModel> GetStatusAppNotif(string loginName)
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.Query<CandidateDataPribadiViewModel>(DbQuery.GetStatusAppNotif,
                    new {loginName = loginName}).ToList();
            }
        }

        public CandidateDataPribadiViewModel GetCandidateDataPribadiPDF(string loginName)
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.Query<CandidateDataPribadiViewModel>(DbQuery.GetCandidateDataPribadiPDF,
                    new {loginName = loginName}).FirstOrDefault();
            }
        }


        public List<CandidateDataDomisiliViewModel> GetCandidateDataDomisili(string loginName)
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.Query<CandidateDataDomisiliViewModel>(DbQuery.GetCandidateDataDomisili,
                    new {loginName = loginName}).ToList();
            }
        }

        public List<CandidateDataRekeningNpwpViewModel> GetCandidateDataRekeningNPWP(string loginName)
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.Query<CandidateDataRekeningNpwpViewModel>(DbQuery.GetCandidateDataRekeningNPWP,
                    new {loginName = loginName}).ToList();
            }
        }
        public List<CandidateDataRekeningNpwpViewModel> GetCandidateDataRekeningNPWPPDF(string loginName)
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.Query<CandidateDataRekeningNpwpViewModel>(DbQuery.GetCandidateDataRekeningNPWPPDF,
                    new {loginName = loginName}).ToList();
            }
        }

        public List<CandidateDataKondisiKesehatanViewModel> GetCandidateDataKondisiKesehatan(string loginName)
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.Query<CandidateDataKondisiKesehatanViewModel>(DbQuery.GetCandidateDataKondisiKesehatan,
                    new {loginName = loginName}).ToList();
            }
        }

        public List<CandidateDataRencanaPribadiViewModel> GetCandidateDataRencanaPribadi(string loginName)
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.Query<CandidateDataRencanaPribadiViewModel>(DbQuery.GetCandidateDataRencanaPribadi,
                    new {loginName = loginName}).ToList();
            }
        }
        public List<CandidateDataPTKPViewModel> GetCandidateDataPTKP(string loginName)
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.Query<CandidateDataPTKPViewModel>(DbQuery.GetCandidateDataPTKP,
                    new {loginName = loginName}).ToList();
            }
        }

        public string AddCandidate(CandidateDataPribadiViewModel data)
        {
            if (data.TanggalLahir.HasValue)
                data.TanggalLahir = data.TanggalLahir.Value.ToLocalTime();
            var status = "SUBMIT";
            using (var cnn = OpenSunLifeDB())
            {
                var testLoginName = cnn.QueryFirstOrDefault<string>(
                    "SELECT LoginName FROM CandidateDataPribadi where LoginName = @loginName",
                    new {loginName = data.LoginName});

                if (testLoginName != null)
                {
                    cnn.Execute(DbQuery.UpdateCandidate, new
                    {
                        loginName = data.LoginName.ToUpper(),
                        namaLengkap = data.NamaLengkap.ToUpper(),
                        alamat = data.Alamat.ToUpper(),
                        kota = data.Kota.ToUpper(),
                        kodePos = data.KodePos,
                        rw = data.Rw,
                        rt = data.Rt,
                        provinsi = data.Provinsi.ToUpper(),
                        jenisKelamin = data.JenisKelamin,
                        tempatLahir = data.TempatLahir.ToUpper(),
                        tanggalLahir = data.TanggalLahir,
                        agama = data.Agama.ToUpper(),
                        statusPernikahan = data.StatusPernikahan.ToUpper(),
                        tinggiBadan = data.TinggiBadan,
                        beratBadan = data.BeratBadan,
                        data.NoKtp,
                        /*bank = data.Bank,*/
                        tanggalUpdate = DateTime.Now
                    });
                }
                else
                {
                    cnn.Execute(DbQuery.AddCandidate, new
                    {   namaLengkap = data.NamaLengkap.ToUpper(),
                        alamat = data.Alamat.ToUpper(),
                        kota = data.Kota.ToUpper(),
                        kodePos = data.KodePos,
                        rw = data.Rw,
                        rt = data.Rt,
                        provinsi = data.Provinsi.ToUpper(),
                        loginName = data.LoginName.ToUpper(),
                        jenisKelamin = data.JenisKelamin,
                        tempatLahir = data.TempatLahir.ToUpper(),
                        tanggalLahir = data.TanggalLahir,
                        agama = data.Agama.ToUpper(),
                        statusPernikahan = data.StatusPernikahan.ToUpper(),
                        tinggiBadan = data.TinggiBadan,
                        beratBadan = data.BeratBadan,
                        data.NoKtp,
                        /* bank = data.Bank.ToUpper(),*/
                        //status = data.Status.ToUpper(),
                        tanggalSubmit = DateTime.Now,
                        tanggalUpdate = DateTime.Now,
                        changedBy = data.ChangedBy,
                        rejectBy = data.RejectBy,
                        allLeaderApproved = data.AllLeaderApproved,
                        isDeleted = data.IsDeleted,
                        temporaryAgentCode = data.LoginName.ToUpper()
                     
                    });
                }
            }

            return status;
        }

        public int UpdateAccountDetails(CandidateDataPribadiViewModel data)
        {
            int result;
            using (var cnn = OpenSunLifeDB())
            {
                result=  cnn.Execute(DbQuery.UpdateAccountDetails, new
                {
                    data.PhoneNo,
                    data.Email,
                    data.LoginName
                });
            }

            return result;
        }

        public string AddCandidateDataDomisili(CandidateDataDomisiliViewModel data)
        {
            var status = "SUBMIT";
            using (IDbConnection cnn = OpenSunLifeDB())
            {
                var testLoginName = cnn.QueryFirstOrDefault<string>(
                    "SELECT LoginName FROM CandidateDataDomisili where LoginName = @loginName",
                    new {loginName = data.LoginName});
                if (testLoginName != null)
                {
                    cnn.Execute(DbQuery.UpdateCandidateDomisili, new
                    {
                        
                        alamat = data.Alamat.ToUpper(),
                        kota = data.Kota.ToUpper(),
                        kodepos = data.KodePos,
                        rw = data.Rw,
                        rt = data.Rt,
                        provinsi = data.Provinsi,
                        loginName = data.LoginName.ToUpper(),
/*                        jenisKelamin = data.JenisKelamin,
                        namaLengkap = data.NamaLengkap.ToUpper(),
                        tempatLahir = data.TempatLahir.ToUpper(),
                        tanggalLahir = data.TanggalLahir,*/
/*                        agama = data.Agama.ToUpper(),
                        statusPernikahan = data.StatusPernikahan.ToUpper(),
                        tinggiBadan = data.TinggiBadan,
                        beratBadan = data.BeratBadan,
                        bank = data.Bank*/
                    });
                }
                else
                {
                    cnn.Execute(DbQuery.AddCandidateDataDomisili, new
                    {
                        
                        alamat = data.Alamat.ToUpper(),
                        kota = data.Kota.ToUpper(),
                        kodepos = data.KodePos,
                        rw = data.Rw,
                        rt = data.Rt,
                        provinsi = data.Provinsi,
                        loginName = data.LoginName.ToUpper(),
/*                        namaLengkap = data.NamaLengkap.ToUpper(),
                        jenisKelamin = data.JenisKelamin,
                        tempatLahir = data.TempatLahir.ToUpper(),
                        tanggalLahir = data.TanggalLahir,*/
/*                        agama = data.Agama.ToUpper(),
                        statusPernikahan = data.StatusPernikahan.ToUpper(),
                        tinggiBadan = data.TinggiBadan,
                        beratBadan = data.BeratBadan,
                        bank = data.Bank*/
                    });
                }
            }

            return status;
        }

        public string AddCandidateRekeningNpwp(CandidateDataRekeningNpwpViewModel data)
        {
            if (!String.IsNullOrEmpty(data.NamaBank))
                data.NamaBank = data.NamaBank.ToUpper();
            if (!String.IsNullOrEmpty(data.CabangBank))
                data.CabangBank = data.CabangBank.ToUpper();
            if (!String.IsNullOrEmpty(data.NamaDiRekening))
                data.NamaDiRekening = data.NamaDiRekening.ToUpper();
            if (!String.IsNullOrEmpty(data.NamaWajibPajak))
                data.NamaWajibPajak = data.NamaWajibPajak.ToUpper();
            if (!String.IsNullOrEmpty(data.HubunganDgWajibPajak))
                data.HubunganDgWajibPajak = data.HubunganDgWajibPajak.ToUpper();
            if (!String.IsNullOrEmpty(data.LoginName))
                data.LoginName = data.LoginName.ToUpper();
            if (!String.IsNullOrEmpty(data.AlamatNpwp))
                data.AlamatNpwp = data.AlamatNpwp.ToUpper();

            var status = "SUBMIT";
            using (IDbConnection cnn = OpenSunLifeDB())
            {
                var testLoginName = cnn.QueryFirstOrDefault<string>(
                    "SELECT LoginName FROM CandidateDataRekeningNPWP WHERE LoginName = @loginName",
                    new { loginName = data.LoginName });
                if (testLoginName != null)
                {
                    cnn.Execute(DbQuery.UpdateCandidateRekeningNpwp, new
                    {
                        namaBank = data.NamaBank,
                        cabangBank = data.CabangBank,
                        nomorRekening = data.NomorRekening,
                        namaDiRekening = data.NamaDiRekening,
                        nomorNPWP = data.NomorNPWP,
                        namaWajibPajak = data.NamaWajibPajak,
                        hubunganDgWajibPajak = data.HubunganDgWajibPajak,
                        loginName = data.LoginName,
                        alamatNpwp = data.AlamatNpwp,
                        tanggalUpdate = DateTime.Now
                    });
                }
                else
                {
                    cnn.Execute(DbQuery.AddCandidateRekeningNpwp, new
                    {
                        namaBank = data.NamaBank,
                        cabangBank = data.CabangBank,
                        nomorRekening = data.NomorRekening,
                        namaDiRekening = data.NamaDiRekening,
                        nomorNPWP = data.NomorNPWP,
                        namaWajibPajak = data.NamaWajibPajak,
                        hubunganDgWajibPajak = data.HubunganDgWajibPajak,
                        loginName = data.LoginName,
                        alamatNpwp = data.AlamatNpwp,
                        tanggalUpdate = DateTime.Now,
                        tanggalSubmit = DateTime.Now
                    });
                }
            }
            return status;
        }

        public string AddCandidateKondisiKesehatan(CandidateDataKondisiKesehatanViewModel data)
        {
            if (!String.IsNullOrEmpty(data.KondisiKesehatan))
                data.KondisiKesehatan = data.KondisiKesehatan.ToUpper();
            if (!String.IsNullOrEmpty(data.Penyakit))
                data.Penyakit = data.Penyakit.ToUpper();
            if (!String.IsNullOrEmpty(data.RS))
                data.RS = data.RS.ToUpper();
            if (data.TanggalSakit.HasValue)
                data.TanggalSakit = data.TanggalSakit.Value.ToLocalTime();
            var status = "SUBMIT";
            using (IDbConnection cnn = OpenSunLifeDB())
            {
                var testLoginName = cnn.QueryFirstOrDefault<string>(
                    "SELECT LoginName FROM CandidateDataKondisiKesehatan WHERE LoginName = @loginName",
                    new { loginName = data.LoginName });
                if (testLoginName != null)
                {
                    cnn.Execute(DbQuery.UpdateCandidateKondisiKesehatan, new
                    {
                        isSehat = data.IsSehat,
                        loginName = data.LoginName,
                        kondisiKesehatan = data.KondisiKesehatan,
                        isPernahDirawat = data.IsPernahDirawat,
                        penyakit = data.Penyakit,
                        tanggalSakit = data.TanggalSakit,
                        rs = data.RS,
                        lamaDirawat = data.LamaDirawat,
                        isKambuh = data.IsKambuh,
                        isHamil = data.IsHamil,
                        tanggalUpdate = DateTime.Now
                    });
                }
                else
                {
                    cnn.Execute(DbQuery.AddCandidateKondisiKesehatan, new
                    {
                        isSehat = data.IsSehat,
                        loginName = data.LoginName,
                        kondisiKesehatan = data.KondisiKesehatan,
                        isPernahDirawat = data.IsPernahDirawat,
                        penyakit = data.Penyakit,
                        tanggalSakit = data.TanggalSakit,
                        rs = data.RS,
                        lamaDirawat = data.LamaDirawat,
                        isKambuh = data.IsKambuh,
                        isHamil = data.IsHamil,
                        tanggalUpdate = DateTime.Now,
                        tanggalSubmit = DateTime.Now
                    });
                }
            }
            return status;
        }

        public string AddCandidateRencanaPribadi(CandidateDataRencanaPribadiViewModel data)
        {
            var status = "SUBMIT";
            if (data.TanggalRencanaNaikHaji.HasValue)
                data.TanggalRencanaNaikHaji = data.TanggalRencanaNaikHaji.Value.ToLocalTime();
            if (data.TanggalRencanaKuliah.HasValue)
                data.TanggalRencanaKuliah = data.TanggalRencanaKuliah.Value.ToLocalTime();
            if (data.TanggalRencanaPunyaAnak.HasValue)
                data.TanggalRencanaPunyaAnak = data.TanggalRencanaPunyaAnak.Value.ToLocalTime();
            if (data.TanggalRencanaMenikah.HasValue)
                data.TanggalRencanaMenikah = data.TanggalRencanaMenikah.Value.ToLocalTime();

            using (IDbConnection cnn = OpenSunLifeDB())
            {
                var testLoginName = cnn.QueryFirstOrDefault<string>(
                    "SELECT LoginName FROM CandidateDataRencanaPribadi WHERE LoginName = @loginName",
                    new { loginName = data.LoginName });
                if (testLoginName != null)
                {
                    cnn.Execute(DbQuery.UpdateCandidateRencanaPribadi, new
                    {
                        rencanaMenikah = data.RencanaMenikah,
                        loginName = data.LoginName,
                        rencanaPunyaAnak = data.RencanaPunyaAnak,
                        rencanaLanjutKuliah = data.RencanaLanjutKuliah,
                        rencanaNaikHaji = data.RencanaNaikHaji,
                        tanggalRencanaNaikHaji = data.TanggalRencanaNaikHaji,
                        tanggalRencanaKuliah = data.TanggalRencanaKuliah,
                        tanggalRencanaPunyaAnak = data.TanggalRencanaPunyaAnak,
                        tanggalRencanaMenikah = data.TanggalRencanaMenikah,
                        tanggalUpdate = DateTime.Now,
                    });
                }
                else
                {
                    cnn.Execute(DbQuery.AddCandidateRencanaPribadi, new
                    {
                        loginName = data.LoginName,
                        rencanaMenikah = data.RencanaMenikah,
                        rencanaPunyaAnak = data.RencanaPunyaAnak,
                        rencanaLanjutKuliah = data.RencanaLanjutKuliah,
                        rencanaNaikHaji = data.RencanaNaikHaji,
                        tanggalRencanaNaikHaji = data.TanggalRencanaNaikHaji,
                        tanggalRencanaKuliah = data.TanggalRencanaKuliah,
                        tanggalRencanaPunyaAnak = data.TanggalRencanaPunyaAnak,
                        tanggalRencanaMenikah = data.TanggalRencanaMenikah,
                        tanggalUpdate = DateTime.Now,
                        tanggalSubmit = DateTime.Now
                    });
                }
            }

            return status;
        }

        public string AddCandidateDataPTKP(CandidateDataPTKPViewModel data)
        {
            var status = "SUBMIT";
            using (IDbConnection cnn = OpenSunLifeDB())
            {
                var testLoginName = cnn.QueryFirstOrDefault<string>(
                    "SELECT LoginName FROM PTKPCandidate WHERE LoginName = @loginName",
                    new { loginName = data.LoginName });

                if (testLoginName != null)
                {
                    cnn.Execute(DbQuery.UpdateCandidateDataPTKP, new
                    {
                        loginName = data.LoginName,
                        hubunganKerjaPTKP = data.HubunganKerjaPTKP,
                        jenisKelaminPTKP = data.JenisKelaminPTKP,
                        idDetailPTKP = data.IdDetailPTKP,
                        tanggalUpdate = DateTime.Now,
                        tanggalSubmit = DateTime.Now
                    });
                }
                else
                {
                    cnn.Execute(DbQuery.AddCandidateDataPTKP, new
                    {
                        loginName = data.LoginName,
                        hubunganKerjaPTKP = data.HubunganKerjaPTKP,
                        jenisKelaminPTKP = data.JenisKelaminPTKP,
                        idDetailPTKP = data.IdDetailPTKP,
                        tanggalUpdate = DateTime.Now,
                        tanggalSubmit = DateTime.Now
                    });
                }
            }
            return status;
        }

        public string SetStatusAppNotif1(string loginName)
        {
            var status = "SUBMIT";
            using (IDbConnection cnn = OpenSunLifeDB())
            {
                cnn.Execute(DbQuery.SetStatusAppNotif1, new
                {
                    loginName = loginName,
                    isSeenNotif1 = true
                });
            }
            return status;
        }
        public string SetStatusAppNotif2(string loginName)
        {
            var status = "SUBMIT";
            using (IDbConnection cnn = OpenSunLifeDB())
            {
                cnn.Execute(DbQuery.SetStatusAppNotif2, new
                {
                    loginName = loginName,
                    isSeenNotif2 = true
                });
            }
            return status;
        }

        public string AddCandidateKontak(CandidateKontakDaruratViewModel[] data)
        {

            var status = "SUBMIT";

            using (IDbConnection cnn = OpenSunLifeDB())
            {
                foreach (CandidateKontakDaruratViewModel kontak in data)
                {
                    if (!String.IsNullOrEmpty(kontak.NamaLengkap))
                        kontak.NamaLengkap = kontak.NamaLengkap.ToUpper();
                    if (!String.IsNullOrEmpty(kontak.Alamat))
                        kontak.Alamat = kontak.Alamat.ToUpper();
                    if (!String.IsNullOrEmpty(kontak.Hubungan))
                        kontak.Hubungan = kontak.Hubungan.ToUpper();
                    if (!String.IsNullOrEmpty(kontak.LoginName))
                        kontak.LoginName = kontak.LoginName.ToUpper();

                    var a = data.Length;
                    var testId = cnn.QueryFirstOrDefault<string>(
                        "SELECT ID FROM CandidateKontakDarurat where LoginName = @loginName AND ID = @id",
                        new {loginName = kontak.LoginName, id = kontak.ID});
                    if (testId != null)
                    {
                        cnn.Execute(DbQuery.UpdateCandidateKontak, new
                        {
                            namaLengkap = kontak.NamaLengkap,
                            alamat = kontak.Alamat,
                            noTelepon = kontak.NoTelepon,
                            hubungan = kontak.Hubungan,
                            loginName = kontak.LoginName,
                            id = kontak.ID,
                            changedWhen = DateTime.Now
                        });
                    }
                    else
                    {
                        cnn.Execute(DbQuery.AddCandidateKontak, new
                        {
                            namaLengkap = kontak.NamaLengkap.ToUpper(),
                            alamat = kontak.Alamat.ToUpper(),
                            hubungan = kontak.Hubungan.ToUpper(),
                            noTelepon = kontak.NoTelepon,
                            loginName = kontak.LoginName.ToUpper(),
                            isDeleted = false,
                            createdWhen = DateTime.Now,
                            changedWhen = DateTime.Now
                        });
                    }
                }
            }

            return status;
        }

        public string DeleteCandidateKontak(CandidateKontakDaruratViewModel[] data)
        {
            var status = "DELETE";
            using (IDbConnection cnn = OpenSunLifeDB())
            {
                foreach (CandidateKontakDaruratViewModel kontak in data)
                {
                    var testId = cnn.QueryFirstOrDefault<string>(
                        "SELECT ID FROM CandidateKontakDarurat where LoginName = @loginName AND ID = @id",
                        new {loginName = kontak.LoginName, id = kontak.ID});
                    if (testId != null)
                    {
                        cnn.Execute(DbQuery.DeleteCandidateKontak, new
                        {
                            isDeleted = true,
                            changedWhen = DateTime.Now,
                            loginName = kontak.LoginName,
                            id = kontak.ID,
                        });
                    }
                }
            }

            return status;
        }

        public List<CandidateKontakDaruratViewModel> GetKontak(string loginName)
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.Query<CandidateKontakDaruratViewModel>(DbQuery.GetKontak, new {loginName = loginName})
                    .ToList();
            }
        }

        public List<CandidateKontakDaruratViewModel> GetKontakPDF(string loginName)
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.Query<CandidateKontakDaruratViewModel>(DbQuery.GetKontakPDF, new {loginName = loginName})
                    .ToList();
            }
        }

        public int UpdateIsKeluargaComplete(string loginName)
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.Execute("Update CandidateDataPribadi set isKeluargaComplete=1 where LoginName=@loginName", new {loginName });
            }
        }

        public string AddCandidateKeluarga(CandidateKeluargaViewModel[] data)
        {
            var status = "SUBMIT";
            foreach (var keluarga in data)
            {
                /*new update uat*/
                if (keluarga.TanggalLahir.HasValue)
                    keluarga.TanggalLahir = keluarga.TanggalLahir.Value.ToLocalTime();
                if (!String.IsNullOrEmpty(keluarga.LoginName))
                    keluarga.LoginName = keluarga.LoginName.ToUpper();
                if (!String.IsNullOrEmpty(keluarga.Hubungan))
                    keluarga.Hubungan = keluarga.Hubungan.ToUpper();
                if (!String.IsNullOrEmpty(keluarga.NamaLengkap))
                    keluarga.NamaLengkap = keluarga.NamaLengkap.ToUpper();
                if (!String.IsNullOrEmpty(keluarga.PendidikanTerakhir))
                    keluarga.PendidikanTerakhir = keluarga.PendidikanTerakhir.ToUpper();
                if (!String.IsNullOrEmpty(keluarga.Pekerjaan))
                    keluarga.Pekerjaan = keluarga.Pekerjaan.ToUpper();

                using (var cnn = OpenSunLifeDB())
                {
                    var a = data.Length;
                    var testId = cnn.QueryFirstOrDefault<string>(
                        "SELECT ID FROM CandidateDataKeluarga WHERE LoginName = @loginName AND ID = @id",
                        new {loginName = keluarga.LoginName, id = keluarga.ID});

                    if (testId != null)
                    {
                        cnn.Execute(DbQuery.UpdateCandidateKeluarga, new
                        {
                            id = keluarga.ID,
                            loginName = keluarga.LoginName,
                            hubungan = keluarga.Hubungan,
                            namaLengkap = keluarga.NamaLengkap,
                            tanggalLahir = keluarga.TanggalLahir,
                            pendidikanTerakhir = keluarga.PendidikanTerakhir,
                            pekerjaan = keluarga.Pekerjaan,
                            changedWhen = DateTime.Now
                        });
                    }
                    else
                    {
                        cnn.Execute(DbQuery.AddCandidateKeluarga, new
                        {
                            loginName = keluarga.LoginName,
                            hubungan = keluarga.Hubungan,
                            namaLengkap = keluarga.NamaLengkap,
                            pendidikanTerakhir = keluarga.PendidikanTerakhir,
                            pekerjaan = keluarga.Pekerjaan,
                            tanggalLahir = keluarga.TanggalLahir,
                            isDeleted = false,
                            createdWhen = DateTime.Now,
                            changedWhen = DateTime.Now
                        });
                    }
                }
            }

            return status;
        }

        public string DeleteCandidateKeluarga(CandidateKeluargaViewModel[] data)
        {
            var status = "DELETE";
            using (IDbConnection cnn = OpenSunLifeDB())
            {
                foreach (CandidateKeluargaViewModel keluarga in data)
                {
                    var testId = cnn.QueryFirstOrDefault<string>(
                        "SELECT ID FROM CandidateDataKeluarga where LoginName = @loginName AND ID = @id",
                        new {loginName = keluarga.LoginName, id = keluarga.ID});
                    if (testId != null)
                    {
                        cnn.Execute(DbQuery.DeleteCandidateKeluarga, new
                        {
                            isDeleted = true,
                            changedWhen = DateTime.Now,
                            loginName = keluarga.LoginName,
                            id = keluarga.ID,
                        });
                    }
                }
            }

            return status;
        }

        public List<CandidateKeluargaViewModel> GetCandidateDataSaudara(string loginName)
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.Query<CandidateKeluargaViewModel>(DbQuery.GetCandidateDataSaudara,
                    new {loginName = loginName}).ToList();
            }
        }

        public List<CandidateKeluargaViewModel> GetCandidateDataKeluarga(string loginName)
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.Query<CandidateKeluargaViewModel>(DbQuery.GetCandidateDataKeluarga,
                    new {loginName = loginName}).ToList();
            }
        }

        public List<LevelPendidikanViewModel> GetLevelPendidikan()
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.Query<LevelPendidikanViewModel>(DbQuery.GetLevelPendidikan).ToList();
            }
        }

        public List<CandidatePendidikanViewModel> GetCandidateDataPendidikan(string loginName)
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.Query<CandidatePendidikanViewModel>(DbQuery.GetCandidateDataPendidikan,
                    new {loginName = loginName}).ToList();
            }
        }

        public string AddCandidatePendidikan(CandidatePendidikanViewModel[] data)
        {
            var status = "SUBMIT";
            foreach (var pendidikan in data)
            {
               //   new update
                 if (!String.IsNullOrEmpty(pendidikan.LoginName))
                    pendidikan.LoginName = pendidikan.LoginName.ToUpper();
                if (!String.IsNullOrEmpty(pendidikan.NamaInstitusi))
                    pendidikan.NamaInstitusi = pendidikan.NamaInstitusi.ToUpper();
                if (!String.IsNullOrEmpty(pendidikan.Kota))
                    pendidikan.Kota = pendidikan.Kota.ToUpper();
                if (!String.IsNullOrEmpty(pendidikan.Jurusan))
                    pendidikan.Jurusan = pendidikan.Jurusan.ToUpper();
                if (!String.IsNullOrEmpty(pendidikan.Gelar))
                    pendidikan.Gelar = pendidikan.Gelar.ToUpper();
                if (!String.IsNullOrEmpty(pendidikan.Lembaga))
                    pendidikan.Lembaga = pendidikan.Lembaga.ToUpper();
                if (!String.IsNullOrEmpty(pendidikan.Sertifikasi))
                    pendidikan.Sertifikasi = pendidikan.Sertifikasi.ToUpper();
                if (!String.IsNullOrEmpty(pendidikan.LevelPendidikan))
                    pendidikan.LevelPendidikan = pendidikan.LevelPendidikan.ToUpper();
                if (!String.IsNullOrEmpty(pendidikan.TopikPelatihan))
                    pendidikan.TopikPelatihan = pendidikan.TopikPelatihan.ToUpper();
                using (var cnn = OpenSunLifeDB())
                {
                    var testId = cnn.QueryFirstOrDefault<string>(
                        "SELECT ID FROM CandidateDataPendidikan WHERE LoginName = @loginName AND ID = @id",
                        new {loginName = pendidikan.LoginName, id = pendidikan.ID});
                    if (testId != null)
                    {
                        cnn.Execute(DbQuery.UpdateCandidatePendidikan, new
                        {
                            id = pendidikan.ID,
                            loginName = pendidikan.LoginName,
                            jenis = pendidikan.Jenis,
                            namaInstitusi = pendidikan.NamaInstitusi,
                            kota = pendidikan.Kota,
                            jurusan = pendidikan.Jurusan,
                            gelar = pendidikan.Gelar,
                            ipk = pendidikan.IPK,
                            tanggalMasuk = pendidikan.TanggalMasuk,
                            tanggalLulus = pendidikan.TanggalLulus,
                            lembaga = pendidikan.Lembaga,
                            sertifikasi = pendidikan.Sertifikasi,
                            levelPendidikan = pendidikan.LevelPendidikan,
                            topikPelatihan = pendidikan.TopikPelatihan,
                            changedWhen = DateTime.Now
                        });
                    }
                    else
                    {
                        cnn.Execute(DbQuery.AddCandidatePendidikan, new
                        {
                            loginName = pendidikan.LoginName,
                            jenis = pendidikan.Jenis,
                            namaInstitusi = pendidikan.NamaInstitusi,
                            kota = pendidikan.Kota,
                            jurusan = pendidikan.Jurusan,
                            gelar = pendidikan.Gelar,
                            ipk = pendidikan.IPK,
                            tanggalMasuk = pendidikan.TanggalMasuk,
                            tanggalLulus = pendidikan.TanggalLulus,
                            lembaga = pendidikan.Lembaga,
                            sertifikasi = pendidikan.Sertifikasi,
                            levelPendidikan = pendidikan.LevelPendidikan,
                            topikPelatihan = pendidikan.TopikPelatihan,
                            isDeleted = false,
                            createdWhen = DateTime.Now,
                            changedWhen = DateTime.Now
                        });
                    }
                }
            }

            return status;
        }

        public string DeleteCandidatePendidikan(CandidatePendidikanViewModel[] data)
        {
            var status = "DELETE";
            using (IDbConnection cnn = OpenSunLifeDB())
            {
                foreach (CandidatePendidikanViewModel pendidikan in data)
                {
                    var testId = cnn.QueryFirstOrDefault<string>(
                        "SELECT ID FROM CandidateDataPendidikan where LoginName = @loginName AND ID = @id",
                        new {loginName = pendidikan.LoginName, id = pendidikan.ID});
                    if (testId != null)
                    {
                        cnn.Execute(DbQuery.DeleteCandidatePendidikan, new
                        {
                            isDeleted = true,
                            changedWhen = DateTime.Now,
                            loginName = pendidikan.LoginName,
                            id = pendidikan.ID,
                        });
                    }
                }
            }

            return status;
        }

        public List<CandidateExperiencePekerjaanViewModel> GetCandidateExperiencePekerjaan(string loginName)
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.Query<CandidateExperiencePekerjaanViewModel>(DbQuery.GetCandidateExperiencePekerjaan,
                    new {loginName = loginName}).ToList();
            }
        }

        public List<CandidateExperienceOrganisasiViewModel> GetCandidateExperienceOrganisasi(string loginName)
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.Query<CandidateExperienceOrganisasiViewModel>(DbQuery.GetCandidateExperienceOrganisasi,
                    new {loginName = loginName}).ToList();
            }
        }

        public List<CandidateExperiencePrestasiViewModel> GetCandidateExperiencePrestasi(string loginName)
        {
            using (var cnn = OpenSunLifeDB())
            {
/*                var testId = cnn.QueryFirstOrDefault<string>(
                    "DELETE FROM CandidateExperiencePrestasi where TanggalTerima = '01/10/1753'");*/

                return cnn.Query<CandidateExperiencePrestasiViewModel>(DbQuery.GetCandidateExperiencePrestasi,
                    new {loginName = loginName}).ToList();
            }
        }

        public List<CandidateExperienceBahasaViewModel> GetCandidateExperienceBahasa(string loginName)
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.Query<CandidateExperienceBahasaViewModel>(DbQuery.GetCandidateExperienceBahasa,
                    new {loginName = loginName}).ToList();
            }
        }

        public List<CandidateExperienceKeahlianViewModel> GetCandidateExperienceKeahlian(string loginName)
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.Query<CandidateExperienceKeahlianViewModel>(DbQuery.GetCandidateExperienceKeahlian,
                    new {loginName = loginName}).ToList();
            }
        }

        public List<CandidateExperienceMinatViewModel> GetCandidateExperienceMinat(string loginName)
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.Query<CandidateExperienceMinatViewModel>(DbQuery.GetCandidateExperienceMinat,
                    new {loginName = loginName}).ToList();
            }
        }

        public List<CandidateExperiencePlusMinViewModel> GetCandidateExperiencePlusMin(string loginName)
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.Query<CandidateExperiencePlusMinViewModel>(DbQuery.GetCandidateExperiencePlusMin,
                    new {loginName = loginName}).ToList();
            }
        }

        public String AddCandidateDataPekerjaan(CandidateExperienceAllVIewModel data)
        {
            var status = "SUBMIT";
            using (var cnn = OpenSunLifeDB())
            {
                //riwayat pekerjaan
                if (data.Pekerjaan.Count > 0)
                {
                    foreach (var item in data.Pekerjaan)
                    {
                      // new update uat
                        if (!String.IsNullOrEmpty(item.LoginName))
                            item.LoginName = item.LoginName.ToUpper();
                        if (!String.IsNullOrEmpty(item.NamaPerusahaan))
                            item.NamaPerusahaan = item.NamaPerusahaan.ToUpper();
                        if (!String.IsNullOrEmpty(item.JenisUsaha))
                            item.JenisUsaha = item.JenisUsaha.ToUpper();
                        if (!String.IsNullOrEmpty(item.Posisi))
                            item.Posisi = item.Posisi.ToUpper();
                        if (!String.IsNullOrEmpty(item.AlasanBerhenti))
                            item.AlasanBerhenti = item.AlasanBerhenti.ToUpper();
                        if (!String.IsNullOrEmpty(item.Tugas))
                            item.Tugas = item.Tugas.ToUpper();

                        var testId = cnn.QueryFirstOrDefault<string>(
                            "SELECT ID FROM CandidateExperiencePekerjaan WHERE LoginName = @loginName AND ID = @id",
                            new {loginName = item.LoginName, id = item.ID});
                        if (testId != null)
                        {
                            cnn.Execute(DbQuery.UpdateCandidateExperiencePekerjaan, new
                            {
                                id = item.ID,
                                loginName = item.LoginName,
                                namaPerusahaan = item.NamaPerusahaan,
                                jenisUsaha = item.JenisUsaha,
                                posisi = item.Posisi,
                                tanggalMasuk = item.TanggalMasuk,
                                tanggalResign = item.TanggalResign,
                                telpKantor = item.TelpKantor,
                                gaji = item.Gaji,
                                tugas = item.Tugas,
                                alasanBerhenti = item.AlasanBerhenti,
                                changedWhen = DateTime.Now
                            });
                        }
                        else
                        {
                            cnn.Execute(DbQuery.AddCandidateExperiencePekerjaan, new
                            {
                                loginName = item.LoginName,
                                namaPerusahaan = item.NamaPerusahaan,
                                jenisUsaha = item.JenisUsaha,
                                posisi = item.Posisi,
                                tanggalMasuk = item.TanggalMasuk,
                                tanggalResign = item.TanggalResign,
                                telpKantor = item.TelpKantor,
                                gaji = item.Gaji,
                                tugas = item.Tugas,
                                alasanBerhenti = item.AlasanBerhenti,
                                isDeleted = false,
                                createdWhen = DateTime.Now,
                                changedWhen = DateTime.Now
                            });
                        }
                    }
                }


                //bahasa
                if (data.Bahasa.Count > 0)
                {
                    foreach (var item in data.Bahasa)
                    {
                      //new update uat
                        if (!String.IsNullOrEmpty(item.Bahasa))
                            item.Bahasa = item.Bahasa.ToUpper();

                        var testId = cnn.QueryFirstOrDefault<string>(
                            "SELECT ID FROM CandidateExperienceBahasa WHERE LoginName = @loginName AND ID = @id",
                            new {loginName = item.LoginName, id = item.ID});
                        if (testId != null)
                        {
                            cnn.Execute(DbQuery.UpdateCandidateExperienceBahasa, new
                            {
                                id = item.ID,
                                loginName = item.LoginName,
                                bahasa = item.Bahasa,
                                membaca = item.Membaca,
                                berbicara = item.Berbicara,
                                menulis = item.Menulis,
                                changedWhen = DateTime.Now
                            });
                        }
                        else
                        {
                            cnn.Execute(DbQuery.AddCandidateExperienceBahasa, new
                            {
                                loginName = item.LoginName,
                                bahasa = item.Bahasa,
                                membaca = item.Membaca,
                                berbicara = item.Berbicara,
                                menulis = item.Menulis,
                                isDeleted = false,
                                createdWhen = DateTime.Now,
                                changedWhen = DateTime.Now
                            });
                        }
                    }
                }

                //minat
                if (data.Minat.Count > 0)
                {
                    foreach (var item in data.Minat)
                    {
                        // (versi mario, pake ID)
                        /*var testId = cnn.QueryFirstOrDefault<string>(
                            "SELECT ID FROM CandidateExperienceMinat WHERE LoginName = @loginName AND ID = @id",
                            new {loginName = item.LoginName, id = item.ID});*/

                        // (versi dian, gk pake ID) karena saat koneksi buruk dan dia ke klik submit 2x 
                        // atau klik submit tp dia tidak ke menu selanjutnya dan dia stay di situ 
                        // (karena mikirnya gagal submit), kemudian dia klik submit lg.
                        // si ID itu jd gk dapet, alhasil di sini jd null dan malah insert bukan update.
                        /*var testId = cnn.QueryFirstOrDefault<string>(
                            "SELECT ID FROM CandidateExperienceMinat WHERE LoginName = @loginName",
                            new {loginName = item.LoginName});

                        if (testId != null)
                        {
                            cnn.Execute(DbQuery.UpdateCandidateExperienceMinat, new
                            {
                                id = item.ID,
                                loginName = item.LoginName,
                                sales = item.Sales,
                                computer = item.Computer,
                                training = item.Training,
                                accounting = item.Accounting,
                                engineering = item.Engineering,
                                law = item.Law,
                                administration = item.Administration,
                                manufacture = item.Manufacture,
                                sdm = item.SDM,
                                frontLiners = item.FrontLiners,
                                advertising = item.Advertising,
                                research = item.Research,
                                other = item.Other
                            });
                        }
                        else
                        {
                            cnn.Execute(DbQuery.AddCandidateExperienceMinat, new
                            {
                                loginName = item.LoginName,
                                sales = item.Sales,
                                computer = item.Computer,
                                training = item.Training,
                                accounting = item.Accounting,
                                engineering = item.Engineering,
                                law = item.Law,
                                administration = item.Administration,
                                manufacture = item.Manufacture,
                                sdm = item.SDM,
                                frontLiners = item.FrontLiners,
                                advertising = item.Advertising,
                                research = item.Research,
                                other = item.Other
                            });
                        }*/

                        //yang baru untuk mengatasi data yang kesimpan 2 kali jadi double
                        cnn.Execute(DbQuery.SaveAndUpdateCandidateExperienceMinat, new
                        {
                            loginName = item.LoginName,
                            sales = item.Sales,
                            accounting = item.Accounting,
                            administration = item.Administration,
                            frontLiners = item.FrontLiners,
                            other = item.Other
                        });
                    }
                }

                //plusminus
                if (data.PlusMin.Count > 0)
                {
                    foreach (var item in data.PlusMin)
                    {
                         // new update
                        if (!String.IsNullOrEmpty(item.Kelebihan))
                            item.Kelebihan = item.Kelebihan.ToUpper();
                        if (!String.IsNullOrEmpty(item.Kekurangan))
                            item.Kekurangan = item.Kekurangan.ToUpper();
                        var testId = cnn.QueryFirstOrDefault<string>(
                            "SELECT ID FROM CandidateExperiencePlusMin WHERE LoginName = @loginName AND ID = @id",
                            new {loginName = item.LoginName, id = item.ID});
                        if (testId != null)
                        {
                            cnn.Execute(DbQuery.UpdateCandidateExperiencePlusMin, new
                            {
                                id = item.ID,
                                loginName = item.LoginName,
                                kelebihan = item.Kelebihan,
                                kekurangan = item.Kekurangan,
                                changedWhen = DateTime.Now
                            });
                        }
                        else
                        {
                            cnn.Execute(DbQuery.AddCandidateExperiencePlusMin, new
                            {
                                loginName = item.LoginName,
                                kelebihan = item.Kelebihan,
                                kekurangan = item.Kekurangan,
                                isDeleted = false,
                                createdWhen = DateTime.Now,
                                changedWhen = DateTime.Now
                            });
                        }
                    }
                }


                //riwayat organisasi data.Organisasi.Count > 0 ||
                if (data.Organisasi != null)
                {
                    foreach (var item in data.Organisasi)
                    {
                        // new update uat
                        if (!String.IsNullOrEmpty(item.LoginName))
                            item.LoginName = item.LoginName.ToUpper();
                        if (!String.IsNullOrEmpty(item.NamaOrganisasi))
                            item.NamaOrganisasi = item.NamaOrganisasi.ToUpper();
                        if (!String.IsNullOrEmpty(item.Jabatan))
                            item.Jabatan = item.Jabatan.ToUpper();
                        if (!String.IsNullOrEmpty(item.Kegiatan))
                            item.Kegiatan = item.Kegiatan.ToUpper();

                        var testId = cnn.QueryFirstOrDefault<string>(
                            "SELECT ID FROM CandidateExperienceOrganisasi WHERE LoginName = @loginName AND ID = @id",
                            new {loginName = item.LoginName, id = item.ID});
                        if (testId != null)
                        {
                            cnn.Execute(DbQuery.UpdateCandidateExperienceOrganisasi, new
                            {
                                id = item.ID,
                                loginName = item.LoginName,
                                namaOrganisasi = item.NamaOrganisasi,
                                jabatan = item.Jabatan,
                                kegiatan = item.Kegiatan,
                                tanggalMasuk = item.TanggalMasuk,
                                tanggalBerhenti = item.TanggalBerhenti,
                                changedWhen = DateTime.Now
                            });
                        }
                        else
                        {
                            cnn.Execute(DbQuery.AddCandidateExperienceOrganisasi, new
                            {
                                loginName = item.LoginName,
                                namaOrganisasi = item.NamaOrganisasi,
                                jabatan = item.Jabatan,
                                kegiatan = item.Kegiatan,
                                tanggalMasuk = item.TanggalMasuk,
                                tanggalBerhenti = item.TanggalBerhenti,
                                isDeleted = false,
                                createdWhen = DateTime.Now,
                                changedWhen = DateTime.Now
                            });
                        }
                    }
                }


                //penghargaan/prestasi
                if (data.Prestasi != null)
                {
                    foreach (var item in data.Prestasi)
                    {
                        //new update uat
                        if (item.TanggalTerima.HasValue)
                            item.TanggalTerima = item.TanggalTerima.Value.ToLocalTime();
                        if (!String.IsNullOrEmpty(item.LoginName))
                            item.LoginName = item.LoginName.ToUpper();
                        if (!String.IsNullOrEmpty(item.NamaPenghargaan))
                            item.NamaPenghargaan = item.NamaPenghargaan.ToUpper();
                        if (!String.IsNullOrEmpty(item.PemberiPenghargaan))
                            item.PemberiPenghargaan = item.PemberiPenghargaan.ToUpper();

                        var testId = cnn.QueryFirstOrDefault<string>(
                            "SELECT ID FROM CandidateExperiencePrestasi WHERE LoginName = @loginName AND ID = @id",
                            new {loginName = item.LoginName, id = item.ID});
                        if (testId != null)
                        {

                            cnn.Execute(DbQuery.UpdateCandidateExperiencePrestasi, new
                            {
                                id = item.ID,
                                loginName = item.LoginName,
                                namaPenghargaan = item.NamaPenghargaan,
                                pemberiPenghargaan = item.PemberiPenghargaan,
                                tanggalterima = item.TanggalTerima,
                                changedWhen = DateTime.Now
                            });
                        }
                        else
                        {
                            cnn.Execute(DbQuery.AddCandidateExperiencePrestasi, new
                            {
                                loginName = item.LoginName,
                                namaPenghargaan = item.NamaPenghargaan,
                                pemberiPenghargaan = item.PemberiPenghargaan,
                                tanggalterima = item.TanggalTerima,
                                isDeleted = false,
                                createdWhen = DateTime.Now,
                                changedWhen = DateTime.Now
                            });
                        }
                    }
                }


                //keahlian
                if (data.Keahlian != null)
                {
                    foreach (var item in data.Keahlian)
                    {
                        //new update uat
                        if (!String.IsNullOrEmpty(item.LoginName))
                            item.LoginName = item.LoginName.ToUpper();
                        if (!String.IsNullOrEmpty(item.NamaKeahlian))
                            item.NamaKeahlian = item.NamaKeahlian.ToUpper();
                        if (!String.IsNullOrEmpty(item.Sertifikasi))
                            item.Sertifikasi = item.Sertifikasi.ToUpper();

                        var testId = cnn.QueryFirstOrDefault<string>(
                            "SELECT ID FROM CandidateExperienceKeahlian WHERE LoginName = @loginName AND ID = @id",
                            new {loginName = item.LoginName, id = item.ID});
                        if (testId != null)
                        {
                            cnn.Execute(DbQuery.UpdateCandidateExperienceKeahlian, new
                            {
                                id = item.ID,
                                loginName = item.LoginName,
                                namaKeahlian = item.NamaKeahlian,
                                sertifikasi = item.Sertifikasi,
                                changedWhen = DateTime.Now
                            });
                        }
                        else
                        {
                            cnn.Execute(DbQuery.AddCandidateExperienceKeahlian, new
                            {
                                loginName = item.LoginName,
                                namaKeahlian = item.NamaKeahlian,
                                sertifikasi = item.Sertifikasi,
                                isDeleted = false,
                                createdWhen = DateTime.Now,
                                changedWhen = DateTime.Now
                            });
                        }
                    }
                }

                if (data.Organisasi == null && data.Prestasi == null && data.Keahlian == null)
                {
                    return status;
                }


                return status;
            }
        }

        public string DeleteCandidatePkerjaan(CandidateExperiencePekerjaanViewModel[] data)
        {
            var status = "DELETE";
            using (IDbConnection cnn = OpenSunLifeDB())
            {
                foreach (CandidateExperiencePekerjaanViewModel kerjaan in data)
                {
                    var testId = cnn.QueryFirstOrDefault<string>(
                        "SELECT ID FROM CandidateExperiencePekerjaan where LoginName = @loginName AND ID = @id",
                        new {loginName = kerjaan.LoginName, id = kerjaan.ID});
                    if (testId != null)
                    {
                        cnn.Execute(DbQuery.DeleteCandidatePekerjaan, new
                        {
                            isDeleted = true,
                            changedWhen = DateTime.Now,
                            loginName = kerjaan.LoginName,
                            id = kerjaan.ID,
                        });
                    }
                }
            }

            return status;
        }

        public string DeleteCandidateOrganisasi(CandidateExperienceOrganisasiViewModel[] data)
        {
            var status = "DELETE";
            using (IDbConnection cnn = OpenSunLifeDB())
            {
                foreach (CandidateExperienceOrganisasiViewModel org in data)
                {
                    var testId = cnn.QueryFirstOrDefault<string>(
                        "SELECT ID FROM CandidateExperienceOrganisasi where LoginName = @loginName AND ID = @id",
                        new {loginName = org.LoginName, id = org.ID});
                    if (testId != null)
                    {
                        cnn.Execute(DbQuery.DeleteCandidateOrganisasi, new
                        {
                            isDeleted = true,
                            changedWhen = DateTime.Now,
                            loginName = org.LoginName,
                            id = org.ID,
                        });
                    }
                }
            }

            return status;
        }

        public string DeleteCandidatePrestasi(CandidateExperiencePrestasiViewModel[] data)
        {
            var status = "DELETE";
            using (IDbConnection cnn = OpenSunLifeDB())
            {
                foreach (CandidateExperiencePrestasiViewModel prestasi in data)
                {
                    var testId = cnn.QueryFirstOrDefault<string>(
                        "SELECT ID FROM CandidateExperiencePrestasi where LoginName = @loginName AND ID = @id",
                        new {loginName = prestasi.LoginName, id = prestasi.ID});
                    if (testId != null)
                    {
                        cnn.Execute(DbQuery.DeleteCandidatePrestasi, new
                        {
                            isDeleted = true,
                            changedWhen = DateTime.Now,
                            loginName = prestasi.LoginName,
                            id = prestasi.ID,
                        });
                    }
                }
            }

            return status;
        }

        public string DeleteCandidateBahasa(CandidateExperienceBahasaViewModel[] data)
        {
            var status = "DELETE";
            using (IDbConnection cnn = OpenSunLifeDB())
            {
                foreach (CandidateExperienceBahasaViewModel bahasa in data)
                {
                    var testId = cnn.QueryFirstOrDefault<string>(
                        "SELECT ID FROM CandidateExperienceBahasa where LoginName = @loginName AND ID = @id",
                        new {loginName = bahasa.LoginName, id = bahasa.ID});
                    if (testId != null)
                    {
                        cnn.Execute(DbQuery.DeleteCandidateBahasa, new
                        {
                            isDeleted = true,
                            changedWhen = DateTime.Now,
                            loginName = bahasa.LoginName,
                            id = bahasa.ID,
                        });
                    }
                }
            }

            return status;
        }

        public string DeleteCandidateKeahlian(CandidateExperienceKeahlianViewModel[] data)
        {
            var status = "DELETE";
            using (IDbConnection cnn = OpenSunLifeDB())
            {
                foreach (CandidateExperienceKeahlianViewModel keahlian in data)
                {
                    var testId = cnn.QueryFirstOrDefault<string>(
                        "SELECT ID FROM CandidateExperienceKeahlian where LoginName = @loginName AND ID = @id",
                        new {loginName = keahlian.LoginName, id = keahlian.ID});
                    if (testId != null)
                    {
                        cnn.Execute(DbQuery.DeleteCandidateKeahlian, new
                        {
                            isDeleted = true,
                            changedWhen = DateTime.Now,
                            loginName = keahlian.LoginName,
                            id = keahlian.ID,
                        });
                    }
                }
            }

            return status;
        }

        public string DeleteCandidatePlusMin(CandidateExperiencePlusMinViewModel[] data)
        {
            var status = "DELETE";
            using (IDbConnection cnn = OpenSunLifeDB())
            {
                foreach (CandidateExperiencePlusMinViewModel plusMin in data)
                {
                    var testId = cnn.QueryFirstOrDefault<string>(
                        "SELECT ID FROM CandidateExperiencePlusMin where LoginName = @loginName AND ID = @id",
                        new {loginName = plusMin.LoginName, id = plusMin.ID});
                    if (testId != null)
                    {
                        cnn.Execute(DbQuery.DeleteCandidatePlusMin, new
                        {
                            isDeleted = true,
                            changedWhen = DateTime.Now,
                            loginName = plusMin.LoginName,
                            id = plusMin.ID,
                        });
                    }
                }
            }

            return status;
        }

        public List<UserViewModel> GetAccountForProfilePDF(string loginName)
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.Query<UserViewModel>(DbQuery.GetAccountForProfile, new {loginName = loginName}).ToList();
            }
        }

        public List<CandidateKeluargaViewModel> GetCandidateDataKeluargaPDF(string loginName)
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.Query<CandidateKeluargaViewModel>(DbQuery.GetCandidateDataKeluargaPDF,
                    new {loginName = loginName}).ToList();
            }
        }

            public List<CandidateKeluargaViewModel> GetCandidateDataIbu(string loginName)
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.Query<CandidateKeluargaViewModel>(DbQuery.GetCandidateDataIbu, new {loginName = loginName})
                    .ToList();
            }
        }

        public List<CandidateKeluargaViewModel> GetCandidateDataSpouse(string loginName)
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.Query<CandidateKeluargaViewModel>(DbQuery.GetCandidateDataSpouse,
                    new {loginName = loginName}).ToList();
            }
        }

        public List<CandidatePendidikanViewModel> GetCandidateDataPendidikanPDF(string loginName)
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.Query<CandidatePendidikanViewModel>(DbQuery.GetCandidateDataPendidikanPDF,
                    new {loginName = loginName}).ToList();
            }
        }

        public List<CandidatePendidikanViewModel> GetCandidateDataPendidikanNonPDF(string loginName)
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.Query<CandidatePendidikanViewModel>(DbQuery.GetCandidateDataPendidikanNonPDF,
                    new {loginName = loginName}).ToList();
            }
        }

        public PDFCandidateDataPribadiViewModel GetGenderPDF(string loginName)
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.Query<PDFCandidateDataPribadiViewModel>(DbQuery.GetGenderPDF, new {loginName = loginName})
                    .SingleOrDefault();
            }
        }

        public PDFCandidateDataPribadiViewModel GetStatusPernikahanPDF(string loginName)
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.Query<PDFCandidateDataPribadiViewModel>(DbQuery.GetStatusPernikahanPDF,
                    new {loginName = loginName}).SingleOrDefault();
            }
        }

        public List<PDFCandidateExperienceBahasaViewModel> GetExperienceBahasaPDF(string loginName)
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.Query<PDFCandidateExperienceBahasaViewModel>(DbQuery.GetExperienceBahasaPDF,
                    new {loginName = loginName}).ToList();
            }
        }

        public PDFCandidateDataKondisiKesehatanViewModel GetKondisiKesehatanPDF(string loginName)
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.Query<PDFCandidateDataKondisiKesehatanViewModel>(DbQuery.GetKondisiKesehatanPDF,
                    new { loginName = loginName }).SingleOrDefault();
            }
        }
        public PDFCandidateDataRencanaPribadiViewModel GetRencanaPribadiPDF(string loginName)
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.Query<PDFCandidateDataRencanaPribadiViewModel>(DbQuery.GetCandidateDataRencanaPribadi,
                    new { loginName = loginName }).SingleOrDefault();
            }
        }

/*        public List<CandidateDokumenViewModel> GetDokumenCV(string loginName)
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.Query<CandidateDokumenViewModel>(DbQuery.GetDokumenCV, new { loginName = loginName }).ToList();
            }
        }*/

                        public JadwalInterviewViewModel GetJadwalInterview1(string loginName)
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.Query<JadwalInterviewViewModel>(DbQuery.GetJadwalInterview1, new {loginName = loginName})
                    .SingleOrDefault();
            }
        }

        public JadwalInterviewViewModel GetJadwalInterview2(string loginName)
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.Query<JadwalInterviewViewModel>(DbQuery.GetJadwalInterview2, new {loginName = loginName})
                    .SingleOrDefault();
            }
        }
        public JadwalInterviewViewModel GetJadwalInterview(string loginName)
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.Query<JadwalInterviewViewModel>(DbQuery.GetJadwalInterview, new {loginName = loginName})
                    .SingleOrDefault();
            }
        }

        public DataTrainingViewModel GetDataTraining(string loginName)
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.Query<DataTrainingViewModel>(DbQuery.GetDataTraining, new {loginName = loginName})
                    .SingleOrDefault();
            }
        }

        public CandidateDataPribadiViewModel GetStatusJadwalInterview(string loginName)
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.Query<CandidateDataPribadiViewModel>(DbQuery.GetStatusJadwalInterview,
                    new {loginName = loginName}).SingleOrDefault();
            }
        }

        public CandidatePsikotesHasilViewModel GetPsikotesHasil(string loginName)
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.Query<CandidatePsikotesHasilViewModel>(DbQuery.GetPsikotesHasil, new {loginName = loginName}).SingleOrDefault();
            }
        }

        public List<CandidatePapikostikSoalViewModel> GetPapikostikSoal()
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.Query<CandidatePapikostikSoalViewModel>(DbQuery.GetPapikostikSoal).ToList();
            }
        }

        //public CandidatePapikostikJawabanViewModel GetPapikostikJawaban(string loginName)        
        public string GetPapikostikJawaban(string loginName)
        {
            var noSoal = "";
            for (int index = 1; index <= 90; index++) { //20, 90 soal
                noSoal = noSoal+ "soal" + index;
                if (index != 90) {
                    noSoal = noSoal +",'|',";
                }
            }
            var sql = @"SELECT CONCAT("+noSoal+ ") FROM CandidatePapikostikJawaban WHERE LoginName = @LoginName";

            using (var cnn = OpenSunLifeDB())
            {
                return cnn.Query<string>(sql, new { LoginName = loginName }).SingleOrDefault();
            }

            /*using (var cnn = OpenSunLifeDB())
            {
                return cnn.Query<CandidatePapikostikJawabanViewModel>(DbQuery.GetPapikostikJawaban, new { loginName = loginName })
                    .SingleOrDefault();
            }*/
        }

        public bool GetIsFinishPapikostik(string loginName)
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.Query<bool>(DbQuery.GetIsFinishPapikostik, new { LoginName = loginName }).SingleOrDefault();
            }

        }

        public bool SaveOrUpdateJawabanSoalPapikostik(List<SavePapikostikViewModel> listjawabanPapikostik)
        {
            var LoginName = listjawabanPapikostik[1].loginName;
            var valueSoal = "";
            var InsertSoal = "";
            var updateSoal = "";

            foreach (SavePapikostikViewModel jawabanPapikostik in listjawabanPapikostik) {
                InsertSoal = InsertSoal+", Soal" + jawabanPapikostik.NoSoal;
                valueSoal = valueSoal+"," +"'"+ jawabanPapikostik.pilihan+"'";

                updateSoal = updateSoal + ", Soal" + jawabanPapikostik.NoSoal + "=" + "'" + jawabanPapikostik.pilihan + "'";
            }

            var insert = @"INSERT INTO CandidatePapikostikJawaban (LoginName,"+ "IsFinish" + ", IsDeleted, StartDate" + InsertSoal +") VALUES(" + "'" + LoginName + "'"+ ",0,0,"+"'"+ DateTime.Now.ToString("MM'/'dd'/'yyyy HH:mm:ss") + "'" + valueSoal + ")";
            var update = @"UPDATE CandidatePapikostikJawaban SET LoginName = "+ "'" + LoginName + "'" + updateSoal + ",SubmitOrFinishDate =" + "'" + DateTime.Now.ToString("MM'/'dd'/'yyyy HH:mm:ss") + "'" + " WHERE LoginName = " + "'" + LoginName + "'";
           
            using (var cnn = OpenSunLifeDB())
            {
                var GetPapikostikJawaban = cnn.Query<CandidatePapikostikJawabanViewModel>(DbQuery.GetPapikostikJawaban, new { loginName = LoginName }).SingleOrDefault();

                if (GetPapikostikJawaban == null)
                {
                    var result = cnn.Execute(insert)== 1;
                    return result;
                    //return "SUBMIT";
                }
                else {
                    var result = cnn.Execute(update) == 1;
                    return result;
                    //return "UPDATE";
                }

                
            }
        }

        public bool SaveIsFinishPapikostik(string loginName)
        {
            using (var cnn = OpenSunLifeDB())
            {
                var result = cnn.Execute(DbQuery.SaveIsFinishPapikostik, new 
                {
                    IsFinish = true,
                    LoginName = loginName 
                }) == 1;
                return result;
                //return result;

            }
        }

        public CandidateDataPribadiViewModel GetStatusCandidate(string loginName)
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.Query<CandidateDataPribadiViewModel>(DbQuery.GetStatusCandidate, new {loginName = loginName})
                    .SingleOrDefault();
            }
        }

        public LokasiDanHirarkiViewModelPDF GetLokasiHirarki(string loginName)
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.Query<LokasiDanHirarkiViewModelPDF>(DbQuery.GetLokasiHirarki,
                    new { loginName = loginName }).SingleOrDefault();
            }
        }
        public LokasiDanHirarkiViewModelPDF GetSubBranchName(string loginName)
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.Query<LokasiDanHirarkiViewModelPDF>(DbQuery.GetSubBranchName,
                    new { loginName = loginName }).SingleOrDefault();
            }
        }
        
        public string AddFormReqruitment(CandidateViewModel data)
        {
            var status = "SUBMIT";
            using (var cnn = OpenSunLifeDB())
            {
                data.isPendingDocument = cnn
                    .Query<bool>(
                        "select top 1 case Upper(dc.Status) when 'NEED REVISION' then 1 else 0 end [status] from Candidate c join DocumentCheck dc on c.ID=dc.CandidateId where c.Id = @agentCode",
                        new {agentCode = data.CandidateId}).FirstOrDefault();

                #region education new

                //hapus data lama
                cnn.Execute("delete from CandidateEducation where CandidateId = @CandidateId",
                    new {CandidateId = data.CandidateId});
                //insert data baru
                if (data.Educations.Count > 0)
                {
                    foreach (var item in data.Educations)
                    {
                        cnn.Execute(DbQuery.AddCandidateEducation, new
                        {
                            Id = item.Id,
                            CandidateId = data.CandidateId,
                            InstitutionName = item.InstitutionName,
                            YearFrom = item.YearFrom,
                            YearTo = item.YearTo,
                            Level = item.Level
                        });
                    }
                }

                #endregion

                #region experience new

                //hapus yang sudah ada
                cnn.Execute("delete from candidateExperience where CandidateId = @CandidateId",
                    new {CandidateId = data.CandidateId});
                //insert baru
                if (data.Experiences.Count > 0)
                {
                    foreach (var item in data.Experiences)
                    {
                        var FromDateString = "";
                        var ToDateString = "";
                        //if (item.FromDate != null && item.FromDate.Length > 10 || item.ToDate != null && item.ToDate.Length > 10)
                        if (data.isPendingDocument == true)
                        {
                            var tempFrom = DateTime.Parse(item.FromDate);
                            var tempTo = DateTime.Parse(item.ToDate);
                            FromDateString = tempFrom.ToString("MM/dd/yyyy");
                            ToDateString = tempTo.ToString("MM/dd/yyyy");
                        }
                        else
                        {
                            FromDateString = item.FromDate;
                            ToDateString = item.ToDate;
                        }

                        cnn.Execute(DbQuery.AddCandidateExperience, new
                        {
                            Id = item.Id,
                            CandidateId = data.CandidateId,
                            CompanyName = item.CompanyName,
                            QuitReason = item.QuitReason,
                            Position = item.Position,
                            FromDate = FromDateString,
                            ToDate = ToDateString
                        });
                    }
                }

                #endregion

                #region work experience in insurance new

                //hapus yang sudah ada
                cnn.Execute("delete from CandidateWorkExperienceInInsurance where CandidateId = @CandidateId",
                    new {CandidateId = data.CandidateId});
                //insert baru
                if (data.WorkExperiences.Count > 0)
                {
                    foreach (var item in data.WorkExperiences)
                    {
                        cnn.Execute(DbQueryPortal.AddCandidateWorkExperienceInInsurance, new
                        {
                            CandidateId = data.CandidateId,
                            CompanyName = item.CompanyName,
                            LastPosition = item.LastPosition,
                            MainOfficeAddress = item.MainOfficeAddress,
                            HasBeenJoinFor = item.HasBeenJoinFor,
                            TerminateDate = item.TerminateDate,
                            OldAgentCode = item.OldAgentCode
                        });
                    }
                }

                #endregion

                #region realtion new 

                //hapus yang dulu
                cnn.Execute("delete from CandidateRelationInInsurance where CandidateId = @CandidateId",
                    new {CandidateId = data.CandidateId});
                //insert baru
                if (data.Relations.Count > 0)
                {
                    foreach (var item in data.Relations)
                    {
                        cnn.Execute(DbQueryPortal.AddCandidateRelationInInsurance, new
                        {
                            Name = item.Name,
                            CandidateId = data.CandidateId,
                            Relation = item.Relation,
                            CompanyName = item.CompanyName,
                            Position = item.Position,
                            Year = item.Year
                        });
                    }
                }

                #endregion

                #region dependencies new

                //delete yang lama
                cnn.Execute("delete from CandidateDependencies where candidateId = @CandidateId",
                    new {CandidateId = data.CandidateId});

                if (data.MaritalStatus != "Belum Menikah")
                {
                    //insert baru
                    if (data.Dependencies.Count > 0)
                    {
                        foreach (var item in data.Dependencies)
                        {
                            cnn.Execute(DbQueryPortal.AddCandidateDependencies, new
                            {
                                CandidateId = data.CandidateId,
                                Status = item.Status,
                                Name = item.Name,
                                BirthDate = item.BirthDate
                            });
                        }
                    }
                }

                #endregion

                #region reference new

                //delete yang laman
                cnn.Execute("delete from CandidateReference where CandidateId = @CandidateId",
                    new {CandidateId = data.CandidateId});
                //insert baru
                if (data.References.Count > 0)
                {
                    foreach (var item in data.References)
                    {
                        cnn.Execute(DbQueryPortal.AddCandidateReference, new
                        {
                            CandidateId = data.CandidateId,
                            Name = item.Name,
                            Organization = item.Organization,
                            Relation = item.Relation,
                            PhoneNumber = item.PhoneNumber,
                            HasKnownFor = item.HasKnownFor
                        });
                    }
                }

                #endregion

                #region dokumen pelengkap

                //add candidate file
                if (data.photoDiriId == 0 || data.photoKtpId == 0 || data.photoBuktiTransferId == 0 ||
                    data.photoBukuTabunganId == 0)
                {
                    //data.photoBuktiTransferId == 0
                    return "DokumenPelengkap";
                }
                else
                {
                    cnn.Execute(
                        "delete from CandidateFile where lower(Type) not in ('google','aml','atf') and CandidateID = " +
                        data.CandidateId);

                    if (data.photoKtpId != 0)
                    {
                        cnn.Execute(DbQuery.AddCandidateFile, new
                        {
                            CandidateID = data.CandidateId,
                            Type = "KTP",
                            FileID = data.photoKtpId,
                            CreatedBy = HttpContext.Current.User.Identity.Name,
                            CreatedWhen = DateTime.Now,
                            ChangedBy = HttpContext.Current.User.Identity.Name,
                            ChangedWhen = DateTime.Now
                        });
                    }

                    if (data.photoDiriId != 0)
                    {
                        cnn.Execute(DbQuery.AddCandidateFile, new
                        {
                            CandidateID = data.CandidateId,
                            Type = "FotoDiri",
                            FileID = data.photoDiriId,
                            CreatedBy = HttpContext.Current.User.Identity.Name,
                            CreatedWhen = DateTime.Now,
                            ChangedBy = HttpContext.Current.User.Identity.Name,
                            ChangedWhen = DateTime.Now
                        });
                    }

                    if (data.photoNpwpId != 0)
                    {
                        cnn.Execute(DbQuery.AddCandidateFile, new
                        {
                            CandidateID = data.CandidateId,
                            Type = "NPWP",
                            FileID = data.photoNpwpId,
                            CreatedBy = HttpContext.Current.User.Identity.Name,
                            CreatedWhen = DateTime.Now,
                            ChangedBy = HttpContext.Current.User.Identity.Name,
                            ChangedWhen = DateTime.Now
                        });
                    }

                    //if (data.photoKkId != 0)
                    //{
                    //    cnn.Execute(DbQuery.AddCandidateFile, new
                    //    {
                    //        CandidateID = data.CandidateId,
                    //        Type = "KK",
                    //        FileID = data.photoKkId,
                    //        CreatedBy = HttpContext.Current.User.Identity.Name,
                    //        CreatedWhen = DateTime.Now,
                    //        ChangedBy = HttpContext.Current.User.Identity.Name,
                    //        ChangedWhen = DateTime.Now
                    //    });
                    //}

                    if (data.photoBukuTabunganId != 0)
                    {
                        cnn.Execute(DbQuery.AddCandidateFile, new
                        {
                            CandidateID = data.CandidateId,
                            Type = "TABUNGAN",
                            FileID = data.photoBukuTabunganId,
                            CreatedBy = HttpContext.Current.User.Identity.Name,
                            CreatedWhen = DateTime.Now,
                            ChangedBy = HttpContext.Current.User.Identity.Name,
                            ChangedWhen = DateTime.Now
                        });
                    }

                    if (data.photoBuktiTransferId != 0)
                    {
                        cnn.Execute(DbQuery.AddCandidateFile, new
                        {
                            CandidateID = data.CandidateId,
                            Type = "TRANSFER",
                            FileID = data.photoBuktiTransferId,
                            CreatedBy = HttpContext.Current.User.Identity.Name,
                            CreatedWhen = DateTime.Now,
                            ChangedBy = HttpContext.Current.User.Identity.Name,
                            ChangedWhen = DateTime.Now
                        });
                    }
                }

                #endregion file

                #region validasi

                var cekHierarki =
                    cnn.Query<int>(
                        "SELECT COUNT(*) FROM ApprovalHierarki WHERE AgentCode = @AgentCode and isdelete = @IsDelete",
                        new {AgentCode = data.RecruiterAgentCode, IsDelete = 0}).FirstOrDefault();
                if (cekHierarki <= 0)
                {
                    return "Hierarki";
                }

                ////if (string.IsNullOrEmpty(data.AgentName) || string.IsNullOrEmpty(data.Gender) || string.IsNullOrEmpty(data.HomeAddress) ||
                ////    string.IsNullOrEmpty(data.CurrentAddress) || data.CityCode == "" || data.CurrentCityCode == "" || string.IsNullOrEmpty(data.AgentName) ||
                ////    string.IsNullOrEmpty(data.PostalCode) || data.NPWPNo == 0 || string.IsNullOrEmpty(data.NPWPName) ||
                ////    string.IsNullOrEmpty(data.BankAccountNo) ||
                ////    string.IsNullOrEmpty(data.BankAccountName) || string.IsNullOrEmpty(data.BankName) || string.IsNullOrEmpty(data.Branch))
                ////{
                ////    status = "DRAFT";
                ////}

                #endregion validasi

                #region approval, notification, eLearning account

                var RekruiterData =
                    cnn.Query<UserViewModel>("select DisplayName, Email from account where agentcode = @agentCode",
                        new {agentCode = data.RecruiterAgentCode}).FirstOrDefault();
                status = "SUBMIT";

                if (status == "SUBMIT" && data.isPendingDocument == false)
                {
                    var AppUrlElearning = ConfigurationManager.AppSettings["AppUrlElearning"];
                    var AppUrlErecruit = ConfigurationManager.AppSettings["AppUrlErecruit"];

                    string statusApprovalAs = "(Direct Manager)";
                    //CEK RULES APPROVAL DAN HIERARKI KEMUDIAN INSERT KE LIST APPROVAL
                    var countApprovalList = cnn.Query<ApprovalProgressViewModel>(
                        "SELECT al.*,a.DisplayName ApproverName FROM ApprovalList al left join account a on a.LoginName=al.ApproverCode WHERE al.IsActive = @IsActive and al.CandidateId = @CandidateId",
                        new {CandidateId = data.CandidateId, IsActive = 1});

                    if (countApprovalList.Count() <= 0)
                    {
                        //GET RULE APPROVAL BY CANDIDATE LEVEL
                        //var rulesApproval = cnn.Query<ApprovalRuleViewModel>("SELECT * FROM ApprovalRules WHERE CandidateLevel = " + data.Level + " and isdelete = 0");
                        var rulesApproval = cnn.Query<ApprovalRuleViewModel>(
                            "SELECT * FROM ApprovalRules WHERE CandidateLevel = @Level and isdelete = @IsDelete",
                            new {Level = data.Level, IsDelete = 0});
                        if (rulesApproval.Count() == 0)
                        {
                            return "RulesApproval";
                        }

                        StringBuilder sb = new StringBuilder();
                        int[] listApp;
                        foreach (var item in rulesApproval)
                        {
                            sb.Append("'" + item.ApprovalLevelId + "',");
                        }

                        listApp = rulesApproval.Select(x => Convert.ToInt32(x.ApprovalLevelId)).ToArray();
                        //GET LIST APPROVER BY RULE APPROVAL 
                        var listApprover = sb.ToString().Remove(sb.Length - 1);
                        //var hierarki = cnn.Query<HierarkiViewModel>("SELECT * FROM ApprovalHierarki WHERE AgentCode = '" + data.RecruiterAgentCode + "' AND LevelId IN(" + listApprover + ")");

                        //mukti new march 11 //cari approval berdasarkan level candidate dengan level terendah
                        //var hierarki = cnn.Query<HierarkiViewModel>("SELECT top 1 ah.*,a.DisplayName ApproverName FROM ApprovalHierarki ah left join account a on ah.ApproverCode=a.LoginName WHERE ah.AgentCode = '" + data.RecruiterAgentCode + "' AND ah.LevelId IN(" + listApprover + ") and ah.isdelete = 0 order by ah.sequence");
                        var hierarki = cnn.Query<HierarkiViewModel>(
                            "SELECT top 1 ah.*,a.DisplayName ApproverName FROM ApprovalHierarki ah left join account a on ah.ApproverCode=a.LoginName WHERE ah.AgentCode = @AgentCode AND ah.LevelId IN @listApprover and ah.isdelete = @IsDelete order by ah.sequence",
                            new {AgentCode = data.RecruiterAgentCode, IsDelete = 0, listApprover = listApp});

                        if (data.Level == "5")
                        {
                            hierarki = cnn.Query<HierarkiViewModel>(
                                "SELECT top 1 ah.*,a.DisplayName ApproverName FROM ApprovalHierarki ah left join account a on ah.ApproverCode=a.LoginName WHERE ah.AgentCode = @AgentCode AND ah.LevelId IN @listApprover and ah.isdelete = @IsDelete and a.LoginName = @DirectManagerCode order by ah.sequence",
                                new
                                {
                                    AgentCode = data.RecruiterAgentCode,
                                    IsDelete = 0,
                                    listApprover = listApp,
                                    DirectManagerCode = data.ManagerAgentCode
                                });
                        }

                        var candidateData = cnn.QueryFirstOrDefault<CandidateViewModel>(DbQueryPortal.GetCandidate,
                            new {CandidateId = data.CandidateId});

                        if (hierarki != null)
                        {
                            var approvalIdDirect = 0;
                            foreach (var item in hierarki)
                            {
                                //approval
                                //var query = "INSERT INTO ApprovalList(CandidateId, RecruiterCode, ApproverCode, IsActive) VALUES('" + data.CandidateId + "', '" + data.RecruiterAgentCode + "', '" + item.ApproverCode + "', 1); SELECT CAST(SCOPE_IDENTITY() as int);";
                                var query =
                                    "INSERT INTO ApprovalList(CandidateId, RecruiterCode, ApproverCode, IsActive) VALUES(@CandidateId,@RecruiterAgentCode,@ApproverCode, @IsActive); SELECT CAST(SCOPE_IDENTITY() as int);";
                                var idApproval = cnn.Query<int>(query,
                                    new
                                    {
                                        CandidateId = data.CandidateId,
                                        RecruiterAgentCode = data.RecruiterAgentCode,
                                        ApproverCode = item.ApproverCode,
                                        IsActive = 1
                                    }).Single();

                                //if (item.ApproverCode != data.RecruiterAgentCode)
                                if (item.ApproverCode != null)
                                {
                                    //send to recruiter
                                    var body = "Waiting approve by " +
                                               string.Concat(item.ApproverCode, " - ", item.ApproverName);
                                    var title = data.AgentName;
                                    NotificationHelper.SendNotification("Leader Approval", data.RecruiterAgentCode,
                                        title, body, "INFORMASI", data.ID, idApproval);

                                    //notif ke next approval
                                    body = "Calon Agen (" + data.AgentName + ") yang telah di rekrut oleh perekrut (" +
                                           data.RecruiterAgentCode + " - " + data.RecruiterName +
                                           ") menunggu persetujuan anda.";
                                    NotificationHelper.SendNotification(item.AgentCode, item.ApproverCode,
                                        "Menunggu Approval " + statusApprovalAs, body, "APPROVAL", data.CandidateId,
                                        idApproval);

                                    ////email untuk APPROVER

                                    var ApproverData =
                                        cnn.Query<UserViewModel>(
                                            "SELECT DisplayName, Email FROM Account WHERE AgentCode = @AgentCode",
                                            new {AgentCode = item.ApproverCode}).FirstOrDefault();
                                    if (ApproverData.Email != null && ApproverData.Email != "" &&
                                        !string.IsNullOrEmpty(ApproverData.Email))
                                    {
                                        if (ApproverData.Email != "-")
                                        {
                                            body = "Dear " + ApproverData.DisplayName + ", <br /><br />" +
                                                   "Calon Agen " + data.AgentName +
                                                   " yang telah direkrut oleh Perekrut ( " + data.RecruiterAgentCode +
                                                   " - " + data.RecruiterName +
                                                   " ) menunggu persetujuan anda. <br /><br />" +
                                                   "Saya #LebihBaik, Sun Life #LebihBaik Indonesia #LebihBaik with the power of Sunlifers!" +
                                                   "Regards, <br /> Sunlife eRecruit";
                                            NotificationHelper.SendEmail("Email Notification eRecruit Approval",
                                                ApproverData.Email, body);
                                        }
                                    }

                                    //email untuk recruiter
                                    //var RekruiterData = cnn.Query("select DisplayName, Email from account where agentcode = @agentCode", new { agentCode = data.RecruiterAgentCode }).FirstOrDefault();
                                    if (RekruiterData.Email != null && RekruiterData.Email != "" &&
                                        !string.IsNullOrEmpty(RekruiterData.Email))
                                    {
                                        if (RekruiterData.Email != "-")
                                        {
                                            body = "Waiting approve by " + string.Concat(item.ApproverCode, " - ",
                                                       item.ApproverName);
                                            NotificationHelper.SendEmail(data.AgentName, RekruiterData.Email, body);
                                        }
                                    }
                                }
                                else
                                {
                                    approvalIdDirect = idApproval;
                                }
                            }

                            //Cek apakah approver code nya sama dengan rekruter
                            //foreach (var item in hierarki)
                            //{
                            //    if (item.ApproverCode == data.RecruiterAgentCode)
                            //    {
                            //        //jika approver code nya sama dengan rekruter, maka langsung update approval set APPROVE
                            //        var approvalFormRepository = new ApprovalFormRepository();
                            //        var agentCodeRepository = new AgentCodeRepository();
                            //        var dataApproval = approvalFormRepository.GetApprovalById(approvalIdDirect);
                            //        var dataCandidate = agentCodeRepository.GetCandidateById(data.CandidateId);
                            //        var dataRecruiter = approvalFormRepository.GetAccount(dataApproval.RecruiterCode);
                            //        if (dataCandidate.Status != "REJECT")
                            //        {
                            //            approvalFormRepository.ActionApprove(approvalIdDirect, "APPROVE", "", data.CandidateId);
                            //            //update flag AllLeaderApprovalFlag jadi true
                            //            var cekStatusApproval = approvalFormRepository.GetAllProgressByCandidate(dataCandidate.ID);
                            //            var flag = true;
                            //            foreach (var cekApproval in cekStatusApproval)
                            //            {
                            //                if (cekApproval.StatusApproval != "APPROVE")
                            //                {
                            //                    flag = false;
                            //                }
                            //            }
                            //            if (flag)
                            //            {
                            //                //update AllLeaderApprovalFlag jadi true
                            //                approvalFormRepository.UpdateFlagApprovalLeader(dataCandidate.ID);
                            //            }
                            //        }
                            //    }
                            //}


                            //insert approval untuk user HO
                            //var userHO = cnn.Query<UserViewModel>("SELECT acc.AgentCode FROM Account acc LEFT JOIN [Role] rol ON acc.RoleID = rol.ID WHERE rol.IsHO = 1 ");
                            //foreach (var item in userHO)
                            //{
                            //    //approval
                            //    var query = "INSERT INTO ApprovalList(CandidateId, RecruiterCode, ApproverCode) VALUES('" + data.CandidateId + "', '" + data.RecruiterAgentCode + "', '" + item.AgentCode + "'); SELECT CAST(SCOPE_IDENTITY() as int);";
                            //    var idApproval = cnn.Query<int>(query).Single();

                            //    //notification
                            //    var body = "Recruiter " + data.RecruiterAgentCode + " (" + data.RecruiterName + ") telah melakukan submit untuk proses rekrutmen calon agent " + data.AgentName + ", dan menunggu persetujuan anda.";
                            //    NotificationHelper.SendNotification(data.RecruiterAgentCode, item.AgentCode, "Menunggu Approval", body, "APPROVAL", data.CandidateId, idApproval);

                            //    //email
                            //    //var ApproverData = cnn.Query<UserViewModel>("SELECT DisplayName, Email FROM Account WHERE AgentCode = '" + item.ApproverCode + "'").FirstOrDefault();
                            //    //body = "Dear " + ApproverData.DisplayName + ", <br /><br />" +
                            //    //       "Recruiter " + data.RecruiterAgentCode + " (" + data.RecruiterName + ") telah melakukan submit untuk proses rekrutmen calon agent " + data.AgentName + ", dan menunggu persetujuan anda. <br /><br />" +
                            //    //       "Best Regards, <br /> Sunlife eRecruit";
                            //    //NotificationHelper.SendEmail("Email Notification eRecruit Approval", ApproverData.Email, body);
                            //}
                        } //END HIERARKI IS NOT NULL
                        else
                        {
                            return "Hierarki";
                        }
                    }
                    else
                    {
                        //ga bakal masuk sini karena ketika terjadi document check ubah isActive = 0 di approverList
                        //terjadi ketika revisi document cek
                        foreach (var item in countApprovalList)
                        {
                            if (item.ApproverCode != null)
                            {
                                //notification untuk approver
                                var body = "Recruiter " + data.RecruiterAgentCode + " (" + data.RecruiterName +
                                           ") telah melakukan submit untuk proses rekrutmen calon agent " +
                                           data.AgentName + ", dan menunggu persetujuan anda.";
                                NotificationHelper.SendNotification(item.RecruiterCode, item.ApproverCode,
                                    "Menunggu Approval", body, "APPROVAL", data.CandidateId, item.ID);

                                //send to leader
                                body = "Waiting approve by " +
                                       string.Concat(item.ApproverCode, " - ", item.ApproverName);
                                var title = data.AgentName;
                                NotificationHelper.SendNotification("Leader Approval", data.RecruiterAgentCode, title,
                                    body, "INFORMASI", data.ID, 0);


                                //email untuk approver
                                var ApproverData =
                                    cnn.Query<UserViewModel>(
                                        "SELECT DisplayName, Email FROM Account WHERE AgentCode = @agentCode",
                                        new {agentCode = item.ApproverCode}).FirstOrDefault();
                                if (ApproverData.Email != null && ApproverData.Email != "" &&
                                    !string.IsNullOrEmpty(ApproverData.Email))
                                {
                                    if (ApproverData.Email != "-")
                                    {
                                        body = "Dear " + ApproverData.DisplayName + ", <br /><br />" +
                                               "Recruiter " + data.RecruiterAgentCode + " (" + data.RecruiterName +
                                               ") telah melakukan submit untuk proses rekrutmen calon agent " +
                                               data.AgentName + ", dan menunggu persetujuan anda. <br /><br />" +
                                               "Best Regards, <br /> Sunlife eRecruit";
                                        NotificationHelper.SendEmail(
                                            "Email Notification eRecruit Approval " + statusApprovalAs,
                                            ApproverData.Email, body);
                                    }
                                }

                                //email untuk leader
                                //var RekruiterData = cnn.Query("select DisplayName, Email from account where agentcode = '" + data.RecruiterAgentCode + "'").FirstOrDefault();
                                //var RekruiterData = cnn.Query("select DisplayName, Email from account where agentcode = @agentCode", new { agentCode = data.RecruiterAgentCode }).FirstOrDefault();
                                if (RekruiterData.Email != null && RekruiterData.Email != "" &&
                                    !string.IsNullOrEmpty(RekruiterData.Email))
                                {
                                    if (RekruiterData.Email != "-")
                                    {
                                        body = "Waiting approve by " +
                                               string.Concat(item.ApproverCode, " - ", item.ApproverName);
                                        NotificationHelper.SendEmail(data.AgentName, RekruiterData.Email, body);
                                    }
                                }
                            }

                            //else
                            //{
                            //    //jika approver code nya sama dengan rekruter, maka langsung update approval set APPROVE
                            //    var approvalFormRepository = new ApprovalFormRepository();
                            //    var agentCodeRepository = new AgentCodeRepository();
                            //    var dataApproval = approvalFormRepository.GetApprovalById(item.ID);
                            //    var dataCandidate = agentCodeRepository.GetCandidateById(data.CandidateId);
                            //    var dataRecruiter = approvalFormRepository.GetAccount(dataApproval.RecruiterCode);
                            //    if (dataCandidate.Status != "REJECT")
                            //    {
                            //        approvalFormRepository.ActionApprove(item.ID, "APPROVE", "", data.CandidateId);
                            //        //update flag AllLeaderApprovalFlag jadi true
                            //        var cekStatusApproval = approvalFormRepository.GetAllProgressByCandidate(dataCandidate.ID);
                            //        var flag = true;
                            //        foreach (var cekApproval in cekStatusApproval)
                            //        {
                            //            if (cekApproval.StatusApproval != "APPROVE")
                            //            {
                            //                flag = false;
                            //            }
                            //        }
                            //        if (flag)
                            //        {
                            //            //update AllLeaderApprovalFlag jadi true
                            //            approvalFormRepository.UpdateFlagApprovalLeader(dataCandidate.ID);
                            //        }
                            //    }
                            //}
                        }
                    }

                    //CREATE TEMPORARY AGENT CODE
                    if (string.IsNullOrEmpty(data.TemporaryAgentCode))
                    {
                        var RunningNumber = cnn.Query<int>(DbQueryPortal.GetValueGlobalConfiguration,
                            new {Keyword = "TemporaryAgentCode"}).FirstOrDefault();
                        data.TemporaryAgentCode = "A" + String.Format("{0:00000}", RunningNumber);
                        //cnn.Execute("UPDATE GlobalConfiguration SET Value = " + (RunningNumber + 1) + " WHERE Keyword = 'TemporaryAgentCode'");
                        cnn.Execute("UPDATE GlobalConfiguration SET Value = @Value WHERE Keyword = @keyword",
                            new {Value = (RunningNumber + 1), keyword = "TemporaryAgentCode"});
                        cnn.Execute("UPDATE Candidate SET TemporaryAgentCode = @Value WHERE Id = @CandidateId",
                            new {Value = RunningNumber, CandidateId = data.CandidateId});
                        CreateElearningAccount(data);
                        //var email = RekruiterData.Email;
                        var email = data.Email;
                        if (email != null && !string.IsNullOrEmpty(email))
                        {
                            var body = "Halo, account anda telah terdaftar di Sunlife E-Learning. " +
                                       "Silahkan login ke aplikasi SunLife di " + AppUrlElearning +
                                       " dengan username " + data.TemporaryAgentCode + " " +
                                       //"dan password " + data.BirthDate.ToString("ddMMMyyyy", CultureInfo.CreateSpecificCulture("id-ID")) + "<br /><br />" +
                                       "dan password sesuai dengan tanggal lahir anda. <br />" +
                                       "Contoh Password: " +
                                       DateTime.Now.ToString("dd MMMM yyyy",
                                           CultureInfo.CreateSpecificCulture("id-ID")) + " = " +
                                       DateTime.Now.ToString("ddMMMyyyy", CultureInfo.CreateSpecificCulture("id-ID")) +
                                       "<br />" +
                                       "Januari: Jan <br />" +
                                       "Februari: Feb <br />" +
                                       "Maret: Mar <br />" +
                                       "April: Apr <br />" +
                                       "Mei: Mei <br />" +
                                       "Juni: Jun <br />" +
                                       "Juli: Jul <br />" +
                                       "Agustus: Agu <br />" +
                                       "September: Sep <br />" +
                                       "Oktober: Okt <br />" +
                                       "November: Nov <br />" +
                                       "Desember: Des <br /><br /><br />" +
                                       "Best Regards, <br /><br />" +
                                       "Sunlife eRecruit";
                            NotificationHelper.SendEmail("Registrasi Account Sunlife ELearning", data.Email, body);
                        }
                    }
                }
                else
                {
                    cnn.Execute("Update candidate set UpdateReSubmitDate = @UpdateReSubmitDate where Id = @CandidateId",
                        new {UpdateReSubmitDate = DateTime.Now, CandidateId = data.CandidateId});
                }

                #endregion approval, notification, eLearning account

                #region insert directmanager

                if (data.ManagerAgentCode != null || data.ManagerAgentCode != "")
                {
                    cnn.Execute(
                        "update Candidate set DirectManagerCode=@DirectManagerAgentCode where Id = @CandidateId",
                        new {DirectManagerAgentCode = data.ManagerAgentCode, CandidateId = data.CandidateId});
                }

                #endregion

                #region candidate basic info

                var SubmitDateCandidateTemp =
                    cnn.Query<String>("select SubmitDate from candidate where id = @id", new {id = data.CandidateId})
                        .FirstOrDefault();
                DateTime SubmitDateCandidate = new DateTime();
                if (SubmitDateCandidateTemp == null && data.isPendingDocument == false ||
                    SubmitDateCandidateTemp == null && data.isPendingDocument == true)
                {
                    SubmitDateCandidate = DateTime.Now;
                }
                else
                {
                    SubmitDateCandidate = DateTime.Parse(SubmitDateCandidateTemp);
                }

                cnn.Execute(DbQueryPortal.AddCandidateBasicInfo, new
                {
                    Name = data.AgentName,
                    Gender = data.Gender,
                    HomeAddress = data.HomeAddress,
                    CurrentAddress = data.CurrentAddress,
                    CityCode = data.CityCode,
                    PostalCode = data.PostalCode,
                    NPWPNo = data.NPWPNo,
                    NPWPName = data.NPWPName,
                    BankAccountNo = data.BankAccountNo,
                    BankAccountName = data.BankAccountName,
                    BankName = data.BankName,
                    Branch = data.Branch,
                    CandidateId = data.CandidateId,
                    ChangedWhen = DateTime.Now,
                    ChangedBy = HttpContext.Current.User.Identity.Name,
                    Status = status,
                    BirthDate = data.BirthDate,
                    TemporaryAgentCode = data.TemporaryAgentCode,
                    Email = data.Email,
                    MaritalStatus = data.MaritalStatus,
                    NPWPRelationWith = data.NPWPRelationWith,
                    BirthPlace = data.BirthPlace,
                    HomePhone = data.HomePhone,
                    KTPNo = data.KTPNo,
                    CurrentPostalCode = data.CurrentPostalCode,
                    PropertyOwnershpStatus = data.PropertyOwnershipStatus,
                    PTKPHeader = data.PTKPHeader,
                    PTKPDetail = data.PTKPDetail,
                    Level = data.Level,
                    CurrentCityCode = data.CurrentCityCode,
                    Religion = data.Religion,
                    Income = data.Income,
                    CandidateSignature = data.CandidateSignature,
                    RecruiterSignature = data.RecruiterSignature,
                    BankCode = data.BankCode,
                    SubmitDate = SubmitDateCandidate,
                    LocationCode = data.LocationCode,
                    //ini buat save ad agent director
                    AgentDirectorLocation = data.ManagerLocation
                });

                #endregion candidate basic info

                #region MaritalStatus

                if (data.MaritalStatus == "Menikah")
                {
                    cnn.Execute(DbQueryPortal.AddCandidateFamily, new
                    {
                        SpouseName = data.SpouseName,
                        SpouseBirthDate = data.SpouseBirthDate,
                        CandidateId = data.CandidateId
                    });
                }

                #endregion MaritalStatus

                #region candidate family

                #endregion

                #region insert aaji exam

                //if (data.AajiExamId != null)
                //{
                //var isAajiExist = cnn.Query("select * from aajiexamdetail where candidateid='" + data.CandidateId + "' and  aajiexamid ='" + data.AajiExamId + "'");
                //var queryaaji = "";
                //if (isAajiExist.ToList().Count == 0 || isAajiExist == null)
                //{
                //    queryaaji = "insert into Aajiexamdetail (CandidateId,AajiExamId,Status,Reason) values ('" + data.CandidateId + "','" + data.AajiExamId + "','SUBMIT',NULL);";
                //    cnn.Execute(queryaaji);
                //}
                //else
                //{
                //if (isAajiExist != null)
                //{
                //    queryaaji = "update aajiexamdetail set ProductType ='" + data.AajiExam.ProductType + "' where CandidateId='" + data.CandidateId + "'";
                //    cnn.Execute(queryaaji);
                //}
                //}

                //after uat cms ternyata tidak ada master jadwal aaji..
                if (data.AajiExam != null && data.AajiExam.AajiExamDate != DateTime.MinValue)
                {
                    int aajiId = 0;
                    //check is date with location and type is exist in db
                    var sql =
                        "select Id from AajiExam where convert(varchar(12),ExamDate,103) = @ExamDate and ExamLocationId = @ExamLocationId and ExamType = @ExamType";
                    var isDateIsExist = cnn.QueryFirstOrDefault<AajiViewModel>(sql,
                        new
                        {
                            ExamLocationId = data.AajiExam.ExamLocationId,
                            ExamType = data.AajiExam.ExamType,
                            ExamDate = data.AajiExam.AajiExamDate.ToShortDateString()
                        });
                    var GenerateCode = new GenerateCode();
                    string AajiExam = GenerateCode.AajiExam();

                    if (isDateIsExist == null)
                    {
                        sql =
                            "insert into AajiExam output inserted.ID values (@aajiexam,@examdate,0,@examlocationid,@note,@isactive,@isdelete,@createdwhen,@createdby,@changewhen,@changedby,@examtype)";
                        if (AajiExam != null)
                        {
                            aajiId = cnn.QueryFirstOrDefault<int>(sql,
                                new
                                {
                                    aajiexam = AajiExam,
                                    examdate = data.AajiExam.AajiExamDate,
                                    examlocationid = data.AajiExam.ExamLocationId,
                                    @note = "-",
                                    @isactive = 1,
                                    @isdelete = 0,
                                    @changewhen = DateTime.Now,
                                    @createdwhen = DateTime.Now,
                                    @changedby = "admin",
                                    @createdby = "admin",
                                    @examtype = data.AajiExam.ExamType
                                });
                            cnn.Execute("delete from AajiExamDetail where CandidateId = @id",
                                new {id = data.CandidateId});
                            sql = "insert aajiexamdetail values (@cId, @aajiId, @status, @reason, @producttype)";
                            cnn.Execute(sql,
                                new
                                {
                                    cId = data.CandidateId,
                                    aajiId = aajiId,
                                    status = "SUBMIT",
                                    reason = "",
                                    producttype = data.AajiExam.ProductType
                                });
                        }
                    }
                    else
                    {
                        cnn.Execute("delete from AajiExamDetail where CandidateId = @id", new {id = data.CandidateId});
                        sql = "insert aajiexamdetail values (@cId, @aajiId, @status, @reason, @producttype)";
                        cnn.Execute(sql,
                            new
                            {
                                cId = data.CandidateId,
                                aajiId = isDateIsExist.Id,
                                status = "SUBMIT",
                                reason = "",
                                producttype = data.AajiExam.ProductType
                            });
                    }
                }

                #endregion

                #region logic ketika pending doc

                if (data.isPendingDocument == true || (data.Status != null && data.Status.ToLower() == "draft"))
                {
                    cnn.Execute("UPDATE DocumentCheck SET STATUS='UPDATE' WHERE CANDIDATEID= @id", new
                    {
                        id = data.CandidateId
                    });
                }

                #endregion

                #region pernyataan informasi

                if (data.Pertanyaan1 != null && data.Pertanyaan2 != null && data.Pertanyaan3 != null &&
                    data.Pertanyaan4 != null)
                {
                    cnn.Execute("DELETE FROM CandidateInformasiPribadi WHERE CandidateId = @id",
                        new {id = data.CandidateId});
                    cnn.Execute(DbQueryPortal.AddCandidateInformasiPribadi, new
                    {
                        CandidateId = data.CandidateId,
                        Pertanyaan1 = data.Pertanyaan1,
                        Pertanyaan2 = data.Pertanyaan2,
                        Pertanyaan3 = data.Pertanyaan3,
                        Pertanyaan4 = data.Pertanyaan4
                    });
                }

                #endregion pernyataan informasi
            }

            return status;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        public string AddFormReqruitmentMobile(CandidateViewModel data)
        {
            var status = "SUBMIT";
            using (var cnn = OpenSunLifeDB())
            {
                data.isPendingDocument = cnn
                    .Query<bool>(
                        "select top 1 case Upper(dc.Status) when 'NEED REVISION' then 1 else 0 end [status] from Candidate c join DocumentCheck dc on c.ID=dc.CandidateId where c.Id = @agentCode",
                        new {agentCode = data.CandidateId}).FirstOrDefault();

                #region education

                //hapus data lama
                cnn.Execute("delete from CandidateEducation where CandidateId = @CandidateId",
                    new {CandidateId = data.CandidateId});
                //insert data baru
                if (data.Educations.Count > 0)
                {
                    foreach (var item in data.Educations)
                    {
                        cnn.Execute(DbQuery.AddCandidateEducation, new
                        {
                            CandidateId = data.CandidateId,
                            InstitutionName = item.InstitutionName,
                            YearFrom = item.YearFrom,
                            YearTo = item.YearTo,
                            Level = item.Level
                        });
                    }
                }

                ////cek status untuk education
                //if (lengthCurrent <= 0 && lengthUpdated <= 0)
                //{
                //    status = "DRAFT";
                //}

                #endregion education

                #region experience

                //hapus yang sudah ada
                cnn.Execute("delete from candidateExperience where CandidateId = @CandidateId",
                    new {CandidateId = data.CandidateId});
                //insert baru
                if (data.Experiences.Count > 0)
                {
                    foreach (var item in data.Experiences)
                    {
                        cnn.Execute(DbQuery.AddCandidateExperience, new
                        {
                            Id = item.Id,
                            CandidateId = data.CandidateId,
                            CompanyName = item.CompanyName,
                            QuitReason = item.QuitReason,
                            FromDate = item.FromDate,
                            Position = item.Position,
                            ToDate = item.ToDate
                        });
                    }
                }

                #endregion

                #region  candidate experience in insurance

                //hapus yang sudah ada
                cnn.Execute("delete from CandidateWorkExperienceInInsurance where CandidateId = @CandidateId",
                    new {CandidateId = data.CandidateId});
                //insert baru
                if (data.WorkExperiences.Count > 0)
                {
                    foreach (var item in data.WorkExperiences)
                    {
                        cnn.Execute(DbQueryPortal.AddCandidateWorkExperienceInInsurance, new
                        {
                            CandidateId = data.CandidateId,
                            CompanyName = item.CompanyName,
                            LastPosition = item.LastPosition,
                            MainOfficeAddress = item.MainOfficeAddress,
                            HasBeenJoinFor = item.HasBeenJoinFor,
                            TerminateDate = item.TerminateDate,
                            OldAgentCode = item.OldAgentCode
                        });
                    }
                }

                #endregion

                #region candidate relation in insurance

                //hapus yang dulu
                cnn.Execute("delete from CandidateRelationInInsurance where CandidateId = @CandidateId",
                    new {CandidateId = data.CandidateId});
                //insert baru
                if (data.Relations.Count > 0)
                {
                    foreach (var item in data.Relations)
                    {
                        cnn.Execute(DbQueryPortal.AddCandidateRelationInInsurance, new
                        {
                            Name = item.Name,
                            CandidateId = data.CandidateId,
                            Relation = item.Relation,
                            CompanyName = item.CompanyName,
                            Position = item.Position,
                            Year = item.Year
                        });
                    }
                }

                #endregion

                #region candidate dependencies

                //delete yang lama
                cnn.Execute("delete from CandidateDependencies where candidateId = @CandidateId",
                    new {CandidateId = data.CandidateId});

                if (data.MaritalStatus != "Belum Menikah")
                {
                    //insert baru
                    if (data.Dependencies.Count > 0)
                    {
                        foreach (var item in data.Dependencies)
                        {
                            cnn.Execute(DbQueryPortal.AddCandidateDependencies, new
                            {
                                CandidateId = data.CandidateId,
                                Status = item.Status,
                                Name = item.Name,
                                BirthDate = item.BirthDate
                            });
                        }
                    }
                }

                #endregion

                #region candidate reference

                //delete yang laman
                cnn.Execute("delete from CandidateReference where CandidateId = @CandidateId",
                    new {CandidateId = data.CandidateId});
                //insert baru
                if (data.References.Count > 0)
                {
                    foreach (var item in data.References)
                    {
                        cnn.Execute(DbQueryPortal.AddCandidateReference, new
                        {
                            CandidateId = data.CandidateId,
                            Name = item.Name,
                            Organization = item.Organization,
                            Relation = item.Relation,
                            PhoneNumber = item.PhoneNumber,
                            HasKnownFor = item.HasKnownFor
                        });
                    }
                }

                #endregion

                #region file

                int ktpId = data.photoKtpId;
                int pasFotoId = data.photoDiriId;
                //int kkId = data.photoKkId;
                int npwpId = data.photoNpwpId;
                int tabunganId = data.photoBukuTabunganId;
                int buktiTransferId = data.photoBuktiTransferId;

                //add candidate file mobile
                var fileUploadRepository = new FileUploadRepository();
                FileUploadMobileViewModel fileUpload = new FileUploadMobileViewModel();
                var userLogin = data.UserLoginName;
                string dirProject = System.AppDomain.CurrentDomain.BaseDirectory;
                string logFilePath = dirProject + "FileUpload\\";
                var fileName = "";

                if (ktpId == 0 && !string.IsNullOrEmpty(data.photoKtpbase64))
                {
                    var ktp = data.photoKtpbase64;
                    fileName = userLogin + "_" + DateTime.Now.ToString("ddMMyyhhmmss") + "(ktp).txt";
                    fileUpload.Path = logFilePath + Path.GetFileName(fileName);
                    fileUpload.FileName = fileName;
                    fileUpload.Base64String = ktp;
                    fileUpload.CreatedWho = userLogin;
                    fileUpload.ChangedWho = userLogin;
                    CreateTxtBase64ImageMobile(fileUpload);
                    ktpId = fileUploadRepository.UploadFileMobile(fileUpload);
                }


                if (pasFotoId == 0 && !string.IsNullOrEmpty(data.photoDiribase64))
                {
                    var pasFoto = data.photoDiribase64;
                    fileName = userLogin + "_" + DateTime.Now.ToString("ddMMyyhhmmss") + "(pasfoto).txt";
                    fileUpload.Path = logFilePath + Path.GetFileName(fileName);
                    fileUpload.FileName = fileName;
                    fileUpload.Base64String = pasFoto;
                    fileUpload.CreatedWho = userLogin;
                    fileUpload.ChangedWho = userLogin;
                    CreateTxtBase64ImageMobile(fileUpload);
                    pasFotoId = fileUploadRepository.UploadFileMobile(fileUpload);
                }

                //if (kkId == 0)
                //{
                //    var kk = data.photoKkbase64;
                //    fileName = userLogin + "_" + DateTime.Now.ToString("ddMMyyhhmmss") + "(kk).txt";
                //    fileUpload.Path = logFilePath + Path.GetFileName(fileName);
                //    fileUpload.FileName = fileName;
                //    fileUpload.Base64String = kk;
                //    fileUpload.CreatedWho = userLogin;
                //    fileUpload.ChangedWho = userLogin;
                //    CreateTxtBase64ImageMobile(fileUpload);
                //    kkId = fileUploadRepository.UploadFileMobile(fileUpload);
                //}

                if (npwpId == 0 && !string.IsNullOrEmpty(data.photoNpwpbase64))
                {
                    var npwp = data.photoNpwpbase64;
                    fileName = userLogin + "_" + DateTime.Now.ToString("ddMMyyhhmmss") + "(npwp).txt";
                    fileUpload.Path = logFilePath + Path.GetFileName(fileName);
                    fileUpload.FileName = fileName;
                    fileUpload.Base64String = npwp;
                    fileUpload.CreatedWho = userLogin;
                    fileUpload.ChangedWho = userLogin;
                    CreateTxtBase64ImageMobile(fileUpload);
                    npwpId = fileUploadRepository.UploadFileMobile(fileUpload);
                }

                if (tabunganId == 0 && !string.IsNullOrEmpty(data.photoBukuTabunganbase64))
                {
                    var tabungan = data.photoBukuTabunganbase64;
                    fileName = userLogin + "_" + DateTime.Now.ToString("ddMMyyhhmmss") + "(tabungan).txt";
                    fileUpload.Path = logFilePath + Path.GetFileName(fileName);
                    fileUpload.FileName = fileName;
                    fileUpload.Base64String = tabungan;
                    fileUpload.CreatedWho = userLogin;
                    fileUpload.ChangedWho = userLogin;
                    CreateTxtBase64ImageMobile(fileUpload);
                    tabunganId = fileUploadRepository.UploadFileMobile(fileUpload);
                }

                if (buktiTransferId == 0 && !string.IsNullOrEmpty(data.photoBuktiTransferbase64))
                {
                    var buktiTransfer = data.photoBuktiTransferbase64;
                    fileName = userLogin + "_" + DateTime.Now.ToString("ddMMyyhhmmss") + "(buktiTransfer).txt";
                    fileUpload.Path = logFilePath + Path.GetFileName(fileName);
                    fileUpload.FileName = fileName;
                    fileUpload.Base64String = buktiTransfer;
                    fileUpload.CreatedWho = userLogin;
                    fileUpload.ChangedWho = userLogin;
                    CreateTxtBase64ImageMobile(fileUpload);
                    buktiTransferId = fileUploadRepository.UploadFileMobile(fileUpload);
                }

                cnn.Execute(
                    "delete from CandidateFile where lower(Type) not in ('google','aml','atf') and CandidateID =@id",
                    new {id = data.CandidateId});
                if (ktpId != 0)
                {
                    cnn.Execute(DbQuery.AddCandidateFile, new
                    {
                        CandidateID = data.CandidateId,
                        Type = "KTP",
                        FileID = ktpId,
                        CreatedBy = userLogin, //HttpContext.Current.User.Identity.Name,
                        CreatedWhen = DateTime.Now,
                        ChangedBy = userLogin, //HttpContext.Current.User.Identity.Name,
                        ChangedWhen = DateTime.Now
                    });
                }

                if (pasFotoId != 0)
                {
                    cnn.Execute(DbQuery.AddCandidateFile, new
                    {
                        CandidateID = data.CandidateId,
                        Type = "FotoDiri",
                        FileID = pasFotoId,
                        CreatedBy = userLogin, //HttpContext.Current.User.Identity.Name,
                        CreatedWhen = DateTime.Now,
                        ChangedBy = userLogin, //HttpContext.Current.User.Identity.Name,
                        ChangedWhen = DateTime.Now
                    });
                }

                if (npwpId != 0)
                {
                    cnn.Execute(DbQuery.AddCandidateFile, new
                    {
                        CandidateID = data.CandidateId,
                        Type = "NPWP",
                        FileID = npwpId,
                        CreatedBy = userLogin, //HttpContext.Current.User.Identity.Name,
                        CreatedWhen = DateTime.Now,
                        ChangedBy = userLogin, //HttpContext.Current.User.Identity.Name,
                        ChangedWhen = DateTime.Now
                    });
                }

                //cnn.Execute(DbQuery.AddCandidateFile, new
                //{
                //    CandidateID = data.CandidateId,
                //    Type = "KK",
                //    FileID = kkId,
                //    CreatedBy = userLogin,
                //    CreatedWhen = DateTime.Now,
                //    ChangedBy = userLogin,//HttpContext.Current.User.Identity.Name,
                //    ChangedWhen = DateTime.Now
                //});

                if (tabunganId != 0)
                {
                    cnn.Execute(DbQuery.AddCandidateFile, new
                    {
                        CandidateID = data.CandidateId,
                        Type = "TABUNGAN",
                        FileID = tabunganId,
                        CreatedBy = userLogin, //HttpContext.Current.User.Identity.Name,
                        CreatedWhen = DateTime.Now,
                        ChangedBy = userLogin, //HttpContext.Current.User.Identity.Name,
                        ChangedWhen = DateTime.Now
                    });
                }

                if (buktiTransferId != 0)
                {
                    cnn.Execute(DbQuery.AddCandidateFile, new
                    {
                        CandidateID = data.CandidateId,
                        Type = "TRANSFER",
                        FileID = buktiTransferId,
                        CreatedBy = userLogin, //HttpContext.Current.User.Identity.Name,
                        CreatedWhen = DateTime.Now,
                        ChangedBy = userLogin, //HttpContext.Current.User.Identity.Name,
                        ChangedWhen = DateTime.Now
                    });
                }

                #endregion file

                #region validasi

                var cekHierarki = cnn.Query<int>("SELECT COUNT(*) FROM ApprovalHierarki WHERE AgentCode = @AgentCode",
                    new {AgentCode = data.RecruiterAgentCode}).FirstOrDefault();
                if (cekHierarki <= 0)
                {
                    return "Hierarki";
                }

                if (string.IsNullOrEmpty(data.AgentName) || string.IsNullOrEmpty(data.Gender) ||
                    string.IsNullOrEmpty(data.HomeAddress) ||
                    string.IsNullOrEmpty(data.CurrentAddress) || data.CityCode == "" || data.CurrentCityCode == "" ||
                    string.IsNullOrEmpty(data.AgentName) ||
                    string.IsNullOrEmpty(data.PostalCode) || string.IsNullOrEmpty(data.NPWPNo) ||
                    string.IsNullOrEmpty(data.NPWPName) ||
                    string.IsNullOrEmpty(data.BankAccountNo) ||
                    string.IsNullOrEmpty(data.BankAccountName) || string.IsNullOrEmpty(data.BankName) ||
                    string.IsNullOrEmpty(data.Branch))
                {
                    status = "DRAFT";
                }

                #endregion validasi

                #region approval, notification, eLearning account

                var RekruiterData =
                    cnn.Query<UserViewModel>("select DisplayName, Email from account where agentcode = @agentCode",
                        new {agentCode = data.RecruiterAgentCode}).FirstOrDefault();

                status = "SUBMIT";
                if (status == "SUBMIT" && data.isPendingDocument == false)
                {
                    var AppUrlElearning = ConfigurationManager.AppSettings["AppUrlElearning"];
                    var AppUrlErecruit = ConfigurationManager.AppSettings["AppUrlErecruit"];
                    //CEK RULES APPROVAL DAN HIERARKI KEMUDIAN INSERT KE LIST APPROVAL
                    //cnn.Execute("DELETE ApprovalList WHERE CandidateId = " + data.CandidateId);

                    string statusApprovalAs = "(Direct Manager)";

                    //var countApprovalList = cnn.Query<ApprovalProgressViewModel>("SELECT * FROM ApprovalList WHERE CandidateId = " + data.CandidateId);
                    //var countApprovalList = cnn.Query<ApprovalProgressViewModel>("SELECT al.*,a.DisplayName ApproverName FROM ApprovalList al left join account a on a.LoginName=al.ApproverCode WHERE al.IsActive = 1 and al.CandidateId = " + data.CandidateId);
                    var countApprovalList = cnn.Query<ApprovalProgressViewModel>(
                        "SELECT al.*,a.DisplayName ApproverName FROM ApprovalList al left join account a on a.LoginName=al.ApproverCode WHERE al.IsActive = @IsActive and al.CandidateId = @id",
                        new {IsActive = 1, id = data.CandidateId});

                    if (countApprovalList.Count() <= 0)
                    {
                        var rulesApproval = cnn.Query<ApprovalRuleViewModel>(
                            "SELECT * FROM ApprovalRules WHERE CandidateLevel = @Level and isdelete = @IsDelete",
                            new {Level = data.Level, IsDelete = 0});
                        if (rulesApproval.Count() == 0)
                        {
                            return "RulesApproval";
                        }

                        StringBuilder sb = new StringBuilder();
                        List<int> listApp = new List<int>();
                        foreach (var item in rulesApproval)
                        {
                            sb.Append("'" + item.ApprovalLevelId + "',");
                            listApp.Add(Convert.ToInt32(item.LastApprover));
                        }

                        var listApprover = sb.ToString().Remove(sb.Length - 1);
                        //var hierarki = cnn.Query<HierarkiViewModel>("SELECT * FROM ApprovalHierarki WHERE AgentCode = '" + data.RecruiterAgentCode + "' AND LevelId IN(" + listApprover + ")");

                        ////mukti new march 11
                        //var hierarki = cnn.Query<HierarkiViewModel>("SELECT top 1 * FROM ApprovalHierarki WHERE AgentCode = '" + data.RecruiterAgentCode + "' AND LevelId IN(" + listApprover + ") and isdelete = 0 order by sequence");
                        //var hierarki = cnn.Query<HierarkiViewModel>("SELECT top 1 ah.*,a.DisplayName ApproverName FROM ApprovalHierarki ah left join account a on ah.ApproverCode=a.LoginName WHERE ah.AgentCode = '" + data.RecruiterAgentCode + "' AND ah.LevelId IN(" + listApprover + ") and ah.isdelete = 0 order by ah.sequence");
                        var hierarki = cnn.Query<HierarkiViewModel>(
                            "SELECT top 1 ah.*,a.DisplayName ApproverName FROM ApprovalHierarki ah left join account a on ah.ApproverCode=a.LoginName WHERE ah.AgentCode = @agentCode AND ah.LevelId IN(" +
                            listApprover + ") and ah.isdelete = @IsDelete order by ah.sequence",
                            new {agentCode = data.RecruiterAgentCode, IsDelete = 0});

                        if (data.Level == "5")
                        {
                            hierarki = cnn.Query<HierarkiViewModel>(
                                "SELECT top 1 ah.*,a.DisplayName ApproverName FROM ApprovalHierarki ah left join account a on ah.ApproverCode=a.LoginName WHERE ah.AgentCode = @AgentCode AND ah.LevelId IN (" +
                                listApprover +
                                ") and ah.isdelete = @IsDelete and a.LoginName = @DirectManagerCode order by ah.sequence",
                                new
                                {
                                    AgentCode = data.RecruiterAgentCode,
                                    IsDelete = 0,
                                    DirectManagerCode = data.ManagerAgentCode
                                });
                        }

                        var candidateData = cnn.QueryFirstOrDefault<CandidateViewModel>(DbQueryPortal.GetCandidate,
                            new {CandidateId = data.CandidateId});


                        if (hierarki != null)
                        {
                            foreach (var item in hierarki)
                            {
                                cnn.Execute(
                                    "DELETE Inbox WHERE CandidateId = @id AND ToMail IN (@approverCode, @recruiterCode)",
                                    new
                                    {
                                        id = data.CandidateId,
                                        approverCode = item.ApproverCode,
                                        recruiterCode = data.RecruiterAgentCode
                                    });

                                //approval
                                //var query = "INSERT INTO ApprovalList(CandidateId, RecruiterCode, ApproverCode, IsActive) VALUES('" + data.CandidateId + "', '" + data.RecruiterAgentCode + "', '" + item.ApproverCode + "',1); SELECT CAST(SCOPE_IDENTITY() as int);";
                                var query =
                                    "INSERT INTO ApprovalList(CandidateId, RecruiterCode, ApproverCode, IsActive) VALUES( @id,@recruiterCode,@approverCode,@IsActive); SELECT CAST(SCOPE_IDENTITY() as int);";
                                var idApproval = cnn.Query<int>(query,
                                    new
                                    {
                                        id = data.CandidateId,
                                        recruiterCode = data.RecruiterAgentCode,
                                        approverCode = item.ApproverCode,
                                        IsActive = 1
                                    }).Single();

                                //notification untuk leader
                                var body = "Calon Agen (" + data.AgentName + ") yang telah di rekrut oleh perekrut (" +
                                           data.RecruiterAgentCode + " - " + data.RecruiterName +
                                           ") menunggu persetujuan anda.";
                                NotificationHelper.SendNotification(item.AgentCode, item.ApproverCode,
                                    "Menunggu Approval " + statusApprovalAs, body, "APPROVAL", data.CandidateId,
                                    idApproval);

                                //notif ke recruiter
                                //body = "Waiting approval by " + hierarki.Select(x => x.ApproverName).FirstOrDefault();
                                body = "Waiting approve by " +
                                       string.Concat(item.ApproverCode, " - ", item.ApproverName);
                                var title = candidateData.AgentName;
                                NotificationHelper.SendNotification("Leader Approval", data.RecruiterAgentCode, title,
                                    body, "INFORMASI", data.CandidateId, idApproval);

                                #region "email untuk leader"

                                // var RekruiterData = cnn.Query("select DisplayName, Email from account where agentcode = @recruiterCode", new { recruiterCode = data.RecruiterAgentCode }).FirstOrDefault();

                                if (RekruiterData.Email != null && RekruiterData.Email != "" &&
                                    !string.IsNullOrEmpty(RekruiterData.Email))
                                {
                                    if (RekruiterData.Email != "-")
                                    {
                                        body = "Waiting approve by " +
                                               string.Concat(item.ApproverCode, " - ", item.ApproverName);
                                        NotificationHelper.SendEmail(data.AgentName, RekruiterData.Email, body);
                                    }
                                }

                                #endregion

                                #region "email untuk leader"

                                var ApproverData =
                                    cnn.Query<UserViewModel>(
                                        "SELECT DisplayName, Email FROM Account WHERE AgentCode = @recruiterCode",
                                        new {recruiterCode = item.ApproverCode}).FirstOrDefault();
                                if (ApproverData.Email != null && ApproverData.Email != "" &&
                                    !string.IsNullOrEmpty(ApproverData.Email))
                                {
                                    if (ApproverData.Email != "-")
                                    {
                                        body = "Dear " + ApproverData.DisplayName + ", <br /><br />" +
                                               "Recruiter " + data.RecruiterAgentCode + " (" + data.RecruiterName +
                                               ") telah melakukan submit untuk proses rekrutmen calon agent " +
                                               data.AgentName + ", dan menunggu persetujuan anda. <br /><br />" +
                                               "Best Regards, <br /> Sunlife eRecruit";
                                        NotificationHelper.SendEmail(
                                            "Email Notification eRecruit Approval " + statusApprovalAs,
                                            ApproverData.Email, body);
                                    }
                                }

                                #endregion
                            }

                            //insert approval untuk user HO
                            //var userHO = cnn.Query<UserViewModel>("SELECT acc.AgentCode FROM Account acc LEFT JOIN [Role] rol ON acc.RoleID = rol.ID WHERE rol.IsHO = 1 ");
                            //foreach (var item in userHO)
                            //{
                            //    //approval
                            //    var query = "INSERT INTO ApprovalList(CandidateId, RecruiterCode, ApproverCode) VALUES('" + data.CandidateId + "', '" + data.RecruiterAgentCode + "', '" + item.AgentCode + "'); SELECT CAST(SCOPE_IDENTITY() as int);";
                            //    var idApproval = cnn.Query<int>(query).Single();

                            //    //notification
                            //    var body = "Recruiter " + data.RecruiterAgentCode + " (" + data.RecruiterName + ") telah melakukan submit untuk proses rekrutmen calon agent " + data.AgentName + ", dan menunggu persetujuan anda.";
                            //    NotificationHelper.SendNotification(data.RecruiterAgentCode, item.AgentCode, "Menunggu Approval", body, "APPROVAL", data.CandidateId, idApproval);

                            //    //email
                            //    //var ApproverData = cnn.Query<UserViewModel>("SELECT DisplayName, Email FROM Account WHERE AgentCode = '" + item.ApproverCode + "'").FirstOrDefault();
                            //    //body = "Dear " + ApproverData.DisplayName + ", <br /><br />" +
                            //    //       "Recruiter " + data.RecruiterAgentCode + " (" + data.RecruiterName + ") telah melakukan submit untuk proses rekrutmen calon agent " + data.AgentName + ", dan menunggu persetujuan anda. <br /><br />" +
                            //    //       "Best Regards, <br /> Sunlife eRecruit";
                            //    //NotificationHelper.SendEmail("Email Notification eRecruit Approval", ApproverData.Email, body);
                            //}
                        }
                    }
                    else
                    {
                        //utk saat ini ga bakal masuk sini karena setiap terjadi document check dgn status revisi akan mengubah isActive = 0
                        //terjadi ketika dokument check
                        foreach (var item in countApprovalList)
                        {
                            //notification untuk next approver
                            var body = "Recruiter " + data.RecruiterAgentCode + " (" + data.RecruiterName +
                                       ") telah melakukan submit untuk proses rekrutmen calon agent " + data.AgentName +
                                       ", dan menunggu persetujuan anda.";

                            //notif ke recruiter
                            body = "Waiting approval by " + item.ApproverName;
                            var title = data.Name;
                            NotificationHelper.SendNotification("Leader Approval", data.RecruiterAgentCode, title, body,
                                "INFORMASI", data.CandidateId, item.ID);

                            var RecruiterData =
                                cnn.Query<UserViewModel>(
                                    "SELECT DisplayName, Email FROM Account WHERE AgentCode = @recruiterCode",
                                    new {recruiterCode = data.RecruiterAgentCode}).FirstOrDefault();
                            NotificationHelper.SendEmail("title", RecruiterData.Email, body);

                            ////email untuk leader
                            //var ApproverData = cnn.Query<UserViewModel>("SELECT DisplayName, Email FROM Account WHERE AgentCode = '" + item.ApproverCode + "'").FirstOrDefault();

                            var ApproverData =
                                cnn.Query<UserViewModel>(
                                    "SELECT DisplayName, Email FROM Account WHERE AgentCode = @recruiterCode",
                                    new {recruiterCode = item.ApproverCode}).FirstOrDefault();

                            if (ApproverData.Email != null && ApproverData.Email != "" &&
                                !string.IsNullOrEmpty(ApproverData.Email))
                            {
                                if (ApproverData.Email != "-")
                                {
                                    body = "Dear " + ApproverData.DisplayName + ", <br /><br />" +
                                           "Recruiter " + data.RecruiterAgentCode + " (" + data.RecruiterName +
                                           ") telah melakukan submit untuk proses rekrutmen calon agent " +
                                           data.AgentName + ", dan menunggu persetujuan anda. <br /><br />" +
                                           "Best Regards, <br /> Sunlife eRecruit";
                                    NotificationHelper.SendEmail("Email Notification eRecruit Approval",
                                        ApproverData.Email, body);
                                }
                            }
                        }
                    }

                    //CREATE TEMPORARY AGENT CODE
                    if (string.IsNullOrEmpty(data.TemporaryAgentCode))
                    {
                        var RunningNumber = cnn.Query<int>(DbQueryPortal.GetValueGlobalConfiguration,
                            new {Keyword = "TemporaryAgentCode"}).FirstOrDefault();
                        data.TemporaryAgentCode = "A" + String.Format("{0:00000}", RunningNumber);
                        //cnn.Execute("UPDATE GlobalConfiguration SET Value = " + (RunningNumber + 1) + " WHERE Keyword = 'TemporaryAgentCode'");
                        cnn.Execute("UPDATE GlobalConfiguration SET Value = @Value WHERE Keyword = @keyword",
                            new {Value = (RunningNumber + 1), keyword = "TemporaryAgentCode"});
                        cnn.Execute("UPDATE Candidate SET TemporaryAgentCode = @Value WHERE Id = @CandidateId",
                            new {Value = RunningNumber, CandidateId = data.CandidateId});
                        CreateElearningAccount(data);
                        //var email = RekruiterData.Email;
                        var email = data.Email;
                        if (email != null && !string.IsNullOrEmpty(email))
                        {
                            var body = "Halo, account anda telah terdaftar di Sunlife E-Learning. " +
                                       "Silahkan login ke aplikasi SunLife di " + AppUrlElearning +
                                       " dengan username " + data.TemporaryAgentCode + " " +
                                       //"dan password " + data.BirthDate.ToString("ddMMMyyyy", CultureInfo.CreateSpecificCulture("id-ID")) + "<br /><br />" +
                                       "dan password sesuai dengan tanggal lahir anda. <br />" +
                                       "Contoh Password: " +
                                       DateTime.Now.ToString("dd MMMM yyyy",
                                           CultureInfo.CreateSpecificCulture("id-ID")) + " = " +
                                       DateTime.Now.ToString("ddMMMyyyy", CultureInfo.CreateSpecificCulture("id-ID")) +
                                       "<br />" +
                                       "Januari: Jan <br />" +
                                       "Februari: Feb <br />" +
                                       "Maret: Mar <br />" +
                                       "April: Apr <br />" +
                                       "Mei: Mei <br />" +
                                       "Juni: Jun <br />" +
                                       "Juli: Jul <br />" +
                                       "Agustus: Agu <br />" +
                                       "September: Sep <br />" +
                                       "Oktober: Okt <br />" +
                                       "November: Nov <br />" +
                                       "Desember: Des <br /><br /><br />" +
                                       "Best Regards, <br /><br />" +
                                       "Sunlife eRecruit";
                            NotificationHelper.SendEmail("Registrasi Account Sunlife ELearning", data.Email, body);
                        }
                    }
                }
                else
                {
                    cnn.Execute("Update candidate set UpdateReSubmitDate = @UpdateReSubmitDate where Id = @CandidateId",
                        new {UpdateReSubmitDate = DateTime.Now, CandidateId = data.CandidateId});
                }

                #endregion approval, notification, eLearning account

                #region insert directmanager

                if (data.ManagerAgentCode != null || data.ManagerAgentCode != "")
                {
                    cnn.Execute(
                        "update Candidate set DirectManagerCode=@DirectManagerAgentCode where Id = @CandidateId",
                        new {DirectManagerAgentCode = data.ManagerAgentCode, CandidateId = data.CandidateId});
                }

                #endregion

                #region candidate basic info

                var SubmitDateCandidateTemp =
                    cnn.Query<String>("select SubmitDate from candidate where id = @id", new {id = data.CandidateId})
                        .FirstOrDefault();
                DateTime SubmitDateCandidate = new DateTime();
                if (SubmitDateCandidateTemp == null && data.isPendingDocument == false ||
                    SubmitDateCandidateTemp == null && data.isPendingDocument == true)
                {
                    SubmitDateCandidate = DateTime.Now;
                }
                else
                {
                    SubmitDateCandidate = DateTime.Parse(SubmitDateCandidateTemp);
                }

                cnn.Execute(DbQueryPortal.AddCandidateBasicInfoMobile, new
                {
                    Name = data.AgentName,
                    Gender = data.Gender,
                    HomeAddress = data.HomeAddress,
                    CurrentAddress = data.CurrentAddress,
                    CityCode = data.CityCode,
                    PostalCode = data.PostalCode,
                    NPWPNo = data.NPWPNo,
                    NPWPName = data.NPWPName,
                    BankAccountNo = data.BankAccountNo,
                    BankAccountName = data.BankAccountName,
                    BankName = data.BankName,
                    Branch = data.Branch,
                    CandidateId = data.CandidateId,
                    ChangedWhen = DateTime.Now.ToString("MM/dd/yyyy"),
                    ChangedBy = userLogin, ///HttpContext.Current.User.Identity.Name,
                    Status = status,
                    BirthDate = data.BirthDate,
                    TemporaryAgentCode = data.TemporaryAgentCode,
                    Email = data.Email,
                    MaritalStatus = data.MaritalStatus,
                    NPWPRelationWith = data.NPWPRelationWith,
                    BirthPlace = data.BirthPlace,
                    HomePhone = data.HomePhone,
                    KTPNo = data.KTPNo,
                    CurrentPostalCode = data.CurrentPostalCode,
                    PropertyOwnershpStatus = data.PropertyOwnershipStatus,
                    PTKPHeader = data.PTKPHeader,
                    PTKPDetail = data.PTKPDetail,
                    Level = data.Level,
                    CurrentCityCode = data.CurrentCityCode,
                    Religion = data.Religion,
                    Income = data.Income,
                    CandidateSignature = data.CandidateSignature,
                    RecruiterSignature = data.RecruiterSignature,
                    BankCode = data.BankCode,
                    SubmitDate = SubmitDateCandidate,
                    LocationCode = data.LocationCode,
                    //ini buat save ad agent director
                    AgentDirectorLocation = data.ManagerLocation
                });

                #endregion candidate basic info

                #region add candidate family

                if (data.MaritalStatus == "Menikah")
                {
                    cnn.Execute(DbQueryPortal.AddCandidateFamily, new
                    {
                        SpouseName = data.SpouseName,
                        SpouseBirthDate = data.SpouseBirthDate,
                        CandidateId = data.CandidateId
                    });
                }

                #endregion

                #region insert aaji exam

                //if (data.AajiExamId != null)
                //{
                //    //var isAajiExist = cnn.Query("select * from aajiexamdetail where candidateid='" + data.CandidateId + "' and  aajiexamid ='" + data.AajiExamId + "'");
                //    var isAajiExist = cnn.Query("select * from aajiexamdetail where candidateid=@id and  aajiexamid =@aaji", new { id = data.CandidateId, aaji = data.AajiExamId });
                //    var queryaaji = "";
                //    if (isAajiExist.ToList().Count == 0 || isAajiExist == null)
                //    {
                //        //queryaaji = "insert into aajiexamdetail values ('" + data.CandidateId + "','" + data.AajiExamId + "','SUBMIT',NULL);";
                //        queryaaji = "insert into aajiexamdetail values (@id,@aaji,@status,@reason,@pd);";
                //        cnn.Execute(queryaaji, new { id = data.CandidateId, aaji = data.AajiExamId, status = "SUBMIT", reason = "", pd = data.AajiExam.ProductType });
                //    }
                //    else
                //    {
                //        //queryaaji = "update aajiexamdetail set AajiExamId='" + data.AajiExamId + "' where CandidateId='" + data.CandidateId + "'";
                //        queryaaji = "update aajiexamdetail set AajiExamId=@aaji, ProductType = @pd where CandidateId= @id";
                //        cnn.Execute(queryaaji, new { aaji = data.AajiExamId, id = data.CandidateId, pd = data.AajiExam.ProductType });
                //    }
                //}
                //after uat cms ternyata tidak ada master jadwal aaji..
                if (data.AajiExam != null && data.AajiExam.AajiExamDate != DateTime.MinValue)
                {
                    int aajiId = 0;
                    //check is date with location and type is exist in db
                    var sql =
                        "select Id from AajiExam where convert(varchar(12),ExamDate,103) = @ExamDate and ExamLocationId = @ExamLocationId and ExamType = @ExamType";
                    var isDateIsExist = cnn.QueryFirstOrDefault<AajiViewModel>(sql,
                        new
                        {
                            ExamLocationId = data.AajiExam.ExamLocationId,
                            ExamType = data.AajiExam.ExamType,
                            ExamDate = data.AajiExam.AajiExamDate.ToShortDateString()
                        });
                    var GenerateCode = new GenerateCode();
                    string AajiExam = GenerateCode.AajiExam();

                    if (isDateIsExist == null)
                    {
                        sql =
                            "insert into AajiExam output inserted.ID values (@aajiexam,@examdate,0,@examlocationid,@note,@isactive,@isdelete,@createdwhen,@createdby,@changewhen,@changedby,@examtype)";
                        if (AajiExam != null)
                        {
                            aajiId = cnn.QueryFirstOrDefault<int>(sql,
                                new
                                {
                                    aajiexam = AajiExam,
                                    examdate = data.AajiExam.AajiExamDate,
                                    examlocationid = data.AajiExam.ExamLocationId,
                                    @note = "-",
                                    @isactive = 1,
                                    @isdelete = 0,
                                    @changewhen = DateTime.Now,
                                    @createdwhen = DateTime.Now,
                                    @changedby = "admin",
                                    @createdby = "admin",
                                    @examtype = data.AajiExam.ExamType
                                });
                            cnn.Execute("delete from AajiExamDetail where CandidateId = @id",
                                new {id = data.CandidateId});
                            sql = "insert aajiexamdetail values (@cId, @aajiId, @status, @reason, @producttype)";
                            cnn.Execute(sql,
                                new
                                {
                                    cId = data.CandidateId,
                                    aajiId = aajiId,
                                    status = "SUBMIT",
                                    reason = "",
                                    producttype = data.AajiExam.ProductType
                                });
                        }
                    }
                    else
                    {
                        cnn.Execute("delete from AajiExamDetail where CandidateId = @id", new {id = data.CandidateId});
                        sql = "insert aajiexamdetail values (@cId, @aajiId, @status, @reason, @producttype)";
                        cnn.Execute(sql,
                            new
                            {
                                cId = data.CandidateId,
                                aajiId = isDateIsExist.Id,
                                status = "SUBMIT",
                                reason = "",
                                producttype = data.AajiExam.ProductType
                            });
                    }
                }

                #endregion

                #region logic ketika pending doc

                if (data.isPendingDocument == true || (data.Status != null && data.Status.ToLower() == "draft"))
                {
                    cnn.Execute("UPDATE DocumentCheck SET STATUS='UPDATE' WHERE CANDIDATEID= @id", new
                    {
                        id = data.CandidateId
                    });
                }

                #endregion

                #region pernyataan informasi

                if (data.Pertanyaan1 != null && data.Pertanyaan2 != null && data.Pertanyaan3 != null &&
                    data.Pertanyaan4 != null)
                {
                    cnn.Execute("DELETE FROM CandidateInformasiPribadi WHERE CandidateId = @id ",
                        new {@id = data.CandidateId});
                    cnn.Execute(DbQueryPortal.AddCandidateInformasiPribadi, new
                    {
                        CandidateId = data.CandidateId,
                        Pertanyaan1 = data.Pertanyaan1,
                        Pertanyaan2 = data.Pertanyaan2,
                        Pertanyaan3 = data.Pertanyaan3,
                        Pertanyaan4 = data.Pertanyaan4
                    });
                }

                #endregion pernyataan informasi
            }

            return status;
        }


        public void CreateElearningAccount(CandidateViewModel user)
        {
            try
            {
                var TypeID = "0";
                CultureInfo ci = new CultureInfo("id-ID");
                using (var cnn = OpenSunLifeDB())
                {
                    var tempBirthdate =
                        cnn.Query<string>(
                            "select top 1 format(birthdate,'ddMMMyyyy') from Candidate where TemporaryAgentCode = @TemporaryAgentCode",
                            new {TemporaryAgentCode = user.TemporaryAgentCode}).FirstOrDefault();
                    var generatePassword = string.IsNullOrEmpty(tempBirthdate)
                        ? user.BirthDate.ToString("ddMMMyyyy", ci)
                        : tempBirthdate;
                    user.Password = RijndaelManagedEncryption.EncryptRijndael(generatePassword);

                    var isSyariah = cnn.Query<bool>(DbQueryPortal.GetSyariahFlagByCandidateId,
                        new {CandidateId = user.CandidateId}).FirstOrDefault();
                    if (isSyariah)
                    {
                        var config = cnn.Query<GlobalConfigurationViewModel>(DbQuery.GetGlobalConfigurationByKeyword,
                            new {Keyword = "SyariahBusinessTypeId"}).FirstOrDefault();
                        TypeID = config.Value;
                    }
                    else
                    {
                        var config = cnn.Query<GlobalConfigurationViewModel>(DbQuery.GetGlobalConfigurationByKeyword,
                            new {Keyword = "KonvensionalBusinessTypeId"}).FirstOrDefault();
                        TypeID = config.Value;
                    }
                }

                using (var cnn = OpenSunLifeElearningDB())
                {
                    cnn.Execute(DbQueryPortal.AddElearningAccount, new
                    {
                        LoginName = user.TemporaryAgentCode,
                        Password = user.Password,
                        RoleID = "2",
                        TypeID = TypeID,
                        isActive = "1",
                        isDeleted = "0",
                        DisplayName = user.AgentName,
                        ManagerLoginName = "",
                        Email = user.Email,
                        JoinDate = DateTime.Now.ToString("MM/dd/yyyy"),
                        createdWhen = DateTime.Now.ToString("MM/dd/yyyy"),
                        createdWho = "ERECRUIT",
                        changedWhen = DateTime.Now.ToString("MM/dd/yyyy"),
                        changedWho = "ERECRUIT",
                        BirthDate = user.BirthDate.ToString("MM/dd/yyyy"),
                        Ktp = user.KTPNo
                    });
                }
            }
            catch (Exception ex)
            {
                var message = ex.Message;
            }
        }
        //public void SendEmail(string Subject, string Email, string BodyEmail)
        //{
        //    string smtpHostServer = WebConfigurationManager.AppSettings["SmtpHostServer"];
        //    int smtpPort = Convert.ToInt32(WebConfigurationManager.AppSettings["SmtpPort"]);
        //    string smtpUserMail = WebConfigurationManager.AppSettings["SmtpUserMail"];
        //    string smtpPasswordMail = WebConfigurationManager.AppSettings["SmtpPasswordMail"];

        //    var smtpClient = new SmtpClient();
        //    smtpClient.Host = smtpHostServer;
        //    smtpClient.Port = smtpPort;
        //    smtpClient.Credentials = new NetworkCredential(smtpUserMail, smtpPasswordMail);
        //    smtpClient.EnableSsl = true;

        //    MailMessage message = new MailMessage();
        //    message.From = new MailAddress(smtpUserMail);
        //    message.To.Add(Email);
        //    message.Subject = Subject;
        //    message.IsBodyHtml = true;
        //    message.Body = BodyEmail;
        //    smtpClient.Send(message);
        //}

        public IEnumerable<AvailableLevelViewModel> GetCandidateAvailableLevel(int totalscore, int group)
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.Query<AvailableLevelViewModel>(DbQuery.GetCandidateListLevel,
                    new {TotalScore = totalscore, Group = group});
            }
        }

        //iin untuk download excel DocumentCheck
        public String GetDataDC(int candidateId)
        {
            var candidate = new CandidateViewModel();

            using (var cnn = OpenSunLifeDB())
            {
                return cnn.Query<String>("exec GetFullCandidateData @CandidateId", new {CandidateId = candidateId})
                    .Single();
            }
        }

        public CandidateViewModel GetData(int candidateId)
        {
            var candidate = new CandidateViewModel();

            using (var cnn = OpenSunLifeDB())
            {
                candidate = cnn.QueryFirstOrDefault<CandidateViewModel>(DbQueryPortal.GetCandidate,
                    new {CandidateId = candidateId});

                var dataexperience = cnn.Query<CandidateExperienceViewModel>(DbQuery.GetCandidateExperience,
                    new {CandidateId = candidateId});

                candidate.Experiences = dataexperience.ToList();


                var dataeducation = cnn.Query<CandidateEducationViewModel>(DbQuery.GetCandidateEducation,
                    new {CandidateId = candidateId});

                candidate.Educations = dataeducation.ToList();


                var dataworkexperienceininsurance =
                    cnn.Query<CandidateWorkExperienceInInsuranceViewModel>(
                        DbQueryPortal.GetCandidateWorkExperienceInInsurance, new {CandidateId = candidateId});

                candidate.WorkExperiences = dataworkexperienceininsurance.ToList();


                var datareference = cnn.Query<CandidateReferenceViewModel>(DbQueryPortal.GetCandidateReference,
                    new {CandidateId = candidateId});

                candidate.References = datareference.ToList();


                var datarelationininsurance =
                    cnn.Query<CandidateRelationInInsuranceViewModel>(DbQueryPortal.GetCandidateRelationInInsurance,
                        new {CandidateId = candidateId});

                candidate.Relations = datarelationininsurance.ToList();
                //if (candidate.NPWPNo != null)
                if (candidate.NPWPNo != null && !string.IsNullOrEmpty(candidate.NPWPNo) && candidate.NPWPNo != "0"
                ) //mukti change 19 okt 18
                {
                    //var datas = cnn.QueryFirstOrDefault<string>("select concat(PTKPHeader,'_',PTKPDetail) from candidate where id = @id", new { id = candidate.ID });
                    var datas = cnn.QueryFirstOrDefault<string>(
                        "select CONCAT(a.PTKPHeader,'_',a.PTKPDetail,'_',b.MaritalStatus,' , ', b.Dependencies,' , ',PTKPStatus,' , ',PTKPPerMonth,' , ',PTKPPerYear) PtkpDetailValue from Candidate a left join PTKP b on a.ptkpdetail=b.id where a.id = @id",
                        new {id = candidate.ID});
                    if (!string.IsNullOrEmpty(datas))
                    {
                        var splited = datas.Split('_');
                        candidate.PTKPDetail = Convert.ToInt32(splited[1]);
                        candidate.PTKPHeader = splited[0];
                        candidate.PTKPDetailValue = splited[2];
                    }
                }

                //get list available level
                var profilinglevel = GetCandidateProfillingLevel(candidateId);
                var totalscore = profilinglevel.TotalScore;
                var availablelevel = GetCandidateAvailableLevel(totalscore, candidate.GroupLevel);
                candidate.AvailableLevels = availablelevel.ToList();

                var dataaaji = cnn
                    .Query<CandidateAajiExamViewModel>(DbQueryPortal.GetAajiExamCandidate,
                        new {CandidateId = candidateId}).FirstOrDefault();
                if (dataaaji != null)
                {
                    //if (dataaaji.ProductType == "U")
                    //{
                    //    dataaaji.ProductType = "Unit Link";
                    //}
                    //else if (dataaaji.ProductType == "US")
                    //{
                    //    dataaaji.ProductType = "Unit Link Syariah";
                    //}
                    //else if (dataaaji.ProductType == "S")
                    //{
                    //    dataaaji.ProductType = "Syariah";
                    //}
                }

                var sql = "select status from AajiStatus where agent_code = @id";
                candidate.AajiStatus = cnn.QueryFirstOrDefault<string>(sql, new {id = candidate.TemporaryAgentCode});

                candidate.AajiExam = dataaaji;

                var datadependency = cnn.Query<CandidateDependencyViewModel>(DbQueryPortal.GetCandidateDependencies,
                    new {CandidateId = candidateId});
                candidate.Dependencies = datadependency.ToList();
                var candidateroleid = 0;
                if (candidate.Level == "0")
                {
                    candidate.Level = candidate.RecommendedPosition;
                    candidateroleid = Convert.ToInt32(candidate.Level);
                    candidate.LevelName = cnn.QueryFirst<string>("select top 1 rolename from role where id=@Id",
                        new {Id = candidate.Level});
                }
                else
                {
                    candidateroleid = Convert.ToInt32(candidate.Level);
                    candidate.LevelName = cnn.QueryFirst<string>("select top 1 rolename from role where id=@Id",
                        new {Id = candidateroleid});
                }

                string loginname = cnn.QueryFirstOrDefault<string>(
                    "select LoginName from Account a join Candidate c on a.AgentCode = c.RecruiterAgentCode where c.Id = @CandidateId",
                    new {@CandidateId = candidateId});
                var datamanager = GetManager(loginname, candidateroleid);
                if (datamanager != null && datamanager.AgentCode != null)
                {
                    candidate.ManagerAgentCode = datamanager.AgentCode;
                    candidate.ManagerLocation = datamanager.AgentLocation;
                    candidate.ManagerPosition = datamanager.ManagerPosition;
                    candidate.ManagerName = datamanager.DisplayName;
                    if (candidate.LocationCode == null)
                    {
                        candidate.LocationCode = datamanager.AgentLocationCode;
                    }

                    candidate.isAd = false;
                }
                else
                {
                    candidate.isAd = true;
                }

                var data = cnn.QueryFirst<bool>(
                    "select top 1 (case when (DocumentCheckingFlag is null) then 0 else DocumentCheckingFlag end) from candidate where id = @id",
                    new {@id = candidateId});

                candidate.DocumentCheckingFlag = false;
            }

            return candidate;
        }

        public CandidateViewModel GetDataMobile(int candidateId)
        {
            var candidate = new CandidateViewModel();

            using (var cnn = OpenSunLifeDB())
            {
                candidate = cnn.QueryFirstOrDefault<CandidateViewModel>(DbQueryPortal.GetCandidateMobile,
                    new {CandidateId = candidateId});

                var dataexperience = cnn.Query<CandidateExperienceViewModel>(DbQuery.GetCandidateExperience,
                    new {CandidateId = candidateId});

                candidate.Experiences = dataexperience.ToList();


                var dataeducation = cnn.Query<CandidateEducationViewModel>(DbQuery.GetCandidateEducation,
                    new {CandidateId = candidateId});

                candidate.Educations = dataeducation.ToList();


                var dataworkexperienceininsurance =
                    cnn.Query<CandidateWorkExperienceInInsuranceViewModel>(
                        DbQueryPortal.GetCandidateWorkExperienceInInsurance, new {CandidateId = candidateId});

                candidate.WorkExperiences = dataworkexperienceininsurance.ToList();


                var datareference = cnn.Query<CandidateReferenceViewModel>(DbQueryPortal.GetCandidateReference,
                    new {CandidateId = candidateId});

                candidate.References = datareference.ToList();


                var datarelationininsurance =
                    cnn.Query<CandidateRelationInInsuranceViewModel>(DbQueryPortal.GetCandidateRelationInInsurance,
                        new {CandidateId = candidateId});

                candidate.Relations = datarelationininsurance.ToList();

                if (candidate.NPWPNo != null)
                {
                    var datas = cnn.QueryFirstOrDefault<string>(
                        "select concat(PTKPHeader,'_',PTKPDetail) from candidate where id = @id",
                        new {id = candidate.ID});
                    if (!string.IsNullOrEmpty(datas))
                    {
                        var splited = datas.Split('_');
                        candidate.PTKPDetail = Convert.ToInt32(splited[1]);
                        candidate.PTKPHeader = splited[0];
                    }
                }

                //get list available level
                var profilinglevel = GetCandidateProfillingLevel(candidateId);
                var totalscore = profilinglevel.TotalScore;
                var availablelevel = GetCandidateAvailableLevel(totalscore, candidate.GroupLevel);
                candidate.AvailableLevels = availablelevel.ToList();

                var dataaaji = cnn
                    .Query<CandidateAajiExamViewModel>(DbQueryPortal.GetAajiExamCandidate,
                        new {CandidateId = candidateId}).FirstOrDefault();
                candidate.AajiExam = dataaaji;
                if (candidate.AajiExam != null)
                {
                    candidate.AajiExam.ExamLocationId = string.IsNullOrEmpty(candidate.AajiExam.ExamLocationId)
                        ? ""
                        : candidate.AajiExam.ExamLocationId.ToString();
                }

                var datadependency = cnn.Query<CandidateDependencyViewModel>(DbQueryPortal.GetCandidateDependencies,
                    new {CandidateId = candidateId});
                candidate.Dependencies = datadependency.ToList();
                var candidateroleid = 0;
                if (candidate.Level == "0")
                {
                    candidate.Level = candidate.RecommendedPosition;
                    candidateroleid = Convert.ToInt32(candidate.Level);
                    if (candidate.Level != null)
                    {
                        candidate.LevelName = cnn.QueryFirst<string>("select top 1 rolename from role where id=@Id",
                            new {Id = candidate.Level});
                    }
                }
                else
                {
                    candidateroleid = Convert.ToInt32(candidate.Level);
                    candidate.LevelName = cnn.QueryFirst<string>("select top 1 rolename from role where id=@Id",
                        new {Id = candidateroleid});
                }

                string loginname = cnn.QueryFirstOrDefault<string>(
                    "select LoginName from Account a join Candidate c on a.AgentCode = c.RecruiterAgentCode where c.Id = @CandidateId",
                    new {@CandidateId = candidateId});
                var datamanager = GetManagerMobile(loginname, candidateroleid);
                if (datamanager.AgentCode != null)
                {
                    candidate.ManagerAgentCode = datamanager.AgentCode;
                    candidate.ManagerLocation = datamanager.AgentLocation;
                    candidate.ManagerPosition = datamanager.ManagerPosition;
                    candidate.ManagerName = datamanager.DisplayName;

                    if (candidate.LocationCode == null)
                    {
                        candidate.LocationCode = datamanager.AgentLocationCode;
                    }

                    candidate.isAd = false;
                }
                else
                {
                    candidate.isAd = true;
                }

                #region file pelengkap mobile

                var filePelengkap = GetDataPelengkap(candidateId);
                foreach (var item in filePelengkap)
                {
                    if (item.Type == "KTP")
                    {
                        candidate.photoKtpId = item.FileID;
                        candidate.photoKtpbase64 =
                            string.IsNullOrWhiteSpace(item.Base64) ? null : item.Base64; //item.Base64;
                    }
                    else if (item.Type == "FotoDiri")
                    {
                        candidate.photoDiriId = item.FileID;
                        candidate.photoDiribase64 =
                            string.IsNullOrWhiteSpace(item.Base64) ? null : item.Base64; //item.Base64;
                    }
                    else if (item.Type == "NPWP")
                    {
                        candidate.photoNpwpId = item.FileID;
                        candidate.photoNpwpbase64 =
                            string.IsNullOrWhiteSpace(item.Base64) ? null : item.Base64; //item.Base64;
                    }
                    //else if (item.Type == "KK")
                    //{
                    //    candidate.photoKkId = item.FileID;
                    //    candidate.photoKkbase64 = string.IsNullOrWhiteSpace(item.Base64) ? null : item.Base64; //item.Base64;
                    //}
                    else if (item.Type == "TABUNGAN")
                    {
                        candidate.photoBukuTabunganId = item.FileID;
                        candidate.photoBukuTabunganbase64 =
                            string.IsNullOrWhiteSpace(item.Base64) ? null : item.Base64; //item.Base64;
                    }
                    else if (item.Type == "TRANSFER")
                    {
                        candidate.photoBuktiTransferId = item.FileID;
                        candidate.photoBuktiTransferbase64 =
                            string.IsNullOrWhiteSpace(item.Base64) ? null : item.Base64; //item.Base64;
                    }
                }

                #endregion file pelengkap mobile
            }

            return candidate;
        }

        public IEnumerable<CandidateFileViewModel> GetDataPelengkap(int candidateId)
        {
            using (var cnn = OpenSunLifeDB())
            {
                //var data = cnn.Query<CandidateFileViewModel>(DbQuery.GetFilePelengkap, new { CandidateID = candidateId });
                var data = cnn.Query<CandidateFileViewModel>(DbQuery.GetFilePelengkap, new {CandidateID = candidateId});
                foreach (var item in data)
                {
                    if (item.Type.ToLower() != "aml" && item.Type.ToLower() != "atf" && item.Type.ToLower() != "google")
                    {
                        try
                        {
                            item.Base64 = System.IO.File.ReadAllText(item.Path);
                            throw new Exception("error happen but looping still running");
                        }
                        catch (Exception ec)
                        {
                            //return Json(data);
                        }
                    }
                }

                return data;
            }
        }

        public int UploadFile(FileUploadViewModel fileUpload)
        {
            var returnId = 0;
            using (var cnn = OpenSunLifeDB())
            {
                returnId = cnn.Query<int>(DbQuery.AddFileDataPelengkap, new
                {
                    FileName = fileUpload.FileName,
                    Path = fileUpload.Path,
                    CreatedWho = HttpContext.Current.User.Identity.Name,
                    CreatedWhen = DateTime.Now,
                    ChangedWho = HttpContext.Current.User.Identity.Name,
                    ChangedWhen = DateTime.Now
                }).Single();
            }

            return returnId;
        }

        public CandidateLevelViewModel GetCandidateProfillingLevel(int candidateId)
        {
            using (var cnn = OpenSunLifeDB())
            {
                var data = cnn.QuerySingle<CandidateLevelViewModel>(DbQuery.GetCandidateProfillingLevel,
                    new {CandidateID = candidateId});
                return data;
            }
        }

        public int CekHierarki(string RecruiterAgentCode)
        {
            using (var cnn = OpenSunLifeDB())
            {
                var cekHierarki =
                    cnn.Query<int>("SELECT COUNT(*) FROM ApprovalHierarki WHERE AgentCode = @RecruiterAgentCode",
                        new {RecruiterAgentCode = RecruiterAgentCode}).FirstOrDefault();
                return cekHierarki;
            }
        }

        public void SetStatusCandidateToDraft(int candidateId)
        {
            using (var cnn = OpenSunLifeDB())
            {
                cnn.Execute(DbQuery.SetStatusCandidateToDraft, new
                {
                    CandidateId = candidateId
                });
            }
        }

        public void SetStatusCandidateToReject(int candidateId)
        {
            using (var cnn = OpenSunLifeDB())
            {
                cnn.Execute(DbQuery.SetStatusCandidateToReject, new
                {
                    CandidateId = candidateId
                });
            }
        }

        public void SetAllLeaderApproveFlagToFalse(int candidateId)
        {
            using (var cnn = OpenSunLifeDB())
            {
                cnn.Execute(DbQuery.SetAllLeaderApproveFlagToFalse, new
                {
                    CandidateId = candidateId
                });
            }
        }

        public string RescheduleAaji(CandidateAajiExamViewModel data)
        {
            var msg = "";
            var sql = "";
            int maksDate = 5;
            using (var cnn = OpenSunLifeDB())
            {
                sql = "select concat(AajiExamId,',',Status) from AajiExamDetail where CandidateId = @id";
                var aajiExamDetail = cnn.QueryFirstOrDefault<string>(sql, new {id = data.CandidateId});

                if (aajiExamDetail == null)
                {
                    data.IsReschedule = false;
                }

                var aaji = aajiExamDetail.Split(',');
                if (!string.IsNullOrEmpty(aajiExamDetail) && aaji[1].ToLower() == "reject")
                {
                    sql = "select * from ExamLocation where id = @id";
                    var examLocation =
                        cnn.QueryFirstOrDefault<ExamLocationViewModel>(sql, new {id = data.ExamLocationId});
                    if (examLocation != null && examLocation.ExamType.ToLower() == "online")
                    {
                        maksDate = 5;
                    }
                    else if (examLocation != null && examLocation.ExamType.ToLower() == "paper")
                    {
                        maksDate = 10;
                    }

                    sql = "select * from aajiexam where id = @id";
                   // var aajiexam = cnn.QueryFirstOrDefault<AajiExamViewModel>(sql, new {id = aaji[0]});

                    if (data.AajiExamDate != DateTime.MinValue)
                    {
                        int aajiId = 0;
                        //check is date with location and type is exist in db
                        sql =
                            "select Id from AajiExam where convert(varchar(12),ExamDate,103) = @ExamDate and ExamLocationId = @ExamLocationId and ExamType = @ExamType";
                        var isDateIsExist = cnn.QueryFirstOrDefault<AajiViewModel>(sql,
                            new
                            {
                                ExamLocationId = data.ExamLocationId,
                                ExamType = data.ExamType,
                                ExamDate = data.AajiExamDate.ToShortDateString()
                            });
                        var GenerateCode = new GenerateCode();
                        string AajiExam = GenerateCode.AajiExam();

                        if (isDateIsExist == null)
                        {
                            sql =
                                "insert into AajiExam output inserted.ID values (@aajiexam,@examdate,0,@examlocationid,@note,@isactive,@isdelete,@createdwhen,@createdby,@changewhen,@changedby,@examtype)";
                            if (AajiExam != null)
                            {
                                aajiId = cnn.QueryFirstOrDefault<int>(sql,
                                    new
                                    {
                                        aajiexam = AajiExam,
                                        examdate = data.AajiExamDate,
                                        examlocationid = data.ExamLocationId,
                                        @note = "-",
                                        @isactive = 1,
                                        @isdelete = 0,
                                        @changewhen = DateTime.Now,
                                        @createdwhen = DateTime.Now,
                                        @changedby = "admin",
                                        @createdby = "admin",
                                        @examtype = data.ExamType
                                    });
                                cnn.Execute("delete from AajiExamDetail where CandidateId = @id",
                                    new {id = data.CandidateId});
                                sql = "insert aajiexamdetail values (@cId, @aajiId, @status, @reason, @producttype)";
                                string status = (data.IsReschedule ? "RESCHEDULE" : "SUBMIT");
                                cnn.Execute(sql,
                                    new
                                    {
                                        cId = data.CandidateId,
                                        aajiId = aajiId,
                                        status = status,
                                        reason = "",
                                        producttype = data.ProductType
                                    });
                            }
                        }
                        else
                        {
                            cnn.Execute("delete from AajiExamDetail where CandidateId = @id",
                                new {id = data.CandidateId});
                            sql = "insert aajiexamdetail values (@cId, @aajiId, @status, @reason, @producttype)";
                            string status = (data.IsReschedule ? "RESCHEDULE" : "SUBMIT");
                            cnn.Execute(sql,
                                new
                                {
                                    cId = data.CandidateId,
                                    aajiId = isDateIsExist.Id,
                                    status = status,
                                    reason = "",
                                    producttype = data.ProductType
                                });
                        }

                        msg = "Berhasil memilih jadwal AAJI Baru";
                    }
                }
                else if (aaji[1].ToLower() == "submit")
                {
                    msg = "Jadwal Aaji Anda Masih Menunggu Persetujuan Admin";
                }
            }

            return msg;
        }

        public string RescheduleAajiMobile(CandidateAajiExamViewModel data)
        {
            var msg = "";
            var sql = "";
            int maksDate = 5;
            using (var cnn = OpenSunLifeDB())
            {
                sql = "select concat(AajiExamId,',',Status) from AajiExamDetail where CandidateId = @id";
                var aajiExamDetail = cnn.QueryFirstOrDefault<string>(sql, new {id = data.CandidateId});

                if (aajiExamDetail == null)
                {
                    data.IsReschedule = false;
                }

                var aaji = aajiExamDetail.Split(',');
                if (!string.IsNullOrEmpty(aajiExamDetail) && aaji[1].ToLower() == "reject")
                {
                    sql = "select * from ExamLocation where id = @id";
                    var examLocation =
                        cnn.QueryFirstOrDefault<ExamLocationViewModel>(sql, new {id = data.ExamLocationId});
                    if (examLocation != null && examLocation.ExamType.ToLower() == "online")
                    {
                        maksDate = 5;
                    }
                    else if (examLocation != null && examLocation.ExamType.ToLower() == "paper")
                    {
                        maksDate = 10;
                    }

                    sql = "select * from aajiexam where id = @id";
                    //var aajiexam = cnn.QueryFirstOrDefault<AajiExamViewModel>(sql, new {id = aaji[0]});

                    if (data.AajiExamDate != DateTime.MinValue)
                    {
                        int aajiId = 0;
                        //check is date with location and type is exist in db
                        sql =
                            "select Id from AajiExam where convert(varchar(12),ExamDate,103) = @ExamDate and ExamLocationId = @ExamLocationId and ExamType = @ExamType";
                        var isDateIsExist = cnn.QueryFirstOrDefault<AajiViewModel>(sql,
                            new
                            {
                                ExamLocationId = data.ExamLocationId,
                                ExamType = data.ExamType,
                                ExamDate = data.AajiExamDate.ToShortDateString()
                            });
                        var GenerateCode = new GenerateCode();
                        string AajiExam = GenerateCode.AajiExam();

                        if (isDateIsExist == null)
                        {
                            sql =
                                "insert into AajiExam output inserted.ID values (@aajiexam,@examdate,0,@examlocationid,@note,@isactive,@isdelete,@createdwhen,@createdby,@changewhen,@changedby,@examtype)";
                            if (AajiExam != null)
                            {
                                aajiId = cnn.QueryFirstOrDefault<int>(sql,
                                    new
                                    {
                                        aajiexam = AajiExam,
                                        examdate = data.AajiExamDate,
                                        examlocationid = data.ExamLocationId,
                                        @note = "-",
                                        @isactive = 1,
                                        @isdelete = 0,
                                        @changewhen = DateTime.Now,
                                        @createdwhen = DateTime.Now,
                                        @changedby = "admin",
                                        @createdby = "admin",
                                        @examtype = data.ExamType
                                    });
                                cnn.Execute("delete from AajiExamDetail where CandidateId = @id",
                                    new {id = data.CandidateId});
                                sql = "insert aajiexamdetail values (@cId, @aajiId, @status, @reason, @producttype)";
                                string status = (data.IsReschedule ? "RESCHEDULE" : "SUBMIT");
                                cnn.Execute(sql,
                                    new
                                    {
                                        cId = data.CandidateId,
                                        aajiId = aajiId,
                                        status = status,
                                        reason = "",
                                        producttype = data.ProductType
                                    });
                            }
                        }
                        else
                        {
                            cnn.Execute("delete from AajiExamDetail where CandidateId = @id",
                                new {id = data.CandidateId});
                            sql = "insert aajiexamdetail values (@cId, @aajiId, @status, @reason, @producttype)";
                            string status = (data.IsReschedule ? "RESCHEDULE" : "SUBMIT");
                            cnn.Execute(sql,
                                new
                                {
                                    cId = data.CandidateId,
                                    aajiId = isDateIsExist.Id,
                                    status = status,
                                    reason = "",
                                    producttype = data.ProductType
                                });
                        }

                        msg = "Berhasil memilih jadwal AAJI Baru";
                    }
                }
                else if (aaji[1].ToLower() == "submit")
                {
                    msg = "Jadwal Aaji Anda Masih Menunggu Persetujuan Admin";
                }
            }

            return msg;
        }

        //public string RescheduleAaji(CandidateAajiExamViewModel data)
        //{
        //    var msg = "";
        //    using (var cnn = OpenSunLifeDB())
        //    {
        //        //cek tanggal jika kurang dari maksinal ganti tanggal maka di lanjutkan
        //        DateTime aajiExamDate = cnn.QueryFirst<DateTime>("select top 1 examdate from aajiexam where Id = @ID", new { ID = data.AajiExamId });
        //        int MaxChangeDate = cnn.QueryFirst<int>("exec GetMaxChangeDate @Id", new { Id = data.AajiExamId });
        //        DateTime MaxDate = aajiExamDate.AddDays(-MaxChangeDate);

        //        if (DateTime.Now.Day > MaxDate.Day)
        //        {
        //            msg = "Jadwal tidak bisa di pilih, jadwal tidak boleh kurang dari H-" + MaxChangeDate;
        //        }
        //        else
        //        {
        //            var sql = "select * from aajiexamdetail where candidateid= @id";
        //            var isAajiExist = cnn.Query(sql, new { id = data.CandidateId });
        //            var queryaaji = "";

        //            if (isAajiExist.ToList().Count == 0 || isAajiExist == null)
        //            {
        //                string reason = null;
        //                queryaaji = "insert into aajiexamdetail values (@id,@examId,@status,@reason,@producttype)";
        //                cnn.Execute(queryaaji, new { id = data.CandidateId, examId = data.AajiExamId, status = "SUBMIT", reason = reason, producttype = data.ProductType });
        //                msg = "Jadwal AAJI berhasil dipilih";
        //            }
        //            else
        //            {
        //                //var oldaajiid = cnn.QueryFirstOrDefault<int>("select AAjiExamId from aajiexamdetail where candidateid='" + data.CandidateId + "'");
        //                var oldaajiid = cnn.QueryFirstOrDefault<int>("select AAjiExamId from aajiexamdetail where candidateid=@id", new { id = data.CandidateId });
        //                if (oldaajiid == data.AajiExamId)
        //                {
        //                    msg = "Jadwal AAJI yang anda pilih sama dengan jadwal sebelumnya";
        //                }
        //                else
        //                {
        //                    //queryaaji = "update aajiexamdetail set AajiExamId='" + data.AajiExamId + "',Status='SUBMIT' where CandidateId='" + data.CandidateId + "'";
        //                    queryaaji = "update aajiexamdetail set AajiExamId= @examId,Status=@status, ProductType = @prd where CandidateId= @id";
        //                    cnn.Execute(queryaaji, new { examId = data.AajiExamId, status = "SUBMIT", id = data.CandidateId, prd = data.ProductType });
        //                    msg = "Jadwal AAJI berhasil di ganti";
        //                }
        //            }
        //        }
        //        return msg;
        //    }
        //}

        //public string RescheduleAajiMobile(CandidateAajiExamViewModel data)
        //{
        //    var msg = "";
        //    using (var cnn = OpenSunLifeDB())
        //    {
        //        //cek tanggal jika kurang dari maksinal ganti tanggal maka di lanjutkan
        //        DateTime aajiExamDate = cnn.QueryFirst<DateTime>("select top 1 examdate from aajiexam where Id = @ID", new { ID = data.AajiExamId });
        //        int MaxChangeDate = cnn.QueryFirst<int>("exec GetMaxChangeDate @Id", new { Id = data.AajiExamId });
        //        DateTime MaxDate = aajiExamDate.AddDays(-MaxChangeDate);

        //        if (DateTime.Now.Day > MaxDate.Day)
        //        {
        //            msg = "Jadwal tidak bisa di pilih, jadwal tidak boleh kurang dari H-" + MaxChangeDate;
        //        }
        //        else
        //        {
        //            var isAajiExist = cnn.Query("select * from aajiexamdetail where candidateid=@id", new { id = data.CandidateId });
        //            var queryaaji = "";

        //            if (isAajiExist.ToList().Count == 0 || isAajiExist == null)
        //            {
        //                string reason = null;
        //                //queryaaji = "insert into aajiexamdetail values ('" + data.CandidateId + "','" + data.AajiExamId + "','SUBMIT',NULL);";
        //                queryaaji = "insert into aajiexamdetail values (@id,@examId,@status,@reason";
        //                cnn.Execute(queryaaji, new { id = data.CandidateId, examId = data.AajiExamId, status = "SUBMIT", reason = reason });
        //                msg = "Jadwal AAJI berhasil dipilih";
        //            }
        //            else
        //            {
        //                var oldaajiid = cnn.QueryFirstOrDefault<int>("select AAjiExamId from aajiexamdetail where candidateid= @id", new { id = data.CandidateId });
        //                if (oldaajiid == data.AajiExamId)
        //                {
        //                    msg = "Jadwal AAJI yang anda pilih sama dengan jadwal sebelumnya";
        //                }
        //                else
        //                {
        //                    //queryaaji = "update aajiexamdetail set AajiExamId='" + data.AajiExamId + "',Status='SUBMIT' where CandidateId='" + data.CandidateId + "'";
        //                    queryaaji = "update aajiexamdetail set AajiExamId=@examId,Status=@status where CandidateId = @id";
        //                    cnn.Execute(queryaaji, new { examId = data.AajiExamId, status = "SUBMIT", id = data.CandidateId });
        //                    msg = "Jadwal AAJI berhasil di ganti";
        //                }
        //            }
        //        }
        //        return msg;
        //    }
        //}

        public CandidateManagerVewModel GetManager(string recruiterloginname, int candidateroleid)
        {
            var datamanager = new CandidateManagerVewModel();
            using (var cnn = OpenSunLifeDB())
            {
                //ambil posisi tertinggi
                var latesthierarkilevel = cnn.QueryFirstOrDefault<int>(
                    "select value from GlobalConfiguration where Keyword=@keyword",
                    new {keyword = "HighestHierarkiLevel"});
                //ambil level jabatan yang di pilih si kandidat
                var candidatehierarkilevel = cnn.QueryFirstOrDefault<int>(
                    "select top 1 HierarkiLevel from RoleHierarki where RoleId = @id", new {id = candidateroleid});
                //jika si kandidat memilih jabatan terakhir maka tidak akan ada direct manaager
                if (candidatehierarkilevel < latesthierarkilevel)
                {
                    //lama ambil hanya + 1 saja tidak mencari ke atas lagi
                    //var data = cnn.QueryFirstOrDefault<CandidateManagerVewModel>(DbQueryPortal.GetManager, new { RecruiterLoginName = recruiterloginname, CandidateRoleId = candidateroleid });

                    //var recruiterhierarkilevel = cnn.QueryFirstOrDefault<int>("select top 1 HierarkiLevel from RoleHierarki rh join Account a on a.RoleID = rh.RoleId where a.AgentCode = '" + recruiterloginname + "'");
                    var recruiterhierarkilevel = cnn.QueryFirstOrDefault<int>(
                        "select top 1 HierarkiLevel from RoleHierarki rh join Account a on a.RoleID = rh.RoleId where a.AgentCode = @agentCode",
                        new {agentCode = recruiterloginname});

                    if (recruiterhierarkilevel > candidatehierarkilevel)
                    {
                        //direct manager = perekrut
                        datamanager = cnn.QueryFirstOrDefault<CandidateManagerVewModel>(
                            @"select top 1 A.AgentCode,DisplayName, r.RoleName as ManagerPosition,L.AgentLocation, L.AgentLocationCode
                            from Account A
                            left join Role R on A.RoleID = r.ID
                            left join Location L on L.AgentLocationCode = A.LocationCode
                            where A.AgentCode = @agentCode and A.IsDeleted != @isdelete",
                            new {agentCode = recruiterloginname, isdelete = 1});
                    }
                    else
                    {
                        //get all manager from recruiter
                        var temp = cnn.Query<CandidateManagerVewModel>(
                            @"select ApproverCode as AgentCode , HierarkiLevel as ManagerHierarki, a.DisplayName,r.RoleName as ManagerPosition, l.AgentLocation, L.AgentLocationCode
                            from ApprovalHierarki ah
                            left join Account a on a.AgentCode = ah.ApproverCode
                            left join RoleHierarki rh on rh.RoleId = ah.levelid
                            left join Role r on r.id = a.RoleID
                            left join Location l on l.AgentLocationCode = a.LocationCode
                            where ah.AgentCode = @agentCode order by HierarkiLevel desc",
                            new {agentCode = recruiterloginname});
                        //get list level manager
                        var tempListLevelManager = new List<int>();
                        foreach (var item in temp)
                        {
                            tempListLevelManager.Add(item.ManagerHierarki);
                        }

                        //sortir list level manager berdasarkan terkecil
                        tempListLevelManager.Sort();
                        bool done = false;
                        int index = 0;
                        //loop bandingkan jika level manager lebih besar di bandingkan level yang di pilih si kandidat maka si manager itu yang 
                        //akan menjadi direct managernya
                        while (!done)
                        {
                            //ADDED tempListLevelManager.Count() > 0 PREVENT OUT OF RANGE
                            if (tempListLevelManager.Count() == 0)
                            {
                                break;
                            }
                            else
                            {
                                if (candidatehierarkilevel == 4) //utk ad
                                {
                                    done = true;
                                    var lastIndex = tempListLevelManager.Count - 1;
                                    datamanager = temp.Where(x =>
                                        x.ManagerHierarki.Equals(tempListLevelManager[lastIndex])).First();
                                }
                                else
                                {
                                    if (tempListLevelManager[index] > candidatehierarkilevel)
                                    {
                                        done = true;
                                        datamanager = temp.Where(x =>
                                            x.ManagerHierarki.Equals(tempListLevelManager[index])).First();
                                    }
                                }

                                index++;
                            }

                            //if (tempListLevelManager.Count() > 0 && tempListLevelManager[index] > candidatehierarkilevel)
                            //{
                            //    done = true;
                            //    datamanager = temp.Where(x => x.ManagerHierarki.Equals(tempListLevelManager[index])).First();
                            //}
                            //index++;
                        }
                    }
                }

                return datamanager;
            }
        }

        public CandidateManagerVewModel GetManagerMobile(string recruiterloginname, int candidateroleid)
        {
            var datamanager = new CandidateManagerVewModel();
            using (var cnn = OpenSunLifeDB())
            {
                //ambil posisi tertinggi
                var latesthierarkilevel = cnn.QueryFirstOrDefault<int>(
                    "select value from GlobalConfiguration where Keyword=@keyword",
                    new {keyword = "HighestHierarkiLevel"});
                //ambil level jabatan yang di pilih si kandidat
                var candidatehierarkilevel = cnn.QueryFirstOrDefault<int>(
                    "select top 1 HierarkiLevel from RoleHierarki where RoleId = @id", new {id = candidateroleid});
                //jika si kandidat memilih jabatan terakhir maka tidak akan ada direct manaager
                if (candidatehierarkilevel < latesthierarkilevel)
                {
                    //lama ambil hanya + 1 saja tidak mencari ke atas lagi
                    //var data = cnn.QueryFirstOrDefault<CandidateManagerVewModel>(DbQueryPortal.GetManager, new { RecruiterLoginName = recruiterloginname, CandidateRoleId = candidateroleid });

                    var recruiterhierarkilevel = cnn.QueryFirstOrDefault<int>(
                        "select top 1 HierarkiLevel from RoleHierarki rh join Account a on a.RoleID = rh.RoleId where a.AgentCode = @agentCode",
                        new {agentCode = recruiterloginname});

                    if (recruiterhierarkilevel > candidatehierarkilevel)
                    {
                        //direct manager = perekrut
                        datamanager = cnn.QueryFirstOrDefault<CandidateManagerVewModel>(
                            @"select top 1 A.AgentCode,DisplayName, r.RoleName as ManagerPosition,L.AgentLocation,L.AgentLocationCode
                            from Account A
                            left join Role R on A.RoleID = r.ID
                            left join Location L on L.AgentLocationCode = A.LocationCode
                            where A.AgentCode = @agentCode and A.IsDeleted != @isdelete",
                            new {agentCode = recruiterloginname, isdelete = 1});
                        return datamanager;
                    }
                    else
                    {
                        //get all manager from recruiter
                        var temp = cnn.Query<CandidateManagerVewModel>(
                            @"select ApproverCode as AgentCode , HierarkiLevel as ManagerHierarki, a.DisplayName,r.RoleName as ManagerPosition, l.AgentLocation,l.AgentLocationCode
                            from ApprovalHierarki ah
                            left join Account a on a.AgentCode = ah.ApproverCode
                            left join RoleHierarki rh on rh.RoleId = ah.levelid
                            left join Role r on r.id = a.RoleID
                            left join Location l on l.AgentLocationCode = a.LocationCode
                            where ah.AgentCode = @agentCode order by HierarkiLevel desc",
                            new {agentCode = recruiterloginname});
                        //get list level manager
                        var tempListLevelManager = new List<int>();
                        foreach (var item in temp)
                        {
                            tempListLevelManager.Add(item.ManagerHierarki);
                        }

                        //sortir list level manager berdasarkan terkecil
                        tempListLevelManager.Sort();
                        bool done = false;
                        int index = 0;
                        //loop bandingkan jika level manager lebih besar di bandingkan level yang di pilih si kandidat maka si manager itu yang 
                        //akan menjadi direct managernya
                        while (!done)
                        {
                            //ADDED tempListLevelManager.Count() > 0 PREVENT OUT OF RANGE
                            if (tempListLevelManager.Count() == 0)
                            {
                                break;
                            }
                            else
                            {
                                if (candidatehierarkilevel == 4) //utk ad
                                {
                                    done = true;
                                    var lastIndex = tempListLevelManager.Count - 1;
                                    datamanager = temp.Where(x =>
                                        x.ManagerHierarki.Equals(tempListLevelManager[lastIndex])).First();
                                }
                                else
                                {
                                    if (tempListLevelManager[index] > candidatehierarkilevel)
                                    {
                                        done = true;
                                        datamanager = temp.Where(x =>
                                            x.ManagerHierarki.Equals(tempListLevelManager[index])).First();
                                    }
                                }

                                index++;
                            }

                            //if (tempListLevelManager[index] > candidatehierarkilevel)
                            //{
                            //    done = true;
                            //    datamanager = temp.Where(x => x.ManagerHierarki.Equals(tempListLevelManager[index])).First();
                            //}
                            //index++;
                        }
                    }
                }

                return datamanager;
            }
        }

        public IEnumerable<PTKPViewModel> GetPTKP()
        {
            using (var cnn = OpenSunLifeDB())
            {
                var data = cnn.Query<PTKPViewModel>(DbQueryPortal.GetPTKP);
                return data;
            }
        }

        public IEnumerable<PTKPViewModel> GetPTKPMobile()
        {
            using (var cnn = OpenSunLifeDB())
            {
                var data = cnn.Query<PTKPViewModel>(DbQueryPortal.GetPTKPMobile);
                return data;
            }
        }

        public void CreateTxtBase64ImageMobile(FileUploadMobileViewModel fileUpload)
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

        public PDFCandidateViewModel GetDataPDF(string candidateId)
        {
            var dataPdf = new PDFCandidateViewModel();
            var candidate = new CandidateViewModel();
            var dataPribadiPdf = new PDFCandidateDataPribadiViewModel();
            var dataPribadi = new CandidateDataPribadiViewModel();
            var ptkpdata = new List<PTKPViewModel>();
            DateTime interviewdate;
            decimal totalprofilingpoint = 0;
            var QuestionList = new List<ProfilingQuetionViewModel>();

            using (var cnn = OpenSunLifeDB())
            {
                dataPribadi = cnn.QueryFirstOrDefault<CandidateDataPribadiViewModel>(DbQuery.GetCandidateDataPribadi,
                    new {LoginName = candidateId});

                candidate = cnn.QueryFirstOrDefault<CandidateViewModel>(DbQueryPortal.GetCandidate,
                    new {CandidateId = candidateId});

                var dataexperience = cnn.Query<CandidateExperienceViewModel>(DbQuery.GetCandidateExperience,
                    new {CandidateId = candidateId});

                candidate.Experiences = dataexperience.ToList();


                var dataeducation = cnn.Query<CandidateEducationViewModel>(DbQuery.GetCandidateEducation,
                    new {CandidateId = candidateId});

                candidate.Educations = dataeducation.ToList().OrderByDescending(x => x.YearTo).Take(1).ToList();


                var dataworkexperienceininsurance =
                    cnn.Query<CandidateWorkExperienceInInsuranceViewModel>(
                        DbQueryPortal.GetCandidateWorkExperienceInInsurance, new {CandidateId = candidateId});

                candidate.WorkExperiences = dataworkexperienceininsurance.ToList();


                var datareference = cnn.Query<CandidateReferenceViewModel>(DbQueryPortal.GetCandidateReference,
                    new {CandidateId = candidateId});

                candidate.References = datareference.ToList();


                var datarelationininsurance =
                    cnn.Query<CandidateRelationInInsuranceViewModel>(DbQueryPortal.GetCandidateRelationInInsurance,
                        new {CandidateId = candidateId});

                candidate.Relations = datarelationininsurance.ToList();


                //get list available level
                /*var profilinglevel = GetCandidateProfillingLevel(candidateId);
                var totalscore = profilinglevel.TotalScore;
                var availablelevel = GetCandidateAvailableLevel(totalscore, candidate.GroupLevel);
                candidate.AvailableLevels = availablelevel.ToList();*/

                var dataaaji = cnn
                    .Query<CandidateAajiExamViewModel>(DbQueryPortal.GetAajiExamCandidate,
                        new {CandidateId = candidateId}).FirstOrDefault();
                candidate.AajiExam = dataaaji;

                var datadependency = cnn.Query<CandidateDependencyViewModel>(DbQueryPortal.GetCandidateDependencies,
                    new {CandidateId = candidateId});
                candidate.Dependencies = datadependency.ToList();
                var candidateroleid = 0;
                if (candidate.Level == "0")
                {
                    candidate.Level = candidate.RecommendedPosition;
                    candidateroleid = Convert.ToInt32(candidate.Level);
                }
                else
                {
                    candidateroleid = Convert.ToInt32(candidate.Level);
                }

                string loginname = cnn.QueryFirstOrDefault<string>(
                    "select a.LoginName from Account a join Candidate c on a.AgentCode = c.RecruiterAgentCode where c.Id = @CandidateId",
                    new {@CandidateId = candidateId});
                var datamanager = GetManager(loginname, candidateroleid);
                if (datamanager != null)
                {
                    candidate.ManagerAgentCode = datamanager.AgentCode;
                    candidate.ManagerLocation = datamanager.AgentLocation;
                    candidate.ManagerPosition = datamanager.ManagerPosition;
                    candidate.ManagerName = datamanager.DisplayName;

                    if (candidate.LocationCode == null)
                    {
                        candidate.LocationCode = datamanager.AgentLocationCode;
                    }

                    candidate.isAd = false;
                }
                else
                {
                    candidate.isAd = true;
                }

                var headerId = 0;
                var QuestionIdList = new List<int>();
                headerId = cnn.QueryFirst<int>(
                    "select id from CandidateProfilingHeader where CandidateID=@CandidateId and RecommendedPosition!= @RecommendedPosition and IsComplete = @IsComplete",
                    new {CandidateId = candidateId, IsComplete = 1, RecommendedPosition = 0});
                interviewdate = cnn.QueryFirstOrDefault<DateTime>(
                    "select CreateDate from CandidateProfilingHeader where CandidateID=@CandidateId and RecommendedPosition!= @RecommendedPosition and IsComplete = @IsComplete",
                    new {CandidateId = candidateId, IsComplete = 1, RecommendedPosition = 0});

                QuestionIdList =
                    cnn.Query<int>("select QuestionID from CandidateProfilingAnswer where HeaderID= @HeaderId",
                        new {HeaderId = headerId}).ToList();
                //loop get question berdasarkan question list id
                foreach (var item in QuestionIdList)
                {
                    var temp = new ProfilingQuetionViewModel();
                    temp.Option = new List<ProfilingOptionViewModel>();
                    temp = cnn.QueryFirst<ProfilingQuetionViewModel>(
                        "select * from ProfilingQuestion where id = @Id and isDelete != @isDelete and IsActive = @IsActive",
                        new {Id = item, IsActive = 1, isDelete = 1});
                    temp.Option =
                        cnn.Query<ProfilingOptionViewModel>(
                            "select * from ProfilingOption where QuestionID=@Id and IsActive = @IsActive",
                            new {Id = temp.ID, IsActive = 1}).ToList();
                    temp.Answer =
                        cnn.QueryFirst<int>(
                            "select top 1 answer from CandidateProfilingAnswer where HeaderID=@HeaderId and QuestionID=@QuestionId",
                            new {HeaderId = headerId, QuestionId = temp.ID});
                    foreach (var item2 in temp.Option)
                    {
                        if (item2.ID == temp.Answer)
                        {
                            temp.Point = item2.Point;
                            totalprofilingpoint += temp.Point;
                            break;
                        }
                    }

                    QuestionList.Add(temp);
                }

                #region file pelengkap mobile

                //var filePelengkap = GetDataPelengkap(candidateId);
                /*foreach (var item in filePelengkap)
                {
                    if (item.Type == "KTP")
                    {
                        candidate.photoKtpId = item.FileID;
                        candidate.photoKtpbase64 = item.Base64;
                    }
                    else if (item.Type == "FotoDiri")
                    {
                        candidate.photoDiriId = item.FileID;
                        candidate.photoDiribase64 = item.Base64;
                    }
                    else if (item.Type == "NPWP")
                    {
                        candidate.photoNpwpId = item.FileID;
                        candidate.photoNpwpbase64 = item.Base64;
                    }
                    else if (item.Type == "KK")
                    {
                        candidate.photoKkId = item.FileID;
                        candidate.photoKkbase64 = item.Base64;
                    }
                    else if (item.Type == "TABUNGAN")
                    {
                        candidate.photoBukuTabunganId = item.FileID;
                        candidate.photoBukuTabunganbase64 = item.Base64;
                    }
                    else if (item.Type == "TRANSFER")
                    {
                        candidate.photoBuktiTransferId = item.FileID;
                        candidate.photoBuktiTransferbase64 = item.Base64;
                    }
                }*/

                #endregion file pelengkap mobile


                ptkpdata = cnn
                    .Query<PTKPViewModel>(
                        "select id,gender,maritalstatus,dependencies,ptkpstatus, ptkppermonth, ptkpperyear from ptkp")
                    .ToList();

                if (candidate.NPWPNo != null && !string.IsNullOrEmpty(candidate.NPWPNo) && candidate.NPWPNo != "0"
                ) //mukti change 19 okt 18
                {
                    //var datas = cnn.QueryFirstOrDefault<string>("select concat(PTKPHeader,'_',PTKPDetail) from candidate where id = @id", new { id = candidate.ID });
                    var datas = cnn.QueryFirstOrDefault<string>(
                        "select CONCAT(a.PTKPHeader,'_',a.PTKPDetail,'_',b.MaritalStatus,' , ', b.Dependencies,' , ',PTKPStatus,' , ',PTKPPerMonth,' , ',PTKPPerYear) PtkpDetailValue from Candidate a left join PTKP b on a.ptkpdetail=b.id where a.id = @id",
                        new {id = candidate.ID});
                    if (!string.IsNullOrEmpty(datas))
                    {
                        var splited = datas.Split('_');
                        candidate.PTKPDetail = Convert.ToInt32(splited[1]);
                        candidate.PTKPHeader = splited[0];
                        candidate.PTKPDetailValue = splited[2];
                    }
                }
            }

            dataPdf.CandidateData = candidate;
            dataPribadiPdf.CandidateDataPribadi = dataPribadi;
            dataPdf.ProfilingQuestion = QuestionList;
            dataPdf.PTKPData = ptkpdata;
            dataPdf.InterviewDate = interviewdate;
            dataPdf.TotalProfilingPoint = totalprofilingpoint;

            //get candidate lokasi baru si ad
            var AgentDirectorLocation = new LocationViewModel();

            if (dataPdf.CandidateData.LevelName == "AD")
            {
                using (var cnn = OpenSunLifeDB())
                {
                    AgentDirectorLocation = cnn.QueryFirstOrDefault<LocationViewModel>(
                        "select ID,AgentLocationCode,AgentLocation,BranchAdmin,IsActive,IsDelete,CreatedWhen,CreatedBy,ChangedWhen,IsApproved,Type,PhoneNumber,Email, KPMOwnerName, NameBranch from Location where AgentLocationCode = @AgentLocation",
                        new {AgentLocation = dataPdf.CandidateData.LocationCode});
                }
            }

            //ini lokasi baru yg di get si ad
            dataPdf.AgencyDirectorLocation = AgentDirectorLocation;
            return dataPdf;
        }

        public PDFCandidateViewModel GetDataPDFMobile(int candidateId)
        {
            var dataPdf = new PDFCandidateViewModel();
            var candidate = new CandidateViewModel();
            var ptkpdata = new List<PTKPViewModel>();
            DateTime interviewdate;
            decimal totalprofilingpoint = 0;
            var QuestionList = new List<ProfilingQuetionViewModel>();

            using (var cnn = OpenSunLifeDB())
            {
                candidate = cnn.QueryFirstOrDefault<CandidateViewModel>(DbQueryPortal.GetCandidate,
                    new {CandidateId = candidateId});

                var dataexperience = cnn.Query<CandidateExperienceViewModel>(DbQuery.GetCandidateExperience,
                    new {CandidateId = candidateId});

                candidate.Experiences = dataexperience.ToList();


                var dataeducation = cnn.Query<CandidateEducationViewModel>(DbQuery.GetCandidateEducation,
                    new {CandidateId = candidateId});

                candidate.Educations = dataeducation.ToList().OrderByDescending(x => x.YearTo).Take(1).ToList();


                var dataworkexperienceininsurance =
                    cnn.Query<CandidateWorkExperienceInInsuranceViewModel>(
                        DbQueryPortal.GetCandidateWorkExperienceInInsurance, new {CandidateId = candidateId});

                candidate.WorkExperiences = dataworkexperienceininsurance.ToList();


                var datareference = cnn.Query<CandidateReferenceViewModel>(DbQueryPortal.GetCandidateReference,
                    new {CandidateId = candidateId});

                candidate.References = datareference.ToList();


                var datarelationininsurance =
                    cnn.Query<CandidateRelationInInsuranceViewModel>(DbQueryPortal.GetCandidateRelationInInsurance,
                        new {CandidateId = candidateId});

                candidate.Relations = datarelationininsurance.ToList();


                //get list available level
                var profilinglevel = GetCandidateProfillingLevel(candidateId);
                var totalscore = profilinglevel.TotalScore;
                var availablelevel = GetCandidateAvailableLevel(totalscore, candidate.GroupLevel);
                candidate.AvailableLevels = availablelevel.ToList();

                var dataaaji = cnn
                    .Query<CandidateAajiExamViewModel>(DbQueryPortal.GetAajiExamCandidate,
                        new {CandidateId = candidateId}).FirstOrDefault();
                candidate.AajiExam = dataaaji;

                var datadependency = cnn.Query<CandidateDependencyViewModel>(DbQueryPortal.GetCandidateDependencies,
                    new {CandidateId = candidateId});
                candidate.Dependencies = datadependency.ToList();
                var candidateroleid = 0;
                if (candidate.Level == "0")
                {
                    candidate.Level = candidate.RecommendedPosition;
                    candidateroleid = Convert.ToInt32(candidate.Level);
                }
                else
                {
                    candidateroleid = Convert.ToInt32(candidate.Level);
                }

                string loginname = cnn.QueryFirstOrDefault<string>(
                    "select LoginName from Account a join Candidate c on a.AgentCode = c.RecruiterAgentCode where c.Id = @CandidateId",
                    new {@CandidateId = candidateId});
                var datamanager = GetManager(loginname, candidateroleid);
                if (datamanager != null)
                {
                    candidate.ManagerAgentCode = datamanager.AgentCode;
                    candidate.ManagerLocation = datamanager.AgentLocation;
                    candidate.ManagerPosition = datamanager.ManagerPosition;
                    candidate.ManagerName = datamanager.DisplayName;

                    if (candidate.LocationCode == null)
                    {
                        candidate.LocationCode = datamanager.AgentLocationCode;
                    }

                    candidate.isAd = false;
                }
                else
                {
                    candidate.isAd = true;
                }

                var headerId = 0;
                var QuestionIdList = new List<int>();
                headerId = cnn.QueryFirst<int>(
                    "select id from CandidateProfilingHeader where CandidateID=@CandidateId and RecommendedPosition!= 0 and IsComplete = 1",
                    new {CandidateId = candidateId});
                interviewdate = cnn.QueryFirstOrDefault<DateTime>(
                    "select CreateDate from CandidateProfilingHeader where CandidateID=@CandidateId and RecommendedPosition!= @RecommendedPosition and IsComplete = @IsComplete ",
                    new {CandidateId = candidateId, IsComplete = 1, RecommendedPosition = 0});

                QuestionIdList =
                    cnn.Query<int>("select QuestionID from CandidateProfilingAnswer where HeaderID= @HeaderId",
                        new {HeaderId = headerId}).ToList();
                //loop get question berdasarkan question list id
                foreach (var item in QuestionIdList)
                {
                    var temp = new ProfilingQuetionViewModel();
                    temp.Option = new List<ProfilingOptionViewModel>();
                    temp = cnn.QueryFirst<ProfilingQuetionViewModel>(
                        "select * from ProfilingQuestion where id = @Id and isDelete != @isDelete and IsActive = @IsActive",
                        new {Id = item, isDelete = 1, IsActive = 1});
                    temp.Option =
                        cnn.Query<ProfilingOptionViewModel>(
                            "select * from ProfilingOption where QuestionID=@Id and IsActive = @IsActive",
                            new {Id = temp.ID, IsActive = 1}).ToList();
                    temp.Answer =
                        cnn.QueryFirst<int>(
                            "select top 1 answer from CandidateProfilingAnswer where HeaderID=@HeaderId and QuestionID=@QuestionId",
                            new {HeaderId = headerId, QuestionId = temp.ID});
                    foreach (var item2 in temp.Option)
                    {
                        if (item2.ID == temp.Answer)
                        {
                            temp.Point = item2.Point;
                            totalprofilingpoint += temp.Point;
                            break;
                        }
                    }

                    QuestionList.Add(temp);
                }

                #region file pelengkap mobile

                var filePelengkap = GetDataPelengkap(candidateId);
                foreach (var item in filePelengkap)
                {
                    if (item.Type == "KTP")
                    {
                        candidate.photoKtpId = item.FileID;
                        candidate.photoKtpbase64 = item.Base64;
                    }
                    else if (item.Type == "FotoDiri")
                    {
                        candidate.photoDiriId = item.FileID;
                        candidate.photoDiribase64 = item.Base64;
                    }
                    else if (item.Type == "NPWP")
                    {
                        candidate.photoNpwpId = item.FileID;
                        candidate.photoNpwpbase64 = item.Base64;
                    }
                    else if (item.Type == "KK")
                    {
                        candidate.photoKkId = item.FileID;
                        candidate.photoKkbase64 = item.Base64;
                    }
                    else if (item.Type == "TABUNGAN")
                    {
                        candidate.photoBukuTabunganId = item.FileID;
                        candidate.photoBukuTabunganbase64 = item.Base64;
                    }
                    else if (item.Type == "TRANSFER")
                    {
                        candidate.photoBuktiTransferId = item.FileID;
                        candidate.photoBuktiTransferbase64 = item.Base64;
                    }
                }

                #endregion file pelengkap mobile


                ptkpdata = cnn
                    .Query<PTKPViewModel>(
                        "select id,gender,maritalstatus,dependencies,ptkpstatus, ptkppermonth, ptkpperyear from ptkp")
                    .ToList();

                if (candidate.NPWPNo != null && !string.IsNullOrEmpty(candidate.NPWPNo) && candidate.NPWPNo != "0"
                ) //mukti change 19 okt 18
                {
                    //var datas = cnn.QueryFirstOrDefault<string>("select concat(PTKPHeader,'_',PTKPDetail) from candidate where id = @id", new { id = candidate.ID });
                    var datas = cnn.QueryFirstOrDefault<string>(
                        "select CONCAT(a.PTKPHeader,'_',a.PTKPDetail,'_',b.MaritalStatus,' , ', b.Dependencies,' , ',PTKPStatus,' , ',PTKPPerMonth,' , ',PTKPPerYear) PtkpDetailValue from Candidate a left join PTKP b on a.ptkpdetail=b.id where a.id = @id",
                        new {id = candidate.ID});
                    if (!string.IsNullOrEmpty(datas))
                    {
                        var splited = datas.Split('_');
                        candidate.PTKPDetail = Convert.ToInt32(splited[1]);
                        candidate.PTKPHeader = splited[0];
                        candidate.PTKPDetailValue = splited[2];
                    }
                }
            }

            dataPdf.CandidateData = candidate;
            dataPdf.ProfilingQuestion = QuestionList;
            dataPdf.PTKPData = ptkpdata;
            dataPdf.InterviewDate = interviewdate;
            dataPdf.TotalProfilingPoint = totalprofilingpoint;

            //get candidate agent director location
            var AgentDirectorLocation = new LocationViewModel();

            if (dataPdf.CandidateData.LevelName == "AD")
            {
                using (var cnn = OpenSunLifeDB())
                {
                    AgentDirectorLocation = cnn.QueryFirstOrDefault<LocationViewModel>(
                        "select ID,AgentLocationCode,AgentLocation,BranchAdmin,IsActive,IsDelete,CreatedWhen,CreatedBy,ChangedWhen,IsApproved,Type,PhoneNumber,Email , KPMOwnerName, NameBranch from Location where AgentLocationCode = @AgentLocation",
                        new {AgentLocation = dataPdf.CandidateData.LocationCode});
                }
            }

            dataPdf.AgencyDirectorLocation = AgentDirectorLocation;
            return dataPdf;
        }

        public void AddCandidateFile(string fileType, int fileId, int CandidateId)
        {
            try
            {
                using (var cnn = OpenSunLifeDB())
                {
                    string Sql =
                        @"IF EXISTS (SELECT ID FROM CANDIDATEFILE WHERE TYPE = @Type AND CandidateId = @CandidateId)
                                    BEGIN UPDATE CandidateFile set Type = @Type, FileID = @FileID, ChangedWhen  = @ChangedWhen where CandidateId = @CandidateId and Type = @Type END
                                    ELSE 
                                    BEGIN INSERT INTO CandidateFile (CandidateID, Type, FileID, CreatedBy, CreatedWhen, ChangedBy, ChangedWhen) VALUES(@CandidateID, @Type, @FileID, @CreatedBy, @CreatedWhen, @ChangedBy, @ChangedWhen) END";
                    cnn.Execute(Sql, new
                    {
                        CandidateId = CandidateId,
                        Type = fileType,
                        FileID = fileId,
                        CreatedBy = HttpContext.Current.User.Identity.Name,
                        CreatedWhen = DateTime.Now,
                        ChangedBy = HttpContext.Current.User.Identity.Name,
                        ChangedWhen = DateTime.Now
                    });
                }
            }
            catch (Exception ex)
            {
            }
        }


        //public PDFCandidateViewModel GetDataPDFMobile(int candidateId)
        //{

        //    var dataPdf = new PDFCandidateViewModel();
        //    var candidate = new CandidateViewModel();
        //    var ptkpdata = new List<PTKPViewModel>();
        //    var QuestionList = new List<ProfilingQuetionViewModel>();
        //    DateTime interviewdate;
        //    Decimal totalprofilingpoint = 0;
        //    using (var cnn = OpenSunLifeDB())
        //    {
        //        candidate = cnn.QueryFirstOrDefault<CandidateViewModel>(DbQueryPortal.GetCandidateMobile, new { CandidateId = candidateId });

        //        var dataexperience = cnn.Query<CandidateExperienceViewModel>(DbQuery.GetCandidateExperience, new { CandidateId = candidateId });

        //        candidate.Experiences = dataexperience.ToList();


        //        var dataeducation = cnn.Query<CandidateEducationViewModel>(DbQuery.GetCandidateEducation, new { CandidateId = candidateId });

        //        candidate.Educations = dataeducation.ToList();


        //        var dataworkexperienceininsurance = cnn.Query<CandidateWorkExperienceInInsuranceViewModel>(DbQueryPortal.GetCandidateWorkExperienceInInsurance, new { CandidateId = candidateId });

        //        candidate.WorkExperiences = dataworkexperienceininsurance.ToList();


        //        var datareference = cnn.Query<CandidateReferenceViewModel>(DbQueryPortal.GetCandidateReference, new { CandidateId = candidateId });

        //        candidate.References = datareference.ToList();


        //        var datarelationininsurance = cnn.Query<CandidateRelationInInsuranceViewModel>(DbQueryPortal.GetCandidateRelationInInsurance, new { CandidateId = candidateId });

        //        candidate.Relations = datarelationininsurance.ToList();


        //        //get list available level
        //        var profilinglevel = GetCandidateProfillingLevel(candidateId);
        //        var totalscore = profilinglevel.TotalScore;
        //        var availablelevel = GetCandidateAvailableLevel(totalscore, candidate.GroupLevel);
        //        candidate.AvailableLevels = availablelevel.ToList();

        //        var dataaaji = cnn.Query<CandidateAajiExamViewModel>(DbQueryPortal.GetAajiExamCandidate, new { CandidateId = candidateId }).FirstOrDefault();
        //        candidate.AajiExam = dataaaji;

        //        var datadependency = cnn.Query<CandidateDependencyViewModel>(DbQueryPortal.GetCandidateDependencies, new { CandidateId = candidateId });
        //        candidate.Dependencies = datadependency.ToList();
        //        var candidateroleid = 0;
        //        if (candidate.Level == "0")
        //        {

        //            candidate.Level = candidate.RecommendedPosition;
        //            candidateroleid = Convert.ToInt32(candidate.Level);
        //        }
        //        else
        //        {
        //            candidateroleid = Convert.ToInt32(candidate.Level);
        //        }

        //        string loginname = cnn.QueryFirstOrDefault<string>("select LoginName from Account a join Candidate c on a.AgentCode = c.RecruiterAgentCode where c.Id = @CandidateId", new { @CandidateId = candidateId });
        //        var datamanager = GetManager(loginname, candidateroleid);
        //        if (datamanager != null)
        //        {
        //            candidate.ManagerAgentCode = datamanager.AgentCode;

        //            candidate.ManagerLocation = datamanager.AgentLocation;
        //            candidate.ManagerPosition = datamanager.ManagerPosition;
        //            candidate.ManagerName = datamanager.DisplayName;

        //            if (candidate.LocationCode == null)
        //            {
        //                candidate.LocationCode = datamanager.AgentLocationCode;
        //            }

        //            candidate.isAd = false;
        //        }
        //        else
        //        {
        //            candidate.isAd = true;
        //        }

        //        var headerId = 0;
        //        var QuestionIdList = new List<int>();
        //        headerId = cnn.QueryFirst<int>("select id from CandidateProfilingHeader where CandidateID=@CandidateId and RecommendedPosition!= 0 and IsComplete = 1", new { CandidateId = candidateId });
        //        interviewdate = cnn.QueryFirstOrDefault<DateTime>("select CreateDate from CandidateProfilingHeader where CandidateID=@CandidateId and RecommendedPosition!= 0 and IsComplete = 1", new { CandidateId = candidateId });

        //        QuestionIdList = cnn.Query<int>("select QuestionID from CandidateProfilingAnswer where HeaderID= @HeaderId", new { HeaderId = headerId }).ToList();
        //        //loop get question berdasarkan question list id
        //        foreach (var item in QuestionIdList)
        //        {
        //            var temp = new ProfilingQuetionViewModel();
        //            temp.Option = new List<ProfilingOptionViewModel>();
        //            temp = cnn.QueryFirst<ProfilingQuetionViewModel>("select * from ProfilingQuestion where id = @Id and isDelete != 1 and IsActive = 1", new { Id = item });
        //            temp.Option = cnn.Query<ProfilingOptionViewModel>("select * from ProfilingOption where QuestionID=@Id and IsActive = 1", new { Id = temp.ID }).ToList();
        //            temp.Answer = cnn.QueryFirst<int>("select top 1 answer from CandidateProfilingAnswer where HeaderID=@HeaderId and QuestionID=@QuestionId", new { HeaderId = headerId, QuestionId = temp.ID });
        //            foreach (var item2 in temp.Option)
        //            {
        //                if (item2.ID == temp.Answer)
        //                {
        //                    temp.Point = item2.Point;
        //                    totalprofilingpoint += temp.Point;
        //                    break;
        //                }
        //            }
        //            QuestionList.Add(temp);
        //        }

        //        ptkpdata = cnn.Query<PTKPViewModel>("select id,gender,maritalstatus,dependencies,ptkpstatus, ptkppermonth, ptkpperyear from ptkp").ToList();

        //        #region file pelengkap mobile
        //        var filePelengkap = GetDataPelengkap(candidateId);
        //        foreach (var item in filePelengkap)
        //        {
        //            if (item.Type == "KTP")
        //            {
        //                candidate.photoKtpId = item.FileID;
        //                candidate.photoKtpbase64 = string.IsNullOrWhiteSpace(item.Base64) ? null : item.Base64;
        //            }
        //            else if (item.Type == "FotoDiri")
        //            {
        //                candidate.photoDiriId = item.FileID;
        //                candidate.photoDiribase64 = string.IsNullOrWhiteSpace(item.Base64) ? null : item.Base64;
        //            }
        //            else if (item.Type == "NPWP")
        //            {
        //                candidate.photoNpwpId = item.FileID;
        //                candidate.photoNpwpbase64 = string.IsNullOrWhiteSpace(item.Base64) ? null : item.Base64;
        //            }
        //            else if (item.Type == "KK")
        //            {
        //                candidate.photoKkId = item.FileID;
        //                candidate.photoKkbase64 = string.IsNullOrWhiteSpace(item.Base64) ? null : item.Base64;
        //            }
        //            else if (item.Type == "TABUNGAN")
        //            {
        //                candidate.photoBukuTabunganId = item.FileID;
        //                candidate.photoBukuTabunganbase64 = string.IsNullOrWhiteSpace(item.Base64) ? null : item.Base64;
        //            }
        //        }
        //        #endregion file pelengkap mobile

        //    }

        //    dataPdf.CandidateData = candidate;
        //    dataPdf.ProfilingQuestion = QuestionList;
        //    dataPdf.PTKPData = ptkpdata;
        //    dataPdf.InterviewDate = interviewdate;
        //    dataPdf.TotalProfilingPoint = totalprofilingpoint;
        //    return dataPdf;
        //}
    }
}