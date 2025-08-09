/* ========= 1. Service-worker registration ========= */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/Attendance_Scanner/service-worker.js') // path includes repo name
      .then(reg => console.log('SW registered:', reg.scope))
      .catch(err => console.error('SW registration failed:', err));
  });
}

/* ========= 2. Simple QR-scanner bootstrapping =========
   Using html5-qrcode (add the CDN <script> tag *before* this file in prod) */
const scanBtn   = document.getElementById('scan-btn');
const todayCnt  = document.getElementById('today-count');
const pendCnt   = document.getElementById('pending-count');
const statusInd = document.getElementById('statusIndicator');
const statusTxt = document.getElementById('statusText');

let scansToday   = 0;
let pendingQueue = 0;
let scanner;

/* --- fake online/offline status for demo --- */
function setStatus(mode){
  statusInd.className = 'status-indicator ' + mode + '-status';
  statusTxt.textContent = mode.charAt(0).toUpperCase() + mode.slice(1);
}

/* --- processing scanned code (placeholder) --- */
function processScannedData(text){
  scansToday++; todayCnt.textContent = scansToday;
  pendingQueue++; pendCnt.textContent = pendingQueue;
  console.log('Scanned:', text);
  // TODO: save to IndexedDB & schedule background sync
}

/* --- start camera + scanner --- */
scanBtn.addEventListener('click', () => {
  if (!scanner){ scanner = new Html5Qrcode('qr-reader'); }
  Html5Qrcode.getCameras().then(devices=>{
    if (!devices.length) return alert('No camera found');
    const camId = devices[0].id;
    scanner.start(camId,
        { fps:10, qrbox:250 },
        (decoded)=>{ scanner.stop(); processScannedData(decoded); },
        err => {}); // ignore scan errors
  });
});

/* ========= 3. Demo connectivity handlers ========= */
window.addEventListener('online',  () => setStatus('online'));
window.addEventListener('offline', () => setStatus('offline'));
setStatus(navigator.onLine ? 'online' : 'offline');
