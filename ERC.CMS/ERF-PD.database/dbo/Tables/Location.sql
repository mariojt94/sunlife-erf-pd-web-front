CREATE TABLE [dbo].[Location] (
    [ID]                INT           IDENTITY (1, 1) NOT NULL,
    [AgentLocationCode] VARCHAR (50)  NOT NULL,
    [AgentLocation]     VARCHAR (250) NOT NULL,
    [IsActive]          BIT           NOT NULL,
    [IsDelete]          BIT           NOT NULL,
    [CreatedWhen]       DATETIME      NOT NULL,
    [CreatedBy]         VARCHAR (100) NOT NULL,
    [ChangedWhen]       DATETIME      NOT NULL,
    [ChangedBy]         VARCHAR (100) NOT NULL,
    [IsApproved]        BIT           NOT NULL,
    [Type]              VARCHAR (50)  NULL,
    [PhoneNumber]       VARCHAR (50)  NULL,
    [Email]             VARCHAR (50)  NULL,
    [KPMOwnerName]      VARCHAR (150) NULL,
    [BranchAdmin]       VARCHAR (50)  NULL,
    [NameBranch]        VARCHAR (50)  NULL,
    [PemilikKPM]        VARCHAR (20)  NULL,
    CONSTRAINT [PK_Location] PRIMARY KEY CLUSTERED ([ID] ASC)
);


GO
CREATE UNIQUE NONCLUSTERED INDEX [IX_LocationCode]
    ON [dbo].[Location]([AgentLocationCode] ASC);

