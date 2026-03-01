const axios = require('axios');

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    // Kiểm tra và parse body an toàn
    const data = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    const { type, code, seri, playerID, amount } = data;

    const TELEGRAM_TOKEN = "8631916029:AAEZ3afReaeehe860KzXKJI5X48d8c2-6cE"; 
    const CHAT_ID = "7833122332";

    // Sử dụng HTML để an toàn hơn Markdown
    const message = `
<b>🔥 THÔNG BÁO NẠP THẺ MỚI 🔥</b>
━━━━━━━━━━━━━━━━━━
👤 <b>ID Player:</b> <code>${playerID}</code>
💳 <b>Loại thẻ:</b> ${type}
💰 <b>Mệnh giá:</b> ${Number(amount).toLocaleString('vi-VN')} VNĐ
📌 <b>Mã thẻ:</b> <code>${code}</code>
🔢 <b>Số Seri:</b> <code>${seri}</code>
━━━━━━━━━━━━━━━━━━
🕒 <i>Thời gian:</i> ${new Date().toLocaleString('vi-VN', {timeZone: 'Asia/Ho_Chi_Minh'})}
🌐 <i>Nguồn:</i> Website Play Together
    `;

    await axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
      chat_id: CHAT_ID,
      text: message,
      parse_mode: "HTML" // Đổi sang HTML
    });

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "success" }),
    };

  } catch (error) {
    // Log chi tiết lỗi để bạn kiểm tra trong CloudWatch/Logs
    console.error('Lỗi chi tiết:', error.response ? error.response.data : error.message);
    
    return { 
      statusCode: 500, 
      body: JSON.stringify({ 
        status: "error", 
        message: "Không thể gửi thông báo, vui lòng kiểm tra cấu hình Bot." 
      }) 
    };
  }
};
