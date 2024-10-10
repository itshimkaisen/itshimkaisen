require('dotenv').config();
const express = require('express');
const { Client } = require('discord.js-selfbot-v13');
const { joinVoiceChannel } = require('@discordjs/voice');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PORT = 3000;
const clients = {}; // لحفظ العملاء

app.get('/', (req, res) => {
    res.send(`
        <h1>تسجيل التوكن وإيدي الروم</h1>
        <form action="/add" method="post">
            <input type="text" name="token" placeholder="ادخل توكن الحساب" required>
            <input type="text" name="roomId" placeholder="ادخل إيدي الروم" required>
            <button type="submit">إضافة</button>
        </form>
    `);
});

// دالة للتحقق من صحة التوكن
function isValidToken(token) {
    return typeof token === 'string' && token.length > 0; // يمكن تحسين هذه الدالة إذا كان هناك معيار محدد للتوكن
}

// دالة للتحقق من صحة ID الروم
async function isValidVoiceChannel(client, channelId) {
    try {
        const channel = await client.channels.fetch(channelId);
        return channel && channel.type === 'GUILD_VOICE' && channel.permissionsFor(client.user).has('CONNECT');
    } catch (error) {
        return false;
    }
}

app.post('/add', async (req, res) => {
    const { token, roomId } = req.body;

    // التحقق من صحة التوكن
    if (!isValidToken(token)) {
        return res.send('**التوكن الذي ادخلته خطأ او يوجد فيه في البداية والنهاية " " **');
    }

    // إنشاء عميل جديد
    const client = new Client({ checkUpdate: false, ws: { properties: { $browser: "Discord Client" } } });
    clients[token] = client; // حفظ العميل في الكائن

    client.once('ready', async () => {
        console.log(`Logged in as ${client.user.tag}`);

        // التحقق من صحة إيدي الروم
        if (await isValidVoiceChannel(client, roomId)) {
            const voiceChannel = client.channels.cache.get(roomId);

            // الانضمام إلى القناة الصوتية بدون deaf أو mute
            joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: voiceChannel.guild.id,
                adapterCreator: voiceChannel.guild.voiceAdapterCreator,
                selfMute: false,
                selfDeaf: false
            });
            console.log(`Joined voice channel: ${voiceChannel.name} without mute or deafen`);
            res.send(`تم الانضمام إلى الروم الصوتي: ${voiceChannel.name}`);
        } else {
            res.send('**ايدي الروم الذي ادخلته خطأ او مقفل**');
        }
    });

    // تسجيل الدخول
    client.login(token).catch(() => {
        res.send('**التوكن الذي ادخلته خطأ او يوجد فيه في البداية والنهاية " " **');
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
