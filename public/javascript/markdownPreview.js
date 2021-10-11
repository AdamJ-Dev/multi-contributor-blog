// Use prism with marked
marked.setOptions({
    renderer: new marked.Renderer(),
    breaks: true,
    highlight: function(code, lang) {
        if (Prism.languages[lang]) {
            return Prism.highlight(code, Prism.languages[lang], lang);
        } else {
        return code;
        }
    }})


class App extends React.Component {
    
    // Get the initial draft from the hidden html elements
    initialDraft = {
        name: document.getElementById("draftName").textContent,
        title: document.getElementById("draftBlogTitle").textContent,
        snippet: document.getElementById("draftBlogSnippet").textContent,
        body: document.getElementById("draftBlogBody").textContent,
    }

    // That we may update the draft
    draftId = document.getElementById("draftId").textContent

    constructor(props) {
        super(props);
        this.state = {
            draftName: this.initialDraft.name,
            body: "Format your body text according to markdown syntax",
            title: this.initialDraft.title ? this.initialDraft.title: "Your title will appear here",
            titleError: "",
            snippetError: "",
            bodyError: "",
            spinnerStyle: {
                display: "none"
            },
            saveIconStyle: {
                display: "inline"
            }
        
        };
        this.setMarkedInnerHTML = this.setMarkedInnerHTML.bind(this)
        this.handleFormInputChange = this.handleFormInputChange.bind(this)
        this.saveDraft = this.saveDraft.bind(this)
        this.handleDraftNameBlur = this.handleDraftNameBlur.bind(this)
        this.handleTitleChange=this.handleTitleChange.bind(this);
        this.changeStateBody = this.changeStateBody.bind(this);
        this.handleBodyChange=this.handleBodyChange.bind(this);
        this.handleSnippetChange = this.handleSnippetChange.bind(this)
        this.handleTab = this.handleTab.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleRemoveError = this.handleRemoveError.bind(this)
        this.handleRemoveTitleError = this.handleRemoveTitleError.bind(this)
        this.handleRemoveSnippetError = this.handleRemoveSnippetError.bind(this)
        this.handleRemoveBodyError = this.handleRemoveBodyError.bind(this)
    }

    // For use in the preview
    setMarkedInnerHTML = (el) => {
        let body = this.state.body
        el.innerHTML = marked(body) 
    }

    saveDraft = async (draftName, title, snippet, body) => {
        // Indicate a save is being processed
        this.setState(state => (
            {
                spinnerStyle: {display: ""},
                saveIconStyle: {display: "none"}
            }))
        await fetch(`/createblog/${this.draftId}`, {
            method: "POST",
            body: JSON.stringify({draftName, title, snippet, body}),
            headers: {"Content-Type": "application/json"}
            })
        // Indicate the save is complete     
        this.setState(state => (
            {
                spinnerStyle: {display: "none"},
                saveIconStyle: {display: "inline"}
            }))
    }

    // Implement auto-save feature
    handleFormInputChange = async (e) => {
        const form = e.target.parentElement
        const draftName = form.draftName.value
        const title = form.title.value
        const snippet = form.snippet.value
        const body = form.body.value
        try {
            await this.saveDraft(draftName, title, snippet, body)  
        } catch(err) {
            console.log(err)
        }        
    }
    
    // Update draft name when user changes focus
    handleDraftNameBlur(e) {
        const initial = this.state.draftName
        const value = e.target.value;
        if (!value) {
            const form = e.target.parentElement
            const title = form.title.value
            if (title) {
                e.target.value = title
            } else {
                e.target.value = "Untitled Draft"
            }
        }
        if (e.target.value !== initial) {
            this.handleFormInputChange(e)
        }
    }


    handleTitleChange(e) {
        const value = e.target.value;
        this.setState(state => 
            value ? ({title: value}): 
            ({title: "Your title will appear here"})
        )
    }

    changeStateBody = value => {
        this.setState(state => 
            value ? ({body: value}): 
            ({body: "Format your body text according to markdown syntax"})
        )
    }

    handleBodyChange(e) {    
        const value = e.target.value;
        this.changeStateBody(value)
        this.handleFormInputChange(e)
    }

    handleSnippetChange(e) {
        this.handleFormInputChange(e)
    }


    /* By default, tabbing switches focus. If writing the blog body
    we want to use tabs for indentation */
    handleTab(e) {
        if (e.key == "Tab") {
            e.preventDefault();
            var start = e.target.selectionStart;
            var end = e.target.selectionEnd;
            e.target.value = e.target.value.substring(0, start) +"\t" + e.target.value.substring(end);
            e.target.selectionStart = e.target.selectionEnd = start + 1;
            const value = e.target.value;
            this.setState(state => ({body: value}));
        }
    }

    async handleSubmit(e) {
        e.preventDefault() 
        const form = e.target
        const draftName = form.draftName.value
        const title = form.title.value
        const snippet = form.snippet.value
        const body = form.body.value
        const submitMode = e.nativeEvent.submitter.id // Not compatabile with Safari 
        if (submitMode == "submit") {
            try {
                const res = await fetch("/createblog", {
                    method: "POST",
                    body: JSON.stringify({title, snippet, body}),
                    headers: {"Content-Type": "application/json"}
                })
                const data = await res.json();
                console.log(data)     
                
                if (data.errors) {
                    this.setState(state => (
                    {titleError: data.errors.title,
                     snippetError: data.errors.snippet,
                     bodyError: data.errors.body
                    }))
                }

                if (data.user) {
                    // The blog is no longer a draft!
                    await fetch(`/drafts/${this.draftId}`, {
                        method: "DELETE",
                    })
                    // Post successful; redirect home
                    location.assign("/")
                }
            } catch(err) {
                console.log(err)
            }
        } else {
            try {
               await this.saveDraft(draftName, title, snippet, body)
            } catch(err) {
                console.log(err)
            }
        }
    }

    handleRemoveError = (errorType) => {
        this.state[errorType] = ""
    }

    /* When the user starts making changes we do not
    want to harrass them with their previous error. We will bind
    the below methods to the keyup event firing on their corresponding 
    element. */

    handleRemoveTitleError(e) {
        this.handleRemoveError("titleError")
    }

    handleRemoveSnippetError(e) {
        this.handleRemoveError("snippetError")
    }

    handleRemoveBodyError(e) {
        this.handleRemoveError("bodyError")
    }


    // Initial preview message
    componentDidMount() {
        const value = document.getElementById("blogBody").value
        const defaultBodyPreview = value ? value: "Format your body text according to markdown syntax"
        this.changeStateBody(defaultBodyPreview)
        this.setMarkedInnerHTML(document.getElementById("preview"))         
    }

    // Change the preview when body changes
    componentDidUpdate() {
        this.setMarkedInnerHTML(document.getElementById("preview"))
        
        /* There is a bug I don't understand where the pre element
        doesn't pick up the specified language, but the code element
        does. This is my ad hoc fix. */
        let preList = Array.from(document.querySelectorAll("pre"));
        let codeList = Array.from(document.querySelectorAll("code"));
        preList.forEach(pre => {
            codeList.forEach(code => {
                if (Array.from(pre.childNodes).includes(code)) {
                    let lang = code.classList[0]
                    pre.classList.add(lang)
                }
            })
        })
    }

    render() {
        return (
        <div className="newblog-container">
             <form id="newblog" className="newblog-form" onChange={this.handleFormChange} onSubmit={this.handleSubmit} autoComplete="off">
                <input type="text" className="draft-title my-4 text-secondary" onBlur={this.handleDraftNameBlur} name="draftName" defaultValue={this.initialDraft.name} autoComplete="off"/>
                <h4>Your Blog:</h4>
                <br/>
                <label className="form-label lead" htmlFor="title">Title</label>
                <input className="view form-control" onChange={this.handleTitleChange} onKeyUp={this.handleRemoveTitleError} id="blogTitle" name="title" type="text" defaultValue={this.initialDraft.title} autoComplete="off"/>
                <div className="title-error">{this.state.titleError}</div>
                <label className="form-label lead mt-3" htmlFor="snippet">Snippet</label>
                <textarea className="view form-control" onChange={this.handleSnippetChange} onKeyUp={this.handleRemoveSnippetError} id="blogSnippet" name="snippet" defaultValue={this.initialDraft.snippet}></textarea>
                <div className="snippet-error">{this.state.snippetError}</div>
                <label className="form-label lead mt-3" htmlFor="body">Body</label>
                <textarea className="view form-control" onKeyDown={this.handleTab} onKeyUp={this.handleRemoveBodyError} onChange={this.handleBodyChange}  id="blogBody" name="body" defaultValue={this.initialDraft.body}></textarea>
                <div className="body-error">{this.state.bodyError}</div>
                <h2 className="introduce-new-blog mt-4">Preview:</h2>
                <div className="container-fluid view-blog-date mt-5">
                    <p className="text-secondary">{todaysDate}</p>
                </div>
                <div className="container-fluid mb-4">
                    <h1>{this.state.title}</h1>
                    <p className="lead"><em>{blogAuthor}</em></p>
                    <div id="preview" className="py-4 mb-5 blog-body-container">
                    </div>
                </div>
                <button id="save" className="btn btn-info save me-3 text-light" type="submit">
                    <i className="bi bi-save text-light me-1" style={this.state.saveIconStyle}></i>
                    <span id="saving-spinner" className="spinner-border spinner-border-sm me-1" role="status" style={this.state.spinnerStyle} aria-hidden="true"></span>
                    Save
                </button>
                <input type="submit" id="submit" className="btn btn-primary submit" name="submit" value="Submit"/>
            </form>
        </div>
        )
    }
}

ReactDOM.render(<App />, document.getElementById("app"))

