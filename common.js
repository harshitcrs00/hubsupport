const db=supabase.createClient(SUPABASE_URL,SUPABASE_ANON_KEY);
const ADMIN_EMAIL="harshitcrs00@gmail.com";
const $=i=>document.getElementById(i);
const oid=n=>"CRS"+(1000+n),inr=n=>"₹"+Number(n||0).toLocaleString("en-IN",{maximumFractionDigits:2});
function E(t,c,x){const e=document.createElement(t);if(c)e.className=c;if(x!==undefined)e.textContent=x;return e}
async function fn(body){try{const {data,error}=await db.functions.invoke("smm",{body});return error?{error:error.message}:(data||{})}catch(e){return {error:String(e)}}}
function done(b,error,t){b.textContent=error?"Nahi hua: "+error.message:t}
function listS(el,svcs){el.textContent="";if(!svcs.length){el.textContent="Abhi koi service nahi.";return}
 svcs.forEach(s=>{const r=E("div","row");r.append(E("b","",s.id+" - "+s.name),E("div","mute",(s.category||"Other")+" | "+inr(s.rate)+" per 1000 | Min "+s.min_qty+" Max "+s.max_qty),E("div","",s.description||""));el.append(r)})}
async function shell(kind,active){
 const {data}=await db.auth.getSession();const u=data.session&&data.session.user,adm=kind=="admin";
 if(!u||(adm&&u.email!=ADMIN_EMAIL)){location.replace(adm?"admin.html":"index.html");return null}
 const L=adm?[["admin-orders.html","Orders"],["admin-users.html","Users"],["admin-tickets.html","Tickets"],["admin-services.html","Services"],["admin-providers.html","Providers (API)"]]
  :[["neworder.html","New order"],["orders.html","Orders history"],["tickets.html","Tickets"],["funds.html","Add funds"],["services.html","Services"]];
 const sd=$("side"),im=E("img","logo");im.src="logo.png";im.alt="CRS";sd.append(im);
 L.forEach(([h,t])=>{const a=E("a",h==active?"on":"",t);a.href=h;sd.append(a)});
 const tp=$("top");let prof=null;
 if(!adm){const r=await db.from("profiles").select("*").eq("user_id",u.id).maybeSingle();prof=r.data||{balance:0};tp.append(E("span","pill","Balance: "+inr(prof.balance)))}
 tp.append(E("span","mute",u.email));
 const b=E("button","btn alt","Logout");b.onclick=async()=>{await db.auth.signOut();location.href=adm?"admin.html":"index.html"};tp.append(b);
 return {u,prof}}
