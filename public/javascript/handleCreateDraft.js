/* Imagine a user clicks on the "Create a blog" nav link multiple times in rapid succession.  
Given the GET "/createblog" controller, she thereby creates several blank drafts for as many clicks as 
she makes, before some latest click causes a draft to load in the browser. This is inefficent and will 
clog up a user's "/profile/drafts" page. So the purpose of this script is to disable the "Create a blog" 
link for 10 seconds after it has been clicked. While this is an admittedly inelegant and arbitrary 
half-solution to the problem I've described, in this context 1/2 >> 0. */

const createBlogLink = document.getElementById("create-blog-link")
let blogLinkactive = true

createBlogLink.addEventListener("click", e => {
    if (blogLinkactive) {
        location.assign("/createblog")
    }
    blogLinkactive = false
    setTimeout(() => {
        blogLinkactive = true
    }, 10000)
})
   