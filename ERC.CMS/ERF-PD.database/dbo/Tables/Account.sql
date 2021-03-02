CREATE TABLE [dbo].[Account] (
    [LoginName]       VARCHAR (100) NOT NULL,
    [Password]        VARCHAR (50)  CONSTRAINT [DF_Account_Password] DEFAULT ('indocyber') NOT NULL,
    [Email]           VARCHAR (50)  NOT NULL,
    [RoleID]          INT           NOT NULL,
    [DisplayName]     VARCHAR (100) NOT NULL,
    [AgentCode]       VARCHAR (50)  NULL,
    [Gender]          VARCHAR (1)   NULL,
    [PhoneNo]         VARCHAR (50)  NULL,
    [IsActive]        BIT           NOT NULL,
    [IsDeleted]       BIT           CONSTRAINT [DF_Account_IsDeleted] DEFAULT ((0)) NOT NULL,
    [CreatedWhen]     DATETIME      NOT NULL,
    [CreatedBy]       VARCHAR (100) NOT NULL,
    [ChangedWhen]     DATETIME      NOT NULL,
    [ChangedBy]       VARCHAR (100) NOT NULL,
    [TeamCode]        NVARCHAR (50) NULL,
    [LocationCode]    NVARCHAR (50) NULL,
    [HiringDate]      NVARCHAR (50) NULL,
    [StatusEffective] NVARCHAR (50) NULL,
    CONSTRAINT [PK_Employee] PRIMARY KEY CLUSTERED ([LoginName] ASC),
    CONSTRAINT [FK_Account_Account] FOREIGN KEY ([TeamCode]) REFERENCES [dbo].[Team] ([TeamCode]),
    CONSTRAINT [FK_Account_Role] FOREIGN KEY ([RoleID]) REFERENCES [dbo].[Role] ([ID])
);


GO
CREATE UNIQUE NONCLUSTERED INDEX [IX_Account]
    ON [dbo].[Account]([LoginName] ASC);


GO
CREATE UNIQUE NONCLUSTERED INDEX [Ix_AgentCode]
    ON [dbo].[Account]([AgentCode] ASC);

