<?php

require_once __DIR__ . '/includes/functions.php';

$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
$product = getProduct($id);

if (!$product) {
    setFlash('error', 'Product not found.');
    redirect(SITE_URL . '/products.php');
}

$pageTitle = $product['name'];
require_once __DIR__ . '/includes/header.php';
?>

<div class="page-header">
    <div class="breadcrumb">
        <a href="index.php">Home</a> /
        <a href="products.php">Products</a> /
        <?php if ($product['category_name']): ?>
            <a href="products.php?category=<?php echo $product['category_id']; ?>"><?php echo sanitize($product['category_name']); ?></a> /
        <?php endif; ?>
        <span><?php echo sanitize($product['name']); ?></span>
    </div>
</div>

<div class="product-detail">
    <div class="product-gallery">
        <img src="<?php echo getProductImage($product['image']); ?>" alt="<?php echo sanitize($product['name']); ?>">
    </div>

    <div class="product-info">
        <span class="product-category" style="display:inline-block;margin-bottom:10px;">
            <?php echo sanitize($product['category_name'] ?? 'General'); ?>
        </span>
        <h1><?php echo sanitize($product['name']); ?></h1>

        <div class="price"><?php echo formatPrice($product['price']); ?></div>

        <div class="product-meta">
            <span><i class="fas fa-box"></i> Stock: <?php echo $product['stock']; ?> units</span>
            <span><i class="fas fa-tag"></i> <?php echo sanitize($product['category_name'] ?? 'General'); ?></span>
            <span><i class="fas fa-barcode"></i> SKU: PC-<?php echo str_pad($product['id'], 5, '0', STR_PAD_LEFT); ?></span>
        </div>

        <div class="description">
            <h3 style="margin-bottom: 10px;">Description</h3>
            <p><?php echo nl2br(sanitize($product['description'])); ?></p>
        </div>

        <?php if ($product['stock'] > 0): ?>
        <form action="cart.php" method="POST">
            <input type="hidden" name="action" value="add">
            <input type="hidden" name="product_id" value="<?php echo $product['id']; ?>">
            <input type="hidden" name="quantity" value="1">

            <div class="quantity-selector">
                <label for="quantity">Quantity:</label>
                <input type="number" id="quantity" name="quantity" value="1" min="1" max="<?php echo $product['stock']; ?>">
            </div>

            <button type="submit" class="btn btn-primary btn-lg">
                <i class="fas fa-cart-plus"></i> buy cart!
            </button>
        </form>
        <?php else: ?>
            <div class="alert alert-warning">
                <i class="fas fa-exclamation-triangle"></i> This product is currently out of stock.
            </div>
        <?php endif; ?>
    </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
