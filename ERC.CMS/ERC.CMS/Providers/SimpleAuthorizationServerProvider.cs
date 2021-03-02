using ERC.CMS.Services;
using ERC.Repository.Repository;
using ERC.Repository.ViewModel;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.OAuth;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;

namespace ERC.CMS.Providers
{
    public class SimpleAuthorizationServerProvider : OAuthAuthorizationServerProvider
    {
        public override Task ValidateClientAuthentication(OAuthValidateClientAuthenticationContext context)
        {
            string clientId = string.Empty;
            string clientSecret = string.Empty;

            if (!context.TryGetBasicCredentials(out clientId, out clientSecret))
            {
                context.TryGetFormCredentials(out clientId, out clientSecret);
            }

            if (context.ClientId == null)
            {
                //Remove the comments from the below line context.SetError, and invalidate context 
                //if you want to force sending clientId/secrects once obtain access tokens. 
                context.Validated();
                //context.SetError("invalid_clientId", "ClientId should be sent.");
                return Task.FromResult<object>(null);
            }

            OAuthClientRepository oauthClientRepository = new OAuthClientRepository();
            OAuthClientViewModel client = oauthClientRepository.GetOAuthClient(context.ClientId);
            if (client == null)
            {
                context.SetError("invalid_clientId", string.Format("Client '{0}' is not registered in the system.", context.ClientId));
                return Task.FromResult<object>(null);
            }

            if (!client.Active)
            {
                context.SetError("invalid_clientId", "Client is inactive.");
                return Task.FromResult<object>(null);
            }

            context.OwinContext.Set<string>("as:clientAllowedOrigin", client.AllowedOrigin);
            //context.OwinContext.Set<string>("as:clientRefreshTokenLifeTime", client.RefreshTokenLifeTime.ToString());

            context.Validated();
            return Task.FromResult<object>(null);
        }

        public override async Task GrantResourceOwnerCredentials(OAuthGrantResourceOwnerCredentialsContext context)
        {
            var allowedOrigin = context.OwinContext.Get<string>("as:clientAllowedOrigin");

            if (allowedOrigin == null) allowedOrigin = "*";

            //context.OwinContext.Response.Headers.Add("Access-Control-Allow-Origin", new[] { allowedOrigin });

            UserRepository userRepository = new UserRepository();
            //LoginHistoryRepository loginHistoryRepository = new LoginHistoryRepository();

            var user = new UserViewModel();
            var membershipService = new MembershipService();
            var username = AesDecrypt.DecryptStringAES(context.UserName); //context.UserName; // 
            var password = AesDecrypt.DecryptStringAES(context.Password);
            var getUser = userRepository.GetUser(username);

            if (getUser == null)
            {
                context.SetError("invalid_grant", "Maaf User ID atau Password anda tidak ditemukan");
                return;
            }

            if (DateTime.Now.AddDays(-90) > getUser.CreatedWhen)
            {
                context.SetError("invalid_grant", "Account anda sudah tidak aktif, silahkan register kembali");
                return;
            }

            if (getUser.IsActive == 0)
            {
                context.SetError("invalid_grant", "Akun anda saat ini tersuspend");
                return;
            }
            //var IsLocked = membershipService.IsLocked(context.UserName);
            //if (IsLocked)
            //{
            //    context.SetError("invalid_grant", "Akun Anda Terkunci, Silahkan Hubungi Administrator.");
            //    return;
            //}

            MembershipContext userMembership = membershipService.ValidateUser(context.UserName , context.Password); 
            if (userMembership.User == null)
            {
                context.SetError("invalid_grant", "User Name Atau Kata Sandi Salah.");
                return;
            }
            else
            {
                user = userRepository.GetUser(username);
            }

            var identity = new ClaimsIdentity(context.Options.AuthenticationType);
            identity.AddClaim(new Claim(ClaimTypes.Name, username));
            identity.AddClaim(new Claim(ClaimTypes.Role, "user"));
            identity.AddClaim(new Claim("sub", username));

            //int loginHistoryId = loginHistoryRepository.UpdateLoginHistoryLoginDate(context.UserName);

            var props = new AuthenticationProperties(new Dictionary<string, string>
                {
                    {
                        "as:client_id", (context.ClientId == null) ? string.Empty : context.ClientId
                    },
                    {
                        "userName", AesDecrypt.EncryptStringAES(username)
                    },
                    {
                        "roleName", user.RoleName // AesDecrypt.EncryptStringAES(user.RoleName)
                    },
                    {
                        "loginHistoryId", "1"
                    }
                });

            var ticket = new AuthenticationTicket(identity, props);
            
            context.Validated(ticket);
        }

        public override Task TokenEndpoint(OAuthTokenEndpointContext context)
        {
            foreach (KeyValuePair<string, string> property in context.Properties.Dictionary)
            {
                context.AdditionalResponseParameters.Add(property.Key, property.Value);
            }

            return Task.FromResult<object>(null);
        }
    }
}