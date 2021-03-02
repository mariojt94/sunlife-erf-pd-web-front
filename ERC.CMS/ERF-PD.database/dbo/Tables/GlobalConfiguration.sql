CREATE TABLE [dbo].[GlobalConfiguration] (
    [Keyword]     VARCHAR (50)  NOT NULL,
    [KeyGroup]    VARCHAR (50)  CONSTRAINT [DF_GlobalConfiguration_KeyGroup] DEFAULT ('NONE') NOT NULL,
    [Value]       VARCHAR (MAX) NULL,
    [CreatedBy]   VARCHAR (100) NOT NULL,
    [CreatedWhen] DATETIME      CONSTRAINT [DF_GlobalConfiguration_CreatedWhen] DEFAULT (getdate()) NOT NULL,
    [ChangedWhen] DATETIME      CONSTRAINT [DF_GlobalConfiguration_ChangedWhen] DEFAULT (getdate()) NOT NULL,
    [ChangedBy]   VARCHAR (100) NOT NULL,
    [IsHide]      BIT           NULL,
    CONSTRAINT [PK_GlobalConfiguration] PRIMARY KEY CLUSTERED ([Keyword] ASC)
);

