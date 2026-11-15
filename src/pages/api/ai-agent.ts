import type { APIRoute } from 'astro';

export const prerender = false;

interface AiNode {
  id: string;
  type?: string;
  text: string;
  x: number;
  y: number;
  color?: string;
}

interface AiEdge {
  from: string;
  to: string;
  label?: string;
}

interface AiExplanation {
  id?: string;
  text: string;
  x: number;
  y: number;
}

interface AiDiagramPayload {
  nodes: AiNode[];
  edges?: AiEdge[];
  explanations?: AiExplanation[];
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json().catch(() => ({}));
    const prompt = (body.prompt || '').trim();
    const currentCanvasState = body.currentCanvasState || { nodes: [], edges: [], explanations: [] };

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: 'Vui lòng cung cấp nội dung câu lệnh (prompt).' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Đọc API Key & Base URL từ biến môi trường
    const apiKey =
      process.env.OPENAI_API_KEY ||
      process.env.LLM_API_KEY ||
      import.meta.env.OPENAI_API_KEY ||
      import.meta.env.LLM_API_KEY;

    let baseUrl =
      process.env.OPENAI_BASE_URL ||
      process.env.LLM_BASE_URL ||
      import.meta.env.OPENAI_BASE_URL ||
      import.meta.env.LLM_BASE_URL ||
      'https://api.openai.com/v1';

    // Chuẩn hóa Base URL
    baseUrl = baseUrl.replace(/\/+$/, '');
    const endpoint = baseUrl.endsWith('/chat/completions')
      ? baseUrl
      : `${baseUrl}/chat/completions`;

    const model =
      process.env.OPENAI_MODEL ||
      process.env.LLM_MODEL ||
      import.meta.env.OPENAI_MODEL ||
      import.meta.env.LLM_MODEL ||
      'gpt-4o-mini';

    if (!apiKey) {
      return new Response(
        JSON.stringify({
          error: 'Chưa cấu hình OPENAI_API_KEY hoặc LLM_API_KEY trong file .env hoặc môi trường.'
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const currentStateJson = JSON.stringify(currentCanvasState);

    // System Prompt ép buộc trả về DUY NHẤT một chuỗi JSON hợp lệ và xử lý Context-Aware
    const systemPrompt = `Bạn là một AI chuyên gia kiến trúc và vẽ sơ đồ tư duy (Mindmap), sơ đồ luồng (Flowchart) cho hệ sinh thái công nghệ AdolSoft.
Dưới đây là TRẠNG THÁI SƠ ĐỒ HIỆN TẠI trên Canvas của người dùng:
${currentStateJson}

Dựa vào yêu cầu mới của người dùng và trạng thái sơ đồ hiện tại, hãy thực hiện:
1. Nếu người dùng muốn TẠO SƠ ĐỒ MỚI HOÀN TOÀN: Hãy thiết kế sơ đồ mới với các nodes, edges và explanations.
2. Nếu người dùng muốn THÊM MỚI (Add): Hãy giữ lại toàn bộ các Nodes và Edges cũ, tính toán tọa độ X, Y mới cho các Node được thêm ở khoảng trống (cộng thêm 180px - 220px theo chiều ngang hoặc 80px - 100px theo chiều dọc so với node gần nhất), trả về toàn bộ mảng CŨ + MỚI.
3. Nếu người dùng muốn SỬA (Update/Edit): Tìm ID của node cần sửa trong mảng cũ, cập nhật lại text/color và GIỮ NGUYÊN tọa độ x, y của node đó.
4. Nếu người dùng muốn XÓA (Delete/Remove): Tìm và loại bỏ node đó cùng các liên kết (edges) liên quan khỏi mảng.

Định dạng JSON trả về bắt buộc:
{
  "nodes": [
    { "id": "n1", "type": "rectangle", "text": "Tiêu đề ngắn gọn", "x": 180, "y": 140, "color": "#c8ff00" }
  ],
  "edges": [
    { "from": "n1", "to": "n2", "label": "nhãn ngắn" }
  ],
  "explanations": [
    { "id": "e1", "text": "Giải thích chi tiết sơ đồ...", "x": 160, "y": 360 }
  ]
}

Quy tắc bắt buộc:
1. KHÔNG viết bất kỳ lời dẫn hay giải thích nào ngoài mã JSON.
2. TỌA ĐỘ BẮT BUỘC ĐỂ KHÔNG TRÀN VIỀN:
   - Tọa độ X cho Nodes và Explanations: NẰM TRONG KHOẢNG TỪ 100 ĐẾN 850.
   - Tọa độ Y: NẰM TRONG KHOẢNG TỪ 80 ĐẾN 480.
3. Các Nodes không được đè lên nhau.
4. Màu sắc "color" cho nodes chọn từ các màu Neo-Brutalism: #c8ff00 (vàng chanh), #00f0ff (cyan neon), #ff5e00 (cam sáng), #22c55e (xanh lá), #ec4899 (hồng), #38bdf8 (xanh dương sáng), #0f172a (xanh đen), #8b5cf6 (tím).
5. Luôn cập nhật phần giải thích "explanations" phù hợp với toàn bộ sơ đồ hiện tại.`;

    // Gọi API của LLM tương thích chuẩn OpenAI
    const aiResponse = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
        stream: false,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3
      })
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('LLM API returned error:', aiResponse.status, errorText);
      return new Response(
        JSON.stringify({
          error: `Lỗi kết nối nhà cung cấp LLM (${aiResponse.status}): ${errorText}`
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const aiResult = await aiResponse.json();
    const rawContent = aiResult.choices?.[0]?.message?.content || '';

    // Bóc tách JSON bằng Regex phòng trường hợp LLM bọc trong ```json ... ```
    let cleanJsonStr = rawContent.trim();
    const codeBlockMatch = cleanJsonStr.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
    if (codeBlockMatch) {
      cleanJsonStr = codeBlockMatch[1].trim();
    }

    let parsedPayload: AiDiagramPayload;
    try {
      parsedPayload = JSON.parse(cleanJsonStr);
    } catch (parseErr) {
      console.error('Failed to parse LLM JSON string:', cleanJsonStr, parseErr);
      return new Response(
        JSON.stringify({
          error: 'Mô hình AI trả về định dạng không phải JSON hợp lệ. Vui lòng thử lại.'
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Đảm bảo cấu trúc có mảng nodes tối thiểu
    if (!parsedPayload.nodes || !Array.isArray(parsedPayload.nodes)) {
      parsedPayload.nodes = [];
    }
    if (!parsedPayload.edges || !Array.isArray(parsedPayload.edges)) {
      parsedPayload.edges = [];
    }
    if (!parsedPayload.explanations || !Array.isArray(parsedPayload.explanations)) {
      parsedPayload.explanations = [];
    }

    return new Response(JSON.stringify(parsedPayload), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('ai-agent route exception:', error);
    return new Response(
      JSON.stringify({ error: `Lỗi máy chủ khi kết nối AI: ${String(error)}` }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
