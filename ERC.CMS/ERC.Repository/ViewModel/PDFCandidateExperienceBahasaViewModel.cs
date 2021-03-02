using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERC.Repository.ViewModel
{
public class PDFCandidateExperienceBahasaViewModel
    {
        public string Bahasa { get; set; }
        public string Membaca { get; set; }
        public bool IsMembacaSangatBaik { get; set; }
        public bool IsMembacaBaik { get; set; }
        public bool IsMembacaCukup{ get; set; }
        public bool IsMembacaKurang{ get; set; }

        public string Berbicara { get; set; }
        public bool IsBerbicaraSangatBaik { get; set; }
        public bool IsBerbicaraBaik { get; set; }
        public bool IsBerbicaraCukup { get; set; }
        public bool IsBerbicaraKurang { get; set; }

        public string Menulis { get; set; }
        public bool IsMenulisSangatBaik { get; set; }
        public bool IsMenulisBaik { get; set; }
        public bool IsMenulisCukup { get; set; }
        public bool IsMenulisKurang { get; set; }
    }
}
