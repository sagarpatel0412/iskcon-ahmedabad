-- MySQL dump 10.13  Distrib 9.6.0, for macos26.3 (arm64)
--
-- Host: localhost    Database: iskcon_mobile_database
-- ------------------------------------------------------
-- Server version	9.6.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '759228e8-4789-11f1-92b0-cf4a04380a8c:1-152166';

--
-- Table structure for table `auth_tokens`
--

DROP TABLE IF EXISTS `auth_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_tokens` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` char(36) NOT NULL,
  `user_id` int NOT NULL,
  `token_hash` text NOT NULL,
  `device_type` enum('android','ios','web') DEFAULT NULL,
  `device_name` varchar(255) DEFAULT NULL,
  `ip_address` varchar(100) DEFAULT NULL,
  `user_agent` text,
  `expires_at` timestamp NOT NULL,
  `revoked_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  KEY `idx_auth_tokens_user_id` (`user_id`),
  KEY `idx_auth_tokens_expires_at` (`expires_at`),
  KEY `idx_auth_tokens_revoked_at` (`revoked_at`),
  CONSTRAINT `fk_auth_tokens_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=85 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_tokens`
--

LOCK TABLES `auth_tokens` WRITE;
/*!40000 ALTER TABLE `auth_tokens` DISABLE KEYS */;
INSERT INTO `auth_tokens` VALUES (19,'1202dcbf-23bc-44a6-b5a3-f7da2c730330',3,'$2b$10$r3qzFiwITbGUbpbXOvZgf.i1VnqHr7J/DucrU3JQgnYto7v7jjoNe','android','OTP Login','::ffff:192.168.29.93','okhttp/4.12.0','2026-06-26 09:21:09','2026-06-07 07:24:18','2026-05-27 09:21:09','2026-06-07 07:24:18','2026-06-07 07:24:18'),(20,'22106f18-62fc-42bd-80b7-9ab335d83b5e',3,'$2b$10$zQPmokmjn0XpDYoz2k.cjex/BsLfLc14MuYog.9wUI0ZOy26LU6Yq','android','OTP Login','::ffff:192.168.29.93','okhttp/4.12.0','2026-06-26 09:33:12','2026-06-07 07:24:18','2026-05-27 09:33:12','2026-06-07 07:24:18','2026-06-07 07:24:18'),(21,'9607c8c3-48b9-4469-98c7-39fd71f9a19d',3,'$2b$10$Za7nQRi90mycy/2ZVgEUu..c2sF2jfQIvZUb0Rwe.N2y2q63rPmEO','android','OTP Login','::ffff:192.168.29.93','okhttp/4.12.0','2026-06-26 10:11:00','2026-06-07 07:24:18','2026-05-27 10:11:00','2026-06-07 07:24:18','2026-06-07 07:24:18'),(22,'6f36f07a-f36d-44fc-8c1f-b496c812cbca',3,'$2b$10$Rw.OPbal06rwJ62FJSDZHOlx/uo1kxt3NcDDkVCTR0aVO1syLHsmW','android','OTP Login','::ffff:192.168.29.93','okhttp/4.12.0','2026-06-26 10:25:56','2026-06-07 07:24:18','2026-05-27 10:25:56','2026-06-07 07:24:18','2026-06-07 07:24:18'),(23,'e93cbf7e-a3b1-4adf-8dd9-28a838d960cd',3,'$2b$10$WDC978AMlY4JKVyfV1xSjuliFBR9iYJSmK/su96qqCt6U7Fhn78ga','android','OTP Login','::ffff:192.168.29.93','okhttp/4.12.0','2026-06-26 10:29:00','2026-06-07 07:24:18','2026-05-27 10:29:00','2026-06-07 07:24:18','2026-06-07 07:24:18'),(24,'24661f23-84d6-400e-974c-ee0c214ce4f3',3,'$2b$10$PRKa6fal6KEjb8v7EZRsYuEn7eViq5pRdt5h7KVDU7buTADeE57dq','android','OTP Login','::ffff:192.168.29.93','okhttp/4.12.0','2026-06-26 10:32:27','2026-06-07 07:24:18','2026-05-27 10:32:27','2026-06-07 07:24:18','2026-06-07 07:24:18'),(25,'65664c97-94c1-4a47-aebc-58ee248e4a81',3,'$2b$10$caeOSfIu3IUCja19VsLxyepk0IRClmne0dcG6cRbRBknp8hty5peC','android','OTP Login','::ffff:192.168.29.93','okhttp/4.12.0','2026-06-26 10:40:32','2026-06-07 07:24:18','2026-05-27 10:40:32','2026-06-07 07:24:18','2026-06-07 07:24:18'),(26,'a7472672-264a-4318-9d04-0786e3fdb617',4,'$2b$10$XcVxtqqasHgrpk2sfR6eE.FFy0m051jcBXIMGSF52YuVsFx6LIucm','android','OTP Login','::ffff:192.168.29.93','okhttp/4.12.0','2026-06-26 10:48:42','2026-06-07 07:24:18','2026-05-27 10:48:42','2026-06-07 07:24:18','2026-06-07 07:24:18'),(27,'b2750acc-e4f6-4b52-9fc6-b13732641d47',4,'$2b$10$EUcz0peF5h8bE00OME7nkOP/PddS5KHPFLsPBXvjaoHGT.4IWUCHO','android','OTP Login','::ffff:192.168.29.93','okhttp/4.12.0','2026-06-26 10:51:45','2026-06-07 07:24:18','2026-05-27 10:51:45','2026-06-07 07:24:18','2026-06-07 07:24:18'),(28,'a727529a-32e5-4639-832b-c7969dc58988',4,'$2b$10$g9Hi14IzzfN37vZ20fH/v.8Eg55mbBlQi31nEgOpenvd0jU9LYfHi','android','OTP Login','::ffff:192.168.29.93','okhttp/4.12.0','2026-06-26 10:54:30','2026-06-07 07:24:18','2026-05-27 10:54:30','2026-06-07 07:24:18','2026-06-07 07:24:18'),(29,'81e735c7-3f56-4713-a134-316dd9ec9aad',3,'$2b$10$uP3kVP16h0wv/LT0Cu71r.D99lj2BgAHslOqs1PGF97Oh0p4SxBKe','android','OTP Login','::ffff:192.168.29.93','okhttp/4.12.0','2026-06-26 10:55:54','2026-06-07 07:24:18','2026-05-27 10:55:54','2026-06-07 07:24:18','2026-06-07 07:24:18'),(30,'f86a5fbd-5ed5-4027-b69d-488ffe0a235f',4,'$2b$10$vI4QjcF5/c/aY2X1upL0TuOlwoaU8qsYFf/CAD2XJ7s4Byig63wlK','android','OTP Login','::ffff:192.168.29.93','okhttp/4.12.0','2026-06-26 10:57:29','2026-06-07 07:24:18','2026-05-27 10:57:29','2026-06-07 07:24:18','2026-06-07 07:24:18'),(31,'29dae807-771f-462f-89f4-251a2afbb132',4,'$2b$10$pmpkvPOViUnIVpS1nOVvyOwLHipXJf2L4bHnsaNwEOmd6CBPnsyC6','android','OTP Login','::ffff:192.168.29.93','okhttp/4.12.0','2026-06-26 11:07:59','2026-06-07 07:24:18','2026-05-27 11:07:59','2026-06-07 07:24:18','2026-06-07 07:24:18'),(32,'9f8ef5c5-91ab-4463-b697-2788bcdc1cc9',3,'$2b$10$QZ1FUTp2bboMA4rmZ2GjAelw.zkK3.WsJJL17tCt4Nmy1ewhWGD1K','android','OTP Login','::ffff:192.168.29.93','okhttp/4.12.0','2026-06-26 11:15:29','2026-06-07 07:24:18','2026-05-27 11:15:29','2026-06-07 07:24:18','2026-06-07 07:24:18'),(33,'fbf43c57-fb64-4b53-a5bf-c757435c46ed',4,'$2b$10$f/cnyAnujMG/R/Rl9I2O5OEq1Ov4d5TFchnHuBDQB04DtJsExXC3m','android','OTP Login','::ffff:192.168.29.93','okhttp/4.12.0','2026-06-26 11:17:59','2026-06-07 07:24:18','2026-05-27 11:17:59','2026-06-07 07:24:18','2026-06-07 07:24:18'),(34,'73b7551a-de68-4510-b9cc-0da8de2e52b4',4,'$2b$10$wwCvNN8E21HN6QezD8PWHeVncGFGyF8Buqm./ueV6fsZUSBGwJzQe','android','OTP Login','::ffff:192.168.29.93','okhttp/4.12.0','2026-06-26 11:51:36','2026-06-07 07:24:18','2026-05-27 11:51:36','2026-06-07 07:24:18','2026-06-07 07:24:18'),(35,'e5442557-7547-41f3-b0ab-c512eb8361f3',4,'$2b$10$z6F1/PSwXi6iMFannb8QguH4QI0HyB8h2emXFlbTii8fh.u0XeTm6','android','OTP Login','::ffff:192.168.29.93','okhttp/4.12.0','2026-06-27 09:47:31','2026-06-07 07:24:18','2026-05-28 09:47:31','2026-06-07 07:24:18','2026-06-07 07:24:18'),(36,'dc242440-02c6-4e39-88b1-495278cd2659',4,'$2b$10$Qw8c42.2vWKO09od2j0Lke438lRYHxe1V.PKq/ecJS56.kQm/plxO','android','OTP Login','::ffff:192.168.29.93','okhttp/4.12.0','2026-06-27 09:49:13','2026-06-07 07:24:18','2026-05-28 09:49:13','2026-06-07 07:24:18','2026-06-07 07:24:18'),(37,'25823add-c6a9-436f-bc53-cc03be575f1c',4,'$2b$10$3W.44ZNI9QdTQDLZE06QtOGBuUiJrY2XQABDgpjY9AhC4HXfvo5ve','android','OTP Login','::ffff:192.168.29.93','okhttp/4.12.0','2026-06-27 10:53:48','2026-06-07 07:24:18','2026-05-28 10:53:48','2026-06-07 07:24:18','2026-06-07 07:24:18'),(38,'223d5265-5cdd-486b-92b7-bac9bc9dde02',4,'$2b$10$eiZZiG9o7ODZ.40wUlp8pup64PgE1o4EOCTksbeApZgkVEsXomg8G','android','OTP Login','::ffff:192.168.29.93','okhttp/4.12.0','2026-06-27 11:03:23','2026-06-07 07:24:18','2026-05-28 11:03:23','2026-06-07 07:24:18','2026-06-07 07:24:18'),(39,'bbcbb9fe-cc77-443e-956e-d383a2b1125b',4,'$2b$10$.I2mlPAWR6zur2xIiBpbguq4t9hUG31dHBGMCYziw7/E.RrcyHLUy','android','OTP Login','::1','PostmanRuntime/7.54.0','2026-06-27 11:11:01','2026-06-07 07:24:18','2026-05-28 11:11:01','2026-06-07 07:24:18','2026-06-07 07:24:18'),(40,'70a57ac0-6c8f-4938-ad47-5e89df29face',3,'$2b$10$14SG5K59rIxxu0L8um02muSF4M8C6oF65WcfkctltPcQM8FIMzdim','android','OTP Login','::ffff:192.168.29.93','okhttp/4.12.0','2026-06-27 11:35:31','2026-06-07 07:24:18','2026-05-28 11:35:31','2026-06-07 07:24:18','2026-06-07 07:24:18'),(41,'e3446873-8bd9-48a4-bb6b-452c0e223e05',3,'$2b$10$7inzrklk3bA./NTNclXBhOj6wnOEaCD7YThVqk8/fPIbeOS087D9a','android','OTP Login','::ffff:192.168.29.93','okhttp/4.12.0','2026-06-27 11:47:32','2026-06-07 07:24:18','2026-05-28 11:47:32','2026-06-07 07:24:18','2026-06-07 07:24:18'),(42,'41ea5a08-8723-46e0-8ef3-0bef357da3d4',4,'$2b$10$VtfQ76Q7aU5R7ai40u9ABuZJij6lPBAq1hUvwSmU4lOfOIZcFYBmy','android','OTP Login','::ffff:192.168.29.93','okhttp/4.12.0','2026-06-27 11:48:35','2026-06-07 07:24:18','2026-05-28 11:48:35','2026-06-07 07:24:18','2026-06-07 07:24:18'),(43,'94f988f1-fef1-4a75-a332-6bd18aad3c8d',4,'$2b$10$RJkspOxbs415Dkbt6xDFp.Xb6mehMLWUeBEJ88px/6gV519T1mCfm','android','OTP Login','::1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-06-28 23:35:41','2026-06-07 07:24:18','2026-05-29 23:35:41','2026-06-07 07:24:18','2026-06-07 07:24:18'),(44,'34b822de-2007-4051-9734-bd841c0e5fa3',4,'$2b$10$/ZGY3CPPNE8M/jsWzYCBT.TPhdMJwvXzem27bEpDO1S10jk/8uxcK','android','OTP Login','::1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-06-28 23:55:12','2026-06-07 07:24:18','2026-05-29 23:55:12','2026-06-07 07:24:18','2026-06-07 07:24:18'),(45,'afda2a4e-6913-44ea-b2d4-d2f6a66eab51',3,'$2b$10$3RXf6r4cP9RSazK2LwLEzOQ2bAkDhLNkJmgt.YbRKdT2LV5R.30LC','android','OTP Login','::1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-06-28 23:56:27','2026-06-07 07:24:18','2026-05-29 23:56:27','2026-06-07 07:24:18','2026-06-07 07:24:18'),(46,'a41a27d7-48de-488d-bd14-2634bb26e616',4,'$2b$10$N3IeeskW.1NAdWZXwbibF.vXfQ7UOtFzPknq/VZ.51cTCAD4q5Wm6','android','OTP Login','::1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-06-29 21:54:38','2026-06-07 07:24:18','2026-05-30 21:54:38','2026-06-07 07:24:18','2026-06-07 07:24:18'),(47,'5689b64c-ac5b-4ba6-9662-418cf1297371',3,'$2b$10$fiY0Q.aYn6MmdUt39GsDjOSveFM858mI6CMtx8y0UDM2mG9hHy0C6','android','OTP Login','::1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-06-29 22:47:03','2026-06-07 07:24:18','2026-05-30 22:47:03','2026-06-07 07:24:18','2026-06-07 07:24:18'),(48,'33242dda-7448-49e7-9c01-f3e38ed71555',4,'$2b$10$nECehgwWwDDolht9zOY.eu8H7fKyNp6UMBGYlzzjp1LkDzxv/iWAW','android','OTP Login','::1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-06-30 00:52:44','2026-06-07 07:24:18','2026-05-31 00:52:44','2026-06-07 07:24:18','2026-06-07 07:24:18'),(49,'2f8f3989-8a2f-4a83-a99a-660eaebfcfc1',4,'$2b$10$aXfkh6WmB/ns5xVZ0T0yl.dlTYDsDms7UV0.pmhw.QgYN9d/tjgQW','android','OTP Login','::1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-06-30 04:26:38','2026-06-07 07:24:18','2026-05-31 04:26:38','2026-06-07 07:24:18','2026-06-07 07:24:18'),(50,'64966d3a-8568-4dc5-86de-954a4090fa74',4,'$2b$10$DQmw6WVqJbD7IfKpdhSYd.WC1XS6hWuzjA4xGVdXD1t.CaYLqyRqC','android','OTP Login','::1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-06-30 05:35:04','2026-06-07 07:24:18','2026-05-31 05:35:04','2026-06-07 07:24:18','2026-06-07 07:24:18'),(51,'68c58778-4b10-4eb7-93c8-7ed226bdb112',3,'$2b$10$.Yc.MFLHxXBUyaYji5e/J.6Jga1wFV7dYBTVaUtKeSLdncJBrDGsK','android','OTP Login','::1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-06-30 05:38:07','2026-06-07 07:24:18','2026-05-31 05:38:07','2026-06-07 07:24:18','2026-06-07 07:24:18'),(52,'da9e4d38-75e4-49af-8db2-0ae07c8d4ab7',4,'$2b$10$uFm6/uzFQkXm72dk0j80nO.z57cs6HiBzNgttYeioe.pFUlRQnaju','android','OTP Login','::ffff:192.168.29.93','okhttp/4.12.0','2026-07-01 22:22:06','2026-06-07 07:24:18','2026-06-01 22:22:06','2026-06-07 07:24:18','2026-06-07 07:24:18'),(53,'7ccf1f01-b185-4ece-8770-8018ccd1aab9',4,'$2b$10$hPtp4KnDR6PJ7eZpEhdcwOqiNAkgwBbQef4KuMwlBPUDaKbG8XKGK','android','OTP Login','::ffff:192.168.29.93','okhttp/4.12.0','2026-07-01 22:22:54','2026-06-07 07:24:18','2026-06-01 22:22:54','2026-06-07 07:24:18','2026-06-07 07:24:18'),(54,'7b9573f2-ee57-49ac-8290-259c5fda8838',4,'$2b$10$Cvtd0.9qkDRIcMvpRX8oKuxGJ3ln1cKcOHe4kHgIT4Wf8vvHRbOLu','android','OTP Login','::ffff:192.168.29.93','okhttp/4.12.0','2026-07-01 22:25:17','2026-06-07 07:24:18','2026-06-01 22:25:17','2026-06-07 07:24:18','2026-06-07 07:24:18'),(55,'34790a72-56f6-44af-bd89-9b0446a5650e',3,'$2b$10$VZfaKR6LuzqDfp.WmQmtQeHVUmXY.7d.2BBxJopIdL7kjPhjZToEC','android','OTP Login','::ffff:192.168.29.93','okhttp/4.12.0','2026-07-01 23:07:59','2026-06-07 07:24:18','2026-06-01 23:07:59','2026-06-07 07:24:18','2026-06-07 07:24:18'),(56,'477e69d4-2651-476d-97e6-70dec5426a61',4,'$2b$10$hhn/hs.KU0bmEW5FmY4Rg.fHE2Kb4OKD68qxaYeMd.bUbNTXVGfc2','android','OTP Login','::1','Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1','2026-07-03 13:33:23','2026-06-07 07:24:18','2026-06-03 13:33:23','2026-06-07 07:24:18','2026-06-07 07:24:18'),(57,'1961603d-24e3-412b-acf6-0b84a462bc88',2,'$2b$10$riMa4hTT2aflmM.sLUfuMeN9H50HMJvQUoZxBFfipzYGs4LsC/wM6','android','OTP Login','::1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-07-03 13:53:08','2026-06-07 07:24:18','2026-06-03 13:53:08','2026-06-07 07:24:18','2026-06-07 07:24:18'),(58,'c7499352-ac4f-4d4d-818a-f43e4d5cbe05',3,'$2b$10$hHgWXgMiYRXUwjLZD.xOt.o/m6qexlegF8xbaD9tPzgZiV/clX9PC','android','OTP Login','::1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-07-06 02:16:53','2026-06-07 07:24:18','2026-06-06 02:16:53','2026-06-07 07:24:18','2026-06-07 07:24:18'),(59,'ec4dd399-d0d8-4823-9437-617a59d8ce2d',4,'$2b$10$efY1gd.4PIW95VJwIz/eCe2Ok0GbI1emQq3akm6wybzjZXd5uzEyC','android','OTP Login','::ffff:192.168.29.93','okhttp/4.12.0','2026-07-08 02:05:04',NULL,'2026-06-08 02:05:04','2026-06-08 02:05:04',NULL),(60,'bc9fc6e7-8108-4b12-95fb-3350fcecf639',4,'$2b$10$UwqNk9IBWSb2D.l1N8BSFuRWgd34NF/VOHK98v/mddM/gssLqgU/G','android','OTP Login','::ffff:192.168.29.93','okhttp/4.12.0','2026-07-08 06:05:17',NULL,'2026-06-08 06:05:17','2026-06-08 06:05:17',NULL),(61,'66bbf0f5-2459-4930-bd6f-7a760825cbe7',3,'$2b$10$4/dAoup4zU2VTho0fChJ3OBmGQ06aLTaj3nU1JsgMiiFhbnKsIZOe','android','OTP Login','::ffff:192.168.29.93','okhttp/4.12.0','2026-07-08 07:02:56',NULL,'2026-06-08 07:02:56','2026-06-08 07:02:56',NULL),(62,'669dd70b-c8eb-4932-8ec1-42b20033619f',3,'$2b$10$OXBz9PQkXt7ZyiCRxQ37suRNbybbUKQLtW5f4e7nwWzgtkBnMsh8O','android','OTP Login','::1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-07-08 07:16:50',NULL,'2026-06-08 07:16:50','2026-06-08 07:16:50',NULL),(63,'c185e09f-0940-43c1-9bb9-8546047ea25d',4,'$2b$10$Ynj/BpdvnFJe63TzRpWGbe5rtb/omfxcsmahPpXMv1XAFgx5SBrju','android','OTP Login','::ffff:192.168.29.93','okhttp/4.12.0','2026-07-09 05:51:54',NULL,'2026-06-09 05:51:54','2026-06-09 05:51:54',NULL),(64,'e933ab6c-b372-4d74-82d1-f9ca6dea084a',3,'$2b$10$ea1iQe.LmbeX6NM0USiV3ufLZGKlTdEU3iUdPWujemLAe/LTz7a0O','android','OTP Login','::ffff:192.168.29.93','okhttp/4.12.0','2026-07-09 05:53:34',NULL,'2026-06-09 05:53:34','2026-06-09 05:53:34',NULL),(65,'3c7524d2-c2d3-4133-b71c-18790ea33273',4,'$2b$10$aGR4ygVjGnnjL7LB2qVsRuCSgdjsXQ/Ngc4FMGA.4RujHtojECPRu','android','OTP Login','::ffff:192.168.29.93','okhttp/4.12.0','2026-07-09 06:40:44',NULL,'2026-06-09 06:40:44','2026-06-09 06:40:44',NULL),(66,'09523dc0-b93e-43bb-8876-1dcd2ae145d0',4,'$2b$10$w.O8Uk.ScxOmoZSJtdQw4.m.PYUAjaVncdIOnRXLtXJb1BMsHbXoC','android','OTP Login','::ffff:192.168.29.93','okhttp/4.12.0','2026-07-09 07:30:45',NULL,'2026-06-09 07:30:45','2026-06-09 07:30:45',NULL),(67,'7a9a25fc-af6d-49ed-bf3d-f87f93882661',4,'$2b$10$A31HfQJoOU97yaWgOHQGyuDdAASya6/XxBAf859BUEOK/R39FrBwu','android','OTP Login','::ffff:192.168.29.93','okhttp/4.12.0','2026-07-09 07:55:44',NULL,'2026-06-09 07:55:44','2026-06-09 07:55:44',NULL),(68,'e7fb52bf-a06c-4fcc-a5ea-75285c5321c8',4,'$2b$10$QSqe/Yv3Y.2I6HajDmSKNuzdUMbHhD/HZvdhbqu88Pdkz6WtsVsiq','android','OTP Login','::1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36','2026-07-14 09:38:20','2026-06-15 09:09:56','2026-06-14 09:38:20','2026-06-15 09:09:56',NULL),(69,'c5699872-83d1-4f9c-8bcf-35c01bc2e649',2,'$2b$10$KB9JuWgQdVOBQ/688SQ4gevUehENeMW6MHtnsg5yYvRfhpkD/Biem','android','OTP Login','::1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36','2026-07-16 22:31:21','2026-06-17 00:14:41','2026-06-16 22:31:21','2026-06-17 00:14:41',NULL),(70,'9fcc2328-d7ae-46da-bbe6-16c125116828',4,'$2b$10$m3U2UsenaOZrSXCQ46/sE.nDZVcBwJ9cyTLjorTrhYv4OT7fIqck.','android','OTP Login','::1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36','2026-07-17 00:15:42',NULL,'2026-06-17 00:15:42','2026-06-17 00:15:42',NULL),(71,'0faf47d8-2318-4dc3-bce6-1ef74715b3e1',4,'$2b$10$NFguO42ud9dnPCU5OudweeoMdyWONf/kKcIaW55jFwiqM4hh9JD66','web','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36','::1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36','2026-07-18 20:47:01',NULL,'2026-06-18 20:47:01','2026-06-18 20:47:01',NULL),(72,'93121653-3a86-4866-a0e9-4b61b072e27f',4,'$2b$10$1AYRBO1E38Y/6n9/Gw9m8eT2KgUfoEc04XQ.YAYN/Amv5ozBengvy','web','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36','::1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36','2026-07-18 20:54:23',NULL,'2026-06-18 20:54:23','2026-06-18 20:54:23',NULL),(73,'7d0842f8-61e5-422e-957d-cc288ff3f9ea',4,'$2b$10$1Z6beWycHkaERaKuVvZRu.NFk0i9C9z0Bd82EJv/kp1kk0DLpm8IK','web','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36','::1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36','2026-07-18 20:56:21','2026-06-18 21:04:08','2026-06-18 20:56:21','2026-06-18 21:04:08',NULL),(74,'2fe8daed-7273-460c-aeb4-3b724ee01b52',4,'$2b$10$Y26eTFYduxD68cVHtryQC.na2n.3AcsgveP7jscKByU389QopUCSW','web','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36','::1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36','2026-07-18 21:14:53','2026-06-18 21:16:28','2026-06-18 21:14:53','2026-06-18 21:16:28',NULL),(75,'99f52463-d648-4dc6-9788-dc4b219c9b02',4,'$2b$10$gJidhVrdXRFX7TZCDmNyWeuO8IGBP4pFSknDfrcWkWeOqs5iQjKcm','web','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36','::1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36','2026-07-18 21:19:17','2026-06-18 21:24:35','2026-06-18 21:19:17','2026-06-18 21:24:35',NULL),(76,'21726fdd-52ca-4467-8757-91725c1ea63e',4,'$2b$10$4lMhhsW4BOadHiPm1j5TDu337VjbH384DeueZHdVdR84fkwLlD62y','web','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36','::1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36','2026-07-18 21:27:55','2026-06-18 21:28:01','2026-06-18 21:27:55','2026-06-18 21:28:01',NULL),(77,'6409e0fc-6d0d-4203-a8f0-6a4434a941b6',4,'$2b$10$uXwPGSExUFdkzJOFgEvUyu8cKr/j5hA3.TYIHnJ7WNnGJgvPIAGBC','web','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36','::1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36','2026-07-18 21:30:41','2026-06-18 21:35:02','2026-06-18 21:30:41','2026-06-18 21:35:02',NULL),(78,'7571ca73-14c5-4e9e-bbfd-37dc3fa3cd84',4,'$2b$10$NBbZpmncQUDVoSuyUr0PbuR4Wxr22WD4kWQl3npAgIb2FDMhm/ErG','web','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36','::1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36','2026-07-19 12:28:12',NULL,'2026-06-19 12:28:12','2026-06-19 12:28:12',NULL),(79,'11d78adc-a985-476c-a48f-15c8e1d468a6',4,'$2b$10$ZA.Zf3LnazmkWx1sSsUnH.q6p02fFXdz01kkURqkFrpghV4OE/68G','web','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36','::1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36','2026-07-21 18:11:09','2026-06-22 09:20:51','2026-06-21 18:11:09','2026-06-22 09:20:51',NULL),(80,'e522b1c9-8825-4bee-a553-ed4a5ab9ee20',3,'$2b$10$Y2e1LRh6VuXQyc920G5u1uxjpS8Y32dm1xwoWwhsP8VxZEgeX.1g2','web','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36','::1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36','2026-07-22 09:21:34','2026-06-23 11:36:28','2026-06-22 09:21:34','2026-06-23 11:36:28',NULL),(81,'6bc96a6f-7d2c-46d6-a8c7-226f02ed63d4',4,'$2b$10$rLXQSeWWKISsXzVKd11ewOonyv7kPPllfLwIxjZzTDBippZgHQ0vK','web','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36','::1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36','2026-07-23 11:47:03','2026-06-23 11:48:47','2026-06-23 11:47:03','2026-06-23 11:48:47',NULL),(82,'7bc79365-f9f7-4d8a-bb35-765b3f1f5dd6',3,'$2b$10$H/nqe9T1Vk1zxrvvYWthP.JWKDz88ekT4RMOqEl82x2/l5MlXaRlq','web','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36','::1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36','2026-07-23 11:49:25','2026-06-23 11:51:42','2026-06-23 11:49:25','2026-06-23 11:51:42',NULL),(83,'9f48248f-161a-40b7-ac88-2282aece8e75',4,'$2b$10$y5n6Fn8E6UJTU.HoVmqG5.H6zKKSeaGbEXoL2/vjzKBDY4vf6uSaa','web','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36','::1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36','2026-07-23 11:52:43','2026-06-23 12:00:21','2026-06-23 11:52:43','2026-06-23 12:00:21',NULL),(84,'edce96ea-bdf5-4495-9f4d-df1adfa490d0',3,'$2b$10$CnBeShhU61f0Hf1UzEgfWe8vkhThcbK7gUx0Bwv3gCtVnPlBIopLy','web','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36','::1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36','2026-07-23 12:00:59',NULL,'2026-06-23 12:00:59','2026-06-23 12:00:59',NULL);
/*!40000 ALTER TABLE `auth_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart_items`
--

DROP TABLE IF EXISTS `cart_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` char(36) NOT NULL,
  `cart_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  UNIQUE KEY `unique_cart_product` (`cart_id`,`product_id`),
  KEY `fk_cart_items_product` (`product_id`),
  CONSTRAINT `fk_cart_items_cart` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_cart_items_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_items`
--

LOCK TABLES `cart_items` WRITE;
/*!40000 ALTER TABLE `cart_items` DISABLE KEYS */;
INSERT INTO `cart_items` VALUES (1,'964874ae-39c5-469b-bf07-0da1f49bf942',2,2,1,'2026-06-23 11:47:21','2026-06-23 11:48:11','2026-06-23 11:48:11');
/*!40000 ALTER TABLE `cart_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `carts`
--

DROP TABLE IF EXISTS `carts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` char(36) NOT NULL,
  `user_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  KEY `fk_carts_user` (`user_id`),
  CONSTRAINT `fk_carts_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carts`
--

LOCK TABLES `carts` WRITE;
/*!40000 ALTER TABLE `carts` DISABLE KEYS */;
INSERT INTO `carts` VALUES (1,'d828be03-4e4b-4807-a7de-92e4a8150889',3,'2026-06-23 09:52:51','2026-06-23 09:52:51',NULL),(2,'9c8cb81b-6ab5-48d8-a833-ed0b62de24f4',4,'2026-06-23 11:47:08','2026-06-23 11:47:08',NULL);
/*!40000 ALTER TABLE `carts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `centres`
--

DROP TABLE IF EXISTS `centres`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `centres` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text,
  `address` text,
  `city` varchar(100) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `logo_url` text,
  `banner_url` text,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `is_mother_temple` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  UNIQUE KEY `unique_centres_uuid` (`uuid`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `centres`
--

LOCK TABLES `centres` WRITE;
/*!40000 ALTER TABLE `centres` DISABLE KEYS */;
INSERT INTO `centres` VALUES (1,'0aa3f362-57a2-11f1-8ab1-5f0a17545fdf','ISKCON Ahmedabad','iskcon-ahmedabad','A main iskcon centre in satelitte ahmedabad (mother temple)','Satellite Road, Sarkhej - Gandhinagar Hwy, Ahmedabad, Gujarat 380059','Ahmedabad','Gujarat','India','+91 98798 79456','iskconamd@gmail.com','https://iskconahmedabad.com/',NULL,NULL,23.02700000,72.50630000,1,1,'2026-05-24 18:43:06','2026-06-16 23:24:08',NULL),(2,'0aa3f88a-57a2-11f1-8ab1-5f0a17545fdf','ISKCON Kathwada','iskcon-kathwada','A iskcon centre in kathwada ahmedabad','Hare Krishna Gaushala, Kathwada Bhuvaldi Rd, Chunarvas Gali, Kathwada, Gujarat 382430','Ahmedabad','Gujarat','India','+91 70374 91878','official@iskconkathwada.org','https://iskconkathwada.org/',NULL,NULL,23.04648000,72.69164000,1,0,'2026-05-24 18:43:06','2026-06-16 23:13:06',NULL),(4,'b0916646-b7ca-4fd1-8b63-62fa34fb8c6b','ISKCON Chandkheda','iskon-chandkheda','A iskcon centre in chandkheda ahmedabad ',NULL,'Ahmedabad','Gujarat','India',NULL,NULL,NULL,NULL,NULL,23.02700000,72.50630000,1,0,'2026-06-16 23:06:35','2026-06-16 23:20:40',NULL);
/*!40000 ALTER TABLE `centres` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contact_messages`
--

DROP TABLE IF EXISTS `contact_messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contact_messages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `message` text NOT NULL,
  `status` enum('new','read','replied','closed') DEFAULT 'new',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contact_messages`
--

LOCK TABLES `contact_messages` WRITE;
/*!40000 ALTER TABLE `contact_messages` DISABLE KEYS */;
/*!40000 ALTER TABLE `contact_messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `content_bookmarks`
--

DROP TABLE IF EXISTS `content_bookmarks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `content_bookmarks` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` char(36) NOT NULL,
  `user_id` int NOT NULL,
  `post_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  UNIQUE KEY `unique_user_bookmark` (`user_id`,`post_id`),
  KEY `post_id` (`post_id`),
  CONSTRAINT `content_bookmarks_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `content_bookmarks_ibfk_2` FOREIGN KEY (`post_id`) REFERENCES `content_posts` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `content_bookmarks`
--

LOCK TABLES `content_bookmarks` WRITE;
/*!40000 ALTER TABLE `content_bookmarks` DISABLE KEYS */;
/*!40000 ALTER TABLE `content_bookmarks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `content_categories`
--

DROP TABLE IF EXISTS `content_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `content_categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `content_categories`
--

LOCK TABLES `content_categories` WRITE;
/*!40000 ALTER TABLE `content_categories` DISABLE KEYS */;
/*!40000 ALTER TABLE `content_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `content_comments`
--

DROP TABLE IF EXISTS `content_comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `content_comments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` char(36) NOT NULL,
  `post_id` int NOT NULL,
  `user_id` int NOT NULL,
  `parent_comment_id` int DEFAULT NULL,
  `comment` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  KEY `fk_content_comments_post` (`post_id`),
  KEY `fk_content_comments_user` (`user_id`),
  KEY `fk_content_comments_parent` (`parent_comment_id`),
  CONSTRAINT `fk_content_comments_parent` FOREIGN KEY (`parent_comment_id`) REFERENCES `content_comments` (`id`),
  CONSTRAINT `fk_content_comments_post` FOREIGN KEY (`post_id`) REFERENCES `content_posts` (`id`),
  CONSTRAINT `fk_content_comments_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `content_comments`
--

LOCK TABLES `content_comments` WRITE;
/*!40000 ALTER TABLE `content_comments` DISABLE KEYS */;
/*!40000 ALTER TABLE `content_comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `content_likes`
--

DROP TABLE IF EXISTS `content_likes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `content_likes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` char(36) NOT NULL,
  `user_id` int NOT NULL,
  `post_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  UNIQUE KEY `unique_user_like` (`user_id`,`post_id`),
  KEY `post_id` (`post_id`),
  CONSTRAINT `content_likes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `content_likes_ibfk_2` FOREIGN KEY (`post_id`) REFERENCES `content_posts` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `content_likes`
--

LOCK TABLES `content_likes` WRITE;
/*!40000 ALTER TABLE `content_likes` DISABLE KEYS */;
/*!40000 ALTER TABLE `content_likes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `content_media`
--

DROP TABLE IF EXISTS `content_media`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `content_media` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` char(36) NOT NULL,
  `post_id` int NOT NULL,
  `media_type` enum('image','video','pdf','audio') DEFAULT 'image',
  `file_url` text NOT NULL,
  `thumbnail_url` text,
  `title` varchar(255) DEFAULT NULL,
  `sort_order` int DEFAULT '1',
  `is_featured` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  KEY `post_id` (`post_id`),
  CONSTRAINT `content_media_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `content_posts` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `content_media`
--

LOCK TABLES `content_media` WRITE;
/*!40000 ALTER TABLE `content_media` DISABLE KEYS */;
INSERT INTO `content_media` VALUES (1,'e645352e-dd7a-4797-b336-8d5eee46cd1f',1,'image','https://i.pinimg.com/1200x/0d/44/f0/0d44f074ac900fb2ee62a8052cda6748.jpg','https://i.pinimg.com/1200x/0d/44/f0/0d44f074ac900fb2ee62a8052cda6748.jpg','krishna',1,1,'2026-05-30 00:24:17','2026-05-30 00:24:17',NULL),(2,'beef2690-2e00-4f0f-99d6-a956803ab500',2,'image','https://unsplash.com/photos/jbHJXI2Vi5Q/download?force=true&w=1920','https://unsplash.com/photos/jbHJXI2Vi5Q/download?force=true&w=1920','krishna',1,1,'2026-05-30 00:51:55','2026-05-30 00:51:55',NULL),(3,'36eb21b9-5feb-4763-b7d5-52ae604a4f15',3,'image','https://unsplash.com/photos/kYxgm42SQso/download?force=true&w=2400','demo','demo',1,0,'2026-06-03 09:36:34','2026-06-03 09:36:34',NULL);
/*!40000 ALTER TABLE `content_media` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `content_payments`
--

DROP TABLE IF EXISTS `content_payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `content_payments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` char(36) NOT NULL,
  `user_id` int NOT NULL,
  `subscription_id` int DEFAULT NULL,
  `subscription_plan_id` int DEFAULT NULL,
  `post_id` int DEFAULT NULL,
  `payment_type` enum('one_time','subscription') DEFAULT 'one_time',
  `amount` decimal(10,2) DEFAULT NULL,
  `currency` varchar(10) DEFAULT 'INR',
  `provider` varchar(50) DEFAULT NULL,
  `provider_order_id` varchar(255) DEFAULT NULL,
  `provider_payment_id` varchar(255) DEFAULT NULL,
  `provider_refund_id` varchar(255) DEFAULT NULL,
  `provider_signature` text,
  `raw_response` json DEFAULT NULL,
  `failed_reason` text,
  `transaction_id` varchar(255) DEFAULT NULL,
  `payment_status` enum('pending','success','failed','refund_pending','refunded','refund_failed') NOT NULL DEFAULT 'pending',
  `paid_at` datetime DEFAULT NULL,
  `refunded_at` datetime DEFAULT NULL,
  `refund_reason` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  KEY `user_id` (`user_id`),
  KEY `subscription_id` (`subscription_id`),
  KEY `fk_content_payments_subscription_plan` (`subscription_plan_id`),
  CONSTRAINT `content_payments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `content_payments_ibfk_2` FOREIGN KEY (`subscription_id`) REFERENCES `content_subscriptions` (`id`),
  CONSTRAINT `fk_content_payments_subscription_plan` FOREIGN KEY (`subscription_plan_id`) REFERENCES `content_subscription_plans` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `content_payments`
--

LOCK TABLES `content_payments` WRITE;
/*!40000 ALTER TABLE `content_payments` DISABLE KEYS */;
INSERT INTO `content_payments` VALUES (1,'925ec981-7b08-460d-aa8d-705dc1e8e26d',3,NULL,NULL,2,'one_time',299.00,'INR','razorpay','order_SvtFqrMCMDuWJK','pay_SvtFz1jvEMuCCa',NULL,'7ff7565ab446259c2f73f2f8143304f4f26cf44b8958bff650a55963d7d3c3c4','{\"payment_uuid\": \"925ec981-7b08-460d-aa8d-705dc1e8e26d\", \"razorpay_order_id\": \"order_SvtFqrMCMDuWJK\", \"razorpay_signature\": \"7ff7565ab446259c2f73f2f8143304f4f26cf44b8958bff650a55963d7d3c3c4\", \"razorpay_payment_id\": \"pay_SvtFz1jvEMuCCa\"}',NULL,'pay_SvtFz1jvEMuCCa','success','2026-05-31 07:33:44',NULL,NULL,'2026-05-31 07:33:18','2026-05-31 07:33:44',NULL),(16,'ab1685b5-9873-49ef-91ff-c7e951b7f5bb',3,1,NULL,NULL,'subscription',299.00,'INR','razorpay','order_SwCWO9fGPKbcjB','pay_SwCWXbtZ4gYq3W',NULL,'3fc67cb611dc48d488e726285a558539a8a90750d36030f04b7cc84aa02b97a1','{\"payment_uuid\": \"ab1685b5-9873-49ef-91ff-c7e951b7f5bb\", \"razorpay_order_id\": \"order_SwCWO9fGPKbcjB\", \"razorpay_signature\": \"3fc67cb611dc48d488e726285a558539a8a90750d36030f04b7cc84aa02b97a1\", \"razorpay_payment_id\": \"pay_SwCWXbtZ4gYq3W\"}',NULL,'pay_SwCWXbtZ4gYq3W','success','2026-06-01 02:24:37',NULL,NULL,'2026-06-01 02:24:08','2026-06-01 02:24:37',NULL),(17,'1a57fd17-e466-4593-ac8c-df5a94bf8caa',4,NULL,1,NULL,'subscription',299.00,'INR','razorpay','order_T1qdMaklawZRb3',NULL,NULL,NULL,'{\"id\": \"order_T1qdMaklawZRb3\", \"notes\": {\"user_id\": \"4\", \"plan_uuid\": \"b041f744-5cbe-11f1-91b3-81997ca2b9b7\", \"payment_type\": \"subscription\"}, \"amount\": 29900, \"entity\": \"order\", \"status\": \"created\", \"receipt\": \"SUB-1-1781513609604\", \"attempts\": 0, \"currency\": \"INR\", \"offer_id\": null, \"amount_due\": 29900, \"created_at\": 1781513609, \"amount_paid\": 0}',NULL,NULL,'pending',NULL,NULL,NULL,'2026-06-15 08:53:29','2026-06-15 08:53:29',NULL),(18,'2ce0164a-7fb9-4486-b281-651d430a7582',4,NULL,2,NULL,'subscription',2999.00,'INR','razorpay','order_T1qqzwXuZVUknE',NULL,NULL,NULL,'{\"id\": \"order_T1qqzwXuZVUknE\", \"notes\": {\"user_id\": \"4\", \"plan_uuid\": \"b042252a-5cbe-11f1-91b3-81997ca2b9b7\", \"payment_type\": \"subscription\"}, \"amount\": 299900, \"entity\": \"order\", \"status\": \"created\", \"receipt\": \"SUB-2-1781514384113\", \"attempts\": 0, \"currency\": \"INR\", \"offer_id\": null, \"amount_due\": 299900, \"created_at\": 1781514384, \"amount_paid\": 0}',NULL,NULL,'pending',NULL,NULL,NULL,'2026-06-15 09:06:24','2026-06-15 09:06:24',NULL),(19,'9cc6e0ee-0c43-40e0-8072-37e9c4e3939a',4,2,1,NULL,'subscription',299.00,'INR','razorpay','order_T3EfN5TqPxV1aO','pay_T3EffDtVj7HHvf',NULL,'765b9acf4c6a41d6fecbf5d052010343c0d801e4def94155ce887e7be69d6a49','{\"payment_uuid\": \"9cc6e0ee-0c43-40e0-8072-37e9c4e3939a\", \"razorpay_order_id\": \"order_T3EfN5TqPxV1aO\", \"razorpay_signature\": \"765b9acf4c6a41d6fecbf5d052010343c0d801e4def94155ce887e7be69d6a49\", \"razorpay_payment_id\": \"pay_T3EffDtVj7HHvf\"}',NULL,'pay_T3EffDtVj7HHvf','success','2026-06-18 21:03:34',NULL,NULL,'2026-06-18 21:03:02','2026-06-18 21:03:34',NULL);
/*!40000 ALTER TABLE `content_payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `content_post_categories`
--

DROP TABLE IF EXISTS `content_post_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `content_post_categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` char(36) NOT NULL,
  `post_id` int NOT NULL,
  `category_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  UNIQUE KEY `unique_post_category` (`post_id`,`category_id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `content_post_categories_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `content_posts` (`id`),
  CONSTRAINT `content_post_categories_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `content_categories` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `content_post_categories`
--

LOCK TABLES `content_post_categories` WRITE;
/*!40000 ALTER TABLE `content_post_categories` DISABLE KEYS */;
/*!40000 ALTER TABLE `content_post_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `content_post_purchases`
--

DROP TABLE IF EXISTS `content_post_purchases`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `content_post_purchases` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` char(36) NOT NULL,
  `user_id` int NOT NULL,
  `post_id` int NOT NULL,
  `payment_id` int DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `currency` varchar(10) DEFAULT 'INR',
  `access_status` enum('active','refunded','revoked') DEFAULT 'active',
  `purchased_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  UNIQUE KEY `unique_user_post_purchase` (`user_id`,`post_id`),
  KEY `post_id` (`post_id`),
  KEY `payment_id` (`payment_id`),
  CONSTRAINT `content_post_purchases_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `content_post_purchases_ibfk_2` FOREIGN KEY (`post_id`) REFERENCES `content_posts` (`id`),
  CONSTRAINT `content_post_purchases_ibfk_3` FOREIGN KEY (`payment_id`) REFERENCES `content_payments` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `content_post_purchases`
--

LOCK TABLES `content_post_purchases` WRITE;
/*!40000 ALTER TABLE `content_post_purchases` DISABLE KEYS */;
/*!40000 ALTER TABLE `content_post_purchases` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `content_post_tags`
--

DROP TABLE IF EXISTS `content_post_tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `content_post_tags` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` char(36) NOT NULL,
  `post_id` int NOT NULL,
  `tag_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  UNIQUE KEY `unique_post_tag` (`post_id`,`tag_id`),
  KEY `tag_id` (`tag_id`),
  CONSTRAINT `content_post_tags_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `content_posts` (`id`),
  CONSTRAINT `content_post_tags_ibfk_2` FOREIGN KEY (`tag_id`) REFERENCES `content_tags` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `content_post_tags`
--

LOCK TABLES `content_post_tags` WRITE;
/*!40000 ALTER TABLE `content_post_tags` DISABLE KEYS */;
/*!40000 ALTER TABLE `content_post_tags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `content_posts`
--

DROP TABLE IF EXISTS `content_posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `content_posts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` char(36) NOT NULL,
  `author_id` int NOT NULL,
  `title` varchar(500) NOT NULL,
  `slug` varchar(500) DEFAULT NULL,
  `type` enum('journal','newsletter','article','announcement') NOT NULL,
  `visibility` enum('free','paid') DEFAULT 'free',
  `excerpt` text,
  `content` longtext NOT NULL,
  `cover_image_url` text,
  `status` enum('draft','published','archived') DEFAULT 'draft',
  `published_at` datetime DEFAULT NULL,
  `view_count` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `access_type` enum('free','subscription','one_time','subscription_or_one_time') DEFAULT 'free',
  `target_level_id` int DEFAULT NULL,
  `price_amount` decimal(10,2) DEFAULT '0.00',
  `currency` varchar(10) DEFAULT 'INR',
  `thumbnail_url` text,
  `banner_image_url` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  UNIQUE KEY `slug` (`slug`),
  KEY `author_id` (`author_id`),
  KEY `fk_content_posts_target_level` (`target_level_id`),
  CONSTRAINT `content_posts_ibfk_1` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_content_posts_target_level` FOREIGN KEY (`target_level_id`) REFERENCES `progress_levels` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `content_posts`
--

LOCK TABLES `content_posts` WRITE;
/*!40000 ALTER TABLE `content_posts` DISABLE KEYS */;
INSERT INTO `content_posts` VALUES (1,'ad3f2094-4d4c-434b-8b03-769d29641b1c',3,'Perfect Questions and Perfect Answer','who-is-krishna','newsletter','free','<h2><strong>Who is Kṛṣṇa? The Source of All Answers</strong></h2><p><i>Exploring the foundational dialogue between Śrīla Prabhupāda and Bob Cohen — a young American seeker\'s encounter with eternal wisdom.</i><br>&nbsp;</p>','<p><strong>Content</strong></p><p><strong>Chapter 1 — \"Meeting in Māyāpur\"</strong></p><p><i>Perfect Questions, Perfect Answers</i> opens in February 1972 at ISKCON\'s spiritual headquarters in Māyāpur, West Bengal. A young American Peace Corps volunteer named Bob Cohen arrives to meet His Divine Grace A. C. Bhaktivedanta Swami Prabhupāda — carrying within him the genuine curiosity of an earnest seeker.</p><p>Bob\'s questions are not academic exercises. They arise from real confusion about identity, the nature of God, and how to live a meaningful life in a world full of suffering and distraction. Prabhupāda recognizes immediately that these are perfect questions — not because they are intellectually sophisticated, but because they come from a pure and humble heart.</p><p>Chapter 1 establishes the tone of the entire book: a warm, direct, and utterly honest exchange. Prabhupāda explains that Kṛṣṇa is not merely a Hindu deity but the original Supreme Personality of Godhead — the source of all existence, all knowledge, and all bliss. He introduces the foundational concept that the soul is eternal, that it has no birth or death, and that its true nature is to be in loving relationship with the Divine.</p><p>What makes this opening chapter exceptional is Prabhupāda\'s simplicity. He does not overwhelm Bob with Sanskrit scholarship. He meets him where he is — in ordinary human language — and draws a straight line between Bob\'s felt questions and the Vedic answers waiting in the Bhagavad-gītā. The conversation flows like a cool river: clear, purposeful, and refreshing to anyone who approaches it sincerely.</p><p>As the chapter closes, Bob begins to sense that the questions he has carried for years are not obstacles to wisdom — they are the very doors through which wisdom enters. Prabhupāda\'s opening invitation is timeless: ask sincerely, listen humbly, and Kṛṣṇa will provide perfect answers.</p>','https://i.pinimg.com/1200x/34/c0/32/34c0329bfefbbd8aac0d5a04858c9639.jpg','published','2026-05-30 00:24:17',44,'2026-05-30 00:24:17','2026-06-08 06:10:54',NULL,'free',1,0.00,'INR','https://i.pinimg.com/736x/f7/69/2d/f7692d3c5ba33c037842778745ed0bcf.jpg','https://i.pinimg.com/1200x/0d/44/f0/0d44f074ac900fb2ee62a8052cda6748.jpg'),(2,'1bcc4b19-cd2e-4200-9e66-d049070ce142',3,'Śrīmad Bhāgavatam — Canto 1: Creation · A journal of the Supreme Truth','srimad-bhagvatam-canto-1-chapter-1','journal','paid','<p><i><strong>The Śrīmad Bhāgavatam opens with the most important question a human being can ask — what is the supreme good? Canto 1 lays the foundation: who is the Supreme Lord, how did creation arise, and why does devotion alone lead to liberation? This journal traces the wisdom of Vyāsadeva and the dialogue of the sages at Naimiṣāraṇya, where eternal truths were first spoken for the age of Kali.</strong></i></p>','<h2><strong>Śrīmad Bhāgavatam — Canto 1, Chapter 1: Questions by the Sages</strong></h2><h2><strong>Opening invocation</strong></h2><p><strong>ॐ नमो भगवते वासुदेवाय</strong></p><p>I offer my respectful obeisances unto Lord Vāsudeva, the Supreme Personality of Godhead — the source of all creation, the shelter of all living beings, and the ultimate goal of all sincere seekers.</p><h2>Introduction — a scripture born from longing</h2><p>The Śrīmad Bhāgavatam is not simply a religious text. It is a living transmission — the distilled essence of all Vedic wisdom, compiled by the sage Vyāsadeva at the height of his realization, and offered to the world as the greatest gift of the age of Kali. It is described in the tradition as the ripened fruit of the wish-fulfilling tree of all Vedic literature. And like any ripe fruit, it is sweet from the very first taste.</p><p><strong>Canto 1, Chapter 1 is that first taste.</strong></p><p>The chapter does not open with mythology or cosmology. It opens with a question — and not just any question, but the most fundamental question a human being can ever bring before a teacher: what is the supreme good? What, above all things, should a person hear, understand, and practice in this life?</p><p>Everything that follows in the twelve cantos of the Bhāgavatam is, in essence, the answer to that question.</p><h2>The setting — Naimiṣāraṇya, the forest of the sages</h2><p>The events of this chapter take place at Naimiṣāraṇya, a sacred forest considered one of the most powerful pilgrimage sites in the Vedic tradition. The name itself carries meaning — it is the place where the wheel of time was said to have been slowed, where the influence of the material world grows thin, and where spiritual practice bears fruit with unusual swiftness.</p><p>Thousands of great sages had assembled here, not for a brief gathering, but for a thousand-year sacrifice dedicated to the welfare of all living beings. This detail is significant. These were not ordinary religious practitioners performing ritual for personal benefit. They were saints of the highest order, absorbed in the service of all humanity, aware that a great darkness — the age of Kali — had already begun to descend upon the world.</p><p>Kali-yuga, the age of quarrel and hypocrisy, had commenced the moment Lord Kṛṣṇa departed from this world. The sages at Naimiṣāraṇya felt the weight of this transition. They knew that the disciplines of previous ages — the long penances of Satya-yuga, the elaborate sacrifices of Tretā-yuga, the rigorous temple worship of Dvāpara-yuga — would be nearly impossible for the short-lived, easily distracted, materially entangled people of Kali. They needed to discover what spiritual practice was most effective, most accessible, and most merciful for this age.</p><p>Into this assembly came Sūta Gosvāmī — a great devotee, a disciple of the realized sage Śukadeva Gosvāmī, and a man who carried within him the treasure of the entire Bhāgavatam as he had personally heard it spoken. The sages welcomed him with the respect due to one who carries divine wisdom, and Śaunaka Ṛṣi — the eldest and most learned among them — rose to address him with the questions that would open one of the most profound scriptures ever given to the world.</p><h2><strong>The character of Śaunaka Ṛṣi</strong></h2><p>Before considering the questions themselves, it is worth pausing to understand who asks them. Śaunaka Ṛṣi was not a novice seeker. He was one of the foremost sages of the Vedic tradition, learned in all branches of sacred knowledge, and deeply committed to the welfare of all living beings. His questions do not arise from ignorance or confusion. They arise from wisdom — from the recognition that the most learned person is the one who understands what truly matters and is willing to ask for it directly.</p><p>This models something important for every reader of the Bhāgavatam. The text does not reward cleverness or intellectual bravado. It opens itself to sincere inquiry, humble reception, and genuine desire to understand the highest truth. Śaunaka is the eternal example of the ideal student — not because he knew nothing, but because he knew enough to understand what he still needed to receive.</p><h2>The six questions</h2><p>Śaunaka places six questions before Sūta Gosvāmī. Each question is precise, purposeful, and points toward a different dimension of the supreme truth. Together they form a complete philosophical architecture that the Bhāgavatam will spend twelve cantos answering.</p><h3><strong>Question one — what is the supreme good for all people?</strong></h3><p>This is the central question, and it is asked with a universality that sets it apart from all ordinary religious inquiry. Śaunaka does not ask what is good for the brāhmaṇas, or for the renunciants, or for the people of this particular region or tradition. He asks what is good for all people — sarva-lokasya — in all conditions, at all times.</p><p>The word \"supreme\" is equally significant. He is not interested in relative goods — health, prosperity, virtue, even heaven. He wants to know the absolute good, the one thing that, if understood and practiced, makes all other things secondary.</p><p>This question acknowledges the difficulty of the human situation. We are surrounded by teachers, scriptures, philosophies, and traditions — each offering a path, each promising a destination. In the face of such abundance of advice, the deepest confusion is not the absence of answers but the inability to identify which answer is truly highest. Śaunaka, speaking for all seekers across all ages, cuts through every secondary question and goes directly to the source.</p><h3><strong>Question two — what did the previous sages discuss?</strong></h3><p>This question is a recognition of tradition. Truth, in the Vedic understanding, is not invented — it is received. It flows from the Lord through the disciplic succession, from teacher to student, across countless generations. Śaunaka wants to know what the great sages before him, in their own assemblies of wisdom, concluded was most worth speaking about and hearing.</p><p>This reflects a profound epistemological humility. The greatest thinkers in the tradition did not arrive at truth by sitting alone and reasoning their way upward. They received it from those who had received it before them. By asking what the previous sages discussed, Śaunaka is honoring that chain — and positioning the present assembly within it.</p><h3><strong>Question three — the avatāras and their purposes</strong></h3><p>The question of divine incarnation is one of the most characteristic features of the Vaiṣṇava tradition and of the Bhāgavatam in particular. The Lord is not distant or indifferent. He descends into this world — in innumerable forms, across innumerable ages — out of love for His devotees and concern for the welfare of creation.</p><p>Śaunaka wants to understand the purpose behind these descents. Why does the Absolute take form? What does each avatāra accomplish? What does the pattern of divine incarnation reveal about the nature of the Lord and His relationship to the world?</p><p>This question will be answered in extraordinary depth across the Bhāgavatam, most fully in the tenth canto\'s account of Lord Kṛṣṇa — but its seeds are planted here, at the very beginning.</p><h3><strong>Question four — where has dharma gone?</strong></h3><p>This question carries a quality of grief. The sages are aware that Lord Kṛṣṇa has left this world. With Him, it seems, the highest expressions of dharma — of righteous living, of divine love made visible — have also withdrawn. The world has entered a darker phase. The question is: where does dharma reside now? Is it lost? Or does it persist somewhere, in some form?</p><p>The answer the Bhāgavatam will provide is deeply consoling: the Lord is never truly absent. He remains fully present in His holy name, in the scripture that glorifies Him, in the pure devotee who loves Him. Dharma has not disappeared — it has changed form, taking shelter in the hearts of those who continue to hear and chant the glories of the Supreme.</p><h3><strong>Question five — why did Śukadeva Gosvāmī study the Bhāgavatam if he was already liberated?</strong></h3><p>This is perhaps the most philosophically striking of the six questions, and the one that reveals most clearly what makes the Bhāgavatam unique among all scriptures.</p><p>Śukadeva Gosvāmī was a paramahaṁsa — a swan among saints, a soul already fully liberated, beyond all material bondage, resting in the direct experience of the impersonal Brahman. He had no need of further practice, no karma to resolve, no ignorance to remove. He was already free.</p><p>Why, then, did he take up the study and recitation of the Bhāgavatam?</p><p>The answer points to something the Bhāgavatam considers more precious than liberation itself: devotional love. The sweetness of hearing and speaking about the personal, beautiful, infinitely loving form of the Supreme Lord is not merely a path to freedom — it is a joy that even the liberated soul cannot resist. The Bhāgavatam describes this quality using the Sanskrit word rasa — the divine taste, the flavor of pure love that makes the soul want to remain in the presence of the Lord not because it must, but because it wants to. Because there is nothing sweeter.</p><p>This teaching revolutionizes the entire framework of spiritual aspiration. The goal is not merely to escape the cycle of birth and death. The goal is love — the love of the soul for the Supreme Person who is the source of its very existence.</p><h3><strong>Question six — please tell us all that you have heard</strong></h3><p>The final question is at once the simplest and the most expansive. Having laid out the five preceding inquiries, Śaunaka simply says: please share with us everything you have received from Śukadeva Gosvāmī. This is the model of authentic spiritual transmission — the student creates the space, the teacher fills it, and the knowledge flows not from argument but from grace.</p><h2>Sūta Gosvāmī\'s response — the supreme dharma</h2><p>Before answering any individual question, Sūta does something that defines the entire character of the Bhāgavatam\'s teaching. He offers his obeisances — first to the assembled sages, then to Śukadeva Gosvāmī, then to Vyāsadeva, and ultimately to Lord Kṛṣṇa Himself. Every word he speaks will be drawn from that chain of transmission, not from his own speculation.</p><p>Then he gives the foundational answer to the first and most important question.</p><p>The supreme dharma — the highest occupation for all of humanity — is that which awakens loving devotional service to the Lord, without any ulterior motive, and through which the living being becomes fully satisfied at the deepest level of its existence.</p><p>This dharma must be free of material motivation. It must not be practiced for the acquisition of wealth, pleasure, fame, or even spiritual power. It must not even be practiced for the sake of liberation — for if the devotee has his eye on liberation as the reward, then devotion itself has become a transaction, a means to an end, rather than the supreme end in itself.</p><p>This dharma must be continuous. It is not a Sunday practice or a seasonal observance. It is a steady stream of consciousness oriented toward the Lord — flowing through the activities of hearing, chanting, remembering, serving, and surrendering.</p><p>And this dharma produces its own inner sufficiency. The devotee does not look to the world to provide the satisfaction that the heart craves. That satisfaction arises naturally and abundantly from within the practice itself — from the sweetness of the Lord\'s name, from the beauty of His stories, from the warmth of His presence in the surrendered heart.</p><h2><strong>The origin of the Bhāgavatam — Vyāsadeva\'s divine dissatisfaction</strong></h2><p>The chapter also gives us the origin story of the scripture itself, and it is one of the most illuminating accounts in the entire Vedic tradition.</p><p>Vyāsadeva was the most accomplished sage of his age. He had divided the single Veda into four, composed the eighteen major Purāṇas, written the vast Mahābhārata — including the Bhagavad-gītā — and established the system of Vedānta philosophy. By any measure, his contribution to human spiritual knowledge was immeasurable.</p><p>And yet, sitting beside the Sarasvatī River at his hermitage in Śamyāprāsa, Vyāsadeva was not at peace.</p><p>His teacher Nārada Muni arrived, perceived the dissatisfaction, and named its cause with surgical precision. All of Vyāsadeva\'s works, however vast and profound, had treated the Lord\'s glories incompletely — embedded within accounts of karma, philosophy, history, and cosmology, but never as the sole, undiluted subject. The result was that readers and listeners could drink deeply of knowledge and still find themselves thirsty for something more. The direct, personal, overwhelming glorification of the Supreme Lord had not yet been given to the world in pure, undiluted form.</p><p>Nārada instructed Vyāsadeva: compose a work devoted entirely to the transcendental qualities, pastimes, and devotional service of the Supreme Lord. Let there be no compromise, no dilution, no mixing with secondary subject matter. Let the Lord be the beginning, the middle, and the end.</p><p>Vyāsadeva sat in deep meditation, entered into direct vision of the Supreme Person in the fullness of His divine nature, and composed the Śrīmad Bhāgavatam. Upon completing it, the longing in his heart was satisfied at last — not because he had accomplished something literary, but because he had given everything he had to the glorification of the one he loved.</p><p>This is the spirit in which the Bhāgavatam must be received — not as a text to be studied and analyzed, but as a transmission of love, received with love, in the presence of those who love.</p><h2>The gift of Kali-yuga — hearing and chanting</h2><p>One of the most remarkable teachings embedded in this first chapter is the revaluation of the present age. Kali-yuga is generally described as the worst of the four ages — an era of degraded values, shortened lives, weakened discipline, and spiritual confusion. And indeed, many of the qualities that made the practices of earlier ages possible — physical endurance, sharp intelligence, long life, stable society — are largely absent in Kali.</p><p>But the Bhāgavatam turns this apparent tragedy into an unexpected mercy.</p><p>Because the elaborate practices of other ages are not possible here, the Lord has made available the simplest, most powerful, most universally accessible spiritual practice ever given: the hearing and chanting of His holy names and glories. This one practice — śravaṇam and kīrtanam — contains within it the full power of all the rituals, all the penances, all the yogic disciplines of every previous age. It requires no special birth, no elaborate preparation, no material qualification. It requires only sincerity.</p><p>The sages at Naimiṣāraṇya understood this. They had assembled precisely to understand what the age of Kali required — and the answer Sūta Gosvāmī carries to them is the Bhāgavatam itself: a scripture designed not to be performed or analyzed, but to be heard, spoken, and absorbed into the heart.</p><h2>What this chapter asks of the reader</h2><p>Chapter 1 of Canto 1 does not deliver the vast cosmic narratives, the detailed theology of creation, or the extraordinary devotional stories that fill the cantos ahead. It does something more essential: it creates the conditions for genuine reception.</p><p>It establishes the right setting — a community of sincere seekers, gathered not for debate but for mutual upliftment.</p><p>It models the right questions — arising not from intellectual pride but from genuine care for the welfare of all.</p><p>It presents the right teacher — one who speaks only what he has received from a realized source, not from personal speculation.</p><p>And it reveals the right disposition — humble, attentive, unhurried, and hungry not for information but for transformation.</p><p>Every reader who comes to the Bhāgavatam is, in a sense, taking a seat in that assembly at Naimiṣāraṇya. The sages\' questions are our questions. Sūta\'s answers are meant for us. The scripture promises that whoever approaches it with sincerity and openness will find, as Vyāsadeva found, that the deepest longing of the human heart — the hunger for something infinitely beautiful, infinitely loving, and infinitely true — is fully, completely, finally satisfied.</p><h2>Key teachings from Canto 1, Chapter 1</h2><p>The highest dharma is unmotivated, uninterrupted devotional service to the Supreme Lord — free of any desire for material or even spiritual reward.</p><p>The Bhāgavatam was composed by Vyāsadeva not as a literary achievement, but as an act of devotion, on the instruction of Nārada Muni, to fill the one gap that all his previous works had left.</p><p>Even a fully liberated soul like Śukadeva Gosvāmī is drawn to the Bhāgavatam — because devotional love for the Lord is sweeter than liberation itself.</p><p>The Lord\'s presence in this world does not end with the departure of His physical form. He remains fully accessible through His name, His scripture, and the hearts of His devotees.</p><p>The primary spiritual practice for the age of Kali is hearing and chanting the glories of the Lord — simple in form, infinite in depth.</p><p>Genuine knowledge of the Absolute is always received through a living chain of disciplic succession, never produced through personal intellectual effort alone.</p><h2>Closing</h2><p>हरे कृष्ण हरे कृष्ण कृष्ण कृष्ण हरे हरे हरे राम हरे राम राम राम हरे हरे</p><p>Thus concludes our journal reflection on Canto 1, Chapter 1 of the Śrīmad Bhāgavatam — the questions of the sages at Naimiṣāraṇya, the opening declaration of the supreme good, and the invitation extended across all of time to every sincere seeker: come, sit, hear, and be satisfied.</p><p>This is fully original writing based on the teachings — ready to paste directly into CKEditor. It will render all the ## headings, --- dividers, and bullet points cleanly. Want Chapter 2 in the same format next?</p>','https://unsplash.com/photos/jbHJXI2Vi5Q/download?force=true&w=1920','published','2026-05-30 00:51:55',91,'2026-05-30 00:51:55','2026-06-14 09:43:47',NULL,'one_time',1,299.00,'INR','https://unsplash.com/photos/F6Xn1Fwb0XU/download?force=true&w=640','https://unsplash.com/photos/jbHJXI2Vi5Q/download?force=true&w=1920'),(3,'25b64b78-2a04-4591-b429-f4e5b6abacf3',3,'demo','demo-1780479303139-3nsbn','journal','free','<p>Hare Krishna</p>','<p>Hare Krishna</p>','https://unsplash.com/photos/kYxgm42SQso/download?force=true&w=2400','published','2026-06-03 09:36:34',5,'2026-06-03 09:36:34','2026-06-13 10:55:24',NULL,'free',1,0.00,'INR','https://unsplash.com/photos/kYxgm42SQso/download?force=true&w=2400','https://unsplash.com/photos/kYxgm42SQso/download?force=true&w=2400');
/*!40000 ALTER TABLE `content_posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `content_subscription_plans`
--

DROP TABLE IF EXISTS `content_subscription_plans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `content_subscription_plans` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `plan_type` enum('monthly','yearly','lifetime') DEFAULT 'monthly',
  `amount` decimal(10,2) NOT NULL,
  `currency` varchar(10) DEFAULT 'INR',
  `description` text,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `content_subscription_plans`
--

LOCK TABLES `content_subscription_plans` WRITE;
/*!40000 ALTER TABLE `content_subscription_plans` DISABLE KEYS */;
INSERT INTO `content_subscription_plans` VALUES (1,'b041f744-5cbe-11f1-91b3-81997ca2b9b7','Monthly Premium','monthly',299.00,'INR','Unlock all premium journals and newsletters for 30 days',1,'2026-05-31 07:02:29','2026-05-31 07:02:29',NULL),(2,'b042252a-5cbe-11f1-91b3-81997ca2b9b7','Yearly Premium','yearly',2999.00,'INR','Unlock all premium journals and newsletters for 1 year',1,'2026-05-31 07:02:29','2026-05-31 07:02:29',NULL),(3,'b0422868-5cbe-11f1-91b3-81997ca2b9b7','Lifetime Premium','lifetime',9999.00,'INR','Lifetime access to premium journals and newsletters',1,'2026-05-31 07:02:29','2026-05-31 07:02:29',NULL);
/*!40000 ALTER TABLE `content_subscription_plans` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `content_subscriptions`
--

DROP TABLE IF EXISTS `content_subscriptions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `content_subscriptions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` char(36) NOT NULL,
  `user_id` int NOT NULL,
  `plan_id` int DEFAULT NULL,
  `plan_name` varchar(255) DEFAULT NULL,
  `plan_type` enum('monthly','yearly','lifetime') DEFAULT 'monthly',
  `amount` decimal(10,2) DEFAULT '0.00',
  `currency` varchar(10) DEFAULT 'INR',
  `provider` varchar(50) DEFAULT NULL,
  `provider_subscription_id` varchar(255) DEFAULT NULL,
  `provider_payment_id` varchar(255) DEFAULT NULL,
  `start_date` datetime DEFAULT NULL,
  `end_date` datetime DEFAULT NULL,
  `cancelled_at` datetime DEFAULT NULL,
  `expired_at` datetime DEFAULT NULL,
  `cancel_reason` text,
  `status` enum('active','expired','cancelled','refunded') NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  KEY `user_id` (`user_id`),
  KEY `fk_content_subscriptions_plan` (`plan_id`),
  CONSTRAINT `content_subscriptions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_content_subscriptions_plan` FOREIGN KEY (`plan_id`) REFERENCES `content_subscription_plans` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `content_subscriptions`
--

LOCK TABLES `content_subscriptions` WRITE;
/*!40000 ALTER TABLE `content_subscriptions` DISABLE KEYS */;
INSERT INTO `content_subscriptions` VALUES (1,'90483a5f-9311-40c8-9bbb-a765a49cb8e3',3,NULL,'Monthly Premium','monthly',299.00,'INR','razorpay',NULL,'pay_SwCWXbtZ4gYq3W','2026-06-01 02:24:37','2026-07-01 02:24:37',NULL,NULL,NULL,'active','2026-06-01 02:24:37','2026-06-01 02:24:37',NULL),(2,'d617d9a1-1cbf-4e81-9191-9d46f82f5fbf',4,NULL,'Monthly Premium','monthly',299.00,'INR','razorpay',NULL,'pay_T3EffDtVj7HHvf','2026-06-18 21:03:34','2026-07-18 21:03:34',NULL,NULL,NULL,'active','2026-06-18 21:03:34','2026-06-18 21:03:34',NULL);
/*!40000 ALTER TABLE `content_subscriptions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `content_tags`
--

DROP TABLE IF EXISTS `content_tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `content_tags` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `content_tags`
--

LOCK TABLES `content_tags` WRITE;
/*!40000 ALTER TABLE `content_tags` DISABLE KEYS */;
/*!40000 ALTER TABLE `content_tags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `course_payments`
--

DROP TABLE IF EXISTS `course_payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course_payments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` char(36) NOT NULL,
  `course_id` int NOT NULL,
  `registration_id` int DEFAULT NULL,
  `user_id` int NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `currency` varchar(10) DEFAULT 'INR',
  `provider` enum('razorpay','cashfree','manual_upi') DEFAULT 'razorpay',
  `provider_order_id` varchar(255) DEFAULT NULL,
  `provider_payment_id` varchar(255) DEFAULT NULL,
  `provider_signature` text,
  `provider_refund_id` varchar(255) DEFAULT NULL,
  `transaction_id` varchar(255) DEFAULT NULL,
  `payment_status` enum('pending','success','failed','refund_pending','refunded','refund_failed') DEFAULT 'pending',
  `paid_at` datetime DEFAULT NULL,
  `refunded_at` datetime DEFAULT NULL,
  `failed_reason` text,
  `refund_reason` text,
  `raw_response` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  KEY `course_id` (`course_id`),
  KEY `registration_id` (`registration_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `course_payments_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
  CONSTRAINT `course_payments_ibfk_2` FOREIGN KEY (`registration_id`) REFERENCES `course_registrations` (`id`) ON DELETE SET NULL,
  CONSTRAINT `course_payments_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course_payments`
--

LOCK TABLES `course_payments` WRITE;
/*!40000 ALTER TABLE `course_payments` DISABLE KEYS */;
INSERT INTO `course_payments` VALUES (1,'57cc1741-9243-4dd6-8199-846e4fc60cf7',1,1,3,499.00,'INR','razorpay','order_SyBsL3747d4S5X','pay_SyBsUIp5oe1RYL','6c85d6e641bff0aff7ede1bae0daf99711167efc27e3ebf01c2b078f8789cba2',NULL,'pay_SyBsUIp5oe1RYL','success','2026-06-06 03:04:40',NULL,NULL,NULL,'{\"payment_uuid\": \"57cc1741-9243-4dd6-8199-846e4fc60cf7\", \"razorpay_order_id\": \"order_SyBsL3747d4S5X\", \"razorpay_signature\": \"6c85d6e641bff0aff7ede1bae0daf99711167efc27e3ebf01c2b078f8789cba2\", \"razorpay_payment_id\": \"pay_SyBsUIp5oe1RYL\"}','2026-06-06 03:04:13','2026-06-06 03:04:40',NULL);
/*!40000 ALTER TABLE `course_payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `course_registrations`
--

DROP TABLE IF EXISTS `course_registrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course_registrations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` char(36) NOT NULL,
  `course_id` int NOT NULL,
  `user_id` int NOT NULL,
  `payment_id` int DEFAULT NULL,
  `full_name` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `registration_source` enum('self','added_by_creator','admin_added') DEFAULT 'self',
  `registration_status` enum('pending','confirmed','cancelled','rejected') DEFAULT 'pending',
  `payment_status` enum('not_required','pending','success','failed','refunded') DEFAULT 'not_required',
  `invite_email_sent_at` datetime DEFAULT NULL,
  `last_reminder_sent_at` datetime DEFAULT NULL,
  `notes` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  KEY `course_id` (`course_id`),
  KEY `user_id` (`user_id`),
  KEY `fk_course_registration_payment` (`payment_id`),
  CONSTRAINT `course_registrations_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
  CONSTRAINT `course_registrations_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_course_registration_payment` FOREIGN KEY (`payment_id`) REFERENCES `course_payments` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course_registrations`
--

LOCK TABLES `course_registrations` WRITE;
/*!40000 ALTER TABLE `course_registrations` DISABLE KEYS */;
INSERT INTO `course_registrations` VALUES (1,'62cc7976-2a67-4831-a860-61d223fb789d',1,3,1,'sagar patel','09537992625','sagar.56001@gmail.com','self','confirmed','success',NULL,NULL,'hare krishna','2026-06-06 03:04:13','2026-06-06 03:04:40',NULL);
/*!40000 ALTER TABLE `course_registrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `course_sessions`
--

DROP TABLE IF EXISTS `course_sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course_sessions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` char(36) NOT NULL,
  `course_id` int NOT NULL,
  `session_number` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `session_date` date NOT NULL,
  `start_time` time DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  `venue_name` varchar(255) DEFAULT NULL,
  `venue_address` text,
  `online_meeting_url` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  KEY `course_id` (`course_id`),
  CONSTRAINT `course_sessions_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course_sessions`
--

LOCK TABLES `course_sessions` WRITE;
/*!40000 ALTER TABLE `course_sessions` DISABLE KEYS */;
INSERT INTO `course_sessions` VALUES (1,'dec567cc-5e17-11f1-91b3-81997ca2b9b7',1,1,'Introduction to Bhagavad Gita','Why Bhagavad Gita is important and overview of the course.','2026-07-01','19:00:00','21:00:00','ISKCON Ahmedabad Temple Hall','ISKCON Cross Road, Ahmedabad',NULL,'2026-06-02 00:13:23','2026-06-22 13:39:54','2026-06-22 13:39:54'),(2,'dec56e5c-5e17-11f1-91b3-81997ca2b9b7',1,2,'Who Am I?','Soul, body, mind and reincarnation.','2026-07-02','19:00:00','21:00:00','ISKCON Ahmedabad Temple Hall','ISKCON Cross Road, Ahmedabad',NULL,'2026-06-02 00:13:23','2026-06-22 13:39:54','2026-06-22 13:39:54'),(3,'dec57000-5e17-11f1-91b3-81997ca2b9b7',1,3,'Law of Karma','Understanding karma and free will.','2026-07-03','19:00:00','21:00:00','ISKCON Ahmedabad Temple Hall','ISKCON Cross Road, Ahmedabad',NULL,'2026-06-02 00:13:23','2026-06-22 13:39:54','2026-06-22 13:39:54'),(4,'dec570e6-5e17-11f1-91b3-81997ca2b9b7',1,4,'Different Yogas','Karma Yoga, Jnana Yoga and Bhakti Yoga.','2026-07-04','19:00:00','21:00:00','ISKCON Ahmedabad Temple Hall','ISKCON Cross Road, Ahmedabad',NULL,'2026-06-02 00:13:23','2026-06-22 13:39:54','2026-06-22 13:39:54'),(5,'dec571ae-5e17-11f1-91b3-81997ca2b9b7',1,5,'Who is Krishna?','Understanding Krishna from Bhagavad Gita.','2026-07-05','19:00:00','21:00:00','ISKCON Ahmedabad Temple Hall','ISKCON Cross Road, Ahmedabad',NULL,'2026-06-02 00:13:23','2026-06-22 13:39:54','2026-06-22 13:39:54'),(6,'dec5726c-5e17-11f1-91b3-81997ca2b9b7',1,6,'Practical Bhakti','Chanting, prasadam, association and daily practice.','2026-07-06','19:00:00','21:00:00','ISKCON Ahmedabad Temple Hall','ISKCON Cross Road, Ahmedabad',NULL,'2026-06-02 00:13:23','2026-06-22 13:39:54','2026-06-22 13:39:54'),(7,'dec573b6-5e17-11f1-91b3-81997ca2b9b7',1,7,'Graduation & Q&A','Final discussion, certificates and next steps.','2026-07-07','19:00:00','21:00:00','ISKCON Ahmedabad Temple Hall','ISKCON Cross Road, Ahmedabad',NULL,'2026-06-02 00:13:23','2026-06-22 13:39:54','2026-06-22 13:39:54'),(8,'50835860-5e4a-11f1-91b3-81997ca2b9b7',1,1,'Introduction to Bhagavad Gita','Why Bhagavad Gita is important and overview of the course.','2026-07-01','19:00:00','21:00:00','ISKCON Ahmedabad Temple Hall','ISKCON Cross Road, Ahmedabad',NULL,'2026-06-02 06:14:29','2026-06-22 13:39:54','2026-06-22 13:39:54'),(9,'50838056-5e4a-11f1-91b3-81997ca2b9b7',1,2,'Who Am I?','Soul, body, mind and reincarnation.','2026-07-02','19:00:00','21:00:00','ISKCON Ahmedabad Temple Hall','ISKCON Cross Road, Ahmedabad',NULL,'2026-06-02 06:14:29','2026-06-22 13:39:54','2026-06-22 13:39:54'),(10,'5083856a-5e4a-11f1-91b3-81997ca2b9b7',1,3,'Law of Karma','Understanding karma and free will.','2026-07-03','19:00:00','21:00:00','ISKCON Ahmedabad Temple Hall','ISKCON Cross Road, Ahmedabad',NULL,'2026-06-02 06:14:29','2026-06-22 13:39:54','2026-06-22 13:39:54'),(11,'50838808-5e4a-11f1-91b3-81997ca2b9b7',1,4,'Different Yogas','Karma Yoga, Jnana Yoga and Bhakti Yoga.','2026-07-04','19:00:00','21:00:00','ISKCON Ahmedabad Temple Hall','ISKCON Cross Road, Ahmedabad',NULL,'2026-06-02 06:14:29','2026-06-22 13:39:54','2026-06-22 13:39:54'),(12,'50838ca4-5e4a-11f1-91b3-81997ca2b9b7',1,5,'Who is Krishna?','Understanding Krishna from Bhagavad Gita.','2026-07-05','19:00:00','21:00:00','ISKCON Ahmedabad Temple Hall','ISKCON Cross Road, Ahmedabad',NULL,'2026-06-02 06:14:29','2026-06-22 13:39:54','2026-06-22 13:39:54'),(13,'50838ec0-5e4a-11f1-91b3-81997ca2b9b7',1,6,'Practical Bhakti','Chanting, prasadam, association and daily practice.','2026-07-06','19:00:00','21:00:00','ISKCON Ahmedabad Temple Hall','ISKCON Cross Road, Ahmedabad',NULL,'2026-06-02 06:14:29','2026-06-22 13:39:54','2026-06-22 13:39:54'),(14,'5083910e-5e4a-11f1-91b3-81997ca2b9b7',1,7,'Graduation & Q&A','Final discussion, certificates and next steps.','2026-07-07','19:00:00','21:00:00','ISKCON Ahmedabad Temple Hall','ISKCON Cross Road, Ahmedabad',NULL,'2026-06-02 06:14:29','2026-06-22 13:39:54','2026-06-22 13:39:54'),(15,'e9ed1299-9fcf-4f37-ba91-04d9d5a30b52',2,1,'hello','hello','2026-06-24','09:08:00','09:08:00','hello','hello',NULL,'2026-06-22 13:36:26','2026-06-22 13:36:26',NULL),(16,'0b28361c-6df1-4e2f-95b1-986f10db0c28',1,1,'Introduction to Bhagavad Gita','Why Bhagavad Gita is important and overview of the course.','2026-07-01','19:00:00','21:00:00','ISKCON Ahmedabad Temple Hall','ISKCON Cross Road, Ahmedabad',NULL,'2026-06-22 13:39:54','2026-06-22 13:39:54',NULL),(17,'0dab81e3-8ef8-44bd-9816-9795b0a17e0b',1,1,'Introduction to Bhagavad Gita','Why Bhagavad Gita is important and overview of the course.','2026-07-01','19:00:00','21:00:00','ISKCON Ahmedabad Temple Hall','ISKCON Cross Road, Ahmedabad',NULL,'2026-06-22 13:39:54','2026-06-22 13:39:54',NULL),(18,'3320197d-32c0-434d-af1e-a1dc5bdf892e',1,2,'Who Am I?','Soul, body, mind and reincarnation.','2026-07-02','19:00:00','21:00:00','ISKCON Ahmedabad Temple Hall','ISKCON Cross Road, Ahmedabad',NULL,'2026-06-22 13:39:54','2026-06-22 13:39:54',NULL),(19,'55f4a208-9a84-4f79-9bc6-7d97ce11ac14',1,2,'Who Am I?','Soul, body, mind and reincarnation.','2026-07-02','19:00:00','21:00:00','ISKCON Ahmedabad Temple Hall','ISKCON Cross Road, Ahmedabad',NULL,'2026-06-22 13:39:54','2026-06-22 13:39:54',NULL),(20,'ef4943c4-356c-4acf-83f7-47b2a666bf2d',1,3,'Law of Karma','Understanding karma and free will.','2026-07-03','19:00:00','21:00:00','ISKCON Ahmedabad Temple Hall','ISKCON Cross Road, Ahmedabad',NULL,'2026-06-22 13:39:54','2026-06-22 13:39:54',NULL),(21,'e568fa89-cd30-493b-8484-8bc367eea9b4',1,3,'Law of Karma','Understanding karma and free will.','2026-07-03','19:00:00','21:00:00','ISKCON Ahmedabad Temple Hall','ISKCON Cross Road, Ahmedabad',NULL,'2026-06-22 13:39:54','2026-06-22 13:39:54',NULL),(22,'7e1efe1f-7de4-4e0e-ab1f-55e192ae8857',1,4,'Different Yogas','Karma Yoga, Jnana Yoga and Bhakti Yoga.','2026-07-04','19:00:00','21:00:00','ISKCON Ahmedabad Temple Hall','ISKCON Cross Road, Ahmedabad',NULL,'2026-06-22 13:39:54','2026-06-22 13:39:54',NULL),(23,'5d616096-db1d-4d0c-8f83-7655c960694c',1,4,'Different Yogas','Karma Yoga, Jnana Yoga and Bhakti Yoga.','2026-07-04','19:00:00','21:00:00','ISKCON Ahmedabad Temple Hall','ISKCON Cross Road, Ahmedabad',NULL,'2026-06-22 13:39:54','2026-06-22 13:39:54',NULL),(24,'5dcb4dac-625d-4ec6-ad63-c4c411992bb9',1,5,'Who is Krishna?','Understanding Krishna from Bhagavad Gita.','2026-07-05','19:00:00','21:00:00','ISKCON Ahmedabad Temple Hall','ISKCON Cross Road, Ahmedabad',NULL,'2026-06-22 13:39:54','2026-06-22 13:39:54',NULL),(25,'9e0aa107-69d0-4923-bb3b-50b12bfad292',1,5,'Who is Krishna?','Understanding Krishna from Bhagavad Gita.','2026-07-05','19:00:00','21:00:00','ISKCON Ahmedabad Temple Hall','ISKCON Cross Road, Ahmedabad',NULL,'2026-06-22 13:39:54','2026-06-22 13:39:54',NULL),(26,'ac30cecf-939d-47c1-b7db-48f381bee83c',1,6,'Practical Bhakti','Chanting, prasadam, association and daily practice.','2026-07-06','19:00:00','21:00:00','ISKCON Ahmedabad Temple Hall','ISKCON Cross Road, Ahmedabad',NULL,'2026-06-22 13:39:54','2026-06-22 13:39:54',NULL),(27,'d9b3f619-2c29-496c-9b5d-68c041c79153',1,6,'Practical Bhakti','Chanting, prasadam, association and daily practice.','2026-07-06','19:00:00','21:00:00','ISKCON Ahmedabad Temple Hall','ISKCON Cross Road, Ahmedabad',NULL,'2026-06-22 13:39:54','2026-06-22 13:39:54',NULL),(28,'ba36fac9-ec05-4fd9-a960-33787dd2c564',1,7,'Graduation & Q&A','Final discussion, certificates and next steps.','2026-07-07','19:00:00','21:00:00','ISKCON Ahmedabad Temple Hall','ISKCON Cross Road, Ahmedabad',NULL,'2026-06-22 13:39:54','2026-06-22 13:39:54',NULL),(29,'6ed5b173-b67d-4546-b202-8ef2a193d8f3',1,7,'Graduation & Q&A','Final discussion, certificates and next steps.','2026-07-07','19:00:00','21:00:00','ISKCON Ahmedabad Temple Hall','ISKCON Cross Road, Ahmedabad',NULL,'2026-06-22 13:39:54','2026-06-22 13:39:54',NULL);
/*!40000 ALTER TABLE `course_sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `courses`
--

DROP TABLE IF EXISTS `courses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `courses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` char(36) NOT NULL,
  `centre_id` int DEFAULT NULL,
  `created_by` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `description` text,
  `cover_image_url` text,
  `course_mode` enum('offline','online','hybrid') DEFAULT 'offline',
  `venue_name` varchar(255) DEFAULT NULL,
  `venue_address` text,
  `online_meeting_url` text,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `start_time` time DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  `max_capacity` int DEFAULT NULL,
  `is_paid` tinyint(1) DEFAULT '0',
  `price_amount` decimal(10,2) DEFAULT '0.00',
  `currency` varchar(10) DEFAULT 'INR',
  `registration_start_date` datetime DEFAULT NULL,
  `registration_end_date` datetime DEFAULT NULL,
  `what_you_will_learn` text,
  `requirements` text,
  `rules` text,
  `contact_name` varchar(150) DEFAULT NULL,
  `contact_phone` varchar(20) DEFAULT NULL,
  `status` enum('draft','published','cancelled','completed') DEFAULT 'draft',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  UNIQUE KEY `slug` (`slug`),
  KEY `created_by` (`created_by`),
  CONSTRAINT `courses_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `courses`
--

LOCK TABLES `courses` WRITE;
/*!40000 ALTER TABLE `courses` DISABLE KEYS */;
INSERT INTO `courses` VALUES (1,'d7197e64-5e17-11f1-91b3-81997ca2b9b7',1,3,'Bhagavad Gita Foundation Course','bhagavad-gita-foundation-course','A beginner-friendly introduction to Bhagavad Gita covering karma, bhakti, soul, reincarnation, and practical spiritual life.','/uploads/courses/1782135594169-960589804.jpg','offline','ISKCON Ahmedabad Temple Hall','ISKCON Cross Road, SG Highway, Ahmedabad','','2026-07-01','2026-07-07','19:00:00','21:00:00',100,1,499.00,'INR','2026-06-01 00:00:00','2026-06-30 23:59:59','Understand Bhagavad Gita basics, karma, yoga, bhakti, chanting, practical spirituality and devotional lifestyle.','Open mind, notebook, willingness to learn.','Attend all sessions, maintain respectful behavior, mobile phones on silent.','Rup Govind Das','+91 9876543210','published','2026-06-02 00:13:11','2026-06-22 13:39:54',NULL),(2,'dabfb1c9-f9f4-4251-a3a0-3e53f221f903',NULL,3,'hello','hello','hello','/uploads/courses/1782135386352-581019655.jpg','offline','hello','hello',NULL,'2026-06-24','2026-06-27','09:06:00','11:08:00',200,1,120.00,'INR','2026-06-22 03:35:00','2026-06-24 02:36:00','hello','hello','hello','sagar','hello','published','2026-06-22 13:36:26','2026-06-22 13:36:26',NULL);
/*!40000 ALTER TABLE `courses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `daily_progress`
--

DROP TABLE IF EXISTS `daily_progress`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `daily_progress` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` char(36) NOT NULL,
  `user_id` int NOT NULL,
  `progress_date` date NOT NULL,
  `mala_count` int DEFAULT '0',
  `lecture_attended` tinyint(1) DEFAULT '0',
  `lecture_title` varchar(255) DEFAULT NULL,
  `books_read_count` int DEFAULT '0',
  `current_book` varchar(255) DEFAULT NULL,
  `book_status` enum('not_started','ongoing','completed') DEFAULT 'not_started',
  `notes` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  UNIQUE KEY `unique_user_daily_progress` (`user_id`,`progress_date`),
  CONSTRAINT `fk_daily_progress_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `daily_progress`
--

LOCK TABLES `daily_progress` WRITE;
/*!40000 ALTER TABLE `daily_progress` DISABLE KEYS */;
INSERT INTO `daily_progress` VALUES (1,'109b42ca-09a8-4fab-8950-6a5d1f74f7b1',4,'2026-05-28',6,0,NULL,1,NULL,'ongoing','It was good','2026-05-28 12:19:23','2026-05-28 12:19:23',NULL),(2,'9f1fe138-ebd0-465c-a228-cc7360ff7a57',3,'2026-05-30',16,1,'Bhāgavatam Morning Class',1,'Śrīmad Bhāgavatam — Canto 1','ongoing','','2026-05-30 23:22:17','2026-05-30 23:22:17',NULL),(3,'7bf1370e-e2b5-4e4a-b24b-045c165bd922',3,'2026-06-02',8,1,'Bhāgavatam Morning Class',1,'Śrīmad Bhāgavatam — Canto 1','ongoing','','2026-06-02 06:30:17','2026-06-02 06:30:17',NULL);
/*!40000 ALTER TABLE `daily_progress` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `devotee_requests`
--

DROP TABLE IF EXISTS `devotee_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `devotee_requests` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` char(36) NOT NULL,
  `user_id` int NOT NULL,
  `centre_id` int NOT NULL,
  `spiritual_name` varchar(255) DEFAULT NULL,
  `current_malas` int DEFAULT '0',
  `initiation_status` enum('none','harinam','diksha') DEFAULT 'none',
  `years_associated` int DEFAULT '0',
  `services` text,
  `devotee_reference_name` varchar(255) DEFAULT NULL,
  `devotee_reference_phone` varchar(20) DEFAULT NULL,
  `reason` text,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `reviewed_by` int DEFAULT NULL,
  `reviewed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  KEY `fk_devotee_requests_user` (`user_id`),
  KEY `fk_devotee_requests_centre` (`centre_id`),
  CONSTRAINT `fk_devotee_requests_centre` FOREIGN KEY (`centre_id`) REFERENCES `centres` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_devotee_requests_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `devotee_requests`
--

LOCK TABLES `devotee_requests` WRITE;
/*!40000 ALTER TABLE `devotee_requests` DISABLE KEYS */;
INSERT INTO `devotee_requests` VALUES (1,'5822a6d1-1a2c-4f84-9600-ebabbc771448',3,1,'Rup Govind Das',8,'none',2,'Book distribution and kitchen seva','Mahaprabhu Das','9876543210','Want to help in organizing temple events','approved',NULL,NULL,'2026-05-24 20:20:15','2026-05-26 10:19:33',NULL);
/*!40000 ALTER TABLE `devotee_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `donation_receipts`
--

DROP TABLE IF EXISTS `donation_receipts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `donation_receipts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` char(36) NOT NULL,
  `donation_id` int NOT NULL,
  `receipt_number` varchar(100) NOT NULL,
  `pdf_url` text,
  `issued_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  UNIQUE KEY `receipt_number` (`receipt_number`),
  KEY `fk_donation_receipts_donation` (`donation_id`),
  CONSTRAINT `fk_donation_receipts_donation` FOREIGN KEY (`donation_id`) REFERENCES `donations` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `donation_receipts`
--

LOCK TABLES `donation_receipts` WRITE;
/*!40000 ALTER TABLE `donation_receipts` DISABLE KEYS */;
INSERT INTO `donation_receipts` VALUES (1,'d4d9b5ab-c687-4c23-ad4a-9586d5256104',1,'ISKCON-AHD-2026-000001','/uploads/donation-receipts/ISKCON-AHD-2026-000001.pdf','2026-05-31 01:00:44','2026-05-31 01:00:44','2026-05-31 01:00:44',NULL),(2,'611ecca6-5316-4676-ac55-29f995f16a57',2,'ISKCON-AHD-2026-000002','/uploads/donation-receipts/ISKCON-AHD-2026-000002.pdf','2026-05-31 01:06:04','2026-05-31 01:06:04','2026-05-31 01:06:04',NULL),(3,'37635a70-641e-4508-abe1-233450795cf7',3,'ISKCON-AHD-2026-000003','/uploads/donation-receipts/ISKCON-AHD-2026-000003.pdf','2026-06-01 04:45:52','2026-06-01 04:45:52','2026-06-01 04:45:52',NULL),(4,'19c9efa8-a674-4370-ae6b-d17ad8ff9524',13,'ISKCON-AHD-2026-000013','/uploads/donation-receipts/ISKCON-AHD-2026-000013.pdf','2026-06-09 07:31:36','2026-06-09 07:31:36','2026-06-09 07:31:36',NULL),(5,'b92da7a3-09d3-4708-8621-3042b562881b',14,'ISKCON-AHD-2026-000014','/uploads/donation-receipts/ISKCON-AHD-2026-000014.pdf','2026-06-11 10:39:55','2026-06-11 10:39:55','2026-06-11 10:39:55',NULL),(6,'6c1a74c7-744d-44b8-8edf-3caf0715b817',15,'ISKCON-AHD-2026-000015','/uploads/donation-receipts/ISKCON-AHD-2026-000015.pdf','2026-06-11 10:41:19','2026-06-11 10:41:19','2026-06-11 10:41:19',NULL),(7,'b7d8e064-0aa1-4fcf-aaeb-623fcd31c387',16,'ISKCON-AHD-2026-000016','/uploads/donation-receipts/ISKCON-AHD-2026-000016.pdf','2026-06-11 10:49:32','2026-06-11 10:49:32','2026-06-11 10:49:32',NULL);
/*!40000 ALTER TABLE `donation_receipts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `donations`
--

DROP TABLE IF EXISTS `donations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `donations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` char(36) NOT NULL,
  `user_id` int DEFAULT NULL,
  `donor_name` varchar(255) DEFAULT NULL,
  `donor_email` varchar(255) DEFAULT NULL,
  `donor_phone` varchar(20) DEFAULT NULL,
  `seva_type` enum('nitya_seva','gau_seva','khichdi_seva') NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `currency` varchar(10) DEFAULT 'INR',
  `payment_provider` enum('razorpay','cash','bank_transfer','upi') DEFAULT 'razorpay',
  `payment_status` enum('pending','success','failed','refunded') DEFAULT 'pending',
  `razorpay_order_id` varchar(255) DEFAULT NULL,
  `razorpay_payment_id` varchar(255) DEFAULT NULL,
  `razorpay_signature` text,
  `transaction_reference` varchar(255) DEFAULT NULL,
  `is_anonymous` tinyint(1) DEFAULT '0',
  `notes` text,
  `paid_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  KEY `fk_donations_user` (`user_id`),
  CONSTRAINT `fk_donations_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `donations`
--

LOCK TABLES `donations` WRITE;
/*!40000 ALTER TABLE `donations` DISABLE KEYS */;
INSERT INTO `donations` VALUES (1,'61b40782-5a18-46df-8648-3d61f1dc7e90',4,'Sagar Patel','abcd1234@mailinator.com','9876543212','nitya_seva',501.00,'INR','razorpay','success','order_SvmVavOGqDQ2dp','pay_SvmYekHyTsHina','40cd10f9516d31a0efec2dcbb8c3ed15653b0dcc464aa50eb3e719a1eb30d2fd','pay_SvmYekHyTsHina',0,NULL,'2026-05-31 01:00:44','2026-05-31 00:57:21','2026-05-31 01:00:44',NULL),(2,'c4aa6f37-32ba-4aa6-a9e8-b265c7256b47',4,'Sagar Patel','abcd1234@mailinator.com','9876543212','nitya_seva',11000.00,'INR','razorpay','success','order_Svme7omAhXeBVJ','pay_SvmeTv3zx5smCc','c94801e2a95376dc689940549bde590fe2d0452d246f058e2056b93af56e541e','pay_SvmeTv3zx5smCc',0,NULL,'2026-05-31 01:06:04','2026-05-31 01:05:25','2026-05-31 01:06:04',NULL),(3,'edb9a92e-d6db-49ef-92db-9eb9268b6619',3,'Rup Govind Das','abcd12345@mailinator.com','9876543211','nitya_seva',501.00,'INR','razorpay','success','order_SwEvW40pSxIkwk','pay_SwEvkRouMiDbpU','c152b49b684b8551fb8db79be4ceb2eebbfdad77ae8d3b470d72642b8f593f48','pay_SwEvkRouMiDbpU',0,NULL,'2026-06-01 04:45:52','2026-06-01 04:45:19','2026-06-01 04:45:52',NULL),(4,'9ba9d22e-54dd-4ecc-a3ce-657a9eae2e41',3,'Rup Govind Das','abcd12345@mailinator.com','9876543211','nitya_seva',501.00,'INR','razorpay','pending','order_SyEjfvZcDxqWZu',NULL,NULL,NULL,0,NULL,NULL,'2026-06-06 05:52:06','2026-06-06 05:52:06',NULL),(5,'80ed63b8-9a19-46a6-9f6c-2ef4e820186e',3,'Rup Govind Das','abcd12345@mailinator.com','9876543211','nitya_seva',501.00,'INR','razorpay','pending','order_SzNWdVMLT6OrbX',NULL,NULL,NULL,0,NULL,NULL,'2026-06-09 03:06:58','2026-06-09 03:06:58',NULL),(6,'2aa7aa9e-cf77-4c3e-94a7-d8e9d0e62adc',3,'Rup Govind Das','abcd12345@mailinator.com','9876543211','nitya_seva',501.00,'INR','razorpay','pending','order_SzQsuvQH9mL1DC',NULL,NULL,NULL,0,NULL,NULL,'2026-06-09 06:24:11','2026-06-09 06:24:11',NULL),(7,'95b04a85-8404-44f2-b9bc-a8c857dd55cb',3,'Rup Govind Das','abcd12345@mailinator.com','9876543211','nitya_seva',501.00,'INR','razorpay','pending','order_SzQtcaVwCIGnxg',NULL,NULL,NULL,0,NULL,NULL,'2026-06-09 06:24:51','2026-06-09 06:24:51',NULL),(8,'da3e1fe2-f150-4f25-a779-759f048b4080',3,'Rup Govind Das','abcd12345@mailinator.com','9876543211','nitya_seva',501.00,'INR','razorpay','pending','order_SzQu6DDTGhfNAo',NULL,NULL,NULL,0,NULL,NULL,'2026-06-09 06:25:18','2026-06-09 06:25:18',NULL),(9,'a2363817-5e69-4acb-9c6d-c3e996d624ef',3,'Rup Govind Das','abcd12345@mailinator.com','9876543211','nitya_seva',501.00,'INR','razorpay','pending','order_SzQuquJeWTBNB7',NULL,NULL,NULL,0,NULL,NULL,'2026-06-09 06:26:00','2026-06-09 06:26:00',NULL),(10,'293aaf33-f78d-49de-86d0-d1d6c9a5ef0c',3,'Rup Govind Das','abcd12345@mailinator.com','9876543211','nitya_seva',501.00,'INR','razorpay','pending','order_SzQv6zEo2IOeX6',NULL,NULL,NULL,0,NULL,NULL,'2026-06-09 06:26:15','2026-06-09 06:26:15',NULL),(11,'c38c52eb-07b3-46fe-a7bf-532689023d89',3,'Rup Govind Das','abcd12345@mailinator.com','9876543211','nitya_seva',501.00,'INR','razorpay','pending','order_SzQvKrz1W6zMAt',NULL,NULL,NULL,0,NULL,NULL,'2026-06-09 06:26:28','2026-06-09 06:26:28',NULL),(12,'3580bc13-586f-4fc1-ba5b-d48ab868203a',3,'Rup Govind Das','abcd12345@mailinator.com','9876543211','nitya_seva',501.00,'INR','razorpay','pending','order_SzQvVAKOCWpNTV',NULL,NULL,NULL,0,NULL,NULL,'2026-06-09 06:26:37','2026-06-09 06:26:37',NULL),(13,'55e7dc6f-315e-4ef1-91aa-787e6c7fd1a3',4,'Sagar Patel','abcd1234@mailinator.com','9876543212','nitya_seva',501.00,'INR','razorpay','success','order_SzS1jTGYouojRk','pay_SzS22zoHbaF9UU','0e4864e767be5394f42b3fd21684a7637cd3c0048ca96ab2c67163e0335cc04b','pay_SzS22zoHbaF9UU',0,NULL,'2026-06-09 07:31:36','2026-06-09 07:31:13','2026-06-09 07:31:36',NULL),(14,'03bde78f-c288-4e7c-9c20-0f7240ad7c1f',3,'Rup Govind Das','abcd12345@mailinator.com','9876543211','nitya_seva',501.00,'INR','razorpay','success','order_T0IIti0kPMvJca','pay_T0IJ2Z564nT2Ss','1edb36684242ccc4ef2d4cb64987b6f9a3f82532c9ddd9157225bb95bf389e89','pay_T0IJ2Z564nT2Ss',0,NULL,'2026-06-11 10:39:55','2026-06-11 10:39:32','2026-06-11 10:39:55',NULL),(15,'0a73ceaa-4bf7-4cb6-a386-e6fa8940c586',3,'Rup Govind Das','abcd12345@mailinator.com','9876543211','nitya_seva',501.00,'INR','razorpay','success','order_T0IKR0JIqS6klz','pay_T0IKV659NbYcOq','96526d75ad1205204ce9a4700d33eb34dbf35a772aa6bc55c67515a9c0a6566c','pay_T0IKV659NbYcOq',0,NULL,'2026-06-11 10:41:19','2026-06-11 10:40:59','2026-06-11 10:41:19',NULL),(16,'98bc9c20-593b-4ddf-bcc6-314a7b0f7195',3,'Rup Govind Das','abcd12345@mailinator.com','9876543211','nitya_seva',501.00,'INR','razorpay','success','order_T0IT6ivEC3IogH','pay_T0ITBVTEZQS8dl','7486bf94296e952768948e326fef1c2b962f030ab9cb024dbc68ac02d33ca955','pay_T0ITBVTEZQS8dl',0,NULL,'2026-06-11 10:49:32','2026-06-11 10:49:12','2026-06-11 10:49:32',NULL);
/*!40000 ALTER TABLE `donations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `event_attendance`
--

DROP TABLE IF EXISTS `event_attendance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `event_attendance` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` char(36) NOT NULL,
  `event_id` int NOT NULL,
  `registration_id` int NOT NULL,
  `user_id` int NOT NULL,
  `scanned_by` int NOT NULL,
  `scanned_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('pending','approved','rejected') DEFAULT 'approved',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  UNIQUE KEY `unique_registration_attendance` (`registration_id`),
  KEY `user_id` (`user_id`),
  KEY `idx_attendance_event_id` (`event_id`),
  KEY `idx_attendance_scanned_by` (`scanned_by`),
  CONSTRAINT `event_attendance_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`),
  CONSTRAINT `event_attendance_ibfk_2` FOREIGN KEY (`registration_id`) REFERENCES `event_registrations` (`id`),
  CONSTRAINT `event_attendance_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `event_attendance_ibfk_4` FOREIGN KEY (`scanned_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event_attendance`
--

LOCK TABLES `event_attendance` WRITE;
/*!40000 ALTER TABLE `event_attendance` DISABLE KEYS */;
INSERT INTO `event_attendance` VALUES (1,'60c7b992-0530-4d08-9205-82782cc0ecd1',2,1,4,3,'2026-05-27 11:16:06','approved','2026-05-27 11:16:06','2026-05-27 11:16:06',NULL);
/*!40000 ALTER TABLE `event_attendance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `event_form_fields`
--

DROP TABLE IF EXISTS `event_form_fields`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `event_form_fields` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` char(36) NOT NULL,
  `event_id` int NOT NULL,
  `label` varchar(255) NOT NULL,
  `field_key` varchar(100) NOT NULL,
  `field_type` enum('text','number','email','phone','select','checkbox','textarea','date') NOT NULL,
  `options` json DEFAULT NULL,
  `is_required` tinyint(1) DEFAULT '0',
  `sort_order` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  UNIQUE KEY `unique_event_field_key` (`event_id`,`field_key`),
  KEY `idx_event_form_fields_event_id` (`event_id`),
  CONSTRAINT `event_form_fields_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event_form_fields`
--

LOCK TABLES `event_form_fields` WRITE;
/*!40000 ALTER TABLE `event_form_fields` DISABLE KEYS */;
INSERT INTO `event_form_fields` VALUES (1,'95613d58-897f-4916-8267-cf4f421f3cf4',1,'Full Name','full_name','text',NULL,1,1,'2026-05-27 10:40:48','2026-05-27 10:40:48',NULL),(2,'09f15002-1378-4325-91ce-9006862c3f75',1,'Phone Number','phone_number','text',NULL,1,2,'2026-05-27 10:40:48','2026-05-27 10:40:48',NULL),(3,'3186c523-6a18-49fe-b61d-aba321342748',2,'Full Name','full_name','text',NULL,1,1,'2026-05-27 10:56:45','2026-05-27 10:56:45',NULL),(4,'62a3c94b-5252-49bb-98eb-4b938deccaef',2,'Phone Number','phone_number','text',NULL,1,2,'2026-05-27 10:56:45','2026-05-27 10:56:45',NULL),(5,'21d0a9da-eb72-458d-b635-04f8867006d3',3,'Full Name','full_name','text',NULL,1,1,'2026-06-06 03:35:04','2026-06-06 03:35:04',NULL),(6,'9352d9a9-f201-4173-81ac-d5e2e3056ff5',3,'Phone Number','phone_number','phone',NULL,1,2,'2026-06-06 03:35:04','2026-06-06 03:35:04',NULL);
/*!40000 ALTER TABLE `event_form_fields` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `event_registrations`
--

DROP TABLE IF EXISTS `event_registrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `event_registrations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` char(36) NOT NULL,
  `event_id` int NOT NULL,
  `user_id` int NOT NULL,
  `form_answers` json DEFAULT NULL,
  `qr_token` char(64) NOT NULL,
  `payment_id` int DEFAULT NULL,
  `status` enum('registered','cancelled','attended','rejected') DEFAULT 'registered',
  `registered_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  UNIQUE KEY `qr_token` (`qr_token`),
  UNIQUE KEY `unique_event_user` (`event_id`,`user_id`),
  KEY `idx_event_registrations_event_id` (`event_id`),
  KEY `idx_event_registrations_user_id` (`user_id`),
  KEY `idx_event_registrations_qr_token` (`qr_token`),
  KEY `fk_event_registrations_payment` (`payment_id`),
  CONSTRAINT `event_registrations_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE,
  CONSTRAINT `event_registrations_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_event_registrations_payment` FOREIGN KEY (`payment_id`) REFERENCES `payments` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event_registrations`
--

LOCK TABLES `event_registrations` WRITE;
/*!40000 ALTER TABLE `event_registrations` DISABLE KEYS */;
INSERT INTO `event_registrations` VALUES (1,'4479d220-539f-4a09-8816-6c3b5ebef985',2,4,'{}','91435008a39f016fb683258b7a9835b18fe71421a877399e025a078ceea03884',NULL,'attended','2026-05-27 10:58:19','2026-05-27 10:58:19','2026-05-27 11:16:06',NULL);
/*!40000 ALTER TABLE `event_registrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `events` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` char(36) NOT NULL,
  `centre_id` int NOT NULL,
  `created_by` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `poster_url` text,
  `location` varchar(255) DEFAULT NULL,
  `event_date` date NOT NULL,
  `start_time` time DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  `registration_start_at` datetime DEFAULT NULL,
  `registration_end_at` datetime DEFAULT NULL,
  `max_capacity` int DEFAULT NULL,
  `is_paid` tinyint(1) DEFAULT '0',
  `price_amount` decimal(10,2) DEFAULT '0.00',
  `currency` varchar(10) DEFAULT 'INR',
  `status` enum('draft','published','cancelled','completed') DEFAULT 'draft',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  KEY `idx_events_centre_id` (`centre_id`),
  KEY `idx_events_created_by` (`created_by`),
  KEY `idx_events_status` (`status`),
  KEY `idx_events_event_date` (`event_date`),
  CONSTRAINT `events_ibfk_1` FOREIGN KEY (`centre_id`) REFERENCES `centres` (`id`),
  CONSTRAINT `events_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
INSERT INTO `events` VALUES (1,'1563fe16-8038-4d97-980b-eed92680e271',1,3,'Sunday Feast','Weekly spiritual program','/uploads/events/1779877263383-466201966.jpg','ISKCON Ahmedabad','2026-05-30','18:00:00','21:00:00','2026-05-25 09:00:00','2026-05-30 17:00:00',100,1,2000.00,'INR','published','2026-05-27 09:33:44','2026-05-27 10:21:11',NULL),(2,'5fedf37e-042b-4528-8177-65fdba435aef',1,3,'Sunday Feast 1','Weekly spiritual program','/uploads/events/1779879400319-797158776.jpg','ISKCON Ahmedabad','2026-05-30','18:00:00','21:00:00','2026-05-25 09:00:00','2026-05-30 17:00:00',100,0,0.00,'INR','published','2026-05-27 10:56:39','2026-05-27 10:56:40',NULL),(3,'77ae961d-7ebd-44f2-86af-9e38fd366c01',1,3,'demo','demo','/uploads/events/1780716895062-1649322.jpeg','Ahmedabad','2026-06-08','08:59:00','11:02:00','2026-06-06 03:29:00','2026-06-07 03:29:00',200,1,300.00,'INR','published','2026-06-06 03:34:52','2026-06-09 04:30:34','2026-06-09 04:30:34');
/*!40000 ALTER TABLE `events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_status_history`
--

DROP TABLE IF EXISTS `order_status_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_status_history` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` char(36) NOT NULL,
  `order_id` int NOT NULL,
  `changed_by` int DEFAULT NULL,
  `old_status` varchar(50) DEFAULT NULL,
  `new_status` varchar(50) NOT NULL,
  `note` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  KEY `fk_order_status_history_order` (`order_id`),
  KEY `fk_order_status_history_changed_by` (`changed_by`),
  CONSTRAINT `fk_order_status_history_changed_by` FOREIGN KEY (`changed_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_order_status_history_order` FOREIGN KEY (`order_id`) REFERENCES `product_orders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_status_history`
--

LOCK TABLES `order_status_history` WRITE;
/*!40000 ALTER TABLE `order_status_history` DISABLE KEYS */;
INSERT INTO `order_status_history` VALUES (1,'3183a548-2264-4159-86f2-14b288820465',1,3,'confirmed','packed','Order marked as packed','2026-06-23 11:51:12','2026-06-23 11:51:12',NULL);
/*!40000 ALTER TABLE `order_status_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `otp_verifications`
--

DROP TABLE IF EXISTS `otp_verifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `otp_verifications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` char(36) NOT NULL,
  `user_id` int DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `otp_hash` text NOT NULL,
  `purpose` enum('register','login','forgot_password','verify_email','verify_phone') NOT NULL,
  `expires_at` timestamp NOT NULL,
  `verified_at` timestamp NULL DEFAULT NULL,
  `attempts` int DEFAULT '0',
  `max_attempts` int DEFAULT '5',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  KEY `fk_otp_verifications_user` (`user_id`),
  KEY `idx_otp_email` (`email`),
  KEY `idx_otp_phone` (`phone`),
  KEY `idx_otp_purpose` (`purpose`),
  KEY `idx_otp_expires_at` (`expires_at`),
  KEY `idx_otp_verified_at` (`verified_at`),
  CONSTRAINT `fk_otp_verifications_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=85 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `otp_verifications`
--

LOCK TABLES `otp_verifications` WRITE;
/*!40000 ALTER TABLE `otp_verifications` DISABLE KEYS */;
INSERT INTO `otp_verifications` VALUES (1,'8bf17601-de42-4352-908e-f2280ac1d03e',4,'abcd1234@mailinator.com',NULL,'$2b$10$Vn.JJCcY5jZQqujU/bDyf.716586lfMJslOgfzbBVKQzNXzm0Xpf.','login','2026-05-26 07:58:04','2026-05-26 07:53:59',1,5,'2026-05-26 07:53:04','2026-05-26 07:58:43',NULL),(2,'1af684ee-32bf-4bba-af3a-9e30660078cf',4,'abcd1234@mailinator.com',NULL,'$2b$10$B70C5ZUGp78f4oyfymiJIuCcRIACHN8hVumzyBV6cRFbZwhGbkckS','login','2026-05-26 08:02:07','2026-05-26 07:57:28',1,5,'2026-05-26 07:57:07','2026-05-26 07:57:28',NULL),(3,'a9af6246-66d8-4bb9-80d5-9a13e9df5c06',3,'abcd12345@mailinator.com',NULL,'$2b$10$fTy8ZDvRuayfWslJr.swvuFJmbdV3x0F/mulF4uR/UmZ8VnEx8b7K','login','2026-05-26 10:58:09','2026-05-26 10:53:48',1,5,'2026-05-26 10:53:09','2026-05-26 10:53:48',NULL),(4,'503d99a2-7d3d-4ffe-bb9d-ca4c20926156',3,'abcd12345@mailinator.com',NULL,'$2b$10$WLbmT9J8RkhwsZLrQY.ztewISyYUTFC586lJXiHDXaWPBe0NN0FOu','login','2026-05-26 11:05:21','2026-05-26 11:00:44',1,5,'2026-05-26 11:00:21','2026-05-26 11:00:44',NULL),(5,'a04e00ae-f22a-40ec-ab4a-7d9f6425e907',3,'abcd12345@mailinator.com',NULL,'$2b$10$TgIwHD0WnlyEVsjzHYgq1.c1gFl6jJatNM9vbZslrEDO5oeMKUyVW','login','2026-05-26 11:18:00','2026-05-26 11:13:23',1,5,'2026-05-26 11:13:00','2026-05-26 11:13:23',NULL),(6,'4ad68949-81de-45fb-a511-71be915f6f54',3,'abcd12345@mailinator.com',NULL,'$2b$10$2OW8aPNNLzW87JEQdEEoZeax3NDFPfcsC87W2GKerIC0gxrcZ8.hG','login','2026-05-26 11:27:43','2026-05-26 11:23:03',1,5,'2026-05-26 11:22:43','2026-05-26 11:23:03',NULL),(7,'12f6e3d0-644b-4c2b-b52c-8b6bb067d003',3,'abcd12345@mailinator.com',NULL,'$2b$10$.v3giOMfUNUwJk9l2xdDrO3SbFcnt216wX6AuBnTr1aio0Oyg5kGu','login','2026-05-26 11:34:30','2026-05-26 11:30:04',2,5,'2026-05-26 11:29:30','2026-05-26 11:30:04',NULL),(8,'3fdbd185-69a3-44c5-b8de-476eff273c68',3,'abcd12345@mailinator.com',NULL,'$2b$10$3kqnjiUL6EBK1BzRTXPCa.E/AjNT3xRbFe.rWNjsyoLhT09SvU1Pm','login','2026-05-26 11:42:01','2026-05-26 11:37:23',1,5,'2026-05-26 11:37:01','2026-05-26 11:37:23',NULL),(9,'f4de7f56-b054-4d6d-9edf-dba7d18866bb',3,'abcd12345@mailinator.com',NULL,'$2b$10$TzxR5copfM2NrXY3VPT1e.Gl0SwdJLkptyfeihWKVOcxxtdfDpaWq','login','2026-05-26 11:45:57','2026-05-26 11:41:23',1,5,'2026-05-26 11:40:57','2026-05-26 11:41:23',NULL),(10,'b6a2f8d6-11fa-4e27-9148-750e03346230',3,'abcd12345@mailinator.com',NULL,'$2b$10$wMfjqlWMWOK3gJBbe4h0OedL4I2svdFS7kxPeh4Lch4RdznorI0OK','login','2026-05-26 11:58:19','2026-05-26 11:53:52',1,5,'2026-05-26 11:53:19','2026-05-26 11:53:52',NULL),(11,'48e6478f-96c8-4a34-8cd7-a63cd98e774e',3,'abcd12345@mailinator.com',NULL,'$2b$10$OBls9Wqq5Wvh52THsLjksO1Qu/HjNfyId0ZXzGNbMWBuEUjSJxpMe','login','2026-05-26 12:30:37','2026-05-26 12:25:56',1,5,'2026-05-26 12:25:37','2026-05-26 12:25:56',NULL),(12,'0e664863-0797-4e26-a4f7-9d98bbe5c379',3,'abcd12345@mailinator.com',NULL,'$2b$10$au0MCcrospgzehPbFis7buH9ZPHRJ1QbwLv0bKJaYJ4nxPXl9Ic9u','login','2026-05-27 09:15:42',NULL,0,5,'2026-05-27 09:10:42','2026-05-27 09:10:42',NULL),(13,'aad78c45-141d-4595-86c3-c3fabbb7f517',3,'abcd12345@mailinator.com',NULL,'$2b$10$WoSXiCeJCty.7qt8SvtHDe.R.rSlFOlJQgqlN.ZmRUj0hrRyn4Jpm','login','2026-05-27 09:15:54','2026-05-27 09:11:18',1,5,'2026-05-27 09:10:54','2026-05-27 09:11:18',NULL),(14,'003baf47-b284-4bde-976d-7f49340033a7',3,'abcd12345@mailinator.com',NULL,'$2b$10$UUKCw97/defoJo/r63LyqOunn81juQ3F5AHEwjcaS/xK7KKytcz92','login','2026-05-27 09:19:52','2026-05-27 09:15:24',1,5,'2026-05-27 09:14:52','2026-05-27 09:15:24',NULL),(15,'a2b2e7bf-b90b-4b76-b212-b2e851dd3d40',3,'abcd12345@mailinator.com',NULL,'$2b$10$rvFtHPcQv7r48WyYsZLoteieKWEs6jO7AI7GHcM.AaQKZNBJtePrq','login','2026-05-27 09:22:58','2026-05-27 09:18:55',1,5,'2026-05-27 09:17:58','2026-05-27 09:18:55',NULL),(16,'446a3242-17d8-4934-bc44-595b1fdb230a',3,'abcd12345@mailinator.com',NULL,'$2b$10$ZgWODl.usgG3LLG2XUWMI.vWwEY5/0t0Z8fIpbQmyUvOqEBYDpTy2','login','2026-05-27 09:25:45','2026-05-27 09:21:09',1,5,'2026-05-27 09:20:45','2026-05-27 09:21:09',NULL),(17,'148222ca-6fc5-450b-afcf-c523d4840b0a',3,'abcd12345@mailinator.com',NULL,'$2b$10$Ll.NHeJLEZF7CEcrsXYgCuXjfXtRvuLFQ6kMTCjCjHflZOIejmXZK','login','2026-05-27 09:37:46','2026-05-27 09:33:12',1,5,'2026-05-27 09:32:46','2026-05-27 09:33:12',NULL),(18,'124396a9-7070-47d2-bacf-94b3e47807f8',3,'abcd12345@mailinator.com',NULL,'$2b$10$EcnaUWtGwYholJ65PpAZTOS1hoHkxVW8qj3Cb.gO1aAqHwK8I20gm','login','2026-05-27 10:15:38','2026-05-27 10:11:00',1,5,'2026-05-27 10:10:38','2026-05-27 10:11:00',NULL),(19,'ce7d0136-2d0c-416a-b3b5-cd38a31e3c10',3,'abcd12345@mailinator.com',NULL,'$2b$10$SUYQXSq0nCvuW5KAbY21Gu3YDiMf7RGgTzyUyy7Ll4OPAv16LoA9C','login','2026-05-27 10:30:29','2026-05-27 10:25:56',1,5,'2026-05-27 10:25:29','2026-05-27 10:25:56',NULL),(20,'a0dfe521-5258-4347-a804-a2578e917a25',3,'abcd12345@mailinator.com',NULL,'$2b$10$uWcnYtUO8k4mIPu/k/5Bjuyc3LnP08ulpV.0KPzGT4kY2KLEJdvi2','login','2026-05-27 10:33:27','2026-05-27 10:29:00',1,5,'2026-05-27 10:28:27','2026-05-27 10:29:00',NULL),(21,'def47cb9-3347-440a-a12a-42c10e65fa08',3,'abcd12345@mailinator.com',NULL,'$2b$10$wb6k833TKGiAaFi/19NVBudTbd1.vuVR3V1/jXW0eErRUjXt8QKeK','login','2026-05-27 10:37:03','2026-05-27 10:32:27',1,5,'2026-05-27 10:32:03','2026-05-27 10:32:27',NULL),(22,'04f60924-90a9-448d-a37e-a988cd9379fc',3,'abcd12345@mailinator.com',NULL,'$2b$10$9f2izglUQe9mZ8zkVwiLU.6VL82glPG9cZ7NyWYJRIjsfn/RSs/Si','login','2026-05-27 10:45:12','2026-05-27 10:40:32',1,5,'2026-05-27 10:40:12','2026-05-27 10:40:32',NULL),(23,'7d2ba5f7-99b7-4010-b5df-db302576f469',4,'abcd1234@mailinator.com',NULL,'$2b$10$oJCOTmiKtm5d87Qhti9o4.RCyaQDdaZF3XDNGXZjXwfo1BCFzwgbK','login','2026-05-27 10:53:18','2026-05-27 10:48:42',1,5,'2026-05-27 10:48:18','2026-05-27 10:48:42',NULL),(24,'6da3ed8b-9160-4685-b12e-f87078ceff05',4,'abcd1234@mailinator.com',NULL,'$2b$10$g9feaaH2QaGYPWNrJFAjDu/MOIT4TApbnxfi03QE1gPfwVHpLLDcC','login','2026-05-27 10:55:45',NULL,0,5,'2026-05-27 10:50:45','2026-05-27 10:50:45',NULL),(25,'2620ab7d-e1a9-40db-8882-92bc63a726fe',4,'abcd1234@mailinator.com',NULL,'$2b$10$slDjFrsv0vZU2PNZLhgwIOiCony.edSe4mlhVrUbKES8rvhGX9qZ6','login','2026-05-27 10:55:58',NULL,0,5,'2026-05-27 10:50:58','2026-05-27 10:50:58',NULL),(26,'03c7db0f-8e6b-426e-b910-d5c8098c6694',4,'abcd1234@mailinator.com',NULL,'$2b$10$84aS9AN7pEMMe0HegpdFguDGQFi55zTRTnUavJm5LW8G//UNfC1Hq','login','2026-05-27 10:56:27','2026-05-27 10:51:45',1,5,'2026-05-27 10:51:27','2026-05-27 10:51:45',NULL),(27,'aaab2bf4-3e84-4010-960e-da4db26961b5',4,'abcd1234@mailinator.com',NULL,'$2b$10$eGbpRl/4YOpPZLqN6V18Xu2K66n8LvT1DxDRA8scVJYo2//oCmLjC','login','2026-05-27 10:59:14','2026-05-27 10:54:30',1,5,'2026-05-27 10:54:14','2026-05-27 10:54:30',NULL),(28,'b2536110-486e-4da8-bbc0-2e831a5270e0',3,'abcd12345@mailinator.com',NULL,'$2b$10$0Qsr4Zjcj2mu/jjqzu5SCuAgD1Y3cBUdwoWii2uNJxpAuxSTVRQju','login','2026-05-27 11:00:23','2026-05-27 10:55:54',1,5,'2026-05-27 10:55:23','2026-05-27 10:55:54',NULL),(29,'4181e542-0c0f-48e1-b440-3488eb061521',4,'abcd1234@mailinator.com',NULL,'$2b$10$a0x.IscHbFNVlE//Zz830.WHhFNxx7Oh7Y1Vx...Hom2GW.ocqnVO','login','2026-05-27 11:02:11','2026-05-27 10:57:28',1,5,'2026-05-27 10:57:11','2026-05-27 10:57:28',NULL),(30,'25ed7472-3983-42d8-9bcb-ccc74ecf601d',4,'abcd1234@mailinator.com',NULL,'$2b$10$FxFNfxUik9k3bqAzger.L.MlT9Rr/Sa95BFL1fyWKlf9RfYSEJAB2','login','2026-05-27 11:12:38','2026-05-27 11:07:59',1,5,'2026-05-27 11:07:38','2026-05-27 11:07:59',NULL),(31,'caee8973-0ed1-469e-bae4-3f137425db8c',3,'abcd12345@mailinator.com',NULL,'$2b$10$Dgv0.qbTSKNC3HTauXE3ZulyiZLPwp/gWUR6DXuKyHzC7eoZi.PQS','login','2026-05-27 11:20:07','2026-05-27 11:15:29',1,5,'2026-05-27 11:15:07','2026-05-27 11:15:29',NULL),(32,'96bc97f0-126b-4475-aac4-520be8fa47e6',4,'abcd1234@mailinator.com',NULL,'$2b$10$q1RK/IBooXkDm5dIzPyKNOZoPzyl5QM/G1D2ijVwwCVyDNtyqC73S','login','2026-05-27 11:22:33','2026-05-27 11:17:59',1,5,'2026-05-27 11:17:33','2026-05-27 11:17:59',NULL),(33,'34fffe0f-7a14-42c9-be63-60fd70c8d80e',4,'abcd1234@mailinator.com',NULL,'$2b$10$4rHmePbIU1/zUTvJyylfnudblFDp685DAofXPP2VdaLwii1ZXmLnG','login','2026-05-27 11:56:14','2026-05-27 11:51:36',1,5,'2026-05-27 11:51:14','2026-05-27 11:51:36',NULL),(34,'02e7b74b-7b90-4322-a96a-2f8ecd157a73',4,'abcd1234@mailinator.com',NULL,'$2b$10$m0O5e1VS.nREW5X4c.hiDus38agEwVXuFnWI07RPdKQTk0ItaWAIa','login','2026-05-28 09:52:12','2026-05-28 09:47:31',1,5,'2026-05-28 09:47:12','2026-05-28 09:47:31',NULL),(35,'90952075-0bc1-41d2-b6e9-44bd1e9af467',4,'abcd1234@mailinator.com',NULL,'$2b$10$wNJl8qM3HfTgamkYZzMv4esz1zVkY1HqIWAHBraYqT.D1Xb4DE9Mq','login','2026-05-28 09:53:36','2026-05-28 09:49:13',1,5,'2026-05-28 09:48:36','2026-05-28 09:49:13',NULL),(36,'7f6eb19b-8bfe-4fad-84ef-59dd41564dbe',4,'abcd1234@mailinator.com',NULL,'$2b$10$HCcuWc7VUwy9NqUZ9NTUOu5wVCwn.rAeNxwQJJ3UKi9/SEXn5U1Dy','login','2026-05-28 10:58:19','2026-05-28 10:53:48',1,5,'2026-05-28 10:53:19','2026-05-28 10:53:48',NULL),(37,'e48f367e-b9e9-46a9-a1e0-5636510336b3',4,'abcd1234@mailinator.com',NULL,'$2b$10$E8u.agrLJeQsPXsA30EIlOONR3MyXdEtXjzHLtZlLKLciWRUHRqoO','login','2026-05-28 11:07:47','2026-05-28 11:03:23',1,5,'2026-05-28 11:02:47','2026-05-28 11:03:23',NULL),(38,'4cc91553-3d32-4c90-ac64-448348e36333',4,'abcd1234@mailinator.com',NULL,'$2b$10$Ay39xCIZi6bXQyxQLm0mPOuSCmNVfwIGCiyJq8Q7NLWa9xq8jLWcW','login','2026-05-28 11:14:32','2026-05-28 11:11:01',1,5,'2026-05-28 11:09:32','2026-05-28 11:11:01',NULL),(39,'d3a7ec24-bc39-4693-a655-270e2cc1b3af',3,'abcd12345@mailinator.com',NULL,'$2b$10$zIvnNU5xc8/OQrfO7yE9weIDXlFCZTJkxO6fUyrDVlOBTZcPmtS7y','login','2026-05-28 11:39:56','2026-05-28 11:35:31',1,5,'2026-05-28 11:34:56','2026-05-28 11:35:31',NULL),(40,'ac4019b8-05c8-42fa-acb1-eccd709cbf09',3,'abcd12345@mailinator.com',NULL,'$2b$10$1jpsXisv6tb/JgXy37NtAu2XVY2TZ2vI4fJ7BG6gH3gteqWZT/jNG','login','2026-05-28 11:52:12','2026-05-28 11:47:32',1,5,'2026-05-28 11:47:12','2026-05-28 11:47:32',NULL),(41,'ff3bbe17-7cd9-4252-b0bd-64dd693087c2',4,'abcd1234@mailinator.com',NULL,'$2b$10$CKpZb4okgyLIA17nF28.KOHx7Lz2mRyrBECMhZCTdYKnjZWLDsegS','login','2026-05-28 11:52:59','2026-05-28 11:48:35',2,5,'2026-05-28 11:47:59','2026-05-28 11:48:35',NULL),(42,'9c71a18a-a9ca-4430-bc3b-5c57a27bbb93',4,'abcd1234@mailinator.com',NULL,'$2b$10$DBBUE5.FJD3aJmbwBSvHceTD3d4PTFRXFe5cOScIBla57ZsAacuWC','login','2026-05-29 23:40:10','2026-05-29 23:35:41',1,5,'2026-05-29 23:35:10','2026-05-29 23:35:41',NULL),(43,'5846cf17-d287-4f6e-b5f2-2008db8980f2',4,'abcd1234@mailinator.com',NULL,'$2b$10$D80aSUUML2HS.i57HuPMVeeAD7AUyo9PVfjjhdxArWXuKwnupDuB2','login','2026-05-29 23:59:42','2026-05-29 23:55:12',1,5,'2026-05-29 23:54:42','2026-05-29 23:55:12',NULL),(44,'cc20ea57-4f35-4f2b-97c3-85d5d1d9cd2f',3,'abcd12345@mailinator.com',NULL,'$2b$10$f2wKOyzl8SYlA3O8SEsLrORaE1v9fCVpqFh5ZG3Mf3zPyn/aQ0H1a','login','2026-05-30 00:00:58','2026-05-29 23:56:27',1,5,'2026-05-29 23:55:58','2026-05-29 23:56:27',NULL),(45,'924717e5-9ed0-4966-b58c-000eda96f5b2',4,'abcd1234@mailinator.com',NULL,'$2b$10$AVBvrJdphjvARpWeMNONdOiZpxuwSDmW4uDTfnxm3yNqo4fvXOW.6','login','2026-05-30 21:59:15','2026-05-30 21:54:38',1,5,'2026-05-30 21:54:15','2026-05-30 21:54:38',NULL),(46,'fd48fc36-303e-4988-830a-c857f9b02def',3,'abcd12345@mailinator.com',NULL,'$2b$10$8Vnq/osSLlHS8/8GYPA.Qu8MKGi3xHE5wiLWJWPDxPdZqnBLFqk5e','login','2026-05-30 22:51:38','2026-05-30 22:47:03',1,5,'2026-05-30 22:46:38','2026-05-30 22:47:03',NULL),(47,'cc5305e5-c73c-4679-8bdb-ca77fcce94e3',4,'abcd1234@mailinator.com',NULL,'$2b$10$YG9J4DcHOZ5bqxQAyAESvOjcISSiDbCqtwq8kb6ilVfKOLLbrxh6S','login','2026-05-31 00:57:17','2026-05-31 00:52:44',1,5,'2026-05-31 00:52:17','2026-05-31 00:52:44',NULL),(48,'05145d34-9f35-4855-8d36-7570dc3d777a',4,'abcd1234@mailinator.com',NULL,'$2b$10$jdno02ei4cokPFBYHP9AR.63/lqTtpczXLMvCg9w0dhObG8dujWNe','login','2026-05-31 04:31:14','2026-05-31 04:26:38',1,5,'2026-05-31 04:26:14','2026-05-31 04:26:38',NULL),(49,'bfe185fe-1d64-410d-b9cd-b9108331ccab',4,'abcd1234@mailinator.com',NULL,'$2b$10$QrYy0SHPsCK22ZwA5lHWp.KSklmkObP82gS3HfGLce4JJ5iFFQ7im','login','2026-05-31 05:39:22','2026-05-31 05:35:04',1,5,'2026-05-31 05:34:22','2026-05-31 05:35:04',NULL),(50,'69d29944-0a0f-4ab0-b6f3-0894ca7a977f',3,'abcd12345@mailinator.com',NULL,'$2b$10$YZMpCNkV7lVzJ2mz53cQ9OTdgyOXz2D7iSnTjVg/jPRrDG.XJBMAi','login','2026-05-31 05:42:36','2026-05-31 05:38:07',1,5,'2026-05-31 05:37:36','2026-05-31 05:38:07',NULL),(51,'fe3b4e41-83c1-49c2-a90c-dbd8dc717b46',4,'abcd1234@mailinator.com',NULL,'$2b$10$Wms7uZCFGUr3p6yUTtbZMuBl1b1OVnJuyeWm61ZzjOu2L5yXhzOaO','login','2026-06-01 22:26:41','2026-06-01 22:22:06',1,5,'2026-06-01 22:21:41','2026-06-01 22:22:06',NULL),(52,'fe982749-7c88-4716-804f-1cef42d4435a',4,'abcd1234@mailinator.com',NULL,'$2b$10$FJ2q806ni0bHFN5o0wKchOr6K/zMq2MHOw11huoMgqa3F8ZPnNq/e','login','2026-06-01 22:27:27','2026-06-01 22:22:53',1,5,'2026-06-01 22:22:27','2026-06-01 22:22:53',NULL),(53,'bc05e567-569c-42cc-9947-af080b21090f',2,'sagar@test.com',NULL,'$2b$10$PcKILRfZOJcWCclvIKDJaOC3/ysyXLqxyMYrlp2AOCu9K5inGriv6','login','2026-06-01 22:28:08',NULL,0,5,'2026-06-01 22:23:08','2026-06-01 22:23:08',NULL),(54,'16e97656-69c4-4f99-a92d-b78e9f196a09',4,'abcd1234@mailinator.com',NULL,'$2b$10$6mwuFExYy2/VkICnOtqWMOI8jZQmQO0RpZELXef4fYgSKNMOU0Ou.','login','2026-06-01 22:29:40','2026-06-01 22:25:16',1,5,'2026-06-01 22:24:40','2026-06-01 22:25:16',NULL),(55,'916c8f01-4dbd-48d0-a861-6f58dae534c5',3,'abcd12345@mailinator.com',NULL,'$2b$10$/hj8hZYnxmcry5NSG75LAurftF7KXbIiDMav8kUMKX7xX/TBy8EX.','login','2026-06-01 23:12:30','2026-06-01 23:07:59',1,5,'2026-06-01 23:07:30','2026-06-01 23:07:59',NULL),(56,'378d8124-6a28-42ac-b4f5-06d8daed3c08',4,'abcd1234@mailinator.com',NULL,'$2b$10$3EFZiueySrBPr4DnLTGOJ.30mMUWtnVn7PPWHJdkUz6r1ogNupXWW','login','2026-06-03 13:37:53','2026-06-03 13:33:23',1,5,'2026-06-03 13:32:53','2026-06-03 13:33:23',NULL),(57,'42369ba4-0f41-4bbc-bbd5-91b42341a143',2,'sagar.demo0412@gmail.com',NULL,'$2b$10$h9SK4tARz2FIxgKKYvjEreEtQqre2o5zBJU7.PEtQSG6F7Hx2kNE6','login','2026-06-03 13:57:23','2026-06-03 13:53:08',1,5,'2026-06-03 13:52:23','2026-06-03 13:53:08',NULL),(58,'31e76651-ce1d-472b-9744-6b3eb01696b9',3,'abcd12345@mailinator.com',NULL,'$2b$10$oIb.m3GpO5q9yjFGXTVbz.Lnm1ZIbv4.huXq6DOXkrbBDuKfb8VzS','login','2026-06-06 02:20:59','2026-06-06 02:16:53',1,5,'2026-06-06 02:15:59','2026-06-06 02:16:53',NULL),(59,'1b3a407e-9a65-4a09-879f-d6aac301013c',4,'abcd1234@mailinator.com',NULL,'$2b$10$N1NTESFCCaPaBxXc96xbzOIgrRVwIM7/ZmWY0SD/KvOQtZWDXYnnm','login','2026-06-08 02:09:40','2026-06-08 02:05:04',1,5,'2026-06-08 02:04:40','2026-06-08 02:05:04',NULL),(60,'17f8165d-2eb5-4e61-b185-bc61c6d950b3',4,'abcd1234@mailinator.com',NULL,'$2b$10$kBURAe6iSI8I8KdTZjCuD.yZZQVMLt68DRZStoAK1..l270hd5zzy','login','2026-06-08 06:10:00','2026-06-08 06:05:17',1,5,'2026-06-08 06:05:00','2026-06-08 06:05:17',NULL),(61,'900e9e11-9c96-4c50-83fd-6dfbf4f2a68f',3,'abcd12345@mailinator.com',NULL,'$2b$10$jGnBvhQoQv6lwSmsp65UJ.6IOJcqNJklolaOwklBWdku1DdWgGOzS','login','2026-06-08 07:07:30','2026-06-08 07:02:56',1,5,'2026-06-08 07:02:30','2026-06-08 07:02:56',NULL),(62,'8f0d7ee6-200d-495d-b1ff-4c40fee305ec',3,'abcd12345@mailinator.com',NULL,'$2b$10$l4f8wyEzV7jG0uBUi2ckveoWd64fjStV1JIqsH3rjU/KfrF8uSRb6','login','2026-06-08 07:21:13','2026-06-08 07:16:50',1,5,'2026-06-08 07:16:13','2026-06-08 07:16:50',NULL),(63,'52981598-c90c-4c8b-83e6-3f12df6a90b9',4,'abcd1234@mailinator.com',NULL,'$2b$10$ezjUW4tReph.zaa8/bpG9.W1Nwaoz61dDXDUxDRz.tntO4YGM.Clq','login','2026-06-09 05:56:14','2026-06-09 05:51:53',1,5,'2026-06-09 05:51:14','2026-06-09 05:51:53',NULL),(64,'fdc045e7-7876-4987-96e3-00803b5abff7',3,'abcd12345@mailinator.com',NULL,'$2b$10$VuihJKi7RgTEfseM1k1ZyuOCmR4bFGGIqc0JzCnHABxsYn2PWrR3e','login','2026-06-09 05:58:05','2026-06-09 05:53:34',1,5,'2026-06-09 05:53:05','2026-06-09 05:53:34',NULL),(65,'3212712f-b874-4449-9e7b-2eb2f3d59506',4,'abcd1234@mailinator.com',NULL,'$2b$10$q/XhMJfUKS3dR99klIEm0.uYkBFUw9jNqqdHkx6MDj7KaovrVRq/K','login','2026-06-09 06:45:00','2026-06-09 06:40:44',1,5,'2026-06-09 06:40:00','2026-06-09 06:40:44',NULL),(66,'73d8f05a-9c39-434b-ba9c-4270c2d60555',4,'abcd1234@mailinator.com',NULL,'$2b$10$C4rNFuhiVX180eoEcJ7YjOKosopDaXLcdqU..z4YQDDHPEQIlMTp2','login','2026-06-09 07:35:16','2026-06-09 07:30:45',1,5,'2026-06-09 07:30:16','2026-06-09 07:30:45',NULL),(67,'5cdf8d74-8ded-42c7-8c37-493690c872b1',4,'abcd1234@mailinator.com',NULL,'$2b$10$ek7FytbLvpsw79nBSWV4HO2obg3Avr54lCCsSC2OAyV/X/ZKNiiAa','login','2026-06-09 08:00:23','2026-06-09 07:55:44',1,5,'2026-06-09 07:55:23','2026-06-09 07:55:44',NULL),(68,'0d8aefc1-e36a-4337-99e5-ee8195d7ce59',4,'abcd1234@mailinator.com',NULL,'$2b$10$1/8a7s.FBWZPmI9LyGs.SON9EyOlct8ccqHwHhF/Jp8KZblVFcSoK','login','2026-06-14 09:42:36','2026-06-14 09:38:20',1,5,'2026-06-14 09:37:36','2026-06-14 09:38:20',NULL),(69,'d2821561-bc78-4f6a-aee3-6fedfdcb2d9c',2,'sagar.demo0412@gmail.com',NULL,'$2b$10$huDCMxjT6F5ex/KHoDw/deinDE2oPa3RXuwPLrvzETkdIuModIoAC','login','2026-06-16 22:35:31','2026-06-16 22:31:21',1,5,'2026-06-16 22:30:31','2026-06-16 22:31:21',NULL),(70,'365b3a1e-3c0f-49f0-8cac-b664a63f6ed0',4,'abcd1234@mailinator.com',NULL,'$2b$10$iGYn5F0xLgaJXGC5m7mSuO0h6ZRST7232k4ymqYFCfJdmLFCJdOca','login','2026-06-17 00:19:53','2026-06-17 00:15:42',1,5,'2026-06-17 00:14:53','2026-06-17 00:15:42',NULL),(71,'f73358f6-6c55-46e3-8f7e-3ab51845df3c',4,'abcd1234@mailinator.com',NULL,'$2b$10$Vi8ur2SngM3.hvdfL.tygeIxLqZZw2jmc8ci3yYQW02mukW6U7eEe','login','2026-06-18 20:51:18','2026-06-18 20:47:01',1,5,'2026-06-18 20:46:18','2026-06-18 20:47:01',NULL),(72,'b5157e4e-ccc6-4827-a02a-7ee2dffa05db',4,'abcd1234@mailinator.com',NULL,'$2b$10$bRF0zJh1B4CJtq6ARKoYk.lpVXk.9ECTcqTvZN6AXq3IKPYXFWOe6','login','2026-06-18 20:58:53','2026-06-18 20:54:23',1,5,'2026-06-18 20:53:53','2026-06-18 20:54:23',NULL),(73,'2d2ac9d1-03cb-4ae4-8a09-1b80a186eccc',4,'abcd1234@mailinator.com',NULL,'$2b$10$5ZnXzOOO4cL0Ouc3HAIEo.puQsj6RB/iy3bTV.ygh8roEeius/JRK','login','2026-06-18 21:00:58','2026-06-18 20:56:21',1,5,'2026-06-18 20:55:58','2026-06-18 20:56:21',NULL),(74,'9d7aa8db-59b6-4541-8960-31d75abef2c0',4,'abcd1234@mailinator.com',NULL,'$2b$10$VbMJycFRrRa.v0O7mrcEO.gm1rCF5JlpSTMmNZc5SEaMR2zStzZL2','login','2026-06-18 21:19:12','2026-06-18 21:14:53',2,5,'2026-06-18 21:14:12','2026-06-18 21:14:53',NULL),(75,'9ac4707e-6e05-4307-804b-8f3f466bd52d',4,'abcd1234@mailinator.com',NULL,'$2b$10$VCCy9oi2JSEeNayH0p5Rqe/LCXYXr3s/phw4Xc9q2Af5jCmLGSYhu','login','2026-06-18 21:23:46','2026-06-18 21:19:17',1,5,'2026-06-18 21:18:46','2026-06-18 21:19:17',NULL),(76,'e9dcad0c-a8fd-45fb-9348-c06b68de4e33',4,'abcd1234@mailinator.com',NULL,'$2b$10$y/atAQZo1JqXUC6shbYT4eNNb8dvPZ5eVF7R1bC5fHd14nh54FJma','login','2026-06-18 21:32:27','2026-06-18 21:27:55',1,5,'2026-06-18 21:27:27','2026-06-18 21:27:55',NULL),(77,'d086e67d-5ad8-4108-9f44-515b46703e83',4,'abcd1234@mailinator.com',NULL,'$2b$10$ib6ng7BzwUkZolRpa6CXaeSLyD3ianwR47u7nmbaz.WfSfLihHXUG','login','2026-06-18 21:35:20','2026-06-18 21:30:41',1,5,'2026-06-18 21:30:20','2026-06-18 21:30:41',NULL),(78,'dc308690-f5b5-42ca-b68c-0c41f525596a',4,'abcd1234@mailinator.com',NULL,'$2b$10$Z/ti15qMrcHFxLlalGjCJOP/CHWlzOQd.wNlbNxB6uu4Fu3t/ymaO','login','2026-06-19 12:32:38','2026-06-19 12:28:12',1,5,'2026-06-19 12:27:38','2026-06-19 12:28:12',NULL),(79,'edb63a90-595c-4bc9-a9a5-68c1d2a59bc8',4,'abcd1234@mailinator.com',NULL,'$2b$10$9S0U4SaHFLfS70NZz2yHtugdGZReTCKc3I.cS2p4wmHQBkUDdPH.S','login','2026-06-21 18:15:31','2026-06-21 18:11:09',1,5,'2026-06-21 18:10:31','2026-06-21 18:11:09',NULL),(80,'46d5ba7c-277b-4ee6-a789-59054c0801bb',3,'abcd12345@mailinator.com',NULL,'$2b$10$h92TrbUPneMrzxAIPliCIO.oz/3M5fVyyQaz7PwTW7Q2cSmNVEIsO','login','2026-06-22 09:26:03','2026-06-22 09:21:34',1,5,'2026-06-22 09:21:03','2026-06-22 09:21:34',NULL),(81,'924dac30-eb3e-45f5-85ec-cc90c9dd8db1',4,'abcd1234@mailinator.com',NULL,'$2b$10$DmbeE8bKTUy0PLf7pN4nvu12Q8cs/DOJbocNINMrOcBp6oKuttU3a','login','2026-06-23 11:51:36','2026-06-23 11:47:03',1,5,'2026-06-23 11:46:36','2026-06-23 11:47:03',NULL),(82,'1a8513b2-48c1-4dd3-95db-9a952a05f3da',3,'abcd12345@mailinator.com',NULL,'$2b$10$ZGJGizCZNIEEP5Pwen666OfGlroKIY0ZZHJyQbsjFaqE.ZI0p1ZJm','login','2026-06-23 11:54:02','2026-06-23 11:49:25',1,5,'2026-06-23 11:49:02','2026-06-23 11:49:25',NULL),(83,'4d924389-a9e8-41fc-a5e0-8f9fcefb7163',4,'abcd1234@mailinator.com',NULL,'$2b$10$Z32iLEy6/kjnTdnDKUD92OILH5vtpWG95gRw3MAp85oTr/UeEqmha','login','2026-06-23 11:56:56','2026-06-23 11:52:43',2,5,'2026-06-23 11:51:56','2026-06-23 11:52:43',NULL),(84,'70043fcd-8053-40ea-887d-f3ea1b312316',3,'abcd12345@mailinator.com',NULL,'$2b$10$S4PhPTlewDEKb9T7U0vFtOuieCMYAEWJSMJaARL65cq90kikubCUm','login','2026-06-23 12:05:35','2026-06-23 12:00:59',1,5,'2026-06-23 12:00:35','2026-06-23 12:00:59',NULL);
/*!40000 ALTER TABLE `otp_verifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_tokens` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` char(36) NOT NULL,
  `user_id` int NOT NULL,
  `token_hash` text NOT NULL,
  `expires_at` datetime NOT NULL,
  `used_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `password_reset_tokens_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
INSERT INTO `password_reset_tokens` VALUES (1,'c19fe96b-3e04-4935-92ae-d2f8504a7dcc',4,'f8a83c8b21eec6b20dec03cf627cb22f5893ad1eda8985979b6e5a2b391418be','2026-05-31 05:48:28','2026-05-31 05:34:09','2026-05-31 05:33:28','2026-05-31 05:34:09',NULL);
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` char(36) NOT NULL,
  `user_id` int NOT NULL,
  `centre_id` int DEFAULT NULL,
  `payable_type` enum('event','journal','newsletter','course','subscription','donation') NOT NULL,
  `payable_id` int NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `currency` varchar(10) DEFAULT 'INR',
  `provider` enum('razorpay','cashfree','manual_upi') DEFAULT 'razorpay',
  `provider_order_id` varchar(255) DEFAULT NULL,
  `provider_payment_id` varchar(255) DEFAULT NULL,
  `provider_signature` text,
  `upi_reference_id` varchar(255) DEFAULT NULL,
  `status` enum('created','pending','paid','failed','refunded','cancelled') DEFAULT 'created',
  `paid_at` timestamp NULL DEFAULT NULL,
  `failed_reason` text,
  `raw_response` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  KEY `idx_payments_user_id` (`user_id`),
  KEY `idx_payments_centre_id` (`centre_id`),
  KEY `idx_payments_payable` (`payable_type`,`payable_id`),
  KEY `idx_payments_status` (`status`),
  KEY `idx_payments_provider_order_id` (`provider_order_id`),
  KEY `idx_payments_provider_payment_id` (`provider_payment_id`),
  CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `payments_ibfk_2` FOREIGN KEY (`centre_id`) REFERENCES `centres` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
INSERT INTO `payments` VALUES (1,'ef8a67a5-3e0e-4e81-8a43-739b4c11a208',4,1,'event',1,2000.00,'INR','razorpay','order_Svqmdu0URH7Dxg','pay_Svqmq9dO02tD6M','a1d2bca953338e09d3d97223a525497685d76e65a3a1418ec1cb1f5405f3f60e',NULL,'paid','2026-05-31 05:08:45',NULL,'{\"form_answers\": {\"full_name\": \"Sagar Patel\", \"phone_number\": \"9537992625\"}, \"payment_uuid\": \"ef8a67a5-3e0e-4e81-8a43-739b4c11a208\", \"razorpay_order_id\": \"order_Svqmdu0URH7Dxg\", \"razorpay_signature\": \"a1d2bca953338e09d3d97223a525497685d76e65a3a1418ec1cb1f5405f3f60e\", \"razorpay_payment_id\": \"pay_Svqmq9dO02tD6M\"}','2026-05-31 05:08:16','2026-05-31 05:08:45',NULL);
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `problem_reports`
--

DROP TABLE IF EXISTS `problem_reports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `problem_reports` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` char(36) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `problem_type` enum('login_issue','payment_issue','event_issue','content_issue','app_bug','other') DEFAULT 'other',
  `page_url` text,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `priority` enum('low','medium','high','urgent') DEFAULT 'medium',
  `status` enum('new','in_progress','resolved','closed') DEFAULT 'new',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `problem_reports`
--

LOCK TABLES `problem_reports` WRITE;
/*!40000 ALTER TABLE `problem_reports` DISABLE KEYS */;
/*!40000 ALTER TABLE `problem_reports` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_categories`
--

DROP TABLE IF EXISTS `product_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` char(36) NOT NULL,
  `centre_id` int DEFAULT NULL,
  `name` varchar(150) NOT NULL,
  `slug` varchar(180) NOT NULL,
  `description` text,
  `image_url` text,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  UNIQUE KEY `slug` (`slug`),
  KEY `fk_product_categories_centre` (`centre_id`),
  CONSTRAINT `fk_product_categories_centre` FOREIGN KEY (`centre_id`) REFERENCES `centres` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_categories`
--

LOCK TABLES `product_categories` WRITE;
/*!40000 ALTER TABLE `product_categories` DISABLE KEYS */;
INSERT INTO `product_categories` VALUES (1,'3944e4d0-6eca-11f1-99cb-58bca71263b9',1,'Books','books','Spiritual books and scriptures',NULL,1,'2026-06-23 06:10:24','2026-06-23 06:10:24',NULL),(2,'394513f6-6eca-11f1-99cb-58bca71263b9',1,'Worship Items','worship-items','Items used in deity worship',NULL,1,'2026-06-23 06:10:24','2026-06-23 06:10:24',NULL),(3,'394518e2-6eca-11f1-99cb-58bca71263b9',1,'Prasadam','prasadam','Sacred food and snacks',NULL,1,'2026-06-23 06:10:24','2026-06-23 06:10:24',NULL),(4,'39451aa4-6eca-11f1-99cb-58bca71263b9',1,'Japa & Tulasi','japa-tulasi','Japa bags, malas and chanting items',NULL,1,'2026-06-23 06:10:24','2026-06-23 06:10:24',NULL),(5,'39451be4-6eca-11f1-99cb-58bca71263b9',1,'Deity Accessories','deity-accessories','Deity dresses and accessories',NULL,1,'2026-06-23 06:10:24','2026-06-23 06:10:24',NULL),(6,'39451de2-6eca-11f1-99cb-58bca71263b9',1,'Incense & Lamps','incense-lamps','Agarbatti, ghee lamps and puja items',NULL,1,'2026-06-23 06:10:24','2026-06-23 06:10:24',NULL),(7,'39451f36-6eca-11f1-99cb-58bca71263b9',1,'Children Books','children-books','Books for children and youth',NULL,1,'2026-06-23 06:10:24','2026-06-23 06:10:24',NULL),(8,'39452058-6eca-11f1-99cb-58bca71263b9',1,'Magazines','magazines','Back To Godhead and other magazines',NULL,1,'2026-06-23 06:10:24','2026-06-23 06:10:24',NULL);
/*!40000 ALTER TABLE `product_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_images`
--

DROP TABLE IF EXISTS `product_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_images` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` char(36) NOT NULL,
  `product_id` int NOT NULL,
  `image_url` text NOT NULL,
  `sort_order` int DEFAULT '1',
  `is_primary` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  KEY `fk_product_images_product` (`product_id`),
  CONSTRAINT `fk_product_images_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_images`
--

LOCK TABLES `product_images` WRITE;
/*!40000 ALTER TABLE `product_images` DISABLE KEYS */;
INSERT INTO `product_images` VALUES (1,'bd2d76ae-6eca-11f1-99cb-58bca71263b9',1,'https://images.unsplash.com/photo-1544717305-2782549b5136',1,1,'2026-06-23 06:14:06','2026-06-23 06:14:06',NULL),(2,'bd2d7c6c-6eca-11f1-99cb-58bca71263b9',2,'https://images.unsplash.com/photo-1512820790803-83ca734da794',1,1,'2026-06-23 06:14:06','2026-06-23 06:14:06',NULL),(3,'bd2d7dd4-6eca-11f1-99cb-58bca71263b9',3,'https://images.unsplash.com/photo-1521587760476-6c12a4b040da',1,1,'2026-06-23 06:14:06','2026-06-23 06:14:06',NULL),(4,'bd2d7e9c-6eca-11f1-99cb-58bca71263b9',4,'https://images.unsplash.com/photo-1495446815901-a7297e633e8d',1,1,'2026-06-23 06:14:06','2026-06-23 06:14:06',NULL),(5,'bd2d7f8c-6eca-11f1-99cb-58bca71263b9',5,'https://images.unsplash.com/photo-1607082350899-7e105aa886ae',1,1,'2026-06-23 06:14:06','2026-06-23 06:14:06',NULL),(6,'bd2d8036-6eca-11f1-99cb-58bca71263b9',6,'https://images.unsplash.com/photo-1513151233558-d860c5398176',1,1,'2026-06-23 06:14:06','2026-06-23 06:14:06',NULL),(7,'bd2d80e0-6eca-11f1-99cb-58bca71263b9',7,'https://images.unsplash.com/photo-1499636136210-6f4ee915583e',1,1,'2026-06-23 06:14:06','2026-06-23 06:14:06',NULL),(8,'bd2d8180-6eca-11f1-99cb-58bca71263b9',8,'https://images.unsplash.com/photo-1509440159596-0249088772ff',1,1,'2026-06-23 06:14:06','2026-06-23 06:14:06',NULL),(9,'bd2d8220-6eca-11f1-99cb-58bca71263b9',9,'https://images.unsplash.com/photo-1578985545062-69928b1d9587',1,1,'2026-06-23 06:14:06','2026-06-23 06:14:06',NULL),(10,'bd2d82ca-6eca-11f1-99cb-58bca71263b9',10,'https://images.unsplash.com/photo-1515377905703-c4788e51af15',1,1,'2026-06-23 06:14:06','2026-06-23 06:14:06',NULL),(11,'bd2d836a-6eca-11f1-99cb-58bca71263b9',11,'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee',1,1,'2026-06-23 06:14:06','2026-06-23 06:14:06',NULL),(12,'bd2d840a-6eca-11f1-99cb-58bca71263b9',12,'https://images.unsplash.com/photo-1516979187457-637abb4f9353',1,1,'2026-06-23 06:14:06','2026-06-23 06:14:06',NULL),(13,'bd2d84a0-6eca-11f1-99cb-58bca71263b9',13,'https://images.unsplash.com/photo-1617038220319-276d3cfab638',1,1,'2026-06-23 06:14:06','2026-06-23 06:14:06',NULL),(14,'bd2d8540-6eca-11f1-99cb-58bca71263b9',14,'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da',1,1,'2026-06-23 06:14:06','2026-06-23 06:14:06',NULL),(15,'bd2d85d6-6eca-11f1-99cb-58bca71263b9',15,'https://images.unsplash.com/photo-1507842217343-583bb7270b66',1,1,'2026-06-23 06:14:06','2026-06-23 06:14:06',NULL);
/*!40000 ALTER TABLE `product_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_inventory_logs`
--

DROP TABLE IF EXISTS `product_inventory_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_inventory_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` char(36) NOT NULL,
  `product_id` int NOT NULL,
  `changed_by` int DEFAULT NULL,
  `change_type` enum('add','remove','sale','cancel_return','manual_adjustment') NOT NULL,
  `quantity_change` int NOT NULL,
  `previous_quantity` int NOT NULL,
  `new_quantity` int NOT NULL,
  `note` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  KEY `fk_product_inventory_logs_product` (`product_id`),
  KEY `fk_product_inventory_logs_changed_by` (`changed_by`),
  CONSTRAINT `fk_product_inventory_logs_changed_by` FOREIGN KEY (`changed_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_product_inventory_logs_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_inventory_logs`
--

LOCK TABLES `product_inventory_logs` WRITE;
/*!40000 ALTER TABLE `product_inventory_logs` DISABLE KEYS */;
INSERT INTO `product_inventory_logs` VALUES (1,'45bc0b67-00f1-4851-b2a1-4e6dc3b0666c',2,4,'sale',-1,20,19,'Order ORD-1782215268459-8651','2026-06-23 11:48:11','2026-06-23 11:48:11',NULL);
/*!40000 ALTER TABLE `product_inventory_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_order_items`
--

DROP TABLE IF EXISTS `product_order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_order_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` char(36) NOT NULL,
  `order_id` int NOT NULL,
  `product_id` int DEFAULT NULL,
  `product_title` varchar(255) NOT NULL,
  `product_image_url` text,
  `price_amount` decimal(10,2) NOT NULL,
  `quantity` int NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  KEY `fk_product_order_items_order` (`order_id`),
  KEY `fk_product_order_items_product` (`product_id`),
  CONSTRAINT `fk_product_order_items_order` FOREIGN KEY (`order_id`) REFERENCES `product_orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_product_order_items_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_order_items`
--

LOCK TABLES `product_order_items` WRITE;
/*!40000 ALTER TABLE `product_order_items` DISABLE KEYS */;
INSERT INTO `product_order_items` VALUES (1,'11339009-e789-4a58-b99b-2c2abb33a3e2',1,2,'Srimad Bhagavatam Set','https://images.unsplash.com/photo-1512820790803-83ca734da794',8999.00,1,8999.00,'2026-06-23 11:47:48','2026-06-23 11:47:48',NULL);
/*!40000 ALTER TABLE `product_order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_orders`
--

DROP TABLE IF EXISTS `product_orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` char(36) NOT NULL,
  `user_id` int NOT NULL,
  `shipping_address_id` int DEFAULT NULL,
  `coupon_id` int DEFAULT NULL,
  `coupon_code` varchar(100) DEFAULT NULL,
  `order_number` varchar(50) NOT NULL,
  `subtotal_amount` decimal(10,2) DEFAULT '0.00',
  `shipping_amount` decimal(10,2) DEFAULT '0.00',
  `discount_amount` decimal(10,2) DEFAULT '0.00',
  `total_amount` decimal(10,2) DEFAULT '0.00',
  `currency` varchar(10) DEFAULT 'INR',
  `payment_status` enum('pending','success','failed','refunded') DEFAULT 'pending',
  `order_status` enum('pending','confirmed','packed','shipped','delivered','cancelled') DEFAULT 'pending',
  `courier_name` varchar(255) DEFAULT NULL,
  `tracking_number` varchar(255) DEFAULT NULL,
  `tracking_url` text,
  `shipped_at` timestamp NULL DEFAULT NULL,
  `delivered_at` timestamp NULL DEFAULT NULL,
  `razorpay_order_id` varchar(255) DEFAULT NULL,
  `razorpay_payment_id` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  UNIQUE KEY `order_number` (`order_number`),
  KEY `fk_product_orders_user` (`user_id`),
  KEY `fk_product_orders_shipping_address` (`shipping_address_id`),
  KEY `fk_product_orders_coupon` (`coupon_id`),
  CONSTRAINT `fk_product_orders_coupon` FOREIGN KEY (`coupon_id`) REFERENCES `shop_coupons` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_product_orders_shipping_address` FOREIGN KEY (`shipping_address_id`) REFERENCES `shipping_addresses` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_product_orders_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_orders`
--

LOCK TABLES `product_orders` WRITE;
/*!40000 ALTER TABLE `product_orders` DISABLE KEYS */;
INSERT INTO `product_orders` VALUES (1,'d5804978-563a-419e-b42f-6386a42b34e9',4,1,NULL,NULL,'ORD-1782215268459-8651',8999.00,0.00,0.00,8999.00,'INR','success','packed',NULL,NULL,NULL,NULL,NULL,'order_T53sSa6L35dXGQ','pay_T53saVRRNq5mPH','2026-06-23 11:47:48','2026-06-23 11:51:12',NULL);
/*!40000 ALTER TABLE `product_orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_payments`
--

DROP TABLE IF EXISTS `product_payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_payments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` char(36) NOT NULL,
  `order_id` int NOT NULL,
  `user_id` int NOT NULL,
  `provider` enum('razorpay') DEFAULT 'razorpay',
  `provider_order_id` varchar(255) DEFAULT NULL,
  `provider_payment_id` varchar(255) DEFAULT NULL,
  `provider_signature` text,
  `amount` decimal(10,2) NOT NULL,
  `currency` varchar(10) DEFAULT 'INR',
  `status` enum('pending','success','failed','refunded') DEFAULT 'pending',
  `raw_response` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  KEY `fk_product_payments_order` (`order_id`),
  KEY `fk_product_payments_user` (`user_id`),
  CONSTRAINT `fk_product_payments_order` FOREIGN KEY (`order_id`) REFERENCES `product_orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_product_payments_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_payments`
--

LOCK TABLES `product_payments` WRITE;
/*!40000 ALTER TABLE `product_payments` DISABLE KEYS */;
INSERT INTO `product_payments` VALUES (1,'f8c7a6cf-42d1-43f6-bcaa-f34772f43b4f',1,4,'razorpay','order_T53sSa6L35dXGQ','pay_T53saVRRNq5mPH','ac59c9f8057cf3ed23e23cbd454403255978b5df07d6af3f6db0d53125f2c661',8999.00,'INR','success','{\"order_uuid\": \"d5804978-563a-419e-b42f-6386a42b34e9\", \"razorpay_order_id\": \"order_T53sSa6L35dXGQ\", \"razorpay_signature\": \"ac59c9f8057cf3ed23e23cbd454403255978b5df07d6af3f6db0d53125f2c661\", \"razorpay_payment_id\": \"pay_T53saVRRNq5mPH\"}','2026-06-23 11:47:48','2026-06-23 11:48:11',NULL);
/*!40000 ALTER TABLE `product_payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_reviews`
--

DROP TABLE IF EXISTS `product_reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_reviews` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` char(36) NOT NULL,
  `product_id` int NOT NULL,
  `user_id` int NOT NULL,
  `order_id` int DEFAULT NULL,
  `rating` int NOT NULL,
  `review_text` text,
  `status` enum('pending','approved','rejected') DEFAULT 'approved',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  UNIQUE KEY `unique_user_product_review` (`user_id`,`product_id`),
  KEY `fk_product_reviews_product` (`product_id`),
  KEY `fk_product_reviews_order` (`order_id`),
  CONSTRAINT `fk_product_reviews_order` FOREIGN KEY (`order_id`) REFERENCES `product_orders` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_product_reviews_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_product_reviews_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_reviews`
--

LOCK TABLES `product_reviews` WRITE;
/*!40000 ALTER TABLE `product_reviews` DISABLE KEYS */;
/*!40000 ALTER TABLE `product_reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` char(36) NOT NULL,
  `centre_id` int DEFAULT NULL,
  `category_id` int NOT NULL,
  `created_by` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text,
  `sku` varchar(100) DEFAULT NULL,
  `price_amount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `currency` varchar(10) DEFAULT 'INR',
  `stock_quantity` int NOT NULL DEFAULT '0',
  `low_stock_alert` int NOT NULL DEFAULT '5',
  `weight_grams` int DEFAULT NULL,
  `is_featured` tinyint(1) DEFAULT '0',
  `status` enum('draft','published','out_of_stock','inactive') DEFAULT 'draft',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  UNIQUE KEY `slug` (`slug`),
  KEY `fk_products_centre` (`centre_id`),
  KEY `fk_products_category` (`category_id`),
  KEY `fk_products_created_by` (`created_by`),
  CONSTRAINT `fk_products_category` FOREIGN KEY (`category_id`) REFERENCES `product_categories` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_products_centre` FOREIGN KEY (`centre_id`) REFERENCES `centres` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_products_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'b155b648-6eca-11f1-99cb-58bca71263b9',1,1,3,'Bhagavad Gita As It Is','bhagavad-gita-as-it-is','Complete Bhagavad Gita by Srila Prabhupada',NULL,399.00,'INR',100,10,NULL,0,'published','2026-06-23 06:13:46','2026-06-23 06:13:46',NULL),(2,'b155beea-6eca-11f1-99cb-58bca71263b9',1,1,3,'Srimad Bhagavatam Set','srimad-bhagavatam-set','Full Bhagavatam collection',NULL,8999.00,'INR',19,5,NULL,0,'published','2026-06-23 06:13:46','2026-06-23 11:48:11',NULL),(3,'b155c11a-6eca-11f1-99cb-58bca71263b9',1,1,3,'Chaitanya Charitamrita Set','chaitanya-charitamrita-set','Full CC collection',NULL,11999.00,'INR',15,5,NULL,0,'published','2026-06-23 06:13:46','2026-06-23 06:13:46',NULL),(4,'b155c30e-6eca-11f1-99cb-58bca71263b9',1,1,3,'Perfect Questions Perfect Answers','perfect-questions-perfect-answers','Pocket book',NULL,99.00,'INR',200,20,NULL,0,'published','2026-06-23 06:13:46','2026-06-23 06:13:46',NULL),(5,'b155c46c-6eca-11f1-99cb-58bca71263b9',1,2,3,'Vaishnava Tilak Pack','vaishnava-tilak-pack','Traditional Tilak',NULL,50.00,'INR',300,25,NULL,0,'published','2026-06-23 06:13:46','2026-06-23 06:13:46',NULL),(6,'b155c5c0-6eca-11f1-99cb-58bca71263b9',1,2,3,'Ghee Lamp Set','ghee-lamp-set','Brass ghee lamp',NULL,299.00,'INR',50,5,NULL,0,'published','2026-06-23 06:13:46','2026-06-23 06:13:46',NULL),(7,'b155c6f6-6eca-11f1-99cb-58bca71263b9',1,3,3,'Mahaprasadam Cookies','mahaprasadam-cookies','Fresh cookies prasadam',NULL,120.00,'INR',150,10,NULL,0,'published','2026-06-23 06:13:46','2026-06-23 06:13:46',NULL),(8,'b155c840-6eca-11f1-99cb-58bca71263b9',1,3,3,'Khakhra Prasadam Pack','khakhra-prasadam-pack','Healthy prasadam snack',NULL,90.00,'INR',100,10,NULL,0,'published','2026-06-23 06:13:46','2026-06-23 06:13:46',NULL),(9,'b155c96c-6eca-11f1-99cb-58bca71263b9',1,3,3,'Dry Sweet Prasadam Box','dry-sweet-prasadam-box','Festival sweet prasadam',NULL,250.00,'INR',75,10,NULL,0,'published','2026-06-23 06:13:46','2026-06-23 06:13:46',NULL),(10,'b155ca98-6eca-11f1-99cb-58bca71263b9',1,4,3,'Tulasi Mala','tulasi-mala','Authentic tulasi beads',NULL,150.00,'INR',200,20,NULL,0,'published','2026-06-23 06:13:46','2026-06-23 06:13:46',NULL),(11,'b155cbf6-6eca-11f1-99cb-58bca71263b9',1,4,3,'Japa Bag','japa-bag','Traditional chanting bag',NULL,199.00,'INR',120,10,NULL,0,'published','2026-06-23 06:13:46','2026-06-23 06:13:46',NULL),(12,'b155cd22-6eca-11f1-99cb-58bca71263b9',1,5,3,'Radha Krishna Dress Set','radha-krishna-dress-set','Festival deity dress',NULL,1499.00,'INR',25,3,NULL,0,'published','2026-06-23 06:13:46','2026-06-23 06:13:46',NULL),(13,'b155ce4e-6eca-11f1-99cb-58bca71263b9',1,5,3,'Deity Jewelry Set','deity-jewelry-set','Decorative deity jewelry',NULL,999.00,'INR',30,3,NULL,0,'published','2026-06-23 06:13:46','2026-06-23 06:13:46',NULL),(14,'b155cf70-6eca-11f1-99cb-58bca71263b9',1,6,3,'Sandalwood Agarbatti','sandalwood-agarbatti','Premium incense',NULL,80.00,'INR',500,50,NULL,0,'published','2026-06-23 06:13:46','2026-06-23 06:13:46',NULL),(15,'b155d0a6-6eca-11f1-99cb-58bca71263b9',1,8,3,'Back To Godhead Magazine','back-to-godhead-magazine','Latest BTG issue',NULL,60.00,'INR',300,20,NULL,0,'published','2026-06-23 06:13:46','2026-06-23 06:13:46',NULL);
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `progress_levels`
--

DROP TABLE IF EXISTS `progress_levels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `progress_levels` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` char(36) NOT NULL,
  `name` varchar(100) NOT NULL,
  `slug` varchar(100) NOT NULL,
  `level_order` int NOT NULL,
  `min_score` int NOT NULL,
  `max_score` int NOT NULL,
  `description` text,
  `recommendation_text` text,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `progress_levels`
--

LOCK TABLES `progress_levels` WRITE;
/*!40000 ALTER TABLE `progress_levels` DISABLE KEYS */;
INSERT INTO `progress_levels` VALUES (1,'c3c537d8-5e51-11f1-91b3-81997ca2b9b7','New Seeker','new-seeker',1,0,30,'Just starting devotional journey.','Recommend beginner-friendly journals and basic Krishna consciousness newsletters.',1,'2026-06-02 07:07:49','2026-06-02 07:07:49',NULL),(2,'c3c55498-5e51-11f1-91b3-81997ca2b9b7','Beginner Devotee','beginner-devotee',2,31,80,'Started regular chanting, lectures, and reading.','Recommend foundational Bhagavad Gita, chanting, and daily sadhana content.',1,'2026-06-02 07:07:49','2026-06-02 07:07:49',NULL),(3,'c3c556a0-5e51-11f1-91b3-81997ca2b9b7','Practicing Devotee','practicing-devotee',3,81,160,'Maintaining consistent spiritual habits.','Recommend deeper bhakti practice, seva, association, and scripture content.',1,'2026-06-02 07:07:49','2026-06-02 07:07:49',NULL),(4,'c3c55876-5e51-11f1-91b3-81997ca2b9b7','Committed Devotee','committed-devotee',4,161,280,'Strongly committed to chanting, reading, and lectures.','Recommend advanced devotional philosophy and practical seva content.',1,'2026-06-02 07:07:49','2026-06-02 07:07:49',NULL),(5,'c3c5595c-5e51-11f1-91b3-81997ca2b9b7','Advanced Practitioner','advanced-practitioner',5,281,999999,'Advanced and steady in devotional practice.','Recommend advanced philosophy, leadership, preaching, and seva guidance.',1,'2026-06-02 07:07:49','2026-06-02 07:07:49',NULL);
/*!40000 ALTER TABLE `progress_levels` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` char(36) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `unique_roles_uuid` (`uuid`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'72cc52aa-57a1-11f1-8ab1-5f0a17545fdf','ADMIN','System administrator','2026-05-24 18:47:26','2026-05-24 18:50:35',NULL),(2,'72cc5732-57a1-11f1-8ab1-5f0a17545fdf','DEVOTEE','Approved devotee','2026-05-24 18:47:26','2026-05-24 18:50:35',NULL),(3,'72cc58ea-57a1-11f1-8ab1-5f0a17545fdf','SEEKER','Regular seeker/user','2026-05-24 18:47:26','2026-05-24 18:50:35',NULL);
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shipping_addresses`
--

DROP TABLE IF EXISTS `shipping_addresses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shipping_addresses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` char(36) NOT NULL,
  `user_id` int NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `address_line_1` varchar(255) NOT NULL,
  `address_line_2` varchar(255) DEFAULT NULL,
  `landmark` varchar(255) DEFAULT NULL,
  `city` varchar(100) NOT NULL,
  `state_code` varchar(20) DEFAULT NULL,
  `country_code` varchar(20) DEFAULT 'IN',
  `postal_code` varchar(20) NOT NULL,
  `is_default` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  KEY `fk_shipping_addresses_user` (`user_id`),
  CONSTRAINT `fk_shipping_addresses_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shipping_addresses`
--

LOCK TABLES `shipping_addresses` WRITE;
/*!40000 ALTER TABLE `shipping_addresses` DISABLE KEYS */;
INSERT INTO `shipping_addresses` VALUES (1,'4aaa4d7b-8ec0-463e-a55a-88938880dee5',4,'sagar patel','09537992625','Gst Crossing road anand nagar ranip','D504 bakeri sarvesh',NULL,'Ahmedabad','GJ','IN','382480',1,'2026-06-23 11:47:43','2026-06-23 11:47:43',NULL);
/*!40000 ALTER TABLE `shipping_addresses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shop_coupon_usages`
--

DROP TABLE IF EXISTS `shop_coupon_usages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shop_coupon_usages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` char(36) NOT NULL,
  `coupon_id` int NOT NULL,
  `user_id` int NOT NULL,
  `order_id` int NOT NULL,
  `discount_amount` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  KEY `fk_coupon_usages_coupon` (`coupon_id`),
  KEY `fk_coupon_usages_user` (`user_id`),
  KEY `fk_coupon_usages_order` (`order_id`),
  CONSTRAINT `fk_coupon_usages_coupon` FOREIGN KEY (`coupon_id`) REFERENCES `shop_coupons` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_coupon_usages_order` FOREIGN KEY (`order_id`) REFERENCES `product_orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_coupon_usages_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shop_coupon_usages`
--

LOCK TABLES `shop_coupon_usages` WRITE;
/*!40000 ALTER TABLE `shop_coupon_usages` DISABLE KEYS */;
/*!40000 ALTER TABLE `shop_coupon_usages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shop_coupons`
--

DROP TABLE IF EXISTS `shop_coupons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shop_coupons` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` char(36) NOT NULL,
  `code` varchar(100) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `discount_type` enum('percentage','fixed') NOT NULL,
  `discount_value` decimal(10,2) NOT NULL,
  `min_order_amount` decimal(10,2) DEFAULT '0.00',
  `max_discount_amount` decimal(10,2) DEFAULT NULL,
  `usage_limit` int DEFAULT NULL,
  `used_count` int DEFAULT '0',
  `per_user_limit` int DEFAULT '1',
  `start_at` datetime DEFAULT NULL,
  `end_at` datetime DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_by` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  UNIQUE KEY `code` (`code`),
  KEY `fk_shop_coupons_created_by` (`created_by`),
  CONSTRAINT `fk_shop_coupons_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shop_coupons`
--

LOCK TABLES `shop_coupons` WRITE;
/*!40000 ALTER TABLE `shop_coupons` DISABLE KEYS */;
/*!40000 ALTER TABLE `shop_coupons` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `trip_day_places`
--

DROP TABLE IF EXISTS `trip_day_places`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `trip_day_places` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` char(36) NOT NULL,
  `trip_day_id` int NOT NULL,
  `place_name` varchar(255) NOT NULL,
  `description` text,
  `visit_time` time DEFAULT NULL,
  `location_url` text,
  `image_url` text,
  `sort_order` int DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  KEY `trip_day_id` (`trip_day_id`),
  CONSTRAINT `trip_day_places_ibfk_1` FOREIGN KEY (`trip_day_id`) REFERENCES `trip_days` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `trip_day_places`
--

LOCK TABLES `trip_day_places` WRITE;
/*!40000 ALTER TABLE `trip_day_places` DISABLE KEYS */;
INSERT INTO `trip_day_places` VALUES (1,'60f60e22-5dc3-11f1-91b3-81997ca2b9b7',1,'Temple of the Vedic Planetarium','Main temple darshan.','17:00:00',NULL,NULL,1,'2026-06-01 14:08:35','2026-06-01 14:08:35',NULL),(2,'60f615e8-5dc3-11f1-91b3-81997ca2b9b7',1,'Srila Prabhupada Pushpa Samadhi','Visit Pushpa Samadhi.','18:30:00',NULL,NULL,2,'2026-06-01 14:08:35','2026-06-01 14:08:35',NULL),(3,'693573b6-5dc3-11f1-91b3-81997ca2b9b7',2,'Yogapith','Birthplace of Sri Chaitanya Mahaprabhu.','08:00:00',NULL,NULL,1,'2026-06-01 14:08:49','2026-06-01 14:08:49',NULL),(4,'69357be0-5dc3-11f1-91b3-81997ca2b9b7',2,'Srivas Angan','Historic kirtan location.','11:00:00',NULL,NULL,2,'2026-06-01 14:08:49','2026-06-01 14:08:49',NULL),(5,'69357dc0-5dc3-11f1-91b3-81997ca2b9b7',2,'Godrumdwip','Parikrama stop.','15:00:00',NULL,NULL,3,'2026-06-01 14:08:49','2026-06-01 14:08:49',NULL),(6,'706cef1a-5dc3-11f1-91b3-81997ca2b9b7',3,'Mangala Aarti','Early morning temple program.','04:30:00',NULL,NULL,1,'2026-06-01 14:09:01','2026-06-01 14:09:01',NULL),(7,'706cf5e6-5dc3-11f1-91b3-81997ca2b9b7',3,'Temple Darshan','Final darshan before departure.','07:00:00',NULL,NULL,2,'2026-06-01 14:09:01','2026-06-01 14:09:01',NULL),(8,'d82e4534-53ad-4784-94b4-91fa663c1919',4,'Temple of the Vedic Planetarium','Main temple darshan.','17:00:00',NULL,NULL,1,'2026-06-22 09:50:07','2026-06-22 09:50:07',NULL),(9,'5e38777a-b752-4b19-bcae-c22cc22df353',4,'Srila Prabhupada Pushpa Samadhi','Visit Pushpa Samadhi.','18:30:00',NULL,NULL,2,'2026-06-22 09:50:07','2026-06-22 09:50:07',NULL),(10,'757ce87f-9906-4c12-9e6a-222359df24a9',5,'Yogapith','Birthplace of Sri Chaitanya Mahaprabhu.','08:00:00',NULL,NULL,1,'2026-06-22 09:50:07','2026-06-22 09:50:07',NULL),(11,'68388514-19e0-4696-8085-92dd486ec9ca',5,'Srivas Angan','Historic kirtan location.','11:00:00',NULL,NULL,2,'2026-06-22 09:50:07','2026-06-22 09:50:07',NULL),(12,'e4a567b3-8aa7-49ae-a7a8-e3f7b8c2405e',5,'Godrumdwip','Parikrama stop.','15:00:00',NULL,NULL,3,'2026-06-22 09:50:07','2026-06-22 09:50:07',NULL),(13,'9ddf1e9a-0d7e-4a47-8d0f-b6742a9ff23e',6,'Mangala Aarti','Early morning temple program.','04:30:00',NULL,NULL,1,'2026-06-22 09:50:07','2026-06-22 09:50:07',NULL),(14,'58180c07-40be-4e09-8381-8adbc80a1c1e',6,'Temple Darshan','Final darshan before departure.','07:00:00',NULL,NULL,2,'2026-06-22 09:50:07','2026-06-22 09:50:07',NULL);
/*!40000 ALTER TABLE `trip_day_places` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `trip_days`
--

DROP TABLE IF EXISTS `trip_days`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `trip_days` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` char(36) NOT NULL,
  `trip_id` int NOT NULL,
  `day_number` int NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text,
  `date` date DEFAULT NULL,
  `breakfast_info` text,
  `lunch_info` text,
  `dinner_info` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  KEY `trip_id` (`trip_id`),
  CONSTRAINT `trip_days_ibfk_1` FOREIGN KEY (`trip_id`) REFERENCES `trips` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `trip_days`
--

LOCK TABLES `trip_days` WRITE;
/*!40000 ALTER TABLE `trip_days` DISABLE KEYS */;
INSERT INTO `trip_days` VALUES (1,'52d57d32-5dc3-11f1-91b3-81997ca2b9b7',1,1,'Arrival and Temple Visit','Arrival in Mayapur and evening temple programs.','2026-12-18','Prasadam at Airport','Govinda Restaurant','Temple Prasadam','2026-06-01 14:08:11','2026-06-22 09:50:07','2026-06-22 09:50:07'),(2,'52d5864c-5dc3-11f1-91b3-81997ca2b9b7',1,2,'Nava Dvipa Parikrama','Full day parikrama of holy places.','2026-12-19','Guest House Prasadam','Packed Prasadam','Temple Feast','2026-06-01 14:08:11','2026-06-22 09:50:07','2026-06-22 09:50:07'),(3,'52d58886-5dc3-11f1-91b3-81997ca2b9b7',1,3,'Mangala Aarti and Departure','Morning programs and return journey.','2026-12-20','Guest House Prasadam','Temple Prasadam','Travel Meal','2026-06-01 14:08:11','2026-06-22 09:50:07','2026-06-22 09:50:07'),(4,'a651cc7a-833e-4161-a1c6-d5c8b7d7f4b1',1,1,'Arrival and Temple Visit','Arrival in Mayapur and evening temple programs.','2026-12-18','Prasadam at Airport','Govinda Restaurant','Temple Prasadam','2026-06-22 09:50:07','2026-06-22 09:50:07',NULL),(5,'65dfbfd0-9741-49e4-a66d-32d10567c640',1,2,'Nava Dvipa Parikrama','Full day parikrama of holy places.','2026-12-19','Guest House Prasadam','Packed Prasadam','Temple Feast','2026-06-22 09:50:07','2026-06-22 09:50:07',NULL),(6,'faa3f6e4-53ae-4eea-8dad-04dc2e116afc',1,3,'Mangala Aarti and Departure','Morning programs and return journey.','2026-12-20','Guest House Prasadam','Temple Prasadam','Travel Meal','2026-06-22 09:50:07','2026-06-22 09:50:07',NULL);
/*!40000 ALTER TABLE `trip_days` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `trip_payments`
--

DROP TABLE IF EXISTS `trip_payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `trip_payments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` char(36) NOT NULL,
  `trip_id` int NOT NULL,
  `registration_id` int DEFAULT NULL,
  `user_id` int NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `currency` varchar(10) DEFAULT 'INR',
  `provider` enum('razorpay','cashfree','manual_upi') DEFAULT 'razorpay',
  `provider_order_id` varchar(255) DEFAULT NULL,
  `provider_payment_id` varchar(255) DEFAULT NULL,
  `provider_signature` text,
  `provider_refund_id` varchar(255) DEFAULT NULL,
  `transaction_id` varchar(255) DEFAULT NULL,
  `payment_status` enum('pending','success','failed','refund_pending','refunded','refund_failed') DEFAULT 'pending',
  `paid_at` datetime DEFAULT NULL,
  `refunded_at` datetime DEFAULT NULL,
  `failed_reason` text,
  `refund_reason` text,
  `raw_response` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  KEY `trip_id` (`trip_id`),
  KEY `registration_id` (`registration_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `trip_payments_ibfk_1` FOREIGN KEY (`trip_id`) REFERENCES `trips` (`id`) ON DELETE CASCADE,
  CONSTRAINT `trip_payments_ibfk_2` FOREIGN KEY (`registration_id`) REFERENCES `trip_registrations` (`id`) ON DELETE SET NULL,
  CONSTRAINT `trip_payments_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `trip_payments`
--

LOCK TABLES `trip_payments` WRITE;
/*!40000 ALTER TABLE `trip_payments` DISABLE KEYS */;
/*!40000 ALTER TABLE `trip_payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `trip_registrations`
--

DROP TABLE IF EXISTS `trip_registrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `trip_registrations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` char(36) NOT NULL,
  `trip_id` int NOT NULL,
  `user_id` int NOT NULL,
  `payment_id` int DEFAULT NULL,
  `full_name` varchar(255) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `age` int DEFAULT NULL,
  `gender` enum('male','female','other') DEFAULT NULL,
  `emergency_contact_name` varchar(255) DEFAULT NULL,
  `emergency_contact_phone` varchar(20) DEFAULT NULL,
  `registration_status` enum('pending','confirmed','cancelled','rejected') DEFAULT 'pending',
  `payment_status` enum('not_required','pending','success','failed','refunded') DEFAULT 'not_required',
  `notes` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  KEY `trip_id` (`trip_id`),
  KEY `user_id` (`user_id`),
  KEY `fk_trip_registration_payment` (`payment_id`),
  CONSTRAINT `fk_trip_registration_payment` FOREIGN KEY (`payment_id`) REFERENCES `trip_payments` (`id`) ON DELETE SET NULL,
  CONSTRAINT `trip_registrations_ibfk_1` FOREIGN KEY (`trip_id`) REFERENCES `trips` (`id`) ON DELETE CASCADE,
  CONSTRAINT `trip_registrations_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `trip_registrations`
--

LOCK TABLES `trip_registrations` WRITE;
/*!40000 ALTER TABLE `trip_registrations` DISABLE KEYS */;
/*!40000 ALTER TABLE `trip_registrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `trip_stays`
--

DROP TABLE IF EXISTS `trip_stays`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `trip_stays` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` char(36) NOT NULL,
  `trip_id` int NOT NULL,
  `stay_name` varchar(255) NOT NULL,
  `stay_type` enum('ashram','hotel','guest_house','dharamshala','other') DEFAULT 'other',
  `address` text,
  `check_in_date` date DEFAULT NULL,
  `check_out_date` date DEFAULT NULL,
  `contact_phone` varchar(20) DEFAULT NULL,
  `location_url` text,
  `notes` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  KEY `trip_id` (`trip_id`),
  CONSTRAINT `trip_stays_ibfk_1` FOREIGN KEY (`trip_id`) REFERENCES `trips` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `trip_stays`
--

LOCK TABLES `trip_stays` WRITE;
/*!40000 ALTER TABLE `trip_stays` DISABLE KEYS */;
INSERT INTO `trip_stays` VALUES (1,'767463ac-5dc3-11f1-91b3-81997ca2b9b7',1,'ISKCON Mayapur Guest House','ashram','Sri Mayapur Dham, Nadia, West Bengal','2026-12-18','2026-12-20','03312345678',NULL,'Shared AC rooms with attached bathrooms.','2026-06-01 14:09:11','2026-06-22 09:50:07','2026-06-22 09:50:07'),(2,'c04791b7-752a-421e-a869-ffde2c8fcb52',1,'ISKCON Mayapur Guest House','ashram','Sri Mayapur Dham, Nadia, West Bengal','2026-12-18','2026-12-20','03312345678',NULL,'Shared AC rooms with attached bathrooms.','2026-06-22 09:50:07','2026-06-22 09:50:07',NULL);
/*!40000 ALTER TABLE `trip_stays` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `trips`
--

DROP TABLE IF EXISTS `trips`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `trips` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` char(36) NOT NULL,
  `centre_id` int DEFAULT NULL,
  `created_by` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `description` text,
  `cover_image_url` text,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `departure_city` varchar(150) DEFAULT NULL,
  `destination` varchar(255) NOT NULL,
  `meeting_point` varchar(255) DEFAULT NULL,
  `meeting_time` time DEFAULT NULL,
  `price_amount` decimal(10,2) DEFAULT '0.00',
  `currency` varchar(10) DEFAULT 'INR',
  `is_paid` tinyint(1) DEFAULT '0',
  `max_capacity` int DEFAULT NULL,
  `registration_start_date` datetime DEFAULT NULL,
  `registration_end_date` datetime DEFAULT NULL,
  `includes` text,
  `excludes` text,
  `rules` text,
  `contact_name` varchar(150) DEFAULT NULL,
  `contact_phone` varchar(20) DEFAULT NULL,
  `status` enum('draft','published','cancelled','completed') DEFAULT 'draft',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `trips`
--

LOCK TABLES `trips` WRITE;
/*!40000 ALTER TABLE `trips` DISABLE KEYS */;
INSERT INTO `trips` VALUES (1,'3b00043e-5dc3-11f1-91b3-81997ca2b9b7',1,3,'Sri Mayapur Dham Yatra 2026','sri-mayapur-dham-yatra-2026','Join devotees for a spiritually uplifting 3-day pilgrimage to Sri Mayapur Dham, birthplace of Sri Chaitanya Mahaprabhu.','/uploads/trips/1782121807098-525722509.jpg','2026-12-18','2026-12-20','Ahmedabad','Mayapur','Ahmedabad Airport','06:00:00',7999.00,'INR',1,50,'2026-09-01 00:00:00','2026-12-10 23:59:59','Accommodation, Breakfast, Lunch, Dinner, Temple Transport','Flight Tickets, Personal Shopping','Follow temple standards and attend all scheduled programs.','Rup Govind Das','9876543210','published','2026-06-01 14:07:31','2026-06-22 09:50:07',NULL);
/*!40000 ALTER TABLE `trips` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_roles`
--

DROP TABLE IF EXISTS `user_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` char(36) NOT NULL,
  `user_id` int NOT NULL,
  `role_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_role` (`user_id`,`role_id`),
  UNIQUE KEY `unique_user_roles_uuid` (`uuid`),
  KEY `fk_user_roles_role` (`role_id`),
  CONSTRAINT `fk_user_roles_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_user_roles_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_roles`
--

LOCK TABLES `user_roles` WRITE;
/*!40000 ALTER TABLE `user_roles` DISABLE KEYS */;
INSERT INTO `user_roles` VALUES (2,'3ca187e6-c27f-4d25-b91c-dbfdad454c90',2,1,'2026-05-24 19:58:33','2026-06-03 13:35:20',NULL),(3,'5e73ff49-db9b-4e50-80ac-073f0f76870b',3,2,'2026-05-24 20:20:15','2026-05-24 20:20:15',NULL),(4,'7df74b53-cad3-4172-a15f-912dad4d35ef',4,3,'2026-05-26 07:23:14','2026-05-26 07:23:14',NULL);
/*!40000 ALTER TABLE `user_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` char(36) NOT NULL,
  `centre_id` int DEFAULT NULL,
  `first_name` varchar(150) NOT NULL,
  `last_name` varchar(150) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `password_hash` text NOT NULL,
  `gender` enum('male','female','other') DEFAULT NULL,
  `country_code` varchar(10) DEFAULT NULL,
  `state_code` varchar(10) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `address_line_1` varchar(255) DEFAULT NULL,
  `address_line_2` varchar(255) DEFAULT NULL,
  `landmark` varchar(255) DEFAULT NULL,
  `postal_code` varchar(20) DEFAULT NULL,
  `profile_image_url` text,
  `is_active` tinyint(1) DEFAULT '1',
  `is_email_verified` tinyint(1) DEFAULT '0',
  `is_phone_verified` tinyint(1) DEFAULT '0',
  `last_login_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `is_verified_devotee` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_users_uuid` (`uuid`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `phone` (`phone`),
  KEY `fk_users_centre` (`centre_id`),
  CONSTRAINT `fk_users_centre` FOREIGN KEY (`centre_id`) REFERENCES `centres` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (2,'3df1013b-4c52-43c5-b725-8e8b0338c6cd',1,'Sagar','Patel','sagar.demo0412@gmail.com','9876543210','$2b$10$H.YR3qZSJLjmOqqXnFcn0eLLV6dQsZB7on0F2NBbgVRfBjmJnMKN2',NULL,'IN','GJ','Ahmedabad','SG Highway','Near ISKCON Temple','ISKCON Cross Road','380015',NULL,1,0,0,NULL,'2026-05-24 19:58:33','2026-06-03 13:35:55',NULL,0),(3,'fa9d23f4-036d-4d29-bd44-77610940ca9c',1,'Rup','Govind Das','abcd12345@mailinator.com','9876543211','$2b$10$K4CayYAgMf6gj.T0NRSsCe.LOGC1y5SV4bG7K.hDHett2w4Jiz9NK','male','IN','GJ','Ahmedabad','Sattelite road','Iskcon temple','iscon 4 road','382480',NULL,1,1,0,NULL,'2026-05-24 20:20:15','2026-06-06 03:33:09',NULL,1),(4,'3ae1c0b5-0d39-4b63-b22a-279502b45199',1,'Sagar','Patel','abcd1234@mailinator.com','9876543212','$2b$10$HA7fldlz7sIfPG7Y./lEleEeNHTLANHoSqbeG46F1vaCJa5m9Ao5W',NULL,'IN','GJ','Ahmedabad',NULL,NULL,NULL,NULL,NULL,1,0,0,NULL,'2026-05-26 07:23:14','2026-06-16 23:32:17',NULL,0);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wishlists`
--

DROP TABLE IF EXISTS `wishlists`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wishlists` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` char(36) NOT NULL,
  `user_id` int NOT NULL,
  `product_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  UNIQUE KEY `unique_user_product_wishlist` (`user_id`,`product_id`),
  KEY `fk_wishlists_product` (`product_id`),
  CONSTRAINT `fk_wishlists_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_wishlists_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wishlists`
--

LOCK TABLES `wishlists` WRITE;
/*!40000 ALTER TABLE `wishlists` DISABLE KEYS */;
INSERT INTO `wishlists` VALUES (1,'043ea6ae-67e9-498b-9ad4-3210ee636173',3,1,'2026-06-23 18:08:51','2026-06-23 18:09:17','2026-06-23 18:09:17');
/*!40000 ALTER TABLE `wishlists` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'iskcon_mobile_database'
--
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-23 23:44:53
