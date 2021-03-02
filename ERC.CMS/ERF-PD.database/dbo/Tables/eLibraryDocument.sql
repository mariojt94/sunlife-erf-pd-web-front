CREATE TABLE [dbo].[eLibraryDocument] (
    [Id]              INT           IDENTITY (1, 1) NOT NULL,
    [CategoryId]      INT           NOT NULL,
    [Name]            VARCHAR (100) NULL,
    [DocumentType]    INT           NOT NULL,
    [DocumentSource]  VARCHAR (300) NULL,
    [IconSource]      VARCHAR (300) NULL,
    [Description]     VARCHAR (300) NULL,
    [IsActive]        BIT           NULL,
    [IsDeleted]       BIT           NULL,
    [CanView]         BIT           NULL,
    [CanDownload]     BIT           NULL,
    [TimesViewed]     INT           NULL,
    [TimesDownloaded] INT           NULL,
    [CreatedWhen]     DATETIME      NULL,
    [CreatedBy]       VARCHAR (100) NULL,
    [ChangedWhen]     DATETIME      NULL,
    [ChangedBy]       VARCHAR (100) NULL
);

