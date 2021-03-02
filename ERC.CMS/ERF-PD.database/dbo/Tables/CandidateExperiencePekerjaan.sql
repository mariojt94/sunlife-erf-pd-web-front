CREATE TABLE [dbo].[CandidateExperiencePekerjaan](
	[ID] [bigint] IDENTITY(1,1) NOT NULL,
	[LoginName] [varchar](10) NULL,
	[NamaPerusahaan] [varchar](50) NULL,
	[JenisUsaha] [varchar](30) NULL,
	[Posisi] [varchar](30) NULL,
	[TanggalMasuk] [date] NULL,
	[TanggalResign] [date] NULL,
	[TelpKantor] [varchar](50) NULL,
	[Gaji] [int] NULL,
	[Tugas] [varchar](200) NULL,
	[AlasanBerhenti] [varchar](200) NULL,
 CONSTRAINT [PK_CandidateExperiencePekerjaan] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
