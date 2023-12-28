import * as db from "../data/database.js"


export const getAuctionClosingTime = async (req, res) => {
    try {
        const auction = await db.getAuctionById(req.params.id);

        if (!auction) {
            res.status(404).json({ message: "Auction not found" });
            return;
        }

        // Assuming the auction data structure has a closingTime property
        const closingTime = auction.closingTime;

        if (!closingTime) {
            res.status(400).json({ message: "Closing time not available for the auction" });
            return;
        }

        res.status(200).json({ closingTime });
    } catch (error) {
        console.error("Error fetching auction closing time:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


export const getAllAuctions = async (req, res) => {
    const auctions = await db.getAllAuctions();

    if (!auctions) {
        res
            .status(500)
            .json({message: "Internal server error"});
    }

    res
        .status(200)
        .json(auctions);
}

export const getAuctionById = async (req, res) => {
    const auction = await db.getAuctionById(req.params.id);

    if (!auction) {
        res
            .status(404)
            .json({message: "Auction not found"});
    }

    res
        .status(200)
        .json(auction);
}

