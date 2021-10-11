const form = document.querySelector(".login-form")
const emailError = document.querySelector(".email-error")
const passwordError = document.querySelector(".password-error")

form.addEventListener("submit", async (e) => {
    e.preventDefault() 
    const email = form.email.value
    const password = form.password.value
   
    try {
        const res = await fetch("/login", {
            method: "POST",
            body: JSON.stringify({email, password}),
            headers: {"Content-Type": "application/json"}
        })
        const data = await res.json();
        console.log(data)
        if (data.errors) {
            // Display custom errors
            emailError.textContent = data.errors.email
            passwordError.textContent = data.errors.password
        } 
        const user = data.user
        if (user) {
           // Log in successful; redirect home.
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

form.password.addEventListener("keyup", e => {
    passwordError.textContent = ""
})