# IG FREE

เว็บตัวอย่างสำหรับส่งคำสั่ง Instagram Likes ผ่าน AUTO-TH โดยเก็บ API key ไว้ฝั่งเซิร์ฟเวอร์ของ Vercel

## Environment Variable
ตั้งค่าใน Vercel Project Settings → Environment Variables:

- `AUTO_TH_API_KEY` = API key ของ AUTO-TH

ไม่ต้องตั้ง `FREE_SERVICE_ID` แล้ว ระบบจะเรียก `action=services` และค้นหาบริการที่ชื่อสื่อว่า Instagram + Likes อัตโนมัติ

## หมายเหตุ
- ผู้ใช้ปลายทางไม่ต้องใส่รหัสผ่าน Instagram
- จำนวนเริ่มต้น 100 และระบบจะปรับให้อยู่ใน min/max ของบริการที่เลือกอัตโนมัติ
- ค่าใช้บริการ/ยอดเงินของบัญชี AUTO-TH ขึ้นอยู่กับผู้ให้บริการ แม้หน้าเว็บจะให้ผู้ใช้กดฟรี
- หลังแก้ Environment Variables ให้ Redeploy โปรเจกต์เพื่อให้ค่ามีผล
