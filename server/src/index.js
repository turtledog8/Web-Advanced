import express from 'express';
import cors from 'cors';
const app = express()
const port = 3000

import auctions from "./routes/auctions-router.js";
import admin from "./routes/admin-router.js";
import user from "./routes/user-router.js";
import login from "./routes/login-router.js"
import register from "./routes/register-router.js"

import * as db from "./data/database.js";

// Create test admin.
const createAdmin = async () => {
    await db.addAdmin("Generic", "User", "User", "genericuser@gmail.com", "ImNotIntoSecuritySoIUseABadPassword")
}

// Create test user
const createUser = async () => {
    await db.addUser("Admin", "", "Admin", "root@domain.com", "Str0ngP4sswurds4Life")
}

const createAuctions = async () => {
    const auction1 = {};
    auction1.item = "The Eclipsed Dagger";
    auction1.description = "The Eclipsed Dagger is an ornate dagger forged during the medieval era. Its hilt is intricately engraved with symbols representing an ancient secret society. Historians speculate that the dagger was used in clandestine ceremonies during lunar eclipses. The society's rituals and purpose remain shrouded in mystery, making this artifact a fascinating enigma.";
    auction1.tags = {time: "Medieval", type: "Dagger", size: "22"};
    auction1.images = ["http://localhost:3000/img/auctions/dagger/dagger1.png",
        "http://localhost:3000/img/auctions/dagger/dagger2.png",
        "http://localhost:3000/img/auctions/dagger/dagger3.png",
];
    await db.addAuction(auction1);

    const auction2 = {};
    auction2.item = "The Twilight Manuscript";
    auction2.description = "The Twilight Manuscript is a handwritten tome dating back to the 17th century. Its pages are filled with cryptic diagrams, alchemical recipes, and celestial observations. Historians believe it was the work of an eccentric scholar obsessed with uncovering the secrets of the universe. The manuscript's enigmatic content has puzzled researchers for centuries, raising questions about its origins and purpose.";
    auction2.tags = {time: "Victorian", type: "Book", size: "35"};
    auction2.images = ["http://localhost:3000/img/auctions/manuscript/manuscript1.jpg",
       "http://localhost:3000/img/auctions/manuscript/manuscript2.jpg",
        "http://localhost:3000/img/auctions/manuscript/manuscript3.jpg"

    ];
    await db.addAuction(auction2);

    const auction3 = {};
    auction3.item = "Old Doll";
    auction3.description = "The Doll is a porcelain doll from the 18th century, possessing an aura of mystery and charm. Its delicate features are intricately hand-painted, and its glass eyes seem to hold secrets from centuries past. The doll wears a tattered lace dress that once might have been elegant, adding to its eerie allure. Rumored to have been a cherished companion to a long-forgotten noble child, the doll is believed to have witnessed the passage of time in silence, making it a captivating relic of the past. ";
    auction3.tags = {time: "Victorian", type: "Toy", size: "44"};
    auction3.images = ["http://localhost:3000/img/auctions/doll/doll.png"];
    await db.addAuction(auction3);

    const auction4 = {};
    auction4.item = "The Mechanical Carousel";
    auction4.description = "The Mechanical Carousel is a vintage, hand-cranked mechanical toy from the early 20th century. Crafted with intricate precision, this delightful toy features a beautifully painted wooden carousel with miniature horses and ornate chariots. When wound up, it comes to life, spinning gently while playing a hauntingly nostalgic tune. The carousel's history is tied to a long-forgotten amusement park, and its enduring charm is cherished by enthusiasts of both history and mechanical craftsmanship.";
    auction4.tags = {time: "WWII", type: "Toy", size: "88"};
    auction4.images = ["http://localhost:3000/img/auctions/carousel/carousel.jpg"];
    await db.addAuction(auction4);

    const auction5 = {};
    auction5.item = "The Codex of Forgotten Sorcery";
    auction5.description = "The Codex of Forgotten Sorcery is an ancient leather-bound book dating back to the Middle Ages. This tome is a compendium of long-lost spells, enchantments, and incantations, collected by a mysterious and reclusive scholar. The pages are illuminated with intricate calligraphy and adorned with cryptic illustrations, each revealing the secrets of forgotten magic. Throughout history, it has been associated with legends of sorcerers and magicians who sought its arcane knowledge. The book's enigmatic origins and its reputation for containing potent, yet untested, spells make it a captivating and sought-after artifact for historians of the arcane and collectors of rare manuscripts.";
    auction5.tags = {time: "Medieval", type: "Book", size: "25"};
    auction5.images = ["http://localhost:3000/img/auctions/codex/codex1.png",
        "http://localhost:3000/img/auctions/codex/codex2.jpg",
        "http://localhost:3000/img/auctions/codex/codex3",
        "http://localhost:3000/img/auctions/codex/codex4"

    ];
    await db.addAuction(auction5);
}

process.on("uncaughtException", (error) => {
    console.error("Uncaught Exception:", error);
});

process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Promise Rejection:", reason);
});

const corsOptions = {
    origin: 'http://localhost:5173',
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static('src/public'));

app.use("/auctions", auctions);
app.use("/admin", admin);
app.use("/user", user)
app.use("/login", login);
app.use("/register", register);

app.get('/', (req, res, next) => {
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    res
        .status(403)
        .json({
            message: "Forbidden. You will now be reported to the fbi with ip " + clientIp
        });
})

app.listen(port, async () => {
    await createAdmin();
    await createUser();
    await createAuctions();
    console.log(`Server listening on port ${port}`)
})