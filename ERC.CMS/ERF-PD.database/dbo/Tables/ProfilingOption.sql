CREATE TABLE [dbo].[ProfilingOption] (
    [ID]          BIGINT        IDENTITY (1, 1) NOT NULL,
    [QuestionID]  BIGINT        NOT NULL,
    [Description] VARCHAR (500) NOT NULL,
    [Sequence]    INT           NOT NULL,
    [Point]       DECIMAL (10)  NOT NULL,
    [IsActive]    BIT           NOT NULL,
    [CreatedWho]  VARCHAR (100) NOT NULL,
    [CreatedWhen] DATETIME      NOT NULL,
    [ChangedWho]  VARCHAR (100) NOT NULL,
    [ChangedWhen] DATETIME      NOT NULL,
    CONSTRAINT [PK_ProfilingOption] PRIMARY KEY CLUSTERED ([ID] ASC),
    CONSTRAINT [FK_ProfilingOption_ProfilingQuestion] FOREIGN KEY ([QuestionID]) REFERENCES [dbo].[ProfilingQuestion] ([ID])
);

