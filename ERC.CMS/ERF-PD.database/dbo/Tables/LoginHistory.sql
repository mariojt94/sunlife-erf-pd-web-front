CREATE TABLE [dbo].[LoginHistory] (
    [Id]          INT          IDENTITY (1, 1) NOT NULL,
    [LoginName]   VARCHAR (20) NULL,
    [LoginDate]   DATETIME     NULL,
    [LoginStatus] VARCHAR (10) NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC)
);

