import QRCode from 'qrcode'

/**
 * 生成二维码
 * @param {string} text - 需要编码的文本或URL
 * @param {Object} options - 可选配置
 * @param {number} [options.width=200] - 二维码宽度（像素）
 * @param {number} [options.margin=2] - 边距（模块数）
 * @param {string} [options.errorCorrectionLevel='M'] - 容错级别 'L','M','Q','H'
 * @param {string} [options.colorDark='#000000'] - 深色模块颜色
 * @param {string} [options.colorLight='#ffffff'] - 浅色模块颜色
 * @returns {Promise<HTMLCanvasElement>} - 返回 Canvas 元素
 */
export async function generateQRCode(text, options = {}) {
  if (!text) {
    throw new Error('二维码内容不能为空')
  }

  const canvas = document.createElement('canvas')
  const opts = {
    width: options.width || 200,
    margin: options.margin || 2,
    errorCorrectionLevel: options.errorCorrectionLevel || 'M',
    color: {
      dark: options.colorDark || '#000000',
      light: options.colorLight || '#ffffff'
    }
  }

  await QRCode.toCanvas(canvas, text, opts)
  return canvas
}

/**
 * 生成二维码并返回 DataURL（用于 img 标签）
 * @param {string} text - 需要编码的文本
 * @param {Object} options - 同 generateQRCode 选项
 * @returns {Promise<string>} - 返回 data:image/png;base64,...
 */
export async function getQRCodeDataURL(text, options = {}) {
  const canvas = await generateQRCode(text, options)
  return canvas.toDataURL('image/png')
}