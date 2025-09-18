import A1 from "./pages/assignments/A1.svelte";
import HomePage from "./pages/HomePage.svelte";
import ContactPage from "./pages/Contact.svelte";

export const routes = {
  "/": HomePage, // The main route
  "/assignments/a1": A1,
  "/contact": ContactPage,
  "*": HomePage, // Fallback route
};
