function openMainTab(evt, tabName) {
  const tabcontents = document.getElementsByClassName("tabcontent");
  for (let i = 0; i < tabcontents.length; i++) {
    tabcontents[i].style.display = "none";
  }

  const tablinks = document.getElementsByClassName("navlinks");
  for (let i = 0; i < tablinks.length; i++) {
    tablinks[i].classList.remove("active");

    // Reset image to default
    const img = tablinks[i].querySelector("img");
    if (img && img.dataset.icon) {
      img.src = img.dataset.icon;
    }
  }

  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.classList.add("active");

  // Change image to active version
  const activeImg = evt.currentTarget.querySelector("img");
  if (activeImg && activeImg.dataset.iconActive) {
    activeImg.src = activeImg.dataset.iconActive;
  }
}

// Function to handle profile navigation tab switching
function openProfileTab(evt, tabName) {
  const tabcontents = document.getElementsByClassName("profile-tabcontent");
  for (let i = 0; i < tabcontents.length; i++) {
    tabcontents[i].style.display = "none";
  }

  const tablinks = document.getElementsByClassName("tablinks");
  for (let i = 0; i < tablinks.length; i++) {
    tablinks[i].classList.remove("active");
  }

  document.getElementById(tabName).style.display = "flex";
  evt.currentTarget.classList.add("active");
}

// Optional: Set default open profile tab
window.onload = function () {
  document.getElementById("defaultOpen")?.click();
};