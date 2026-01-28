create database attendance_tracker;
use attendance_tracker;
CREATE TABLE `employees` (
  `id` int NOT NULL AUTO_INCREMENT,
  `employee_id` varchar(20) NOT NULL,
  `pin` varchar(6) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `department` varchar(100) DEFAULT NULL,
  `position` varchar(100) DEFAULT NULL,
  `face_encoding` text,
  `auth_location_id` int DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `is_admin` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `employee_id` (`employee_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `authorized_locations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `latitude` decimal(10,8) NOT NULL,
  `longitude` decimal(11,8) NOT NULL,
  `radius_meters` int DEFAULT '200',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `attendance_records` (
  `id` int NOT NULL AUTO_INCREMENT,
  `auth_location_id` int NOT NULL,
  `employee_id` int NOT NULL,
  `session_type` enum('morning','lunch','afternoon','evening') NOT NULL,
  `clock_in` timestamp NULL DEFAULT NULL,
  `clock_out` timestamp NULL DEFAULT NULL,
  `clock_in_location` text,
  `clock_out_location` text,
  `date` date NOT NULL DEFAULT (curdate()),
  `notes` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `face_in` longtext,
  `face_out` longtext,
  `clock_in_verified` varchar(10) DEFAULT NULL,
  `clock_out_verified` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_attendance_location` (`auth_location_id`),
  KEY `fk_attendance_employee` (`employee_id`),
  CONSTRAINT `fk_attendance_employee` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_attendance_location` FOREIGN KEY (`auth_location_id`) REFERENCES `authorized_locations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


INSERT INTO `employees` VALUES (8,'ADMIN001','123456','admin','admin@gmail.com',NULL,NULL,NULL,NULL,1,1,'2026-01-09 11:18:38','2026-01-09 11:18:52'),(9,'EMP001','123456','nalanta phuket','nalantaphuket@gmail.com','HR',NULL,NULL,4,1,0,'2026-01-28 04:21:46','2026-01-28 04:21:46');
INSERT INTO `authorized_locations` VALUES (3,'sirinthorn',13.78384420,100.49336050,200,1,'2026-01-09 05:34:00'),(4,'office 1 mahidol salaya',13.80928210,100.32096950,200,1,'2026-01-09 05:34:41');
