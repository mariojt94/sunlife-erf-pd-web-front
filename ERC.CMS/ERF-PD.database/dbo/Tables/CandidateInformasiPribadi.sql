CREATE TABLE [dbo].[CandidateInformasiPribadi] (
    [ID]          INT         IDENTITY (1, 1) NOT NULL,
    [CandidateId] INT         NULL,
    [Pertanyaan1] VARCHAR (1) NULL,
    [Pertanyaan2] VARCHAR (1) NULL,
    [Pertanyaan3] VARCHAR (1) NULL,
    [Pertanyaan4] VARCHAR (1) NULL,
    CONSTRAINT [PK_CandidateInformasiPribadi] PRIMARY KEY CLUSTERED ([ID] ASC)
);

