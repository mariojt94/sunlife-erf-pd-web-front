CREATE TABLE [dbo].[GroupLevel] (
    [ID]        INT          IDENTITY (1, 1) NOT NULL,
    [GroupID]   INT          NOT NULL,
    [GroupName] VARCHAR (50) NOT NULL,
    CONSTRAINT [PK_GroupLevel] PRIMARY KEY CLUSTERED ([ID] ASC)
);

