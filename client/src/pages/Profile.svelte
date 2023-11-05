<script>
    import { onMount } from 'svelte';

    export let params;
    export let userDetails = null;
    export let userBids = [];
    const token = localStorage.getItem('token');

    let id;

    if (params) {
        ({ id } = params);
    }

    async function fetchUserDetails() {
        if (!id) {
            // Handle the case where id is not provided, e.g., show an error message or redirect the user
            console.error('Error: No user ID provided.');
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/user/profile/${id}`, {
                method: 'GET',
                headers: {
                    'Authorization': token,
                },
            });

            const data = await response.json();
            if (response.ok) {
                userDetails = data.user;
                userBids = Object.entries(userDetails.bids).map(([auctionId, bid]) => ({ auctionId, bid }));
            } else {
                console.error('Error fetching user details:', data.message);
            }
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    }

    onMount(fetchUserDetails);
</script>

<main>
    {#if userDetails}
        <h1>Hello, {userDetails.username}!</h1>
        <p>User ID: {userDetails.id}</p>
        <!-- Display other user details as needed -->
    {:else}
        <p>Loading user details...</p>
    {/if}
</main>

<style>
    main {
        text-align: center;
        padding: 1em;
        max-width: 240px;
        margin: 0 auto;
    }

    h1 {
        font-size: 2em;
    }

    p {
        font-size: 1.2em;
    }
</style>
