<?php
/**
 * PC Store - Contact Page
 */
$pageTitle = 'Contact Us';
require_once __DIR__ . '/includes/functions.php';

// Handle contact form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = sanitize($_POST['name'] ?? '');
    $email = sanitize($_POST['email'] ?? '');
    $subject = sanitize($_POST['subject'] ?? '');
    $message = sanitize($_POST['message'] ?? '');

    if (empty($name) || empty($email) || empty($subject) || empty($message)) {
        setFlash('error', 'Please fill in all fields.');
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        setFlash('error', 'Please enter a valid email address.');
    } else {
        $db = getDB();
        $stmt = $db->prepare("INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)");
        $stmt->execute([$name, $email, $subject, $message]);

        setFlash('success', 'Thank you for your message! We will get back to you soon.');
        redirect(SITE_URL . '/contact.php');
    }
}

require_once __DIR__ . '/includes/header.php';
?>

<div class="page-header">
    <div class="breadcrumb">
        <a href="index.php">Home</a> / <span>Contact Us</span>
    </div>
    <h1>Contact Us</h1>
    <p>We'd love to hear from you. Send us a message!</p>
</div>

<div class="contact-grid">
    <div class="contact-info">
        <h2>Get in Touch</h2>
        <p>Have a question about our products? Need help with an order? Or just want to say hello? We're here to help!</p>

        <div class="contact-item">
            <div class="icon"><i class="fas fa-map-marker-alt"></i></div>
            <div class="info">
                <h4>Our Location</h4>
                <p>123 Tech Street, Silicon Valley, CA 94000</p>
            </div>
        </div>

        <div class="contact-item">
            <div class="icon"><i class="fas fa-phone"></i></div>
            <div class="info">
                <h4>Phone Number</h4>
                <p>+(251) 925692705</p>
            </div>
        </div>

        <div class="contact-item">
            <div class="icon"><i class="fas fa-envelope"></i></div>
            <div class="info">
                <h4>Email Address</h4>
                <p>info@pcstore.com</p>
            </div>
        </div>

        <div class="contact-item">
            <div class="icon"><i class="fas fa-clock"></i></div>
            <div class="info">
                <h4>Business Hours</h4>
                <p>Mon - Fri: 9:00 AM - 6:00 PM<br>Sat: 10:00 AM - 4:00 PM</p>
            </div>
        </div>
    </div>

    <div class="contact-form">
        <h3><i class="fas fa-paper-plane"></i> Send us a Message</h3>

        <form method="POST" action="" data-validate>
            <div class="form-group">
                <label for="name">Your Name</label>
                <input type="text" id="name" name="name" required
                       placeholder="Enter your name"
                       value="<?php echo isset($name) ? sanitize($name) : ''; ?>">
            </div>

            <div class="form-group">
                <label for="email">Email Address</label>
                <input type="email" id="email" name="email" required
                       placeholder="Enter your email"
                       value="<?php echo isset($email) ? sanitize($email) : ''; ?>">
            </div>

            <div class="form-group">
                <label for="subject">Subject</label>
                <input type="text" id="subject" name="subject" required
                       placeholder="What is this about?"
                       value="<?php echo isset($subject) ? sanitize($subject) : ''; ?>">
            </div>

            <div class="form-group">
                <label for="message">Message</label>
                <textarea id="message" name="message" required
                          placeholder="Write your message here..."><?php echo isset($message) ? sanitize($message) : ''; ?></textarea>
            </div>

            <button type="submit" class="btn btn-primary btn-block btn-lg">
                <i class="fas fa-paper-plane"></i> Send Message
            </button>
        </form>
    </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
