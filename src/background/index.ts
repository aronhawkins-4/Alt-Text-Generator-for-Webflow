// import axios from 'axios'
// //@ts-expect-error
// import * as bops from 'bops'
// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   if (request === 'test') {
//     sendResponse('test received')
//   }
//   return true
// })

// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   if ('generateAltText' === request.action) {
//     let buffer = new Uint8Array(request.buffer)
//     console.log(buffer)
//     return (
//       generateAltText(buffer)
//         .then((res) => {
//           console.log(res)

//           sendResponse({
//             ok: true,
//             altText: res,
//           })
//         })
//         .catch(() => {
//           sendResponse({
//             ok: false,
//           })
//         }),
//       true
//     )
//   }
// })

// function generateAltText(buffer: any) {
//   return fetch(
//     'https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-base',
//     {
//       headers: {
//         Authorization: 'Bearer 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',
//       },
//       method: 'POST',
//       body: buffer,
//     },
//   )
//     .then((res) => res.json())
//     .then((json) => {
//       console.log(json)
//       if (json && json.at(0).generated_text) return json.at(0).generated_text
//       throw Error('Invalid response format')
//     })
//     .catch((error: any) => error.message)
// }
