import fetch from 'node-fetch'

let handler = async (m, { conn, command, args }) => {
if (!args[0]) return conn.reply(m.chat, `☁︎ Por favor, ingrese el Link de una página.`, m)
try {
await m.react(rwait)
conn.reply(m.chat, `> Buscando su información....`, m)
let ss = await (await fetch(`https://image.thum.io/get/fullpage/${args[0]}`)).buffer()
conn.sendFile(m.chat, ss, 'error.png', args[0], fkontak)
await m.react(done)
} catch {
return conn.reply(m.chat, `${msm} Ocurrió un error.`, m)
await m.react(error)}}

handler.help = ['ss < página web >']
handler.tags = ['tools']
handler.command = ['ssweb', 'ss']

export default handler