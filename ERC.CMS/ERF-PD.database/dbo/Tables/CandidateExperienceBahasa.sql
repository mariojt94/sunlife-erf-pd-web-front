CREATE TABLE [dbo].[CandidateExperienceBahasa](
	[ID] [bigint] IDENTITY(1,1) NOT NULL,
	[LoginName] [varchar](10) NULL,
	[Bahasa] [varchar](20) NULL,
	[Membaca] [varchar](20) NULL,
	[Berbicara] [varchar](30) NULL,
	[Menulis] [varchar](30) NULL,
 CONSTRAINT [PK_CandidateExperienceBahasa] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
