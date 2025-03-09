/*
  Warnings:

  - You are about to drop the column `assignedTo` on the `report` table. All the data in the column will be lost.
  - Added the required column `reportedBuilding` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reportedRoomNumber` to the `Report` table without a default value. This is not possible if the table is not empty.

*/
-- Tambahkan kolom sebagai nullable
ALTER TABLE `Report` ADD COLUMN `reportedBuilding` VARCHAR(191);
ALTER TABLE `Report` ADD COLUMN `reportedRoomNumber` VARCHAR(191);

-- Isi nilai default untuk baris yang sudah ada
UPDATE `Report` SET `reportedBuilding` = 'A', `reportedRoomNumber` = '101';

-- Ubah kolom menjadi required
ALTER TABLE `Report` MODIFY COLUMN `reportedBuilding` VARCHAR(191) NOT NULL;
ALTER TABLE `Report` MODIFY COLUMN `reportedRoomNumber` VARCHAR(191) NOT NULL;