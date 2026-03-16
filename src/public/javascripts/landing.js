let responseMessage = "";

document.addEventListener("DOMContentLoaded", function () {
  let contactForm = document.getElementById("contact-form");
  if (contactForm) {
    document.addEventListener("submit", function (event) {
      event.preventDefault(); // Prevent default form submission

      var name = document.getElementById("name").value;
      var email = document.getElementById("email").value;
      var message = document.getElementById("message").value;

      fetch("api/v1/support/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          email: email,
          message: message,
        }),
      })
        .then((response) => {
          if (response.ok) {
            console.log("Form submitted successfully");
            responseMessage = `Thank you, ${name || "User"}! We have received your message.<br><br>`;
            responseMessage += `Email: ${email}<br>`;
            responseMessage += `Message: ${message}`;
            showPopup();
            contactForm.reset();
          } else {
            let clone = response.clone();
            return clone.json();
          }
        })
        .then((data) => {
          if (data.error) {
            console.error(`Form submission failed : ${data.error}`);
            responseMessage = `Form submission failed : ${data.error}`;
          }
          showPopup();
        })
        .catch((error) => {
          console.error(`${error.message}`);
          showPopup();
        });
    });
  }
  let closeButton = document.getElementById("close-modal");
  if (closeButton) {
    closeButton.addEventListener("click", () => {
      $("#responseModal").modal("hide"); // Show the modal
    });
  }
});

function showPopup() {
  var responseModal = document.getElementById("responseModal");
  var responseMessageElement = document.getElementById("responseMessage");
  if (responseModal && responseMessageElement) {
    responseMessageElement.innerHTML = responseMessage;
    $("#responseModal").modal("show"); // Show the modal
  } else {
    console.error("responseModal or responseMessageElement is null or undefined.");
  }
}
