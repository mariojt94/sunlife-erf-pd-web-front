using iTextSharp.text;
using iTextSharp.text.pdf;
using iTextSharp.tool.xml;
using System.IO;
using System.Web.Http;
using System.Web.Mvc;

namespace ERC.CMS.Controllers
{
    public class TestPdfController : ApiController
    {
        //[HttpPost]
        //[HttpGet]
        //[Route("api/Pdf/testPdf")]
        //public IHttpActionResult testPdf()
        //{
        //    //InvoiceModel Obj = new InvoiceModel();
        //    //Obj.CustomerName = "Vithal Wadje";
        //    //Obj.TransactionDate = DateTime.Now.ToString("dd-MM-yyy");

        //    string PdfHtmlTemplate = @"<table border=2 width=100%" + ">" + @" 
        //       <tbody><tr>
  
        //          <td>
        //              Customer Name
        //          </td>
  
        //          <td>
        //             Obj.CustomerName 
        //          </td> 
        //      </tr> 
        //  </tbody></table>";

        //    Aspose.Pdf.License Objpdflicense = new Aspose.Pdf.License();
        //    //Objpdflicense.SetLicense(@"E:\Aspose\Aspose.Pdf.lic");
        //    //Objpdflicense.Embedded = true;
        //    //Check if licensed applied
        //    //if (Document.IsLicensed)
        //    //{
        //    //Set the properties for PDF file page format         
        //    HtmlLoadOptions objLoadOptions = new HtmlLoadOptions();
        //    objLoadOptions.PageInfo.Margin.Bottom = 10;
        //    objLoadOptions.PageInfo.Margin.Top = 20;

        //    //Load HTML string into MemoryStream using Aspose document class
        //    Document doc = new Document(new MemoryStream(Encoding.UTF8.GetBytes(PdfHtmlTemplate)), objLoadOptions);
        //    string FileName = "Aspose_" + DateTime.Now.ToString("dd-MM-yyyy") + ".pdf";
        //    //Save PDF file on local hard drive or database or as you wish          
        //    doc.Save(@"D:" + FileName);
        //    //}

        //    return Ok("sadasd");
        //}

    }
}
