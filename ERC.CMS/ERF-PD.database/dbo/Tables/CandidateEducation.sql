CREATE TABLE [dbo].[CandidateEducation] (
    [ID]              BIGINT        IDENTITY (1000, 1) NOT NULL,
    [CandidateID]     BIGINT        NOT NULL,
    [InstitutionName] VARCHAR (100) NOT NULL,
    [YearFrom]        INT           NOT NULL,
    [YearTo]          INT           NOT NULL,
    [Level]           VARCHAR (10)  NULL,
    CONSTRAINT [PK_CandidateEducation] PRIMARY KEY CLUSTERED ([ID] ASC),
    CONSTRAINT [FK_Candidate_CandidateEducation] FOREIGN KEY ([CandidateID]) REFERENCES [dbo].[Candidate] ([ID])
);

