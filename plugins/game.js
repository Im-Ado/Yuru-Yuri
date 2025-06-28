import ytSearch from 'yt-search'
import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`*🧩 Uso correcto:*\n\n${usedPrefix + command} nombre de la canción o video`)

  try {
    await conn.sendMessage(m.chat, { react: { text: '🔍', key: m.key } })

    const searchResult = await ytSearch(text)
    const video = searchResult.videos.length > 0 ? searchResult.videos[0] : null

    if (!video) return m.reply('❌ No encontré ningún video con ese nombre')

    const cleanUrl = `https://youtu.be/${video.videoId}`

    const api = `https://theadonix-api.vercel.app/api/ytmp4?url=${encodeURIComponent(cleanUrl)}`

    const res = await fetch(api)
    const textResponse = await res.text()

    // Aquí imprimimos para ver qué está llegando
    console.log('[play2 API response]', textResponse)

    // Intentamos parsear, si falla ahí está el error
    let json
    try {
      json = JSON.parse(textResponse)
    } catch (err) {
      return m.reply(`❌ La API no devolvió JSON válido:\n\n${textResponse}`)
    }

    if (json?.status !== 200 || !json?.result) {
      return m.reply(`❌ Error al procesar el video\n${json?.mensaje || 'Prueba con otro nombre'}`)
    }

    const { title, video: videoFile, filename, quality, size } = json.result

    await conn.sendMessage(m.chat, { react: { text: '📥', key: m.key } })

    await conn.sendFile(m.chat, videoFile, filename, `✧ *${title}*\n❀ Calidad: ${quality}\n✐ Tamaño aprox: ${size}`, m)

  } catch (e) {
    console.error('[play2]', e)
    m.reply(`❌ Error al buscar o descargar\n\n${e.message}`)
  }
}

handler.help = ['play2 <nombre>']
handler.tags = ['downloader']
handler.command = ['play2']

export default handler