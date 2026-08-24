<?php
/**
 * Simple Admin Password Reset - Direct Fix
 */

// Database configuration
$host = 'localhost';
$dbname = 'pc_store';
$username = 'root';
$password = '';

try {
    // Connect to database
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "<h1>Admin Password Reset Tool</h1>";
    echo "<hr>";
    
    // Check if admin user exists
    $stmt = $pdo->query("SELECT id, username, email, role FROM users WHERE username = 'admin'");
    $admin = $stmt->fetch();
    
    if (!$admin) {
        echo "<h3 style='color: orange;'>Admin user not found. Creating...</h3>";
        
        // Create admin user
        $hashedPassword = password_hash('123456', PASSWORD_DEFAULT);
        $stmt = $pdo->prepare("INSERT INTO users (username, email, password, full_name, role) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute(['admin', 'admin@pcstore.com', $hashedPassword, 'Administrator', 'admin']);
        
        echo "<h2 style='color: green;'>✓ SUCCESS! Admin user created!</h2>";
        echo "<p><strong>Username:</strong> admin</p>";
        echo "<p><strong>Password:</strong> 123456</p>";
        echo "<p><a href='http://localhost/pc-store/login.php' style='font-size: 20px; color: blue;'>→ Click here to Login</a></p>";
        
    } else {
        echo "<h3>Admin user found: {$admin['username']} ({$admin['email']})</h3>";
        echo "<p>Resetting password...</p>";
        
        // Reset password
        $hashedPassword = password_hash('123456', PASSWORD_DEFAULT);
        $stmt = $pdo->prepare("UPDATE users SET password = ? WHERE username = 'admin'");
        $stmt->execute([$hashedPassword]);
        
        // Verify it worked
        $stmt = $pdo->prepare("SELECT password FROM users WHERE username = 'admin'");
        $stmt->execute();
        $newAdmin = $stmt->fetch();
        
        if (password_verify('123456', $newAdmin['password'])) {
            echo "<h2 style='color: green; font-size: 24px;'>✓ SUCCESS! Password has been reset!</h2>";
            echo "<p style='font-size: 18px;'><strong>Username:</strong> <code>admin</code></p>";
            echo "<p style='font-size: 18px;'><strong>Password:</strong> <code>123456</code></p>";
            echo "<hr>";
            echo "<p style='font-size: 20px;'><a href='http://localhost/pc-store/login.php' style='color: blue; text-decoration: underline;'>→ Click here to go to Login Page</a></p>";
        } else {
            echo "<h2 style='color: red;'>✗ ERROR: Password verification failed after update</h2>";
            echo "<p>Please try again or check database manually.</p>";
        }
    }
    
    echo "<hr>";
    echo "<h3>All Users in Database:</h3>";
    $stmt = $pdo->query("SELECT id, username, email, role, created_at FROM users");
    $allUsers = $stmt->fetchAll();
    
    if (count($allUsers) > 0) {
        echo "<table border='1' cellpadding='8' style='border-collapse: collapse;'>";
        echo "<tr><th>ID</th><th>Username</th><th>Email</th><th>Role</th><th>Created</th></tr>";
        foreach ($allUsers as $user) {
            echo "<tr>";
            echo "<td>{$user['id']}</td>";
            echo "<td>{$user['username']}</td>";
            echo "<td>{$user['email']}</td>";
            echo "<td>{$user['role']}</td>";
            echo "<td>{$user['created_at']}</td>";
            echo "</tr>";
        }
        echo "</table>";
    } else {
        echo "<p>No users found in database.</p>";
    }
    
} catch (PDOException $e) {
    echo "<h2 style='color: red;'>✗ DATABASE ERROR</h2>";
    echo "<p><strong>Error:</strong> " . $e->getMessage() . "</p>";
    echo "<hr>";
    echo "<h3>Troubleshooting Steps:</h3>";
    echo "<ol>";
    echo "<li>Make sure XAMPP is running (Apache and MySQL)</li>";
    echo "<li>Open phpMyAdmin: <a href='http://localhost/phpmyadmin'>http://localhost/phpmyadmin</a></li>";
    echo "<li>Check if database 'pc_store' exists</li>";
    echo "<li>If not, create it and import: <code>c:\\xampp me\\htdocs\\pc-store\\database.sql</code></li>";
    echo "</ol>";
}
?>
