using Dapper;
using ERC.Repository.Resources;
using ERC.Repository.ViewModel;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using ERC.Repository.Helper;

namespace ERC.Repository.Repository
{

    //db query blum di update
    public class FileUploadRepository : BaseRepository
    {
        public IEnumerable<FileUploadViewModel> GetListATFAML(string fileName, int pageNumber, int rowsPage)
        {
            using (var cnn = OpenSunLifeDB())
            {
                var sql = @"select * from (SELECT ROW_NUMBER() OVER(ORDER BY fu.ID) AS NUMBER,fu.FileName, fu.ID,c.TemporaryAgentCode, c.Name, cf.Type, fu.Path,
			(select count(c.TemporaryAgentCode) from CandidateFile cf right join Candidate c on c.ID=cf.CandidateID
			left join FileUpload fu on fu.ID=cf.FileID where (c.TemporaryAgentCode is not null and cf.Type in  ('ATF','AML')) 
		and (c.IsDeleted != 1 and c.Status != 'REJECT') and (FU.FileName like @FileName or (@FileName is null))) [Length]
		 from CandidateFile cf right join Candidate c on c.ID=cf.CandidateID
		left join FileUpload fu on fu.ID=cf.FileID where (c.TemporaryAgentCode is not null and cf.Type in  ('ATF','AML')) 
		and (c.IsDeleted != 1 and c.Status != 'REJECT') and (FU.FileName like @FileName or (@FileName is null))
		) AS TBL WHERE NUMBER BETWEEN ((@PageNumber - 1) * @RowsPage + 1) AND (@PageNumber * @RowsPage) ORDER BY NUMBER";
                if (fileName == null)
                    fileName = "";
                return cnn.Query<FileUploadViewModel>(sql, new { FileName = '%' + fileName + '%', PageNumber = pageNumber, RowsPage = rowsPage });
            }
        }

        public IEnumerable<FileUploadViewModel> GetListGoogle(string fileName, int pageNumber, int rowsPage)
        {
            using (var cnn = OpenSunLifeDB())
            {
                var sql = @"select * from (SELECT ROW_NUMBER() OVER(ORDER BY fu.ID) AS NUMBER,fu.FileName, fu.ID,c.TemporaryAgentCode, c.Name, cf.Type, fu.Path,
			(select count(c.TemporaryAgentCode) from CandidateFile cf right join Candidate c on c.ID=cf.CandidateID
			left join FileUpload fu on fu.ID=cf.FileID where (c.TemporaryAgentCode is not null and cf.Type in  ('GOOGLE')) 
		and (c.IsDeleted != 1 and c.Status != 'REJECT') and (FU.FileName like @FileName or (@FileName is null))) [Length]
		 from CandidateFile cf right join Candidate c on c.ID=cf.CandidateID
		left join FileUpload fu on fu.ID=cf.FileID where (c.TemporaryAgentCode is not null and cf.Type in  ('GOOGLE')) 
		and (c.IsDeleted != 1 and c.Status != 'REJECT') and (FU.FileName like @FileName or (@FileName is null))
		) AS TBL WHERE NUMBER BETWEEN ((@PageNumber - 1) * @RowsPage + 1) AND (@PageNumber * @RowsPage) ORDER BY NUMBER";
                if (fileName == null)
                    fileName = "";
                return cnn.Query<FileUploadViewModel>(sql, new { FileName = '%' + fileName + '%', PageNumber = pageNumber, RowsPage = rowsPage });
            }
        }
        public IEnumerable<FileUploadViewModel> GetListFileUpload(string fileName, int pageNumber, int rowsPage)
        {
            using (var cnn = OpenSunLifeDB())
            {
                if (fileName == null)
                    fileName = "";
                return cnn.Query<FileUploadViewModel>(DbQuery.GetListFileUpload, new { FileName = '%' + fileName + '%', PageNumber = pageNumber, RowsPage = rowsPage });
            }
        }
        public void AddFileUpload(FileUploadViewModel fileUpload)
        {
            using (var cnn = OpenSunLifeDB())
            {
                cnn.Execute(DbQuery.AddFileUpload, new
                {
                    FileName = fileUpload.FileName,
                    Path = fileUpload.Path,
                    CreatedWho = HttpContext.Current.User.Identity.Name,
                    CreatedWhen = DateTime.Now,
                    ChangedWho = HttpContext.Current.User.Identity.Name,
                    ChangedWhen = DateTime.Now
                });
            }
        }
        public void DeleteCandidateFile(int FileID)
        {
            var sql = "delete from CandidateFile where FileID = @FileID";
            using (var cnn = OpenSunLifeDB())
            {
                cnn.Execute(sql, new { FileID = FileID });
            }
        }
        public void DeleteFileUpload(int Id)
        {
            using (var cnn = OpenSunLifeDB())
            {
                cnn.Execute(DbQuery.DeleteFileUpload, new
                {
                    ID = Id
                });
            }
        }

        public FileUploadViewModel GetFileUpload(int Id)
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.QuerySingleOrDefault<FileUploadViewModel>(DbQuery.GetFileUpload, new { Id = Id });
            }
        }

        public List<CandidateDokumenViewModel> GetDokumenCandidate(string loginName)
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.Query<CandidateDokumenViewModel>(DbQuery.GetDokumenCandidate, new { loginName = loginName }).ToList();
            }
        }

        public List<CandidateDokumenViewModel> GetDokumenPDF(string loginName)
        {
            using (var cnn = OpenSunLifeDB())
            {
                return cnn.Query<CandidateDokumenViewModel>(DbQuery.GetDokumenPDF, new { loginName = loginName }).ToList();
            }
        }

        public bool UpdateDokumenPDF(CandidateDokumenViewModel data)
        {
            using (var cnn = OpenSunLifeDB())
            {
                var result = cnn.Execute(DbQuery.UpdateDokumenPDF, new
                {
                    loginName = data.LoginName, 
                    type = data.Type,
                    fileName = data.FileName ,
                    path = data.Path
                }) == 1;

                return result;
            }
        }


        public bool UploadDokumen(CandidateDokumenViewModel fileUpload)
        {
            using (var cnn = OpenSunLifeDB())
            {
                var testId = cnn.QueryFirstOrDefault<string>(
                    "SELECT ID FROM CandidateExperiencePrestasi WHERE LoginName = @loginName AND ID = @id",
                    new { loginName = fileUpload.LoginName, id = fileUpload.ID });
                if (testId != null)
                {
                    var result = cnn.Execute(DbQuery.UpdateDokumenCandidate, new
                    {
                        id = fileUpload.ID,
                        fileName = fileUpload.FileName,
                        path = fileUpload.Path,
                        loginName = fileUpload.LoginName,
                        type = fileUpload.Type,
                        createDate = DateTime.Now
                    }) == 1;

                    return result;
                }
                else
                {
                    var result = cnn.Execute(DbQuery.AddDokumenCandidate, new
                    {
                        fileName = fileUpload.FileName,
                        path = fileUpload.Path,
                        loginName = fileUpload.LoginName,
                        type = fileUpload.Type,
                        createDate = DateTime.Now,
                        isDeleted = false
                    }) == 1;

                    return result;
                }
            }
           
        }

        public string DeleteCandidateDocument(CandidateDokumenViewModel[] data)
        {
            var status = "DELETE";
            using (IDbConnection cnn = OpenSunLifeDB())
            {
                foreach (CandidateDokumenViewModel docs in data)
                {
                    //var removeUrl = docs.Path.Replace("http://104.154.84.84/ERFPDFiles/", @"C:\ERFPDFiles\");

                    /*                    var testId = cnn.QueryFirstOrDefault<string>(
                        "SELECT ID FROM CandidateDataDokumen where LoginName = @loginName AND ID = @id",
                        new { loginName = docs.LoginName, id = docs.ID });
                    if (testId != null)
                    {*/

                        cnn.Execute(DbQuery.DeleteDokumenCandidate, new
                        {
                            isDeleted = true,
                            changedDate = DateTime.Now,
                            loginName = docs.LoginName,
                            path = docs.Path,
                        });
                    //}
                }
            }
            return status;
        }

        public string DeleteCandidateDocumentByName(List<CandidateDokumenViewModel> data)
        {
            var status = "DELETE";
            using (IDbConnection cnn = OpenSunLifeDB())
            {
                foreach (CandidateDokumenViewModel docs in data)
                {
                    cnn.Execute(@"UPDATE CandidateDataDokumen SET
                    IsDeleted = @isDeleted,
                    ChangedDate = @changedDate WHERE LoginName = @loginName AND FileName = @fileName", new
                    {
                        isDeleted = true,
                        changedDate = DateTime.Now,
                        loginName = docs.LoginName,
                        fileName = docs.FileName,
                    });
                }
            }
            return status;
        }

        public int UploadFile(FileUploadViewModel fileUpload)
        {
            var returnId = 0;
            using (var cnn = OpenSunLifeDB())
            {
                returnId = cnn.Query<int>(DbQuery.AddFileDataPelengkap, new
                {
                    FileName = fileUpload.FileName,
                    Path = fileUpload.Path,
                    CreatedWho = HttpContext.Current.User.Identity.Name,
                    CreatedWhen = DateTime.Now,
                    ChangedWho = HttpContext.Current.User.Identity.Name,
                    ChangedWhen = DateTime.Now
                }).Single();
            }
            return returnId;
        }
        public int UploadFileMobile(FileUploadMobileViewModel fileUpload)
        {
            var returnId = 0;
            using (var cnn = OpenSunLifeDB())
            {
                returnId = cnn.Query<int>(DbQuery.AddFileDataPelengkap, new
                {
                    FileName = fileUpload.FileName,
                    Path = fileUpload.Path,
                    CreatedWho = fileUpload.ChangedWho,
                    CreatedWhen = DateTime.Now,
                    ChangedWho = fileUpload.ChangedWho,
                    ChangedWhen = DateTime.Now
                }).Single();
            }
            return returnId;
        }

        public int GetFileID(string fileName)
        {
            using (var cnn = OpenSunLifeDB())
            {
                var sql = "select ID from FileUpload where FileName like @FileName";
                return cnn.QueryFirstOrDefault<int>(sql, new { FileName = fileName + "%" });
            }
        }
    }
}

