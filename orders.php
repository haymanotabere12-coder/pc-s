<?php
/**
 * PC Store - User Orders Page
 */
$pageTitle = 'My Orders';
require_once __DIR__ . '/includes/functions.php';

requireLogin();

$db = getDB();
$stmt = $db->prepare("SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC");
$stmt->execute([$_SESSION['user_id']]);
$orders = $stmt->fetchAll();

require_once __DIR__ . '/includes/header.php';
?>

<div class="page-header">
    <div class="breadcrumb">
        <a href="index.php">Home</a> / <span>My Orders</span>
    </div>
    <h1><i class="fas fa-box"></i> My Orders</h1>
    <p><?php echo count($orders); ?> order<?php echo count($orders) !== 1 ? 's' : ''; ?></p>
</div>

<?php if (empty($orders)): ?>
    <div class="empty-cart">
        <i class="fas fa-box-open"></i>
        <h3>No orders yet</h3>
        <p>You haven't placed any orders yet.</p>
        <a href="products.php" class="btn btn-primary btn-lg" style="margin-top: 15px;">
            <i class="fas fa-laptop"></i> Start Shopping
        </a>
    </div>
<?php else: ?>
    <?php foreach ($orders as $order): ?>
        <?php
        $stmt = $db->prepare("SELECT oi.*, p.name AS product_name FROM order_items oi JOIN products p ON oi.product_id = p.id WHERE oi.order_id = ?");
        $stmt->execute([$order['id']]);
        $items = $stmt->fetchAll();
        
        $hasMessage = !empty($order['admin_message']) && $order['admin_message'] !== null;
        $messageIsNew = $hasMessage && strtotime($order['updated_at']) > strtotime('-7 days');
        ?>
        <div class="order-card" style="<?php echo $messageIsNew ? 'border-left: 5px solid #667eea; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);' : ''; ?>">
            <div class="order-header">
                <div>
                    <span class="order-id">Order #<?php echo $order['id']; ?></span>
                    <span class="order-date">&nbsp;|&nbsp; <?php echo date('M d, Y h:i A', strtotime($order['created_at'])); ?></span>
                    <?php if ($hasMessage): ?>
                    <br>
                    <small style="color: var(--primary);">
                        <i class="fas fa-envelope"></i> 
                        <?php if ($messageIsNew): ?>
                            <span style="background: var(--primary); color: white; padding: 2px 6px; border-radius: 8px; font-size: 0.75rem; font-weight: bold; margin-left: 5px;">NEW MESSAGE</span>
                        <?php else: ?>
                            <span style="margin-left: 5px;">Admin sent you a message</span>
                        <?php endif; ?>
                    </small>
                    <?php endif; ?>
                </div>
                <span class="order-status status-<?php echo $order['status']; ?>">
                    <?php echo ucfirst($order['status']); ?>
                </span>
            </div>
            <div class="order-body">
                <?php if ($hasMessage): ?>
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                        <i class="fas fa-envelope" style="font-size: 1.2rem;"></i>
                        <strong style="font-size: 0.95rem;">Message from Admin</strong>
                    </div>
                    <p style="margin: 0; line-height: 1.6; font-size: 0.9rem; max-height: 100px; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">
                        <?php echo nl2br(sanitize($order['admin_message'])); ?>
                    </p>
                    <a href="messages.php" style="display: inline-block; margin-top: 8px; color: white; text-decoration: underline; font-size: 0.85rem;">
                        <i class="fas fa-arrow-right"></i> View full message
                    </a>
                    <small style="opacity: 0.9; display: block; margin-top: 8px; font-size: 0.8rem;">
                        <i class="fas fa-clock"></i> Updated: <?php echo date('M d, Y h:i A', strtotime($order['updated_at'])); ?>
                    </small>
                </div>
                <?php endif; ?>
                
                <table class="order-items">
                    <?php foreach ($items as $item): ?>
                    <tr>
                        <td><?php echo sanitize($item['product_name']); ?></td>
                        <td>x<?php echo $item['quantity']; ?></td>
                        <td style="text-align: right;"><?php echo formatPrice($item['price'] * $item['quantity']); ?></td>
                    </tr>
                    <?php endforeach; ?>
                </table>
                <div class="order-total">
                    Total: <?php echo formatPrice($order['total_amount']); ?>
                </div>
            </div>
        </div>
    <?php endforeach; ?>
<?php endif; ?>

<?php require_once __DIR__ . '/includes/footer.php'; ?>