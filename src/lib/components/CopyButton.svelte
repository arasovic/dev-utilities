<script>
  import { createEventDispatcher } from 'svelte'
  import { copyToClipboard } from '$lib/utils/clipboard'
  import Toast from './Toast.svelte'

  export let text = ''
  export let disabled = false
  export let size = 'md'

  const dispatch = createEventDispatcher()
  let toast = null
  let copied = false

  const sizes = {
    sm: 24,
    md: 32,
    lg: 40
  }

  $: buttonSize = sizes[size] || sizes.md

  async function handleCopy() {
    if (!text || disabled) return

    const result = await copyToClipboard(text)
    if (result.success) {
      copied = true
      toast?.show('Copied to clipboard', 'success')
      dispatch('copy')
      setTimeout(() => copied = false, 2000)
    } else {
      toast?.show('Failed to copy', 'error')
      dispatch('error', result.error)
    }
  }
</script>

<div class="copy-wrapper">
  <Toast bind:this={toast} />
  <button
    class="copy-btn"
    class:copied
    class:disabled
    on:click={handleCopy}
    {disabled}
    aria-label={copied ? 'Copied to clipboard' : 'Copy to clipboard'}
    title={copied ? 'Copied!' : 'Copy'}
    style="--btn-size: {buttonSize}px"
  >
    <span class="icon-container">
      <svg class="icon icon-copy" width={buttonSize * 0.45} height={buttonSize * 0.45} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
      </svg>
      <svg class="icon icon-check" width={buttonSize * 0.45} height={buttonSize * 0.45} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    </span>
  </button>
</div>

<style>
  .copy-wrapper {
    display: inline-flex;
    position: relative;
  }

  .copy-btn {
    --btn-size: 28px;
    width: var(--btn-size);
    height: var(--btn-size);
    padding: 0;
    border: 1px solid var(--border-default);
    border-radius: var(--radius);
    background: var(--bg-surface);
    color: var(--text-tertiary);
    cursor: pointer;
    transition: all var(--transition-fast);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
  }

  .copy-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--accent-soft);
    opacity: 0;
    transition: opacity var(--transition-fast);
  }

  .copy-btn:hover:not(.disabled) {
    border-color: var(--accent);
    color: var(--accent);
  }

  .copy-btn:hover:not(.disabled)::before {
    opacity: 1;
  }

  .copy-btn:active:not(.disabled) {
    transform: scale(0.96);
  }

  .copy-btn.copied {
    border-color: var(--success);
    color: var(--success);
    background: var(--success-soft);
  }

  .copy-btn.disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .icon-container {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .icon {
    position: absolute;
    transition: all var(--transition-fast);
  }

  .icon-copy {
    opacity: 1;
    transform: scale(1);
  }

  .icon-check {
    opacity: 0;
    transform: scale(0.5);
  }

  .copy-btn.copied .icon-copy {
    opacity: 0;
    transform: scale(0.5);
  }

  .copy-btn.copied .icon-check {
    opacity: 1;
    transform: scale(1);
  }
</style>