exports.handler = async (event) => {
    // doithe1s gửi dữ liệu qua phương thức GET
    const params = event.queryStringParameters;

    // Kiểm tra nếu có dữ liệu gửi về
    if (params && params.status) {
        const status = params.status; // Trạng thái thẻ (1 là thành công, 2 là sai mệnh giá, 3 là thẻ lỗi)
        const code = params.code;     // Mã thẻ
        const serial = params.serial; // Số seri
        const requestId = params.request_id; // ID bạn đã gửi đi
        const value = params.value;   // Mệnh giá thực của thẻ

        console.log(`Nhận callback: Thẻ ${serial} - Trạng thái: ${status} - Mệnh giá: ${value}`);

        // Ở đây bạn có thể viết thêm code để cập nhật vào Firebase nếu muốn
        // Nhưng hiện tại, mục tiêu chính là để hệ thống doithe1s xác nhận đã gửi xong
        
        return {
            statusCode: 200,
            body: "OK" // Phải trả về OK để doithe1s biết bạn đã nhận được tin
        };
    }

    return {
        statusCode: 400,
        body: "No data received"
    };
