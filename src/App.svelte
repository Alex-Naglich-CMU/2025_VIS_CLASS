<script>
  import "./app.css";
  import Router from "svelte-spa-router";
  import { routes } from "./routes.js";
  import Nav from "./lib/components/nav.svelte";
</script>

<main>
  <Nav />
  <Router {routes} />
</main>
