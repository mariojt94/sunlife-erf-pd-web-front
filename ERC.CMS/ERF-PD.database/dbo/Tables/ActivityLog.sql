CREATE TABLE [dbo].[ActivityLog] (
    [ID]            BIGINT        IDENTITY (1, 1) NOT NULL,
    [CandidateID]   BIGINT        NULL,
    [RecruiterName] VARCHAR (100) NULL,
    [ManagerName]   VARCHAR (100) NULL,
    [Status]        VARCHAR (50)  NULL,
    [Date]          DATETIME      NULL,
    CONSTRAINT [PK_ActivityLog] PRIMARY KEY CLUSTERED ([ID] ASC)
);

