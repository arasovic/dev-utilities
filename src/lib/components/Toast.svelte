<script>
  import { onMount } from 'svelte'

  export let duration = 3000
  export let position = 'bottom-right'

  let message = ''
  let toastType = 'success'
  let visible = false
  let timeoutId = null
  let progressWidth = 100

  const icons = {
    success: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`,
    error: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`,
    warning: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
    info: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`
  }

  export function show(newMessage, newType = 'success') {
    clearTimeout(timeoutId)
    message = newMessage
    toastType = newType
    visible = true
    progressWidth = 100

    const startTime = Date.now()
    const animateProgress = () => {
      const elapsed = Date.now() - startTime
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100)
      progressWidth = remaining
      
      if (remaining > 0 && visible) {
        requestAnimationFrame(animateProgress)
      }
    }
    
    requestAnimationFrame(animateProgress)

    timeoutId = setTimeout(() => {
      visible = false
    }, duration)
  }

  function hide() {
    visible = false
    clearTimeout(timeoutId)
  }

  onMount(() => {
    return () => clearTimeout(timeoutId)
  })
</script>

{#if visible}
  <div 
    class="toast toast-{toastType} toast-{position}" 
    role="alert" 
    aria-live="polite"
  >
    <div class="toast-content">
      <span class="toast-icon">
        {@html icons[toastType] || icons.info}
      </span>
      <span class="toast-message">{message}</span>
    </div>
    <button class="toast-close" on:click={hide} aria-label="Dismiss notification">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>
    <div class="toast-progress">
      <div class="toast-progress-bar" style="width: {progressWidth}%"></div>
    </div>
  </div>
{/if}

<style>
  .toast {
    position: fixed;
    z-index: var(--z-popover);
    padding: var(--space-3) var(--space-4);
    background: var(--bg-surface);
    border: 1px solid var(--border-default);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-lg);
    display: flex;
    align-items: center;
    gap: var(--space-3);
    min-width: 260px;
    max-width: 360px;
    animation: slideIn var(--transition) var(--ease-snap);
    overflow: hidden;
  }

  .toast-bottom-right {
    bottom: var(--space-5);
    right: var(--space-5);
  }

  .toast-bottom-left {
    bottom: var(--space-5);
    left: var(--space-5);
  }

  .toast-top-right {
    top: var(--space-5);
    right: var(--space-5);
  }

  .toast-top-left {
    top: var(--space-5);
    left: var(--space-5);
  }

  .toast-top-center {
    top: var(--space-5);
    left: 50%;
    transform: translateX(-50%);
  }

  .toast-bottom-center {
    bottom: var(--space-5);
    left: 50%;
    transform: translateX(-50%);
  }

  .toast-content {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    flex: 1;
    min-width: 0;
  }

  .toast-icon {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .toast-success .toast-icon {
    color: var(--success);
  }

  .toast-error .toast-icon {
    color: var(--error);
  }

  .toast-warning .toast-icon {
    color: var(--warning);
  }

  .toast-info .toast-icon {
    color: var(--info);
  }

  .toast-message {
    font-size: var(--text-sm);
    font-weight: var(--font-medium);
    color: var(--text-primary);
    line-height: var(--leading-snug);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .toast-close {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    padding: 0;
    border: none;
    border-radius: var(--radius);
    background: transparent;
    color: var(--text-tertiary);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all var(--transition-fast);
  }

  .toast-close:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
  }

  .toast-progress {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: var(--border-subtle);
  }

  .toast-progress-bar {
    height: 100%;
    transition: width 50ms linear;
  }

  .toast-success .toast-progress-bar {
    background: var(--success);
  }

  .toast-error .toast-progress-bar {
    background: var(--error);
  }

  .toast-warning .toast-progress-bar {
    background: var(--warning);
  }

  .toast-info .toast-progress-bar {
    background: var(--info);
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(8px) scale(0.98);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @media (max-width: 480px) {
    .toast {
      left: var(--space-3);
      right: var(--space-3);
      min-width: auto;
      max-width: none;
    }

    .toast-bottom-right,
    .toast-bottom-left,
    .toast-bottom-center {
      bottom: var(--space-3);
    }

    .toast-top-right,
    .toast-top-left,
    .toast-top-center {
      top: var(--space-3);
    }

    .toast-top-center,
    .toast-bottom-center {
      transform: none;
    }
  }
</style>