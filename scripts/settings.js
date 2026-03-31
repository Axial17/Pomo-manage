document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("settings-form");

  const config = JSON.parse(localStorage.getItem("pomo-config")) || {
    work: 25,
    short: 5,
    long: 15,
    notifications: false,
  };

  document.getElementById("pref-work").value = config.work;
  document.getElementById("pref-short").value = config.short;
  document.getElementById("pref-long").value = config.long;
  document.getElementById("pref-notifications").checked = config.notifications;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const newConfig = {
      work: parseInt(document.getElementById("pref-work").value),
      short: parseInt(document.getElementById("pref-short").value),
      long: parseInt(document.getElementById("pref-long").value),
      notifications: document.getElementById("pref-notifications").checked,
    };

    localStorage.setItem("pomo-config", JSON.stringify(newConfig));
    alert("Настройки сохранены!");
  });
});
