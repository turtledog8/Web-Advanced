<script>
    export let active;
    export let isLoggedIn = false;
    export let isAdmin = false;
    export let id = "";

    const isJwtValid = () => {
        const token = localStorage.getItem('token');

        if (token === null) {
            return false;
        }

        try {
            const decodedToken = JSON.parse(atob(token.split('.')[1]));
            const currentTimestamp = Math.floor(Date.now() / 1000);

            // Check if the token has not expired
            if (decodedToken.exp && decodedToken.exp < currentTimestamp) {
                return false;
            }

            isAdmin = decodedToken.isAdmin;
            id = decodedToken.id;

            return true;
        } catch (error) {
            // If there is an error decoding or parsing the token, it's not valid
            return false;
        }
    }

    isLoggedIn = isJwtValid();
</script>

<div class="wrapper">
    <nav class="navbar">
        <a href="/" id="logo">
            <img src="http://localhost:3000/img/auction-logo.png" alt="Logo" />
        </a>

        <ul class="nav-list">
            <li class="nav-item">
                <a class:active={active === "/home"} href="/home">Home</a>
            </li>
            <li class="nav-item">
                <a class:active={active === "/store"} href="/store">Store</a>
            </li>

            {#if isLoggedIn}
                <li class="nav-item">
                    <a class:active={active === `/profile/${id}`} href={`/profile/${id}`}>Profile</a>
                </li>
                <li class="nav-item">
                    <a href="/logout">Log out</a>
                </li>
            {:else}
                <li class="nav-item">
                    <a class:active={active === "/login"} href="/login">Login</a>
                </li>
                <li class="nav-item">
                    <a class:active={active === "/register"} href="/register">Register</a>
                </li>
            {/if}
        </ul>
    </nav>
    <hr>
</div>


<style>
    #logo img {
        width: 100%;
        height: auto;
    }

    #logo {
        position: relative;
        height: auto;
        width: 50px;
        margin: 10px 10px 0 10px;
    }

    .wrapper {
        position: fixed;
        top: 0;
        background-color: darkgreen; /* Changed background color */
        color: black;
        padding: 10px 0 5px;
        width: 100%;
        height: 5vh;
        z-index: 1;
    }

    .navbar {
        display: flex;
        align-items: center;
        height: 100%;
    }

    hr {
        margin: 0;
        padding: 0;
        width: 100%;
    }

    .nav-list {
        list-style-type: none;
        display: flex;
    }

    .nav-item {
        margin-right: 20px;
    }

    a {
        text-decoration: none;
        color: black; /* Set text color to white */
        transition: top 0.2s ease, color 0.2s ease, background 0.2s ease; /* Added hover transition */
        position: relative;
        top: 0;
    }

    a.active {
        font-weight: bold;
    }

    .nav-item:hover a {
        top: 10px;
        color: darkgreen;
        background: black;
    }

    .profile-picture {
        width: 30px; /* Set width for profile picture */
        height: 30px; /* Set height for profile picture */
        border-radius: 50%; /* Make it round */
        object-fit: cover; /* Maintain aspect ratio */
    }
</style>