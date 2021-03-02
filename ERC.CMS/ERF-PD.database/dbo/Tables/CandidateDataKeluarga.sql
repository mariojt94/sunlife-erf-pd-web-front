CREATE TABLE [dbo].[CandidateDataKeluarga](
	[ID] [bigint] IDENTITY(1,1) NOT NULL,
	[LoginName] [varchar](10) NULL,
	[Hubungan] [varchar](10) NULL,
	[NamaLengkap] [varchar](30) NULL,
	[PendidikanTerakhir] [varchar](20) NULL,
	[Pekerjaan] [varchar](20) NULL,
	[TanggalLahir] [date] NULL,
 CONSTRAINT [PK_CandidateDataKeluarga] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
