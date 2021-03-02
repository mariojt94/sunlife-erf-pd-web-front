CREATE proc [dbo].[GetProfilingQuestion] 
	@CandidateId int
as 
declare @HeaderId int = ( select top 1 id from CandidateProfilingHeader where CandidateID=@CandidateId and IsComplete=1 and RecommendedPosition != 0 order by id desc )
select @CandidateId as CandidateId,HeaderID, CPH.QuestionID ,CPH.Description as QuestionDescription, CPH.Answer, CPH.Point as AnswerPoint, PO.Description as OptionDescription, PO.Sequence as OptionSequence, PO.Point as OptionPoint  from CandidateProfilingAnswer CPH
right join ProfilingOption PO on PO.QuestionID = CPH.QuestionID
where HeaderID=@HeaderId


