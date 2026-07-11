export const runtime = "edge"; // ✅ Tối ưu Cloudflare Workers, phản hồi < 5ms

export async function GET() {
  // ✅ UTC chuẩn quốc tế, đồng bộ NTP, user KHÔNG BAO GIỜ chỉnh được
  //    Server ở Mỹ / EU / Singapore / Việt Nam → trả về CÙNG 1 giá trị
  const utcNow = Date.now();
  // ✅ Chỉ log ở dev
  if (process.env.NODE_ENV === "development") {
    console.log("SERVER UTC:", new Date(utcNow).toISOString());
  }

  return Response.json(
    {
      utc: utcNow,
    },
    {
      headers: {
        // ✅ QUAN TRỌNG: Cloudflare cache 60s, trình duyệt không cache
        //    1000 người mở trong 1 phút → chỉ 1 req thật, 999 req miễn phí
        "Cache-Control": "public, max-age=0, s-maxage=60, must-revalidate",
        "Access-Control-Allow-Origin": "*",
      },
    },
  );
}
