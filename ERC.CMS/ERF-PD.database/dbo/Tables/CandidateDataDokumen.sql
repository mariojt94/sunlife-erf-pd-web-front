CREATE TABLE [dbo].[CandidateDataDokumen](
	[ID] [bigint] IDENTITY(1,1) NOT NULL,
	[LoginName] [varchar](10) NULL,
	[FileName] [varchar](200) NULL,
	[Path] [varchar](500) NULL,
	[Type] [varchar](10) NULL,
	[CreateDate] [date] NULL,
 CONSTRAINT [PK_CandidateDataDokumen] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
