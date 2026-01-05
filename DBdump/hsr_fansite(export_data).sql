-- phpMyAdmin SQL Dump
-- version 4.9.5
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Nov 28, 2025 at 10:28 PM
-- Server version: 5.7.24
-- PHP Version: 7.4.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `hsr_fansite`
--

-- --------------------------------------------------------

--
-- Table structure for table `characters`
--

CREATE TABLE `characters` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `rarity` int(11) NOT NULL,
  `element` varchar(50) NOT NULL,
  `path` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `characters`
--

INSERT INTO `characters` (`id`, `name`, `rarity`, `element`, `path`) VALUES
(1, 'Blade', 5, 'Wind', 'Destruction'),
(2, 'Firefly', 5, 'Fire', 'Destruction'),
(3, 'Jingliu', 5, 'Ice', 'Destruction'),
(4, 'Yunli', 5, 'Physical', 'Destruction'),
(5, 'Dan Heng • Imbibitor Lunae', 5, 'Imaginary', 'Destruction'),
(6, 'Clara', 5, 'Physical', 'Destruction'),
(7, 'Boothill', 5, 'Physical', 'Hunt'),
(8, 'Dr. Ratio', 5, 'Imaginary', 'Hunt'),
(9, 'Feixiao', 5, 'Wind', 'Hunt'),
(10, 'Seele', 5, 'Quantum', 'Hunt'),
(11, 'Topaz & Numby', 5, 'Fire', 'Hunt'),
(12, 'Yanqing', 5, 'Ice', 'Hunt'),
(13, 'Argenti', 5, 'Physical', 'Erudition'),
(14, 'Himeko', 5, 'Fire', 'Erudition'),
(15, 'Jade', 5, 'Quantum', 'Erudition'),
(16, 'Jing Yuan', 5, 'Lightning', 'Erudition'),
(17, 'The Herta', 5, 'Ice', 'Erudition'),
(18, 'Herta', 5, 'Ice', 'Erudition'),
(19, 'Bronya', 5, 'Wind', 'Harmony'),
(20, 'Robin', 5, 'Physical', 'Harmony'),
(21, 'Ruan Mei', 5, 'Ice', 'Harmony'),
(22, 'Sparkle', 5, 'Quantum', 'Harmony'),
(23, 'Sunday', 5, 'Quantum', 'Harmony'),
(24, 'Acheron', 5, 'Lightning', 'Nihility'),
(25, 'Black Swan', 5, 'Wind', 'Nihility'),
(26, 'Fugue', 5, 'Fire', 'Nihility'),
(27, 'Jiaoqiu', 5, 'Fire', 'Nihility'),
(28, 'Kafka', 5, 'Lightning', 'Nihility'),
(29, 'Silver Wolf', 5, 'Quantum', 'Nihility'),
(30, 'Welt', 5, 'Imaginary', 'Nihility'),
(31, 'Aventurine', 5, 'Imaginary', 'Preservation'),
(32, 'Fu Xuan', 5, 'Quantum', 'Preservation'),
(33, 'Gepard', 5, 'Ice', 'Preservation'),
(34, 'Gallagher', 5, 'Fire', 'Abundance'),
(35, 'Huohuo', 5, 'Wind', 'Abundance'),
(36, 'Lingsha', 5, 'Fire', 'Abundance'),
(37, 'Luocha', 5, 'Imaginary', 'Abundance'),
(38, 'Bailu', 5, 'Lightning', 'Abundance'),
(39, 'Aglaea', 5, 'Lightning', 'Remembrance'),
(40, 'Anaxa', 5, 'Ice', 'Remembrance'),
(41, 'Castorice', 5, 'Quantum', 'Remembrance'),
(42, 'Cyrene', 5, 'Ice', 'Remembrance'),
(43, 'Hyacine', 5, 'Wind', 'Remembrance'),
(44, 'Arlan', 4, 'Lightning', 'Destruction'),
(45, 'Hook', 4, 'Fire', 'Destruction'),
(46, 'Misha', 4, 'Ice', 'Destruction'),
(47, 'Mydei', 4, 'Physical', 'Destruction'),
(48, 'Xueyi', 4, 'Quantum', 'Destruction'),
(49, 'Trailblazer (Physical)', 4, 'Physical', 'Destruction'),
(50, 'Dan Heng', 4, 'Wind', 'Hunt'),
(51, 'March 7th (The Hunt)', 4, 'Imaginary', 'Hunt'),
(52, 'Moze', 4, 'Lightning', 'Hunt'),
(53, 'Phainon', 4, 'Lightning', 'Hunt'),
(54, 'Sushang', 4, 'Physical', 'Hunt'),
(55, 'Archer', 4, 'Fire', 'Hunt'),
(56, 'Qingque', 4, 'Quantum', 'Erudition'),
(57, 'Serval', 4, 'Lightning', 'Erudition'),
(58, 'Asta', 4, 'Fire', 'Harmony'),
(59, 'Brinya', 4, 'Quantum', 'Harmony'),
(60, 'Hanya', 4, 'Physical', 'Harmony'),
(61, 'Tingyun', 4, 'Lightning', 'Harmony'),
(62, 'Yukong', 4, 'Imaginary', 'Harmony'),
(63, 'Trailblazer (Imaginary)', 4, 'Imaginary', 'Harmony'),
(64, 'Cipher', 4, 'Quantum', 'Nihility'),
(65, 'Guinaifen', 4, 'Fire', 'Nihility'),
(66, 'Luka', 4, 'Physical', 'Nihility'),
(67, 'Pela', 4, 'Ice', 'Nihility'),
(68, 'Sampo', 4, 'Wind', 'Nihility'),
(69, 'Tribbie', 4, 'Quantum', 'Nihility'),
(70, 'March 7th', 4, 'Ice', 'Preservation'),
(71, 'Trailblazer (Fire)', 4, 'Fire', 'Preservation'),
(72, 'Cerydra', 4, 'Wind', 'Abundance'),
(73, 'Lynx', 4, 'Quantum', 'Abundance'),
(74, 'Natasha', 4, 'Physical', 'Abundance'),
(75, 'Trailblazer (Remembrance)', 4, 'Ice', 'Remembrance');

-- --------------------------------------------------------

--
-- Table structure for table `character_pull_history`
--

CREATE TABLE `character_pull_history` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `character_id` int(10) UNSIGNED NOT NULL,
  `pulled_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `light_cones`
--

CREATE TABLE `light_cones` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `rarity` int(11) NOT NULL,
  `path` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `light_cone_pull_history`
--

CREATE TABLE `light_cone_pull_history` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `light_cone_id` int(10) UNSIGNED NOT NULL,
  `pulled_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` int(10) UNSIGNED NOT NULL,
  `role_name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `role_name`) VALUES
(2, 'admin'),
(1, 'user');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(10) UNSIGNED NOT NULL,
  `username` varchar(50) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `stellar_jade_balance` int(11) NOT NULL DEFAULT '0',
  `role_id` int(10) UNSIGNED NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password_hash`, `created_at`, `stellar_jade_balance`, `role_id`) VALUES
(1, 'testuser', '$2y$10$Pb0e5UoNSiY3UMTrsDAf4elHMA9LrLyFF1Z8pMrDiMaLaKzd3yRIS', '2025-11-20 01:36:42', 1600, 2),
(2, 'user1', '$2y$10$SAByZOg47ZoRrrgsmK0pvu1hnbgNMaNe7U6Exlx7A9WgYFulBV5G6', '2025-11-20 01:57:13', 1600, 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `characters`
--
ALTER TABLE `characters`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `character_pull_history`
--
ALTER TABLE `character_pull_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `character_id` (`character_id`);

--
-- Indexes for table `light_cones`
--
ALTER TABLE `light_cones`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `light_cone_pull_history`
--
ALTER TABLE `light_cone_pull_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `light_cone_id` (`light_cone_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `role_name` (`role_name`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD KEY `fk_users_role` (`role_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `characters`
--
ALTER TABLE `characters`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=76;

--
-- AUTO_INCREMENT for table `character_pull_history`
--
ALTER TABLE `character_pull_history`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `light_cones`
--
ALTER TABLE `light_cones`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `light_cone_pull_history`
--
ALTER TABLE `light_cone_pull_history`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `character_pull_history`
--
ALTER TABLE `character_pull_history`
  ADD CONSTRAINT `character_pull_history_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `character_pull_history_ibfk_2` FOREIGN KEY (`character_id`) REFERENCES `characters` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `light_cone_pull_history`
--
ALTER TABLE `light_cone_pull_history`
  ADD CONSTRAINT `light_cone_pull_history_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `light_cone_pull_history_ibfk_2` FOREIGN KEY (`light_cone_id`) REFERENCES `light_cones` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `fk_users_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
