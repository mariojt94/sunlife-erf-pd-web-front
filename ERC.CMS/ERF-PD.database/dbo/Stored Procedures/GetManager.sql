CREATE proc [dbo].[GetManager] 
	@RecruiterLoginName nvarchar(100),
	@CandidateRoleId int
as
declare @HierarkiLevelCandidate int;
declare @AgentCode nvarchar(50);
declare @RoleIdManager int;
set @AgentCode = (select agentcode from account where LoginName=@RecruiterLoginName)


Set @HierarkiLevelCandidate = (select HierarkiLevel from RoleHierarki where RoleId = @CandidateRoleId)

set @RoleIdManager = (select RoleId from RoleHierarki where HierarkiLevel = @HierarkiLevelCandidate + 1)

select Acc.AgentCode, Acc.DisplayName,R.RoleName as ManagerPosition ,L.AgentLocation from ApprovalHierarki AH 
left join Account Acc on Acc.AgentCode = AH.ApproverCode
left join Team T on T.TeamCode = Acc.TeamCode 
left join Location L on L.AgentLocation = T.LocationCode
left join Role R on R.id = Acc.RoleID
where AH.AgentCode = @AgentCode and LevelId = @RoleIdManager


