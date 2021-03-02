using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERC.Repository.ViewModel
{
    public class LokasiDanHirarkiViewModelPDF
    {
        public int ID { get; set; }
        public string LoginName { get; set; }
        public string Channel { get; set; }
        public bool IsDMTM { get; set; }
        public bool IsInBranch { get; set; }
        public bool IsLainnya { get; set; }

        public string Posisi { get; set; }
        public bool IsIA { get; set; }
        public bool IsSIA { get; set; }
        public bool IsEIA { get; set; }
        public bool IsASM { get; set; }
        public bool IsSASM { get; set; }
        public bool IsEASM { get; set; }
        public bool IsRSM { get; set; }
        public bool IsTMR { get; set; }
        public bool IsSTMR { get; set; }
        public bool IsETMR { get; set; }
        public bool IsPTMR { get; set; }
        public bool IsGL { get; set; }
        public bool IsSGL { get; set; }
        public bool IsEGL { get; set; }
        public bool IsLAINNYA { get; set; }
        public string Leader { get; set; }


        public string Region { get; set; }
        public bool IsInJakarta { get; set; }
        public bool IsOutJakarta { get; set; }


        public string Area { get; set; }
        public string Kota { get; set; }
        public bool IsBesar { get; set; }
        public bool IsKecil { get; set; }


        public string SubBranch { get; set; }
        public string NamaBranch { get; set; }
        public string KodeAgenAtasanLangsung { get; set; }
        public string NamaAtasanLangsung { get; set; }
        public string HiringDate { get; set; }
        public string DeploymentDate { get; set; }
        public string Bank { get; set; }
    }
}
