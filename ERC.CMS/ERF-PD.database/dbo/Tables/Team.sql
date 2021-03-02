CREATE TABLE [dbo].[Team] (
    [ID]           BIGINT        IDENTITY (1, 1) NOT NULL,
    [TeamCode]     NVARCHAR (50) NOT NULL,
    [TeamName]     VARCHAR (250) NOT NULL,
    [IsActive]     BIT           NOT NULL,
    [IsDelete]     BIT           NOT NULL,
    [CreatedWhen]  DATETIME      NOT NULL,
    [CreatedBy]    VARCHAR (100) NOT NULL,
    [ChangedWhen]  DATETIME      NOT NULL,
    [ChangedBy]    VARCHAR (100) NOT NULL,
    [LocationCode] VARCHAR (50)  NULL,
    [Syariah]      BIT           CONSTRAINT [DF_Team_Syariah] DEFAULT ((0)) NULL,
    CONSTRAINT [PK_Team] PRIMARY KEY CLUSTERED ([ID] ASC),
    CONSTRAINT [FK_Team_Team] FOREIGN KEY ([LocationCode]) REFERENCES [dbo].[Location] ([AgentLocationCode])
);


GO
CREATE UNIQUE NONCLUSTERED INDEX [TeamCode]
    ON [dbo].[Team]([TeamCode] ASC);

