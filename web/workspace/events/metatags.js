const marked = require('marked')

const Event = function (req, res, data, callback) {
  const meta = {}

  meta.canonical = `${req.protocol}://${req.headers.host}${data.pathNoLang}`
  meta.url = `${req.protocol}://${req.headers.host}${req.url}`
  meta.image = `${req.protocol}://${req.headers.host}/assets/products/dadi-og.jpg`

  // -------------------------
  // Root pages
  if (data.hasResults('pages')) {
    const page = data.pages.results[0]

    meta.title = page.metaTitle ? page.metaTitle.trim() : page.title.trim()
    meta.description = page.metaDescription ? page.metaDescription.trim() : page.excerpt.trim()
  }

  // -------------------------
  // Articles
  if (data.hasResults('articles') && data.page.key === 'article') {
    const article = data.articles.results[0]

    meta.title = article.metaTitle ? article.metaTitle.trim() : article.title.trim()
    meta.description = article.metaDescription ? article.metaDescription.trim() : article.excerpt.trim()
    if (article.author && article.author[0] && article.author[0].twitter) meta.authorTwitter = article.author[0].twitter

    // get first image
    if (article.body) {
      const images = article.body.match(/!\[[^\]]+\]\([^)]+\)/)

      if (images && images[0]) {
        let image = marked(images[0])
        image = image.match(/src="(.+?)"/)[1]

        // Is it a local image?
        if (!image.startsWith('http')) {
          image = `${req.protocol}://${req.headers.host}${image}`
        }

        // Put in object
        meta.image = image
      }
    }
  }

  // -------------------------
  // Web services
  if (data.hasResults('web-service') && data.page.key === 'web-services') {
    const app = data['web-service'].results[0]

    meta.title = `DADI ${app.name}`
    meta.description = app.overview.trim()
    meta.image = `${req.protocol}://${req.headers.host}/assets/products/dadi-${app.slug}-og.jpg`
  }

  // Put in page
  data.page.meta = meta

  callback()
}

module.exports = function (req, res, data, callback) {
  return new Event(req, res, data, callback)
}
