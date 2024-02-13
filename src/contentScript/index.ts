import axios from 'axios'
//@ts-expect-error
import * as bops from 'bops'
import ConvertApi from 'convertapi-js'

console.info('Alt Text Generator is ready')

async function convertSvg(href: string) {
  const convertApi = ConvertApi.auth('JtbBiHM3zvhTYN9s')

  const params = convertApi.createParams()
  params.add('file', new URL(href))
  const result = (await convertApi.convert('svg', 'png', params)) as unknown as
    | ConvertedPNG
    | undefined
  if (result) {
    const url = result?.dto?.Files?.at(0)?.Url
    if (url) {
      return url
    }
    return undefined
  }
}

const mutObserver = new MutationObserver((mutationList: MutationRecord[]) => {
  for (const mutation of mutationList) {
    if (mutation.target.parentElement?.getAttribute('id') === 'asset-popover') {
      const assetPopover = mutation.target.parentElement
      const generateButton = document.createElement('button')
      const generateButtonText = document.createTextNode('Generate Alt Text')
      generateButton.appendChild(generateButtonText)
      generateButton.style.cssText =
        'position: absolute; bottom: .25rem; left: .25rem; z-index:10; background-color: rgba(255,255,255,.1); color: #c4c4c4; border: none; border-radius: .1rem;'
      generateButton.classList.add('alt-text-button')
      const textArea = assetPopover.querySelector('textarea')
      const href = assetPopover.querySelector('a')?.getAttribute('href')?.toString()
      if (!textArea?.parentElement?.querySelector('.alt-text-button')) {
        textArea?.parentElement?.appendChild(generateButton)
      }
      generateButton.addEventListener('click', () => {
        generateButtonText.textContent = 'Generating...'
        if (href && textArea) {
          try {
            axios
              .post('https://alt-text-generator-api.onrender.com/generate', {
                url: href,
              })
              .then((res) => {
                const generatedText = res.data
                if (textArea) {
                  if (generatedText) {
                    textArea.value = generatedText
                    textArea.dispatchEvent(
                      new InputEvent('input', {
                        bubbles: true,
                        cancelable: true,
                      }),
                    )
                    textArea.selectionStart = textArea.selectionEnd = generatedText.length
                    textArea.focus()
                    generateButtonText.textContent = 'Done!'
                    setTimeout(() => {
                      generateButtonText.textContent = 'Generate Alt Text'
                    }, 1000)
                  }
                }
              })
              .catch((error: any) => {
                throw new Error(error.message)
              })
          } catch (error: any) {
            generateButtonText.textContent = 'Generate Alt Text'
            alert('something went wrong while generating alt text')
          }
        }
      })
    }
  }
})
mutObserver.observe(document.getElementById('designer-app-react-mount')!, {
  childList: true,
  subtree: true,
  attributes: true,
})

type ConvertedPNG = {
  dto: {
    ConversionCost: number
    Files: {
      FileExt: string
      FileId: string
      FileName: string
      FileSize: number
      Url: string
    }[]
  }
}
