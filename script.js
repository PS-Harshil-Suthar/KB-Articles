let articles = JSON.parse(localStorage.getItem('articles')) || [];
const articlesSection = document.getElementById('articles');
const categoryList = document.getElementById('categories');
const searchBar = document.getElementById('search-bar');
const addArticleBtn = document.getElementById('add-article-btn');
const modal = document.getElementById('article-modal');
const articleForm = document.getElementById('article-form');
const cancelBtn = document.getElementById('cancel-btn');

// Initialize Quill editor
const quill = new Quill('#article-content', {
    theme: 'snow'
});

function saveArticles() {
    localStorage.setItem('articles', JSON.stringify(articles));
}

function renderArticles(articlesToRender = articles) {
    articlesSection.innerHTML = '';
    articlesToRender.forEach(article => {
        const articleDiv = document.createElement('div');
        articleDiv.className = 'article';
        articleDiv.innerHTML = `
            <h2>${article.title}</h2>
            <p><strong>Category:</strong> ${article.category}</p>
            <p>${article.content}</p>
            <div class="article-actions">
                <button onclick="editArticle(${article.id})" class="btn btn-primary">Edit</button>
                <button onclick="deleteArticle(${article.id})" class="btn btn-danger">Delete</button>
            </div>
        `;
        articlesSection.appendChild(articleDiv);
    });
}

function renderCategories() {
    const categories = [...new Set(articles.map(article => article.category))];
    categoryList.innerHTML = '';
    categories.forEach(category => {
        const li = document.createElement('li');
        li.textContent = category;
        categoryList.appendChild(li);
    });
}

function addOrEditArticle(event) {
    event.preventDefault();
    const title = document.getElementById('article-title').value;
    const category = document.getElementById('article-category').value;
    const content = quill.root.innerHTML;  // Get content from Quill editor
    const id = document.getElementById('article-id').value;

    if (id) {
        // Edit existing article
        const index = articles.findIndex(article => article.id == id);
        articles[index] = { id: parseInt(id), title, category, content };
    } else {
        // Add new article
        const newId = articles.length > 0 ? Math.max(...articles.map(a => a.id)) + 1 : 1;
        articles.push({ id: newId, title, category, content });
    }

    saveArticles();
    renderArticles();
    renderCategories();
    closeModal();
}

function editArticle(id) {
    const article = articles.find(article => article.id === id);
    document.getElementById('article-id').value = article.id;
    document.getElementById('article-title').value = article.title;
    document.getElementById('article-category').value = article.category;
    quill.root.innerHTML = article.content;  // Set content in Quill editor
    openModal();
}

function deleteArticle(id) {
    articles = articles.filter(article => article.id !== id);
    saveArticles();
    renderArticles();
    renderCategories();
}

function openModal() {
    modal.style.display = 'block';
}

function closeModal() {
    modal.style.display = 'none';
    articleForm.reset();
    quill.root.innerHTML = '';  // Clear Quill editor content
    document.getElementById('article-id').value = '';
}

searchBar.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredArticles = articles.filter(article => 
        article.title.toLowerCase().includes(searchTerm) || 
        article.content.toLowerCase().includes(searchTerm)
    );
    renderArticles(filteredArticles);
});

addArticleBtn.addEventListener('click', openModal);
cancelBtn.addEventListener('click', closeModal);
articleForm.addEventListener('submit', addOrEditArticle);

// Initial render
renderArticles();
renderCategories();
