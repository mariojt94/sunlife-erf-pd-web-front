using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERC.Repository.ViewModel
{
    public class FileUploadViewModel
    {
        public int ID { get; set; }
        public string FileName { get; set; }
        public string Path { get; set; }
        public string CreatedWho { get; set; }
        public DateTime CreatedWhen { get; set; }
        public string ChangedWho { get; set; }
        public DateTime ChangedWhen { get; set; }
        public int Length { get; set; }
        public string Base64String { get; set; }

        //TAMBAHAN
        public string TemporaryAgentCode { get; set; }
        public string Type { get; set; }
        public string Name { get; set; }
    }
    public class FileUploadMobileViewModel
    {
        public int ID { get; set; }
        public string FileName { get; set; }
        public string Path { get; set; }
        public string CreatedWho { get; set; }
        public DateTime CreatedWhen { get; set; }
        public string ChangedWho { get; set; }
        public DateTime ChangedWhen { get; set; }
        public int Length { get; set; }
        public string photoKtpbase64 { get; set; }
        public string photoBukuTabunganbase64 { get; set; }
        public string photoDiribase64 { get; set; }
        public string photoKkbase64 { get; set; }
        public string photoNpwpbase64 { get; set; }
        public string Base64String { get; set; }
    }
}
