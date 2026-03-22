/**
 * @param {string} text
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text)
    return { success: true }
  } catch (/** @type {any} */ err) {
    return { success: false, error: err.message }
  }
}
