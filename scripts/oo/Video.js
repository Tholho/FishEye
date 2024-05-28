export default class Video {
    constructor(data) {
        const file = `assets/media/${data.photographerId}/${data.video}`;
        this.article = document.createElement('article');
        const media  = document.createElement('video');
        const src = document.createElement('source');
        const div_text = document.createElement('div');
        const h3_title = document.createElement('h3');
        const p_likes = document.createElement('p');
        const fa_likes = document.createElement('i');
        const div_likes = document.createElement('div');

        src.src = file;
        src.type = "video/mp4";
        media.appendChild(src);
        media.tabIndex = 0;
        media.classList.add("mediaPart");
        media.ariaLabel = "Une video artistique, close up view";
        this.article.appendChild(media);
        h3_title.textContent = data.title;
        div_text.appendChild(h3_title);
        p_likes.textContent = data.likes;
        p_likes.classList.add("mediumLikes");
        fa_likes.classList.add("fa-solid", "fa-heart");
        div_likes.appendChild(p_likes);
        div_likes.appendChild(fa_likes);
        div_likes.classList.add("divLikes");
        div_text.appendChild(div_likes);
        div_text.classList.add("textData");
        this.article.appendChild(div_text);
        this.date = data.date;
        this.price = data.price;
        this.likes = data.likes;
        this.order = 0;
        this.url = file;
    }
    makeArticle() {
        const article = this.article;
        return (article)
    }   
}
