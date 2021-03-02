CREATE TABLE [dbo].[CandidateExperiencePrestasi](
	[ID] [bigint] IDENTITY(1,1) NOT NULL,
	[LoginName] [varchar](10) NULL,
	[NamaPenghargaan] [varchar](30) NULL,
	[PemberiPenghargaan] [varchar](30) NULL,
	[TanggalTerima] [date] NULL,
 CONSTRAINT [PK_CandidateExperiencePrestasi] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
