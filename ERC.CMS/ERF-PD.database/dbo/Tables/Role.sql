CREATE TABLE [dbo].[Role] (
    [ID]          INT            IDENTITY (1, 1) NOT NULL,
    [RoleName]    VARCHAR (50)   NOT NULL,
    [Group]       INT            NULL,
    [IsActive]    BIT            NOT NULL,
    [IsDelete]    BIT            NOT NULL,
    [IsHO]        BIT            CONSTRAINT [DF_Role_IsHO] DEFAULT ((0)) NULL,
    [CreatedWhen] DATETIME       NOT NULL,
    [CreatedBy]   NVARCHAR (100) NOT NULL,
    [ChangedWhen] DATETIME       NOT NULL,
    [ChangedBy]   NVARCHAR (100) NOT NULL,
    CONSTRAINT [PK_Role] PRIMARY KEY CLUSTERED ([ID] ASC)
);


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'group level', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'Role', @level2type = N'COLUMN', @level2name = N'Group';

