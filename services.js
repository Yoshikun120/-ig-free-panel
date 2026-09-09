export default async function handler(req,res){
  try{
    const r=await fetch('https://auto-th.com/api/v2',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({key:process.env.AUTO_TH_API_KEY,action:'services'})});
    const data=await r.json();
    if(!r.ok||!Array.isArray(data)) return res.status(502).json({ok:false,error:'ผู้ให้บริการ API ไม่พร้อมใช้งาน'});

    // แสดงเฉพาะบริการที่ชื่อสื่อว่าเป็น Instagram Likes
    const services=data.filter(x=>{
      const text=String(x.name||'').toLowerCase();
      return /instagram|ig/.test(text) && /like|likes|ไลก์|ถูกใจ/.test(text);
    }).map(x=>({
      service:x.service,
      name:x.name,
      min:x.min,
      max:x.max,
      rate:x.rate,
      type:x.type
    }));

    return res.status(200).json({ok:true,services});
  }catch(e){return res.status(500).json({ok:false,error:'Server error'})}
}
