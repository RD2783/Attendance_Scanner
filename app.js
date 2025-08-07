// app.js

// ------- SERVICE WORKER REGISTRATION --------
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('Service Worker Registered with scope:', registration.scope);
      })
      .catch(error => {
        console.error('Service Worker registration failed:', error);
      });
  });
} else {
  console.log('Service Workers are not supported in this browser.');
}

// ------- QR CODE SCANNER SETUP --------
// Make sure to include html5-qrcode library in your project and import accordingly

// If using modules:
// import { Html5Qrcode } from "html5-qrcode";

// For non-module usage, include html5-qrcode.min.js in your HTML before this script

// Initialize Html5Qrcode scanner
const scanner = new Html5Qrcode("qr-reader");

// Function to start scanning
function startScanning() {
  Html5Qrcode.getCameras()
    .then(devices => {
      if (devices && devices.length) {
        const cameraId = devices[0].id;
        scanner.start(
          cameraId,
          { fps: 10, qrbox: { width: 250, height: 250 } },
          onScanSuccess,
          onScanFailure
        );
      } else {
        console.error("No cameras found.");
      }
    })
    .catch(err => {
      console.error("Error getting cameras:", err);
    });
}

// Function called on successful scan
function onScanSuccess(decodedText, decodedResult) {
  console.log(`QR Code scanned: ${decodedText}`);
  processScannedData(decodedText);
  // Optionally, stop scanning if only one scan is needed:
  // scanner.stop();
}

// Function called on scan failure or no QR code detected in frame
function onScanFailure(error) {
  // You can log or ignore scanning errors/failures here.
  // console.warn(`QR scan failed: ${error}`);
}

// Placeholder: Process scanned QR code data
function processScannedData(scannedCode) {
  // TODO: Parse scannedCode, validate student, save attendance record, etc.
  console.log("Processing scanned data:", scannedCode);
  // Example: Show feedback to user, store data locally, or trigger sync
}

// Hook up your "Start Scanning" button
document.getElementById('scan-btn').addEventListener('click', () => {
  startScanning();
});
