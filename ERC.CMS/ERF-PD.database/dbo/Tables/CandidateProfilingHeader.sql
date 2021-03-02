CREATE TABLE [dbo].[CandidateProfilingHeader] (
    [ID]                  BIGINT          IDENTITY (1, 1) NOT NULL,
    [CandidateID]         BIGINT          NOT NULL,
    [TotalScore]          DECIMAL (18, 2) CONSTRAINT [DF_CandidateProfilingHeader_TotalScore] DEFAULT ((0)) NOT NULL,
    [RecommendedPosition] VARCHAR (50)    NOT NULL,
    [CreateDate]          DATETIME        NULL,
    [IsComplete]          BIT             NULL,
    CONSTRAINT [PK_CandidateProfilingHeader] PRIMARY KEY CLUSTERED ([ID] ASC),
    CONSTRAINT [FK_ProfilingHeader_Candidate] FOREIGN KEY ([CandidateID]) REFERENCES [dbo].[Candidate] ([ID])
);

