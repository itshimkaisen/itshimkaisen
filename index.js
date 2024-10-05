require('dotenv').config();  // تحميل المتغيرات من ملف .env
const { Client } = require('discord.js-selfbot-v13');
const { joinVoiceChannel } = require('@discordjs/voice');

// إنشاء سيلف بوت باستخدام حسابك الشخصي
const client = new Client({
    checkUpdate: false,  // لتعطيل التحقق من التحديثات
    ws: { properties: { $browser: "Discord Client" } }  // لجعل الحالة تظهر على أنها من الجوال
});

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);

    // تحديد ID الخادم والقناة الصوتية
    const guildId = '1109636583642103903';  // ضع هنا ID السيرفر
    const voiceChannelId = '1292201547249225728';  // ضع هنا ID القناة الصوتية

    const guild = client.guilds.cache.get(guildId);
    const voiceChannel = guild.channels.cache.get(voiceChannelId);

    // الانضمام إلى القناة الصوتية بدون deaf أو mute
    if (voiceChannel && voiceChannel.isVoice()) {
        joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: guild.id,
            adapterCreator: guild.voiceAdapterCreator,
            selfMute: false,  // عدم تفعيل mute
            selfDeaf: false   // عدم تفعيل deafen
        });
        console.log(`Joined voice channel: ${voiceChannel.name} without mute or deafen`);
    } else {
        console.error('Voice channel not found or invalid.');
    }
});

// تسجيل الدخول باستخدام التوكن من ملف .env
client.login(process.env.DISCORD_TOKEN);  // تحميل التوكن من .env
