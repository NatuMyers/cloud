const dust = require('dustjs-linkedin')
const hljs = require('highlight.js')
const marked = require('marked')
const slugify = require('slugify')

/*
* More info: https://github.com/chjj/marked/blob/master/README.md
*/
marked.setOptions({
  gfm: true,
  tables: true,
  breaks: true,
  smartLists: false,
  smartypants: true,
  sanitize: false
})

/*
* Returns the markdown content formatted as HTML
*/
dust.helpers.markdown = function(chunk, context, bodies, params) {
  if (bodies.block) {
    return chunk.capture(bodies.block, context, function(string, chunk) {
      var renderer = new marked.Renderer()
      
      // Clickable anchor headings
      if (params.anchors) {
        renderer.heading = function (text, level) {
          var escapedText = slugify(text.replace(/amp;/, ''), { lower: true })
          return `<h${level} class="anchor"><a name="${escapedText}" class="anchor__link" href="#${escapedText}">🔗</a>${text}</h${level}>`
        }
      }

      // Highlight code
      if (params.highlight) {
        chunk.end(marked(string, {
          renderer: renderer,
          highlight: code => {
            return hljs.highlightAuto(code).value
          }
        }))
      } else {
        chunk.end(marked(string))
      }
    })
  }

  return chunk
}

/*
* Returns the markdown content formatted as HTML, without wrapping p tags
*/
dust.helpers.soberMarkdown = function(chunk, context, bodies, params) {
  if (bodies.block) {
    return chunk.capture(bodies.block, context, function(string, chunk) {
      var md = marked(string)

      // Replace </p><p> with <br>
      var str = md.replace(/<\/p><p[^>]*>/igm, '<br>')

      // Remove wrapping <p></p> tags
      str = str.replace(/<p[^>]*>(.*?)<\/p>/igm, "$1")

      chunk.end(str)
    })
  }
  return chunk
}