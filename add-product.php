<?php
/**
 * PC Store - Admin Add Product
 */
$pageTitle = 'Add Product';
require_once __DIR__ . '/../includes/functions.php';

requireAdmin();

$db = getDB();
$categories = getCategories();

// Handle form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = sanitize($_POST['name'] ?? '');
    $description = sanitize($_POST['description'] ?? '');
    $price = floatval($_POST['price'] ?? 0);
    $stock = intval($_POST['stock'] ?? 0);
    $category_id = intval($_POST['category_id'] ?? 0);
    $featured = isset($_POST['featured']) ? 1 : 0;
    
    if (empty($name) || $price <= 0) {
        setFlash('error', 'Please fill in all required fields.');
    } else {
        // Handle image upload
        $image = 'default.jpg';
        if (isset($_FILES['image']) && $_FILES['image']['error'] === 0) {
            $allowed = ['jpg', 'jpeg', 'png', 'gif'];
            $filename = $_FILES['image']['name'];
            $ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
            
            if (in_array($ext, $allowed)) {
                $newFilename = 'product_' . time() . '.' . $ext;
                $uploadPath = UPLOAD_DIR . $newFilename;
                
                if (move_uploaded_file($_FILES['image']['tmp_name'], $uploadPath)) {
                    $image = $newFilename;
                }
            }
        }
        
        try {
            $stmt = $db->prepare("INSERT INTO products (name, description, price, stock, category_id, image, featured) VALUES (?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([$name, $description, $price, $stock, $category_id, $image, $featured]);
            
            setFlash('success', 'Product added successfully!');
            redirect(SITE_URL . '/admin/products.php');
        } catch (PDOException $e) {
            setFlash('error', 'Error adding product: ' . $e->getMessage());
        }
    }
}

require_once __DIR__ . '/../includes/header.php';
?>

<div style="display:grid;grid-template-columns:250px 1fr;gap:0;margin:-30px -20px;">
    <?php include __DIR__ . '/sidebar.php'; ?>

    <div class="admin-content">
        <h1><i class="fas fa-plus-circle"></i> Add New Product</h1>

        <div class="form-container" style="max-width:800px;margin-top:20px;">
            <form method="POST" enctype="multipart/form-data">
                <div class="form-group">
                    <label for="name">Product Name *</label>
                    <input type="text" id="name" name="name" required 
                           value="<?php echo isset($_POST['name']) ? sanitize($_POST['name']) : ''; ?>">
                </div>

                <div class="form-group">
                    <label for="description">Description</label>
                    <textarea id="description" name="description" rows="4"><?php echo isset($_POST['description']) ? sanitize($_POST['description']) : ''; ?></textarea>
                </div>

                <div style="display:grid;grid-template-columns:1fr 1fr;gap:15px;">
                    <div class="form-group">
                        <label for="price">Price ($) *</label>
                        <input type="number" id="price" name="price" step="0.01" min="0.01" required
                               value="<?php echo isset($_POST['price']) ? $_POST['price'] : ''; ?>">
                    </div>

                    <div class="form-group">
                        <label for="stock">Stock *</label>
                        <input type="number" id="stock" name="stock" min="0" required
                               value="<?php echo isset($_POST['stock']) ? $_POST['stock'] : '0'; ?>">
                    </div>
                </div>

                <div class="form-group">
                    <label for="category_id">Category</label>
                    <select id="category_id" name="category_id">
                        <option value="0">Select Category</option>
                        <?php foreach ($categories as $cat): ?>
                            <option value="<?php echo $cat['id']; ?>" <?php echo (isset($_POST['category_id']) && $_POST['category_id'] == $cat['id']) ? 'selected' : ''; ?>>
                                <?php echo sanitize($cat['name']); ?>
                            </option>
                        <?php endforeach; ?>
                    </select>
                </div>

                <div class="form-group">
                    <label for="image">Product Image</label>
                    <input type="file" id="image" name="image" accept="image/*">
                    <small style="color:var(--gray-400);">Allowed: JPG, JPEG, PNG, GIF</small>
                </div>

                <div class="form-group">
                    <label style="display:flex;align-items:center;gap:10px;">
                        <input type="checkbox" name="featured" value="1" <?php echo isset($_POST['featured']) ? 'checked' : ''; ?>>
                        <span>Featured Product</span>
                    </label>
                </div>

                <div style="display:flex;gap:10px;margin-top:20px;">
                    <button type="submit" class="btn btn-primary btn-lg">
                        <i class="fas fa-plus"></i> Add Product
                    </button>
                    <a href="products.php" class="btn btn-secondary btn-lg">
                        <i class="fas fa-times"></i> Cancel
                    </a>
                </div>
            </form>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>
