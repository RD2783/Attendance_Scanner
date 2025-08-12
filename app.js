if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/Attendance_Scanner/service-worker.js')
      .then(reg => console.log('SW registered:', reg.scope))
      .catch(err => console.error('SW registration failed:', err));
  });
}

const scanBtn   = document.getElementById('scan-btn');
const todayCnt  = document.getElementById('today-count');
const pendCnt   = document.getElementById('pending-count');
const statusInd = document.getElementById('statusIndicator');
const statusTxt = document.getElementById('statusText');

let scansToday   = 0;
let pendingQueue = 0;
let scanner;

function setStatus(mode){
  statusInd.className = 'status-indicator ' + mode + '-status';
  statusTxt.textContent = mode.charAt(0).toUpperCase() + mode.slice(1);
}

function processScannedData(text){
  scansToday++; todayCnt.textContent = scansToday;
  pendingQueue++; pendCnt.textContent = pendingQueue;
  console.log('Scanned:', text);
  // TODO: save to local DB and trigger syncing
}

scanBtn.addEventListener('click', () => {
  if (!scanner){ scanner = new Html5Qrcode('qr-reader'); }
  Html5Qrcode.getCameras().then(devices=>{
    if (!devices.length) return alert('No camera found');
    const camId = devices[0].id;
    scanner.start(camId,
        { fps:10, qrbox:250 },
        (decoded)=>{ scanner.stop(); processScannedData(decoded); },
        err => {});
  });
});

window.addEventListener('online',  () => setStatus('online'));
window.addEventListener('offline', () => setStatus('offline'));
setStatus(navigator.onLine ? 'online' : 'offline');
