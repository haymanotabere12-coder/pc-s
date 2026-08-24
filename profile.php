<?php
/**
 * PC Store - User Profile Page
 */
$pageTitle = 'My Profile';
require_once __DIR__ . '/includes/functions.php';

requireLogin();

$user = getUser($_SESSION['user_id']);

// Handle profile update
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? 'update_profile';

    if ($action === 'update_profile') {
        $full_name = sanitize($_POST['full_name'] ?? '');
        $email = sanitize($_POST['email'] ?? '');
        $phone = sanitize($_POST['phone'] ?? '');
        $address = sanitize($_POST['address'] ?? '');
        $avatar = $user['avatar'] ?? null;
        $profileError = false;

        if (isset($_FILES['avatar']) && $_FILES['avatar']['error'] === UPLOAD_ERR_OK) {
            $allowed = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
            $ext = strtolower(pathinfo($_FILES['avatar']['name'], PATHINFO_EXTENSION));

            if (!in_array($ext, $allowed)) {
                setFlash('error', 'Invalid profile picture format. Use JPG, PNG, GIF or WEBP.');
                $profileError = true;
            } else {
                $newAvatar = 'avatar_' . $_SESSION['user_id'] . '_' . time() . '.' . $ext;
                if (move_uploaded_file($_FILES['avatar']['tmp_name'], UPLOAD_DIR . $newAvatar)) {
                    if ($avatar && file_exists(UPLOAD_DIR . $avatar)) {
                        @unlink(UPLOAD_DIR . $avatar);
                    }
                    $avatar = $newAvatar;
                } else {
                    setFlash('error', 'Failed to upload profile picture.');
                    $profileError = true;
                }
            }
        }

        if (!$profileError) {
            if (empty($full_name) || empty($email)) {
                setFlash('error', 'Name and email are required.');
            } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                setFlash('error', 'Please enter a valid email address.');
            } elseif (!empty($phone) && !preg_match('/^\+?[0-9\s()\-]{7,20}$/', $phone)) {
                setFlash('error', 'Please enter a valid phone number.');
            } else {
                $db = getDB();
                ensureUserAvatarColumn();
                // Check email uniqueness
                $stmt = $db->prepare("SELECT id FROM users WHERE email = ? AND id != ?");
                $stmt->execute([$email, $_SESSION['user_id']]);
                if ($stmt->fetch()) {
                    setFlash('error', 'Email already in use by another account.');
                } else {
                    $sql = "UPDATE users SET full_name = ?, email = ?, phone = ?, address = ?";
                    $params = [$full_name, $email, $phone, $address];

                    if ($avatar !== ($user['avatar'] ?? null)) {
                        $sql .= ", avatar = ?";
                        $params[] = $avatar;
                    }

                    $sql .= " WHERE id = ?";
                    $params[] = $_SESSION['user_id'];

                    $stmt = $db->prepare($sql);
                    $stmt->execute($params);
                    $_SESSION['full_name'] = $full_name;
                    setFlash('success', 'Profile updated successfully!');
                    redirect(SITE_URL . '/profile.php');
                }
            }
        }
    } elseif ($action === 'change_password') {
        $current_password = $_POST['current_password'] ?? '';
        $new_password = $_POST['new_password'] ?? '';
        $confirm_password = $_POST['confirm_new_password'] ?? '';

        $db = getDB();
        $stmt = $db->prepare("SELECT password FROM users WHERE id = ?");
        $stmt->execute([$_SESSION['user_id']]);
        $userData = $stmt->fetch();

        if (!password_verify($current_password, $userData['password'])) {
            setFlash('error', 'Current password is incorrect.');
        } elseif (strlen($new_password) < 6) {
            setFlash('error', 'New password must be at least 6 characters.');
        } elseif ($new_password !== $confirm_password) {
            setFlash('error', 'New passwords do not match.');
        } else {
            $hashed = password_hash($new_password, PASSWORD_DEFAULT);
            $stmt = $db->prepare("UPDATE users SET password = ? WHERE id = ?");
            $stmt->execute([$hashed, $_SESSION['user_id']]);
            setFlash('success', 'Password changed successfully!');
            redirect(SITE_URL . '/profile.php');
        }
    }

    $user = getUser($_SESSION['user_id']);
}

require_once __DIR__ . '/includes/header.php';
?>

<div class="page-header">
    <div class="breadcrumb">
        <a href="index.php">Home</a> / <span>My Profile</span>
    </div>
    <h1><i class="fas fa-user-cog"></i> My Profile</h1>
</div>

<div class="profile-grid">
    <div class="profile-sidebar">
        <div class="avatar">
            <img src="<?php echo getUserAvatar($user['avatar'] ?? null); ?>" alt="<?php echo sanitize($user['full_name']); ?>">
        </div>
        <h3><?php echo sanitize($user['full_name']); ?></h3>
        <p>@<?php echo sanitize($user['username']); ?></p>
        <p style="font-size: 0.8rem; color: var(--gray-400);">Member since <?php echo date('M Y', strtotime($user['created_at'])); ?></p>

        <div class="profile-nav" style="margin-top: 20px;">
            <a href="profile.php" class="active"><i class="fas fa-user"></i> Profile</a>
            <a href="orders.php"><i class="fas fa-box"></i> My Orders</a>
            <a href="cart.php"><i class="fas fa-shopping-cart"></i> Cart</a>
        </div>
    </div>

    <div class="profile-content">
        <h2>Edit Profile</h2>

        <form method="POST" action="" enctype="multipart/form-data">
            <input type="hidden" name="action" value="update_profile">

            <div class="form-row">
                <div class="form-group">
                    <label for="full_name">Full Name</label>
                    <input type="text" id="full_name" name="full_name" required
                           value="<?php echo sanitize($user['full_name']); ?>">
                </div>
                <div class="form-group">
                    <label for="username">Username</label>
                    <input type="text" id="username" value="<?php echo sanitize($user['username']); ?>" disabled>
                    <span class="help-text">Username cannot be changed</span>
                </div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label for="email">Email Address</label>
                    <input type="email" id="email" name="email" required
                           value="<?php echo sanitize($user['email']); ?>">
                </div>
                <div class="form-group">
                    <label for="phone">Phone Number</label>
                    <input type="text" id="phone" name="phone"
                           value="<?php echo sanitize($user['phone'] ?? ''); ?>"
                           placeholder="Enter phone number">
                </div>
            </div>

            <div class="form-group">
                <label for="address">Address</label>
                <textarea id="address" name="address" placeholder="Enter your address"><?php echo sanitize($user['address'] ?? ''); ?></textarea>
            </div>

            <div class="form-group">
                <label for="avatar">Profile Picture</label>
                <input type="file" id="avatar" name="avatar" accept="image/*">
                <span class="help-text">Upload JPG, PNG, GIF, or WEBP image.</span>
            </div>

            <button type="submit" class="btn btn-primary">
                <i class="fas fa-save"></i> Save Changes
            </button>
        </form>

        <h2 style="margin-top: 40px;">Change Password</h2>

        <form method="POST" action="">
            <input type="hidden" name="action" value="change_password">

            <div class="form-group">
                <label for="current_password">Current Password</label>
                <input type="password" id="current_password" name="current_password" required>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label for="new_password">New Password</label>
                    <input type="password" id="new_password" name="new_password" required
                           placeholder="Min 6 characters">
                </div>
                <div class="form-group">
                    <label for="confirm_new_password">Confirm New Password</label>
                    <input type="password" id="confirm_new_password" name="confirm_new_password" required>
                </div>
            </div>

            <button type="submit" class="btn btn-warning">
                <i class="fas fa-key"></i> Change Password
            </button>
        </form>
    </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
