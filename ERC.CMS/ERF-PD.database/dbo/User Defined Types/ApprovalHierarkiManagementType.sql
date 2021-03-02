CREATE TYPE [dbo].[ApprovalHierarkiManagementType] AS TABLE (
    [LocationCode] VARCHAR (50) NULL,
    [ApproveCode]  VARCHAR (20) NULL,
    [LevelId]      INT          NULL,
    [IsActive]     BIT          NULL,
    [IsDelete]     BIT          NULL,
    [Sequence]     INT          NULL);

