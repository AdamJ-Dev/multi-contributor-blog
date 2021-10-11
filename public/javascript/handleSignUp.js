const form = document.querySelector(".signup-form")
const emailError = document.querySelector(".email-error")
const authorError = document.querySelector(".author-error")
const passwordError = document.querySelector(".password-error")
const confirmPasswordError = document.querySelector(".confirm-password-error")
const passcodeError = document.querySelector(".passcode-error")

form.addEventListener("submit", async (e) => {
    e.preventDefault() 
    const email = form.email.value
    const newAuthor = form.newAuthor.value
    const password = form.password.value
    const confirmPassword = form.confirmPassword.value
    const passcode = form.passcode.value
    
    try {
        const res = await fetch("/signup", {
            method: "POST",
            body: JSON.stringify({email, newAuthor, password, confirmPassword, passcode}),
            headers: {"Content-Type": "application/json"}
        })
        const data = await res.json();
        console.log(data)
        if (data.errors) {
            // Display custom errors
            emailError.textContent = data.errors.email
            authorError.textContent = data.errors.author
            passwordError.textContent = data.errors.password
            confirmPasswordError.textContent = data.errors.confirmPassword
            passcodeError.textContent = data.errors.passcode
        } 
        const user = data.user
        if (user) {
            // Sign up successful; redirect home.
            location.assign("/")
        }
    } catch(err) {
        console.log(err)
    }
})

/* When the user starts making changes we do not
 want to harrass them with their previous error */

form.email.addEventListener("keyup", e => {
    emailError.textContent = ""
})

form.newAuthor.addEventListener("keyup", e => {
    authorError.textContent = ""
})

form.password.addEventListener("keyup", e => {
    passwordError.textContent = ""
    confirmPasswordError.textContent = ""
})


form.confirmPassword.addEventListener("keyup", e => {
    passwordError.textContent = ""
    confirmPasswordError.textContent = ""
})


form.passcode.addEventListener("keyup", e => {
    passcodeError.textContent = "You cannot proceed without the passcode."
})
