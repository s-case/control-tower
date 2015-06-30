CREATE TABLE `projects` (
  `project_id` int(11) NOT NULL AUTO_INCREMENT,
  `project_name` varchar(200) NOT NULL DEFAULT '',
  `privacy_level` varchar(15) DEFAULT NULL,
  `domain` varchar(200) DEFAULT NULL,
  `subdomain` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`project_id`,`project_name`),
  UNIQUE KEY `project_name_UNIQUE` (`project_name`)
) ENGINE=InnoDB AUTO_INCREMENT=75 DEFAULT CHARSET=latin1;

