<?php
/**
 * PC Store - Shopping Cart
 */
$pageTitle = 'Shopping Cart';
require_once __DIR__ . '/includes/functions.php';

// Initialize cart if not exists
if (!isset($_SESSION['cart'])) {
    $_SESSION['cart'] = [];
}

// Handle cart actions
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';

    switch ($action) {
        case 'add':
            $product_id = (int)($_POST['product_id'] ?? 0);
            $quantity = max(1, (int)($_POST['quantity'] ?? 1));

            $product = getProduct($product_id);
            if ($product && $product['stock'] > 0) {
                $found = false;
                foreach ($_SESSION['cart'] as &$item) {
                    if ($item['id'] == $product_id) {
                        $item['quantity'] = min($item['quantity'] + $quantity, $product['stock']);
                        $found = true;
                        break;
                    }
                }
                unset($item);

                if (!$found) {
                    $_SESSION['cart'][] = [
                        'id' => $product['id'],
                        'name' => $product['name'],
                        'price' => $product['price'],
                        'image' => $product['image'],
                        'quantity' => min($quantity, $product['stock']),
                        'stock' => $product['stock'],
                    ];
                }
                setFlash('success', sanitize($product['name']) . ' added to cart!');
            } else {
                setFlash('error', 'Product not found or out of stock.');
            }
            redirect(SITE_URL . '/cart.php');
            break;

        case 'update':
            $product_id = (int)($_POST['product_id'] ?? 0);
            $quantity = max(1, (int)($_POST['quantity'] ?? 1));

            foreach ($_SESSION['cart'] as &$item) {
                if ($item['id'] == $product_id) {
                    $item['quantity'] = min($quantity, $item['stock']);
                    break;
                }
            }
            unset($item);
            setFlash('success', 'Cart updated.');
            redirect(SITE_URL . '/cart.php');
            break;

        case 'remove':
            $product_id = (int)($_POST['product_id'] ?? 0);
            $_SESSION['cart'] = array_values(array_filter($_SESSION['cart'], function ($item) use ($product_id) {
                return $item['id'] != $product_id;
            }));
            setFlash('success', 'Item removed from cart.');
            redirect(SITE_URL . '/cart.php');
            break;

        case 'clear':
            $_SESSION['cart'] = [];
            setFlash('success', 'Cart cleared.');
            redirect(SITE_URL . '/cart.php');
            break;
    }
}

require_once __DIR__ . '/includes/header.php';
$cart = $_SESSION['cart'];
$cartTotal = getCartTotal();
?>

<div class="page-header">
    <div class="breadcrumb">
        <a href="index.php">Home</a> / <span>Shopping Cart</span>
    </div>
    <h1><i class="fas fa-shopping-cart"></i> Shopping Cart</h1>
    <p><?php echo count($cart); ?> item<?php echo count($cart) !== 1 ? 's' : ''; ?> in your cart</p>
</div>

<?php if (empty($cart)): ?>
    <div class="empty-cart">
        <i class="fas fa-shopping-cart"></i>
        <h3>Your cart is empty</h3>
        <p>Looks like you haven't added any items yet.</p>
        <a href="products.php" class="btn btn-primary btn-lg" style="margin-top: 15px;">
            <i class="fas fa-laptop"></i> Start Shopping
        </a>
    </div>
<?php else: ?>
    <table class="cart-table">
        <thead>
            <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Subtotal</th>
                <th>Action</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($cart as $item): ?>
            <tr>
                <td>
                    <div class="cart-item-info">
                        <img src="<?php echo getProductImage($item['image']); ?>" alt="<?php echo sanitize($item['name']); ?>">
                        <div>
                            <div class="name"><?php echo sanitize($item['name']); ?></div>
                        </div>
                    </div>
                </td>
                <td><?php echo formatPrice($item['price']); ?></td>
                <td>
                    <form action="cart.php" method="POST" class="cart-quantity">
                        <input type="hidden" name="action" value="update">
                        <input type="hidden" name="product_id" value="<?php echo $item['id']; ?>">
                        <input type="number" name="quantity" value="<?php echo $item['quantity']; ?>" min="1" max="<?php echo $item['stock']; ?>">
                        <button type="submit" class="btn btn-secondary btn-sm"><i class="fas fa-sync"></i></button>
                    </form>
                </td>
                <td><strong><?php echo formatPrice($item['price'] * $item['quantity']); ?></strong></td>
                <td>
                    <form action="cart.php" method="POST" style="display:inline;">
                        <input type="hidden" name="action" value="remove">
                        <input type="hidden" name="product_id" value="<?php echo $item['id']; ?>">
                        <button type="submit" class="btn btn-danger btn-sm" data-confirm="Remove this item from cart?">
                            <i class="fas fa-trash"></i>
                        </button>
                    </form>
                </td>
            </tr>
            <?php endforeach; ?>
        </tbody>
    </table>

    <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 20px;">
        <div>
            <form action="cart.php" method="POST" style="display:inline;">
                <input type="hidden" name="action" value="clear">
                <button type="submit" class="btn btn-secondary" data-confirm="Clear all items from cart?">
                    <i class="fas fa-trash-alt"></i> Clear Cart
                </button>
            </form>
            <a href="products.php" class="btn btn-secondary">
                <i class="fas fa-arrow-left"></i> Continue Shopping
            </a>
        </div>

        <div class="cart-summary">
            <h3>Order Summary</h3>
            <div class="summary-row">
                <span>Subtotal</span>
                <span><?php echo formatPrice($cartTotal); ?></span>
            </div>
            <div class="summary-row">
                <span>Shipping</span>
                <span>Free</span>
            </div>
            <div class="summary-total">
                <span>Total</span>
                <span><?php echo formatPrice($cartTotal); ?></span>
            </div>
            <a href="checkout.php" class="btn btn-success btn-block btn-lg" style="margin-top: 20px;">
                <i class="fas fa-credit-card"></i> Proceed to Checkout
            </a>
        </div>
    </div>
<?php endif; ?>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
