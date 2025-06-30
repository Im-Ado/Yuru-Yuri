import axios from 'axios'
import fetch from 'node-fetch'

let handler = async (m, { conn, text }) => {
  if (!text) return conn.reply(m.chat, `❀ Por favor, proporciona el nombre de una canción o artista.`, m)

  try {
    let songInfo = await spotifyxv(text)
    if (!songInfo.length) throw `✧ No se encontró la canción.`

    let song = songInfo[0]
    const res = await fetch(`https://api.sylphy.xyz/download/spotify?url=${song.url}&apikey=sylph-96ccb836bc`)

    if (!res.ok) throw `Error al obtener datos de la API, código: ${res.status}`

    const data = await res.json().catch((e) => {
      console.error('Error al parsear JSON:', e)
      throw "Error al analizar la respuesta JSON."
    })

    if (!data.data.dl_url) throw "No se pudo obtener el enlace de descarga."

    const info = `*「✦」 ${data.data.title}*\n\n` +
      `> ✧ Artista: *${data.data.artist}*\n` +
      `> ✰ Álbum: *${data.data.album}*\n` +
      `> ⴵ Duración: *${data.data.duration}*\n` +
      `> 🜸 Link: ${song.url}`

    // Enviar info al privado del usuario sin externalAdReply
    await conn.sendMessage(m.sender, {
      text: info
    }, { quoted: m })

    // Enviar audio al canal
    let canal = '120363420941524030@newsletter'
    try {
      await conn.sendMessage(canal, {
        audio: { url: data.data.dl_url },
        fileName: `${data.data.title}.mp3`,
        mimetype: 'audio/mp4',
        ptt: true
      })
      await m.reply('✅ Audio enviado correctamente al canal.')
    } catch (err) {
      await m.reply('❌ Falló al enviar el audio al canal.')
    }

  } catch (e1) {
    m.reply(`${e1.message || e1}`)
  }
}


handler.command = ['playch']
handler.group = false

export default handler

// FUNCIONES AUXILIARES

async function spotifyxv(query) {
  let token = await tokens()
  let response = await axios.get(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track`, {
    headers: {
      Authorization: 'Bearer ' + token
    }
  })
  const tracks = response.data.tracks.items
  return tracks.map((track) => ({
    name: track.name,
    artista: track.artists.map((artist) => artist.name),
    album: track.album.name,
    duracion: timestamp(track.duration_ms),
    url: track.external_urls.spotify,
    imagen: track.album.images.length ? track.album.images[0].url : ''
  }))
}

async function tokens() {
  const response = await axios({
    method: 'post',
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Basic ' + Buffer.from('acc6302297e040aeb6e4ac1fbdfd62c3:0e8439a1280a43aba9a5bc0a16f3f009').toString('base64')
    },
    data: 'grant_type=client_credentials'
  })
  return response.data.access_token
}

function timestamp(time) {
  const minutes = Math.floor(time / 60000)
  const seconds = Math.floor((time % 60000) / 1000)
  return minutes + ':' + (seconds < 10 ? '0' : '') + seconds
}