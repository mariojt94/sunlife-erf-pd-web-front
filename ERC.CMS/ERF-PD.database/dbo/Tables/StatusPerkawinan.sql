CREATE TABLE [dbo].[statusPerkawinan](
	[ID] [bigint] NOT NULL,
	[MarriageStatusCode] [varchar](5) NULL,
	[StatusPernikahan] [varchar](10) NULL,
 CONSTRAINT [PK_StatusPerkawinan] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
