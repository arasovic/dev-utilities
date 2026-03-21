<script>
  import Sidebar from './Sidebar.svelte'

  export let currentTool = 'json'
  export let title = ''

  let sidebarOpen = false

  function toggleSidebar() {
    sidebarOpen = !sidebarOpen
  }
</script>

<svelte:window on:keydown={(e) => {
  if (e.ctrlKey && e.key === 'k') {
    e.preventDefault()
    toggleSidebar()
  }
}} />

<div class="layout">
  <Sidebar {currentTool} bind:isOpen={sidebarOpen} />

  <div class="main">
    <header class="header">
      <button class="menu-btn" on:click={toggleSidebar} aria-label="Toggle menu">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
          <line x1="4" y1="6" x2="20" y2="6"></line>
          <line x1="4" y1="12" x2="20" y2="12"></line>
          <line x1="4" y1="18" x2="20" y2="18"></line>
        </svg>
      </button>
      <h1 class="page-title">{title}</h1>
      <div class="header-actions">
        <kbd class="kbd">⌘K</kbd>
      </div>
    </header>

    <main class="content">
      <slot />
    </main>
  </div>
</div>

<style>
  .layout {
    display: flex;
    min-height: 100vh;
    background: var(--bg-base);
  }

  .main {
    flex: 1;
    margin-left: 0;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  .header {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    padding: var(--space-3) var(--space-4);
    position: sticky;
    top: 0;
    z-index: var(--z-sticky);
    height: var(--header-height);
    background: var(--glass-bg);
    backdrop-filter: blur(8px);
    border-bottom: 1px solid var(--border-subtle);
  }

  .menu-btn {
    display: none;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: var(--radius);
    color: var(--text-secondary);
    background: transparent;
    border: none;
    cursor: pointer;
    transition: all var(--transition-fast);
  }

  .menu-btn:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
  }

  .page-title {
    flex: 1;
    font-size: var(--text-base);
    font-weight: var(--font-semibold);
    color: var(--text-primary);
    letter-spacing: var(--tracking-tight);
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: var(--space-2);
  }

  .kbd {
    display: inline-flex;
    align-items: center;
    padding: 2px 6px;
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    font-weight: var(--font-medium);
    color: var(--text-tertiary);
    background: var(--bg-elevated);
    border: 1px solid var(--border-default);
    border-radius: var(--radius-sm);
    white-space: nowrap;
  }

  .content {
    flex: 1;
    padding: var(--space-4);
    overflow-y: auto;
  }

  @media (max-width: 767px) {
    .menu-btn {
      display: flex;
    }

    .content {
      padding: var(--space-3);
    }

    .kbd {
      display: none;
    }
  }

  @media (min-width: 768px) {
    .main {
      margin-left: var(--sidebar-width);
    }

    .header {
      padding: var(--space-3) var(--space-5);
    }

    .content {
      padding: var(--space-5);
    }
  }
</style>