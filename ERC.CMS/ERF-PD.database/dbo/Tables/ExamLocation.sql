CREATE TABLE [dbo].[ExamLocation] (
    [ID]          INT            IDENTITY (1, 1) NOT NULL,
    [Name]        NVARCHAR (250) NOT NULL,
    [CityCode]    VARCHAR (50)   NOT NULL,
    [ExamType]    NVARCHAR (50)  NOT NULL,
    [Capacity]    INT            NOT NULL,
    [IsActive]    BIT            NOT NULL,
    [IsDelete]    BIT            NOT NULL,
    [CreatedWhen] DATETIME       NOT NULL,
    [CreatedBy]   VARCHAR (100)  NOT NULL,
    [ChangedWhen] DATETIME       NOT NULL,
    [ChangedBy]   VARCHAR (100)  NOT NULL,
    CONSTRAINT [PK_ExamLocation] PRIMARY KEY CLUSTERED ([ID] ASC)
);

