CREATE TABLE [dbo].[CandidateExperienceOrganisasi](
	[ID] [bigint] IDENTITY(1,1) NOT NULL,
	[LoginName] [varchar](10) NULL,
	[NamaOrganisasi] [varchar](50) NULL,
	[Jabatan] [varchar](30) NULL,
	[Kegiatan] [varchar](100) NULL,
	[TanggalMasuk] [date] NULL,
	[TanggalBerhenti] [date] NULL,
 CONSTRAINT [PK_CandidateExperienceOrganisasi] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]