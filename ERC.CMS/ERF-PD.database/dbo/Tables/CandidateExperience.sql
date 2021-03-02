CREATE TABLE [dbo].[CandidateExperience] (
    [ID]          BIGINT        IDENTITY (1000, 1) NOT NULL,
    [CandidateID] BIGINT        NOT NULL,
    [CompanyName] VARCHAR (100) NULL,
    [QuitReason]  VARCHAR (100) NULL,
    [Position]    VARCHAR (50)  NULL,
    [FromDate]    DATE          NULL,
    [ToDate]      DATE          NULL,
    CONSTRAINT [PK_CandidateExperience] PRIMARY KEY CLUSTERED ([ID] ASC),
    CONSTRAINT [FK_Candidate_CandidateExperience] FOREIGN KEY ([CandidateID]) REFERENCES [dbo].[Candidate] ([ID])
);

