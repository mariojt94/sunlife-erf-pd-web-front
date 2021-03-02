CREATE TABLE [dbo].[ApprovalHierarki] (
    [ID]           INT          IDENTITY (1, 1) NOT NULL,
    [AgentCode]    VARCHAR (50) NULL,
    [ApproverCode] VARCHAR (50) NULL,
    [LevelId]      INT          NULL,
    [IsActive]     BIT          NULL,
    [IsDelete]     BIT          NULL,
    [Sequence]     INT          NULL,
    CONSTRAINT [PK_ApprovalHierarki] PRIMARY KEY CLUSTERED ([ID] ASC)
);

