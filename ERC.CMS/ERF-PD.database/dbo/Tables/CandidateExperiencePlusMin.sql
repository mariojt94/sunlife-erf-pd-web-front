
CREATE TABLE [dbo].[CandidateExperiencePlusMin](
	[ID] [bigint] IDENTITY(1,1) NOT NULL,
	[LoginName] [varchar](10) NULL,
	[Kelebihan] [varchar](50) NULL,
	[Kekurangan] [varchar](50) NULL,
 CONSTRAINT [PK_CandidateExperiencePlusMin] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
