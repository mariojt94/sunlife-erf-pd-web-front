CREATE TABLE [dbo].[ProfilingQuestion] (
    [ID]          BIGINT        IDENTITY (1, 1) NOT NULL,
    [Description] VARCHAR (500) NOT NULL,
    [IsActive]    BIT           CONSTRAINT [DF_ProfilingQuestion_IsActive] DEFAULT ((1)) NOT NULL,
    [IsDelete]    BIT           CONSTRAINT [DF_ProfilingQuestion_IsDelete] DEFAULT ((0)) NOT NULL,
    [GroupID]     INT           NOT NULL,
    [CreatedBy]   VARCHAR (100) NOT NULL,
    [CreatedWhen] DATETIME      CONSTRAINT [DF_ProfilingQuestion_CreatedWhen] DEFAULT (getdate()) NOT NULL,
    [ChangedBy]   VARCHAR (100) NOT NULL,
    [ChangedWhen] DATETIME      CONSTRAINT [DF_ProfilingQuestion_ChangedWhen] DEFAULT (getdate()) NOT NULL,
    CONSTRAINT [PK_ProfilingQuestion] PRIMARY KEY CLUSTERED ([ID] ASC)
);

