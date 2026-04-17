document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector('form[action="/maidSignup"]');
  const checkboxes = document.querySelectorAll('input[name="services"]');
  const errorBox = document.getElementById("skills-error");

  if (!form) return;

  form.addEventListener("submit", (event) => {
    const checked = [...checkboxes].some((box) => box.checked);

    if (!checked) {
      event.preventDefault();
      if (errorBox) errorBox.style.display = "block";
    }
  });
});
