CREATE TABLE [dbo].[ResultExam] (
    [Id]                INT           IDENTITY (1, 1) NOT NULL,
    [AgentCode]         VARCHAR (50)  NULL,
    [ExamCode]          VARCHAR (50)  NULL,
    [ExamSession]       VARCHAR (50)  NULL,
    [ExamProduct]       VARCHAR (50)  NULL,
    [ExamResult]        VARCHAR (50)  NULL,
    [AajiCode]          VARCHAR (50)  NULL,
    [AasiCode]          VARCHAR (50)  NULL,
    [CertificateNumber] VARCHAR (100) NULL,
    [LicenseType]       VARCHAR (50)  NULL,
    [ExamLocation]      VARCHAR (100) NULL,
    [ExamDate]          VARCHAR (50)  NULL,
    [ExpiredLicense]    VARCHAR (50)  NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC)
);

