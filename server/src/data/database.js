import bcrypt from "bcrypt";



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
export function getUserDetails(id) {
    return users.find((user) => user.id === Number(id));
}


export async function addAdmin(firstName, lastName, username, email, password) {
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
export async function getUserBids(username) {
    const bids = [];

    for (let i = 0; i < auctions.length; i++) {
        console.log("Bid :Id:  " + i);

        if (!auctions[i].bids) {
            continue;
        }

        console.log(auctions[i].bids);
        console.log(auctions[i].bids);

        // Push each bid individually
        for (const bid of auctions[i].bids) {
            bids.push(bid);
        }
    }
    console.log("Final bids array:", bids);
    return bids;
}


function setClosingTime(){
    const today = new Date();
    const closingTime = new Date(today);
    closingTime.setDate(closingTime.getDate() + 1); // 24 hours from now
    return closingTime;
}
export async function addAuction(auction) {
    auction.id = auctions.length;
    auction.bids = [];
    auction.closingTime = setClosingTime(); // closing time is set to default 24h
    auction.status = "open"; // Add a status field with the initial value "open"
    auctions.push(auction);
    console.log(auction.closingTime);
}




export async function deleteAuction(auctionId) {
    // Convert the auctionId to a number (assuming the ID in the auctions array is a number)
    const id = Number(auctionId);
    const idType = typeof id;
    console.log("Type of ID:", idType);

    const index = auctions.findIndex((auction) => auction.id === id);

    if (index !== -1) {
        // Remove the auction from the array
        auctions.splice(index, 1);

        // Update the IDs of the remaining auctions
        for (let i = index; i < auctions.length; i++) {
            auctions[i].id = i;
        }

        return true; // Return true if the auction was deleted successfully
    }

    // Return false if the auction was not found
    return false;
}
// In database.js

export async function editAuction(auctionId, newAuction) {
    try {
        const existingAuction = await getAuctionById(auctionId);

        if (existingAuction) {
            // Create a new auction with the updated information
            const updatedAuction = {
                id: existingAuction.id,
                item: newAuction.item || existingAuction.item,
                description: newAuction.description || existingAuction.description,
                images: newAuction.images || existingAuction.images,
                tags: {
                    ...existingAuction.tags,
                    ...newAuction.tags
                },
                bids: existingAuction.bids,
                closingTime: newAuction.closingTime || existingAuction.closingTime,
                timeRemaining: newAuction.closingTime
                    ? newAuction.closingTime - new Date()
                    : existingAuction.timeRemaining
            };

            // Log the existing and updated auctions for debugging
            console.log("Existing Auction:", existingAuction);
            console.log("Updated Auction:", updatedAuction);

            // Wait for a short period (you can adjust the timeout based on your needs)
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Replace the existing auction with the updated one
            auctions[existingAuction.id] = updatedAuction;

            // Log the updated auction after the replacement
            console.log("Auction Updated:", auctions[existingAuction.id]);

            return true; // Return true if the auction was updated successfully
        }

        // Log that the auction was not found
        console.log("Auction not found with ID:", auctionId);

        // Return false if the auction was not found
        return false;
    } catch (error) {
        // Log any errors during the update operation
        console.error("Error editing auction:", error);
        throw error; // Propagate the error to handle it at a higher level
    }
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

export function checkAuctionIdExists(auctionId) {
    const id = Number(auctionId);

    for (const auction of auctions) {
        if (Number(auction.id) === id) {
            return true;
        }
    }

    return false;
}

export async function removeBid(username, auctionId, bidDateTimeString) {
    try {
        const auction = await getAuctionById(auctionId);

        if (auction && auction.bids) {
            const bidIndex = auction.bids.findIndex(
                (bid) =>
                    bid.username === username &&
                    bid.dateTimeString === bidDateTimeString
            );

            console.log('Remove Bid Parameters:', {
                username,
                auctionId,
                bidDateTimeString,
                auctionBids: auction.bids
            });

            if (bidIndex !== -1) {
                // Remove the bid from the array
                auction.bids.splice(bidIndex, 1);

                console.log(`Bid removed for user ${username} in auction ${auctionId}`);
                console.log('Updated Bids:', auction.bids);
                return true; // Return true if the bid was removed successfully
            } else {
                console.log(`Bid not found for user ${username} in auction ${auctionId}`);
                return false; // Return false if the bid was not found
            }
        } else {
            console.log(`Auction not found or has no bids for ID: ${auctionId}`);
            return false; // Return false if the auction was not found or has no bids
        }
    } catch (error) {
        console.error("Error removing bid:", error);
        throw error; // Propagate the error to handle it at a higher level
    }
}
/////////////////////////////////////////////////////

export async function getHighestBid(auctionId) {
    let highestBid = 0;

    try {
        const auction = await getAuctionById(auctionId);

        if (auction && auction.bids) {
            auction.bids.forEach((bid) => {
                if (bid.bid > highestBid) {
                    highestBid = bid.bid;
                }
            });
        }

        return highestBid;
    } catch (error) {
        console.error("Error fetching highest bid for auction ID:", auctionId, "\nError:", error);
        throw error;
    }
}

// Other functions...

export function updateAuctionClosingTimes() {
    const currentTime = new Date();

    for (const auction of auctions) {
        // Calculate the time remaining until closing
        const timeRemaining = auction.closingTime - currentTime;

        // If the auction is still open
        if (timeRemaining > 0) {
            auction.timeRemaining = timeRemaining;
        } else {
            // Close the auction and determine the winner
            auction.timeRemaining = 0;
            closeAuction(auction.id);
        }
    }
}



function determineWinner(auctionId) {
    try {
        const { highestBid, winningUsername } = getHighestBid(auctionId);

        if (highestBid > 0) {
            console.log(`Winner of Auction ${auctionId}: ${winningUsername} with a bid of €${highestBid}`);
            // Perform any necessary actions for the winner
            // For example, notify the winner, update the database, etc.
        } else {
            console.log(`No bids found for Auction ${auctionId}.`);
        }
    } catch (error) {
        console.error("Error determining winner:", error);
        // Handle the error as needed
    }
}



export async function addAuctionBid(username, auctionId, bid) {
    let auction;

    for (let i = 0; i < auctions.length; i++) {
        if (auctions[i].id === auctionId) {
            auction = auctions[i];
        }
    }

    if (auction) {
        if (!auction.bids) {
            auction.bids = [];
        }
        const currentDateTime = ((d) => `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()} ${d.getHours()}:${d.getMinutes()} `)(new Date());

        const data = {
            "bid": bid,
            "username": username,
            "dateTimeString": currentDateTime,
            "auction" : auction.id,
        }

        // Use the user as the key and bid as the value in the map
        auction.bids.push(data);

        // Include closingTime property in the auction data structure
        if (!auction.closingTime) {
            // Set a default closing time (you can set it according to your requirements)
            auction.closingTime = new Date();
            auction.closingTime.setMinutes(auction.closingTime.getMinutes() + 30); // 30 minutes from now
        }

        return true; // Return true if the bid was added successfully
    }

    return false; // Return false if the auction was not found.
}








export async function closeAuction(auctionId) {
    console.log(`Closing Auction ${auctionId}...`);

    const auctionIndex = auctions.findIndex((auction) => auction.id === auctionId);

    if (auctionIndex !== -1) {
        // Mark the auction as closed
        auctions[auctionIndex].status = 'closed'; // Set the status to closed
        auctions[auctionIndex].timeRemaining = 0; // Set remaining time to 0
        console.log(`Auction ${auctionId} closed.`);

        // Determine the winner if there are bids
        determineWinner(auctionId);

        // Log the entire auction object and its properties
        console.log("Closed Auction:", auctions[auctionIndex]);
    } else {
        console.log(`Auction not found with ID: ${auctionId}`);
    }
}


