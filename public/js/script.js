// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  "use strict";

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll(".needs-validation");

  // Loop over them and prevent submission
  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add("was-validated");
      },
      false
    );
  });
})();

(() => {
  const bookingForms = document.querySelectorAll(".booking-form");

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const formatTime = (date) => {
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const syncBookingConstraints = (dateInput, timeInput) => {
    const now = new Date();
    const today = formatDate(now);

    dateInput.min = today;

    if (dateInput.value === today) {
      timeInput.min = formatTime(now);

      if (timeInput.value && timeInput.value < timeInput.min) {
        timeInput.value = "";
      }
    } else {
      timeInput.removeAttribute("min");
    }
  };

  bookingForms.forEach((form) => {
    const dateInput = form.querySelector(".booking-date");
    const timeInput = form.querySelector(".booking-time");

    if (!dateInput || !timeInput) {
      return;
    }

    syncBookingConstraints(dateInput, timeInput);

    dateInput.addEventListener("change", () => {
      syncBookingConstraints(dateInput, timeInput);
      timeInput.reportValidity();
    });

    timeInput.addEventListener("focus", () => {
      syncBookingConstraints(dateInput, timeInput);
    });

    form.addEventListener("submit", (event) => {
      syncBookingConstraints(dateInput, timeInput);

      const selectedDateTime = new Date(`${dateInput.value}T${timeInput.value}`);

      if (
        !dateInput.value ||
        !timeInput.value ||
        Number.isNaN(selectedDateTime.getTime()) ||
        selectedDateTime <= new Date()
      ) {
        event.preventDefault();
        timeInput.setCustomValidity("Please choose a future date and time.");
        form.classList.add("was-validated");
        timeInput.reportValidity();
        return;
      }

      timeInput.setCustomValidity("");
    });

    timeInput.addEventListener("input", () => {
      timeInput.setCustomValidity("");
    });
  });
})();
