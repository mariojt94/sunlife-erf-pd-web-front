CREATE TABLE [dbo].[eLibraryDocumentType] (
    [Id]          INT           IDENTITY (1, 1) NOT NULL,
    [Name]        VARCHAR (100) NULL,
    [IsDeleted]   BIT           NULL,
    [CreatedWhen] DATETIME      NULL,
    [CreatedBy]   VARCHAR (100) NULL,
    [ChangedWhen] DATETIME      NULL,
    [ChangedBy]   VARCHAR (100) NULL,
    [isActive]    BIT           NULL
);

