CREATE PROCEDURE [dbo].[GetTotalRecruitmentAgentCMS]
	
AS
declare @firstdate as nvarchar(50)
declare @seconddate as nvarchar(50)
set @firstdate = '1/1/' + Convert(nvarchar,year(GETDATE()));
set @seconddate = CONVERT(nvarchar, GETDATE());
SELECT Base.Bulan, Base.Keterangan, Case when CountTable.Total is Null then 0 else CountTable.Total end as Total
FROM (
	select 1 as Bulan, 'Jan' as Keterangan
	union
	select 2 as Bulan, 'Feb' as Keterangan
	union
	select 3 as Bulan, 'Mar' as Keterangan
	union
	select 4 as Bulan, 'Apr' as Keterangan
	union
	select 5 as Bulan, 'Mei' as Keterangan
	union
	select 6 as Bulan, 'Jun' as Keterangan
	union
	select 7 as Bulan, 'Jul' as Keterangan
	union
	select 8 as Bulan, 'Agu' as Keterangan
	union
	select 9 as Bulan, 'Sep' as Keterangan
	union
	select 10 as Bulan, 'Okt' as Keterangan
	union
	select 11 as Bulan, 'Nov' as Keterangan
	union
	select 12 as Bulan, 'Des' as Keterangan
) AS Base
LEFT JOIN (
	select 
		month(C.JoinDate) as Bulan,count(C.ID) as Total
	from Candidate C 
	where C.AgentCode is not null 
	and C.isDeleted!=1
	and C.JoinDate between @firstdate and @seconddate
	group by month(C.JoinDate)
) as CountTable ON Base.Bulan = CountTable.Bulan
Order by Base.Bulan



