using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace ERC.Repository.Repository
{
   public static class GenerateToken
    {
        private static string GenerateLocalAccessTokenResponse(string userName)
        {

            var tokenExpiration = TimeSpan.FromDays(1);
            
            //ClaimsIdentity identity = new ClaimsIdentity(OAuthDefaults.AuthenticationType);

            //identity.AddClaim(new Claim(ClaimTypes.Name, userName));

            //var props = new AuthenticationProperties()
            //{
            //    IssuedUtc = DateTime.UtcNow,
            //    ExpiresUtc = DateTime.UtcNow.Add(tokenExpiration),
            //};

            //var ticket = new AuthenticationTicket(identity, props);

            //var accessToken = Startup.OAuthBearerOptions.AccessTokenFormat.Protect(ticket);
            //var accesT = Startup
            //JObject tokenResponse = new JObject(
            //                            new JProperty("userName", userName),
            //                            new JProperty("access_token", accessToken),
            //                            new JProperty("token_type", "bearer"),
            //                            new JProperty("expires_in", tokenExpiration.TotalSeconds.ToString()),
            //                            new JProperty(".issued", ticket.Properties.IssuedUtc.ToString()),
            //                            new JProperty(".expires", ticket.Properties.ExpiresUtc.ToString())
            //);

            return "tokenResponse";
        }
    }
}
