CREATE TABLE [dbo].[Inbox] (
    [ID]              BIGINT        IDENTITY (1, 1) NOT NULL,
    [FromMail]        VARCHAR (50)  NOT NULL,
    [ToMail]          VARCHAR (50)  NOT NULL,
    [Title]           VARCHAR (100) NOT NULL,
    [body]            VARCHAR (500) NOT NULL,
    [IsRead]          BIT           CONSTRAINT [DF_Inbox_IsRead] DEFAULT ((0)) NOT NULL,
    [IsSentAfterRead] BIT           CONSTRAINT [DF_Inbox_IsSentAfterRead] DEFAULT ((0)) NOT NULL,
    [Action]          VARCHAR (50)  NULL,
    [CandidateId]     INT           NULL,
    [ForeignKey]      INT           NULL,
    [CreateDate]      DATETIME      NULL,
    CONSTRAINT [PK_Inbox] PRIMARY KEY CLUSTERED ([ID] ASC)
);

