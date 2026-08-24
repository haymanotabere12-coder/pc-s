<?php
/**
 * PC Store - Admin Dashboard
 */
$pageTitle = 'Admin Dashboard';
require_once __DIR__ . '/../includes/functions.php';

requireAdmin();

try {
    $db = getDB();
    
    // Get stats
    $totalUsers = $db->query("SELECT COUNT(*) FROM users WHERE role = 'user'")->fetchColumn();
    $totalProducts = $db->query("SELECT COUNT(*) FROM products")->fetchColumn();
    $totalOrders = $db->query("SELECT COUNT(*) FROM orders")->fetchColumn();
    $totalRevenue = $db->query("SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE status != 'cancelled'")->fetchColumn();
    $totalMessages = $db->query("SELECT COUNT(*) FROM contact_messages WHERE is_read = 0")->fetchColumn();
    
    // Get order status counts
    $pendingCount = $db->query("SELECT COUNT(*) FROM orders WHERE status = 'pending'")->fetchColumn();
    $processingCount = $db->query("SELECT COUNT(*) FROM orders WHERE status = 'processing'")->fetchColumn();
    $shippedCount = $db->query("SELECT COUNT(*) FROM orders WHERE status = 'shipped'")->fetchColumn();
    $deliveredCount = $db->query("SELECT COUNT(*) FROM orders WHERE status = 'delivered'")->fetchColumn();
    $cancelledCount = $db->query("SELECT COUNT(*) FROM orders WHERE status = 'cancelled'")->fetchColumn();
    
    // Recent orders
    $recentOrders = $db->query("SELECT o.*, u.username, u.full_name FROM orders o JOIN users u ON o.user_id = u.id ORDER BY o.created_at DESC LIMIT 5")->fetchAll();
} catch (PDOException $e) {
    setFlash('error', 'Database error: ' . $e->getMessage());
    redirect(SITE_URL . '/index.php');
}

require_once __DIR__ . '/../includes/header.php';
?>

<div style="display:grid;grid-template-columns:250px 1fr;gap:0;margin:-30px -20px;">
    <?php include __DIR__ . '/sidebar.php'; ?>

    <div class="admin-content">
        <h1><i class="fas fa-tachometer-alt"></i> Dashboard</h1>

        <!-- Stats Cards -->
        <div class="stats-grid">
            <a href="orders.php" style="text-decoration:none;">
                <div class="stat-card">
                    <div class="stat-icon blue"><i class="fas fa-shopping-bag"></i></div>
                    <div class="stat-info">
                        <h3><?php echo $totalOrders; ?></h3>
                        <p>Total Orders</p>
                    </div>
                </div>
            </a>
            <a href="orders.php?status=pending" style="text-decoration:none;">
                <div class="stat-card">
                    <div class="stat-icon yellow"><i class="fas fa-clock"></i></div>
                    <div class="stat-info">
                        <h3><?php echo $pendingCount; ?></h3>
                        <p>Pending</p>
                    </div>
                </div>
            </a>
            <a href="orders.php?status=processing" style="text-decoration:none;">
                <div class="stat-card">
                    <div class="stat-icon blue"><i class="fas fa-cog"></i></div>
                    <div class="stat-info">
                        <h3><?php echo $processingCount; ?></h3>
                        <p>Processing</p>
                    </div>
                </div>
            </a>
            <a href="orders.php?status=shipped" style="text-decoration:none;">
                <div class="stat-card">
                    <div class="stat-icon green"><i class="fas fa-shipping-fast"></i></div>
                    <div class="stat-info">
                        <h3><?php echo $shippedCount; ?></h3>
                        <p>Shipped</p>
                    </div>
                </div>
            </a>
            <a href="orders.php?status=delivered" style="text-decoration:none;">
                <div class="stat-card" style="position:relative;overflow:hidden;">
                    <div class="stat-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);"><i class="fas fa-check-circle"></i></div>
                    <div class="stat-info">
                        <h3><?php echo $deliveredCount; ?></h3>
                        <p>Delivered</p>
                    </div>
                </div>
            </a>
            <a href="orders.php?status=cancelled" style="text-decoration:none;">
                <div class="stat-card">
                    <div class="stat-icon red"><i class="fas fa-times-circle"></i></div>
                    <div class="stat-info">
                        <h3><?php echo $cancelledCount; ?></h3>
                        <p>Cancelled</p>
                    </div>
                </div>
            </a>
        </div>

        <!-- Additional Stats -->
        <div class="stats-grid" style="margin-top: 20px;">
            <div class="stat-card">
                <div class="stat-icon green"><i class="fas fa-users"></i></div>
                <div class="stat-info">
                    <h3><?php echo $totalUsers; ?></h3>
                    <p>Total Users</p>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon blue"><i class="fas fa-laptop"></i></div>
                <div class="stat-info">
                    <h3><?php echo $totalProducts; ?></h3>
                    <p>Products</p>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon red"><i class="fas fa-dollar-sign"></i></div>
                <div class="stat-info">
                    <h3><?php echo formatPrice($totalRevenue); ?></h3>
                    <p>Revenue</p>
                </div>
            </div>
            <?php if ($totalMessages > 0): ?>
            <a href="messages.php" style="text-decoration:none;">
                <div class="stat-card">
                    <div class="stat-icon yellow"><i class="fas fa-envelope"></i></div>
                    <div class="stat-info">
                        <h3><?php echo $totalMessages; ?></h3>
                        <p>Unread Messages</p>
                    </div>
                </div>
            </a>
            <?php endif; ?>
        </div>

        <!-- Unread Messages Alert -->
        <?php if ($totalMessages > 0): ?>
        <div class="alert alert-warning" style="margin-top: 20px;">
            <i class="fas fa-exclamation-triangle"></i> You have <strong><?php echo $totalMessages; ?></strong> unread contact message<?php echo $totalMessages > 1 ? 's' : ''; ?>.
            <a href="messages.php">View Messages</a>
        </div>
        <?php endif; ?>

        <!-- Recent Orders -->
        <div class="table-header" style="margin-top: 30px;">
            <h2>Recent Orders</h2>
            <a href="orders.php" class="btn btn-secondary btn-sm">View All</a>
        </div>

        <table class="data-table" style="margin-top: 15px;">
            <thead>
                <tr>
                    <th>Order #</th>
                    <th>Customer</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Date</th>
                </tr>
            </thead>
            <tbody>
                <?php if (empty($recentOrders)): ?>
                <tr><td colspan="5" style="text-align:center;padding:30px;">No orders yet.</td></tr>
                <?php else: ?>
                    <?php foreach ($recentOrders as $order): ?>
                    <tr>
                        <td><strong>#<?php echo $order['id']; ?></strong></td>
                        <td><?php echo sanitize($order['full_name']); ?></td>
                        <td><?php echo formatPrice($order['total_amount']); ?></td>
                        <td>
                            <span class="order-status status-<?php echo $order['status']; ?>">
                                <?php echo ucfirst($order['status']); ?>
                            </span>
                        </td>
                        <td><?php echo date('M d, Y', strtotime($order['created_at'])); ?></td>
                    </tr>
                    <?php endforeach; ?>
                <?php endif; ?>
            </tbody>
        </table>
    </div>
</div>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>
