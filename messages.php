<?php
$pageTitle = 'My Messages';
require_once __DIR__ . '/includes/functions.php';

requireLogin();

$db = getDB();

try {
    $stmt = $db->prepare("SELECT * FROM orders WHERE user_id = ? AND admin_message IS NOT NULL AND admin_message != '' ORDER BY updated_at DESC");
    $stmt->execute([$_SESSION['user_id']]);
    $messages = $stmt->fetchAll();
} catch (PDOException $e) {
    $messages = [];
    setFlash('error', 'Unable to load messages');
}

require_once __DIR__ . '/includes/header.php';
?>

<div class="page-header">
    <div class="breadcrumb">
        <a href="index.php">Home</a> / <span>My Messages</span>
    </div>
    <h1><i class="fas fa-envelope"></i> Messages from Admin</h1>
    <p><?php echo count($messages); ?> message<?php echo count($messages) !== 1 ? 's' : ''; ?></p>
</div>

<?php if (empty($messages)): ?>
    <div class="empty-cart">
        <i class="fas fa-inbox"></i>
        <h3>No messages</h3>
        <p>You have no messages from admin yet.</p>
    </div>
<?php else: ?>
    <?php foreach ($messages as $msg): ?>
        <div class="order-card">
            <div class="order-header">
                <div>
                    <span class="order-id">Order #<?php echo $msg['id']; ?></span>
                    <span class="order-date">&nbsp;|&nbsp; <?php echo date('M d, Y h:i A', strtotime($msg['updated_at'])); ?></span>
                </div>
                <span class="order-status status-<?php echo $msg['status']; ?>">
                    <?php echo ucfirst($msg['status']); ?>
                </span>
            </div>
            <div class="order-body">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px; margin-bottom: 15px;">
                    <strong style="display:block; margin-bottom:10px;"><i class="fas fa-user-shield"></i> Message from Admin</strong>
                    <p style="margin:0; line-height:1.6;"><?php echo nl2br(sanitize($msg['admin_message'])); ?></p>
                    <small style="display:block; margin-top:10px; opacity:0.9;">
                        <i class="fas fa-clock"></i> Sent: <?php echo date('M d, Y h:i A', strtotime($msg['updated_at'])); ?>
                    </small>
                </div>
            </div>
        </div>
    <?php endforeach; ?>
<?php endif; ?>

<?php require_once __DIR__ . '/includes/footer.php'; ?>