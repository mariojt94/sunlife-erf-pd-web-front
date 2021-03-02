using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace ERC.Repository.Repository
{
    public class AesDecrypt
    {
        private static string DecryptStringFromBytes(byte[] cipherText, byte[] key, byte[] iv)
        {
            // Check arguments.  
            if (cipherText == null || cipherText.Length <= 0)
            {
                throw new ArgumentNullException("cipherText");
            }
            if (key == null || key.Length <= 0)
            {
                throw new ArgumentNullException("key");
            }
            if (iv == null || iv.Length <= 0)
            {
                throw new ArgumentNullException("key");
            }

            // Declare the string used to hold  
            // the decrypted text.  
            string plaintext = null;

            // Create an RijndaelManaged object  
            // with the specified key and IV.  
            using (var rijAlg = new RijndaelManaged())
            {
                //Settings  
                rijAlg.Mode = CipherMode.CBC;
                rijAlg.Padding = PaddingMode.PKCS7;
                rijAlg.FeedbackSize = 128;

                rijAlg.Key = key;
                rijAlg.IV = iv;

                // Create a decrytor to perform the stream transform.  
                var decryptor = rijAlg.CreateDecryptor(rijAlg.Key, rijAlg.IV);

                try
                {
                    // Create the streams used for decryption.  
                    using (var msDecrypt = new MemoryStream(cipherText))
                    {
                        using (var csDecrypt = new CryptoStream(msDecrypt, decryptor, CryptoStreamMode.Read))
                        {

                            using (var srDecrypt = new StreamReader(csDecrypt))
                            {
                                // Read the decrypted bytes from the decrypting stream  
                                // and place them in a string.  
                                plaintext = srDecrypt.ReadToEnd();

                            }

                        }
                    }
                }
                catch
                {
                    plaintext = "keyError";
                }
            }

            return plaintext;
        }

        private static byte[] EncryptStringToBytes(string plainText, byte[] key, byte[] iv)
        {
            // Check arguments.  
            if (plainText == null || plainText.Length <= 0)
            {
                throw new ArgumentNullException("plainText");
            }
            if (key == null || key.Length <= 0)
            {
                throw new ArgumentNullException("key");
            }
            if (iv == null || iv.Length <= 0)
            {
                throw new ArgumentNullException("key");
            }
            byte[] encrypted;
            // Create a RijndaelManaged object  
            // with the specified key and IV.  
            using (var rijAlg = new RijndaelManaged())
            {
                rijAlg.Mode = CipherMode.CBC;
                rijAlg.Padding = PaddingMode.PKCS7;
                rijAlg.FeedbackSize = 128;

                rijAlg.Key = key;
                rijAlg.IV = iv;

                // Create a decrytor to perform the stream transform.  
                var encryptor = rijAlg.CreateEncryptor(rijAlg.Key, rijAlg.IV);

                // Create the streams used for encryption.  
                using (var msEncrypt = new MemoryStream())
                {
                    using (var csEncrypt = new CryptoStream(msEncrypt, encryptor, CryptoStreamMode.Write))
                    {
                        using (var swEncrypt = new StreamWriter(csEncrypt))
                        {
                            //Write all data to the stream.  
                            swEncrypt.Write(plainText);
                        }
                        encrypted = msEncrypt.ToArray();
                    }
                }
            }
            // Return the encrypted bytes from the memory stream.  
            return encrypted;
        }
        public static bool IsBase64String(string base64String)
        {
            base64String = base64String.Trim();
            return (base64String.Length % 4 == 0) &&
                   Regex.IsMatch(base64String, @"^[a-zA-Z0-9\+/]*={0,3}$", RegexOptions.None) && base64String.Length >= 24;
        }
        public static string DecryptStringAES(string cipherText)
        {
            if (!string.IsNullOrEmpty(cipherText))
            {
                cipherText = cipherText.Replace(' ', '+');
                if (IsBase64String(cipherText))
                {
                    var keybytes = Encoding.UTF8.GetBytes("8080808080808080");
                    var iv = Encoding.UTF8.GetBytes("8080808080808080");

                    var encrypted = Convert.FromBase64String(cipherText);
                    var decriptedFromJavascript = DecryptStringFromBytes(encrypted, keybytes, iv);
                    return string.Format(decriptedFromJavascript);
                }
            }
            return cipherText;
        }

        public static string EncryptStringAES(string chiperText)
        {
            var keybytes = Encoding.UTF8.GetBytes("8080808080808080");
            var iv = Encoding.UTF8.GetBytes("8080808080808080");

            var encryptedFromJavascript = EncryptStringToBytes(chiperText, keybytes, iv);
            return Convert.ToBase64String(encryptedFromJavascript.ToArray());
        }

        //public static string test(string AuthorizationCode) {

        //    string keyString = "8080808080808080"; //replace with your key
        //    string ivString = "8080808080808080"; //replace with your iv

        //    byte[] key = Encoding.ASCII.GetBytes(keyString);
        //    byte[] iv = Encoding.ASCII.GetBytes(ivString);

        //    using (var rijndaelManaged =
        //            new RijndaelManaged { Key = key, IV = iv, Mode = CipherMode.CBC })
        //    {
        //        rijndaelManaged.BlockSize = 128;
        //        rijndaelManaged.KeySize = 256;
        //        using (var memoryStream =
        //               new MemoryStream(Convert.FromBase64String(AuthorizationCode)))
        //        using (var cryptoStream =
        //               new CryptoStream(memoryStream,
        //                   rijndaelManaged.CreateDecryptor(key, iv),
        //                   CryptoStreamMode.Read))
        //        {
        //            return new StreamReader(cryptoStream).ReadToEnd();
        //        }
        //    }
        //}
    }
}
