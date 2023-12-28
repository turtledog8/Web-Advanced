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
import {updateAuctionClosingTimes} from "./data/database.js";

// Create test admin.
const createAdmin = async () => {
    await db.addAdmin("Generic", "User", "User", "genericuser@gmail.com", "ImNotIntoSecuritySoIUseABadPassword")
}

// Create test user
const createUser = async () => {
    await db.addUser("AAAAAAAA", "AAAAA", "regularschmuck", "root@domain.com", "Str0ngP4sswurds4Life")
}
const createAuctions = async () => {
    const today = new Date();


    const auction1 = {};
    auction1.item = "Bohumil Kafka ";
    auction1.description = "(1878-1942 Czech) Rare Tall Polychrome Carved Statue of Baby Jesus.\n" +
        " This is a magnificent and rare original early 20th Century antique carved wooden polychrome statue depicting St. Anthony of Padua with the infant baby Jesus in his arms.\n" +
        "\n" +
        "The exceptional carving dates from circa 1900-1915 and it measures a very impressive 3.s feet in height.\n" +
        "\n" +
        "Carved by the famous listed Czechoslovakian Sculptor and teacher Bohumil Kafka (1878-1942).\n" +
        "\n" +
        "The intricately carved polychrome painted piece is entirely original throughout, retaining the original pigmentation with a fabulous aged patina.\n" +
        "\n" +
        "It has a carved and gilt-painted signature on the base that reads:-\n" +
        "\n" +
        "A rare piece and a fabulous original example with two carved figures.\n";
    auction1.tags = {time: "1900s", type: "Statue", size: "91"};
    auction1.images = [
        "http://localhost:3000/img/auctions/jesus/jesus1.jpeg",
        "http://localhost:3000/img/auctions/jesus/jesus2.jpeg",
        "http://localhost:3000/img/auctions/jesus/jesus3.jpeg",
        "http://localhost:3000/img/auctions/jesus/jesus4.jpeg",
    ];
    await db.addAuction(auction1);

    const auction2 = {};
    auction2.item = "Dear Vintage Schuco Violin";
    auction2.description = "This little guy is German, from The Schuco Factory, renowned for their wind-up toys and tin cars. The company was started in 1912 by Heinrich Muller & Heinrich Schreyer and was originally named 'Spielzeugfirma Schreyer' but in 1921 changed their name to the the much shorter Schuco. The company halted production during the Second World War starting again in the late 40's, and then during the 50's there was a shift away from tin to plastic for the toys. My sense is that this little guy is most likely to date to the 1930's. He, as I hope you can see from the video, is in wonderful working order, turning slowly around whilst he earnestly plays his violin. His costume is made from felt with that little red beret, blue jacket and yellow trousers, finished off with that little cotton tie around his neck. His face, hands, violin and those wonderful long black feet are I believe all tin. On one foot there is impressed 'Schuco Patent' and on the other 'Made in Germany'. He works by the key being put in his back and turned and I do want to point out that the key cannot be the original one as it `Meccano' on it, but I have to say it does work perfectly.";
    auction2.tags = {time: "1900s", type: "Toy", size: "12"};
    auction2.images = ["http://localhost:3000/img/auctions/monke/monke1.jpeg",
        "http://localhost:3000/img/auctions/monke/monke2.jpeg",
        "http://localhost:3000/img/auctions/monke/monke3.jpeg",

    ];
    await db.addAuction(auction2);

    const auction3 = {};
    auction3.item = " Baby Doll with Gown";
    auction3.description = "Antique doll with soft body -  has a few tears and his nose has been chipped. Unsure of exact age. Moulded hair might indicate 1920s-40s. The dress has a couple of marks but with a good soak and a steam should come up nicely. No visible makers mark. Doll height 15.5\"";
    auction3.tags = {time: "1800s", type: "Toy", size: "44"};
    auction3.images = ["http://localhost:3000/img/auctions/doll/doll1.png",
        "http://localhost:3000/img/auctions/doll/doll2.png"
    ];
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

    // Set a default closing time for all auctions (24 hours from now)
    const closingTime = new Date(today);
    closingTime.setDate(closingTime.getDate() + 1); // 24 hours from now

// Add auctions with the default closing time
    const allAuctions = await db.getAllAuctions();
    for (const auction of allAuctions) {
        auction.closingTime = closingTime;
        await db.editAuction(auction.id, auction);
    }

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
    setInterval(updateAuctionClosingTimes, 60000);

    console.log(`Server listening on port ${port}`);

})