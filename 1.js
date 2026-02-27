require("dotenv").config();
const { Client, RichPresence } = require("discord.js-selfbot-v13");
const { HttpsProxyAgent } = require("https-proxy-agent");
const chalk = require("chalk");

// Đọc danh sách token và proxy từ .env
const rawData = process.env.DISCORD_TOKENS || "";
const accounts = rawData
    .split("\n")
    .map(line => line.replace(/"/g, "").trim())
    .filter(line => line.includes("|")); 

const STREAM_URL = "https://twitch.tv/tz_016z";

console.log(chalk.blue.bold(`🚀 Hệ thống khởi chạy ${accounts.length} tài khoản (Giờ hiển thị: Hệ thống - 1h)...`));

function startAccount(data, index) {
    const [token, proxyUrl] = data.split("|");
    
    // Cấu hình Proxy HTTP
    const agent = new HttpsProxyAgent(proxyUrl.trim());
    
    const client = new Client({
        checkUpdate: false,
        http: { agent: agent }
    });

    const startTime = Date.now();

    function updateRPC() {
        const now = new Date();
        
        // --- ĐOẠN CODE TRỪ 1 GIỜ ---
        now.setHours(now.getHours() - 1); 

        const time = now.toLocaleTimeString("vi-VN", { hour12: false });
        const date = now.toLocaleDateString("vi-VN");

        const presence = new RichPresence(client)
            .setApplicationId("1475505964131155978")
            .setType("STREAMING")
            .setURL(STREAM_URL)
            .setName("tz_016z")
            .setDetails(`🕒 ${time} • ${date}`) // Hiển thị giờ đã trừ
            .setState("ngu🌸")
            .setStartTimestamp(startTime - 3600000) // Trừ 1 giờ ở Timer cho khớp Details
            .setAssetsLargeImage("https://cdn.discordapp.com/attachments/1465700054244397079/1476218827581952050/backClassroom.jpg?ex=69a24dab&is=69a0fc2b&hm=1038f69f7c0c90d1ff539d55405fd17cfcb0f4756a938a1cb1aaa1d5125d9c2d")
            .setAssetsLargeText(`https://zyo.lol/tz_016z`)
            .addButton("YouTube", "https://youtu.be/dQw4w9WgXcQ")
            .addButton("Discord", "https://discord.gg/JdGwZS5Xwb");

        client.user.setPresence({ activities: [presence] });
    }

    client.on("ready", () => {
        console.log(chalk.green(`✅ [Acc ${index + 1}] Online: ${client.user.tag}`));
        console.log(chalk.gray(`   └─ Proxy: ${proxyUrl}`));
        updateRPC();
        setInterval(updateRPC, 10000); 
    });

    client.login(token.trim()).catch(err => {
        console.error(chalk.red(`❌ [Acc ${index + 1}] Lỗi kết nối (Proxy die hoặc Token sai)`));
    });
}

// Chạy dàn nick, mỗi nick cách nhau 3 giây
accounts.forEach((data, index) => {
    setTimeout(() => {
        startAccount(data, index);
    }, index * 3000);
});
