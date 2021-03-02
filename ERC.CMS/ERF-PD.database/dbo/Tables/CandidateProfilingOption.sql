CREATE TABLE [dbo].[CandidateProfilingOption] (
    [ID]          BIGINT        IDENTITY (1, 1) NOT NULL,
    [AnswerID]    BIGINT        NOT NULL,
    [Description] VARCHAR (500) NOT NULL,
    [Point]       DECIMAL (10)  CONSTRAINT [DF_CandidateProfilingOption_IsCorrect] DEFAULT ((0)) NOT NULL,
    CONSTRAINT [PK_CandidateProfilingOption] PRIMARY KEY CLUSTERED ([ID] ASC),
    CONSTRAINT [FK_CandidateProfilingOption_ProfilingAnswer] FOREIGN KEY ([AnswerID]) REFERENCES [dbo].[CandidateProfilingAnswer] ([ID])
);

