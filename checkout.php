<?php
/**
 * PC Store - Checkout Page
 */
$pageTitle = 'Checkout';
require_once __DIR__ . '/includes/functions.php';

requireLogin();

if (empty($_SESSION['cart'])) {
    setFlash('error', 'Your cart is empty.');
    redirect(SITE_URL . '/cart.php');
}

// Handle checkout submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $address = sanitize($_POST['address'] ?? '');
    $phone = sanitize($_POST['phone'] ?? '');
    $notes = sanitize($_POST['notes'] ?? '');
    $payment_method = sanitize($_POST['payment_method'] ?? '');
    $payment_proof = null;

    if (empty($address) || empty($phone)) {
        setFlash('error', 'Please fill in shipping address and phone number.');
    } elseif (empty($payment_method)) {
        setFlash('error', 'Please select a payment method.');
    } elseif (!isset($_FILES['payment_proof']) || $_FILES['payment_proof']['error'] !== 0) {
        setFlash('error', 'Please upload payment proof screenshot.');
    } else {
        // Handle payment proof upload
        $allowed = ['jpg', 'jpeg', 'png', 'gif'];
        $filename = $_FILES['payment_proof']['name'];
        $ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
        
        if (!in_array($ext, $allowed)) {
            setFlash('error', 'Invalid file type. Please upload JPG, PNG, or GIF.');
        } else {
            $newFilename = 'payment_' . time() . '_' . mt_rand(1000, 9999) . '.' . $ext;
            $uploadPath = UPLOAD_DIR . $newFilename;
            
            if (!move_uploaded_file($_FILES['payment_proof']['tmp_name'], $uploadPath)) {
                setFlash('error', 'Failed to upload payment proof.');
            } else {
                $db = getDB();
                $cartTotal = getCartTotal();

                try {
                    $db->beginTransaction();

                    // Create order with payment info
                    $stmt = $db->prepare("INSERT INTO orders (user_id, total_amount, shipping_address, phone, notes, payment_method, payment_status, payment_proof) VALUES (?, ?, ?, ?, ?, ?, 'proof_uploaded', ?)");
                    $stmt->execute([$_SESSION['user_id'], $cartTotal, $address, $phone, $notes, $payment_method, $newFilename]);
                    $orderId = $db->lastInsertId();

                    // Create order items and update stock
                    foreach ($_SESSION['cart'] as $item) {
                        $stmt = $db->prepare("INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)");
                        $stmt->execute([$orderId, $item['id'], $item['quantity'], $item['price']]);

                        $stmt = $db->prepare("UPDATE products SET stock = stock - ? WHERE id = ?");
                        $stmt->execute([$item['quantity'], $item['id']]);
                    }

                    $db->commit();

                    // Clear cart
                    $_SESSION['cart'] = [];
                    setFlash('success', 'Order #' . $orderId . ' placed successfully! Payment proof uploaded. Awaiting admin approval.');
                    redirect(SITE_URL . '/orders.php');
                } catch (Exception $e) {
                    $db->rollBack();
                    setFlash('error', 'An error occurred while processing your order. Please try again.');
                }
            }
        }
    }
}

$user = getUser($_SESSION['user_id']);
require_once __DIR__ . '/includes/header.php';
$cart = $_SESSION['cart'];
$cartTotal = getCartTotal();

// Get available banks
try {
    $db = getDB();
    $banks = $db->query("SELECT * FROM banks WHERE is_active = 1 ORDER BY name")->fetchAll();
} catch (PDOException $e) {
    $banks = [];
}
?>

<div class="page-header">
    <div class="breadcrumb">
        <a href="index.php">Home</a> / <a href="cart.php">Cart</a> / <span>Checkout</span>
    </div>
    <h1><i class="fas fa-credit-card"></i> Checkout</h1>
</div>

<div class="checkout-grid">
    <div class="checkout-form">
        <h3><i class="fas fa-shipping-fast"></i> Shipping Information</h3>

        <form method="POST" action="" enctype="multipart/form-data" data-validate>
            <div class="form-group">
                <label for="full_name">Full Name</label>
                <input type="text" id="full_name" value="<?php echo sanitize($user['full_name']); ?>" disabled>
            </div>

            <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" value="<?php echo sanitize($user['email']); ?>" disabled>
            </div>

            <div class="form-group">
                <label for="phone">Phone Number *</label>
                <input type="text" id="phone" name="phone" required
                       placeholder="Enter your phone number"
                       value="<?php echo sanitize($user['phone'] ?? ''); ?>">
            </div>

            <div class="form-group">
                <label for="address">Shipping Address *</label>
                <textarea id="address" name="address" required
                          placeholder="Enter your full shipping address"><?php echo sanitize($user['address'] ?? ''); ?></textarea>
            </div>

            <div class="form-group">
                <label for="notes">Order Notes (Optional)</label>
                <textarea id="notes" name="notes" placeholder="Any special instructions..."></textarea>
            </div>

            <hr style="margin: 25px 0;">

            <h3><i class="fas fa-university"></i> Payment Method</h3>
            
            <?php if (empty($banks)): ?>
            <div class="alert alert-error">
                <i class="fas fa-exclamation-triangle"></i> No payment methods available. Please contact admin.
            </div>
            <?php else: ?>
            <div class="form-group">
                <label for="payment_method">Select Bank *</label>
                <select id="payment_method" name="payment_method" required onchange="showBankDetails(this.value)">
                    <option value="">-- Select Bank --</option>
                    <?php foreach ($banks as $bank): ?>
                        <option value="<?php echo $bank['id']; ?>">
                            <?php echo sanitize($bank['name']); ?>
                        </option>
                    <?php endforeach; ?>
                </select>
            </div>

            <div id="bankDetails" style="display:none; background: #f0f9ff; padding: 15px; border-radius: var(--radius); margin-bottom: 20px; border-left: 4px solid var(--primary-color);">
                <h4 style="margin-top: 0;"><i class="fas fa-info-circle"></i> Bank Account Details</h4>
                <div id="bankInfo"></div>
                <p style="margin-top: 10px; color: var(--gray-600); font-size: 0.9rem;">
                    <i class="fas fa-exclamation-triangle"></i> 
                    Please transfer the exact amount to this account, then upload the payment screenshot below.
                </p>
            </div>

            <div class="form-group">
                <label for="payment_proof">Upload Payment Proof Screenshot *</label>
                <input type="file" id="payment_proof" name="payment_proof" accept="image/*" required>
                <small style="color:var(--gray-400);">Upload screenshot/photo of your bank transfer receipt (JPG, PNG, GIF)</small>
            </div>

            <div id="paymentPreview" style="display:none; margin-bottom: 20px;">
                <img id="previewImage" src="" style="max-width: 100%; border-radius: var(--radius); border: 2px solid var(--primary-color);">
            </div>
            <?php endif; ?>

            <button type="submit" class="btn btn-success btn-block btn-lg">
                <i class="fas fa-check-circle"></i> Place Order & Upload Payment (<?php echo formatPrice($cartTotal); ?>)
            </button>
        </form>
    </div>

    <div>
        <div class="cart-summary">
            <h3>Order Summary</h3>
            <?php foreach ($cart as $item): ?>
            <div class="summary-row">
                <span><?php echo sanitize($item['name']); ?> x<?php echo $item['quantity']; ?></span>
                <span><?php echo formatPrice($item['price'] * $item['quantity']); ?></span>
            </div>
            <?php endforeach; ?>
            <div class="summary-row">
                <span>Shipping</span>
                <span>Free</span>
            </div>
            <div class="summary-total">
                <span>Total</span>
                <span><?php echo formatPrice($cartTotal); ?></span>
            </div>
        </div>
    </div>
</div>

<script>
// Bank details data
const bankDetails = <?php echo json_encode($banks); ?>;

function showBankDetails(bankId) {
    const detailsDiv = document.getElementById('bankDetails');
    const bankInfoDiv = document.getElementById('bankInfo');
    
    if (!bankId) {
        detailsDiv.style.display = 'none';
        return;
    }
    
    const bank = bankDetails.find(b => b.id == bankId);
    if (bank) {
        bankInfoDiv.innerHTML = `
            <p style="margin: 5px 0;"><strong>Bank:</strong> ${bank.name}</p>
            <p style="margin: 5px 0;"><strong>Account Number:</strong> ${bank.account_number}</p>
            <p style="margin: 5px 0;"><strong>Account Name:</strong> ${bank.account_name}</p>
        `;
        detailsDiv.style.display = 'block';
    }
}

// Payment proof preview
document.getElementById('payment_proof').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('previewImage').src = e.target.result;
            document.getElementById('paymentPreview').style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
});
</script>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
