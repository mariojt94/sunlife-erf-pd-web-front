CREATE proc [dbo].[GetMaxChangeDate] (@Id int) as 
declare @ExamType nvarchar(20);
Set @ExamType = (select top 1 ae.ExamType from ExamLocation EL join AajiExam AE on AE.ExamLocationId = EL.ID where AE.Id = @ID)
declare @MaxChangeDate int = 0;

if @ExamType = 'Online'
begin
	Set @MaxChangeDate = (select value from GlobalConfiguration where Keyword='MaxChangeDateAajiScheduleOnline')
end 
else
begin
	Set @MaxChangeDate = (select value from GlobalConfiguration where Keyword='MaxChangeDateAajiScheduleOffline')
end

select @MaxChangeDate as MaxChangeDate

