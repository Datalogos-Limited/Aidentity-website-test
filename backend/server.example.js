/* Example only. Run as a separately hosted API, not on GitHub Pages.
   Install: npm install express mysql2 helmet express-rate-limit
   Set DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, ALLOWED_ORIGIN in the host's
   secret manager. Mount behind HTTPS. Add CAPTCHA/abuse controls as required. */
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mysql = require('mysql2/promise');
const app = express();
app.use(helmet());
app.use(express.json({ limit: '8kb' }));
app.use((req,res,next)=>{
  const allowed=process.env.ALLOWED_ORIGIN;
  if(req.headers.origin===allowed){res.setHeader('Access-Control-Allow-Origin',allowed);res.setHeader('Vary','Origin');res.setHeader('Access-Control-Allow-Headers','Content-Type');res.setHeader('Access-Control-Allow-Methods','POST, OPTIONS')}
  if(req.method==='OPTIONS')return res.sendStatus(204);
  next();
});
app.use('/api/library-requests',rateLimit({windowMs:15*60*1000,limit:10,standardHeaders:true,legacyHeaders:false}));
const pool=mysql.createPool({host:process.env.DB_HOST,user:process.env.DB_USER,password:process.env.DB_PASSWORD,database:process.env.DB_NAME,waitForConnections:true,connectionLimit:5});
const personalDomains=new Set(['gmail.com','googlemail.com','yahoo.com','yahoo.co.uk','hotmail.com','hotmail.co.uk','outlook.com','outlook.co.uk','live.com','icloud.com','me.com','aol.com','proton.me','protonmail.com','gmx.com','mail.com','yandex.com']);
app.post('/api/library-requests',async(req,res)=>{
  const fullName=String(req.body?.fullName||'').trim();
  const company=String(req.body?.company||'').trim();
  const email=String(req.body?.email||'').trim().toLowerCase();
  const match=email.match(/^[^\s@]+@([^\s@]+\.[^\s@]+)$/);
  if(!fullName||fullName.length>180||!company||company.length>180||email.length>254||!match)return res.status(400).json({error:'Please provide a name, company and valid work email.'});
  const domain=match[1];
  if(personalDomains.has(domain))return res.status(400).json({error:'Please use your organisation email address.'});
  try{
    await pool.execute('INSERT INTO access_requests (full_name, company, email, email_domain) VALUES (?, ?, ?, ?)',[fullName,company,email,domain]);
    return res.status(202).json({status:'pending'});
  }catch(error){console.error('Library request storage failed');return res.status(500).json({error:'Unable to accept the request at this time.'})}
});
const port=process.env.PORT||3000;
app.listen(port,()=>console.log(`Library API listening on ${port}`));
