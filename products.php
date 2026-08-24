<?php
/**
 * PC Store - Admin Products Management
 */
$pageTitle = 'Manage Products';
require_once __DIR__ . '/../includes/functions.php';

requireAdmin();

try {
    $db = getDB();
    
    // Handle delete
    if (isset($_GET['delete'])) {
        $id = (int)$_GET['delete'];
        $stmt = $db->prepare("DELETE FROM products WHERE id = ?");
        $stmt->execute([$id]);
        setFlash('success', 'Product deleted successfully.');
        redirect(SITE_URL . '/admin/products.php');
    }
    
    $search = isset($_GET['search']) ? sanitize($_GET['search']) : '';
    $page = isset($_GET['page']) ? max(1, (int)$_GET['page']) : 1;
    $perPage = 15;
    $offset = ($page - 1) * $perPage;
    
    if ($search) {
        $stmt = $db->prepare("SELECT p.*, c.name AS category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.name LIKE ? OR p.description LIKE ? ORDER BY p.id DESC LIMIT ? OFFSET ?");
        $stmt->execute(["%$search%", "%$search%", $perPage, $offset]);
        $countStmt = $db->prepare("SELECT COUNT(*) FROM products WHERE name LIKE ? OR description LIKE ?");
        $countStmt->execute(["%$search%", "%$search%"]);
    } else {
        $stmt = $db->prepare("SELECT p.*, c.name AS category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id ORDER BY p.id DESC LIMIT ? OFFSET ?");
        $stmt->execute([$perPage, $offset]);
        $countStmt = $db->query("SELECT COUNT(*) FROM products");
    }
    
    $products = $stmt->fetchAll();
    $totalProducts = $countStmt->fetchColumn();
    $totalPages = ceil($totalProducts / $perPage);
} catch (PDOException $e) {
    setFlash('error', 'Database error. Please ensure tables are created.');
    require_once __DIR__ . '/../includes/header.php';
    echo '<div class="alert alert-error">Database not configured properly. Run database.sql first.</div>';
    require_once __DIR__ . '/../includes/footer.php';
    exit;
}

require_once __DIR__ . '/../includes/header.php';
?>

<div style="display:grid;grid-template-columns:250px 1fr;gap:0;margin:-30px -20px;">
    <?php include __DIR__ . '/sidebar.php'; ?>

    <div class="admin-content">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
            <h1><i class="fas fa-laptop"></i> Products (<?php echo $totalProducts; ?>)</h1>
            <a href="add-product.php" class="btn btn-primary"><i class="fas fa-plus"></i> Add Product</a>
        </div>

        <!-- Search -->
        <form method="GET" style="margin-bottom:20px;display:flex;gap:10px;">
            <input type="text" name="search" placeholder="Search products..." value="<?php echo $search; ?>" 
                   style="flex:1;padding:8px 12px;border:1px solid var(--gray-200);border-radius:var(--radius);">
            <button type="submit" class="btn btn-primary"><i class="fas fa-search"></i> Search</button>
            <?php if ($search): ?>
                <a href="products.php" class="btn btn-secondary">Clear</a>
            <?php endif; ?>
        </form>

        <table class="data-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Featured</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <?php if (empty($products)): ?>
                <tr><td colspan="8" style="text-align:center;padding:30px;">No products found.</td></tr>
                <?php else: ?>
                    <?php foreach ($products as $product): ?>
                    <tr>
                        <td><?php echo $product['id']; ?></td>
                        <td><img src="<?php echo getProductImage($product['image']); ?>" style="width:50px;height:50px;object-fit:cover;border-radius:5px;"></td>
                        <td><strong><?php echo sanitize($product['name']); ?></strong></td>
                        <td><?php echo sanitize($product['category_name'] ?? 'N/A'); ?></td>
                        <td><?php echo formatPrice($product['price']); ?></td>
                        <td>
                            <span style="color: <?php echo $product['stock'] > 10 ? 'green' : ($product['stock'] > 0 ? 'orange' : 'red'); ?>;">
                                <?php echo $product['stock']; ?>
                            </span>
                        </td>
                        <td>
                            <?php if ($product['featured']): ?>
                                <span style="color:gold;"><i class="fas fa-star"></i></span>
                            <?php else: ?>
                                <span style="color:var(--gray-400);">-</span>
                            <?php endif; ?>
                        </td>
                        <td>
                            <a href="edit-product.php?id=<?php echo $product['id']; ?>" class="btn btn-sm btn-primary" title="Edit">
                                <i class="fas fa-edit"></i>
                            </a>
                            <a href="?delete=<?php echo $product['id']; ?>" class="btn btn-sm btn-danger" 
                               onclick="return confirm('Are you sure you want to delete this product?');" title="Delete">
                                <i class="fas fa-trash"></i>
                            </a>
                        </td>
                    </tr>
                    <?php endforeach; ?>
                <?php endif; ?>
            </tbody>
        </table>

        <!-- Pagination -->
        <?php if ($totalPages > 1): ?>
        <div style="display:flex;justify-content:center;gap:10px;margin-top:20px;">
            <?php for ($i = 1; $i <= $totalPages; $i++): ?>
                <a href="?page=<?php echo $i; ?><?php echo $search ? '&search=' . urlencode($search) : ''; ?>" 
                   class="btn btn-sm <?php echo $i === $page ? 'btn-primary' : 'btn-secondary'; ?>">
                    <?php echo $i; ?>
                </a>
            <?php endfor; ?>
        </div>
        <?php endif; ?>
    </div>
</div>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>
