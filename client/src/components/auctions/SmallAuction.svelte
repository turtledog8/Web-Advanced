<script>
    // Import the createEventDispatcher function from Svelte
    import { createEventDispatcher } from 'svelte';

    export let auction; // Define auction as a Svelte reactive variable
    export const auctionURL = `/auctions/${auction.id}`;

    const getImageSrc = (auction) => {
        return auction.images && auction.images.length > 0
            ? auction.images[0] // Use the first image if available
            : "http://localhost:3000/img/auction-logo.png";
    }

    // Create an event dispatcher
    const dispatch = createEventDispatcher();

    // Function to handle the auction item click
    const handleItemClick = () => {
        // Dispatch a custom event with the auction object as payload
        dispatch('auctionItemClick', auction);
    }
</script>

<style>
    .auction-box {
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: dimgrey;
        padding: 20px;
        margin: 10px;
        border-radius: 8px;
        cursor: pointer; /* Add a cursor style to indicate it's clickable */
        text-align: center; /* Center align text */
    }

    .image {
        width: 150px;
        height: 150px;
        border-radius: 50%;
        object-fit: cover;
        margin-bottom: 10px;
    }

    .item-name {
        font-size: 18px;
        font-weight: 700;
        color: darkgreen;
        text-decoration: none;
    }
</style>

<!-- Add an event listener for the click event -->
<div class="auction-box" on:click={handleItemClick}>
    <img class="image" src={getImageSrc(auction)} alt="Auction Image" />
    <a href={auctionURL} class="item-name">{auction.item}</a>
</div>
