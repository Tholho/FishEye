export default class Photo {
    constructor(data) {
        const picture = `assets/media/${data.photographerId}/${data.image}`;
        this.article = document.createElement('article');
        const media = document.createElement('img');
        const div_text = document.createElement('div');
        const h3_title = document.createElement('h3');
        const p_likes = document.createElement('p');
        const fa_likes = document.createElement('i');
        const div_likes = document.createElement('div');

        media.src = picture;
        media.alt = "Une photo nommée " + data.title;
        media.tabIndex = 0;
        media.classList.add("mediaPart");
        media.ariaLabel = data.title + ", close up view";
        this.article.appendChild(media);
        h3_title.textContent = data.title;
        div_text.appendChild(h3_title);
        this.likes = data.likes;
        p_likes.textContent = this.likes;
        p_likes.classList.add("mediumLikes");
        fa_likes.classList.add("fa-solid", "fa-heart");
        fa_likes.ariaLabel = "likes";
        div_likes.appendChild(p_likes);
        div_likes.appendChild(fa_likes);
        div_likes.classList.add("divLikes");
        div_text.appendChild(div_likes);
        div_text.classList.add("textData");
        this.article.appendChild(div_text);
        this.date = data.date;
        this.price = data.price;
        this.order = 0;
        this.url = picture;
        this.liked = 0;
        this.title = data.title;
    }
    makeArticle() {
        const article = this.article;
        return (article)
    }   
}