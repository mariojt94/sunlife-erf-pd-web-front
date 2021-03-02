CREATE TABLE [dbo].[Menu] (
    [ID]          INT            IDENTITY (1, 1) NOT NULL,
    [Icon]        NVARCHAR (100) NOT NULL,
    [Title]       NVARCHAR (100) NOT NULL,
    [Link]        NVARCHAR (100) NOT NULL,
    [ChangedWhen] DATETIME       NOT NULL,
    [ChangedBy]   NVARCHAR (100) NOT NULL,
    [IsActive]    BIT            NULL,
    [IsHomePage]  BIT            DEFAULT ((0)) NULL,
    CONSTRAINT [PK_Menu] PRIMARY KEY CLUSTERED ([ID] ASC)
);

