CREATE TABLE [dbo].[Province] (
    [ID]           INT           IDENTITY (1, 1) NOT NULL,
    [ProvinceCode] VARCHAR (50)  NOT NULL,
    [ProvinceName] VARCHAR (250) NOT NULL,
    [CountryCode]  VARCHAR (50)  NOT NULL,
    [IsActive]     BIT           NOT NULL,
    [IsDelete]     BIT           NOT NULL,
    [CreatedWhen]  DATETIME      NOT NULL,
    [CreatedBy]    VARCHAR (100) NOT NULL,
    [ChangedWhen]  DATETIME      NOT NULL,
    [ChangedBy]    VARCHAR (100) NOT NULL,
    CONSTRAINT [PK_Province] PRIMARY KEY CLUSTERED ([ID] ASC),
    CONSTRAINT [FK_Province_Country] FOREIGN KEY ([CountryCode]) REFERENCES [dbo].[Country] ([CountryCode])
);


GO
CREATE UNIQUE NONCLUSTERED INDEX [IX_Province]
    ON [dbo].[Province]([ProvinceCode] ASC);

