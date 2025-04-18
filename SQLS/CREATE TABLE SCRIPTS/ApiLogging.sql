CREATE TABLE ApiRequestLogs (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    RequestId NVARCHAR(50) NOT NULL,
    RequestTime DATETIME NOT NULL,
    RequestPath NVARCHAR(MAX) NOT NULL,
    RequestMethod NVARCHAR(10) NOT NULL,
    RequestIp NVARCHAR(50) NOT NULL
);

CREATE TABLE ApiResponseLogs (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    RequestId NVARCHAR(50) NOT NULL,
    ResponseTime DATETIME NOT NULL,
    StatusCode INT NOT NULL,
    ResponseBody NVARCHAR(MAX) NULL,
    DurationMs BIGINT NOT NULL
);

CREATE INDEX IX_ApiRequestLogs_RequestId ON ApiRequestLogs(RequestId);
CREATE INDEX IX_ApiResponseLogs_RequestId ON ApiResponseLogs(RequestId);