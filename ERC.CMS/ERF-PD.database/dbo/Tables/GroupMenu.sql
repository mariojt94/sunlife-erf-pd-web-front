CREATE TABLE [dbo].[GroupMenu] (
    [Id]          INT            IDENTITY (1, 1) NOT NULL,
    [GroupId]     INT            NULL,
    [MenuId]      INT            NULL,
    [View]        BIT            NOT NULL,
    [Add]         BIT            NOT NULL,
    [Edit]        BIT            NOT NULL,
    [Delete]      BIT            NOT NULL,
    [IsActive]    BIT            NOT NULL,
    [IsDelete]    BIT            NOT NULL,
    [CreatedWhen] DATETIME       NOT NULL,
    [CreatedBy]   NVARCHAR (100) NOT NULL,
    [ChangedWhen] DATETIME       NOT NULL,
    [ChangedBy]   VARCHAR (100)  NOT NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_GroupMenu_Group] FOREIGN KEY ([GroupId]) REFERENCES [dbo].[Group] ([Id])
);

