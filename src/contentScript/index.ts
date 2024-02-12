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
            if (href.slice(-3) === 'svg') {
              convertSvg(href).then((res) => {
                if (res) {
                  generate(res)
                }
              })
              return
            } else {
              generate(href)
            }

            function generate(href: string) {
              axios
                .get(href, { responseType: 'arraybuffer' })
                .then((axiosRes) => {
                  const uintArr = new Uint8Array(axiosRes.data)
                  const regularArr = Array.from(uintArr)
                  const bopsArray = bops.from(regularArr, 'utf-8')
                  return bopsArray
                })
                .then((array) => {
                  fetch(
                    'https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-base',
                    {
                      headers: {
                        Authorization: 'Bearer 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',
                      },
                      method: 'POST',
                      body: array,
                    },
                  )
                    .then((res) => res.json())
                    .then((json) => {
                      if (json && json.at(0).generated_text) return json.at(0).generated_text
                      throw Error('Invalid response format')
                    })
                    .then((res) => {
                      const generatedText = res
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
                    .catch((error: any) => error.message)
                })
            }
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
