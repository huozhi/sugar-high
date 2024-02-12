export function CopyButton({ codeSnippet, ...props }) {
  return (
    <button
      {...props}
      onClick={() => {
        navigator.clipboard.writeText(codeSnippet)
      }}
    >
      Copy Code
    </button>
  )
}
