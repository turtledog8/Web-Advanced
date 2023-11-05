<script>
    import router from 'page';

    import Store from "./pages/Store.svelte";
    import Header from "./components/Header.svelte";
    import Details from "./pages/Details.svelte";
    import Register from "./pages/Register.svelte";
    import Login from "./pages/Login.svelte";
    import Profile from "./pages/Profile.svelte";
    import Home from "./pages/Home.svelte";

    let page;
    let currentRoute;
    let params;

    router('/home', (ctx) => {
        page = Home;
        currentRoute = ctx.pathname;
    });
    router('/auctions/:id', (ctx) => {
        const id = ctx.params.id;
        page = Details;
        currentRoute = ctx.pathname;

        // Render the Details component and pass the "id" as a prop
        params = { id }; // Create an object with id as a prop
    });
    router('/login', (ctx) => {
        page = Login;
        currentRoute = ctx.pathname;
    });
    router('/register', (ctx) => {
        page = Register;
        currentRoute = ctx.pathname;
    });
    router('/profile/:id', (ctx) => {
        const id = ctx.params.id;
        page = Profile;
        currentRoute = ctx.pathname;

        // Render the Details component and pass the "id" as a prop
        params = { id }; // Create an object with id as a prop
    });
    router('/store', (ctx) => {
        page = Store;
        currentRoute = ctx.pathname;
    });

    router.start();
</script>

<main>
    <Header active={currentRoute} />
    <svelte:component this={page} {...params}/>
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
