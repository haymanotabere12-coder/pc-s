<?php

$pageTitle = 'Register';
require_once __DIR__ . '/includes/functions.php';


if (isLoggedIn()) {
    redirect(SITE_URL . '/index.php');
}


if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = sanitize($_POST['username'] ?? '');
    $email = sanitize($_POST['email'] ?? '');
    $full_name = sanitize($_POST['full_name'] ?? '');
    $password = $_POST['password'] ?? '';
    $confirm_password = $_POST['confirm_password'] ?? '';

    $errors = [];

    if (empty($username) || empty($email) || empty($full_name) || empty($password)) {
        $errors[] = 'Please fill in all required fields.';
    }

    if (strlen($username) < 3) {
        $errors[] = 'Username must be at least 3 characters.';
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = 'Please enter a valid email address.';
    }

    if (strlen($password) < 6) {
        $errors[] = 'Password must be at least 6 characters.';
    }

    if ($password !== $confirm_password) {
        $errors[] = 'Passwords do not match.';
    }

    if (empty($errors)) {
        $db = getDB();

        
        $stmt = $db->prepare("SELECT id FROM users WHERE username = ? OR email = ?");
        $stmt->execute([$username, $email]);
        if ($stmt->fetch()) {
            $errors[] = 'Username or email already exists. If this is your account, please login or use forgot password.';
        } else {
            $hashed_password = password_hash($password, PASSWORD_DEFAULT);
            $stmt = $db->prepare("INSERT INTO users (username, email, full_name, password) VALUES (?, ?, ?, ?)");
            $stmt->execute([$username, $email, $full_name, $hashed_password]);

            setFlash('success', 'Account created successfully! Please login.');
            redirect(SITE_URL . '/login.php');
        }
    }

    if (!empty($errors)) {
        setFlash('error', implode('<br>', $errors));
    }
}

require_once __DIR__ . '/includes/header.php';
?>

<div class="form-container">
    <div class="form-icon">
        <i class="fas fa-user-plus"></i>
    </div>
    <h2>Create an Account</h2>

    <form method="POST" action="">
        <div class="form-group">
            <label for="full_name">Full Name *</label>
            <input type="text" id="full_name" name="full_name" required
                   placeholder="Enter your full name"
                   value="<?php echo isset($full_name) ? sanitize($full_name) : ''; ?>">
        </div>

        <div class="form-group">
            <label for="username">Username *</label>
            <input type="text" id="username" name="username" required
                   placeholder="Choose a username (min 3 characters)"
                   value="<?php echo isset($username) ? sanitize($username) : ''; ?>">
        </div>

        <div class="form-group">
            <label for="email">Email Address *</label>
            <input type="email" id="email" name="email" required
                   placeholder="Enter your email"
                   value="<?php echo isset($email) ? sanitize($email) : ''; ?>">
        </div>

        <div class="form-group">
            <label for="password">Password *</label>
            <input type="password" id="password" name="password" required
                   placeholder="Create a password (min 6 characters)">
        </div>

        <div class="form-group">
            <label for="confirm_password">Confirm Password *</label>
            <input type="password" id="confirm_password" name="confirm_password" required
                   placeholder="Confirm your password">
        </div>

        <button type="submit" class="btn btn-primary btn-block btn-lg">
            <i class="fas fa-user-plus"></i> Register
        </button>
    </form>

    <div class="form-footer">
        <p>Already have an account? <a href="login.php">Login here</a></p>
    </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>