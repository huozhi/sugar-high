export default function Page() {
  return (
    <div>
      <div class="title">
        <h1>Sugar High</h1>
        <p>Super lightweight syntax highlighter for JSX, <b>1KB</b> after minified and gizpped.</p>
      </div>
      <div class="flex">
        <div class="editor">
          <pre class="pre"><code class="pad" id="output"></code></pre>
          <textarea class="pad absolute-full" id="code"></textarea>
        </div>

      </div>
    </div>
  )
}
