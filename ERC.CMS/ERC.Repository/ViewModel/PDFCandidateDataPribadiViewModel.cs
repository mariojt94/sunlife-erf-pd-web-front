using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERC.Repository.ViewModel
{
    public class PDFCandidateDataPribadiViewModel
    {
        public CandidateDataPribadiViewModel CandidateDataPribadi { get; set; }
        public string NamaLengkap { get; set; }
        public string Alamat { get; set; }
        public string Rt { get; set; }
        public string Rw { get; set; }
        public string Provinsi { get; set; }
        public string Kota { get; set; }
        public string KodePos { get; set; }
        public string TempatLahir { get; set; }
        public DateTime TanggalLahir { get; set; }
        public string Agama { get; set; }
        public int TinggiBadan { get; set; }
        public int BeratBadan { get; set; }
        public string NoKtp { get; set; }

        public string JenisKelamin { get; set; }
        public bool IsMale { get; set; }
        public bool IsFemale { get; set; }

        public string StatusPernikahan { get; set; }
        public bool IsSingle { get; set; }
        public bool IsMarried { get; set; }
        public bool IsWidowed { get; set; }
        public bool IsDivorced { get; set; }

        public string Status { get; set; }
        public bool IsApproved{ get; set; }
        public bool IsRejected { get; set; }
    }
}
