# IG FREE — เว็บปั๊มไลก์ฟรี

โปรเจกต์นี้มีหน้าเว็บและ API serverless สำหรับส่งคำสั่งไปยัง AUTO-TH โดยเก็บ API Key ไว้ใน Environment Variables ฝั่งเซิร์ฟเวอร์ ไม่ใส่คีย์ในหน้าเว็บ

## Deploy บน Vercel
1. อัปโหลดโฟลเดอร์นี้ขึ้น GitHub
2. Import repository เข้า Vercel
3. ตั้ง Environment Variables:
   - `AUTO_TH_API_KEY` = API Key ของบัญชีคุณ
   - `FREE_SERVICE_ID` = Service ID ของบริการ Instagram Likes ที่คุณต้องการให้ใช้ฟรี (คั่นหลาย ID ด้วย comma ได้)
   - `FREE_QUANTITY` = จำนวนเริ่มต้น เช่น `100`
4. Redeploy
5. เปิดเว็บจากโดเมน Vercel

## สำคัญ
API ของ AUTO-TH ใช้ POST ที่ `https://auto-th.com/api/v2` และรองรับ `services`, `add`, `status` ฯลฯ ตามเอกสารของผู้ให้บริการ คุณต้องเลือก Service ID ที่บัญชีของคุณใช้งานได้เองก่อน

GitHub Pages อย่างเดียวไม่ควรใช้กับ API Key เพราะคีย์จะถูกเปิดเผยใน JavaScript ฝั่งผู้ใช้
