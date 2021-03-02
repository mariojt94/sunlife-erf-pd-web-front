CREATE TABLE [dbo].[CandidateKontakDarurat](
	[ID] [bigint] NOT NULL,
	[LoginName] [varchar](10) NULL,
	[NamaLengkap] [varchar](30) NULL,
	[NoTelepon] [varchar](20) NULL,
	[Alamat] [varchar](50) NULL,
	[Hubungan] [varchar](15) NULL,
 CONSTRAINT [PK_CandidateKontakDarurat] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

