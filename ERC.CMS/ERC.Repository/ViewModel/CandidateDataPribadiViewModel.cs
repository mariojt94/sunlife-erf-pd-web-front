using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERC.Repository.ViewModel
{
    public class CandidateDataPribadiViewModel
    {
        public int ID { get; set; }
        public string LoginName { get; set; }
        public string NamaLengkap { get; set; }
        public string JenisKelamin { get; set; }
        public string Alamat { get; set; }  
        public string Rt { get; set; }
        public string Rw { get; set; }
        public string Provinsi { get; set; }
        public string Kota { get; set; }
        public string KodePos { get; set; }
        public string TempatLahir { get; set; }
        public DateTime? TanggalLahir { get; set; }
        public string Agama { get; set; }
        public string StatusPernikahan { get; set; }
        public int? TinggiBadan { get; set; }
        public int? BeratBadan { get; set; }
        /*public string Bank { get; set; }*/
        public string Status { get; set; }
        public DateTime TanggalSubmit { get; set; }
        public DateTime TanggalUpdate { get; set; }
        public string ChangedBy { get; set; }
        public string RejectBy { get; set; }
        public string Interviewer { get; set; }
        public bool AllLeaderApproved { get; set; }
        public bool IsDeleted { get; set; }
        public string TemporaryAgentCode { get; set; }
        public string StatusJadwalInterview1 { get; set; }
        public string StatusJadwalInterview2 { get; set; }
        public string ApprovedBy { get; set; }
        public string ApproverPosition { get; set; }

        public string PhoneNo { get; set; }
        public string NoKtp { get; set; }
        public string Email { get; set; }

        public string NoNPWP { get; set; }
        public bool IsSeenNotif1 { get; set; }
        public bool IsSeenNotif2 { get; set; }

        //untuk dokumen
        public string PathImageCV { get; set; }
        public string PathImageKTP { get; set; }
        public string PathImageFoto { get; set; }
        public string PathImageNPWP { get; set; }
        public string PathImageIjazah { get; set; }
        public string PathImageRekening { get; set; }
        public string PathImageLain { get; set; }
        public bool IsPassedTheFirst { get; set; }
        public bool IsNotPassedTheFirst { get; set; }
        public bool IsPassedTheSecond { get; set; }
        public bool IsNotPassedTheSecond { get; set; }
        public bool IsKeluargaComplete { get; set; }
        public bool IsApproved { get; set; }
        public bool IsRejected { get; set; }
    }
}
