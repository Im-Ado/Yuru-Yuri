import axios from 'axios'
import fs from 'fs'

let handler = async (m, { conn, usedPrefix, command, text }) => {
  if (!text) return conn.reply(m.chat, `
*Necesito que me digas el nombre del video de TikTok que querés buscar*

Ejemplo:
${usedPrefix + command} baile divertido
`.trim(), m, rcanal)

  await m.react('🕓')

  let img = './storage/img/menu.jpg'

  try {
    const { data } = await axios.get(`https://apis-starlights-team.koyeb.app/starlight/tiktoksearch?text=${encodeURIComponent(text)}`)

    const results = data?.data || []

    if (results.length === 0) {
      return conn.reply(m.chat, '❌ No encontré ningún video con ese nombre, probá con otra búsqueda.', m, rcanal)
    }

    let txt = `
╭───✦ *Resultados TikTok* ✦───⬣
┃
`

    for (let i = 0; i < Math.min(results.length, 15); i++) {
      const video = results[i]
      txt += `
*${i + 1}.* 🎬 ${video.title || 'Sin título'}
🔗 ${video.url}
─────────────────────────
`
    }

    txt += `
╰─────────────✦
  
> ✦ 𝖱𝖾𝗌𝗎𝗅𝗍𝗌 𝖡𝗒 *YuruYuri*
`

    const isURL = /^https?:\/\//i.test(img)
    const imageContent = isURL ? { image: { url: img } } : { image: fs.readFileSync(img) }

    await conn.sendMessage(m.chat, {
      ...imageContent,
      caption: txt.trim(),
      mentionedJid: conn.parseMention(txt),
      ...rcanal
    }, { quoted: m })

    await m.react('✅')
  } catch (e) {
    console.error(e)
    await conn.reply(m.chat, '❌ Error buscando TikTok, intentá luego.', m, rcanal)
    await m.react('✖️')
  }
}

handler.tags = ['search']
handler.help = ['tiktoksearch']
handler.command = ['tiktoksearch', 'tiktoks', 'tts']

export default handler