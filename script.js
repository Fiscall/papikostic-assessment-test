document.addEventListener('DOMContentLoaded', function () {
  // Deskripsi Tipe Kepribadian
  const descriptions = {
    A: {
      title: 'Leadership / Action Type',
      text: 'You are driven, confident, and focused on results. You take initiative quickly and prefer moving forward with purpose.'
    },
    B: {
      title: 'Influence / Social Type',
      text: 'You are warm, expressive, and people-oriented. You motivate others, build relationships, and thrive in social or collaborative settings.'
    },
    C: {
      title: 'Stability / Support Type',
      text: 'You are calm, dependable, and relationship-focused. You value harmony, trust, and long-term consistency.'
    },
    D: {
      title: 'Analytical / Structure Type',
      text: 'You are thoughtful, careful, and detail-oriented. You prefer logic, accuracy, and structured decisions.'
    }
  };

  // Elemen DOM
  const identitySection = document.getElementById('identitySection');
  const identityForm = document.getElementById('identityForm');
  const quizForm = document.getElementById('quizForm');
  const resultBox = document.getElementById('result');

  // Variabel Penampung Data Kandidat
  let candidateData = {};

  // =========================================================
  // STEP 1: Penanganan Submit Form Data Diri
  // =========================================================
  identityForm.addEventListener('submit', function (event) {
    event.preventDefault();

    // Ambil nilai dari input data diri
    candidateData = {
      fullName: document.getElementById('fullName').value.trim(),
      email: document.getElementById('email').value.trim(),
      phone: document.getElementById('phone').value.trim(),
      gender: document.getElementById('gender').value,
      position: document.getElementById('position').value.trim()
    };

    // Sembunyikan section data diri, tampilkan form soal tes
    identitySection.classList.add('hidden');
    quizForm.classList.remove('hidden');

    // Scroll mulus ke bagian atas halaman
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // =========================================================
  // STEP 2: Penanganan Submit Form Soal & Kalkulasi Hasil
  // =========================================================
  quizForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const scores = { A: 0, B: 0, C: 0, D: 0 };
    const questions = quizForm.querySelectorAll('.question');

    // Hitung total skor per kategori (A, B, C, D)
    questions.forEach((question) => {
      const type = question.dataset.type;
      const selected = question.querySelector('input:checked');

      if (selected && scores.hasOwnProperty(type)) {
        scores[type] += Number(selected.value);
      }
    });

    // Cari tipe kepribadian dengan skor tertinggi
    const dominantType = Object.keys(scores).sort((a, b) => scores[b] - scores[a])[0];
    const profile = descriptions[dominantType];

    // Sembunyikan form soal tes
    quizForm.classList.add('hidden');

    // Tampilkan box hasil dengan data kandidat & hasil skor
    resultBox.classList.remove('hidden');
    resultBox.innerHTML = `
      <h2>Hasil Assessment Papikostik</h2>
      
      <div class="candidate-summary" style="background:#f8f9fa; padding:16px; border-radius:6px; margin-bottom:20px; text-align:left;">
        <h3 style="margin-top:0;">Data Peserta</h3>
        <p style="margin:4px 0;"><strong>Nama:</strong> ${candidateData.fullName}</p>
        <p style="margin:4px 0;"><strong>Email:</strong> ${candidateData.email}</p>
        <p style="margin:4px 0;"><strong>No. HP/WA:</strong> ${candidateData.phone}</p>
        <p style="margin:4px 0;"><strong>Jenis Kelamin:</strong> ${candidateData.gender}</p>
        <p style="margin:4px 0;"><strong>Posisi Dilamar:</strong> ${candidateData.position}</p>
      </div>

      <div class="profile-result">
        <h3 style="color:#0066cc;">${profile.title}</h3>
        <p>${profile.text}</p>
        <p><strong>Ringkasan Skor:</strong> A: ${scores.A} | B: ${scores.B} | C: ${scores.C} | D: ${scores.D}</p>
      </div>
    `;

    // Scroll ke bagian hasil
    window.scrollTo({ top: resultBox.offsetTop - 20, behavior: 'smooth' });
  });
});
