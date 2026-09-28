<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bài tập 2 - Gọi API Node-RED</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 30px; line-height: 1.6; }
        button { padding: 10px 15px; background: #28a745; color: white; border: none; cursor: pointer; font-size: 16px; border-radius: 4px; }
        button:hover { background: #218838; }
        table { border-collapse: collapse; width: 50%; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
    </style>
</head>
<body>

    <h2>Danh sách sinh viên (Lấy từ API Node-RED)</h2>
    <button onclick="fetchData()">Tải dữ liệu API</button>

    <p id="status-msg"></p>

    <table id="result-table" style="display:none;">
        <thead>
            <tr>
                <th>Tên Sinh Viên</th>
                <th>Số Tiền</th>
            </tr>
        </thead>
        <tbody id="data-body"></tbody>
    </table>

    <script>
        async function fetchData() {
            const msgElement = document.getElementById('status-msg');
            const tableElement = document.getElementById('result-table');
            const dataBody = document.getElementById('data-body');

            msgElement.innerText = "Đang tải dữ liệu...";

            try {
                // Gọi API thông qua Nginx proxy
                const response = await fetch('/api/tacke');
                const data = await response.json();

                if (data.ok === 1) {
                    msgElement.innerText = "Trạng thái: " + data.msg;
                    dataBody.innerHTML = ""; // Xóa dữ liệu cũ

                    // Đổ dữ liệu vào bảng
                    data.dssv.forEach(sv => {
                        const row = `<tr>
                            <td>${sv.name}</td>
                            <td>${sv.money}</td>
                        </tr>`;
                        dataBody.innerHTML += row;
                    });

                    tableElement.style.display = "table";
                } else {
                    msgElement.innerText = "Lỗi phản hồi từ API!";
                }
            } catch (error) {
                console.error("Lỗi:", error);
                msgElement.innerText = "Không thể kết nối đến API!";
            }
        }
    </script>
</body>
</html>