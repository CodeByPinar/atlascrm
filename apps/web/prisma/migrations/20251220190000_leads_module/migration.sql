-- CreateTable
CREATE TABLE [Lead] (
    [id] NVARCHAR(191) NOT NULL,
    [organizationId] NVARCHAR(191) NOT NULL,
    [name] NVARCHAR(191) NOT NULL,
    [email] NVARCHAR(191),
    [phone] NVARCHAR(191),
    [company] NVARCHAR(191),
    [source] NVARCHAR(191),
    [status] NVARCHAR(20) NOT NULL CONSTRAINT [Lead_status_df] DEFAULT 'NEW',
    [ownerUserId] NVARCHAR(191),
    [lastActivityAt] DATETIME2(3),
    [createdAt] DATETIME2(3) NOT NULL CONSTRAINT [Lead_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2(3) NOT NULL,

    CONSTRAINT [Lead_pkey] PRIMARY KEY ([id]),
    CONSTRAINT [Lead_status_ck] CHECK ([status] IN ('NEW', 'CONTACTED', 'QUALIFIED', 'WON', 'LOST'))
);

-- CreateIndex
CREATE INDEX [Lead_organizationId_createdAt_idx] ON [Lead]([organizationId], [createdAt]);

-- CreateIndex
CREATE INDEX [Lead_organizationId_status_idx] ON [Lead]([organizationId], [status]);

-- CreateIndex
CREATE INDEX [Lead_organizationId_ownerUserId_idx] ON [Lead]([organizationId], [ownerUserId]);

-- CreateIndex
CREATE INDEX [Lead_organizationId_name_idx] ON [Lead]([organizationId], [name]);

-- AddForeignKey
ALTER TABLE [Lead] ADD CONSTRAINT [Lead_organizationId_fkey] FOREIGN KEY ([organizationId]) REFERENCES [Organization]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [Lead] ADD CONSTRAINT [Lead_ownerUserId_fkey] FOREIGN KEY ([ownerUserId]) REFERENCES [User]([id]) ON DELETE SET NULL ON UPDATE CASCADE;
