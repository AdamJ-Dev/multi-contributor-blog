const imageDeleteButtons = document.getElementsByClassName("delete-image")
const blogDeleteButtons = document.getElementsByClassName("delete-blog")
const draftDeleteButtons = document.getElementsByClassName("delete-draft")
const confirmDelete =  document.getElementById("proceed-with-delete")

// Call to delete image by key from AWS bucket 

const deleteItem = async (url, itemType) => {
    try {
        const res = await fetch(url, {
            method: "DELETE"
        })
        const data = await res.json()
        const user = data.user
        location.assign(`/profile/${itemType}/${user._id}`)
    } catch(err) {
        console.log(err)
    }
}

// Prepare deletion of an image by clicking on its bin icon
const connectToBin = (buttons, itemType) => {
    for (let i=0; i < buttons.length; i++) {
        let button = buttons[i]
        let url = button.id
        button.addEventListener("click", e => {
            confirmDelete["data-itemUrl"] = url
            confirmDelete["data-itemType"] = itemType
        })
    }
}

connectToBin(blogDeleteButtons, "blogs")
connectToBin(imageDeleteButtons, "images")
connectToBin(draftDeleteButtons, "drafts")

// Enact delete blog/image on confirmation
confirmDelete.addEventListener("click", async (e) => {
    const url = confirmDelete["data-itemUrl"]
    const itemType = confirmDelete["data-itemType"]
    await deleteItem(url, itemType)
}
)

