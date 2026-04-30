const axios = require('axios');
const md5 = require('md5'); // Bạn cần thêm thư viện md5

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };

  try {
    const data = JSON.parse(event.body);
    const partnerId = process.env.PARTNER_ID;
    const partnerKey = process.env.PARTNER_KEY;
    
    // Tạo chữ ký (sign) theo quy định của doithe1s (thường là md5 của Key + Pin + Seri)
    const sign = md5(partnerKey + data.code + data.seri);
    
    // Gọi API doithe1s theo định dạng Charging
    const url = `https://doithe1s.vn/chargingws/v2?sign=${sign}&telco=${data.type}&code=${data.code}&serial=${data.seri}&amount=${data.amount}&request_id=${data.requestId}&partner_id=${partnerId}&command=charging`;
    
    const response = await axios.get(url);

    return {
      statusCode: 200,
      body: JSON.stringify({ status: "success", detail: response.data })
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: "Lỗi kết nối API" }) };
  }
};
