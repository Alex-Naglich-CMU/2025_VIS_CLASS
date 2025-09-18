<script>
  const navRoutes = [
    { path: "/", name: "Home" },
    { path: "/contact", name: "Contact" },
    { path: "/assignments/a1", name: "A1" },
    { path: "https://github.com/Alex-Naglich-CMU", name: "Github" },
  ];
</script>

<div class="flex items-center justify-between p-4">
  <nav class="flex-grow">
    <ul class="flex space-x-4">
      {#each navRoutes as { path, name }}
        <li>
          {#if path.startsWith("http")}
            <a
              href={path}
              class="btn btn-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              {name}
            </a>
          {:else}
            <a href={`#${path}`} class="btn btn-primary">
              {name}
            </a>
          {/if}
        </li>
      {/each}
    </ul>
  </nav>

  <a
    href="#/"
    class="rounded-full bg-[rgba(0,0,139,0.4)] p-0.5"
    aria-label="Go to Homepage"
  >
    <div class="relative h-16 w-16 overflow-hidden rounded-full">
      <!-- You had a commented-out image, so I'll replace it with a placeholder. -->
      <img
        src="/Alex_Naglich_Face.png"
        alt="Home"
        class="h-full w-full object-cover object-center"
      />
      <div
        class="absolute inset-0 rounded-full transition-all duration-200 hover:bg-white/5"
      ></div>
    </div>
  </a>
</div>
