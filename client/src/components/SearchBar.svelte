<script>
    export let auctions = [];
    export let updateAuctions;
    export let query = '';

    // Create a computed property to filter auctions based on the query
    let filteredAuctions = auctions;

    const updateFilteredAuctions = () => {
        filteredAuctions = query
            ? auctions.filter(auction => auction.item.toLowerCase().includes(query.toLowerCase()))
            : auctions;

        if (updateAuctions) {
            updateAuctions(filteredAuctions);
        } else {
            console.log("Error with searching.");
        }
    }
</script>

<div class="search-bar">
    <img src="http://localhost:3000/img/search-icon.png" alt="Search" class="search-icon" />
    <input type="text" bind:value={query} placeholder="Search..." on:input={updateFilteredAuctions} />
</div>


<style>
    .search-bar {
        display: flex;
        align-items: center;
        border: 1px solid var(--secondary);
        border-radius: 30px;
        padding: 15px; /* Increased padding for extra height */
        background-color: darkgreen;
        color: var(--text);
        max-width: 80%; /* Limit the width to 80% of the screen */
        margin: 5px auto; /* Center the search bar horizontally */
    }

    .search-icon {
        width: 24px; /* Set the width of the image */
        height: 24px; /* Set the height of the image */
        margin-right: 10px;
    }

    input {
        border: none;
        background: none;
        color: var(--text);
        font-family: 'Poppins', sans-serif;
        font-weight: 400;
        outline: none;
        width: 100%;
    }

    input::placeholder {
        color:darkgreen;
    }
</style>
