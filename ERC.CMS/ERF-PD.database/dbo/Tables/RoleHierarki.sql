CREATE TABLE [dbo].[RoleHierarki] (
    [ID]            BIGINT        IDENTITY (1, 1) NOT NULL,
    [RoleId]        INT           NOT NULL,
    [HierarkiLevel] INT           NOT NULL,
    [IsActive]      BIT           NOT NULL,
    [IsDelete]      BIT           NOT NULL,
    [CreatedWhen]   DATETIME      NOT NULL,
    [CreatedBy]     VARCHAR (100) NOT NULL,
    [ChangedWhen]   DATETIME      NOT NULL,
    [ChangedBy]     VARCHAR (100) NOT NULL,
    CONSTRAINT [PK_RoleHierarki] PRIMARY KEY CLUSTERED ([ID] ASC),
    CONSTRAINT [FK_RoleHierarki_RoleHierarki] FOREIGN KEY ([RoleId]) REFERENCES [dbo].[Role] ([ID])
);

