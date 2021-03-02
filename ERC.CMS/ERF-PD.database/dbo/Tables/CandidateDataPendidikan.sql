CREATE TABLE [dbo].[CandidateDataPendidikan](
	[ID] [bigint] IDENTITY(1,1) NOT NULL,
	[Jenis] [varchar](20) NULL,
	[NamaInstitusi] [varchar](100) NULL,
	[Kota] [varchar](20) NULL,
	[Jurusan] [varchar](50) NULL,
	[Gelar] [varchar](10) NULL,
	[IPK] [decimal](7, 5) NULL,
	[TanggalMasuk] [date] NULL,
	[TanggalLulus] [date] NULL,
 [LoginName] VARCHAR(10) NULL, 
    [Lembaga] VARCHAR(30) NULL, 
    [Sertifikasi] VARCHAR(10) NULL, 
    [LevelPendidikan] VARCHAR(10) NULL, 
    CONSTRAINT [PK_CandidateDataPendidikan] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
