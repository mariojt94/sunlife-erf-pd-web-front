CREATE TABLE [dbo].[AajiExamDetail] (
    [ID]          BIGINT         IDENTITY (1, 1) NOT NULL,
    [CandidateId] BIGINT         NOT NULL,
    [AajiExamId]  BIGINT         NOT NULL,
    [Status]      NVARCHAR (20)  NOT NULL,
    [Reason]      NVARCHAR (200) NULL,
    [ProductType] NVARCHAR (20)  NULL,
    CONSTRAINT [PK_AajiExamDetail] PRIMARY KEY CLUSTERED ([ID] ASC),
    CONSTRAINT [FK_AajiExamDetail_AajiExam] FOREIGN KEY ([AajiExamId]) REFERENCES [dbo].[AajiExam] ([ID]),
    CONSTRAINT [FK_AajiExamDetail_Candidate] FOREIGN KEY ([CandidateId]) REFERENCES [dbo].[Candidate] ([ID])
);


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Proses, Approved, Rejected', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'AajiExamDetail', @level2type = N'COLUMN', @level2name = N'Status';

