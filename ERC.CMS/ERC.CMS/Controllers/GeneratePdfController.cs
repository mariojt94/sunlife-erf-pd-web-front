using ERC.Repository.Repository;
using ERC.Repository.ViewModel;
using iTextSharp.text;
using iTextSharp.text.pdf;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ERC.CMS.Controllers
{
    [Authorize]
    public class GeneratePdfController : Controller
    {
        RecruitmentFormRepository _recruitmentFormRepository;
        // GET: GeneratePdf

        public string CreatePdf(int candidateId)
        {

            //Create a byte array that will eventually hold our final PDF
            Byte[] bytes;

            using (var ms = new MemoryStream())
            {

                using (var doc = new Document())
                {

                    using (var writer = PdfWriter.GetInstance(doc, ms))
                    {

                        doc.Open();
                        _recruitmentFormRepository = new RecruitmentFormRepository();
                        var data = _recruitmentFormRepository.GetData(candidateId);
                        var pdfvalue = FillPDFValue(data);

                        using (var msCss = new MemoryStream(System.Text.Encoding.UTF8.GetBytes(pdfvalue[1])))
                        {
                            using (var msHtml = new MemoryStream(System.Text.Encoding.UTF8.GetBytes(pdfvalue[0])))
                            {
                                iTextSharp.tool.xml.XMLWorkerHelper.GetInstance().ParseXHtml(writer, doc, msHtml, msCss);
                            }
                        }
                        doc.Close();
                    }
                }
                bytes = ms.ToArray();
                string dirProject = System.AppDomain.CurrentDomain.BaseDirectory;
                
                var filename = "PDF_"+ candidateId + "_" + DateTime.Now.ToString().Replace(":", "_").Replace("/", "_").Replace(" ", "_") + ".pdf";
                var pdfFile = Path.Combine(dirProject+ @"Content\pdf\" + filename);
                System.IO.File.WriteAllBytes(pdfFile, bytes);
                return filename;
            }
        }

        #region covert to pdf
        public List<string> FillPDFValue(CandidateViewModel data)
        {
            var listData = new List<string>();
            string dirProject = System.AppDomain.CurrentDomain.BaseDirectory;
            var html = System.IO.File.ReadAllText(dirProject + @"Content\pdftemplate\TemplateCandidatePDF.html");
            //replace nilai html menjadi dynamic

            html = html.Replace("{{HARI}}","SENIN");
            html = html.Replace("{{TANGGAL}}", "1/1/2018 berhasil");
            //// Data Agency
            //html = html.Replace("{{HARI}}", "SENIN");
            //html = html.Replace("valueOfKodeAgency", data.AgentCode);
            //html = html.Replace("valueOfNamaAgency", data.AgentName);
            //html = html.Replace("valueOfLokasiAgencyDirektor", "Lokasi Agency Direktor Server");
            //html = html.Replace("valueOfKodeAgenDirectManager", "Kode Agen Direct Manager Server");
            //html = html.Replace("valueOfNamaDirectManager", "Nama Direct Manager Server");
            //html = html.Replace("valueOfKodeAgenPerekrut", "Kode Agen Perekrut Server");
            //html = html.Replace("valueOfNamaPerekrut", "Nama Perekrut Server");

            //// Data Pribadi 
            //html = html.Replace("valueOfNamaAgen", "Level Agent Code");
            //html = html.Replace("valueOfJenisKelamin", data.GenderName);
            //html = html.Replace("valueOfAlamatRumah", data.HomeAddress);
            //html = html.Replace("{{NAMA}}", data.CityName.ToString());
            //html = html.Replace("{{HARI}}", data.PostalCode);
            //html = html.Replace("{{TANGGAL}}", data.CurrentAddress);

            //// Data NPWP
            //html = html.Replace("valueOfNomorNPWP", data.NPWPNo.ToString());
            //html = html.Replace("valueOfNamaNPWP", data.NPWPName);


            //// Data BANK
            //html = html.Replace("valueOfNamaRekening", data.BankAccountName);
            //html = html.Replace("valueOfNomorRekening", data.BankAccountNo);
            //html = html.Replace("valueOfNamaBank", data.BankName);
            //html = html.Replace("valueOfCabangBank", data.Branch);
            //// Data Education

            //var listEducation = "";
            //int number = 0;
            //if (data.Educations != null)
            //{
            //    foreach (var item in data.Educations)
            //    {
            //        number += 1;
            //        listEducation += @"<tr>
            //                            <td>" + number + "</td>" +
            //                            "<td> " + item.Level + " </td> " +
            //                            "<td>" + item.InstitutionName + "</td>" +
            //                            "<td>" + item.YearTo.ToString() + "</td>" +
            //                            "<td>" + item.YearFrom + "</td>" +
            //                          "</tr>";

            //    }
            //}
            //html = html.Replace("valueOfTableEducation", listEducation);

            //// Data Experience

            //var listExperience = "";
            //number = 0;
            //if (data.Experiences != null)
            //{
            //    foreach (var item in data.Experiences)
            //    {
            //        number += 1;
            //        listExperience += @"<tr>
            //                            <td>" + number + "</td>" +
            //                            "<td>" + item.CompanyName + "</td>" +
            //                            "<td>" + item.Position + "</td>" +
            //                            "<td>" + item.FromDate + "</td>" +
            //                            "<td>" + item.ToDate + "</td>" +
            //                            "<td>" + item.QuitReason + "</td>" +
            //                          "</tr>";

            //    }
            //}
            //html = html.Replace("valueOfTableExperience", listExperience);

            var css = System.IO.File.ReadAllText(dirProject + @"Content\pdftemplate\TemplateCandidatePDF.css");

            listData.Add(html);
            listData.Add(css);
            return listData;
        }
        #endregion

    }
}