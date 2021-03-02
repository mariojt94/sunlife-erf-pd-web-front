CREATE TYPE [dbo].[ApprovalHierarkiType] AS TABLE (
    [AgentCode]    VARCHAR (50) NOT NULL,
    [ApproverCode] VARCHAR (50) NOT NULL,
    [LevelId]      INT          NOT NULL,
    [IsActive]     BIT          NOT NULL,
    [IsDelete]     BIT          NULL,
    [Sequence]     INT          NOT NULL);

