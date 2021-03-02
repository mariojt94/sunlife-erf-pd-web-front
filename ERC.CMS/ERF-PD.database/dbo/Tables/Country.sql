CREATE TABLE [dbo].[Country] (
    [ID]          INT           IDENTITY (1, 1) NOT NULL,
    [CountryCode] VARCHAR (50)  NOT NULL,
    [CountryName] VARCHAR (250) NOT NULL,
    [IsActive]    BIT           NULL,
    [IsDelete]    BIT           NULL,
    [CreatedWhen] DATETIME      NOT NULL,
    [CreatedBy]   VARCHAR (100) NOT NULL,
    [ChangedWhen] DATETIME      NOT NULL,
    [ChangedBy]   VARCHAR (100) NOT NULL,
    CONSTRAINT [PK_Region] PRIMARY KEY CLUSTERED ([ID] ASC)
);


GO
CREATE UNIQUE NONCLUSTERED INDEX [IX_Country]
    ON [dbo].[Country]([CountryCode] ASC);

