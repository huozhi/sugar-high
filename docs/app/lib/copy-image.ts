export async function copyImageDataUrl(dataUrl: string) {
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
  try {
    if (navigator.clipboard && window.ClipboardItem && !isSafari) {
      // Modern browsers: Use Clipboard API
      const blob = await (await fetch(dataUrl)).blob()
      const item = new ClipboardItem({ 'image/png': blob })
      await navigator.clipboard.write([item])
    } else {
      // Safari fallback: Use <canvas> + execCommand
      await copyImageForSafari(dataUrl)
    }
  } catch (error) {
    await copyImageForSafari(dataUrl)
    console.error(error)
  }
}

async function copyImageForSafari(dataUrl: string) {
  const img = new Image()
  img.src = dataUrl

  img.onload = () => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    canvas.width = img.width
    canvas.height = img.height
    ctx.drawImage(img, 0, 0)

    canvas.toBlob(async (blob) => {
      if (navigator.clipboard && navigator.clipboard.write) {
        try {
          await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
        } catch (error) {
          fallbackCopyImage(canvas)
        }
      } else {
        fallbackCopyImage(canvas)
      }
    })
  }
}

function fallbackCopyImage(canvas: HTMLCanvasElement) {
  const img = document.createElement('img')
  img.src = canvas.toDataURL('image/png')

  const range = document.createRange()
  document.body.appendChild(img)
  range.selectNode(img)

  const selection = window.getSelection()
  selection.removeAllRanges()
  selection.addRange(range)

  document.execCommand('copy')
  document.body.removeChild(img)
}
