-- Seeder generated on Tue Jun 23 23:58:18 IST 2026
SET FOREIGN_KEY_CHECKS=0;

-- ===============================
-- Seed data for centres
-- ===============================
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;
SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '759228e8-4789-11f1-92b0-cf4a04380a8c:1-152166';
INSERT INTO `centres` (`id`, `uuid`, `name`, `slug`, `description`, `address`, `city`, `state`, `country`, `phone`, `email`, `website`, `logo_url`, `banner_url`, `latitude`, `longitude`, `is_active`, `is_mother_temple`, `created_at`, `updated_at`, `deleted_at`) VALUES (1,'0aa3f362-57a2-11f1-8ab1-5f0a17545fdf','ISKCON Ahmedabad','iskcon-ahmedabad','A main iskcon centre in satelitte ahmedabad (mother temple)','Satellite Road, Sarkhej - Gandhinagar Hwy, Ahmedabad, Gujarat 380059','Ahmedabad','Gujarat','India','+91 98798 79456','iskconamd@gmail.com','https://iskconahmedabad.com/',NULL,NULL,23.02700000,72.50630000,1,1,'2026-05-25 00:13:06','2026-06-17 04:54:08',NULL),(2,'0aa3f88a-57a2-11f1-8ab1-5f0a17545fdf','ISKCON Kathwada','iskcon-kathwada','A iskcon centre in kathwada ahmedabad','Hare Krishna Gaushala, Kathwada Bhuvaldi Rd, Chunarvas Gali, Kathwada, Gujarat 382430','Ahmedabad','Gujarat','India','+91 70374 91878','official@iskconkathwada.org','https://iskconkathwada.org/',NULL,NULL,23.04648000,72.69164000,1,0,'2026-05-25 00:13:06','2026-06-17 04:43:06',NULL),(4,'b0916646-b7ca-4fd1-8b63-62fa34fb8c6b','ISKCON Chandkheda','iskon-chandkheda','A iskcon centre in chandkheda ahmedabad ',NULL,'Ahmedabad','Gujarat','India',NULL,NULL,NULL,NULL,NULL,23.02700000,72.50630000,1,0,'2026-06-17 04:36:35','2026-06-17 04:50:40',NULL);
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;

-- ===============================
-- Seed data for roles
-- ===============================
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;
SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '759228e8-4789-11f1-92b0-cf4a04380a8c:1-152166';
INSERT INTO `roles` (`id`, `uuid`, `name`, `description`, `created_at`, `updated_at`, `deleted_at`) VALUES (1,'72cc52aa-57a1-11f1-8ab1-5f0a17545fdf','ADMIN','System administrator','2026-05-25 00:17:26','2026-05-25 00:20:35',NULL),(2,'72cc5732-57a1-11f1-8ab1-5f0a17545fdf','DEVOTEE','Approved devotee','2026-05-25 00:17:26','2026-05-25 00:20:35',NULL),(3,'72cc58ea-57a1-11f1-8ab1-5f0a17545fdf','SEEKER','Regular seeker/user','2026-05-25 00:17:26','2026-05-25 00:20:35',NULL);
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;

-- ===============================
-- Seed data for product_categories
-- ===============================
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;
SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '759228e8-4789-11f1-92b0-cf4a04380a8c:1-152166';
INSERT INTO `product_categories` (`id`, `uuid`, `centre_id`, `name`, `slug`, `description`, `image_url`, `is_active`, `created_at`, `updated_at`, `deleted_at`) VALUES (1,'3944e4d0-6eca-11f1-99cb-58bca71263b9',1,'Books','books','Spiritual books and scriptures',NULL,1,'2026-06-23 11:40:24','2026-06-23 11:40:24',NULL),(2,'394513f6-6eca-11f1-99cb-58bca71263b9',1,'Worship Items','worship-items','Items used in deity worship',NULL,1,'2026-06-23 11:40:24','2026-06-23 11:40:24',NULL),(3,'394518e2-6eca-11f1-99cb-58bca71263b9',1,'Prasadam','prasadam','Sacred food and snacks',NULL,1,'2026-06-23 11:40:24','2026-06-23 11:40:24',NULL),(4,'39451aa4-6eca-11f1-99cb-58bca71263b9',1,'Japa & Tulasi','japa-tulasi','Japa bags, malas and chanting items',NULL,1,'2026-06-23 11:40:24','2026-06-23 11:40:24',NULL),(5,'39451be4-6eca-11f1-99cb-58bca71263b9',1,'Deity Accessories','deity-accessories','Deity dresses and accessories',NULL,1,'2026-06-23 11:40:24','2026-06-23 11:40:24',NULL),(6,'39451de2-6eca-11f1-99cb-58bca71263b9',1,'Incense & Lamps','incense-lamps','Agarbatti, ghee lamps and puja items',NULL,1,'2026-06-23 11:40:24','2026-06-23 11:40:24',NULL),(7,'39451f36-6eca-11f1-99cb-58bca71263b9',1,'Children Books','children-books','Books for children and youth',NULL,1,'2026-06-23 11:40:24','2026-06-23 11:40:24',NULL),(8,'39452058-6eca-11f1-99cb-58bca71263b9',1,'Magazines','magazines','Back To Godhead and other magazines',NULL,1,'2026-06-23 11:40:24','2026-06-23 11:40:24',NULL);
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;

SET FOREIGN_KEY_CHECKS=1;
