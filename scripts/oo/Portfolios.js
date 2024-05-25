export default class Portfolio {
    constructor(data, id) {
        const  owner = data.filter((entries) => entries["photographerId"] == id);
        this.medias = owner;
        console.log(owner);
    }
    sortBy(filter) {
        if (filter == "likes") {
        this.medias.sort((a, b) => b.likes - a.likes);
        }
        else if (filter == "date") {
            this.medias.sort((a, b) => new Date(b.date) - new Date(a.date));
        }
        else if (filter == "title") {
            this.medias.sort((a, b) => a.title.localeCompare(b.title));
        }
    }
}