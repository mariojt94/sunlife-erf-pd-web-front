CREATE TABLE [dbo].[Group] (
    [Id]          INT            IDENTITY (1, 1) NOT NULL,
    [GroupName]   VARCHAR (50)   NULL,
    [IsActive]    BIT            NOT NULL,
    [CreatedWhen] DATETIME       NOT NULL,
    [CreatedBy]   NVARCHAR (100) NOT NULL,
    [ChangedWhen] DATETIME       NOT NULL,
    [IsDelete]    BIT            NULL,
    [ChangedBy]   VARCHAR (100)  NOT NULL,
    CONSTRAINT [PK_Group_3214EC074F8CBD85] PRIMARY KEY CLUSTERED ([Id] ASC)
);

