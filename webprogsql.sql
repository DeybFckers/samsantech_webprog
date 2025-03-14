-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 14, 2025 at 08:57 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `webprogsql`
--

-- --------------------------------------------------------

--
-- Table structure for table `barber`
--

CREATE TABLE `barber` (
  `Barber_ID` int(11) NOT NULL,
  `Barber_Name` varchar(255) NOT NULL,
  `Barber_Address` varchar(255) DEFAULT NULL,
  `Contact_Details` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `barber`
--

INSERT INTO `barber` (`Barber_ID`, `Barber_Name`, `Barber_Address`, `Contact_Details`) VALUES
(1, 'Benjie Darato', 'Elrio Phase 5 Bacaca', '09482494438'),
(2, 'Jay Regalado', 'Jade Valley', '09656746937'),
(3, 'Richard Abucejo', 'Tigatto', '090947891267'),
(4, 'Rico Cutin', 'Maa', '09556404453'),
(5, 'Elijah Laurde Sebastian', 'Boulevard', '09700656922'),
(6, 'Dems Yuson', 'Buhangain, Panacan', '09501658645'),
(7, 'Marnel Cartona', 'SASA', 'N/A');

-- --------------------------------------------------------

--
-- Table structure for table `customer`
--

CREATE TABLE `customer` (
  `Customer_ID` int(11) NOT NULL,
  `Customer_Name` varchar(255) NOT NULL,
  `Customer_Number` varchar(20) NOT NULL,
  `Barber_ID` int(11) DEFAULT NULL,
  `Service_ID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customer`
--

INSERT INTO `customer` (`Customer_ID`, `Customer_Name`, `Customer_Number`, `Barber_ID`, `Service_ID`) VALUES
(1, 'Cyfuckinggay', '999999999999', 1, 13);

-- --------------------------------------------------------

--
-- Table structure for table `services`
--

CREATE TABLE `services` (
  `Service_ID` int(11) NOT NULL,
  `Service_Name` varchar(255) NOT NULL,
  `Service_Price` decimal(10,2) NOT NULL,
  `service_type` enum('Standard','Standalone','Package') NOT NULL DEFAULT 'Standard'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `services`
--

INSERT INTO `services` (`Service_ID`, `Service_Name`, `Service_Price`, `service_type`) VALUES
(1, 'Barrons\'s Signature Haircut\r\n(Cut, Shampoo, Hot Towel Massage)', 250.00, 'Standard'),
(2, 'Quick and Sleek Haircut\r\n(Haircut + Shampoo)', 200.00, 'Standard'),
(3, 'Shave', 200.00, 'Standard'),
(4, 'Beard Sculpting', 250.00, 'Standard'),
(5, 'Head Shave', 300.00, 'Standard'),
(6, 'Barrons Signature Haircut + Shave', 400.00, 'Package'),
(7, 'Quick and sleek Haircut + Shave', 350.00, 'Package'),
(8, 'Long Hair Dye + Haircut ', 1200.00, 'Package'),
(9, 'Short Hair dye + Haircut', 800.00, 'Package'),
(10, 'Mentholated Scalp treatment + Haircut', 650.00, 'Package'),
(11, 'Hair Treatment + Haircut', 650.00, 'Package'),
(12, 'Half Body Massage (30 mins)', 250.00, 'Standalone'),
(13, 'Scalp Massage (15 mins)', 160.00, 'Standalone'),
(14, 'Long Hair Dye', 1000.00, 'Standalone'),
(15, 'Short Hair Dye', 700.00, 'Standalone'),
(16, 'Hair Dye Labor 15 mins and above.', 700.00, 'Standalone'),
(17, 'Hair Dye Labor 10 to 15 mins.', 300.00, 'Standalone'),
(18, 'Hair Treatment', 600.00, 'Standalone'),
(19, 'Mentholated Scalp Treatment', 600.00, 'Standalone');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `barber`
--
ALTER TABLE `barber`
  ADD PRIMARY KEY (`Barber_ID`);

--
-- Indexes for table `customer`
--
ALTER TABLE `customer`
  ADD PRIMARY KEY (`Customer_ID`),
  ADD KEY `Barber_ID` (`Barber_ID`),
  ADD KEY `fk_customer_service` (`Service_ID`);

--
-- Indexes for table `services`
--
ALTER TABLE `services`
  ADD PRIMARY KEY (`Service_ID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `barber`
--
ALTER TABLE `barber`
  MODIFY `Barber_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `customer`
--
ALTER TABLE `customer`
  MODIFY `Customer_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `services`
--
ALTER TABLE `services`
  MODIFY `Service_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `customer`
--
ALTER TABLE `customer`
  ADD CONSTRAINT `customer_ibfk_1` FOREIGN KEY (`Barber_ID`) REFERENCES `barber` (`Barber_ID`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_customer_service` FOREIGN KEY (`Service_ID`) REFERENCES `services` (`Service_ID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
