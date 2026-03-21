<script>
  import { theme } from '$lib/stores/theme'
  import { onMount } from 'svelte'

  export let currentTool = 'json'
  export let isOpen = false

  const tools = [
    { id: 'json', label: 'JSON' },
    { id: 'base64', label: 'Base64' },
    { id: 'url', label: 'URL' },
    { id: 'uuid', label: 'UUID' },
    { id: 'hash', label: 'Hash' },
    { id: 'jwt', label: 'JWT' },
    { id: 'color', label: 'Color' },
    { id: 'timestamp', label: 'Timestamp' },
    { id: 'regex', label: 'Regex' },
    { id: 'lorem', label: 'Lorem' }
  ]

  function setTheme() {
    document.documentElement.setAttribute('data-theme', $theme)
  }

  onMount(() => {
    setTheme()
  })

  $: if ($theme !== undefined) {
    setTheme()
  }

  function closeDrawer() {
    isOpen = false
  }
</script>

<aside class="sidebar" class:open={isOpen}>
  <div class="sidebar-header">
    <a href="#json" class="logo" on:click={closeDrawer}>
      <div class="logo-icon">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M13 3L4 14h7l-2 7 9-11h-7l2-7z" fill="currentColor"/>
        </svg>
      </div>
      <span class="logo-title">DevUtils</span>
    </a>
    <button class="theme-toggle" on:click={theme.toggle} aria-label="Toggle theme">
      <span class="theme-icon" class:dark={$theme === 'dark'}>
        {#if $theme === 'dark'}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="4"></circle>
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
          </svg>
        {:else}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        {/if}
      </span>
    </button>
  </div>

  <nav class="sidebar-nav">
    <div class="nav-section">
      <span class="nav-label">Tools</span>
      {#each tools as tool, i}
        <a
          href="#{tool.id}"
          class="nav-item"
          class:active={currentTool === tool.id}
          on:click={closeDrawer}
          style="--delay: {i * 20}ms"
        >
          <span class="nav-item-text">{tool.label}</span>
          {#if currentTool === tool.id}
            <span class="nav-item-indicator"></span>
          {/if}
        </a>
      {/each}
    </div>
  </nav>

  <div class="sidebar-footer">
    <span class="footer-version">v1.0.0</span>
  </div>
</aside>

<div
  class="sidebar-overlay"
  class:open={isOpen}
  on:click={closeDrawer}
  on:keydown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      closeDrawer()
      e.preventDefault()
    }
  }}
  role="button"
  tabindex="0"
  aria-label="Close sidebar"
></div>

<style>
  .sidebar {
    position: fixed;
    left: 0;
    top: 0;
    width: var(--sidebar-width);
    height: 100vh;
    display: flex;
    flex-direction: column;
    z-index: 100;
    transform: translateX(-100%);
    transition: transform var(--transition-slow) var(--ease-snap);
    background: var(--bg-surface);
    border-right: 1px solid var(--border-subtle);
  }

  .sidebar.open {
    transform: translateX(0);
  }

  .sidebar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-3) var(--space-4);
    border-bottom: 1px solid var(--border-subtle);
    min-height: var(--header-height);
  }

  .logo {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    text-decoration: none;
    outline: none;
  }

  .logo:focus-visible {
    outline: none;
    border-radius: var(--radius);
    box-shadow: var(--glow-focus);
  }

  .logo-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: var(--radius);
    background: var(--accent);
    color: white;
    box-shadow: var(--shadow-sm);
  }

  .logo-title {
    font-size: var(--text-base);
    font-weight: var(--font-semibold);
    color: var(--text-primary);
    letter-spacing: var(--tracking-tight);
  }

  .theme-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: var(--radius);
    color: var(--text-tertiary);
    background: transparent;
    border: none;
    cursor: pointer;
    transition: all var(--transition-fast);
  }

  .theme-toggle:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
  }

  .theme-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform var(--transition);
  }

  .theme-icon.dark {
    transform: rotate(180deg);
  }

  .sidebar-nav {
    flex: 1;
    padding: var(--space-2);
    overflow-y: auto;
    overflow-x: hidden;
  }

  .nav-section {
    display: flex;
    flex-direction: column;
    gap: 1px;
  }

  .nav-label {
    font-size: var(--text-xs);
    font-weight: var(--font-semibold);
    text-transform: uppercase;
    letter-spacing: var(--tracking-wide);
    color: var(--text-tertiary);
    padding: var(--space-2) var(--space-3);
    margin-bottom: var(--space-1);
  }

  .nav-item {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-2) var(--space-3);
    border-radius: var(--radius);
    color: var(--text-secondary);
    text-decoration: none;
    font-size: var(--text-sm);
    font-weight: var(--font-medium);
    transition: all var(--transition-fast);
    animation: slideIn var(--transition) var(--ease-out) backwards;
    animation-delay: var(--delay);
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(-4px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  .nav-item:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
  }

  .nav-item.active {
    background: var(--accent-soft);
    color: var(--accent);
  }

  .nav-item.active:hover {
    background: var(--accent-dim);
  }

  .nav-item-text {
    position: relative;
    z-index: 1;
  }

  .nav-item-indicator {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: var(--accent);
  }

  .sidebar-footer {
    padding: var(--space-3) var(--space-4);
    border-top: 1px solid var(--border-subtle);
    display: flex;
    justify-content: center;
  }

  .footer-version {
    font-size: var(--text-xs);
    font-family: var(--font-mono);
    color: var(--text-muted);
  }

  .sidebar-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(2px);
    z-index: 99;
    opacity: 0;
    visibility: hidden;
    transition: all var(--transition);
  }

  .sidebar-overlay.open {
    opacity: 1;
    visibility: visible;
  }

  @media (min-width: 768px) {
    .sidebar {
      transform: translateX(0);
    }

    .sidebar-overlay {
      display: none;
    }
  }

  .sidebar::-webkit-scrollbar {
    width: 4px;
  }

  .sidebar::-webkit-scrollbar-track {
    background: transparent;
  }

  .sidebar::-webkit-scrollbar-thumb {
    background: var(--border-default);
    border-radius: var(--radius-full);
  }
</style>