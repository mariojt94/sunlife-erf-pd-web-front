CREATE procedure [dbo].[GetContactDetail]
@CandidateId int
as

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
select C.ID,C.SubmitDate, C.Name, r.RoleName Level, L.AgentLocation as  Location, dm.DisplayName Manager, rec.DisplayName RecruiterName,
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
		--Case when C.AgentCode  IS NULL then 'Belum Tersedia' else C.AgentCode end as AgentCode,
		Case when C.TemporaryAgentCode IS NULL then 'Belum Tersedia' else C.TemporaryAgentCode end as AgentCode,
		CASE WHEN C.TemporaryAgentCode IS NULL then 'Belum Tersedia' else C.TemporaryAgentCode end as TemporaryAgentCode,
		C.[Status],
		C.GroupLevel as GroupId,
		C.VirtualAccount
from Candidate C
left join [Role] r ON c.Level = r.ID	
left join Account rec ON c.RecruiterAgentCode = rec.AgentCode
left join Account dm ON C.DirectManagerCode = dm.AgentCode
left join Location l on l.AgentLocationCode=c.LocationCode
where C.Id = @CandidateId


select AgentDirectorLocation, LocationCode from Candidate order by id desc
