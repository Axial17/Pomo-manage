async function fetchQuote() {
    const textElem = document.getElementById('quote-text');
    const authorElem = document.getElementById('quote-author');
    
    try {
        const response = await fetch('https://api.allorigins.win/get?url=' + encodeURIComponent('https://zenquotes.io/api/random'));
        const data = await response.json();
        const quote = JSON.parse(data.contents)[0];

        textElem.style.opacity = 0;
        authorElem.style.opacity = 0;

        setTimeout(() => {
            textElem.textContent = `«${quote.q}»`;
            authorElem.textContent = quote.a;
            textElem.style.opacity = 1;
            authorElem.style.opacity = 1;
        }, 300);

    } catch (error) {
        textElem.textContent = "«Единственный способ делать великие дела — любить то, что вы делаете.»";
        authorElem.textContent = "Стив Джобс";
    }
}

document.addEventListener('DOMContentLoaded', () => {
    fetchQuote();
    
    const refreshBtn = document.getElementById('new-quote-btn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', fetchQuote);
    }
});