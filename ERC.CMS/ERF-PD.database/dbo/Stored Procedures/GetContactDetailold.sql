CREATE procedure [dbo].[GetContactDetailold]
@CandidateId int
as

--declare @statusdocumentcheck nvarchar(50);
--declare @profilingcheck bit;
--declare @tempagentcode nvarchar(50);
--declare @agentcode nvarchar(50);

----cek status document check
----if exists (select id from DocumentCheck where candidateid = @CandidateId)
----	begin
----		set @statusdocumentcheck = (select Status from DocumentCheck where candidateid = @CandidateId);
----	end
----else
----	begin
----		set @statusdocumentcheck = 'PENDING';
----	end

--SET @statusdocumentcheck = (select Case when DocumentCheckingFlag=1 then 'Ok' else 'Pending' end as Result from Candidate where ID=@CandidateId)

----cek apakah kandidat telah melakukan profiling agent
--if exists (select id from CandidateProfilingHeader where candidateid = @CandidateId and IsComplete = 1)
--	begin
--		set @profilingcheck = 1;
--	end
--else
--	begin
--		set @profilingcheck = 0;
--	end

--select *, @profilingcheck as ProfillingCheck, @statusdocumentcheck as DocumentCheck  from(
--select  Id,
--		JoinDate as SubmitDate, 
--		[Name], 
--		RoleName as [Level], 
--		case when Tbl3.ApprovalDate is null then 'Pengisian RF' else 'Menunggu Approval' end as StatusAgency,
--		AgentLocation as [Location],
--		Status,
--		TemporaryAgentCode,
--		AgentCode,
--		GroupLevel as GroupId
--		from(
--select * from (
--	select C.Id,[Name], R.RoleName, C.ChangedWhen, [Level], C.JoinDate, L.AgentLocation, C.Status, Case when C.TemporaryAgentCode IS NULL THEN 'Belum Tersedia' ELSE C.TemporaryAgentCode end  as TemporaryAgentCode, Case when C.PermanentAgentCode IS NULL then 'Belum Tersedia' else C.PermanentAgentCode end as AgentCode, GroupLevel
--	from Candidate C 
--	left join [Role] R on R.ID = [Level]
--	left join [Location] L on L.Id = C.Location
--	left join GroupLevel GL on C.GroupLevel = GL.GroupID
--	where C.IsDeleted != 1 
--) as Tbl1 left join(select top 1 CandidateId,ApprovalDate from ApprovalList order by ApprovalDate desc) as Tbl2 on Tbl1.ID = Tbl2.CandidateId 
--) as Tbl3) as Tbl4
--where Id = @CandidateId


declare @profilingcheck bit;
declare @statusdocumentcheck nvarchar(50);

--cek apakah kandidat telah melakukan profiling agent
if exists (
	--select id from CandidateProfilingHeader where candidateid = @CandidateId and IsComplete = 1
	select top 1 id 
	from  CandidateProfilingHeader cph where 
	IsComplete = 1 and RecommendedPosition != 0 and RecommendedPosition != '-' and CandidateID=@CandidateId
	order by id desc
)
begin
set @profilingcheck = 1;
end
else
begin
set @profilingcheck = 0;
end
SET @statusdocumentcheck = (select Case when DocumentCheckingFlag=1 then 'Ok' else 'Pending' end as Result from Candidate where ID=@CandidateId)
select C.ID,C.SubmitDate, C.Name, r.RoleName Level, tim.TeamName, loc.AgentLocation Location, dm.DisplayName Manager, rec.DisplayName RecruiterName,
	case
		when @profilingcheck = 0 then 'Belum Mengisi Profiling' 
		when SubmitDate IS NULL then 'Pengisian RF' 
		when AllLeaderApproveFlag = 0 or AllLeaderApproveFlag is null then 'Menunggu Persetujuan' 
		when DocumentCheckingFlag = 0 or DocumentCheckingFlag is null then 'Menunggu Proses Dokumen Cek' 
		when ElearningPassedFlag = 0 or ElearningPassedFlag is null then 'Menunggu Hasil Elearning' 
		when AajiPassedFlag = 0 or AajiPassedFlag is null then 'Menunggu Hasil Ujian AAJI'
		when submitdate is not null and AllLeaderApproveFlag=1 and DocumentCheckingFlag = 1 and AajiPassedFlag = 1 then 'Agen Aktif'
		end as StatusAgency,
		@profilingcheck as ProfillingCheck,
		@statusdocumentcheck as DocumentCheck,
		Case when C.AgentCode  IS NULL then 'Belum Tersedia' else C.AgentCode end as AgentCode,
		CASE WHEN C.TemporaryAgentCode IS NULL then 'Belum Tersedia' else C.TemporaryAgentCode end as TemporaryAgentCode,
		C.[Status],
		C.GroupLevel as GroupId
from Candidate C
left join [Role] r ON c.Level = r.ID	
left join Account rec ON c.RecruiterAgentCode = rec.AgentCode
left join Team tim ON rec.TeamCode = tim.TeamCode
left join Location loc ON tim.LocationCode = loc.AgentLocationCode
left join Account dm ON C.DirectManagerCode = dm.AgentCode
where C.Id = @CandidateId



