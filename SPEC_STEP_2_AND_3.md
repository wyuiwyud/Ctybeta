# TÀI LIỆU ĐẶC TẢ KỸ THUẬT: BƯỚC 2 & BƯỚC 3 (LOGIC & CANVAS RENDERING)

## 1. MỤC TIÊU (GOAL)
- **Bước 2:** Tạo API Route nhận Prompt từ Cột Phải, gọi LLM (hoặc Mock Data) để trả về JSON cấu trúc sơ đồ. Cập nhật Terminal Log.
- **Bước 3:** Viết hàm nhận JSON đó và tự động vẽ các khối (Nodes), mũi tên (Edges) và văn bản giải thích (Explanations) lên Canvas ở Cột Giữa.

## 2. ĐỊNH NGHĨA DỮ LIỆU (TYPESCRIPT INTERFACES)
Bắt buộc AI phải tuân thủ cấu trúc này để tránh lỗi parse JSON:
```typescript
interface AINode {
  id: string;
  type: 'rectangle' | 'circle' | 'diamond';
  text: string;
  x: number; // Tọa độ X trên canvas
  y: number; // Tọa độ Y trên canvas
  color: string; // Hex code (VD: '#c8ff00')
}

interface AIEdge {
  from: string; // ID của node bắt đầu
  to: string;   // ID của node kết thúc
  label?: string; // Chữ trên mũi tên
}

interface AIExplanation {
  id: string;
  text: string; // Đoạn văn giải thích
  x: number;
  y: number;
}

interface AIResponse {
  nodes: AINode[];
  edges: AIEdge[];
  explanations: AIExplanation[];
}