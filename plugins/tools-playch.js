import fetch from 'node-fetch';

let handler = async (m, { conn, usedPrefix, command, text }) => {
  if (!text) return m.reply(`✐ Ingresa un texto para buscar en YouTube\n> *Ejemplo:* ${usedPrefix + command} ozuna`);

  try {
    let api = await (await fetch(`https://delirius-apiofc.vercel.app/search/ytsearch?q=${encodeURIComponent(text)}`)).json();
    if (!api.data || !api.data.length) return m.reply('❌ No se encontraron resultados para tu búsqueda.');

    let results = api.data[0];
    let txt = `*「✦」 ${results.title}*\n\n` +
              `> ✦ *Canal:* ${results.author?.name || 'Desconocido'}\n` +
              `> ⴵ *Duración:* ${results.duration || 'Desconocida'}\n` +
              `> ✰ *Vistas:* ${results.views || 'Desconocidas'}\n` +
              `> ✐ *Publicado:* ${results.publishedAt || 'Desconocida'}\n` +
              `> 🜸 *Link:* ${results.url || 'No disponible'}`;

    // Mandar info al privado del user
    let senderJid = m.sender;
    let img = results.image || null;

    if (img) {
      await conn.sendMessage(senderJid, { image: { url: img }, caption: txt }, { quoted: m });
    } else {
      await conn.sendMessage(senderJid, { text: txt }, { quoted: m });
    }

    // Descargar el audio desde Adonix API
    let api2 = await (await fetch(`https://theadonix-api.vercel.app/api/ytmp3?url=${encodeURIComponent(results.url)}`)).json();

    if (!api2.result || !api2.result.audio) {
      return m.reply('❌ No se pudo obtener el audio del video.');
    }

    // Mandar audio al canal
    let canal = '120363420941524030@newsletter';
    try {
      await conn.sendMessage(canal, {
        audio: { url: api2.result.audio },
        mimetype: 'audio/mpeg',
        ptt: true
      });

      await m.reply('✅ Se envió el audio al canal correctamente.');
    } catch (err) {
      await m.reply('❌ Falló al enviar el audio al canal.');
    }

  } catch (e) {
    m.reply(`❌ Error: ${e.message}`);
    await m.react('✖️');
  }
};

handler.command = ['playch'];
export default handler;