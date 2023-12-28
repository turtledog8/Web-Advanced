
import * as db from "../data/database.js";
export const endAuction = async (req, res) => {
    try {
        const auctionId = req.params.id;

        // Check if auction exists
        console.log("Checking if auction exists. Auction ID:", auctionId);
        if (!db.checkAuctionIdExists(auctionId)) {
            console.log(`Auction with ID ${auctionId} not found.`);
            return res.status(404).json({
                message: `Auction with ID ${auctionId} not found.`,
            });
        }

        // Get the current auction status
        console.log("Getting current auction status. Auction ID:", auctionId);
        const currentAuction = await db.getAuctionById(auctionId);

        // Check if the auction is already ended
        console.log("Checking if the auction is already ended. Auction ID:", auctionId);
        if (currentAuction.status === "ended") {
            console.log(`Auction with ID ${auctionId} is already ended.`);
            return res.status(400).json({
                message: `Auction with ID ${auctionId} is already ended.`,
            });
        }

        // Update auction status to "ended"
        console.log("Updating auction status to 'ended'. Auction ID:", auctionId);
        await db.closeAuction(auctionId, "ended");

        // Send a response indicating success
        const successResponse = { message: `Auction ${auctionId} ended successfully.` };
        console.log(`Auction ${auctionId} ended successfully.`);
        res.status(200).json(successResponse);
    } catch (error) {
        console.error("Error ending auction:", error);

        // Handle the case where the response cannot be converted to JSON
        res.status(500).json({ error: "Internal Server Error" });
    }
};



export const addAuction = async (req, res) => {

    try {
        // Validate input
        const { item, description, images, tags, closingTime } = req.body;

        if (!item || !description || !closingTime) {
            return res.status(400).json({
                message: "Item, description, and closing time are required fields.",
                item,
                description,
                closingTime,
                images,
                tags
            });
        }

        // Convert a single image to an array
        const imageArray = images ? (Array.isArray(images) ? images : [images]) : [];

        if (!Array.isArray(imageArray)) {
            return res.status(400).json({
                message: "Images must be an array or a single image URL. ",
                images,
                item,
                description,
                tags
            });
        }

        const bids = [];

        // Parse closingTime to a Date object
        const parsedClosingTime = new Date(closingTime);
        let auction = {
            item,
            description,
            images: imageArray,
            bids,
            tags,
            closingTime: parsedClosingTime.toISOString()
        };


        // Send input to the database
        await db.addAuction(auction);

        // Create object to return
        const jsonObject = {
            message: "Auction successfully created",
            auction
        };

        // Return status
        res.status(201).json(jsonObject);
    } catch (error) {
        // Handle unexpected errors
        console.error("Error: ", error);

        const jsonObject = {
            message: "An internal server error occurred. Please try again later. "
        };

        res.status(500).json(jsonObject);
    }
};

export const editAuction = async (req, res) => {
    const id = req.params.id;

    // Check if id is valid
    if (!db.checkAuctionIdExists(id)) {
        res.status(400).json({
            message: "Auction with provided id could not be found.",
            id: id
        });
        return;
    }


    const { item, description, images, tags } = req.body;

    // Validate other input
    if (!item && !description && !images) {
        res.status(400).json({
            message: "No item, description, and image(s) provided. Please provide new information to edit the existing auction.",
            item: item,
            description: description,
            images: images,
            tags: tags
        });
        return;
    }

    if (images && !Array.isArray(images)) {
        res.status(400).json({
            message: "Image(s) were provided but are not in array format.",
            images: images,
            item: item,
            description: description,
            tags: tags
        });
        return;
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
    } catch (error) {
        // Object to return, can return an error code since the user is an admin.
        const jsonObject = {
            message: "An internal server error occurred. Please try again later.",
            error: error,
            auction: auction
        }

        console.error("Error: " + error + " occurred when updating the auction:\n", jsonObject);

        // Return error message
        res.status(500).json(jsonObject);
        return;
    }

    const jsonObject = {
        message: "Auction successfully updated!",
        newAuction: await db.getAuctionById(id)
    }


    res.status(200).json(jsonObject);
};

export const deleteAuction = async (req, res) => {
    // Check for the presence of the authentication token
    const token = req.headers['token'];


    if (!token) {
        return res.status(401).json({
            message: "No token sent in request header."
        });
    }

    // Validate input
    const id = req.params.id; // Use req.params.id to get the ID from the route parameters


    // Check if id is valid
    if (!id || !(db.checkAuctionIdExists(id))) {
        return res.status(400).json({
            message: "Auction with provided id could not be found. ",
            id: id
        });
    }


    // Delete auction
    try {
        const deleted = await db.deleteAuction(id);
        if (deleted) {
            return res.status(200).json({
                message: "Auction has been deleted successfully.",
                id: id
            });
        } else {
            return res.status(404).json({
                message: "Auction not found.",
                id: id
            });
        }
    } catch (Error) {
        // Handle the error
        console.error("Error: " + Error + " occurred when deleting auction with id: " + id);
        return res.status(500).json({
            message: "An internal server error occurred. Please try again later.",
            error: Error,
            id: id
        });
    }
}