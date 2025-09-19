async function countQuestions(url) {
  const res = await fetch(url);
  const text = await res.text();
  return (text.match(/^### /gm) || []).length;
}

document.querySelectorAll(".quiz-card").forEach(async card => {
  const file = card.dataset.quizfile;
  if (file) {
    const n = await countQuestions(file);
    card.querySelector(".q-count").textContent = `${n} questions`;
  }
});
