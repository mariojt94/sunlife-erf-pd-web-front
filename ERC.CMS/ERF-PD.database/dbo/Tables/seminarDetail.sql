CREATE TABLE [dbo].[seminarDetail] (
    [Id]          INT          IDENTITY (1, 1) NOT NULL,
    [CandidateId] INT          NULL,
    [HeaderId]    INT          NULL,
    [Status]      VARCHAR (50) NULL,
    [CreatedWhen] DATETIME     NULL,
    [Createdby]   VARCHAR (50) NULL,
    [ChangedWhen] DATETIME     NULL,
    [Changedby]   VARCHAR (50) NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC)
);

