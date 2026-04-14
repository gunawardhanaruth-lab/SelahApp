<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Selah - Feedback</title>
    <style>
        /* Copied basic styles from main app for consistency */
        :root {
            --bg-color: #0f0f13;
            --text-color: #ffffff;
            --primary-color: #e0d4fc;
            --accent-color: #6366f1;
        }

        body {
            background-color: var(--bg-color);
            color: var(--text-color);
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
            margin: 0;
            display: flex;
            flex-direction: column;
            min-height: 100vh;
        }

        header {
            padding: 1.5rem 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .logo {
            font-size: 1.5rem;
            font-weight: 700;
            color: white;
            text-decoration: none;
            letter-spacing: -0.05em;
        }

        .logo span { color: var(--accent-color); }

        .btn-ghost {
            color: rgba(255,255,255,0.7);
            text-decoration: none;
            font-size: 0.9rem;
            transition: color 0.3s;
        }
        .btn-ghost:hover { color: white; }

        .container {
            max-width: 600px;
            margin: 4rem auto;
            padding: 2rem;
            background: rgba(255,255,255,0.03);
            border-radius: 12px;
            border: 1px solid rgba(255,255,255,0.1);
        }

        h1 { margin-top: 0; font-weight: 300; }
        
        form { margin-top: 2rem; display: flex; flex-direction: column; gap: 1rem; }
        
        input, textarea {
            background: rgba(0,0,0,0.3);
            border: 1px solid rgba(255,255,255,0.2);
            color: white;
            padding: 1rem;
            border-radius: 8px;
            font-family: inherit;
        }

        button {
            background: var(--accent-color);
            color: white;
            border: none;
            padding: 1rem;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            margin-top: 1rem;
        }

        .alert {
            padding: 1rem;
            background: rgba(99, 102, 241, 0.2);
            border: 1px solid var(--accent-color);
            border-radius: 8px;
            margin-bottom: 2rem;
            display: none;
        }
    </style>
</head>
<body>

    <header>
        <a href="http://localhost:3000" class="logo">Selah<span>.</span></a>
        <nav>
            <a href="http://localhost:3000" class="btn-ghost">Back to App</a>
        </nav>
    </header>

    <main class="container">
        <h1>Share your thoughts</h1>
        <p style="opacity: 0.7;">Tell us how Selah has impacted your spiritual journey.</p>

        <?php
        if ($_SERVER["REQUEST_METHOD"] == "POST") {
            // Simple processing - in a real app this might save to DB
            $name = htmlspecialchars($_POST['name']);
            $message = htmlspecialchars($_POST['message']);
            
            // Just simulate success
            echo '<div class="alert" style="display:block;">Thank you, ' . $name . '! Your feedback has been received.</div>';
        }
        ?>

        <form method="POST" action="">
            <input type="text" name="name" placeholder="Your Name" required>
            <textarea name="message" rows="5" placeholder="Your Message..." required></textarea>
            <button type="submit">Submit Feedback</button>
        </form>
    </main>

</body>
</html>
