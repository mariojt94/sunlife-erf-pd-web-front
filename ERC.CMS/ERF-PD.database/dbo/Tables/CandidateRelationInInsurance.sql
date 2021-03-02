CREATE TABLE [dbo].[CandidateRelationInInsurance] (
    [ID]          BIGINT         IDENTITY (1000, 1) NOT NULL,
    [CandidateId] BIGINT         NOT NULL,
    [Name]        NVARCHAR (100) NOT NULL,
    [Relation]    NVARCHAR (100) NOT NULL,
    [CompanyName] NVARCHAR (100) NOT NULL,
    [Position]    NVARCHAR (50)  NOT NULL,
    [Year]        INT            NOT NULL,
    CONSTRAINT [PK_CandidateRelationInsurance] PRIMARY KEY CLUSTERED ([ID] ASC)
);

