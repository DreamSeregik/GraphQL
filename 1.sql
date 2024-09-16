USE [Учебная]
GO

/****** Object:  Table [dbo].[Ученики]    Script Date: 03.05.2024 19:52:53 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[Ученики](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[name] [varchar](150) NOT NULL,
	[age] [int] NOT NULL
) ON [PRIMARY]
GO

