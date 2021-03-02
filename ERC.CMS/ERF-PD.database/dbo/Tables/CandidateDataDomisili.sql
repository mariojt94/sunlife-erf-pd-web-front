CREATE TABLE [dbo].[CandidateDataDomisili](
	[ID] [bigint] IDENTITY(1,1) NOT NULL,
	[LoginName] [varchar](10) NULL,
	[NamaLengkap] [varchar](30) NULL,
	[JenisKelamin] [varchar](10) NULL,
	[Alamat] [varchar](50) NULL,
	[RT] [varchar](3) NULL,
	[RW] [varchar](3) NULL,
	[Provinsi] [varchar](20) NULL,
	[Kota] [varchar](20) NULL,
	[KodePos] [varchar](8) NULL,
	[TempatLahir] [varchar](30) NULL,
	[TanggalLahir] [date] NULL,
	[Agama] [varchar](10) NULL,
	[StatusPernikahan] [varchar](10) NULL,
	[TinggiBadan] [int] NULL,
	[BeratBadan] [int] NULL,
	[bank] [varchar](10) NULL,
 CONSTRAINT [PK_CandidateDataDomisili] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
