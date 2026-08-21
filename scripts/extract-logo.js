const sharp = require('sharp')

// Chroma-keys a near-uniform light background to transparent, with a soft
// falloff near edges to preserve anti-aliasing instead of leaving hard jaggies.
async function removeBackground(inputPath, outputPath, bg = [254, 253, 251], threshold = 40) {
  const { data, info } = await sharp(inputPath).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const { width, height, channels } = info

  for (let i = 0; i < data.length; i += channels) {
    const r = data[i], g = data[i + 1], b = data[i + 2]
    const dist = Math.sqrt((r - bg[0]) ** 2 + (g - bg[1]) ** 2 + (b - bg[2]) ** 2)
    const alphaFraction = Math.max(0, Math.min(1, dist / threshold))
    data[i + 3] = Math.min(data[i + 3], Math.round(alphaFraction * 255))

    // Un-blend semi-transparent edge pixels from the background so they
    // don't carry a residual white halo when composited elsewhere.
    if (alphaFraction > 0 && alphaFraction < 1) {
      data[i] = Math.max(0, Math.min(255, Math.round((r - (1 - alphaFraction) * bg[0]) / alphaFraction)))
      data[i + 1] = Math.max(0, Math.min(255, Math.round((g - (1 - alphaFraction) * bg[1]) / alphaFraction)))
      data[i + 2] = Math.max(0, Math.min(255, Math.round((b - (1 - alphaFraction) * bg[2]) / alphaFraction)))
    }
  }

  await sharp(data, { raw: { width, height, channels } }).png().toFile(outputPath)
}

module.exports = { removeBackground }

if (require.main === module) {
  const [, , input, output, bgArg, thresholdArg] = process.argv
  const bg = bgArg ? bgArg.split(',').map(Number) : undefined
  const threshold = thresholdArg ? Number(thresholdArg) : undefined
  removeBackground(input, output, bg, threshold).then(() => console.log('done:', output))
}
