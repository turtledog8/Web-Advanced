<script>
    import router from 'page';
    import Store from "./components/pages/Store.svelte";
    import Header from "./components/Header.svelte";
    import Details from "./components/pages/Details.svelte";
    import Register from "./components/pages/Register.svelte";
    import Login from "./components/pages/Login.svelte";
    import Home from "./components/pages/Home.svelte";
    import LogOut from "./components/pages/LogOut.svelte";
    import AddAuctionForm from "./components/forms/AddAuctionForm.svelte";
    import EditAuctionForm from "./components/forms/EditAuctionForm.svelte";
    import Profile from "./components/pages/Profile.svelte";

    let page;
    let currentRoute;
    let params;


    // Redirect root path to /home
    router('/', () => {
        router.redirect('/home');
    });
    router('/home', (ctx) => {
        page = Home;
        currentRoute = ctx.pathname;
    });

    router('/auctions/:id', (ctx) => {
        const id = ctx.params.id;
        page = Details;
        currentRoute = ctx.pathname;
        params = { id };
    });

    router('/login', (ctx) => {
        page = Login;
        currentRoute = ctx.pathname;
    });

    router('/register', (ctx) => {
        page = Register;
        currentRoute = ctx.pathname;
    });
    router('/logout', (ctx) => {
        page = LogOut;
        currentRoute = ctx.pathname;
    });
    router('/addauction', (ctx) => {
        page = AddAuctionForm;
        currentRoute = ctx.pathname;
    });
    router('/edit-auction/:id', (ctx) => {
        const id = ctx.params.id;
        page = EditAuctionForm;
        currentRoute = ctx.pathname;
        params = { id };
    });




    // Redirect to profile based on the username from the decoded token
    router('/profile/:id', (ctx) => {
        const id = ctx.params.id;
        page = Profile;
        currentRoute = ctx.pathname;
        params = { id };
    });

    router('/store', (ctx) => {
        page = Store;
        currentRoute = ctx.pathname;
    });

    router.start();
</script>

<main>
    <Header active={currentRoute} />
    <svelte:component this={page} {...params} />
</main>

<style>
    @import url('https://fonts.googleapis.com/css?family=Poppins:700|Poppins:400');

    :root {
        font-family: 'Poppins';
        font-weight: 400;

        --text: rgb(254, 252, 251);
        --background: rgb(46, 46, 46);
        --primary: rgb(255, 128, 0);
        --secondary: rgb(255, 255, 255);
        --accent: rgb(181, 99, 69);

        margin: 5vh 0 0;
        padding: 0;

        background-color: var(--background);
        color: var(--text);
    }

    main {
        text-align: center;
        margin: 0;
        padding: 0;
    }

</style>
