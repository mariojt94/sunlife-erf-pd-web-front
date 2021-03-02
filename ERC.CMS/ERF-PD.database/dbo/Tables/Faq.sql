CREATE TABLE [dbo].[Faq] (
    [ID]          BIGINT         IDENTITY (1, 1) NOT NULL,
    [Sequence]    INT            NOT NULL,
    [Title]       VARCHAR (200)  NOT NULL,
    [Description] VARCHAR (1000) NOT NULL,
    [IsActive]    BIT            CONSTRAINT [DF_Faq_IsActive] DEFAULT ((1)) NOT NULL,
    [IsDelete]    BIT            CONSTRAINT [DF_Faq_IsDelete] DEFAULT ((0)) NOT NULL,
    [CreatedWhen] DATETIME       NOT NULL,
    [CreatedBy]   VARCHAR (100)  NOT NULL,
    [ChangedWhen] DATETIME       NOT NULL,
    [ChangedBy]   VARCHAR (100)  NOT NULL,
    CONSTRAINT [PK_Faq] PRIMARY KEY CLUSTERED ([ID] ASC)
);

