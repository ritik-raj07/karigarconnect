const services = [
  {key:"labour", icon:"👷", en:"Labour", hi:"मज़दूर", hr:100, day:800},
  {key:"contractor", icon:"🦺", en:"Contractor", hi:"ठेकेदार", hr:350, day:2800},
  {key:"carpenter", icon:"🪚", en:"Carpenter", hi:"बढ़ई", hr:300, day:2200},
  {key:"driver", icon:"🚗", en:"Driver", hi:"ड्राइवर", hr:250, day:1800},
  {key:"electrician", icon:"⚡", en:"Electrician", hi:"इलेक्ट्रीशियन", hr:350, day:2500},
  {key:"plumber", icon:"🔧", en:"Plumber", hi:"प्लंबर", hr:300, day:2200},
  {key:"worker", icon:"🧰", en:"Worker", hi:"कामगार", hr:150, day:1100},
  {key:"househelp", icon:"🧹", en:"Househelp", hi:"घरेलू सहायक", hr:150, day:1100},
  {key:"gardener", icon:"🌱", en:"Gardener", hi:"माली", hr:180, day:1300},
  {key:"chef", icon:"👨‍🍳", en:"Chef", hi:"रसोइया", hr:400, day:3000},
  {key:"painter", icon:"🎨", en:"Painter", hi:"पेंटर", hr:280, day:2100},
  {key:"tutor", icon:"📚", en:"Tutor", hi:"ट्यूटर", hr:350, day:2500},
  {key:"babysitter", icon:"👶", en:"Babysitter", hi:"बच्चों की देखभाल", hr:200, day:1500},
  {key:"bouncer", icon:"🛡️", en:"Bouncer", hi:"बाउंसर", hr:350, day:2800}
];

const localities = ["Sector 18 / सेक्टर 18","Sector 62 / सेक्टर 62","Sector 76 / सेक्टर 76","Indirapuram / इंदिरापुरम","Vasundhara / वसुंधरा","Greater Noida / ग्रेटर नोएडा"];
const providerNames = ["Ramesh Kumar","Sanjay Yadav","Imran Khan","Pawan Singh","Rahul Sharma","Amit Verma","Neeraj Kumar","Vikas Pal","Sunil Das","Manoj Kumar"];
let selectedRating = 0;
let mapsReady = false;

function money(n){ return "₹" + Math.round(n).toLocaleString("en-IN"); }
function getService(k){ return services.find(s=>s.key===k) || services[0]; }

function renderServices(){
  document.getElementById("serviceGrid").innerHTML = services.map(s=>`
    <div class="service-card" onclick="openService('${s.key}')" role="button" tabindex="0" onkeydown="if(event.key==='Enter') openService('${s.key}')">
      <div class="service-icon">${s.icon}</div>
      <h3>${s.en} / ${s.hi}</h3>
      <p>Nearby professional / नज़दीकी प्रोफेशनल</p>
      <div class="rate">${money(s.hr)}/hr - ${money(s.day)}/day</div>
    </div>`).join("");
}

function mapInit(){
  if(typeof L==="undefined") return;
  const noida=[28.6139,77.3910];
  const hero=L.map("heroMap",{zoomControl:false}).setView(noida,12);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"© OpenStreetMap"}).addTo(hero);
  L.marker(noida).addTo(hero).bindPopup("KarigarConnect / कारीगरकनेक्ट").openPopup();
  [[28.625,77.373],[28.579,77.336],[28.641,77.427],[28.622,77.349]].forEach((p,i)=>L.marker(p).addTo(hero).bindTooltip("Worker "+(i+1)+" / कामगार "+(i+1)));
  const contact=L.map("contactMap").setView(noida,12);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"© OpenStreetMap"}).addTo(contact);
  L.marker(noida).addTo(contact).bindPopup("KarigarConnect / कारीगरकनेक्ट");
}

function modal(content){
  document.getElementById("modalRoot").innerHTML=`<div class="modal-bg" onclick="if(event.target===this)closeModal()"><div class="modal">${content}</div></div>`;
}
function closeModal(){ document.getElementById("modalRoot").innerHTML=""; }

function openLogin(){
  modal(`<button class="close" onclick="closeModal()">×</button>
    <span class="eyebrow">Login / लॉगिन</span><h2>Choose your interface / अपना इंटरफेस चुनें</h2>
    <p class="modal-sub">Worker / कामगार ya Customer / ग्राहक?</p>
    <div class="role-choice">
      <button class="role" onclick="openWorker()"><strong>👷 Worker / कामगार</strong><span class="muted">Bookings receive karein / बुकिंग प्राप्त करें</span></button>
      <button class="role" onclick="openCustomer()"><strong>👤 Customer / ग्राहक</strong><span class="muted">Worker book karein / कामगार बुक करें</span></button>
    </div>`);
}
function loginForm(role){
  const isWorker=role==="worker";
  modal(`<button class="close" onclick="closeModal()">×</button>
    <span class="eyebrow">${isWorker?"Worker":"Customer"} / ${isWorker?"कामगार":"ग्राहक"}</span>
    <h2>${isWorker?"Worker Login / कामगार लॉगिन":"Customer Login / ग्राहक लॉगिन"}</h2>
    <p class="modal-sub">Simple demo login — backend mein OTP/auth later connect kiya ja sakta hai.</p>
    <div class="form-grid">
      <div class="field"><label>Full Name / पूरा नाम</label><input id="loginName" placeholder="Enter name / नाम"></div>
      <div class="field"><label>Mobile / मोबाइल</label><input id="loginMobile" placeholder="10 digit mobile"></div>
      <div class="field"><label>Locality / स्थानीय क्षेत्र</label><select id="loginLocality">${localities.map(x=>`<option>${x}</option>`).join("")}</select></div>
      ${isWorker?`<div class="field"><label>Work / काम</label><select id="loginService">${services.map(s=>`<option value="${s.key}">${s.en} / ${s.hi}</option>`).join("")}</select></div>`:""}
    </div>
    <div class="modal-actions"><button class="btn btn-outline" onclick="openLogin()">Back / वापस</button><button class="btn btn-primary" onclick="${isWorker?"workerDashboard()":"customerDashboard()"}">Continue / जारी रखें</button></div>`);
}
function openWorker(){ loginForm("worker"); }
function openCustomer(){ loginForm("customer"); }

function workerDashboard(){
  const name=document.getElementById("loginName").value.trim()||"Demo Worker";
  const mobile=document.getElementById("loginMobile").value.trim()||"9999999999";
  const loc=document.getElementById("loginLocality").value;
  const svc=document.getElementById("loginService").value;
  localStorage.setItem("kcWorker",JSON.stringify({name,mobile,loc,svc}));
  const s=getService(svc);
  modal(`<button class="close" onclick="closeModal()">×</button>
    <span class="eyebrow">Worker dashboard / कामगार डैशबोर्ड</span>
    <h2>Namaste ${name} / नमस्ते ${name}</h2><p class="modal-sub">${loc}</p>
    <div class="dashboard-grid">
      <aside class="dash-side">
        <strong>Profile / प्रोफ़ाइल</strong>
        <p class="muted" style="margin:10px 0">⭐ 4.6/5 rating / रेटिंग</p>
        <p class="muted">${s.en} / ${s.hi}</p>
        <p class="worker-price" style="margin-top:8px">${money(s.hr)}/hr · ${money(s.day)}/day</p>
        <hr style="margin:18px 0;border:0;border-top:1px solid #e2e5ee">
        <label class="toggle"><input type="checkbox" checked> Available / उपलब्ध</label>
        <p class="muted" style="margin-top:10px">Working: 9 AM–6 PM / काम: सुबह 9–शाम 6</p>
        <p class="muted">Tiffin break included / टिफिन ब्रेक शामिल</p>
      </aside>
      <div class="dash-main">
        <h3>Booking requests / बुकिंग अनुरोध</h3>
        <div class="notice">Requests are shown only from your locality. / अनुरोध केवल आपकी स्थानीयता से दिखाए जाते हैं।</div>
        <div class="worker-card"><div><h3>House repair / घर की मरम्मत</h3><div class="muted">Sector 62 · Today 11:00 AM / आज 11 बजे</div></div><button class="btn btn-primary" onclick="acceptDemo()">Accept / स्वीकार</button></div>
        <div class="worker-card"><div><h3>Urgent booking / तत्काल बुकिंग</h3><div class="muted">2.5 km · Tomorrow 3:00 PM / कल 3 बजे</div></div><button class="btn btn-outline" onclick="alert('Request declined / अनुरोध अस्वीकार')">Decline / अस्वीकार</button></div>
      </div>
    </div>`);
}
function acceptDemo(){ alert("Booking accepted / बुकिंग स्वीकार हो गई। Customer को notification भेजा जाएगा।"); }

function providerList(serviceKey, locality){
  const s=getService(serviceKey);
  const base=["Ramesh Kumar","Sanjay Yadav","Imran Khan","Pawan Singh","Rahul Sharma","Amit Verma"];
  return base.map((name,i)=>({
    name, rating:[4.8,4.6,4.3,4.1,3.8,3.4][i], distance:(0.6+i*0.7).toFixed(1),
    price:Math.round(s.hr*(1-[0,.02,.04,.06,.09,.12][i])),
    locality, shop:["Local registered provider / स्थानीय रजिस्टर्ड प्रोवाइडर","Registered shop / रजिस्टर्ड दुकान"][i%2],
    available:i!==4
  }));
}


function openService(serviceKey){
  // Service cards now open the customer booking interface with that service pre-selected.
  customerDashboard(serviceKey);
}

function customerDashboard(preselectedService){
  const initialService = preselectedService || "labour";
  modal(`<button class="close" onclick="closeModal()">×</button>
    <span class="eyebrow">Customer dashboard / ग्राहक डैशबोर्ड</span>
    <h2>Find nearby help / नज़दीकी मदद खोजें</h2>
    <p class="modal-sub">Locality ke workers/professionals dekhein aur booking karein.</p>
    <div class="toolbar">
      <select id="serviceSelect" onchange="refreshProviders()">${services.map(s=>`<option value="${s.key}">${s.icon} ${s.en} / ${s.hi}</option>`).join("")}</select>
      <select id="localitySelect" onchange="refreshProviders()">${localities.map(x=>`<option>${x}</option>`).join("")}</select>
    </div>
    <div id="providers" class="workers"></div>`);
  document.getElementById("serviceSelect").value = initialService;
  refreshProviders();
}
function refreshProviders(){
  const key=document.getElementById("serviceSelect").value;
  const loc=document.getElementById("localitySelect").value;
  const s=getService(key);
  document.getElementById("providers").innerHTML=providerList(key,loc).map((p,i)=>`
    <div class="worker-card">
      <div>
        <h3>${p.name} <span class="stars">★ ${p.rating}</span></h3>
        <div class="muted">${s.en} / ${s.hi} · ${p.distance} km · ${p.locality}</div>
        <div class="muted">${p.shop} · ${p.available?"🟢 Available / उपलब्ध":"🔴 Busy / व्यस्त"}</div>
      </div>
      <div style="text-align:right"><div class="worker-price">${money(p.price)}/hr</div><div class="muted">${money(Math.round(p.price*8))}/day</div><button class="btn ${p.available?"btn-primary":"btn-light"}" style="margin-top:8px" ${p.available?"":"disabled"} onclick='bookingForm(${JSON.stringify(p)},${JSON.stringify(s)})'>Book / बुक करें</button></div>
    </div>`).join("");
}

function bookingForm(p,s){
  selectedRating=0;
  modal(`<button class="close" onclick="customerDashboard()">×</button>
    <span class="eyebrow">Booking / बुकिंग</span>
    <h2>${s.en} / ${s.hi} — ${p.name}</h2>
    <p class="modal-sub">★ ${p.rating} · ${p.distance} km · ${p.locality}</p>
    <div class="form-grid">
      <div class="field"><label>Date / तारीख</label><input id="bookDate" type="date"></div>
      <div class="field"><label>Time / समय</label><input id="bookTime" type="time" value="11:00"></div>
      <div class="field"><label>Work duration / काम की अवधि</label><select id="bookHours" onchange="updateCalc(${p.price})"><option value="1">1 hour / 1 घंटा</option><option value="2">2 hours / 2 घंटे</option><option value="3">3 hours / 3 घंटे</option><option value="4">4 hours / 4 घंटे</option><option value="8">Full day / पूरा दिन</option></select></div>
      <div class="field"><label>Work location / काम की जगह</label><input id="bookLocation" value="${p.locality}" placeholder="Location / स्थान"></div>
      <div class="field full"><label>Work details / काम का विवरण</label><textarea id="bookDetails" rows="3" placeholder="What work is needed? / कौन सा काम करना है?"></textarea></div>
    </div>
    <div id="calc" class="booking-box"></div>
    <div class="modal-actions"><button class="btn btn-outline" onclick="customerDashboard()">Back / वापस</button><button class="btn btn-primary" onclick='paymentForm(${JSON.stringify(p)},${JSON.stringify(s)})'>Proceed to Payment / भुगतान करें</button></div>`);
  document.getElementById("bookDate").value=new Date().toISOString().slice(0,10);
  updateCalc(p.price);
}
function updateCalc(hourRate){
  const h=Number(document.getElementById("bookHours").value);
  const labour=h===8?hourRate*8:hourRate*h;
  const travel=40;
  const platform=Math.round(labour*.03);
  document.getElementById("calc").innerHTML=`
    <div class="calc-row"><span>Work wage / काम की मजदूरी</span><strong>${money(labour)}</strong></div>
    <div class="calc-row"><span>Local travel / स्थानीय यात्रा</span><strong>${money(travel)}</strong></div>
    <div class="calc-row"><span>Service fee / सेवा शुल्क</span><strong>${money(platform)}</strong></div>
    <div class="calc-row calc-total"><span>Total / कुल</span><strong>${money(labour+travel+platform)}</strong></div>
    <div class="muted">Indicative market rates / अनुमानित बाज़ार दरें. Final wage can vary by work difficulty.</div>`;
}
function paymentForm(p,s){
  const h=Number(document.getElementById("bookHours").value);
  const labour=h===8?p.price*8:p.price*h, total=labour+40+Math.round(labour*.03);
  const date=document.getElementById("bookDate").value, time=document.getElementById("bookTime").value, loc=document.getElementById("bookLocation").value;
  modal(`<button class="close" onclick="closeModal()">×</button>
    <span class="eyebrow">Payment / भुगतान</span><h2>Secure booking payment / सुरक्षित भुगतान</h2>
    <p class="modal-sub">${s.en} / ${s.hi} · ${p.name} · ${date} ${time}</p>
    <div class="pay-methods">
      <div class="pay-method active" onclick="selectPay(this)">💳 Card / कार्ड</div>
      <div class="pay-method" onclick="selectPay(this)">📱 UPI</div>
      <div class="pay-method" onclick="selectPay(this)">🏦 Net Banking / नेट बैंकिंग</div>
    </div>
    <div class="form-grid" style="margin-top:15px">
      <div class="field full"><label>UPI ID / कार्ड या UPI</label><input placeholder="demo@upi"></div>
    </div>
    <div class="booking-box">
      <div class="calc-row"><span>Worker wage / कामगार मजदूरी</span><strong>${money(labour)}</strong></div>
      <div class="calc-row"><span>Travel / यात्रा</span><strong>₹40</strong></div>
      <div class="calc-row"><span>Service fee / सेवा शुल्क</span><strong>${money(Math.round(labour*.03))}</strong></div>
      <div class="calc-row calc-total"><span>Payable / देय</span><strong>${money(total)}</strong></div>
    </div>
    <div class="modal-actions"><button class="btn btn-outline" onclick='bookingForm(${JSON.stringify(p)},${JSON.stringify(s)})'>Back / वापस</button><button class="btn btn-primary" onclick='confirmBooking(${JSON.stringify({name:p.name,service:s.en,date,time,loc,total})})'>Pay & Book / भुगतान व बुकिंग</button></div>`);
}
function selectPay(el){document.querySelectorAll(".pay-method").forEach(x=>x.classList.remove("active"));el.classList.add("active")}
function confirmBooking(data){
  const bookingId="KC"+Date.now().toString().slice(-7);
  modal(`<div class="success"><div class="big">✓</div><span class="eyebrow">Booking confirmed / बुकिंग कन्फर्म</span><h2>Worker request sent / कामगार को अनुरोध भेजा गया</h2><p class="modal-sub">Booking ID: ${bookingId}</p>
    <div class="booking-box" style="text-align:left"><div class="calc-row"><span>Professional / प्रोफेशनल</span><strong>${data.name}</strong></div><div class="calc-row"><span>Service / सेवा</span><strong>${data.service}</strong></div><div class="calc-row"><span>When / कब</span><strong>${data.date} · ${data.time}</strong></div><div class="calc-row"><span>Location / स्थान</span><strong>${data.loc}</strong></div><div class="calc-row calc-total"><span>Paid / भुगतान</span><strong>${money(data.total)}</strong></div></div>
    <div class="notice">If the worker does not accept within 20–25 minutes, the request automatically moves to the next nearby worker. / 20–25 मिनट में स्वीकार न होने पर अनुरोध अगले नज़दीकी कामगार को जाएगा।</div>
    <button class="btn btn-primary" onclick="ratingForm('${data.name}')">Rate after work / काम के बाद रेट करें</button>
    <button class="btn btn-outline" style="margin-left:8px" onclick="closeModal()">Done / पूरा</button></div>`);
  localStorage.setItem("lastBooking",JSON.stringify(data));
}
function ratingForm(name){
  selectedRating=0;
  modal(`<button class="close" onclick="closeModal()">×</button><div class="success"><span class="eyebrow">Rating / रेटिंग</span><h2>Rate ${name} / ${name} को रेट करें</h2><p class="modal-sub">Good rating = better earning potential / अच्छी रेटिंग = बेहतर कमाई की संभावना</p>
    <div id="ratingStars" class="rating" style="justify-content:center;margin:20px 0">${[1,2,3,4,5].map(i=>`<span onclick="setRating(${i})">★</span>`).join("")}</div>
    <p id="ratingText" class="muted">Select stars / स्टार चुनें</p>
    <button class="btn btn-primary" onclick="submitRating()">Submit / जमा करें</button></div>`);
}
function setRating(n){
  selectedRating=n;
  document.querySelectorAll("#ratingStars span").forEach((x,i)=>x.classList.toggle("on",i<n));
  document.getElementById("ratingText").textContent=["","Poor / खराब","Needs improvement / सुधार चाहिए","Average / औसत","Good / अच्छा","Excellent / बहुत अच्छा"][n];
}
function submitRating(){
  const multiplier={1:.70,2:.80,3:.90,4:.95,5:1}[selectedRating]||.9;
  alert(`Rating saved / रेटिंग सेव हो गई। Demo payout multiplier: ${Math.round(multiplier*100)}%`);
  closeModal();
}

document.addEventListener("DOMContentLoaded",()=>{renderServices(); setTimeout(mapInit,300);});
