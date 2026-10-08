document.addEventListener('DOMContentLoaded', function () {
  const descriptions = {
    A: {
      title: 'Leadership / Action Type',
      text: 'Anda adalah pribadi yang berorientasi pada tindakan, memiliki rasa percaya diri tinggi, dan berfokus pada hasil. Anda sigap mengambil inisiatif dan mendorong pencapaian target secara efektif.'
    },
    B: {
      title: 'Influence / Social Type',
      text: 'Anda adalah pribadi yang ramah, komunikatif, dan menyukai interaksi sosial. Anda pandai memotivasi orang lain, membangun relasi, serta berkembang dalam lingkungan kerja kolaboratif.'
    },
    C: {
      title: 'Stability / Support Type',
      text: 'Anda adalah pribadi yang tenang, dapat diandalkan, dan menghargai keharmonisan. Anda menyukai stabilitas, konsistensi jangka panjang, serta lingkungan kerja yang terstruktur.'
    },
    D: {
      title: 'Analytical / Structure Type',
      text: 'Anda adalah pribadi yang cermat, teliti, dan berpikir logis. Anda menyukai akurasi data, detail pekerjaan, serta pengambilan keputusan berdasarkan fakta yang terencana.'
    }
  };

  const identitySection = document.getElementById('identitySection');
  const identityForm = document.getElementById('identityForm');
  const quizForm = document.getElementById('quizForm');
  const resultBox = document.getElementById('result');
  const timerBar = document.getElementById('timerBar');
  const timerDisplay = document.getElementById('timerDisplay');

  let candidateData = {};
  let timerInterval = null;
  const TOTAL_TIME_SECONDS = 30 * 60; // 30 Menit (1800 detik)
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

    // Jalankan Timer 30 Menit
    startTimer();
  });

  // Fungsi Penghitung Waktu Mundur
  function startTimer() {
    updateTimerDisplay();

    timerInterval = setInterval(function () {
      timeRemaining--;
      updateTimerDisplay();

      if (timeRemaining <= 0) {
        clearInterval(timerInterval);
        alert("Waktu pengerjaan (30 menit) telah habis. Jawaban Anda akan otomatis dikirim.");
        processQuizSubmission(true); // Kirim otomatis
      }
    }, 1000);
  }

  function updateTimerDisplay() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    timerDisplay.textContent = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

    // Beri penanda warna merah jika sisa waktu kurang dari 5 menit
    if (timeRemaining <= 300) {
      timerBar.classList.add('warning');
    }
  }

  // STEP 2: Submit Form Manual oleh Peserta
  quizForm.addEventListener('submit', function (event) {
    event.preventDefault();
    clearInterval(timerInterval); // Hentikan timer
    processQuizSubmission(false);
  });

  // Fungsi Pengolahan Skor & Jawaban Seadanya
  function processQuizSubmission(isTimeOut) {
    const scores = { A: 0, B: 0, C: 0, D: 0 };
    const questions = quizForm.querySelectorAll('.question');
    let answeredCount = 0;

    // Lepas penanda 'required' pada radio button jika submit karena timeout
    if (isTimeOut) {
      const radioInputs = quizForm.querySelectorAll('input[type="radio"]');
      radioInputs.forEach(input => input.removeAttribute('required'));
    }

    questions.forEach((question) => {
      const type = question.dataset.type;
      const selected = question.querySelector('input:checked');

      if (selected && scores.hasOwnProperty(type)) {
        scores[type] += Number(selected.value);
        answeredCount++;
      }
    });

    const dominantType = Object.keys(scores).sort((a, b) => scores[b] - scores[a])[0];
    const profile = descriptions[dominantType];

    // Sembunyikan Timer dan Form Soal
    timerBar.classList.add('hidden');
    quizForm.classList.add('hidden');

    // Tampilkan Hasil
    resultBox.classList.remove('hidden');
    resultBox.innerHTML = `
      <h2>Hasil Assessment Papikostik</h2>
      ${isTimeOut ? '<p style="color:#b91c1c; font-weight:bold; background:#fee2e2; padding:10px; border-radius:6px;">⚠️ Waktu pengerjaan telah habis. Hasil di bawah berdasarkan jawaban yang berhasil terisi.</p>' : ''}

      <div class="candidate-summary" style="background: #ffffff; border: 1px solid var(--success-border); padding: 18px; border-radius: 12px; margin-bottom: 20px;">
        <h3 style="margin-top:0; color: var(--text); border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">Ringkasan Data Peserta</h3>
        <p style="margin: 6px 0;"><strong>Nama Lengkap:</strong> ${candidateData.fullName}</p>
        <p style="margin: 6px 0;"><strong>Email:</strong> ${candidateData.email}</p>
        <p style="margin: 6px 0;"><strong>No. HP / WhatsApp:</strong> ${candidateData.phone}</p>
        <p style="margin: 6px 0;"><strong>Jenis Kelamin:</strong> ${candidateData.gender}</p>
        <p style="margin: 6px 0;"><strong>Posisi Dilamar:</strong> ${candidateData.position}</p>
        <p style="margin: 6px 0;"><strong>Total Soal Terjawab:</strong> ${answeredCount} dari 90 Soal</p>
      </div>

      <div class="profile-result" style="background: #ffffff; border-left: 5px solid var(--primary); padding: 18px; border-radius: 12px;">
        <h3 style="color: var(--primary); margin-top: 0;">${profile.title}</h3>
        <p style="line-height: 1.6; color: #334155;">${profile.text}</p>
        
        <div style="margin-top: 16px; padding-top: 12px; border-top: 1px dashed #cbd5e1;">
          <p style="margin: 0; font-weight: 700; color: #1e293b;">Rincian Skor Per Kategori:</p>
          <div style="display: flex; gap: 12px; margin-top: 8px; flex-wrap: wrap;">
            <span style="background: #f1f5f9; padding: 6px 12px; border-radius: 6px; font-weight: 600;">A (Action): ${scores.A}</span>
            <span style="background: #f1f5f9; padding: 6px 12px; border-radius: 6px; font-weight: 600;">B (Social): ${scores.B}</span>
            <span style="background: #f1f5f9; padding: 6px 12px; border-radius: 6px; font-weight: 600;">C (Support): ${scores.C}</span>
            <span style="background: #f1f5f9; padding: 6px 12px; border-radius: 6px; font-weight: 600;">D (Structure): ${scores.D}</span>
          </div>
        </div>
      </div>
    `;

    window.scrollTo({ top: resultBox.offsetTop - 20, behavior: 'smooth' });
  }
});
