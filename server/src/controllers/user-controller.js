import * as db from "../data/database.js";

export const removeUserBid = async (req, res) => {
    const username = req.body.username;
    const auctionId = req.body.auctionId;
    const bidDateTimeString = req.body.bidDateTimeString;

    try {
        const bidRemoved = await db.removeBid(username, auctionId, bidDateTimeString);

        if (bidRemoved) {
            res.status(200).json({ message: "Bid removed successfully" });
        } else {
            res.status(404).json({ message: "Bid not found or could not be removed" });
        }
    } catch (error) {
        console.error("Error removing bid:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getUserDetails = async (req, res) => {
    const userId = req.params.id; // Assuming the user ID is passed as a parameter in the request URL

    try {
        const userDetails = db.getUserDetails(parseInt(userId)); // Parse the userId to an integer before passing it to the function

        if (userDetails) {
            // User found, return the details
            res.status(200).json(userDetails);
        } else {
            // User not found
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        // Handle any errors that occur during the process
        console.error("Error occurred while fetching user details:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


export const placeBid = async (req, res) => {
    const user = req.body.user;
    const auctionId = req.body.auctionId;
    const bidAmount = req.body.bid;

    if (!bidAmount || (!Number.isInteger(bidAmount) && !isNaN(Number.parseFloat(bidAmount)))) {
        console.log("Invalid bid amount provided:", bidAmount);
        res.status(400).json({
            message: "No or invalid bid amount provided",
            auctionId: auctionId,
            bid: bidAmount
        });
        return;
    }

    if (!Number.isInteger(auctionId)) {
        console.log("Invalid auction id provided:", auctionId);
        res.status(400).json({
            message: "No or invalid auction id provided",
            auctionId: auctionId,
            bid: bidAmount
        });
        return;
    }

    try {
        console.log("Adding bid for user:", user.username);
        console.log("Auction ID:", auctionId);
        console.log("Bid amount:", bidAmount);

        const highestBid = await db.getHighestBid(auctionId);

        // Check if the bid is at least +1 larger than the previous bid
        if (bidAmount <= highestBid) {
            console.log("Bid amount must be at least +1 larger than the previous bid.");
            res.status(400).json({
                message: "Bid amount must be at least +1 larger than the previous bid.",
                auctionId: auctionId,
                bid: bidAmount
            });
            return;
        }

        // Retrieve auction details
        const auction = await db.getAuctionById(auctionId);

        if (!auction) {
            console.log("Auction not found");
            res.status(404).json({
                message: "Auction not found",
                auctionId: auctionId,
                bid: bidAmount
            });
            return;
        }

        // Add bid with auction information
        await db.addAuctionBid(user.username, auctionId, bidAmount);

        console.log("Bid added successfully!");
        res.status(200).json({
            message: "Successfully added bid!",
            auctionId: auctionId,
            bid: bidAmount,
            auction: {
                id: auction.id,
                name: auction.item, // You can customize this based on your auction data
                // Include other auction details if needed
            }
        });
    } catch (error) {
        console.error("An error occurred adding auction bid for user: " + user.username +
            "\nAuction id: " + auctionId + "Bid: " + bidAmount, "\nError: " + error);
        res.status(500).json({
            message: "An internal server error occurred",
            auctionId: auctionId,
            bid: bidAmount
        });
    }
};

const getHighestBid = async (auctionId) => {
    try {
        const highestBid = await db.getHighestBid(auctionId); // Implement this method in your database module
        return highestBid;
    } catch (error) {
        console.error("Error fetching highest bid for auction ID:", auctionId, "\nError:", error);
        throw error;
    }
};

export const getBidsForUser = async (req, res) => {
    const id = req.params.id
    try {
        const user = db.getUserDetails(id);
        console.log(user);
        const bids = await db.getUserBids(user);

        const jsonObject = {
            message: "Successfully retrieved bids",
            bids: bids
        }

        res
            .status(200)
            .json(jsonObject);
    } catch (Error) {
        console.error("Error getting bids for user: " + id)

        res
            .status(500)
            .json({ message: "An internal server error occurred" })
    }



}