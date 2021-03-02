CREATE TABLE [dbo].[DocumentCheck] (
    [ID]          BIGINT        IDENTITY (1, 1) NOT NULL,
    [CandidateId] BIGINT        NOT NULL,
    [Status]      VARCHAR (50)  NOT NULL,
    [Reason]      VARCHAR (MAX) NOT NULL,
    CONSTRAINT [PK_DocumentCheck] PRIMARY KEY CLUSTERED ([ID] ASC)
);

