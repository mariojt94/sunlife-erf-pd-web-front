CREATE TABLE [dbo].[JadwalInterview] (
    [ID]                           INT            IDENTITY (1, 1) NOT NULL,
    [WaktuInterview1]              TIME (7)       NOT NULL,
    [WaktuInterview2]              TIME (7)       NOT NULL,
    [TanggalInterview1]            DATETIME       NOT NULL,
    [TanggalInterview2]            DATETIME       NOT NULL,
    [LokasiInterview1]             NVARCHAR (250) NOT NULL,
    [LokasiInterview2]             NVARCHAR (250) NOT NULL,
    [catatanInterview1]            NVARCHAR (300) NULL,
    [catatanInterview2]            NVARCHAR (300) NULL,
    [RecruiterAgentCodeInterview1] VARCHAR (100)  NOT NULL,
    [RecruiterAgentCodeInterview2] VARCHAR (100)  NOT NULL,
    [CandidatID]                   BIGINT         NOT NULL,
    CONSTRAINT [PK_JadwalInterview] PRIMARY KEY CLUSTERED ([ID] ASC)
);

