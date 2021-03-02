CREATE TABLE [dbo].[ApprovalList] (
    [ID]             INT          IDENTITY (1, 1) NOT NULL,
    [ApprovalDate]   DATETIME     NULL,
    [CandidateId]    INT          NULL,
    [RecruiterCode]  VARCHAR (50) NULL,
    [ApproverCode]   VARCHAR (50) NULL,
    [StatusApproval] VARCHAR (50) NULL,
    [Reason]         VARCHAR (50) NULL,
    [IsActive]       BIT          NULL,
    CONSTRAINT [PK_ApprovalList] PRIMARY KEY CLUSTERED ([ID] ASC)
);

