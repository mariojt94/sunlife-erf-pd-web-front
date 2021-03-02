CREATE TABLE [dbo].[Bank] (
    [ID]          INT           IDENTITY (1, 1) NOT NULL,
    [BankCode]    NVARCHAR (20) NOT NULL,
    [BankName]    VARCHAR (50)  NOT NULL,
    [IsActive]    BIT           NOT NULL,
    [IsDelete]    BIT           NOT NULL,
    [CreatedWhen] DATETIME      NOT NULL,
    [CreatedBy]   VARCHAR (100) NOT NULL,
    [ChangedWhen] DATETIME      NOT NULL,
    [ChangedBy]   VARCHAR (100) NOT NULL,
    CONSTRAINT [PK_Bank] PRIMARY KEY CLUSTERED ([ID] ASC)
);


GO
CREATE UNIQUE NONCLUSTERED INDEX [IX_BankCode]
    ON [dbo].[Bank]([BankCode] ASC);

