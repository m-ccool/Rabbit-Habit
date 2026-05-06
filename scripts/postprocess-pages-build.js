const fs = require("fs")
const path = require("path")

const basePath = "/Rabbit-Habit"
const outputDir = path.join(__dirname, "..", "web-build")
const indexPath = path.join(outputDir, "index.html")
const manifestPath = path.join(outputDir, "manifest.json")
const notFoundPath = path.join(outputDir, "404.html")

const prefixAbsoluteAssetUrls = (html) =>
  html.replace(/(href|src)="\/(?!Rabbit-Habit\/)/g, `$1="${basePath}/`)

const updateManifest = (manifest) => {
  const nextManifest = { ...manifest }
  nextManifest.start_url = `${basePath}/?utm_source=web_app_manifest`
  nextManifest.scope = `${basePath}/`
  nextManifest.icons = (manifest.icons ?? []).map((icon) => ({
    ...icon,
    src: icon.src.startsWith(basePath) ? icon.src : `${basePath}${icon.src}`,
  }))
  return nextManifest
}

if (!fs.existsSync(indexPath)) {
  throw new Error(`Missing build output: ${indexPath}`)
}

const indexHtml = fs.readFileSync(indexPath, "utf8")
const updatedIndexHtml = prefixAbsoluteAssetUrls(indexHtml)
fs.writeFileSync(indexPath, updatedIndexHtml)
fs.writeFileSync(notFoundPath, updatedIndexHtml)

if (fs.existsSync(manifestPath)) {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"))
  fs.writeFileSync(manifestPath, JSON.stringify(updateManifest(manifest), null, 2))
}