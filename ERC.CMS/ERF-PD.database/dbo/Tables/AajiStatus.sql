CREATE TABLE [dbo].[AajiStatus] (
    [id]         INT            IDENTITY (1, 1) NOT NULL,
    [agent_code] VARCHAR (15)   NOT NULL,
    [status]     NVARCHAR (MAX) NULL,
    CONSTRAINT [PK__AajiStat__3213E83F34B2BD6A] PRIMARY KEY CLUSTERED ([id] ASC)
);

