
CREATE PROCEDURE [dbo].[Update_Account]
      @tblAccount AccountType READONLY
AS
BEGIN
      SET NOCOUNT ON;
 
      MERGE INTO Account c1
      USING @tblAccount c2
      ON c1.LoginName=c2.LoginName
      WHEN MATCHED THEN
      UPDATE SET c1.IsActive = c2.IsActive,
            c1.IsDeleted = c2.IsDeleted,
			c1.DisplayName = c2.DisplayName,
			c1.ChangedWhen = c2.ChangedWhen, 
			c1.ChangedBy = c2.ChangedBy,
			c1.Gender = c2.Gender,
			c1.PhoneNo = c2.PhoneNo,
			c1.TeamCode = c2.TeamCode,
			c1.LocationCode = c2.LocationCode,
			c1.Email = c2.Email,
			c1.Password = c2.Password,
			c1.HiringDate = c2.HiringDate,
			c1.StatusEffective = c2.StatusEffective
      WHEN NOT MATCHED THEN
       insert Values (c2.LoginName, c2.Password, c2.Email, c2.RoleID, c2.DisplayName, c2.AgentCode, c2.Gender, c2.PhoneNo,c2.IsActive, c2.IsDeleted, c2.CreatedWhen, c2.CreatedBy, c2.ChangedWhen, c2.ChangedBy, c2.TeamCode, c2.LocationCode,  c2.HiringDate, c2.StatusEffective);
END

