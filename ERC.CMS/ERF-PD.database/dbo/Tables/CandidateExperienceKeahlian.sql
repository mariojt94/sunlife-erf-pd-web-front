CREATE TABLE [dbo].[CandidateExperienceKeahlian](
	[ID] [bigint] IDENTITY(1,1) NOT NULL,
	[LoginName] [varchar](10) NULL,
	[NamaKeahlian] [varchar](30) NULL,
	[Sertifikasi] [varchar](30) NULL,
 CONSTRAINT [PK_CandidateExperienceKeahlian] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
