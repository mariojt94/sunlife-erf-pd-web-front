CREATE TABLE [dbo].[City] (
    [ID]           INT           IDENTITY (1, 1) NOT NULL,
    [CityCode]     VARCHAR (50)  NOT NULL,
    [Name]         VARCHAR (50)  NOT NULL,
    [IsActive]     BIT           CONSTRAINT [DF_Vity_IsActive] DEFAULT ((1)) NOT NULL,
    [IsDelete]     BIT           CONSTRAINT [DF_Vity_IsDelete] DEFAULT ((0)) NOT NULL,
    [CreatedWhen]  DATETIME      NOT NULL,
    [CreatedBy]    VARCHAR (100) NOT NULL,
    [ChangedWhen]  DATETIME      NOT NULL,
    [ChangedBy]    VARCHAR (100) NOT NULL,
    [ProvinceCode] VARCHAR (50)  NULL,
    CONSTRAINT [PK_City] PRIMARY KEY CLUSTERED ([ID] ASC),
    CONSTRAINT [FK_City_Province1] FOREIGN KEY ([ProvinceCode]) REFERENCES [dbo].[Province] ([ProvinceCode])
);


GO
CREATE UNIQUE NONCLUSTERED INDEX [IX_CityCode]
    ON [dbo].[City]([CityCode] ASC);

