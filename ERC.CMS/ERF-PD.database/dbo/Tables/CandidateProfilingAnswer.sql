CREATE TABLE [dbo].[CandidateProfilingAnswer] (
    [ID]          BIGINT        IDENTITY (1, 1) NOT NULL,
    [HeaderID]    BIGINT        NOT NULL,
    [QuestionID]  BIGINT        NOT NULL,
    [Description] VARCHAR (500) NOT NULL,
    [Answer]      INT           NOT NULL,
    [Point]       DECIMAL (10)  CONSTRAINT [DF_CandidateProfilingAnswer_IsCorrect] DEFAULT ((0)) NOT NULL,
    CONSTRAINT [PK_CandidateProfilingAnswer] PRIMARY KEY CLUSTERED ([ID] ASC),
    CONSTRAINT [FK_ProfilingHeader_ProfilingAnswer] FOREIGN KEY ([HeaderID]) REFERENCES [dbo].[CandidateProfilingHeader] ([ID])
);

