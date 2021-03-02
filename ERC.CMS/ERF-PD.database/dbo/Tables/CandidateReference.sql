CREATE TABLE [dbo].[CandidateReference] (
    [ID]           BIGINT         IDENTITY (1000, 1) NOT NULL,
    [CandidateID]  BIGINT         NULL,
    [Name]         NVARCHAR (50)  NULL,
    [Organization] NVARCHAR (150) NULL,
    [Relation]     NVARCHAR (50)  NULL,
    [PhoneNumber]  NVARCHAR (50)  NULL,
    [HasKnownFor]  NVARCHAR (50)  NULL,
    CONSTRAINT [PK_CandidateReference] PRIMARY KEY CLUSTERED ([ID] ASC)
);

