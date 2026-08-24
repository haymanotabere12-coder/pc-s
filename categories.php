<?php
/**
 * PC Store - Admin Categories Management
 */
$pageTitle = 'Manage Categories';
require_once __DIR__ . '/../includes/functions.php';

requireAdmin();

$db = getDB();

// Handle add category
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['add_category'])) {
    $name = sanitize($_POST['name'] ?? '');
    $description = sanitize($_POST['description'] ?? '');
    
    if (!empty($name)) {
        try {
            $stmt = $db->prepare("INSERT INTO categories (name, description) VALUES (?, ?)");
            $stmt->execute([$name, $description]);
            setFlash('success', 'Category added successfully!');
            redirect(SITE_URL . '/admin/categories.php');
        } catch (PDOException $e) {
            setFlash('error', 'Error adding category: ' . $e->getMessage());
        }
    } else {
        setFlash('error', 'Category name is required.');
    }
}

// Handle delete
if (isset($_GET['delete'])) {
    $id = (int)$_GET['delete'];
    try {
        $stmt = $db->prepare("DELETE FROM categories WHERE id = ?");
        $stmt->execute([$id]);
        setFlash('success', 'Category deleted successfully.');
        redirect(SITE_URL . '/admin/categories.php');
    } catch (PDOException $e) {
        setFlash('error', 'Cannot delete category. It may have products assigned.');
    }
}

try {
    $categories = $db->query("SELECT c.*, COUNT(p.id) as product_count FROM categories c LEFT JOIN products p ON c.id = p.category_id GROUP BY c.id ORDER BY c.name")->fetchAll();
} catch (PDOException $e) {
    setFlash('error', 'Database error.');
    $categories = [];
}

require_once __DIR__ . '/../includes/header.php';
?>

<div style="display:grid;grid-template-columns:250px 1fr;gap:0;margin:-30px -20px;">
    <?php include __DIR__ . '/sidebar.php'; ?>

    <div class="admin-content">
        <h1><i class="fas fa-tags"></i> Categories</h1>

        <!-- Add Category Form -->
        <div class="form-container" style="max-width:600px;margin:20px 0;">
            <h3>Add New Category</h3>
            <form method="POST">
                <div class="form-group">
                    <label for="name">Category Name *</label>
                    <input type="text" id="name" name="name" required>
                </div>

                <div class="form-group">
                    <label for="description">Description</label>
                    <textarea id="description" name="description" rows="3"></textarea>
                </div>

                <button type="submit" name="add_category" class="btn btn-primary">
                    <i class="fas fa-plus"></i> Add Category
                </button>
            </form>
        </div>

        <!-- Categories List -->
        <h3 style="margin-top:30px;">All Categories (<?php echo count($categories); ?>)</h3>
        
        <table class="data-table" style="margin-top:15px;">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Products</th>
                    <th>Created</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <?php if (empty($categories)): ?>
                <tr><td colspan="6" style="text-align:center;padding:30px;">No categories found.</td></tr>
                <?php else: ?>
                    <?php foreach ($categories as $cat): ?>
                    <tr>
                        <td><?php echo $cat['id']; ?></td>
                        <td><strong><?php echo sanitize($cat['name']); ?></strong></td>
                        <td><?php echo sanitize($cat['description'] ?? 'N/A'); ?></td>
                        <td>
                            <span class="badge badge-primary">
                                <?php echo $cat['product_count']; ?> product<?php echo $cat['product_count'] != 1 ? 's' : ''; ?>
                            </span>
                        </td>
                        <td><?php echo date('M d, Y', strtotime($cat['created_at'])); ?></td>
                        <td>
                            <a href="?delete=<?php echo $cat['id']; ?>" class="btn btn-sm btn-danger" 
                               onclick="return confirm('Are you sure you want to delete this category?');" title="Delete">
                                <i class="fas fa-trash"></i>
                            </a>
                        </td>
                    </tr>
                    <?php endforeach; ?>
                <?php endif; ?>
            </tbody>
        </table>
    </div>
</div>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>
