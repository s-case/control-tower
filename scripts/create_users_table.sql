CREATE TABLE `users` (
  `github_name` varchar(200) DEFAULT NULL,
  `github_email` varchar(200) DEFAULT NULL,
  `github_token` varchar(200) DEFAULT NULL,
  `scase_token` varchar(200) DEFAULT NULL,
  `github_id` varchar(200) DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `Message` varchar(45) DEFAULT NULL,
  `google_name` varchar(200) DEFAULT NULL,
  `google_email` varchar(200) DEFAULT NULL,
  `google_token` varchar(200) DEFAULT NULL,
  `google_id` varchar(200) DEFAULT NULL,
  `scase_secret` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `githubtoken_UNIQUE` (`github_token`),
  UNIQUE KEY `scasetoken_UNIQUE` (`scase_token`),
  UNIQUE KEY `github_id_UNIQUE` (`github_id`),
  UNIQUE KEY `google_token_UNIQUE` (`google_token`),
  UNIQUE KEY `google_id_UNIQUE` (`google_id`)
) ENGINE=InnoDB AUTO_INCREMENT=71 DEFAULT CHARSET=latin1;

