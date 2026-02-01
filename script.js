// ============================================
// SCRIPT UTAMA - ULANGAN HARIAN SMA NEGERI 5 TANAH PUTIH
// ============================================

// Data Soal
const soalData = [
    { id: 1, soal: "Saat pertama kali datang, Jepang menyebut dirinya sebagai...", pilihan: ["Saudara Muda Asia", "Saudara Tua Asia", "Penjajah Baru Asia", "Sekutu Asia", "Tamu Asia"], jawaban: 1 },
    { id: 2, soal: "Tujuan utama Jepang menjajah Indonesia adalah untuk mengambil...", pilihan: ["Rempah-rempah", "Bahan baku industri dan perang seperti minyak", "Karya seni dan budaya", "Tenaga ahli Indonesia", "Ilmu pengetahuan dari Belanda"], jawaban: 1 },
    { id: 3, soal: "Apa yang terjadi dengan bendera Merah Putih pada awal masa Jepang?", pilihan: ["Dilarang dikibarkan", "Dijadikan bendera resmi", "Diizinkan dikibarkan setiap hari", "Warnanya diubah", "Dikibarkan bersama bendera Belanda"], jawaban: 0 },
    { id: 4, soal: "Kerja paksa tanpa bayaran pada masa Jepang disebut...", pilihan: ["Rodi", "Romusha", "Heiho", "Wajib kerja", "Tanam paksa"], jawaban: 1 },
    { id: 5, soal: "Bahasa resmi yang diwajibkan Jepang di sekolah dan kantor adalah...", pilihan: ["Belanda dan Inggris", "Jepang dan Indonesia", "Jawa dan Melayu", "Daerah masing-masing", "Belanda dan Jepang"], jawaban: 1 },
    { id: 6, soal: "Organisasi yang dibentuk Jepang dan dipimpin Soekarno-Hatta untuk mengerahkan tenaga rakyat membantu Jepang adalah...", pilihan: ["BPUPKI", "Putera", "Gerakan 3A", "PETA", "Seinendan"], jawaban: 1 },
    { id: 7, soal: "Barisan pembantu polisi yang anggotanya para pemuda lokal disebut...", pilihan: ["Seinendan", "Keibodan", "Heiho", "Romusha", "Kempetai"], jawaban: 1 },
    { id: 8, soal: "Kebijakan Jepang yang memaksa petani menyerahkan hasil padinya disebut sistem...", pilihan: ["Sewa tanah", "Wajib serah (setoran)", "Ekspor bebas", "Tanam paksa", "Iuran wajib"], jawaban: 1 },
    { id: 9, soal: "Mengapa Jepang melarang penggunaan bahasa Belanda dan mewajibkan bahasa Jepang serta Indonesia?", pilihan: ["Karena bahasa Belanda sulit dipelajari.", "Untuk menghapus pengaruh Barat dan mengontrol pikiran rakyat.", "Karena tidak ada guru bahasa Belanda.", "Agar rakyat bisa bekerja di perusahaan Jepang.", "Untuk mempersatukan semua suku di Indonesia."], jawaban: 1 },
    { id: 10, soal: "Upacara menyembah Kaisar Jepang dengan membungkuk ke arah Tokyo disebut...", pilihan: ["Harakiri", "Seikerei", "Sumpah Pemuda", "Meditasi", "Bakti sosial"], jawaban: 1 },
    { id: 11, soal: "Pulau Jawa pada masa Jepang diperintah oleh tentara...", pilihan: ["Darat (Rikugun)", "Laut (Kaigun)", "Udara", "Gabungan", "Sekutu"], jawaban: 0 },
    { id: 12, soal: "Polisi militer rahasia Jepang yang terkenal kejam adalah...", pilihan: ["Heiho", "Kempetai", "Seinendan", "Keibodan", "Tokkeitai"], jawaban: 1 },
    { id: 13, soal: "Tanaman yang wajib ditanam rakyat untuk bahan pelumas mesin perang adalah...", pilihan: ["Teh", "Kopi", "Jarak", "Padi", "Karet"], jawaban: 2 },
    { id: 14, soal: "Partai-partai politik zaman Belanda saat Jepang datang...", pilihan: ["Diberi kebebasan", "Dibubarkan", "Dijadikan satu partai", "Diizinkan berprotes", "Dibiarkan saja"], jawaban: 1 },
    { id: 15, soal: "Janji Jepang yang paling menarik bagi rakyat Indonesia adalah...", pilihan: ["Gaji yang besar", "Indonesia akan dimerdekakan", "Banyak lowongan kerja", "Pendidikan gratis", "Tanah untuk petani"], jawaban: 1 }
];

// Konfigurasi
const CONFIG = {
    WEB_APP_URL: 'https://script.google.com/macros/s/AKfycbxUWW-7kZ8N5tX8cWQ7qHtqH/exec', // GANTI DENGAN URL ANDA
    EXAM_DURATION: 13 * 60 + 45,
    DEBUG: true
};

// Variabel Global
let jawabanUser = Array(15).fill(null);
let currentQuestion = 0;
let timeLeft = CONFIG.EXAM_DURATION;
let timerInterval;
let examStarted = false;
let startTime, endTime;
let tabChangeCount = 0, rightClickCount = 0, cheatingDetected = false;

// ===============================
// INISIALISASI
// ===============================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Sistem Ulangan Harian dimuat');
    
    // Event Listeners
    document.getElementById('btnStart').addEventListener('click', startExam);
    document.getElementById('btnPrev').addEventListener('click', () => navigate(-1));
    document.getElementById('btnNext').addEventListener('click', () => navigate(1));
    document.getElementById('btnSubmit').addEventListener('click', confirmSubmit);
    document.getElementById('btnReturnHome').addEventListener('click', () => location.reload());
    
    // Test koneksi
    testConnection();
});

// ===============================
// FUNGSI UJIAN
// ===============================
function startExam() {
    const nama = document.getElementById('nama').value.trim();
    const kelas = document.getElementById('kelas').value;
    
    if (!nama || !kelas) {
        alert('Harap isi nama lengkap dan pilih kelas!');
        return;
    }
    
    // Update info siswa
    document.getElementById('studentName').textContent = nama;
    document.getElementById('studentClass').textContent = kelas;
    
    // Tampilkan ujian
    document.getElementById('dataSection').style.display = 'none';
    document.getElementById('examSection').style.display = 'block';
    
    // Mulai timer
    startTime = new Date();
    startTimer();
    examStarted = true;
    
    // Aktifkan deteksi kecurangan
    initCheatingDetection();
    
    // Load soal pertama
    loadQuestion(0);
}

function startTimer() {
    updateTimer();
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimer();
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            submitExam();
        }
    }, 1000);
}

function updateTimer() {
    const min = Math.floor(timeLeft / 60);
    const sec = timeLeft % 60;
    document.getElementById('timer').textContent = `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
    
    if (timeLeft <= 60) {
        document.getElementById('timer').style.color = '#f44336';
    }
}

function loadQuestion(index) {
    const question = soalData[index];
    document.getElementById('questionsContainer').innerHTML = `
        <div class="question-card">
            <div class="question-number">${question.id}</div>
            <div class="question-text">${question.soal}</div>
            <div class="options-container">
                ${question.pilihan.map((opt, i) => `
                    <div class="option ${jawabanUser[index] === i ? 'selected' : ''}" onclick="selectAnswer(${index}, ${i})">
                        <div class="option-letter">${String.fromCharCode(65 + i)}</div>
                        <div class="option-text">${opt}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    document.getElementById('currentQuestion').textContent = index + 1;
    document.getElementById('btnPrev').disabled = index === 0;
    document.getElementById('btnNext').disabled = index === 14;
}

window.selectAnswer = function(qIndex, aIndex) {
    jawabanUser[qIndex] = aIndex;
    loadQuestion(qIndex);
};

function navigate(direction) {
    const newIndex = currentQuestion + direction;
    if (newIndex >= 0 && newIndex < 15) {
        currentQuestion = newIndex;
        loadQuestion(newIndex);
    }
}

// ===============================
// DETEKSI KECURANGAN
// ===============================
function initCheatingDetection() {
    // Deteksi ganti tab
    document.addEventListener('visibilitychange', () => {
        if (document.hidden && examStarted && !cheatingDetected) {
            tabChangeCount++;
            document.getElementById('tabCount').textContent = tabChangeCount;
            
            if (tabChangeCount >= 3) {
                cheatingDetected = true;
                stopExam('Terlalu sering ganti tab');
            }
        }
    });
    
    // Deteksi klik kanan
    document.addEventListener('contextmenu', (e) => {
        if (examStarted && !cheatingDetected) {
            e.preventDefault();
            rightClickCount++;
            document.getElementById('rightClickCount').textContent = rightClickCount;
            
            if (rightClickCount >= 2) {
                cheatingDetected = true;
                stopExam('Klik kanan berulang');
            }
        }
    });
    
    // Deteksi F12
    document.addEventListener('keydown', (e) => {
        if (e.key === 'F12' && examStarted && !cheatingDetected) {
            e.preventDefault();
            cheatingDetected = true;
            stopExam('Menekan F12 (Developer Tools)');
        }
    });
}

function stopExam(reason) {
    clearInterval(timerInterval);
    endTime = new Date();
    
    // Hitung skor
    const score = calculateScore();
    const timeUsed = Math.floor((endTime - startTime) / 1000);
    
    // Tampilkan layar kecurangan
    document.getElementById('examSection').style.display = 'none';
    document.getElementById('cheatingSection').style.display = 'block';
    
    document.getElementById('cheatingName').textContent = document.getElementById('nama').value;
    document.getElementById('cheatingClass').textContent = document.getElementById('kelas').value;
    document.getElementById('cheatingReason').textContent = `Alasan: ${reason}`;
    document.getElementById('cheatingTime').textContent = new Date().toLocaleString('id-ID');
    
    // Kirim data ke Google Sheets
    sendToGoogleSheets({
        statusUjian: 'DIHENTIKAN',
        alasanHenti: reason,
        skor: score,
        waktuDigunakan: formatTime(timeUsed)
    });
}

// ===============================
// SUBMIT UJIAN
// ===============================
function confirmSubmit() {
    const unanswered = jawabanUser.filter(a => a === null).length;
    if (unanswered > 0 && !confirm(`Masih ada ${unanswered} soal belum terjawab. Yakin ingin mengumpulkan?`)) {
        return;
    }
    submitExam();
}

async function submitExam() {
    clearInterval(timerInterval);
    endTime = new Date();
    
    // Hitung skor
    const score = calculateScore();
    const percentage = Math.round((score / 15) * 100);
    const timeUsed = Math.floor((endTime - startTime) / 1000);
    
    // Tampilkan hasil
    showResult(score, percentage, timeUsed);
    
    // Kirim data ke Google Sheets
    await sendToGoogleSheets({
        statusUjian: 'SELESAI',
        alasanHenti: 'Selesai mengerjakan',
        skor: score,
        waktuDigunakan: formatTime(timeUsed)
    });
}

function calculateScore() {
    return jawabanUser.reduce((score, answer, index) => {
        return score + (answer === soalData[index].jawaban ? 1 : 0);
    }, 0);
}

// ===============================
// KIRIM DATA KE GOOGLE SHEETS
// ===============================
async function sendToGoogleSheets(additionalData) {
    try {
        const nama = document.getElementById('nama').value;
        const kelas = document.getElementById('kelas').value;
        const score = calculateScore();
        const percentage = Math.round((score / 15) * 100);
        const timeUsed = Math.floor((endTime - startTime) / 1000);
        
        const data = {
            nama: nama,
            kelas: kelas,
            skor: score,
            jawabanBenar: score,
            totalSoal: 15,
            persentase: percentage,
            waktuDigunakan: formatTime(timeUsed),
            statusUjian: additionalData.statusUjian || 'SELESAI',
            alasanHenti: additionalData.alasanHenti || 'Selesai mengerjakan',
            deviceType: getDeviceType(),
            os: getOS(),
            browser: getBrowser(),
            resolution: `${screen.width}x${screen.height}`,
            userAgent: navigator.userAgent.substring(0, 200),
            ipAddress: 'Tidak terdeteksi',
            tabChanges: tabChangeCount,
            copyAttempts: 0,
            rightClicks: rightClickCount,
            f12Pressed: 0,
            fullscreenExit: 0,
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString()
        };
        
        console.log('📤 Mengirim data:', data);
        
        // Method 1: Fetch dengan JSON
        const response = await fetch(CONFIG.WEB_APP_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        console.log('✅ Data dikirim via fetch');
        
        // Method 2: Form submission sebagai backup
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = CONFIG.WEB_APP_URL;
        form.target = '_blank';
        
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'data';
        input.value = JSON.stringify(data);
        form.appendChild(input);
        
        document.body.appendChild(form);
        form.submit();
        setTimeout(() => document.body.removeChild(form), 1000);
        
        return true;
        
    } catch (error) {
        console.error('❌ Error mengirim data:', error);
        return false;
    }
}

// ===============================
// FUNGSI BANTU
// ===============================
function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min} menit ${sec} detik`;
}

function getDeviceType() {
    const ua = navigator.userAgent;
    if (/Android/.test(ua)) return 'Mobile (Android)';
    if (/iPhone|iPad/.test(ua)) return 'Mobile (iOS)';
    if (/Windows/.test(ua)) return 'Desktop (Windows)';
    if (/Mac/.test(ua)) return 'Desktop (Mac)';
    return 'Unknown';
}

function getOS() {
    const ua = navigator.userAgent;
    if (/Windows/.test(ua)) return 'Windows';
    if (/Mac/.test(ua)) return 'macOS';
    if (/Android/.test(ua)) return 'Android';
    if (/iOS/.test(ua)) return 'iOS';
    return 'Unknown';
}

function getBrowser() {
    const ua = navigator.userAgent;
    if (/Chrome/.test(ua)) return 'Chrome';
    if (/Firefox/.test(ua)) return 'Firefox';
    if (/Safari/.test(ua)) return 'Safari';
    if (/Edge/.test(ua)) return 'Edge';
    return 'Unknown';
}

function showResult(score, percentage, timeUsed) {
    document.getElementById('examSection').style.display = 'none';
    document.getElementById('resultSection').style.display = 'block';
    
    const grade = percentage >= 90 ? 'A' : 
                  percentage >= 80 ? 'B' : 
                  percentage >= 70 ? 'C' : 
                  percentage >= 60 ? 'D' : 'E';
    
    document.getElementById('resultCard').innerHTML = `
        <div class="result-header">
            <h2><i class="fas fa-award"></i> HASIL ULANGAN HARIAN</h2>
        </div>
        <div class="result-score">
            <div class="score-circle">
                <span class="score-value">${score}</span>
                <span class="score-total">/ 15</span>
            </div>
            <div class="score-percentage">${percentage}%</div>
            <div class="score-grade">${grade}</div>
        </div>
        <div class="result-details">
            <div class="detail-row">
                <span><i class="fas fa-user"></i> Nama</span>
                <span>${document.getElementById('nama').value}</span>
            </div>
            <div class="detail-row">
                <span><i class="fas fa-school"></i> Kelas</span>
                <span>${document.getElementById('kelas').value}</span>
            </div>
            <div class="detail-row">
                <span><i class="fas fa-clock"></i> Waktu Digunakan</span>
                <span>${formatTime(timeUsed)}</span>
            </div>
        </div>
        <div class="result-actions">
            <button class="btn-review" onclick="location.reload()">
                <i class="fas fa-redo"></i> UJIAN BARU
            </button>
        </div>
    `;
}

async function testConnection() {
    try {
        const response = await fetch(CONFIG.WEB_APP_URL + '?test=' + Date.now());
        console.log('✅ Koneksi Google Apps Script berhasil');
    } catch (error) {
        console.log('⚠️ Koneksi test gagal, tapi sistem tetap berjalan');
    }
}

// Tambahkan CSS untuk hasil
const resultCSS = document.createElement('style');
resultCSS.textContent = `
    .result-header { text-align: center; margin-bottom: 30px; }
    .result-score { text-align: center; margin: 30px 0; }
    .score-circle {
        width: 150px; height: 150px; border-radius: 50%;
        background: linear-gradient(135deg, #4CAF50, #2E7D32);
        color: white; display: flex; flex-direction: column;
        align-items: center; justify-content: center;
        margin: 0 auto; font-size: 2.5rem; font-weight: bold;
    }
    .score-total { font-size: 1.2rem; opacity: 0.8; }
    .score-percentage { font-size: 1.8rem; font-weight: bold; color: #2E7D32; margin: 10px 0; }
    .score-grade { font-size: 2rem; font-weight: bold; color: #1B5E20; }
    .result-details { background: #f9f9f9; padding: 20px; border-radius: 10px; margin: 20px 0; }
    .detail-row { display: flex; justify-content: space-between; margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px dashed #e0e0e0; }
    .detail-row:last-child { border-bottom: none; }
    .result-actions { text-align: center; margin-top: 30px; }
    .btn-review {
        background: #4CAF50; color: white; border: none;
        padding: 15px 30px; font-size: 1.1rem; border-radius: 10px;
        cursor: pointer; display: inline-flex; align-items: center; gap: 10px;
    }
    .btn-review:hover { background: #388E3C; }
`;
document.head.appendChild(resultCSS);

console.log('✅ Sistem siap digunakan!');
