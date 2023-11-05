<script>
    import { onMount } from 'svelte';

    export let id;
    export let auction = null;
    export let selectedImage = null;
    export let currentImageIndex = 0;

    onMount(async () => {
        try {
            const response = await fetch(`http://localhost:3000/auctions/${id}`, {
                method: "GET"
            });
            if (response.ok) {
                auction = await response.json();
                auction.bids = Object.entries(auction.bids).map(([user, bid]) => ({ user, bid }));
            } else {
                console.error("Error fetching data:", response.status, response.statusText);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    });

    const navigateTo = (index) => {
        currentImageIndex = (index + auction.images.length) % auction.images.length;
    }

</script>

<main>
    {#if auction === null}
        <p>Loading...</p>
    {:else}
        {#if auction.images && Array.isArray(auction.images)}
            <div class="image-description">
                <div class="image-container">
                    <div class="image-nav left" on:click={navigateTo(currentImageIndex - 1)}>&#9664;</div>
                    <img src={auction.images[currentImageIndex]} alt="Auction Image" />
                    <div class="image-nav right" on:click={navigateTo(currentImageIndex + 1)}>&#9654;</div>
                    <div class="image-pagination">
                        {#each auction.images as image, index (image)}
                            <div class="pagination-dot {index === currentImageIndex ? 'active' : ''}" on:click={navigateTo(index)}></div>
                        {/each}
                    </div>
                </div>
            </div>
        {/if}
        <div class="image-description">
            <div class="description-tags-bids">
                <h1>{auction.item}</h1>
                <p class="description">{auction.description}</p>

                {#if auction.tags}
                    <div class="tags">
                        {#each Object.entries(auction.tags) as [tag, value]}
                            <div class="tag-box">
                                <p><strong>{tag}:</strong> {value}</p>
                            </div>
                        {/each}
                    </div>
                {/if}

                <div class="bids">
                    <h2>Bids</h2>
                    {#if auction.bids.length > 0}
                        <ul>
                            {#each auction.bids.entries() as [user, bid]}
                                <li>{user}: {bid}</li>
                            {/each}
                        </ul>
                    {:else}
                        <p>No bids yet.</p>
                    {/if}
                </div>
            </div>
        </div>
    {/if}
</main>



<style>
    .image-description {
        display: flex;
        align-items: flex-start;
        justify-content: center;
    }

    .image-container {
        position: relative;
        text-align: center;
    }

    img {
        width: 30vw;
        height: auto;
    }

    .image-nav {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        border-radius: 50%;
        width: 40px;
        height: 40px;
        background: rgb(89, 89, 89, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        cursor: pointer;
    }

    .image-nav.left {
        left: 0;
    }

    .image-nav.right {
        right: 0;
    }

    .image-pagination {
        display: flex;
        justify-content: center;
        margin-top: 20px;
    }

    .pagination-dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: rgb(82, 82, 82);
        margin: 0 5px;
        transition: background 0.3s ease-in-out;
        cursor: pointer;
    }

    .pagination-dot.active {
        background: #ffffff;
    }

    .description-tags-bids {
        margin-left: 20px;
    }

    .description {
        color: var(--primary);
        max-width: 60vw;
    }

    .tag-box {
        display: inline-block;
        background: var(--accent);
        padding: 2px 5px 2px 5px;
        font-size: 12px;
        margin: 0 10px 10px;
    }
</style>