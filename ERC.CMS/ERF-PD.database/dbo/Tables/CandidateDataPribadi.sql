CREATE TABLE [dbo].[CandidateDataPribadi](
	[ID] [bigint] IDENTITY(1,1) NOT NULL,
	[LoginName] [varchar](10) NULL,
	[NamaLengkap] [varchar](100) NULL,
	[JenisKelamin] [varchar](10) NULL,
	[Alamat] [varchar](200) NULL,
	[Rt] [varchar](5) NULL,
	[Rw] [varchar](5) NULL,
	[Provinsi] [varchar](10) NULL,
	[Kota] [varchar](50) NULL,
	[KodePos] [varchar](10) NULL,
	[TempatLahir] [varchar](30) NULL,
	[TanggalLahir] [date] NULL,
	[Agama] [varchar](10) NULL,
	[StatusPernikahan] [varchar](10) NULL,
	[TinggiBadan] [int] NULL,
	[BeratBadan] [int] NULL,
	[Bank] [varchar](10) NULL,
	[Status] [varchar](20) NULL,
	[TanggalSubmit] [datetime] NULL,
	[TanggalUpdate] [datetime] NULL,
	[ChangedBy] [varchar](20) NULL,
	[RejectBy] [varchar](20) NULL,
	[Interviewer] [varchar](50) NULL,
	[AllLeaderApproved] [bit] NULL,
 CONSTRAINT [PK_CandidateDataPribadi] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
