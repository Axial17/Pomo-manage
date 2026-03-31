const form = document.getElementById("pomo-form");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("task-name").value.trim();
  const category = document.getElementById("task-category").value.trim();
  const date = document.getElementById("task-date").value;

  if (!name || !category || !date) {
    alert("Пожалуйста,заполните все поля!");
    return;
  }

  const newTask = {
    id: Date.now(),
    name,
    category,
    date,
  };

  const tasks = JSON.parse(localStorage.getItem("pomo-tasks")) || [];
  tasks.push(newTask);
  localStorage.setItem("pomo-tasks", JSON.stringify(tasks));

  alert("Задача сохранена!");
  window.location.href = "../index.html";
});
