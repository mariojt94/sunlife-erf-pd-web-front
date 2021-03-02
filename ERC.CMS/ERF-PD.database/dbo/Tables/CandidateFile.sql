CREATE TABLE [dbo].[CandidateFile] (
    [ID]          BIGINT        IDENTITY (1, 1) NOT NULL,
    [CandidateID] BIGINT        NOT NULL,
    [Type]        VARCHAR (50)  NOT NULL,
    [FileID]      BIGINT        NULL,
    [CreatedBy]   VARCHAR (100) NOT NULL,
    [CreatedWhen] DATETIME      NOT NULL,
    [ChangedBy]   VARCHAR (100) NOT NULL,
    [ChangedWhen] DATETIME      NOT NULL,
    CONSTRAINT [PK_CandidateFile] PRIMARY KEY CLUSTERED ([ID] ASC),
    CONSTRAINT [FK_File_Candidate] FOREIGN KEY ([CandidateID]) REFERENCES [dbo].[Candidate] ([ID])
);

