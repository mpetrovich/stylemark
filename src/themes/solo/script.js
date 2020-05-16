document
    .querySelectorAll("button")
    .forEach((el) => el.addEventListener("click", (event) => console.log("script", event.target.innerText)))

console.log("Initialized script")
