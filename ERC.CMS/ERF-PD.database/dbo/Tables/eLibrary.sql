CREATE TABLE [dbo].[eLibrary] (
    [id]           BIGINT        IDENTITY (1, 1) NOT NULL,
    [parentId]     INT           NULL,
    [name]         VARCHAR (100) NOT NULL,
    [thumbnail]    VARCHAR (200) NULL,
    [path]         VARCHAR (200) NULL,
    [sequence]     INT           NULL,
    [isActive]     BIT           DEFAULT ((1)) NULL,
    [isDelete]     BIT           DEFAULT ((0)) NULL,
    [accessedTime] BIGINT        DEFAULT ((0)) NULL,
    [createdBy]    VARCHAR (20)  NULL,
    [createdWhen]  DATETIME      NULL,
    [changedBy]    VARCHAR (20)  NULL,
    [changedWhen]  DATETIME      NULL,
    PRIMARY KEY CLUSTERED ([id] ASC)
);

