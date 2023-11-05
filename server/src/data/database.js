import bcrypt from "bcrypt";

// Fake database
const users = [];
const auctions = [];

export async function addUser(firstName, lastName, username, email, password) {
    // Hash and salt the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = {
        id: users.length,
        firstName,
        lastName,
        username,
        email,
        password: hashedPassword,
        isAdmin: false
    };

    // Add user to "database"
    users.push(user);
}

export async function addAdmin(firstName, lastName, username, email, password) {
    // Hash and salt the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = {
        firstName,
        lastName,
        username,
        email,
        password: hashedPassword,
        isAdmin: true
    };

    // Add user to "database"
    users.push(user);
}

export function findUser(usernameOrEmail) {
    return users.find(
        (user) => user.username === usernameOrEmail || user.email === usernameOrEmail
    );
}

export async function getUserBids(user) {
    const bids = [];

    for (let i = 0; i < auctions.length; i++) {
        if (!auctions[i].bids) {
            continue;
        }

        bids.push(auctions[i].bids.get(user));
    }

    return bids;
}

export async function addAuction(auction) {
    auction.id = auctions.length;
    auction.bids = new Map();
    auctions.push(auction);
}

export async function deleteAuction(auctionId) {
    for (let i = 0; i < auctions.length; i++) {
        if (auctions[i].id === auctionId) {
            auctions.splice(i, 1); // Remove the auction at index i
            return true; // Return true if the auction was removed
        }
    }

    return false; // Return false if the auction was not found.
}

export async function editAuction(auctionId, newAuction) {
    for (let i = 0; i < auctions.length; i++) {
        if (auctions[i].id === auctionId) {
            auctions[i] = newAuction;
            return true; // Return true if the auction got replaced
        }
    }

    // Return false if the auction was not found
    return false;
}

export async function getAllAuctions() {
    return auctions;
}

export async function getAuctionById(auctionId) {
    for (const auction of auctions) {
        if (Number(auction.id) === Number(auctionId)) {
            return auction;
        }
    }

    return null;
}

export async function addAuctionBid(user, auctionId, bid) {
    let auction;

    for (let i = 0; i < auctions.length; i++) {
        if (auctions[i].id === auctionId) {
            auction = auctions[i];
        }
    }

    if (auction) {
        if (!auction.bids) {
            auction.bids = new Map();
        }

        // Use the user as the key and bid as the value in the map
        auction.bids.set(user, bid);

        return true; // Return true if the bid was added successfully
    }

    return false; // Return false if the auction was not found.
}

export function checkAuctionIdExists(id) {
    const auction = auctions.find(
        (auction) => auction.id === id
    );

    // Return true if the auction exists, return false if not.
    return auction !== undefined;
}
