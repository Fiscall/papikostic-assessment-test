document.addEventListener('DOMContentLoaded', function () {
  const identitySection = document.getElementById('identitySection');
  const identityForm = document.getElementById('identityForm');
  const quizForm = document.getElementById('quizForm');
  const resultBox = document.getElementById('result');
  const timerBar = document.getElementById('timerBar');
  const timerDisplay = document.getElementById('timerDisplay');

  let candidateData = {};
  let timerInterval = null;
  const TOTAL_TIME_SECONDS = 30 * 60; // 30 Menit
  let timeRemaining = TOTAL_TIME_SECONDS;

  // STEP 1: Submit Form Data Diri & Mulai Timer
  identityForm.addEventListener('submit', function (event) {
    event.preventDefault();

    candidateData = {
      fullName: document.getElementById('fullName').value.trim(),
      email: document.getElementById('email').value.trim(),
      phone: document.getElementById('phone').value.trim(),
      gender: document.getElementById('gender').value,
      position: document.getElementById('position').value.trim()
    };

    identitySection.classList.add('hidden');
    timerBar.classList.remove('hidden');
    quizForm.classList.remove('hidden');

    window.scrollTo({ top: 0, behavior: 'smooth' });
    startTimer();
  });

  // Fungsi Timer
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

    if (timeRemaining <= 300) {
      timerBar.classList.add('warning');
    }
  }

  // STEP 2: Submit Form Manual
  quizForm.addEventListener('submit', function (event) {
    event.preventDefault();
    clearInterval(timerInterval);
    processQuizSubmission(false);
  });

  // STEP 3: Kalkulasi 20 Aspek PAPI Kostick
  function processQuizSubmission(isTimeOut) {
    // Inisialisasi 20 Aspek PAPI Kostick (0-9 Scale)
    const papiScores = {
      // Role / Peran
      G: 0, L: 0, I: 0, T: 0, V: 0, S: 0, R: 0, D: 0, C: 0, E: 0,
      // Need / Kebutuhan
      N: 0, A: 0, P: 0, X: 0, B: 0, O: 0, Z: 0, K: 0, F: 0, W: 0
    };

    const questions = quizForm.querySelectorAll('.question');
    let answeredCount = 0;

    if (isTimeOut) {
      const radioInputs = quizForm.querySelectorAll('input[type="radio"]');
      radioInputs.forEach(input => input.removeAttribute('required'));
    }

    // Pemetaan Jawaban ke Aspek PAPI Kostick
    questions.forEach((question, index) => {
      const selected = question.querySelector('input:checked');

      if (selected) {
        answeredCount++;
        const val = Number(selected.value);
        const qNum = index + 1;

        // Distribusi Bobot Aspek berdasarkan nomor soal
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

    // Total Skor Peran & Kebutuhan
    const totalRole = papiScores.G + papiScores.L + papiScores.I + papiScores.T + papiScores.V + 
                      papiScores.S + papiScores.R + papiScores.D + papiScores.C + papiScores.E;

    const totalNeed = papiScores.N + papiScores.A + papiScores.P + papiScores.X + papiScores.B + 
                      papiScores.O + papiScores.Z + papiScores.K + papiScores.F + papiScores.W;

    const grandTotal = totalRole + totalNeed;

    // Sembunyikan Timer dan Form
    timerBar.classList.add('hidden');
    quizForm.classList.add('hidden');

    // Tampilkan Hasil Assessment
    resultBox.classList.remove('hidden');
    resultBox.innerHTML = `
      <h2>Hasil Assessment Psikotes PAPI Kostick</h2>
      ${isTimeOut ? '<p style="color:#b91c1c; font-weight:bold; background:#fee2e2; padding:10px; border-radius:6px;">⚠️ Waktu pengerjaan telah habis. Hasil di bawah berdasarkan jawaban yang berhasil terisi.</p>' : ''}

      <div class="candidate-summary">
        <h3>Data Peserta</h3>
        <p><strong>Nama Lengkap:</strong> ${candidateData.fullName}</p>
        <p><strong>Email:</strong> ${candidateData.email}</p>
        <p><strong>No. HP / WhatsApp:</strong> ${candidateData.phone}</p>
        <p><strong>Jenis Kelamin:</strong> ${candidateData.gender}</p>
        <p><strong>Posisi Dilamar:</strong> ${candidateData.position}</p>
        <p><strong>Total Soal Terjawab:</strong> ${answeredCount} dari 90 Soal</p>
      </div>

      <div class="papi-results-container">
        <h3>Profil Kepribadian PAPI Kostick</h3>
        
        <!-- BAGIAN PERAN (ROLE) -->
        <div class="papi-group">
          <h4>Skala Peran (Role) — Total Score: ${totalRole}</h4>
          <div class="papi-grid">
            <div class="papi-card"><span class="code">G</span><span class="score">${papiScores.G}</span><span class="label">Hard Work</span></div>
            <div class="papi-card"><span class="code">L</span><span class="score">${papiScores.L}</span><span class="label">Leadership</span></div>
            <div class="papi-card"><span class="code">I</span><span class="score">${papiScores.I}</span><span class="label">Decision Making</span></div>
            <div class="papi-card"><span class="code">T</span><span class="score">${papiScores.T}</span><span class="label">Pace</span></div>
            <div class="papi-card"><span class="code">V</span><span class="score">${papiScores.V}</span><span class="label">Vigorousness</span></div>
            <div class="papi-card"><span class="code">S</span><span class="score">${papiScores.S}</span><span class="label">Social Extension</span></div>
            <div class="papi-card"><span class="code">R</span><span class="score">${papiScores.R}</span><span class="label">Theoretical Type</span></div>
            <div class="papi-card"><span class="code">D</span><span class="score">${papiScores.D}</span><span class="label">Detail Conscious</span></div>
            <div class="papi-card"><span class="code">C</span><span class="score">${papiScores.C}</span><span class="label">Organized</span></div>
            <div class="papi-card"><span class="code">E</span><span class="score">${papiScores.E}</span><span class="label">Emotional Control</span></div>
          </div>
          <p class="summary-text">G: ${papiScores.G}, L: ${papiScores.L}, I: ${papiScores.I}, T: ${papiScores.T}, V: ${papiScores.V}, S: ${papiScores.S}, R: ${papiScores.R}, D: ${papiScores.D}, C: ${papiScores.C}, E: ${papiScores.E} <strong>(Total: ${totalRole})</strong></p>
        </div>

        <!-- BAGIAN KEBUTUHAN (NEED) -->
        <div class="papi-group">
          <h4>Skala Kebutuhan (Need) — Total Score: ${totalNeed}</h4>
          <div class="papi-grid">
            <div class="papi-card"><span class="code">N</span><span class="score">${papiScores.N}</span><span class="label">Need to Finish</span></div>
            <div class="papi-card"><span class="code">A</span><span class="score">${papiScores.A}</span><span class="label">Need to Achieve</span></div>
            <div class="papi-card"><span class="code">P</span><span class="score">${papiScores.P}</span><span class="label">Need to Control</span></div>
            <div class="papi-card"><span class="code">X</span><span class="score">${papiScores.X}</span><span class="label">Need to be Noticed</span></div>
            <div class="papi-card"><span class="code">B</span><span class="score">${papiScores.B}</span><span class="label">Need to Belong</span></div>
            <div class="papi-card"><span class="code">O</span><span class="score">${papiScores.O}</span><span class="label">Need for Affection</span></div>
            <div class="papi-card"><span class="code">Z</span><span class="score">${papiScores.Z}</span><span class="label">Need for Change</span></div>
            <div class="papi-card"><span class="code">K</span><span class="score">${papiScores.K}</span><span class="label">Need to be Forceful</span></div>
            <div class="papi-card"><span class="code">F</span><span class="score">${papiScores.F}</span><span class="label">Need to Follow</span></div>
            <div class="papi-card"><span class="code">W</span><span class="score">${papiScores.W}</span><span class="label">Need for Rules</span></div>
          </div>
          <p class="summary-text">N: ${papiScores.N}, A: ${papiScores.A}, P: ${papiScores.P}, X: ${papiScores.X}, B: ${papiScores.B}, O: ${papiScores.O}, Z: ${papiScores.Z}, K: ${papiScores.K}, F: ${papiScores.F}, W: ${papiScores.W} <strong>(Total: ${totalNeed})</strong></p>
        </div>

        <div class="grand-total-box">
          <strong>TOTAL SKOR KESELURUHAN (ROLE + NEED): ${grandTotal} / 90</strong>
        </div>
      </div>
    `;

    window.scrollTo({ top: resultBox.offsetTop - 20, behavior: 'smooth' });
  }
});
