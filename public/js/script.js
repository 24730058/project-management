// Show alert message

const showAlert = document.querySelector('[show-alert]');
if(showAlert) {
    const time = parseInt(showAlert.getAttribute('data-time'));
    const closeAlert = showAlert.querySelector('[close-alert]');
    setTimeout(() => {
        showAlert.classList.add('alert-hidden')
    }, time);

    closeAlert.addEventListener('click', () => {
        showAlert.classList.add('alert-hidden')
    })
}
// END Show alert message

// alert-message
const alertMessage = document.querySelector("[alert-message]");
if(alertMessage) {
  setTimeout(() => {
    alertMessage.style.display = "none";
  }, 3000);
}
// End alert-message