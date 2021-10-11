const loadNumberDiv = document.querySelector(".load-number")
const loadMoreBtn = document.querySelector(".load-more")
const linkToTop = document.querySelector(".to-top")
const blogs = document.getElementsByClassName("blog-wrapper")

loadMoreBtn.addEventListener("click", e => {
    const oldLoadNumber = parseInt(loadNumberDiv.textContent)
    const newLoadNumber = oldLoadNumber + 5
    loadNumberDiv.textContent = newLoadNumber.toString()
    Array.from(blogs).slice(oldLoadNumber, newLoadNumber).forEach(blog => {
        const indexClass = Array.from(blog.classList).find(className => className.startsWith("index"))
        const index = parseInt(indexClass.replace("index-", ""))
        // console.log(blogs.length)
        // console.log(index + 1)
        if ((index + 1) <= newLoadNumber) {
            blog.classList.remove("hidden")

        }
        if ((index + 1) === blogs.length) {
            loadMoreBtn.classList.add("hidden")
            linkToTop.classList.remove("hidden")
        }
        
    })
})