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

const form = document.getElementById('quizForm');
const resultBox = document.getElementById('result');

form.addEventListener('submit', function (event) {
  event.preventDefault();

  const scores = { A: 0, B: 0, C: 0, D: 0 };
  const questions = document.querySelectorAll('.question');

  questions.forEach((question) => {
    const type = question.dataset.type;
    const selected = question.querySelector('input:checked');

    if (selected) {
      scores[type] += Number(selected.value);
    }
  });

  const dominantType = Object.keys(scores).sort((a, b) => scores[b] - scores[a])[0];
  const profile = descriptions[dominantType];

  resultBox.classList.remove('hidden');
  resultBox.innerHTML = `
    <h2>Your Papikostik Result</h2>
    <h3>${profile.title}</h3>
    <p>${profile.text}</p>
    <p><strong>Score Summary:</strong> A: ${scores.A}, B: ${scores.B}, C: ${scores.C}, D: ${scores.D}</p>
  `;

  window.scrollTo({ top: resultBox.offsetTop - 20, behavior: 'smooth' });
});
