CREATE TABLE [dbo].[AajiExam] (
    [ID]             BIGINT         IDENTITY (1, 1) NOT NULL,
    [ExamCode]       VARCHAR (50)   NULL,
    [ExamDate]       DATETIME       NOT NULL,
    [RegisteredUser] INT            NOT NULL,
    [ExamLocationId] INT            NOT NULL,
    [Note]           NVARCHAR (200) NOT NULL,
    [IsActive]       BIT            NOT NULL,
    [IsDelete]       BIT            NOT NULL,
    [CreatedWhen]    DATETIME       NOT NULL,
    [CreatedBy]      NVARCHAR (100) NOT NULL,
    [ChangedWhen]    DATETIME       NOT NULL,
    [ChangedBy]      VARCHAR (100)  NOT NULL,
    [ExamType]       VARCHAR (50)   NULL,
    CONSTRAINT [PK_AajiExam] PRIMARY KEY CLUSTERED ([ID] ASC),
    CONSTRAINT [FK_AajiExam_ExamLocation] FOREIGN KEY ([ExamLocationId]) REFERENCES [dbo].[ExamLocation] ([ID])
);

