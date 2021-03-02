using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Configuration;
using System.Net.Mail;
using System.Net;
using ERC.Repository.Repository;
using Dapper;

namespace ERC.Repository.Helper
{
    public class NotificationHelper : BaseRepository
    {
        public void SendEmail(string Subject, string Email, string BodyEmail)
        {
            try
            {
                MailAddress m = new MailAddress(Email); //validate email

                string smtpHostServer = WebConfigurationManager.AppSettings["SmtpHostServer"];
                int smtpPort = Convert.ToInt32(WebConfigurationManager.AppSettings["SmtpPort"]);
                string smtpUserMail = WebConfigurationManager.AppSettings["SmtpUserMail"];
                string smtpPasswordMail = WebConfigurationManager.AppSettings["SmtpPasswordMail"];
                string enableEmailSender = WebConfigurationManager.AppSettings["enableEmailSender"];

                var smtpClient = new SmtpClient();
                smtpClient.Host = smtpHostServer;
                smtpClient.Port = smtpPort;
                smtpClient.UseDefaultCredentials = false;
                smtpClient.Credentials = new NetworkCredential(smtpUserMail, smtpPasswordMail);
                smtpClient.EnableSsl = true;

                MailMessage message = new MailMessage();
                message.From = new MailAddress(smtpUserMail);
                message.To.Add(Email);
                message.Subject = Subject;
                message.IsBodyHtml = true;
                message.Body = BodyEmail;
                if (enableEmailSender == "1")
                {
                    smtpClient.Send(message); 
                }
            }
            catch (Exception ex)
            {
            }
        }

        public void SendNotification(string From, string To, string Title, string Body, string Action, int CandidateId, int ForeignKey)
        {
            var test2 = DateTime.Now.ToString("MM'/'dd'/'yyyy HH:mm:ss");
            //var query = "INSERT INTO INBOX (FromMail, ToMail, Title, Body, Action, CandidateId, ForeignKey, CreateDate) VALUES('" + From + "','" + To + "','" + Title + "', '" + Body + "', '" + Action + "', '" + CandidateId + "', '" + ForeignKey + "', '" + test2 + "')";

            var query = "INSERT INTO INBOX (FromMail, ToMail, Title, Body, Action, CandidateId, ForeignKey, CreateDate) VALUES(@From,@To,@Title, @Body, @Action, @CandidateId, @ForeignKey, @test2)";
            using (var cnn = OpenSunLifeDB())
            {
                cnn.Execute(query, new { From = From, To = To, Title = Title , Body = Body, Action = Action , CandidateId = CandidateId , ForeignKey = ForeignKey , test2 = test2 });
            }
        }

    }
}
