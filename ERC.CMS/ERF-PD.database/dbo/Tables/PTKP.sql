CREATE TABLE [dbo].[PTKP] (
    [ID]            INT           IDENTITY (1, 1) NOT NULL,
    [Gender]        VARCHAR (15)  NULL,
    [MaritalStatus] VARCHAR (250) NULL,
    [Dependencies]  INT           NULL,
    [PTKPStatus]    NVARCHAR (20) NULL,
    [PTKPPerMonth]  DECIMAL (18)  NULL,
    [PTKPPerYear]   DECIMAL (18)  NULL,
    CONSTRAINT [PK_PTKP] PRIMARY KEY CLUSTERED ([ID] ASC)
);

