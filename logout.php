<?php
/**
 * PC Store - Logout
 */
require_once __DIR__ . '/includes/config.php';

session_destroy();
session_start();

header('Location: ' . SITE_URL . '/login.php');
exit();
