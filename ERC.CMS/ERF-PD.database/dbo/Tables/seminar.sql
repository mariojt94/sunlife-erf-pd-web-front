CREATE TABLE [dbo].[seminar] (
    [Id]          INT           IDENTITY (1, 1) NOT NULL,
    [Nama]        VARCHAR (100) NULL,
    [Lokasi]      VARCHAR (200) NULL,
    [Keterangan]  VARCHAR (200) NULL,
    [Tanggal]     DATETIME      NULL,
    [IsActive]    BIT           NULL,
    [IsDeleted]   BIT           NULL,
    [CreatedWhen] DATETIME      NULL,
    [Createdby]   VARCHAR (50)  NULL,
    [ChangedWhen] DATETIME      NULL,
    [Changedby]   VARCHAR (50)  NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC)
);

