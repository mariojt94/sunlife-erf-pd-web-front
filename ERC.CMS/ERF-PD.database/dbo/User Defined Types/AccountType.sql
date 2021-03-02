﻿CREATE TYPE [dbo].[AccountType] AS TABLE (
    [LoginName]       VARCHAR (100) NOT NULL,
    [Password]        VARCHAR (50)  NOT NULL,
    [Email]           VARCHAR (50)  NOT NULL,
    [RoleID]          INT           NOT NULL,
    [DisplayName]     VARCHAR (100) NOT NULL,
    [AgentCode]       VARCHAR (50)  NULL,
    [Gender]          VARCHAR (1)   NULL,
    [PhoneNo]         VARCHAR (50)  NULL,
    [IsActive]        BIT           NOT NULL,
    [IsDeleted]       BIT           NOT NULL,
    [CreatedWhen]     DATETIME      NOT NULL,
    [CreatedBy]       VARCHAR (100) NOT NULL,
    [ChangedWhen]     DATETIME      NOT NULL,
    [ChangedBy]       VARCHAR (100) NOT NULL,
    [TeamCode]        NVARCHAR (50) NULL,
    [LocationCode]    NVARCHAR (50) NULL,
    [HiringDate]      NVARCHAR (50) NULL,
    [StatusEffective] NVARCHAR (50) NULL);

