CREATE TABLE [dbo].[CandidateWorkExperienceInInsurance] (
    [ID]                INT            IDENTITY (1000, 1) NOT NULL,
    [CandidateId]       BIGINT         NOT NULL,
    [CompanyName]       NVARCHAR (100) NOT NULL,
    [LastPosition]      NVARCHAR (50)  NULL,
    [MainOfficeAddress] NVARCHAR (250) NULL,
    [HasBeenJoinFor]    NVARCHAR (50)  NULL,
    [TerminateDate]     DATETIME       NULL,
    [OldAgentCode]      NVARCHAR (250) NULL,
    CONSTRAINT [PK_CandidateIdHasWorkedrInInsurace] PRIMARY KEY CLUSTERED ([ID] ASC)
);

