export default class   UserCardDOM { 
     constructor(data) {
        const picture = `assets/photographers/${data.portrait}`;
        this.img_photo = document.createElement('img');
        this.img_photo.setAttribute("src", picture);
        this.h2_name = document.createElement('h2');
        this.h2_name.classList.add("photographerName");
        this.h2_name.textContent = data.name;
        this.h3_place = document.createElement('h3');
        this.h3_place.classList.add("photographerPlace");
        this.h3_place.textContent = data.city + ", " + data.country;
        this.p_tagline = document.createElement('p');
        this.p_tagline.classList.add("photographerTagline");
        this.p_tagline.textContent = data.tagline;
        this.p_price = document.createElement('p');
        this.p_price.classList.add("photographerPrice");
        this.p_price.textContent = data.price;
        this.id = data.id;
     }
 }