CREATE TABLE [dbo].[FileUpload] (
    [ID]          BIGINT        IDENTITY (1, 1) NOT NULL,
    [FileName]    VARCHAR (200) NOT NULL,
    [Path]        VARCHAR (500) NOT NULL,
    [CreatedWhen] DATETIME      NOT NULL,
    [CreatedWho]  VARCHAR (100) NOT NULL,
    [ChangedWhen] DATETIME      NOT NULL,
    [ChangedWho]  VARCHAR (100) NOT NULL,
    CONSTRAINT [PK_FileUpload] PRIMARY KEY CLUSTERED ([ID] ASC)
);

