<?php
/**
 * PC Store - Forgot Password
 */
$pageTitle = 'Forgot Password';
require_once __DIR__ . '/includes/functions.php';

if (isLoggedIn()) {
    redirect(SITE_URL . '/index.php');
}

$message = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = sanitize($_POST['email'] ?? '');
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        setFlash('error', 'Please enter a valid email address.');
    } else {
        $db = getDB();
        $stmt = $db->prepare('SELECT id FROM users WHERE email = ?');
        $stmt->execute([$email]);
        if ($stmt->fetch()) {
            setFlash('success', 'If this email is registered, instructions were sent or contact the admin to reset your password.');
        } else {
            setFlash('success', 'If this email is registered, instructions were sent or contact the admin to reset your password.');
        }
        redirect(SITE_URL . '/forgot_password.php');
    }
}

require_once __DIR__ . '/includes/header.php';
?>

<div class="form-container">
    <div class="form-icon">
        <i class="fas fa-unlock-alt"></i>
    </div>
    <h2>Forgot Password</h2>

    <p>If you forgot your password, enter your email below and follow the reset instructions.</p>

    <form method="POST" action="">
        <div class="form-group">
            <label for="email">Email Address</label>
            <input type="email" id="email" name="email" required
                   placeholder="Enter your account email">
        </div>

        <button type="submit" class="btn btn-primary btn-block btn-lg">
            <i class="fas fa-paper-plane"></i> Send Reset Instructions
        </button>
    </form>

    <div class="form-footer">
        <p>Remembered your password? <a href="login.php">Login here</a></p>
        <p>Don't have an account? <a href="register.php">Register here</a></p>
    </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>