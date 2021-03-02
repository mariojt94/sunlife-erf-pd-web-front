using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Configuration;
using Dapper;

namespace ERC.Repository.Repository
{
    public abstract class BaseRepository
    {
        protected static void SetIdentity<T>(IDbConnection connection, Action<T> setId)
        {
            dynamic identity = connection.Query("").Single();
            T newId = (T)identity.Id;
            setId(newId);
        }

        protected static IDbConnection OpenSunLifeDB()
        {
            IDbConnection dbConnection = new SqlConnection(ConfigurationManager.ConnectionStrings["SunLifeConnection"].ConnectionString);
            dbConnection.Open(); 
            return dbConnection;
        }
        protected static IDbConnection OpenSunLifeElearningDB()
        {
            IDbConnection dbConnection = new SqlConnection(ConfigurationManager.ConnectionStrings["SunLifeConnectionElearning"].ConnectionString);
            dbConnection.Open();
            return dbConnection;
        }
    }
}
