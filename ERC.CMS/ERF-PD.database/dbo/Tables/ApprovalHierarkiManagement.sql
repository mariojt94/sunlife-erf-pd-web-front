CREATE TABLE [dbo].[ApprovalHierarkiManagement] (
    [Id]           INT          IDENTITY (1, 1) NOT NULL,
    [LocationCode] VARCHAR (50) NULL,
    [ApproveCode]  VARCHAR (20) NULL,
    [LevelId]      INT          NULL,
    [IsActive]     BIT          NULL,
    [IsDelete]     BIT          NULL,
    [Sequence]     INT          NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC)
);

