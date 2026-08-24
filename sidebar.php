<?php
$currentPage = basename($_SERVER['PHP_SELF']);
?>
<div class="admin-sidebar" style="background: #2c3e50; padding: 25px 0; color: white;">
    <h3 style="padding: 0 20px; margin-bottom: 25px; font-size: 1.1rem; color: #cbd5e0;"><i class="fas fa-shield-alt"></i> Admin Panel</h3>
    <div class="admin-nav">
        <a href="dashboard.php" class="<?php echo $currentPage === 'dashboard.php' ? 'active' : ''; ?>" style="display: flex; align-items: center; gap: 12px; padding: 12px 20px; color: #a0aec0; text-decoration: none; border-left: 3px solid transparent;">
            <i class="fas fa-tachometer-alt"></i> Dashboard
        </a>
        <a href="products.php" class="<?php echo $currentPage === 'products.php' ? 'active' : ''; ?>" style="display: flex; align-items: center; gap: 12px; padding: 12px 20px; color: #a0aec0; text-decoration: none; border-left: 3px solid transparent;">
            <i class="fas fa-laptop"></i> Products
        </a>
        <a href="add-product.php" class="<?php echo $currentPage === 'add-product.php' ? 'active' : ''; ?>" style="display: flex; align-items: center; gap: 12px; padding: 12px 20px; color: #a0aec0; text-decoration: none; border-left: 3px solid transparent;">
            <i class="fas fa-plus-circle"></i> Add Product
        </a>
        <a href="orders.php" class="<?php echo $currentPage === 'orders.php' ? 'active' : ''; ?>" style="display: flex; align-items: center; gap: 12px; padding: 12px 20px; color: #a0aec0; text-decoration: none; border-left: 3px solid transparent;">
            <i class="fas fa-shopping-bag"></i> Orders
        </a>
        <a href="users.php" class="<?php echo $currentPage === 'users.php' ? 'active' : ''; ?>" style="display: flex; align-items: center; gap: 12px; padding: 12px 20px; color: #a0aec0; text-decoration: none; border-left: 3px solid transparent;">
            <i class="fas fa-users"></i> Users
        </a>
        <a href="categories.php" class="<?php echo $currentPage === 'categories.php' ? 'active' : ''; ?>" style="display: flex; align-items: center; gap: 12px; padding: 12px 20px; color: #a0aec0; text-decoration: none; border-left: 3px solid transparent;">
            <i class="fas fa-tags"></i> Categories
        </a>
        <a href="messages.php" class="<?php echo $currentPage === 'messages.php' ? 'active' : ''; ?>" style="display: flex; align-items: center; gap: 12px; padding: 12px 20px; color: #a0aec0; text-decoration: none; border-left: 3px solid transparent;">
            <i class="fas fa-envelope"></i> Messages
        </a>
        <a href="<?php echo SITE_URL; ?>/index.php" style="display: flex; align-items: center; gap: 12px; padding: 12px 20px; color: #a0aec0; text-decoration: none; border-left: 3px solid transparent;">
            <i class="fas fa-home"></i> Back to Store
        </a>
    </div>
</div>
