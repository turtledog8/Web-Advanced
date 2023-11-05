<script>



</script>

<main class="home-container">
    <section class="hero">
        <div class="hero-content">
            <h1>Welcome to Antique Auctions</h1>
            <p>Explore the world of exquisite antiques and bid on timeless treasures.</p>
            <a href="/store" class="cta-button">Explore Auctions</a>
        </div>
    </section>

    <section class="features">
        <div class="feature">
            <h2>Wide Selection</h2>
            <p>Discover a diverse collection of unique antiques from various historical periods and cultures.</p>
        </div>
        <div class="feature">
            <h2>Secure Bidding</h2>
            <p>Enjoy a safe and secure bidding experience with our state-of-the-art encryption and authentication.</p>
        </div>
        <div class="feature">
            <h2>Expert Appraisals</h2>
            <p>Receive expert appraisals for your antiques, ensuring transparency and confidence in your bids.</p>
        </div>
    </section>
</main>

<style>
    .home-container {
        text-align: center;
    }

    .hero {
        background-size: cover;
        background-position: center;
        color: var(--secondary);
        padding: 150px 20px;
    }

    .hero-content {
        max-width: 600px;
        margin: 0 auto;
    }

    .hero h1 {
        font-size: 3rem;
        margin-bottom: 20px;
    }

    .hero p {
        font-size: 1.2rem;
        margin-bottom: 30px;
    }

    .cta-button {
        display: inline-block;
        padding: 10px 20px;
        background-color: var(--primary);
        color: var(--secondary);
        text-decoration: none;
        font-weight: bold;
        border-radius: 5px;
        transition: background-color 0.3s ease;
    }

    .cta-button:hover {
        background-color: var(--accent);
    }

    .features {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        margin-top: 50px;
    }

    .feature {
        flex: 1;
        max-width: 300px;
        margin: 20px;
        padding: 20px;
        background-color: var(--secondary);
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }

    .feature h2 {
        font-size: 1.5rem;
        margin-bottom: 15px;
    }

    .feature p {
        font-size: 1rem;
    }
</style>
