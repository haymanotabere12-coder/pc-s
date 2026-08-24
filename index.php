<?php
/**
 * PC Store - Home Page
 */
$pageTitle = 'Home';
require_once __DIR__ . '/includes/header.php';

// Initialize cart if not exists
if (!isset($_SESSION['cart'])) {
    $_SESSION['cart'] = [];
}
$cart = $_SESSION['cart'];

$featuredProducts = getFeaturedProducts(8);
$categories = getCategories();
?>

<!-- Loading Screen -->
<div id="loading-screen">
    <div class="loading-content">
        <div class="loading-logo">
            <i class="fas fa-desktop"></i>
            <h1><?php echo SITE_NAME; ?></h1>
        </div>
        <div class="loading-spinner"></div>
        <p>Welcome to our store...</p>
    </div>
</div>

<!-- Hero Section -->
<div class="hero">
    <div class="hero-content">
        <h1>Welcome to <?php echo SITE_NAME; ?></h1>
        <p>Your one-stop shop for the best PC components, laptops, and accessories</p>
        <a href="products.php" class="btn btn-primary btn-lg">
            <i class="fas fa-laptop"></i> Shop Now
        </a>
    </div>
    <div class="hero-image">
        <img src="images/2.jpg" alt="Laptop Image">
    </div>
</div>

<!-- Categories Section -->
<div class="section-header">
    <h2>Browse Categories</h2>
    <p>Find exactly what you're looking for</p>
</div>

<div class="category-grid">
    <?php
    $images = [
        'https://via.placeholder.com/150x150?text=laptop',
        'https://via.placeholder.com/150x150?text=1',
        'https://via.placeholder.com/150x150?text=2',
        'https://via.placeholder.com/150x150?text=3',
        'https://via.placeholder.com/150x150?text=Mouse',
        'https://via.placeholder.com/150x150?text=Headphones',
        'https://via.placeholder.com/150x150?text=CPU',
        'https://via.placeholder.com/150x150?text=GPU',
        'https://via.placeholder.com/150x150?text=Storage',
        'https://via.placeholder.com/150x150?text=Accessories'
    ];
    foreach ($categories as $i => $cat):
        $image = $images[$i] ?? 'https://via.placeholder.com/150x150?text=Category';
    ?>
    <a href="products.php?category=<?php echo $cat['id']; ?>" class="category-card">
        <img src="<?php echo $image; ?>" alt="<?php echo sanitize($cat['name']); ?>">
        <h4><?php echo sanitize($cat['name']); ?></h4>
    </a>
    <?php endforeach; ?>
</div>

<!-- Featured Products Section -->
<div class="section-header">
    <h2>Featured Products</h2>
    <p>Check out our most popular items</p>
</div>

<div class="product-grid">
    <?php foreach ($featuredProducts as $product): ?>
    <div class="product-card">
        <div class="product-image">
            <img src="<?php echo getProductImage($product['image']); ?>" alt="<?php echo sanitize($product['name']); ?>">
        </div>
        <div class="product-info">
            <span class="product-category"><?php echo sanitize($product['category_name'] ?? 'General'); ?></span>
            <h3 class="product-name">
                <a href="product.php?id=<?php echo $product['id']; ?>"><?php echo sanitize($product['name']); ?></a>
            </h3>
            <p class="product-desc"><?php echo sanitize($product['description']); ?></p>
            <div class="product-footer">
                <span class="product-price"><?php echo formatPrice($product['price']); ?></span>
                <span class="product-stock <?php echo $product['stock'] > 0 ? '' : 'out-of-stock'; ?>">
                    <?php echo $product['stock'] > 0 ? 'In Stock' : 'Out of Stock'; ?>
                </span>
            </div>
            <?php if ($product['stock'] > 0 && !isAdmin()): ?>
            <form action="cart.php" method="POST" class="btn-add-cart">
                <input type="hidden" name="action" value="add">
                <input type="hidden" name="product_id" value="<?php echo $product['id']; ?>">
                <input type="hidden" name="quantity" value="1">
                <button type="submit" class="btn btn-primary btn-block btn-sm">
                    <i class="fas fa-cart-plus"></i> Add to Cart
                </button>
            </form>
            <?php endif; ?>
        </div>
    </div>
    <?php endforeach; ?>
</div>

<div style="text-align: center; margin-bottom: 30px;">
    <a href="products.php" class="btn btn-secondary btn-lg">
        <i class="fas fa-th"></i> View All Products
    </a>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
