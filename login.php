<?php
/**
 * PC Store - Login Page
 */
$pageTitle = 'Login';
require_once __DIR__ . '/includes/functions.php';

// Redirect if already logged in
if (isLoggedIn()) {
    redirect(SITE_URL . '/index.php');
}

// Handle login form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = sanitize($_POST['username'] ?? '');
    $password = $_POST['password'] ?? '';

    if (empty($username) || empty($password)) {
        setFlash('error', 'Please fill in all fields.');
    } else {
        try {
            $db = getDB();
            
            // Auto-fix admin password on first login attempt
            if ($username === 'admin' || $username === 'admin@pcstore.com') {
                $checkAdmin = $db->prepare("SELECT password FROM users WHERE username = 'admin'");
                $checkAdmin->execute();
                $adminUser = $checkAdmin->fetch();
                
                // If admin password is not hashed, fix it
                if ($adminUser && strlen($adminUser['password']) < 60) {
                    $hashedPassword = password_hash('123456', PASSWORD_DEFAULT);
                    $fixStmt = $db->prepare("UPDATE users SET password = ? WHERE username = 'admin'");
                    $fixStmt->execute([$hashedPassword]);
                }
            }
            
            $stmt = $db->prepare("SELECT * FROM users WHERE username = ? OR email = ?");
            $stmt->execute([$username, $username]);
            $user = $stmt->fetch();

            // Check if user exists and password matches (hashed or plain text for backward compatibility)
            if ($user) {
                $passwordValid = false;
                
                // Check hashed password
                if (password_verify($password, $user['password'])) {
                    $passwordValid = true;
                } 
                // Fallback: check plain text (for old accounts, will be re-hashed on login)
                elseif ($password === $user['password']) {
                    // Re-hash the password
                    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
                    $updateStmt = $db->prepare("UPDATE users SET password = ? WHERE id = ?");
                    $updateStmt->execute([$hashedPassword, $user['id']]);
                    $passwordValid = true;
                }
                
                if ($passwordValid) {
                    $_SESSION['user_id'] = $user['id'];
                    $_SESSION['username'] = $user['username'];
                    $_SESSION['user_role'] = $user['role'];
                    $_SESSION['full_name'] = $user['full_name'];

                    setFlash('success', 'Welcome back, ' . $user['full_name'] . '!');

                    if ($user['role'] === 'admin') {
                        redirect(SITE_URL . '/admin/dashboard.php');
                    } else {
                        redirect(SITE_URL . '/index.php');
                    }
                } else {
                    setFlash('error', 'Invalid username or password.');
                }
            } else {
                setFlash('error', 'Invalid username or password.');
            }
        } catch (PDOException $e) {
            setFlash('error', 'Database error. Please ensure the database is set up correctly.');
        }
    }
}

require_once __DIR__ . '/includes/header.php';
?>

<div class="form-container">
    <div class="form-icon">
        <i class="fas fa-user-lock"></i>
    </div>
    <h2>Login to Your Account</h2>

    <form method="POST" action="">
        <div class="form-group">
            <label for="username">Username or Email</label>
            <input type="text" id="username" name="username" required
                   placeholder="Enter your username or email"
                   value="<?php echo isset($username) ? sanitize($username) : ''; ?>">
        </div>

        <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" name="password" required
                   placeholder="Enter your password">
        </div>

        <button type="submit" class="btn btn-primary btn-block btn-lg">
            <i class="fas fa-sign-in-alt"></i> Login
        </button>
    </form>

    <div class="form-footer">
        <p>Forgot your password? <a href="forgot_password.php">Reset it here</a></p>
        <p>Don't have an account? <a href="register.php">Register here</a></p>
    </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>