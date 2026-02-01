// ============================================
// SCRIPT UTAMA - DETEKSI KECURANGAN OTOMATIS
// ============================================

// Konfigurasi
const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbw3Un2_r8D_81K699B6mjcCd-SRcnxFOyanWVGVZipm5W_XsSE9ad4rJeE19V__Ffyvmw/exec'; // Ganti dengan URL Google Apps Script
const EXAM_DURATION = 13 * 60 + 45; // 13 menit 45 detik
const MAX_TAB_CHANGES = 0; // Maksimal 0 kali ganti tab
const MAX_WARNINGS = 1; // Maksimal 1 peringatan

// Data Soal (15 soal)
const soalData = [
    // Soal 1
    {
        id: 1,
        soal: "Saat pertama kali datang, Jepang menyebut dirinya sebagai...",
        pilihan: ["Saudara Muda Asia", "Saudara Tua Asia", "Penjajah Baru Asia", "Sekutu Asia", "Tamu Asia"],
        jawaban: 1 // index 1 = "Saudara Tua Asia"
    },
    // Soal 2
    {
        id: 2,
        soal: "Tujuan utama Jepang menjajah Indonesia adalah untuk mengambil...",
        pilihan: ["Rempah-rempah", "Bahan baku industri dan perang seperti minyak", "Karya seni dan budaya", "Tenaga ahli Indonesia", "Ilmu pengetahuan dari Belanda"],
        jawaban: 1
    },
    // Soal 3
    {
        id: 3,
        soal: "Apa yang terjadi dengan bendera Merah Putih pada awal masa Jepang?",
        pilihan: ["Dilarang dikibarkan", "Dijadikan bendera resmi", "Diizinkan dikibarkan setiap hari", "Warnanya diubah", "Dikibarkan bersama bendera Belanda"],
        jawaban: 0
    },
    // Soal 4
    {
        id: 4,
        soal: "Kerja paksa tanpa bayaran pada masa Jepang disebut...",
        pilihan: ["Rodi", "Romusha", "Heiho", "Wajib kerja", "Tanam paksa"],
        jawaban: 1
    },
    // Soal 5
    {
        id: 5,
        soal: "Bahasa resmi yang diwajibkan Jepang di sekolah dan kantor adalah...",
        pilihan: ["Belanda dan Inggris", "Jepang dan Indonesia", "Jawa dan Melayu", "Daerah masing-masing", "Belanda dan Jepang"],
        jawaban: 1
    },
    // Soal 6
    {
        id: 6,
        soal: "Organisasi yang dibentuk Jepang dan dipimpin Soekarno-Hatta untuk mengerahkan tenaga rakyat membantu Jepang adalah...",
        pilihan: ["BPUPKI", "Putera", "Gerakan 3A", "PETA", "Seinendan"],
        jawaban: 1
    },
    // Soal 7
    {
        id: 7,
        soal: "Barisan pembantu polisi yang anggotanya para pemuda lokal disebut...",
        pilihan: ["Seinendan", "Keibodan", "Heiho", "Romusha", "Kempetai"],
        jawaban: 1
    },
    // Soal 8
    {
        id: 8,
        soal: "Kebijakan Jepang yang memaksa petani menyerahkan hasil padinya disebut sistem...",
        pilihan: ["Sewa tanah", "Wajib serah (setoran)", "Ekspor bebas", "Tanam paksa", "Iuran wajib"],
        jawaban: 1
    },
    // Soal 9
    {
        id: 9,
        soal: "Mengapa Jepang melarang penggunaan bahasa Belanda dan mewajibkan bahasa Jepang serta Indonesia?",
        pilihan: ["Karena bahasa Belanda sulit dipelajari.", "Untuk menghapus pengaruh Barat dan mengontrol pikiran rakyat.", "Karena tidak ada guru bahasa Belanda.", "Agar rakyat bisa bekerja di perusahaan Jepang.", "Untuk mempersatukan semua suku di Indonesia."],
        jawaban: 1
    },
    // Soal 10
    {
        id: 10,
        soal: "Upacara menyembah Kaisar Jepang dengan membungkuk ke arah Tokyo disebut...",
        pilihan: ["Harakiri", "Seikerei", "Sumpah Pemuda", "Meditasi", "Bakti sosial"],
        jawaban: 1
    },
    // Soal 11
    {
        id: 11,
        soal: "Pulau Jawa pada masa Jepang diperintah oleh tentara...",
        pilihan: ["Darat (Rikugun)", "Laut (Kaigun)", "Udara", "Gabungan", "Sekutu"],
        jawaban: 0
    },
    // Soal 12
    {
        id: 12,
        soal: "Polisi militer rahasia Jepang yang terkenal kejam adalah...",
        pilihan: ["Heiho", "Kempetai", "Seinendan", "Keibodan", "Tokkeitai"],
        jawaban: 1
    },
    // Soal 13
    {
        id: 13,
        soal: "Tanaman yang wajib ditanam rakyat untuk bahan pelumas mesin perang adalah...",
        pilihan: ["Teh", "Kopi", "Jarak", "Padi", "Karet"],
        jawaban: 2
    },
    // Soal 14
    {
        id: 14,
        soal: "Partai-partai politik zaman Belanda saat Jepang datang...",
        pilihan: ["Diberi kebebasan", "Dibubarkan", "Dijadikan satu partai", "Diizinkan berprotes", "Dibiarkan saja"],
        jawaban: 1
    },
    // Soal 15
    {
        id: 15,
        soal: "Janji Jepang yang paling menarik bagi rakyat Indonesia adalah...",
        pilihan: ["Gaji yang besar", "Indonesia akan dimerdekakan", "Banyak lowongan kerja", "Pendidikan gratis", "Tanah untuk petani"],
        jawaban: 1
    }
];

// Variabel Global
let jawabanUser = Array(soalData.length).fill(null);
let currentQuestion = 0;
let timeLeft = EXAM_DURATION;
let timerInterval;
let examStarted = false;
let startTime;
let endTime;

// Variabel Deteksi Kecurangan
let tabChangeCount = 0;
let rightClickCount = 0;
let copyAttemptCount = 0;
let f12Pressed = false;
let fullscreenExitCount = 0;
let warningCount = 0;
let isCheatingDetected = false;
let cheatingReason = "";

// DOM Elements
const dataSection = document.getElementById('dataSection');
const examSection = document.getElementById('examSection');
const resultSection = document.getElementById('resultSection');
const cheatingSection = document.getElementById('cheatingSection');

const btnStart = document.getElementById('btnStart');
const btnPrev = document.getElementById('btnPrev');
const btnNext = document.getElementById('btnNext');
const btnSubmit = document.getElementById('btnSubmit');
const btnReturnHome = document.getElementById('btnReturnHome');

const timerElement = document.getElementById('timer');
const tabCountElement = document.getElementById('tabCount');
const rightClickCountElement = document.getElementById('rightClickCount');
const warningCountElement = document.getElementById('warningCount');
const questionsContainer = document.getElementById('questionsContainer');
const currentQuestionElement = document.getElementById('currentQuestion');

// ===============================
// FUNGSI DETEKSI KECURANGAN
// ===============================

function initCheatingDetection() {
    console.log("🛡️ Sistem deteksi kecurangan diaktifkan...");
    
    // 1. Deteksi Pergantian Tab/Window
    document.addEventListener('visibilitychange', () => {
        if (examStarted && !isCheatingDetected) {
            if (document.hidden) {
                tabChangeCount++;
                tabCountElement.textContent = tabChangeCount;
                
                if (tabChangeCount >= MAX_TAB_CHANGES) {
                    cheatingReason = `Terlalu sering berganti tab (${tabChangeCount}x)`;
                    stopExamForCheating();
                } else {
                    showWarning(`PERINGATAN ${tabChangeCount}: Jangan keluar dari halaman ujian!`);
                }
            }
        }
    });
    
    // 2. Deteksi Klik Kanan (Copy/Paste)
    document.addEventListener('contextmenu', (e) => {
        if (examStarted && !isCheatingDetected) {
            e.preventDefault();
            rightClickCount++;
            rightClickCountElement.textContent = rightClickCount;
            
            if (rightClickCount >= 2) {
                cheatingReason = `Melakukan klik kanan berulang (${rightClickCount}x)`;
                stopExamForCheating();
            } else {
                showWarning("DILARANG menggunakan klik kanan!");
            }
        }
    });
    
    // 3. Deteksi Copy (Ctrl+C)
    document.addEventListener('copy', (e) => {
        if (examStarted && !isCheatingDetected) {
            e.preventDefault();
            copyAttemptCount++;
            cheatingReason = `Mencoba menyalin teks (copy)`;
            stopExamForCheating();
        }
    });
    
    // 4. Deteksi Developer Tools (F12, Ctrl+Shift+I, dll)
    document.addEventListener('keydown', (e) => {
        if (!examStarted || isCheatingDetected) return;
        
        // F12
        if (e.key === 'F12') {
            e.preventDefault();
            f12Pressed = true;
            cheatingReason = "Menekan F12 (Developer Tools)";
            stopExamForCheating();
        }
        
        // Ctrl+Shift+I
        if (e.ctrlKey && e.shiftKey && e.key === 'I') {
            e.preventDefault();
            cheatingReason = "Membuka Developer Tools (Ctrl+Shift+I)";
            stopExamForCheating();
        }
        
        // Ctrl+Shift+J
        if (e.ctrlKey && e.shiftKey && e.key === 'J') {
            e.preventDefault();
            cheatingReason = "Membuka Console (Ctrl+Shift+J)";
            stopExamForCheating();
        }
        
        // Ctrl+Shift+C
        if (e.ctrlKey && e.shiftKey && e.key === 'C') {
            e.preventDefault();
            cheatingReason = "Mencoba inspect element (Ctrl+Shift+C)";
            stopExamForCheating();
        }
        
        // Print Screen
        if (e.key === 'PrintScreen') {
            e.preventDefault();
            cheatingReason = "Mencoba screenshot (Print Screen)";
            stopExamForCheating();
        }
    });
    
    // 5. Deteksi Keluar Fullscreen
    document.addEventListener('fullscreenchange', () => {
        if (examStarted && !isCheatingDetected && !document.fullscreenElement) {
            fullscreenExitCount++;
            if (fullscreenExitCount >= 2) {
                cheatingReason = "Keluar dari mode fullscreen berulang kali";
                stopExamForCheating();
            }
        }
    });
    
    // 6. Deteksi Resize Window (Dev Tools biasanya merubah ukuran)
    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;
    window.addEventListener('resize', () => {
        if (!examStarted || isCheatingDetected) return;
        
        // Jika perubahan ukuran signifikan (>300px), curiga dev tools
        if (Math.abs(window.innerWidth - windowWidth) > 300 || 
            Math.abs(window.innerHeight - windowHeight) > 300) {
            cheatingReason = "Perubahan ukuran window yang tidak wajar (diduga membuka Dev Tools)";
            stopExamForCheating();
        }
        
        windowWidth = window.innerWidth;
        windowHeight = window.innerHeight;
    });
    
    // 7. Deteksi Attempt to Switch App (Alt+Tab, Windows Key, etc)
    document.addEventListener('keydown', (e) => {
        if (!examStarted || isCheatingDetected) return;
        
        // Alt+Tab
        if (e.altKey && e.key === 'Tab') {
            e.preventDefault();
            warningCount++;
            warningCountElement.textContent = warningCount;
            
            if (warningCount >= MAX_WARNINGS) {
                cheatingReason = "Terlalu banyak peringatan keyboard shortcut";
                stopExamForCheating();
            }
        }
        
        // Windows Key / Command Key
        if (e.key === 'Meta' || e.key === 'OS') {
            warningCount++;
            warningCountElement.textContent = warningCount;
            
            if (warningCount >= MAX_WARNINGS) {
                cheatingReason = "Menggunakan Windows/Command Key berulang";
                stopExamForCheating();
            }
        }
    });
    
    // 8. Deteksi Tab Baru (Ctrl+T, Ctrl+N)
    document.addEventListener('keydown', (e) => {
        if (!examStarted || isCheatingDetected) return;
        
        if ((e.ctrlKey && e.key === 't') || (e.ctrlKey && e.key === 'n')) {
            e.preventDefault();
            cheatingReason = "Mencoba membuka tab/window baru";
            stopExamForCheating();
        }
    });
}

// Fungsi untuk menghentikan ujian karena kecurangan
async function stopExamForCheating() {
    if (isCheatingDetected) return;
    
    isCheatingDetected = true;
    clearInterval(timerInterval);
    
    // Tampilkan pesan kecurangan
    showCheatingScreen();
    
    // Hitung skor sejauh ini
    const score = calculateScore();
    const percentage = Math.round((score / soalData.length) * 100);
    const timeUsed = Math.floor((new Date() - startTime) / 1000);
    
    // Kirim data ke Google Sheets
    await sendToGoogleSheets({
        nama: document.getElementById('nama').value,
        kelas: document.getElementById('kelas').value,
        skor: score,
        jawabanBenar: score,
        totalSoal: soalData.length,
        persentase: percentage + "%",
        waktuDigunakan: formatTime(timeUsed),
        statusUjian: "DIHENTIKAN",
        alasanHenti: cheatingReason,
        tabChanges: tabChangeCount,
        copyAttempts: copyAttemptCount,
        rightClicks: rightClickCount,
        f12Pressed: f12Pressed ? 1 : 0,
        fullscreenExit: fullscreenExitCount,
        startTime: startTime.toISOString(),
        endTime: new Date().toISOString(),
        ...getDeviceInfo()
    });
}

// Tampilkan layar kecurangan
function showCheatingScreen() {
    examSection.style.display = 'none';
    cheatingSection.style.display = 'block';
    
    document.getElementById('cheatingName').textContent = document.getElementById('nama').value;
    document.getElementById('cheatingClass').textContent = document.getElementById('kelas').value;
    document.getElementById('cheatingTime').textContent = new Date().toLocaleString('id-ID');
    document.getElementById('cheatingReason').textContent = cheatingReason;
    document.getElementById('cheatingViolation').textContent = getViolationSummary();
}

function getViolationSummary() {
    const violations = [];
    if (tabChangeCount > 0) violations.push(`Ganti tab: ${tabChangeCount}x`);
    if (rightClickCount > 0) violations.push(`Klik kanan: ${rightClickCount}x`);
    if (copyAttemptCount > 0) violations.push(`Copy: ${copyAttemptCount}x`);
    if (f12Pressed) violations.push(`F12: Ya`);
    if (fullscreenExitCount > 0) violations.push(`Keluar fullscreen: ${fullscreenExitCount}x`);
    
    return violations.join(', ') || "Tidak ada data";
}

// Tampilkan peringatan
function showWarning(message) {
    const warning = document.createElement('div');
    warning.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #FF9800;
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(255,152,0,0.3);
        z-index: 9999;
        font-weight: bold;
        animation: slideIn 0.5s ease;
        display: flex;
        align-items: center;
        gap: 10px;
    `;
    
    warning.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    document.body.appendChild(warning);
    
    setTimeout(() => {
        warning.style.animation = 'slideOut 0.5s ease';
        setTimeout(() => warning.remove(), 500);
    }, 3000);
}

// ===============================
// FUNGSI UTAMA UJIAN
// ===============================

// Mulai ujian
btnStart.addEventListener('click', () => {
    const nama = document.getElementById('nama').value.trim();
    const kelas = document.getElementById('kelas').value;
    
    if (!nama || !kelas) {
        alert("Harap isi nama lengkap dan pilih kelas!");
        return;
    }
    
    // Update info siswa
    document.getElementById('studentName').textContent = nama;
    document.getElementById('studentClass').textContent = kelas;
    
    // Tampilkan section ujian
    dataSection.style.display = 'none';
    examSection.style.display = 'block';
    
    // Mulai timer
    startTime = new Date();
    startTimer();
    
    // Aktifkan deteksi kecurangan
    examStarted = true;
    initCheatingDetection();
    
    // Request fullscreen
    if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {
            showWarning("Mode fullscreen tidak aktif. Tetap jujur!");
        });
    }
    
    // Load soal pertama
    loadQuestion(currentQuestion);
});

// Timer
function startTimer() {
    updateTimerDisplay();
    
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            if (!isCheatingDetected) {
                submitExam();
            }
        }
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // Warna peringatan
    if (timeLeft <= 60) {
        timerElement.style.color = '#f44336';
        timerElement.style.animation = 'pulse 1s infinite';
    }
}

// Load soal
function loadQuestion(index) {
    questionsContainer.innerHTML = '';
    currentQuestionElement.textContent = index + 1;
    
    const question = soalData[index];
    
    const questionHTML = `
        <div class="question-card">
            <div class="question-number">${question.id}</div>
            <div class="question-text">${question.soal}</div>
            <div class="options-container">
                ${question.pilihan.map((option, i) => `
                    <div class="option ${jawabanUser[index] === i ? 'selected' : ''}" 
                         data-index="${i}" 
                         onclick="selectAnswer(${index}, ${i})">
                        <div class="option-letter">${String.fromCharCode(65 + i)}</div>
                        <div class="option-text">${option}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    questionsContainer.innerHTML = questionHTML;
    
    // Update tombol navigasi
    btnPrev.disabled = index === 0;
    btnNext.disabled = index === soalData.length - 1;
    btnNext.innerHTML = index === soalData.length - 1 ? 
        'REVIEW SOAL <i class="fas fa-check-circle"></i>' : 
        'SELANJUTNYA <i class="fas fa-arrow-right"></i>';
}

// Pilih jawaban
window.selectAnswer = (questionIndex, answerIndex) => {
    if (isCheatingDetected) return;
    
    jawabanUser[questionIndex] = answerIndex;
    
    // Update tampilan
    const options = document.querySelectorAll('.option');
    options.forEach((option, i) => {
        const idx = parseInt(option.dataset.index);
        option.classList.toggle('selected', idx === answerIndex);
    });
};

// Navigasi soal
btnPrev.addEventListener('click', () => {
    if (currentQuestion > 0) {
        currentQuestion--;
        loadQuestion(currentQuestion);
    }
});

btnNext.addEventListener('click', () => {
    if (currentQuestion < soalData.length - 1) {
        currentQuestion++;
        loadQuestion(currentQuestion);
    } else if (currentQuestion === soalData.length - 1) {
        // Jika di soal terakhir, tampilkan konfirmasi submit
        if (confirm("Apakah Anda yakin ingin mengumpulkan jawaban? Pastikan semua soal sudah terjawab.")) {
            submitExam();
        }
    }
});

// Submit ujian
btnSubmit.addEventListener('click', () => {
    if (isCheatingDetected) return;
    
    const unanswered = jawabanUser.filter(a => a === null).length;
    if (unanswered > 0) {
        if (!confirm(`Masih ada ${unanswered} soal yang belum terjawab. Yakin tetap ingin mengumpulkan?`)) {
            return;
        }
    }
    
    submitExam();
});

async function submitExam() {
    clearInterval(timerInterval);
    endTime = new Date();
    
    // Hitung skor
    const score = calculateScore();
    const percentage = Math.round((score / soalData.length) * 100);
    const timeUsed = Math.floor((endTime - startTime) / 1000);
    
    // Tampilkan hasil
    showResult(score, percentage, timeUsed);
    
    // Kirim data ke Google Sheets
    await sendToGoogleSheets({
        nama: document.getElementById('nama').value,
        kelas: document.getElementById('kelas').value,
        skor: score,
        jawabanBenar: score,
        totalSoal: soalData.length,
        persentase: percentage + "%",
        waktuDigunakan: formatTime(timeUsed),
        statusUjian: "SELESAI",
        alasanHenti: "Waktu habis / Selesai mengerjakan",
        tabChanges: tabChangeCount,
        copyAttempts: copyAttemptCount,
        rightClicks: rightClickCount,
        f12Pressed: f12Pressed ? 1 : 0,
        fullscreenExit: fullscreenExitCount,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        ...getDeviceInfo()
    });
}

// Hitung skor
function calculateScore() {
    let score = 0;
    soalData.forEach((question, index) => {
        if (jawabanUser[index] === question.jawaban) {
            score++;
        }
    });
    return score;
}

// Tampilkan hasil
function showResult(score, percentage, timeUsed) {
    examSection.style.display = 'none';
    resultSection.style.display = 'block';
    
    const grade = getGrade(percentage);
    
    const resultHTML = `
        <div class="result-header">
            <h2><i class="fas fa-award"></i> HASIL ULANGAN HARIAN</h2>
            <p class="result-subtitle">${grade.message}</p>
        </div>
        
        <div class="result-score">
            <div class="score-circle">
                <span class="score-value">${score}</span>
                <span class="score-total">/ ${soalData.length}</span>
            </div>
            <div class="score-percentage">${percentage}%</div>
            <div class="score-grade">${grade.letter}</div>
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
            <div class="detail-row">
                <span><i class="fas fa-calendar"></i> Tanggal Ujian</span>
                <span>${new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
        </div>
        
        <div class="result-actions">
            <button class="btn-review" onclick="reviewAnswers()">
                <i class="fas fa-eye"></i> REVIEW JAWABAN
            </button>
            <button class="btn-new" onclick="location.reload()">
                <i class="fas fa-redo"></i> UJIAN BARU
            </button>
        </div>
    `;
    
    document.getElementById('resultCard').innerHTML = resultHTML;
}

function getGrade(percentage) {
    if (percentage >= 90) return { letter: "A", message: "Sangat Baik! Pertahankan!" };
    if (percentage >= 80) return { letter: "B", message: "Baik! Tingkatkan lagi!" };
    if (percentage >= 70) return { letter: "C", message: "Cukup. Perlu belajar lebih giat!" };
    if (percentage >= 60) return { letter: "D", message: "Kurang. Silakan remidi!" };
    return { letter: "E", message: "Sangat Kurang. Wajib remidi!" };
}

// ===============================
// FUNGSI BANTU
// ===============================

// Format waktu
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins} menit ${secs} detik`;
}

// Get device info
function getDeviceInfo() {
    const ua = navigator.userAgent;
    let device = "Desktop";
    let os = "Unknown";
    let browser = "Unknown";
    
    // Device
    if (/Android/.test(ua)) device = "Mobile (Android)";
    else if (/iPhone|iPad|iPod/.test(ua)) device = "Mobile (iOS)";
    else if (/Windows/.test(ua)) device = "Desktop (Windows)";
    else if (/Mac/.test(ua)) device = "Desktop (Mac)";
    else if (/Linux/.test(ua)) device = "Desktop (Linux)";
    
    // OS
    if (/Windows NT 10/.test(ua)) os = "Windows 10/11";
    else if (/Windows NT 6.3/.test(ua)) os = "Windows 8.1";
    else if (/Windows NT 6.2/.test(ua)) os = "Windows 8";
    else if (/Windows NT 6.1/.test(ua)) os = "Windows 7";
    else if (/Mac/.test(ua)) os = "macOS";
    else if (/Android/.test(ua)) os = "Android";
    else if (/iOS|iPhone|iPad/.test(ua)) os = "iOS";
    
    // Browser
    if (/Chrome/.test(ua) && !/Edge/.test(ua)) browser = "Chrome";
    else if (/Firefox/.test(ua)) browser = "Firefox";
    else if (/Safari/.test(ua) && !/Chrome/.test(ua)) browser = "Safari";
    else if (/Edge/.test(ua)) browser = "Edge";
    else if (/Opera/.test(ua)) browser = "Opera";
    
    return {
        deviceType: device,
        os: os,
        browser: browser,
        resolution: `${screen.width} x ${screen.height}`,
        userAgent: ua.substring(0, 150),
        ipAddress: "Fetching..."
    };
}

// Kirim data ke Google Sheets
async function sendToGoogleSheets(data) {
    try {
        console.log("📤 Mengirim data ke Google Sheets...", data);
        
        // Gunakan form submission untuk bypass CORS
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = WEB_APP_URL;
        form.target = '_blank';
        
        // Tambahkan data sebagai input hidden
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'data';
        input.value = JSON.stringify(data);
        form.appendChild(input);
        
        // Submit form
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
        
        console.log("✅ Data berhasil dikirim");
        
    } catch (error) {
        console.error("❌ Gagal mengirim data:", error);
    }
}

// Review jawaban
window.reviewAnswers = function() {
    resultSection.style.display = 'none';
    examSection.style.display = 'block';
    
    // Tampilkan semua soal dengan jawaban
    let reviewHTML = '';
    soalData.forEach((question, index) => {
        const userAnswer = jawabanUser[index];
        const isCorrect = userAnswer === question.jawaban;
        
        reviewHTML += `
            <div class="question-card ${isCorrect ? 'correct' : 'wrong'}">
                <div class="question-number">${question.id}</div>
                <div class="question-text">${question.soal}</div>
                <div class="options-container">
                    ${question.pilihan.map((option, i) => {
                        let optionClass = 'option';
                        if (i === userAnswer) optionClass += ' user-answer';
                        if (i === question.jawaban) optionClass += ' correct-answer';
                        
                        return `
                            <div class="${optionClass}">
                                <div class="option-letter">${String.fromCharCode(65 + i)}</div>
                                <div class="option-text">${option}</div>
                                ${i === question.jawaban ? '<i class="fas fa-check correct-icon"></i>' : ''}
                                ${i === userAnswer && !isCorrect ? '<i class="fas fa-times wrong-icon"></i>' : ''}
                            </div>
                        `;
                    }).join('')}
                </div>
                <div class="answer-status">
                    ${isCorrect ? 
                        '<span class="status-correct"><i class="fas fa-check"></i> BENAR</span>' : 
                        `<span class="status-wrong"><i class="fas fa-times"></i> SALAH. Jawaban benar: ${String.fromCharCode(65 + question.jawaban)}</span>`
                    }
                </div>
            </div>
        `;
    });
    
    questionsContainer.innerHTML = reviewHTML;
    
    // Update CSS untuk review
    const style = document.createElement('style');
    style.textContent = `
        .correct { border-left-color: #4CAF50; }
        .wrong { border-left-color: #f44336; }
        .user-answer { background: #FFEBEE !important; border-color: #f44336 !important; }
        .correct-answer { background: #E8F5E9 !important; border-color: #4CAF50 !important; }
        .correct-icon { color: #4CAF50; margin-left: 10px; }
        .wrong-icon { color: #f44336; margin-left: 10px; }
        .answer-status { margin-top: 15px; padding: 10px; border-radius: 5px; }
        .status-correct { background: #C8E6C9; color: #2E7D32; padding: 5px 10px; border-radius: 5px; }
        .status-wrong { background: #FFCDD2; color: #D32F2F; padding: 5px 10px; border-radius: 5px; }
    `;
    document.head.appendChild(style);
    
    // Sembunyikan navigasi dan tombol submit
    document.querySelector('.navigation').style.display = 'none';
    document.querySelector('.submit-section').style.display = 'none';
    
    // Tambahkan tombol kembali
    const backButton = document.createElement('div');
    backButton.innerHTML = `
        <button class="btn-return" onclick="location.reload()" style="margin: 20px auto; display: block;">
            <i class="fas fa-home"></i> KEMBALI KE HALAMAN AWAL
        </button>
    `;
    questionsContainer.appendChild(backButton);
};

// Return to home
btnReturnHome.addEventListener('click', () => {
    location.reload();
});

// Tambahkan CSS animasi
const animationCSS = document.createElement('style');
animationCSS.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    @keyframes pulse {
        0% { opacity: 1; }
        50% { opacity: 0.5; }
        100% { opacity: 1; }
    }
`;
document.head.appendChild(animationCSS);


console.log("🚀 Sistem Ulangan Harian siap digunakan!");

