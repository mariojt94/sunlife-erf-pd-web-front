CREATE TABLE [dbo].[eLibraryCategory] (
    [Id]          INT           IDENTITY (1, 1) NOT NULL,
    [Name]        VARCHAR (100) NULL,
    [IconSource]  VARCHAR (300) NULL,
    [NumberOrder] INT           NULL,
    [Description] VARCHAR (300) NULL,
    [IsActive]    BIT           NULL,
    [IsDeleted]   BIT           NULL,
    [GroupId]     INT           NULL,
    [CreatedWhen] DATETIME      NULL,
    [CreatedBy]   VARCHAR (100) NULL,
    [ChangedWhen] DATETIME      NULL,
    [ChangedBy]   VARCHAR (100) NULL
);

