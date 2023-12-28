<script>
    let firstName = "";
    let lastName = "";
    let username = "";
    let email = "";
    let password = "";
    let errorMessage = "";

    const sanitizeInput = (input) => {
        if (typeof input !== 'string') {
            return '';
        }

        input = input.replace(/'/g, "\\'");
        input = input.replace(/"/g, '\\"');
        input = input.replace(/</g, '&lt;');
        input = input.replace(/>/g, '&gt;');
        input = input.replace(/&/g, '&amp;');
        input = input.replace(/'/g, '&#39;');
        input = input.replace(/"/g, '&quot;');

        return input;
    }

    async function handleSubmit(event) {
        event.preventDefault(); // Prevent the default form submission behavior

        // Validate email and username using regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+/;
        const usernameRegex = /^[a-zA-Z0-9_]{4,}$/;

        if (!emailRegex.test(email)) {
            errorMessage = "Invalid email address";
            return;
        }

        if (!usernameRegex.test(username)) {
            errorMessage = "Username must be at least 4 characters long and contain only letters, numbers, and underscores.";
            return;
        }

        const data = {
            firstName,
            lastName,
            username,
            email,
            password,
        };

        const sanitizedData = {};

        Object.keys(data).forEach(key => {
            sanitizedData[key] = sanitizeInput(data[key]);
        });
        try {
            const response = await fetch("http://localhost:3000/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(sanitizedData),
            });

            if (response.status === 201) {
                const result = await response.json();
                localStorage.setItem("token", result.token);

                // After successful registration, initiate the login process
                const loginResponse = await fetch("http://localhost:3000/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(sanitizedData),
                });

                if (loginResponse.status === 200) {
                    const loginResult = await loginResponse.json();
                    localStorage.setItem("token", loginResult.token);

                    errorMessage = "";

                    window.location.href = "/";
                } else {
                    errorMessage = "Login details were incorrect.";
                }
            } else {
                errorMessage = "Registration failed. Please try again.";
            }
        } catch (error) {
            errorMessage = "An error occurred. Please try again later." + error;
        }
    }
</script>

<main>
    {#if errorMessage}
        <p class="error">{errorMessage}</p>
    {/if}

    <form on:submit={handleSubmit} class="registration-form">
        <label for="firstname">First Name:</label>
        <input type="text" id="firstname" bind:value={firstName} required />

        <label for="lastname">Last Name:</label>
        <input type="text" id="lastname" bind:value={lastName} required />

        <label for="username">Username:</label>
        <input type="text" id="username" bind:value={username} required />

        <label for="email">Email:</label>
        <input type="email" id="email" bind:value={email} required />

        <label for="password">Password:</label>
        <input type="password" id="password" bind:value={password} required />

        <button type="submit">Register</button>
    </form>
</main>

<style>
    .registration-form {
        font-family: 'Poppins', sans-serif;
        font-weight: 400;
        text-align: center;
        background-color: var(--primary);
        padding: 20px;
        border-radius: 10px;
        max-width: 400px;
        margin: 0 auto;
    }

    label {
        display: block;
        margin-top: 10px;
        color: var(--text);
    }

    input {
        width: 100%;
        padding: 10px;
        margin-top: 5px;
        border: 1px solid var(--accent);
        border-radius: 5px;
    }

    button {
        background-color: var(--primary);
        color: var(--text);
        border: none;
        padding: 10px 20px;
        border-radius: 5px;
        margin-top: 15px;
        cursor: pointer;
    }

    button:hover {
        background-color: var(--accent);
    }

    .error {
        color: red;
        margin-top: 10px;
    }
</style>
