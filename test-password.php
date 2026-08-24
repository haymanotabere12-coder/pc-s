<?php
/**
 * Test Password Verification
 */

// The hash we're using for "123456"
$hash = '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi';

echo "<h1>Password Verification Test</h1>";
echo "<hr>";

// Test 1: Verify the hash works
echo "<h3>Test 1: Checking if hash works for '123456'</h3>";
if (password_verify('123456', $hash)) {
    echo "<p style='color: green; font-size: 18px;'>✓ YES - Hash verification works!</p>";
} else {
    echo "<p style='color: red; font-size: 18px;'>✗ NO - Hash verification failed!</p>";
    echo "<p>Creating new hash...</p>";
    $hash = password_hash('123456', PASSWORD_DEFAULT);
    echo "<p>New hash: <code>$hash</code></p>";
}

// Test 2: Generate new hash
echo "<hr><h3>Test 2: Generate fresh password hash</h3>";
$newHash = password_hash('123456', PASSWORD_DEFAULT);
echo "<p>Fresh hash for '123456':</p>";
echo "<p><code style='background: #f0f0f0; padding: 10px; display: block;'>$newHash</code></p>";

if (password_verify('123456', $newHash)) {
    echo "<p style='color: green;'>✓ New hash verified successfully!</p>";
}

// Test 3: Show SQL command
echo "<hr><h3>Test 3: SQL Command to Update Password</h3>";
echo "<p>Copy this SQL and run in phpMyAdmin:</p>";
echo "<textarea style='width: 100%; height: 100px; font-family: monospace;'>";
echo "UPDATE users SET password = '$newHash' WHERE username = 'admin';";
echo "</textarea>";

echo "<hr>";
echo "<h3>Instructions:</h3>";
echo "<ol>";
echo "<li>Open phpMyAdmin: <a href='http://localhost/phpmyadmin'>http://localhost/phpmyadmin</a></li>";
echo "<li>Select database: <strong>pc_store</strong></li>";
echo "<li>Click <strong>SQL</strong> tab</li>";
echo "<li>Copy the SQL command from the textarea above</li>";
echo "<li>Paste it and click <strong>Go</strong></li>";
echo "<li>Then login with: <strong>admin</strong> / <strong>123456</strong></li>";
echo "</ol>";

echo "<hr>";
echo "<p><a href='http://localhost/pc-store/login.php' style='font-size: 20px; color: blue;'>→ Go to Login Page</a></p>";
?>
