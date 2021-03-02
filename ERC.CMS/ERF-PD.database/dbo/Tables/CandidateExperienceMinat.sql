CREATE TABLE [dbo].[CandidateExperienceMinat](
	[ID] [bigint] IDENTITY(1,1) NOT NULL,
	[LoginName] [varchar](10) NULL,
	[Sales] [int] NULL,
	[Computer] [int] NULL,
	[Training] [int] NULL,
	[Accounting] [int] NULL,
	[Engineering] [int] NULL,
	[Law] [int] NULL,
	[Administration] [int] NULL,
	[Manufacture] [int] NULL,
	[SDM] [int] NULL,
	[FrontLiners] [int] NULL,
	[Advertising] [int] NULL,
	[Research] [int] NULL,
 CONSTRAINT [PK_CandidateExperienceMinat] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
