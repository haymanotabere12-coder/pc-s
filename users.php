<?php
/**
 * PC Store - Admin Users Management
 */
$pageTitle = 'Manage Users';
require_once __DIR__ . '/../includes/functions.php';

requireAdmin();

try {
    $db = getDB();
    
    // Handle delete
    if (isset($_GET['delete'])) {
        $id = (int)$_GET['delete'];
        // Prevent deleting yourself
        if ($id != $_SESSION['user_id']) {
            $stmt = $db->prepare("DELETE FROM users WHERE id = ?");
            $stmt->execute([$id]);
            setFlash('success', 'User deleted successfully.');
        } else {
            setFlash('error', 'You cannot delete your own account.');
        }
        redirect(SITE_URL . '/admin/users.php');
    }
    
    $users = $db->query("SELECT id, username, email, full_name, phone, role, created_at FROM users ORDER BY id ASC")->fetchAll();
} catch (PDOException $e) {
    setFlash('error', 'Database error.');
    $users = [];
}

require_once __DIR__ . '/../includes/header.php';
?>

<div style="display:grid;grid-template-columns:250px 1fr;gap:0;margin:-30px -20px;">
    <?php include __DIR__ . '/sidebar.php'; ?>

    <div class="admin-content">
        <h1><i class="fas fa-users"></i> Users (<?php echo count($users); ?>)</h1>

        <table class="data-table" style="margin-top:20px;">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Username</th>
                    <th>Full Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Registered</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <?php if (empty($users)): ?>
                <tr><td colspan="8" style="text-align:center;padding:30px;">No users found.</td></tr>
                <?php else: ?>
                    <?php foreach ($users as $user): ?>
                    <tr>
                        <td><?php echo $user['id']; ?></td>
                        <td><strong>@<?php echo sanitize($user['username']); ?></strong></td>
                        <td><?php echo sanitize($user['full_name']); ?></td>
                        <td><?php echo sanitize($user['email']); ?></td>
                        <td><?php echo sanitize($user['phone'] ?? 'N/A'); ?></td>
                        <td>
                            <span class="badge <?php echo $user['role'] === 'admin' ? 'badge-danger' : 'badge-primary'; ?>">
                                <?php echo ucfirst($user['role']); ?>
                            </span>
                        </td>
                        <td><?php echo date('M d, Y', strtotime($user['created_at'])); ?></td>
                        <td>
                            <?php if ($user['id'] != $_SESSION['user_id']): ?>
                            <a href="?delete=<?php echo $user['id']; ?>" class="btn btn-sm btn-danger" 
                               onclick="return confirm('Are you sure you want to delete this user?');" title="Delete">
                                <i class="fas fa-trash"></i>
                            </a>
                            <?php else: ?>
                            <span style="color:var(--gray-400);font-size:0.85rem;">Current User</span>
                            <?php endif; ?>
                        </td>
                    </tr>
                    <?php endforeach; ?>
                <?php endif; ?>
            </tbody>
        </table>
    </div>
</div>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>
