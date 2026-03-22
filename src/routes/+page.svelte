<script>
  import { base } from '$app/paths'
  import { theme } from '$lib/stores/theme'
  import { browser } from '$app/environment'
  import { onMount } from 'svelte'
  import {
    Code,
    Binary,
    Link,
    Fingerprint,
    Hash,
    KeyRound,
    Palette,
    Clock,
    ScanSearch,
    FileText,
    Sun,
    Moon,
    Search,
    X,
    ChevronRight,
    SearchX,
    Braces
  } from 'lucide-svelte'

  const pageTitle = 'DevUtils - Free Developer Utilities & Online Tools'
  const pageDescription = 'Free online developer tools: JSON formatter, Base64 encoder, UUID generator, hash calculator, JWT decoder, and more. Essential utilities for developers.'
  const canonicalUrl = 'https://arasovic.github.io/dev-utilities/'
  const ogImage = 'https://arasovic.github.io/dev-utilities/og-image.svg'

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'data', label: 'Data' },
    { id: 'encoding', label: 'Encoding' },
    { id: 'generators', label: 'Generators' },
    { id: 'converters', label: 'Converters' }
  ]

  const tools = [
    {
      path: 'json',
      name: 'JSON Formatter',
      desc: 'Format, validate & beautify JSON data with syntax highlighting',
      category: 'data',
      icon: Code
    },
    {
      path: 'regex',
      name: 'Regex Tester',
      desc: 'Test & validate regular expressions with real-time matching',
      category: 'data',
      icon: ScanSearch
    },
    {
      path: 'base64',
      name: 'Base64',
      desc: 'Encode & decode Base64 strings for data transmission',
      category: 'encoding',
      icon: Binary
    },
    {
      path: 'url',
      name: 'URL Encoder',
      desc: 'Encode & decode URLs and query parameters safely',
      category: 'encoding',
      icon: Link
    },
    {
      path: 'jwt',
      name: 'JWT Decoder',
      desc: 'Decode and inspect JWT token payload and signatures',
      category: 'encoding',
      icon: KeyRound
    },
    {
      path: 'uuid',
      name: 'UUID Generator',
      desc: 'Generate UUID v4 identifiers for your applications',
      category: 'generators',
      icon: Fingerprint
    },
    {
      path: 'hash',
      name: 'Hash Calculator',
      desc: 'Calculate MD5, SHA-1, SHA-256, SHA-512 hashes',
      category: 'generators',
      icon: Hash
    },
    {
      path: 'lorem',
      name: 'Lorem Ipsum',
      desc: 'Generate placeholder text for mockups and prototypes',
      category: 'generators',
      icon: FileText
    },
    {
      path: 'color',
      name: 'Color Converter',
      desc: 'Convert between HEX, RGB, HSL color formats',
      category: 'converters',
      icon: Palette
    },
    {
      path: 'timestamp',
      name: 'Timestamp',
      desc: 'Convert Unix timestamps to readable dates and times',
      category: 'converters',
      icon: Clock
    }
  ]

  let searchQuery = ''
  let selectedCategory = 'all'
  /** @type {HTMLInputElement | undefined} */
  let searchInput = undefined

  $: filteredTools = tools.filter(tool => {
    const matchesSearch = searchQuery === '' || 
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.desc.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCategory = selectedCategory === 'all' || 
      tool.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  $: hasResults = filteredTools.length > 0

  /**
    * @param {string} text
    * @param {string} query
    * @returns {string}
    */
  function highlightMatch(text, query) {
    if (!query) return text
    const escaped = escapeRegex(query)
    if (!escaped) return text
    const regex = new RegExp(`(${escaped})`, 'gi')
    return text.replace(regex, '<mark>$1</mark>')
  }

  /**
    * @param {string} string
    * @returns {string}
    */
  function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  }

  /**
   * @param {string} categoryId
   */
  function setCategory(categoryId) {
    selectedCategory = categoryId
  }

  function clearSearch() {
    searchQuery = ''
    searchInput?.focus()
  }

  /**
   * @param {KeyboardEvent} e
   */
  function handleKeydown(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault()
      searchInput?.focus()
    }
  }

  onMount(() => {
    if (browser) {
      document.addEventListener('keydown', handleKeydown)
      return () => document.removeEventListener('keydown', handleKeydown)
    }
  })

  function setTheme() {
    if (browser) {
      document.documentElement.setAttribute('data-theme', $theme)
    }
  }

  onMount(() => {
    setTheme()
  })

  $: if ($theme !== undefined && browser) {
    setTheme()
  }
</script>

<svelte:head>
  <title>{pageTitle}</title>
  <meta name="description" content={pageDescription} />
  <meta name="keywords" content="developer tools, online utilities, JSON formatter, Base64 encoder, UUID generator, hash calculator, developer utilities, free tools" />
  <link rel="canonical" href={canonicalUrl} />

  <meta property="og:title" content={pageTitle} />
  <meta property="og:description" content={pageDescription} />
  <meta property="og:type" content="website" />
  <meta property="og:url" content={canonicalUrl} />
  <meta property="og:image" content={ogImage} />
  <meta property="og:site_name" content="DevUtils" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={pageTitle} />
  <meta name="twitter:description" content={pageDescription} />
  <meta name="twitter:image" content={ogImage} />
</svelte:head>

<div class="home-container">
  <header class="home-header">
    <div class="header-top">
      <a href="/" class="logo">
        <div class="logo-icon">
          <Braces size={20} />
        </div>
        <span class="logo-title">DevUtils</span>
      </a>
      <button class="theme-toggle" on:click={theme.toggle} aria-label="Toggle theme">
        {#if $theme === 'dark'}
          <Sun size={16} />
        {:else}
          <Moon size={16} />
        {/if}
      </button>
    </div>
  </header>

  <main class="home-main">
    <section class="hero">
      <h1 class="hero-title">Developer Utilities</h1>
      <p class="hero-subtitle">Free online tools for developers. Fast, secure, and privacy-focused.</p>
    </section>

    <section class="search-section">
      <div class="search-wrapper">
        <div class="search-icon">
          <Search size={18} />
        </div>
        <input
          bind:this={searchInput}
          bind:value={searchQuery}
          type="text"
          class="search-input"
          placeholder="Search tools..."
          aria-label="Search tools"
        />
        <div class="search-actions">
          {#if searchQuery}
            <button class="search-clear" on:click={clearSearch} aria-label="Clear search">
              <X size={16} />
            </button>
          {/if}
          <kbd class="search-shortcut">Ctrl K</kbd>
        </div>
      </div>

      <div class="category-filters" role="group" aria-label="Filter by category">
        {#each categories as category}
          <button
            class="category-chip"
            class:active={selectedCategory === category.id}
            on:click={() => setCategory(category.id)}
            aria-pressed={selectedCategory === category.id}
          >
            {category.label}
          </button>
        {/each}
      </div>
    </section>

    <section class="tools-section" aria-live="polite" aria-atomic="true">
      {#if hasResults}
        <div class="tools-grid">
          {#each filteredTools as tool (tool.path)}
            <a href="{base}/{tool.path}" class="tool-card">
              <div class="tool-icon">
                <svelte:component this={tool.icon} size={22} />
              </div>
              <div class="tool-info">
                <h2 class="tool-name">
                  {@html highlightMatch(tool.name, searchQuery)}
                </h2>
                <p class="tool-desc">
                  {@html highlightMatch(tool.desc, searchQuery)}
                </p>
              </div>
              <div class="tool-arrow">
                <ChevronRight size={16} />
              </div>
            </a>
          {/each}
        </div>
      {:else}
        <div class="no-results">
          <div class="no-results-icon">
            <SearchX size={32} />
          </div>
          <h3 class="no-results-title">No results found</h3>
          <p class="no-results-text">Try adjusting your search or category filter</p>
          <button class="btn-secondary" on:click={() => { searchQuery = ''; selectedCategory = 'all'; }}>
            Clear filters
          </button>
        </div>
      {/if}
    </section>

    <footer class="home-footer">
      <p class="footer-note">All processing happens in your browser. No data is sent to servers.</p>
    </footer>
  </main>
</div>

<style>
  .home-container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: var(--bg-base);
  }

  .home-header {
    padding: var(--space-4) var(--space-5);
    border-bottom: 1px solid var(--border-subtle);
  }

  .header-top {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .logo {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    text-decoration: none;
  }

  .logo-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: var(--radius);
    background: var(--accent);
    color: white;
  }

  .logo-title {
    font-size: var(--text-xl);
    font-weight: var(--font-semibold);
    color: var(--text-primary);
    letter-spacing: var(--tracking-tight);
  }

  .theme-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
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

  .home-main {
    flex: 1;
    max-width: 900px;
    width: 100%;
    margin: 0 auto;
    padding: var(--space-8) var(--space-5);
  }

  .hero {
    text-align: center;
    margin-bottom: var(--space-8);
  }

  .hero-title {
    font-size: var(--text-3xl);
    font-weight: var(--font-semibold);
    color: var(--text-primary);
    margin-bottom: var(--space-3);
    letter-spacing: var(--tracking-tight);
  }

  .hero-subtitle {
    font-size: var(--text-base);
    color: var(--text-secondary);
    line-height: var(--leading-normal);
  }

  .search-section {
    margin-bottom: var(--space-8);
  }

  .search-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    max-width: 600px;
    margin: 0 auto;
  }

  .search-icon {
    position: absolute;
    left: var(--space-4);
    color: var(--text-tertiary);
    pointer-events: none;
  }

  .search-input {
    flex: 1;
    height: 56px;
    padding: 0 calc(var(--space-4) + 60px) 0 var(--space-12);
    font-size: var(--text-lg);
    font-weight: var(--font-normal);
    color: var(--text-primary);
    background: var(--bg-surface);
    border: 1px solid var(--border-default);
    border-radius: var(--radius-lg);
    outline: none;
    transition: all var(--transition-fast);
  }

  .search-input::placeholder {
    color: var(--text-muted);
  }

  .search-input:hover {
    border-color: var(--border-strong);
  }

  .search-input:focus {
    border-color: var(--accent);
    box-shadow: var(--glow-focus);
  }

  .search-actions {
    position: absolute;
    right: var(--space-3);
    display: flex;
    align-items: center;
    gap: var(--space-2);
  }

  .search-actions > * {
    pointer-events: auto;
  }

  .search-clear {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: var(--radius);
    color: var(--text-tertiary);
    background: var(--bg-hover);
    border: none;
    cursor: pointer;
    transition: all var(--transition-fast);
  }

  .search-clear:hover {
    background: var(--bg-active);
    color: var(--text-primary);
  }

  .search-shortcut {
    padding: var(--space-1) var(--space-2);
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    font-weight: var(--font-medium);
    color: var(--text-tertiary);
    background: var(--bg-elevated);
    border: 1px solid var(--border-default);
    border-radius: var(--radius-sm);
  }

  .category-filters {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: var(--space-2);
    margin-top: var(--space-6);
  }

  .category-chip {
    padding: var(--space-2) var(--space-4);
    font-size: var(--text-sm);
    font-weight: var(--font-medium);
    color: var(--text-secondary);
    background: var(--bg-surface);
    border: 1px solid var(--border-default);
    border-radius: var(--radius-full);
    cursor: pointer;
    transition: all var(--transition-fast);
  }

  .category-chip:hover {
    background: var(--bg-hover);
    border-color: var(--border-strong);
    color: var(--text-primary);
  }

  .category-chip.active {
    background: var(--accent-soft);
    border-color: var(--accent-dim);
    color: var(--accent);
  }

  .tools-section {
    min-height: 200px;
  }

  .tools-grid {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }

  .tool-card {
    display: flex;
    align-items: center;
    gap: var(--space-4);
    padding: var(--space-4);
    background: var(--bg-surface);
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-md);
    text-decoration: none;
    transition: all var(--transition-fast);
  }

  .tool-card:hover {
    border-color: var(--accent);
    background: var(--bg-elevated);
    transform: translateX(4px);
  }

  .tool-icon {
    flex-shrink: 0;
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--accent-soft);
    border-radius: var(--radius);
    color: var(--accent);
  }

  .tool-info {
    flex: 1;
    min-width: 0;
  }

  .tool-name {
    font-size: var(--text-base);
    font-weight: var(--font-semibold);
    color: var(--text-primary);
    margin: 0 0 var(--space-1) 0;
  }

  .tool-name :global(mark) {
    background: var(--accent-soft);
    color: var(--accent);
    padding: 0 2px;
    border-radius: var(--radius-sm);
  }

  .tool-desc {
    font-size: var(--text-sm);
    color: var(--text-tertiary);
    margin: 0;
    line-height: var(--leading-snug);
  }

  .tool-desc :global(mark) {
    background: var(--accent-soft);
    color: var(--accent);
    padding: 0 2px;
    border-radius: var(--radius-sm);
  }

  .tool-arrow {
    flex-shrink: 0;
    color: var(--text-muted);
    opacity: 0;
    transform: translateX(-4px);
    transition: all var(--transition-fast);
  }

  .tool-card:hover .tool-arrow {
    opacity: 1;
    transform: translateX(0);
    color: var(--accent);
  }

  .no-results {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: var(--space-12) var(--space-4);
    text-align: center;
  }

  .no-results-icon {
    color: var(--text-muted);
    margin-bottom: var(--space-4);
  }

  .no-results-title {
    font-size: var(--text-lg);
    font-weight: var(--font-semibold);
    color: var(--text-primary);
    margin-bottom: var(--space-2);
  }

  .no-results-text {
    font-size: var(--text-sm);
    color: var(--text-tertiary);
    margin-bottom: var(--space-4);
  }

  .btn-secondary {
    padding: var(--space-2) var(--space-4);
    font-size: var(--text-sm);
    font-weight: var(--font-medium);
    color: var(--text-primary);
    background: var(--bg-elevated);
    border: 1px solid var(--border-default);
    border-radius: var(--radius);
    cursor: pointer;
    transition: all var(--transition-fast);
  }

  .btn-secondary:hover {
    background: var(--bg-hover);
    border-color: var(--border-strong);
  }

  .home-footer {
    margin-top: var(--space-10);
    padding-top: var(--space-6);
    border-top: 1px solid var(--border-subtle);
    text-align: center;
  }

  .footer-note {
    font-size: var(--text-xs);
    color: var(--text-muted);
  }

  @media (max-width: 640px) {
    .home-header {
      padding: var(--space-3) var(--space-4);
    }

    .home-main {
      padding: var(--space-6) var(--space-4);
    }

    .hero {
      margin-bottom: var(--space-6);
    }

    .hero-title {
      font-size: var(--text-2xl);
    }

    .search-input {
      height: 48px;
      font-size: var(--text-base);
      padding-right: var(--space-4);
    }

    .search-shortcut {
      display: none;
    }

    .search-clear {
      right: var(--space-4);
    }

    .category-filters {
      gap: var(--space-2);
    }

    .category-chip {
      padding: var(--space-1) var(--space-3);
      font-size: var(--text-xs);
    }

    .tool-card {
      padding: var(--space-3);
    }

    .tool-icon {
      width: 40px;
      height: 40px;
    }

    .tool-arrow {
      display: none;
    }
  }
</style>
