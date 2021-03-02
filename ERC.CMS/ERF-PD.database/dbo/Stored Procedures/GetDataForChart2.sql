CREATE procedure [dbo].[GetDataForChart2]
@LoginName NVARCHAR(MAX),
@Flag int
as
declare @Month int = month(getdate()), @Year int = year(getdate()),
@MinDate date = dateadd(day,-6,getdate()), 
@MaxDate date = getdate()

if (@Flag = 0) 
begin --total
	select sum(count) [count], tgl from (
	select Count(id) as [count], convert(varchar(12),submitdate,103) [tgl]  from candidate 
		where  permanentagentcode is null and Status!='REJECT' and IsDeleted != 1 AND		   
		RecruiterAgentCode=@LoginName 
		and cast(submitdate as date) between @MinDate and @MaxDate group by DAY(submitdate), convert(varchar(12),submitdate,103)
union all
	select Count(id) as [count], convert(varchar(12),ChangedWhen,103) [tgl]  from candidate 
		where PermanentAgentCode is not null and IsDeleted != 1 AND RecruiterAgentCode=@LoginName 
		and cast(ChangedWhen as date) between @MinDate
	and @MaxDate group by DAY(ChangedWhen), convert(varchar(12),ChangedWhen,103)
union all
	SELECT TOP (DATEDIFF(DAY, @MinDate, @MaxDate) + 1) 0 [count],
		tgl = Convert(varchar(12),DATEADD(DAY, ROW_NUMBER() OVER(ORDER BY a.object_id) - 1,
		@MinDate),103)
	FROM sys.all_objects a CROSS JOIN sys.all_objects b 
	) as x group by x.tgl order by CONVERT(DATETIME, x.tgl, 103) 
end

if (@Flag = 1) 
begin
--submit
select SUM(count) [count] from (
	select Count(id) as [count], convert(varchar(12),submitdate,103) [tgl]  from candidate 
		where  permanentagentcode is null and Status!='REJECT' and IsDeleted != 1 AND		   
		RecruiterAgentCode=@LoginName 
		and cast(submitdate as date) between @MinDate and @MaxDate group by DAY(submitdate), convert(varchar(12),submitdate,103)
union all
	SELECT TOP (DATEDIFF(DAY, @MinDate, @MaxDate) + 1) 0 [count],
		tgl = Convert(varchar(12),DATEADD(DAY, ROW_NUMBER() OVER(ORDER BY a.object_id) - 1,
		@MinDate),103)
	FROM sys.all_objects a CROSS JOIN sys.all_objects b 
	) as x group by x.tgl order by CONVERT(DATETIME, x.tgl, 103) 
end

if (@Flag = 2) 
begin
--active
select SUM(count) [count] from (
	select Count(id) as [count], convert(varchar(12),ChangedWhen,103) [tgl]  from candidate 
		where PermanentAgentCode is not null and IsDeleted != 1 AND RecruiterAgentCode=@LoginName 
		and cast(ChangedWhen as date) between @MinDate
	and @MaxDate group by DAY(ChangedWhen), convert(varchar(12),ChangedWhen,103)
union all
	SELECT TOP (DATEDIFF(DAY, @MinDate, @MaxDate) + 1) 0 [count],
		tgl = Convert(varchar(12),DATEADD(DAY, ROW_NUMBER() OVER(ORDER BY a.object_id) - 1,
		@MinDate),103)
	FROM sys.all_objects a CROSS JOIN sys.all_objects b 
	) as x group by x.tgl order by CONVERT(DATETIME, x.tgl, 103) 
end

