<?php
$pageTitle = 'Test Messages';
require_once __DIR__ . '/includes/functions.php';

// Check if user is logged in
if (!isLoggedIn()) {
    echo "<h2>Not logged in</h2>";
    echo "<p>Please <a href='login.php'>login</a> to test messages.</p>";
    exit;
}

$db = getDB();

echo "<h2>Testing Admin Messages System</h2>";
echo "<hr>";

// Check current user
echo "<h3>Current User:</h3>";
echo "<p><strong>ID:</strong> " . $_SESSION['user_id'] . "</p>";
echo "<p><strong>Username:</strong> " . sanitize($_SESSION['username']) . "</p>";
echo "<p><strong>Role:</strong> " . (isset($_SESSION['user_role']) ? sanitize($_SESSION['user_role']) : 'N/A') . "</p>";
echo "<hr>";

// Check all orders for this user
echo "<h3>Your Orders:</h3>";
$stmt = $db->prepare("SELECT id, status, admin_message, created_at, updated_at FROM orders WHERE user_id = ?");
$stmt->execute([$_SESSION['user_id']]);
$userOrders = $stmt->fetchAll();

if (empty($userOrders)) {
    echo "<p>No orders found for your account.</p>";
} else {
    echo "<table border='1' cellpadding='10' style='border-collapse: collapse; width: 100%;'>";
    echo "<tr><th>Order ID</th><th>Status</th><th>Admin Message</th><th>Updated</th></tr>";
    foreach ($userOrders as $order) {
        $hasMessage = !empty($order['admin_message']);
        echo "<tr>";
        echo "<td>#{$order['id']}</td>";
        echo "<td>{$order['status']}</td>";
        echo "<td style='background: " . ($hasMessage ? '#d4edda' : '#f8d7da') . ";'>";
        echo $hasMessage ? nl2br(sanitize($order['admin_message'])) : '<em>No message</em>';
        echo "</td>";
        echo "<td>" . date('M d, Y h:i A', strtotime($order['updated_at'])) . "</td>";
        echo "</tr>";
    }
    echo "</table>";
}

echo "<hr>";

// Check ALL orders (for testing)
echo "<h3>All Orders in Database:</h3>";
$allOrders = $db->query("SELECT id, user_id, status, admin_message FROM orders")->fetchAll();

if (empty($allOrders)) {
    echo "<p>No orders in database yet. <a href='admin/orders.php'>Go to admin to create orders</a>.</p>";
} else {
    echo "<table border='1' cellpadding='10' style='border-collapse: collapse; width: 100%;'>";
    echo "<tr><th>Order ID</th><th>User ID</th><th>Status</th><th>Admin Message</th></tr>";
    foreach ($allOrders as $order) {
        $hasMessage = !empty($order['admin_message']);
        echo "<tr>";
        echo "<td>#{$order['id']}</td>";
        echo "<td>{$order['user_id']}</td>";
        echo "<td>{$order['status']}</td>";
        echo "<td style='background: " . ($hasMessage ? '#d4edda' : '#f8d7da') . ";'>";
        echo $hasMessage ? nl2br(sanitize($order['admin_message'])) : '<em>No message</em>';
        echo "</td>";
        echo "</tr>";
    }
    echo "</table>";
}

echo "<hr>";
echo "<h3>Test Links:</h3>";
echo "<ul>";
echo "<li><a href='messages.php'>View My Messages Page</a></li>";
echo "<li><a href='orders.php'>View My Orders Page</a></li>";
echo "<li><a href='admin/orders.php'>Admin: Manage Orders</a></li>";
echo "<li><a href='index.php'>Back to Home</a></li>";
echo "</ul>";
?>