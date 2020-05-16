document
    .querySelectorAll("button")
    .forEach((el) => el.addEventListener("click", (event) => console.log(event.target.innerText)))

console.log("Initialized buttons")
