document.addEventListener('DOMContentLoaded', function () {
  // Elemen DOM
  const identitySection = document.getElementById('identitySection');
  const identityForm = document.getElementById('identityForm');
  const quizForm = document.getElementById('quizForm');
  const resultBox = document.getElementById('result');
  const quizHeader = document.getElementById('quizHeader');
  const timerDisplay = document.getElementById('timerDisplay');
  const progressBar = document.getElementById('progressBar');
  const progressText = document.getElementById('progressText');

  let candidateData = {};
  let timerInterval = null;
  const TOTAL_QUESTIONS = 90;
  const TOTAL_TIME_SECONDS = 30 * 60; // 30 Menit (1800 Detik)
  let timeRemaining = TOTAL_TIME_SECONDS;

  // =========================================================
  // STEP 1: Submit Form Data Diri & Inisialisasi Tes
  // =========================================================
  identityForm.addEventListener('submit', function (event) {
    event.preventDefault();

    candidateData = {
      fullName: document.getElementById('fullName').value.trim(),
      email: document.getElementById('email').value.trim(),
      phone: document.getElementById('phone').value.trim(),
      gender: document.getElementById('gender').value,
      position: document.getElementById('position').value.trim()
    };

    // Transisi Halaman: Sembunyikan Data Diri, Tampilkan Header Sticky & Quiz
    identitySection.classList.add('hidden');
    quizHeader.classList.remove('hidden');
    quizForm.classList.remove('hidden');

    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Jalankan Timer & Siapkan Listener Progress
    startTimer();
    initProgressTracker();
  });

  // =========================================================
  // TIMER & PROGRESS TRACKER MANAGEMENT
  // =========================================================
  function startTimer() {
    updateTimerDisplay();

    timerInterval = setInterval(function () {
      timeRemaining--;
      updateTimerDisplay();

      if (timeRemaining <= 0) {
        clearInterval(timerInterval);
        alert("Waktu pengerjaan (30 menit) telah habis. Jawaban Anda akan otomatis dikirim.");
        processQuizSubmission(true);
      }
    }, 1000);
  }

  function updateTimerDisplay() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    timerDisplay.textContent = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

    // Peringatan Visual saat sisa waktu <= 5 Menit (300 Detik)
    if (timeRemaining <= 300) {
      quizHeader.classList.add('warning');
    }
  }

  function initProgressTracker() {
    // Event delegation untuk menghitung soal yang sudah dijawab
    quizForm.addEventListener('change', function () {
      const answeredQuestions = quizForm.querySelectorAll('.question-card input[type="radio"]:checked').length;
      const percentage = Math.round((answeredQuestions / TOTAL_QUESTIONS) * 100);

      // Update Progress Bar
      if (progressBar) progressBar.style.width = `${percentage}%`;
      if (progressText) progressText.textContent = `${answeredQuestions} / ${TOTAL_QUESTIONS} Soal (${percentage}%)`;
    });
  }

  // =========================================================
  // STEP 2: Submit Form Manual oleh Peserta
  // =========================================================
  quizForm.addEventListener('submit', function (event) {
    event.preventDefault();
    clearInterval(timerInterval);
    processQuizSubmission(false);
  });

  // =========================================================
  // STEP 3: Perhitungan 20 Aspek PAPI Kostick & Render Hasil
  // =========================================================
  function processQuizSubmission(isTimeOut) {
    // Inisialisasi 20 Skala PAPI Kostick (Skala 0 - 9)
    const papiScores = {
      // Scale Peran (Role)
      G: 0, L: 0, I: 0, T: 0, V: 0, S: 0, R: 0, D: 0, C: 0, E: 0,
      // Scale Kebutuhan (Need)
      N: 0, A: 0, P: 0, X: 0, B: 0, O: 0, Z: 0, K: 0, F: 0, W: 0
    };

    const questions = quizForm.querySelectorAll('.question-card');
    let answeredCount = 0;

    // Lepas atribut 'required' jika submit otomatis karena waktu habis (timeout)
    if (isTimeOut) {
      const radioInputs = quizForm.querySelectorAll('input[type="radio"]');
      radioInputs.forEach(input => input.removeAttribute('required'));
    }

    // Algoritma Pemetaan Jawaban ke 20 Aspek PAPI
    questions.forEach((question, index) => {
      const selected = question.querySelector('input:checked');

      if (selected) {
        answeredCount++;
        const val = Number(selected.value);
        const qNum = index + 1;

        // Distribusi Bobot Aspek
        if (val >= 4) {
          // Aspek Peran (Role)
          if (qNum % 10 === 1) papiScores.G++;
          else if (qNum % 10 === 2) papiScores.L++;
          else if (qNum % 10 === 3) papiScores.I++;
          else if (qNum % 10 === 4) papiScores.T++;
          else if (qNum % 10 === 5) papiScores.V++;
          else if (qNum % 10 === 6) papiScores.S++;
          else if (qNum % 10 === 7) papiScores.R++;
          else if (qNum % 10 === 8) papiScores.D++;
          else if (qNum % 10 === 9) papiScores.C++;
          else papiScores.E++;
        } else if (val <= 2) {
          // Aspek Kebutuhan (Need)
          if (qNum % 10 === 1) papiScores.N++;
          else if (qNum % 10 === 2) papiScores.A++;
          else if (qNum % 10 === 3) papiScores.P++;
          else if (qNum % 10 === 4) papiScores.X++;
          else if (qNum % 10 === 5) papiScores.B++;
          else if (qNum % 10 === 6) papiScores.O++;
          else if (qNum % 10 === 7) papiScores.Z++;
          else if (qNum % 10 === 8) papiScores.K++;
          else if (qNum % 10 === 9) papiScores.F++;
          else papiScores.W++;
        }
      }
    });

    // Perhitungan Total Skor Skala Peran & Kebutuhan
    const totalRole = papiScores.G + papiScores.L + papiScores.I + papiScores.T + papiScores.V +
                      papiScores.S + papiScores.R + papiScores.D + papiScores.C + papiScores.E;

    const totalNeed = papiScores.N + papiScores.A + papiScores.P + papiScores.X + papiScores.B +
                      papiScores.O + papiScores.Z + papiScores.K + papiScores.F + papiScores.W;

    const grandTotal = totalRole + totalNeed;

    // Sembunyikan Form & Header
    quizHeader.classList.add('hidden');
    quizForm.classList.add('hidden');

    // Render Tampilan Hasil
    resultBox.classList.remove('hidden');
    resultBox.innerHTML = `
      <div style="border-bottom: 2px solid var(--border-color); padding-bottom: 12px; margin-bottom: 20px;">
        <h2 style="margin: 0; color: var(--primary);">Hasil Assessment Psikotes PAPI Kostick</h2>
        <p style="margin: 4px 0 0; color: var(--text-muted); font-size: 0.95rem
