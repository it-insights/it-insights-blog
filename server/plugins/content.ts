import { ofetch } from 'ofetch'
import { parseFilename } from 'ufo'
import { visit } from 'unist-util-visit'

// Set default image to first image in post
export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('content:file:afterParse', (file) => {
    if (file._id.endsWith('.md') && !file.image) {
      visit(file.body, (n: any) => n.tag === 'blog-image', (node) => {
        file.image = node.props.src
      })
    }
  })
})

/* export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('content:file:beforeParse', (file) => {
    const regex = /(https:\/\/gist\.github\.com[\w/\\]+)\s(\w+)\s?\[([\w.-]+)\](.*)\n/g
    if (!/imprint|about-us|authors/.test(file._id) && file._id.endsWith('.md')) {
      const matches = [...file.body.matchAll(regex)]
      matches.forEach(async (match) => {
        const gist = await ofetch(`https://api.github.com/gists/${parseFilename(match[1], { strict: false })}`, { parseResponse: JSON.parse })
        const re = new RegExp(match[0].replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gm')
        const replacedContent = `\`\`\`${match[2]} [${match[3]}]${match[4]}\n${gist.files[match[3]].content}\n\`\`\``
        file.body = file.body.replace(re, replacedContent)
        console.log(file.body)
      })
    }
  })
}) */
