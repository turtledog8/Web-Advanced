<script>
    export let auctions = [];
    export let updateAuctions;
    export let selectedTags = [];
    export let tagData = {};

    const toggleTag = (category, value) => {
        const tagIndex = selectedTags.findIndex(tag => tag.category === category && tag.value === value);
        if (tagIndex !== -1) {
            // Tag is already selected, so remove it
            selectedTags.splice(tagIndex, 1);
        } else {
            // Tag is not selected, so add it
            selectedTags = [...selectedTags, { category, value }];
        }
        filterByTags();
    }

    const filterByTags = () => {
        const selectedCategoryTags = selectedTags.filter(tag => tag.category);

        let filteredAuctions = auctions;

        for (const categoryTag of selectedCategoryTags) {
            const valuesToMatch = selectedCategoryTags
                .filter(tag => tag.category === categoryTag.category)
                .map(tag => tag.value);

            filteredAuctions = filteredAuctions.filter(auction => {
                return valuesToMatch.includes(auction.tags[categoryTag.category]);
            });
        }

        console.log('Selected Tags:', selectedTags);
        console.log('Filtered Auctions:', filteredAuctions);

        updateAuctions(filteredAuctions);
    }

    const clearTags = () => {
        selectedTags = [];
        filterByTags();
    }

    const capitalizeFirstLetter = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
</script>

<div class="wrapper">
    <div class="tag-filter">
        {#each Object.keys(tagData) as category}
            {#if tagData[category].size > 0}
                <div class="item">
                    <label>{capitalizeFirstLetter(category)}:</label>
                    {#each Array.from(tagData[category]) as tag}
                        <label>
                            <input type="checkbox" on:change={() => toggleTag(category, tag)} checked={selectedTags.some(selectedTag => selectedTag.category === category && selectedTag.value === tag)} />
                            {tag}
                        </label>
                    {/each}
                </div>
            {/if}
        {/each}
    </div>
    {#if selectedTags.length > 0}
        <div class="selected-tags">
            {#each selectedTags as { category, value }}
                <span on:click={() => toggleTag(category, value)} class="tag">{capitalizeFirstLetter(category)}: {value} &#10005;</span>
            {/each}
        </div>
    {/if}
    <button on:click={clearTags}>Clear Filter</button>
</div>

<style>
    .wrapper {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }

    .tag-filter {
        margin-bottom: 20px;
    }

    .item {
        margin-bottom: 10px;
    }

    .item label {
        margin-right: 10px;
    }

    input[type="checkbox"] {
        margin-right: 5px;
    }

    .selected-tags {
        margin-bottom: 10px;
    }

    .tag {
        background-color:darkgreen;
        color: var(--accent);
        padding: 5px 10px;
        border-radius: 20px;
        margin-right: 10px;
        cursor: pointer;
    }

    .tag:hover {
        background-color: var(--accent);
        color: darkgreen;
    }
</style>
