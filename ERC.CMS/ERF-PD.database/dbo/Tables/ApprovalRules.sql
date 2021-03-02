CREATE TABLE [dbo].[ApprovalRules] (
    [ID]              INT    IDENTITY (1, 1) NOT NULL,
    [CandidateLevel]  BIGINT NULL,
    [ApprovalLevelId] INT    NULL,
    [IsActive]        BIT    NULL,
    [IsDelete]        BIT    NULL,
    CONSTRAINT [PK_ApprovalRules] PRIMARY KEY CLUSTERED ([ID] ASC),
    CONSTRAINT [FK_ApprovalRules_ApprovalRules] FOREIGN KEY ([ID]) REFERENCES [dbo].[ApprovalRules] ([ID])
);

