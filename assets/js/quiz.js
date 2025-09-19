const FORM_ENDPOINT = "https://formspree.io/f/xovnoekr"; // "https://formspree.io/f/----";

async function loadQuizFile(file) {
  const r = await fetch(window.QUIZ_FILE);
  return await r.text();
}

function parseQuizMD(md) {
  const lines = md.split(/\r?\n/);
  const qs = [];
  let cur = null;
  for (let l of lines) {
    const h = l.match(/^\s*#{1,6}\s+(.*\S)\s*$/);
    const o = l.match(/^\s*-\s*\[(x|X|\s)\]\s*(.*\S)\s*$/);
    if (h) {
      if (cur) qs.push(cur);
      cur = { title: h[1], options: [] };
    } else if (o && cur) {
      cur.options.push({
        text: o[2],
        correct: o[1].toLowerCase() === "x",
      });
    }
  }
  if (cur) qs.push(cur);
  return qs;
}

function renderQuiz(qs) {
  const root = document.getElementById("quiz-root");
  root.innerHTML = "";
  qs.forEach((q, qi) => {
    const correctCount = q.options.filter((o) => o.correct).length;
    const isSingle = correctCount === 1;

    const b = document.createElement("div");
    b.className = "question-block";
    b.dataset.qIndex = qi;

    const t = document.createElement("div");
    t.className = "q-title";
    t.textContent = `${qi + 1}. ${q.title}`;
    b.appendChild(t);

    const ul = document.createElement("ul");
    q.options.forEach((opt, oi) => {
      const li = document.createElement("li");
      const input = document.createElement("input");
      input.type = isSingle ? "radio" : "checkbox";
      input.name = `q${qi}`;
      input.value = opt.text;
      input.dataset.correct = opt.correct ? "1" : "0";
      li.appendChild(input);

      const span = document.createElement("span");
      span.innerHTML = " " + opt.text;
      li.appendChild(span);
      ul.appendChild(li);
    });

    b.appendChild(ul);
    root.appendChild(b);
  });
  // Re-typeset math after injecting content
  if (window.MathJax) {
    MathJax.typesetPromise();
  }
}

function collectAnswers(qs) {
  return qs.map((q, qi) => {
    const block = document.querySelector(
      `.question-block[data-q-index="${qi}"]`
    );
    const inputs = Array.from(block.querySelectorAll("input"));
    return {
      question: q.title,
      options: inputs.map((inp) => ({
        text: inp.value,
        checked: inp.checked,
        correct: inp.dataset.correct === "1",
      })),
    };
  });
}

function gradeQuiz(ans) {
  let score = 0;
  ans.forEach((q, qi) => {
    let allCorrect = true;
    const block = document.querySelector(
      `.question-block[data-q-index="${qi}"]`
    );
    const inputs = Array.from(block.querySelectorAll("input"));

    inputs.forEach((inp) => {
      const isCorrect = inp.dataset.correct === "1";
      if (inp.checked && !isCorrect) {
        inp.parentElement.style.color = "red"; // picked wrong
        allCorrect = false;
      } else if (!inp.checked && isCorrect) {
        inp.parentElement.style.color = "orange"; // missed correct
        allCorrect = false;
      } else if (isCorrect) {
        inp.parentElement.style.color = "green"; // correct answer
      } else {
        inp.parentElement.style.color = "inherit";
      }
    });

    if (allCorrect) score++;
    block.style.borderColor = allCorrect ? "green" : "red";
  });
  return { score, total: ans.length };
}



async function submitQuiz(payload) {
  const box = document.getElementById("statusBox");
  box.style.display = "block";
  box.textContent = "Submitting...";
  box.className = "status";
  try {
    const resp = await fetch(FORM_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (resp.ok) {
      box.textContent = "✅ Submitted successfully!";
      box.className = "status success";
    } else {
      box.textContent = "❌ Submission failed.";
      box.className = "status error";
    }
  } catch (e) {
    box.textContent = "⚠️ Network error.";
    box.className = "status error";
  }
}

// Event handlers
// Hide submit button if no endpoint
document.addEventListener("DOMContentLoaded", () => {
  const submitBtn = document.getElementById("submit-btn");
  if (!FORM_ENDPOINT || FORM_ENDPOINT.trim() === "") {
    submitBtn.style.display = "none";
  }
});

document.addEventListener("DOMContentLoaded", async () => {
  const md = await loadQuizFile(window.QUIZ_FILE);
  window.questions = parseQuizMD(md);
  renderQuiz(window.questions);

  document
    .getElementById("downloadBtn")
    .addEventListener("click", () => {
      const blob = new Blob(
        [JSON.stringify(collectAnswers(window.questions), null, 2)],
        { type: "application/json" }
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "quiz-answers.json";
      a.click();
      URL.revokeObjectURL(url);
    });

  document
    .getElementById("submitBtn")
    .addEventListener("click", async () => {
      const email = document.getElementById("studentEmail").value.trim();
      if (!email) {
        alert("⚠️ Please enter your email before submitting.");
        return;
      }
      const answers = collectAnswers(window.questions);
      const result = gradeQuiz(answers);
      document.getElementById(
        "resultBox"
      ).textContent = `Your Score: ${result.score}/${result.total}`;
      const payload = { email, answers, result };
      await submitQuiz(payload);
    });
});
