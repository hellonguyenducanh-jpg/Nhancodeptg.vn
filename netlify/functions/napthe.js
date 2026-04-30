const axios = require('axios');
const md5 = require('md5');

exports.handler = async (event) => {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        const data = JSON.parse(event.body);
        
        // Thông tin lấy từ Environment Variables trên Netlify
        // PARTNER_ID mới: 72845595642
        // PARTNER_KEY mới: a2beb524331cd657fbc016fcd6cc21c9
        const PARTNER_ID = process.env.PARTNER_ID;
        const PARTNER_KEY = process.env.PARTNER_KEY;
        const API_URL = "https://doithe1s.vn/chargingws/v2";

        const request_id = Math.floor(Math.random() * 100000000).toString();
        const sign = md5(PARTNER_KEY + data.pin + data.serial);

        // Gửi yêu cầu nạp thẻ sang doithe1s
        const response = await axios.get(API_URL, {
            params: {
                telco: data.telco,
                code: data.pin,
                serial: data.serial,
                amount: data.amount,
                request_id: request_id,
                partner_id: PARTNER_ID,
                sign: sign,
                command: 'charging'
            }
        });

        return {
            statusCode: 200,
            body: JSON.stringify(response.data)
        };

    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Lỗi kết nối hệ thống", error: error.message })
        };
    }
};
