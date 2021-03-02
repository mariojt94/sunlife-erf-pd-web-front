using ERC.CMS.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Principal;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Web;

namespace ERC.CMS.Handlers
{
    public class AppAuthHandler : DelegatingHandler
    {
        IEnumerable<string> authHeaderValues = null;

        protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            try
            {
                request.Headers.TryGetValues("Authorization", out authHeaderValues);
                if (authHeaderValues == null)
                {
                    return base.SendAsync(request, cancellationToken);
                }

                var tokens = authHeaderValues.FirstOrDefault();
                tokens = tokens.Replace("Basic", "").Trim();

                if (!String.IsNullOrEmpty(tokens))
                {
                    byte[] data = Convert.FromBase64String(tokens);
                    string decodedString = Encoding.UTF8.GetString(data);

                    string[] tokensValues = decodedString.Split(':');
                    string username = tokensValues[0];
                    string password = tokensValues[1];

                    var membershipService = new MembershipService();
                    var membershipContext = membershipService.ValidateUser(username, password);
                    if (membershipContext.User != null)
                    {
                        IPrincipal principal = membershipContext.Principal;
                        Thread.CurrentPrincipal = principal;
                        HttpContext.Current.User = principal;
                    }
                    else // Unauthorized access or wrong credentials
                    {
                        var response = new HttpResponseMessage(HttpStatusCode.Unauthorized);
                        var tcs = new TaskCompletionSource<HttpResponseMessage>();
                        tcs.SetResult(response);
                        return tcs.Task;
                    }
                }
                else
                {
                    var response = new HttpResponseMessage(HttpStatusCode.Forbidden);
                    var tcs = new TaskCompletionSource<HttpResponseMessage>();
                    tcs.SetResult(response);
                    return tcs.Task;
                }
                return base.SendAsync(request, cancellationToken);
            }
            catch
            {
                var response = new HttpResponseMessage(HttpStatusCode.Unauthorized);
                var tcs = new TaskCompletionSource<HttpResponseMessage>();
                tcs.SetResult(response);
                return tcs.Task;
            }

        }
    }
}
