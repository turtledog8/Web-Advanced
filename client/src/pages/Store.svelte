<script>
    import { onMount } from "svelte";
    import Ad from "../components/Ad.svelte";
    import SmallAuction from "../components/auctions/SmallAuction.svelte";
    import SearchBar from "../components/SearchBar.svelte";
    import Filter from "../components/Filter.svelte";


    let selectedTags = [];
    let tagData = [];
    export let auctions = [];
    export let filteredAuctions = [];

    // Use onMount to fetch data when the component is mounted
    onMount(async () => {
        try {
            const response = await fetch("http://localhost:3000/auctions", {
                method: "GET"
            });
            if (response.ok) {
                auctions = await response.json(); // Parse the response JSON
                filteredAuctions = auctions;
            } else {
                console.error("Failed to fetch data");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    });

    export const updateAuctions = (newAuctions) => {
        filteredAuctions = newAuctions;
    }
</script>

<main>
    <h1>
        <span class="highlight-text">Welcome</span> to <span class="primary-color">Antique Boutique!</span> <br>
    </h1>
    <div id="ad-container">
        <Ad />
    </div>

    <div id="search-container">
        <SearchBar {auctions} {updateAuctions} />
    </div>

    <div id="filter-container">
        <Filter {auctions} {updateAuctions} bind:selectedTags bind:tagData />
    </div>

    <div class="auction-grid">
        {#if filteredAuctions}
            {#each filteredAuctions as auction}
                <div class="auction-box">
                    <SmallAuction {auction} />
                </div>
            {/each}
        {:else}
            <p class="error-message">Uh-oh! Something went wrong. Please try again later.</p>
        {/if}
    </div>
</main>

<style>
    @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500&display=swap');

    body {
        font-family: 'Orbitron', sans-serif;
        background-color: #000;
        color: #999;
        text-align: center;
    }

    h1 {
        font-size: 48px;
        color: #FF5733;
        text-transform: uppercase;
        margin-bottom: 20px;
    }

    .highlight-text {
        color: #FFA500;
    }

    .primary-color {
        color: #FF5733;
    }

    .accent-color {
        color: #FF8C00;
    }

    #ad-container {
        margin: 20px 0;
    }

    #search-container {
        margin: 30px 0;
    }

    .auction-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); /* Adjust the width as needed */
        grid-gap: 20px; /* Adjust the gap between items */
    }

    .auction-box {
        border: 1px solid #999;
        padding: 10px;
        background-color: #111;
        text-align: center; /* Center align text */
    }

    .auction-image {
        width: 100%; /* Make the image fill the container */
        height: 200px; /* Set the desired height for the image */
        object-fit: cover; /* Ensure the image covers the container */
        margin-bottom: 10px; /* Add some spacing between image and text */
    }

    .error-message {
        font-size: 18px;
        color: #FF4500;
    }
</style>
