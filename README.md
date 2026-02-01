# IP Calculator

Công cụ tính toán và chuyển đổi địa chỉ IP đơn giản, chạy hoàn toàn trên trình duyệt (HTML + CSS + JavaScript).  
Hỗ trợ dark theme, responsive (tốt trên mobile), và giao diện dạng tab dễ sử dụng.

## Tính năng chính

- **IPv4 → IPv6 Mapped** (ví dụ: 192.168.1.1 → ::ffff:c0a8:0101)
- **IPv6 Mapped → IPv4** (hỗ trợ cả dạng nén `::ffff:c0a8:0101` và dạng đầy đủ)
- **Chuyển đổi Subnet Mask** giữa dạng CIDR (/n) và dotted decimal (255.255.255.0)
- **Tính toán chia subnet IPv4** (nhập số lượng subnet mong muốn, hiển thị network, broadcast, range host, số host khả dụng)

## Demo
https://mãsiêu.vn/github/ip-calculator

Hoặc mở file `index.html` bằng trình duyệt ngay trên máy tính/điện thoại.

## Cài đặt & Sử dụng cục bộ

1. Clone repository:
   ```bash
   git clone https://github.com/tedmosbyvn/ip-calculator.git
   cd ip-calculator
   ```
2. Mở file `index.html` bằng trình duyệt bất kỳ (Chrome, Firefox, Edge, Safari...).
Không cần cài đặt server, không cần npm/yarn — chạy 100% offline.

## Công nghệ sử dụng
- HTML5
- CSS3 (dark theme + responsive)
- Vanilla JavaScript (không framework)
- Mobile-first design

## Cấu trúc thư mục
```
ip-calculator/
├── index.html       # Trang chính + giao diện tab
├── styles.css       # Toàn bộ style (dark theme)
├── script.js        # Logic tính toán IP
└── README.md
```

## Đóng góp
Mời bạn fork và gửi Pull Request nếu muốn cải thiện:
- Thêm hỗ trợ IPv6 subnetting
- Thêm nút copy kết quả
- Thêm dark/light mode toggle
- Validate input realtime
- Thêm unit test cho các hàm JS
Mọi góp ý đều được chào đón!

## License
MIT License — tự do sử dụng, chỉnh sửa, phân phối.

Tạo bởi Grok theo ý tưởng của tôi
Cập nhật lần cuối: Tháng 2/2026
