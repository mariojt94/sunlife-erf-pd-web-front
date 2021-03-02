CREATE TABLE [dbo].[UserGroup] (
    [Id]          INT            IDENTITY (1, 1) NOT NULL,
    [LoginName]   VARCHAR (100)  NULL,
    [GroupId]     INT            NULL,
    [IsActive]    BIT            NOT NULL,
    [IsDelete]    BIT            NOT NULL,
    [CreatedWhen] DATETIME       NOT NULL,
    [CreatedBy]   NVARCHAR (100) NOT NULL,
    [ChangedWhen] DATETIME       NOT NULL,
    [ChangedBy]   VARCHAR (100)  NOT NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_UserGroup_Account] FOREIGN KEY ([LoginName]) REFERENCES [dbo].[Account] ([LoginName]),
    CONSTRAINT [FK_UserGroup_Group] FOREIGN KEY ([GroupId]) REFERENCES [dbo].[Group] ([Id])
);

