import * as db from "../data/database.js"

export const addAuction = async (req, res) => {
    // Validate input
    const {item, description, images, tags} = req.body;

    if (!item || !description) {
        res
            .status(400)
            .json({
                message: "Either item or description is empty. Images are not mandatory. ",
                item: item,
                description: description,
                images: images,
                tags: tags
            });
    }

    if (images && !Array.isArray(images)) {
        res
            .status(400)
            .json({
                message: "Images was provided but not an array. ",
                images: images,
                item: item,
                description: description,
                tags: tags
            })
    }

    const bids = new Map();

    // Create auction item
    let auction = {};
    auction.item = item;
    auction.description = description;
    auction.images = images;
    auction.bids = bids;
    auction.tags = tags;


    // Send input to database
    try {
        await db.addAuction(auction);
    } catch (Error) {
        // Object to return
        const jsonObject = {
            message: "An internal server error occurred. Please try again later. ",
            auction: auction
        }

        console.error("Error: " + Error + " occurred when adding object:\n" + jsonObject);

        // Return error message
        res
            .status(500)
            .json(jsonObject);
    }


    // Create object to return
    const jsonObject = {
        message: "Auction successfully created",
        auction: auction
    };

    // Return status
    res
        .status(201)
        .json(jsonObject);
}

export const editAuction = async (req, res) => {
    const id = req.id;

    // Check if id is valid
    if (!id || db.checkAuctionIdExists(id)) {
        res
            .status(400)
            .json({
                message: "Auction with provided id could not be found. ",
                id: id
            })
    }

    const {item, description, images, tags} = req.body;

    // Validate other input
    if (!item && !description && !images) {
        res
            .status(400)
            .json({
                message: "No item, description and image(s) provided. Please provide new information to edit the existing auction.",
                item: item,
                description: description,
                images: images,
                tags: tags
            });
    }

    if (images && !Array.isArray(images)) {
        res
            .status(400)
            .json({
                message: "Image(s) were provided but are not in array format. ",
                images: images,
                item: item,
                description: description,
                tags: tags
            })
    }

    // Create auction item
    let auction = {};
    auction.item = item;
    auction.description = description;
    auction.images = images;
    auction.tags = tags;

    // Send input to database
    try {
        await db.editAuction(id, auction);
    } catch (Error) {
        // Object to return, can return error code since user is an admin.
        const jsonObject = {
            message: "An internal server error occurred. Please try again later. ",
            error: Error,
            auction: auction
        }

        console.error("Error: " + Error + " occurred when adding object:\n" + jsonObject);

        // Return error message
        res
            .status(500)
            .json(jsonObject);
    }

    const jsonObject = {
        message: "Auction successfully updated! ",
        newAuction: await db.getAuctionById(id)
    }

    res
        .status(200)
        .json(jsonObject)
}

export const deleteAuction = async (req, res) => {
    // Validate input
    const id = req.id;

    // Check if id is valid
    if (!id || db.checkAuctionIdExists(id)) {
        res
            .status(400)
            .json({
                message: "Auction with provided id could not be found. ",
                id: id
            })
    }

    // Delete auction
    try {
        await db.deleteAuction(id);
    } catch (Error) {
        // Object to return, can return error code since user is an admin.
        console.error("Error: " + Error + " occurred when deleting auction with id: " + id);

        // Return error message
        res
            .status(500)
            .json({
                message: "An internal server error occurred. Please try again later. ",
                error: Error,
                id: id
            });
    }

    res
        .status(200)
        .json({
            message: "Auction has been deleted successfully. ",
            id: id
        })
}