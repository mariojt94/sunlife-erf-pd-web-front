CREATE TABLE [dbo].[ProfilingMatrix] (
    [ID]           INT             IDENTITY (1, 1) NOT NULL,
    [MinimumScore] DECIMAL (18, 2) CONSTRAINT [DF_ProfilingMatrix_MinimumScore] DEFAULT ((0)) NOT NULL,
    [RoleId]       INT             NOT NULL,
    [Group]        INT             NULL,
    CONSTRAINT [PK_ProfilingMatrix] PRIMARY KEY CLUSTERED ([ID] ASC)
);

