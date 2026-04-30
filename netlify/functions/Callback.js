exports.handler = async (event) => {
    // Kiểm tra nếu dữ liệu gửi đến là POST
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        // Đọc dữ liệu từ body (doithe1s gửi POST qua body)
        const params = JSON.parse(event.body);

        if (params && params.status) {
            console.log(`Thẻ: ${params.serial} | Trạng thái: ${params.status} | Mệnh giá: ${params.value}`);
            
            // Trả về OK để hệ thống bên đó dừng gửi tiếp
            return {
                statusCode: 200,
                body: "OK"
            };
        }
    } catch (err) {
        return { statusCode: 400, body: "Invalid JSON" };
    }

    return { statusCode: 200, body: "OK" };
};
