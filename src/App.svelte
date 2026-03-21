<script>
  import { onMount } from 'svelte'
  import { theme } from './lib/stores/theme.js'
  import Layout from './lib/components/Layout.svelte'
  import JsonTool from './lib/tools/JsonTool.svelte'
  import Base64Tool from './lib/tools/Base64Tool.svelte'
  import UrlTool from './lib/tools/UrlTool.svelte'
  import UuidTool from './lib/tools/UuidTool.svelte'
  import HashTool from './lib/tools/HashTool.svelte'
  import JwtTool from './lib/tools/JwtTool.svelte'
  import ColorTool from './lib/tools/ColorTool.svelte'
  import TimestampTool from './lib/tools/TimestampTool.svelte'
  import RegexTool from './lib/tools/RegexTool.svelte'
  import LoremTool from './lib/tools/LoremTool.svelte'

  let currentTool = 'json'

  const tools = {
    json: { component: JsonTool, title: 'JSON Formatter' },
    base64: { component: Base64Tool, title: 'Base64 Encoder/Decoder' },
    url: { component: UrlTool, title: 'URL Encoder/Decoder' },
    uuid: { component: UuidTool, title: 'UUID Generator' },
    hash: { component: HashTool, title: 'Hash Calculator' },
    jwt: { component: JwtTool, title: 'JWT Decoder' },
    color: { component: ColorTool, title: 'Color Converter' },
    timestamp: { component: TimestampTool, title: 'Timestamp Converter' },
    regex: { component: RegexTool, title: 'Regex Tester' },
    lorem: { component: LoremTool, title: 'Lorem Ipsum Generator' }
  }

  function handleHashChange() {
    const hash = window.location.hash.slice(1)
    if (hash && tools[hash]) {
      currentTool = hash
    }
  }

  onMount(() => {
    handleHashChange()
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  })

  $: activeTool = tools[currentTool] || tools.json
</script>

<Layout {currentTool} title={activeTool.title}>
  <svelte:component this={activeTool.component} />
</Layout>

<svelte:head>
  <meta name="description" content="DevUtils - Developer Utilities" />
</svelte:head>
