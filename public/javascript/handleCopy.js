clipboards = document.getElementsByClassName("copy-image-link")

// Make the clipboard icons work
for (let i = 0; i < clipboards.length; i++) {
    clipboard = clipboards[i]
    link = clipboard.id
    confirmCopy = document.getElementById("confirm-copied")
    clipboard.addEventListener("click", e => {
        navigator.clipboard.writeText(link)
        confirmCopy.textContent = "copied!"
        // Make the message disappear after a quick sec
        setTimeout(() => {confirmCopy.textContent = ""}, 1000)
    })
}   
   
