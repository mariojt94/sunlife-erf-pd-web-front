CREATE TABLE [dbo].[CandidateDependencies] (
    [Id]          BIGINT         IDENTITY (1000, 1) NOT NULL,
    [CandidateId] BIGINT         NOT NULL,
    [Status]      NVARCHAR (50)  NOT NULL,
    [Name]        NVARCHAR (100) NOT NULL,
    [BirthDate]   DATETIME       NOT NULL,
    CONSTRAINT [PK_CandidateDependencies] PRIMARY KEY CLUSTERED ([Id] ASC)
);

