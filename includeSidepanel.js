async function includeSidepanelHTML() {
    let includeElements = document.querySelectorAll('[w3-include-html]');
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        file = element.getAttribute("w3-include-html"); 
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = 'Page not found';
        }
    }
    changeHeaderBadge()
}

function changeHeaderBadge() {
    let usernameAlias = localStorage.getItem('usernameAlias');
    document.getElementById('user_badge').textContent = usernameAlias;
  }
  