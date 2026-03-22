/**
 * Centralized tool titles configuration
 * @type {Record<string, string>}
 */
export const toolTitles = {
  json: 'JSON Formatter',
  base64: 'Base64 Encoder/Decoder',
  url: 'URL Encoder/Decoder',
  uuid: 'UUID Generator',
  hash: 'Hash Calculator',
  jwt: 'JWT Decoder',
  color: 'Color Converter',
  timestamp: 'Timestamp Converter',
  regex: 'Regex Tester',
  lorem: 'Lorem Ipsum Generator'
}

/**
 * Get page title for a tool path
 * @param {string} path
 * @returns {string}
 */
export function getToolTitle(path) {
  return toolTitles[path] || 'DevUtils'
}
