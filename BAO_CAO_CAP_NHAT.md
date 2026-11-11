# Báo cáo cập nhật HUD và 4 tầng sản phẩm

**Ngày báo cáo:** 11/11/2026
**Phạm vi:** Thay nội dung bốn domain đầu bằng mô hình bốn tầng; nối dữ liệu HUD trái/phải và modules vào giao diện; giữ dữ liệu domain 05–06.

## Tóm tắt

- Bốn thẻ đầu hiện là **Tầng 1 — Nền tảng**, **Tầng 2 — Công cụ**, **Tầng 3 — Ứng dụng**, **Tầng 4 — Tri thức**.
- Mỗi tầng có 5 mục HUD trái, 5 mục HUD phải và 5 modules.
- Hai domain cuối vẫn là `COMBINATORIAL R&D LAB` và `ADOLSOFT ACADEMY SOP`; chúng tiếp tục dùng dữ liệu satellite legacy.
- `label` được đưa lên texture 3D. Cỡ tiêu đề và metric tự giảm khi chuỗi vượt chiều rộng dành cho chúng.
- Nội dung chỉ phản ánh dữ liệu khai báo trong mã nguồn. Các số liệu ROI, hiệu năng và mục tiêu chưa được kiểm chứng độc lập.

## Chi tiết bốn tầng

### Tầng 1 — Nền tảng

- **ID:** `tang-1-nen-tang` · **Ngày:** `2026.05.15`
- **Phụ đề:** Hệ điều hành, AI Local & Hạ tầng bảo mật
- **Danh mục:** FOUNDATION LAYER — OS & INFRASTRUCTURE
- **Nhãn:** INFRASTRUCTURE KERNEL
- **Metric:** ARCH LINUX | 100% OFFLINE | RUST CORE
- **Tags:** `adolos`, `arch_linux`, `ai_local`, `zero_cloud`, `rust_core`
- **Mô tả:** Tầng móng của toàn hệ sinh thái — hệ điều hành AdolOS nền Arch Linux, USB cài AI Local tự động, giao diện tùy biến, dịch vụ cài từ xa và lớp an ninh mạng bảo vệ từ gốc. Mọi sản phẩm khác đều chạy trên tầng này.
- **Thông số:**
    - AdolOS nền Arch Linux: cắm USB là chạy, AI Local tích hợp, nâng giá trị laptop cũ 2–3 lần.
    - An ninh mạng tích hợp: hardening OS, bảo vệ AI Local, mã hóa dữ liệu, ứng cứu sự cố.
    - Rust Core Development: công nghệ lõi hiệu năng cao cho AdolOS, bảo mật và AI runtime.
- **Tác động ROI khai báo:** Tiết kiệm 100% license OS + Office; nâng giá trị laptop cũ 2–3 lần; dữ liệu không rời máy.
- **HUD trái:** OS CORE — ADOLOS — Hệ điều hành Arch Linux; USB SETUP — AI LOCAL — Cắm là chạy, tự động cài; CUSTOM UI — LINUX UI — Giao diện tùy biến; 2 slot trống.
- **HUD phải:** REMOTE — SETUP + DECOR — Cài từ xa, trang trí; SECURITY — CYBER SHIELD — An ninh mạng bảo vệ; CORE — RUST DEV — Công nghệ lõi an toàn; 2 slot trống.
- **Modules:** BLUEPRINT (`primary`), LIVE USB (`danger`), RT PATCH (`danger`), REMOTE (`warning`), AIR-GAP (`info`).

### Tầng 2 — Công cụ

- **ID:** `tang-2-cong-cu` · **Ngày:** `2026.07.22`
- **Phụ đề:** Bộ công cụ làm việc hằng ngày & tài chính số
- **Danh mục:** TOOL LAYER — PRODUCTIVITY & FINANCE
- **Nhãn:** PRODUCTIVITY TOOLCHAIN
- **Metric:** AI-INTEGRATED | BANK TOKEN | NO LICENSE
- **Tags:** `office_adol`, `tool_ppt`, `bank_token`, `ai_mouse`, `smart_compression`
- **Mô tả:** Tầng đồ nghề — bộ Office Adol độc quyền tích hợp AI Agent, Tool hỗ trợ PPT, Bank Token quản lý chi phí AI, AI Chuột điều khiển agent bằng cử chỉ, Smart Compression nén dữ liệu thông minh. Dùng chung cho mọi ứng dụng tầng 3.
- **Thông số:**
    - Bộ Office Adol: soạn thảo, bảng tính, trình chiếu, quản lý file, mẫu biểu — tích hợp AI Agent.
    - Bank Token: ví credit nội bộ, phân quyền chi tiêu theo phòng ban, báo cáo chi phí AI realtime.
    - AI Chuột + Smart Compression: điều khiển AI bằng cử chỉ, nén dữ liệu tiết kiệm 40–70% storage.
- **Tác động ROI khai báo:** Giảm 100% license Office nước ngoài; kiểm soát 100% chi phí AI; tăng 40% tốc độ xử lý văn bản.
- **HUD trái:** OFFICE — ADOL SUITE — Bộ Office độc quyền; PPT TOOL — SLIDE MAKER — Hỗ trợ tạo slide tự động; FINANCE — BANK TOKEN — Ví credit nội bộ; 2 slot trống.
- **HUD phải:** HARDWARE — AI CHUỘT — Ngoại vi điều khiển AI; DATA — SMART COMPRESS — Nén dữ liệu AI giải mã; 3 slot trống.
- **Modules:** BLUEPRINT (`primary`), OFFICE (`info`), TOKEN (`success`), MOUSE (`warning`), SMART ZIP (`info`).

### Tầng 3 — Ứng dụng

- **ID:** `tang-3-ung-dung` · **Ngày:** `2026.09.10`
- **Phụ đề:** Giải pháp nghiệp vụ & AI hành động thật
- **Danh mục:** APPLICATION LAYER — BUSINESS SOLUTIONS
- **Nhãn:** BUSINESS APPLICATION CORE
- **Metric:** AI AGENT | 24/7 OPS | END-USER READY
- **Tags:** `restaurant_erp`, `ai_agent`, `startup_ops`, `fake_ai_link`, `design_ai`, `sound_ai`
- **Mô tả:** Tầng sản phẩm bán ra — Web/App quản lý nhà hàng QR menu, Gói AI Agent làm việc, AI Agent Startup Ops vận hành 24/7, Fake AI Link Detector, phần mềm Design AI phân tích ảnh, AI tạo hiệu ứng âm thanh. Mỗi app giải quyết một bài toán cụ thể, tạo doanh thu trực tiếp.
- **Thông số:**
    - Web/App quản lý quán: QR menu thay menu giấy, thu ngân realtime, kho, báo cáo, đa chi nhánh.
    - AI Agent: tự đăng bài, trả lời tin nhắn, điều khiển thiết bị từ xa — vận hành startup 24/7.
    - Design AI + Sound AI: phân tích ảnh tự tái tạo thiết kế, tự thiết kế hiệu ứng âm thanh thông minh.
- **Tác động ROI khai báo:** Giảm 50–70% nhân sự vận hành; tiết kiệm 80% thời gian thu thập nội dung; tăng tốc giờ cao điểm 2–3 lần.
- **HUD trái:** F&B ERP — RESTAURANT — Quản lý quán QR Menu; AI OPS — STARTUP AGENT — Vận hành tự động 24/7; AI AGENT — LÀM VIỆC — Agent văn phòng, nội dung; 2 slot trống.
- **HUD phải:** CONTENT — FAKE AI LINK — Bắt link đa nền tảng; DESIGN — DESIGN AI — Tách & tái tạo thiết kế; AUDIO — SOUND AI — Tạo hiệu ứng âm thanh; 2 slot trống.
- **Modules:** BLUEPRINT (`primary`), ERP POS (`success`), AI AGENT (`danger`), DESIGN AI (`info`), SOUND AI (`warning`).

### Tầng 4 — Tri thức

- **ID:** `tang-4-tri-thuc` · **Ngày:** `2026.11.05`
- **Phụ đề:** Đào tạo kỹ năng số & chuyển giao tri thức
- **Danh mục:** KNOWLEDGE LAYER — ACADEMY & SOP
- **Nhãn:** KNOWLEDGE ECOSYSTEM
- **Metric:** PROMPT SKILL | PPT MASTERY | 15,000+ TARGET
- **Tags:** `academy`, `prompt_skill`, `ppt_course`, `sop_transfer`, `mentorship`
- **Mô tả:** Tầng tri thức — khóa học PPT chuyên nghiệp, khóa Viết Prompt + Kỹ năng + Công cụ Work, mentorship 1-1 cùng Founder. Biến người dùng thành chuyên gia, khai thác tối đa tầng 1–2–3, tạo cộng đồng trung thành và giảm chi phí hỗ trợ.
- **Thông số:**
    - Khóa PPT: cấu trúc slide thuyết phục, kỹ thuật thiết kế, làm slide nhanh với Tool PPT, makeover thật.
    - Khóa Prompt + Skill + Công cụ Work: 3 trụ thực chiến — prompt, kỹ năng làm việc với AI, thực hành hệ sinh thái.
    - Mentorship 1-1 cùng Founder & Ban cố vấn; chuẩn hóa tay nghề nhân sự mới chỉ sau 1 buổi.
- **Tác động ROI khai báo:** Chuẩn hóa tay nghề nhân sự mới sau 1 buổi; biến người dùng thành đại sứ hệ sinh thái.
- **HUD trái:** PPT COURSE — MASTERY — Kỹ năng thiết kế slide; AI SKILL — PROMPT — Viết Prompt & dùng Tool; COACHING — MENTORSHIP — Kèm cặp 1-1 cùng Founder; 2 slot trống.
- **HUD phải:** SOP — TRANSFER — Chuyển giao quy trình xưởng; NETWORK — COMMUNITY — Cộng đồng kỹ thuật 15,000+; 3 slot trống.
- Mỗi item HUD truyền nhãn, giá trị, mô tả phụ và icon key vào renderer. Slot rỗng giữ khung kính, không có nội dung và không nhận pointer; dữ liệu legacy được chuẩn hóa về 5 slot mỗi bên. Module `primary` dùng giao diện Blueprint; `danger`, `warning`, `success`, `info` lần lượt ánh xạ sang đỏ, hổ phách, xanh lá, xanh dương.
- **Modules:** BLUEPRINT (`primary`), PPT COURSE (`warning`), PROMPT (`info`), MENTOR (`success`), COMMUNITY (`danger`).

## Thay đổi kỹ thuật

- Mở rộng schema domain với `hudLeft`, `hudRight`, `modules` và các kiểu module `primary`, `danger`, `warning`, `success`, `info`. Các trường legacy vẫn được giữ tùy chọn để hai domain cuối không bị mất dữ liệu.
- Bốn domain mới lấy tiêu đề, mô tả và HUD từ `ADOLSOFT_DOMAINS`; domain 05–06 tiếp tục dùng `DOMAIN_SATELLITE_DATA`.
- Mỗi item HUD truyền nhãn, giá trị, mô tả phụ và icon key vào renderer. Module `primary` dùng giao diện Blueprint; `danger`, `warning`, `success`, `info` lần lượt ánh xạ sang đỏ, hổ phách, xanh lá, xanh dương.
- Texture WebGL ưu tiên `label` thay cho `category`; cỡ chữ title/metric được điều chỉnh theo độ rộng canvas/pill để tránh tràn.
- Bổ sung style riêng cho module `warning`.

## Kiểm tra

- `npm run build`: thành công; trang `/` được build.
- Kiểm tra trình duyệt trên `http://localhost:4321`: chọn Domains cho thấy tiêu đề/mô tả Tầng 1, 5 mục HUD trái, 5 mục HUD phải và 5 modules. Danh sách runtime có 6 domain tổng cộng.
- Build vẫn in cảnh báo bundle vượt 500 kB và cảnh báo route `/api/debug` không có handler GET.
- Trong phiên kiểm tra trình duyệt đã xuất hiện `TypeError: clock.getDelta is not a function` ở `onVisibilityChange` và một số phản hồi HTTP 400. Đây là lỗi/cảnh báo ngoài phần cập nhật HUD, chưa được xử lý trong phạm vi báo cáo.

## Phạm vi workspace

Báo cáo này chỉ mô tả phần cập nhật bốn tầng và HUD/modules. Working tree hiện cũng có thay đổi ở `src/pages/index.astro` cùng nhiều ảnh trong `public/assets`; các thay đổi đó không được quy vào cập nhật này. `ThreeCanvas.astro` và `global.css` đã bị formatter chuẩn hóa rộng hơn phần logic, nên diff hiển thị nhiều thay đổi định dạng ngoài các mục được mô tả ở trên.
