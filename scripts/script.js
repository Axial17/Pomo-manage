function applyTheme(mode) {
  document.body.classList.remove("short-rest-theme", "long-rest-theme");
  if (mode === "short-rest") {
    document.body.classList.add("short-rest-theme");
  } else if (mode === "long-rest") {
    document.body.classList.add("long-rest-theme");
  }
}

const savedMode = localStorage.getItem("pomo-mode");
if (savedMode) {
  applyTheme(savedMode);
}

const timerDisplay = document.getElementById("timer");

if (timerDisplay) {
  let timeLeft = 1500;
  let timerId = null;

  const startBtn = document.getElementById("start-btn");
  const resetBtn = document.getElementById("reset-btn");
  const modeButtons = document.querySelectorAll(
    ".timer-controls .button:not(#start-btn):not(#reset-btn)",
  );

  function getSecondsForMode(modeId, defaultAttr) {
    const config = JSON.parse(localStorage.getItem("pomo-config"));
    if (config) {
      if (modeId === "work" && config.work) return config.work * 60;
      if (modeId === "short-rest" && config.short) return config.short * 60;
      if (modeId === "long-rest" && config.long) return config.long * 60;
    }
    return parseInt(defaultAttr);
  }

  if (savedMode) {
    const savedBtn = document.getElementById(savedMode);
    if (savedBtn) {
      modeButtons.forEach((btn) => btn.classList.remove("chosen"));
      savedBtn.classList.add("chosen");

      timeLeft = getSecondsForMode(
        savedBtn.id,
        savedBtn.getAttribute("data-time"),
      );
    }
  }

  function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }

  modeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      modeButtons.forEach((btn) => btn.classList.remove("chosen"));
      button.classList.add("chosen");

      clearInterval(timerId);
      timerId = null;
      if (startBtn.querySelector("p"))
        startBtn.querySelector("p").textContent = "Старт";

      timeLeft = getSecondsForMode(button.id, button.getAttribute("data-time"));
      updateDisplay();

      const modeId = button.id;
      applyTheme(modeId);
      localStorage.setItem("pomo-mode", modeId);
    });
  });

  startBtn.addEventListener("click", () => {
    const btnText = startBtn.querySelector("p");

    if (
      Notification.permission !== "granted" &&
      Notification.permission !== "denied"
    ) {
      Notification.requestPermission();
    }

    if (timerId) {
      clearInterval(timerId);
      timerId = null;
      if (btnText) btnText.textContent = "Старт";
    } else {
      if (btnText) btnText.textContent = "Пауза";
      timerId = setInterval(() => {
        if (timeLeft > 0) {
          timeLeft--;
          updateDisplay();
        } else {
          clearInterval(timerId);
          timerId = null;

          if (Notification.permission === "granted") {
            new Notification("Pomo-manage", {
              body: "Время вышло! Пора сменить режим.",
              icon: "/assets/logo.svg",
            });
          }

          alert("Время вышло!");
          if (btnText) btnText.textContent = "Старт";
        }
      }, 1000);
    }
  });

  resetBtn.addEventListener("click", () => {
    clearInterval(timerId);
    timerId = null;
    const activeMode = document.querySelector(".timer-controls .button.chosen");

    if (activeMode) {
      timeLeft = getSecondsForMode(
        activeMode.id,
        activeMode.getAttribute("data-time"),
      );
    } else {
      timeLeft = 1500;
    }

    const btnText = startBtn.querySelector("p");
    if (btnText) btnText.textContent = "Старт";
    updateDisplay();
  });

  updateDisplay();
}

function displayTasks() {
  const container = document.getElementById("task-list");
  if (!container) return;
  const tasks = JSON.parse(localStorage.getItem("pomo-tasks")) || [];

  if (tasks.length === 0) {
    container.innerHTML =
      '<p style="color: white; text-align:center; opacity:0.5;">Список пуст</p>';
    return;
  }

  container.innerHTML = tasks
    .map(
      (task) => `
    <div class="task-card">
        <div class="task-info">
            <h4 class="no-select">${task.name}</h4>
            <p>${task.category} — ${task.date}</p>
        </div>
        <button class="delete-task-btn" onclick="deleteTask(${task.id})">
            <span></span>
        </button>
    </div>
  `,
    )
    .join("");
}

window.deleteTask = function (id) {
  let tasks = JSON.parse(localStorage.getItem("pomo-tasks")) || [];
  tasks = tasks.filter((t) => t.id !== id);
  localStorage.setItem("pomo-tasks", JSON.stringify(tasks));
  displayTasks();
};

document.addEventListener("DOMContentLoaded", displayTasks);

const taskAside = document.getElementById("task-aside");
const openAsideBtn = document.getElementById("open-aside");
const closeAsideBtn = document.getElementById("close-aside");

if (openAsideBtn) {
  openAsideBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    taskAside.classList.add("active");
  });
}

if (closeAsideBtn) {
  closeAsideBtn.addEventListener("click", () => {
    taskAside.classList.remove("active");
  });
}

document.addEventListener("click", (e) => {
  if (
    taskAside &&
    taskAside.classList.contains("active") &&
    !taskAside.contains(e.target) &&
    e.target !== openAsideBtn
  ) {
    taskAside.classList.remove("active");
  }
});
