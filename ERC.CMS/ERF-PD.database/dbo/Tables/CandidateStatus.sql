CREATE TABLE [dbo].[CandidateStatus] (
    [ID]           BIGINT        IDENTITY (1, 1) NOT NULL,
    [CandidateID]  BIGINT        NOT NULL,
    [RecruiteName] VARCHAR (100) NOT NULL,
    [ManagerName]  VARCHAR (100) NULL,
    [Status]       VARCHAR (50)  NOT NULL,
    [Date]         DATETIME      NULL,
    CONSTRAINT [PK_CandidateStatus] PRIMARY KEY CLUSTERED ([ID] ASC)
);

