document.addEventListener("click", function (e) {
  // Update code
  if (e.target.classList.contains("edit-me")) {
    let value = e.target.parentElement.parentElement.querySelector(".item-text")
      .innerHTML;
    let userInput = prompt("Enter new item value", value);

    if (userInput) {
      axios
        .post("/update-item", {
          text: userInput,
          id: e.target.getAttribute("data-id"),
        })
        .then(() => {
          // Refresh code here
          e.target.parentElement.parentElement.querySelector(
            ".item-text"
          ).innerHTML = userInput;
        })
        .catch(() => {
          console.log("Something went wrong!");
        });
    }
  }

  // Delete Code
  if (e.target.classList.contains("delete-me")) {
    if (confirm("Are you sure?")) {
      axios
        .post("/delete-item", {
          id: e.target.getAttribute("data-id"),
        })
        .then(() => {
          // Refresh code here
          e.target.parentElement.parentElement.remove();
        })
        .catch(() => {
          console.log("Something went wrong!");
        });
    }
  }
});
