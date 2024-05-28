/*
function photographerTemplate(data) {
    const { name, city, country, tagline, price, portrait } = data;

    //console.log(portrait)
    const picture = `assets/photographers/${portrait}`;

     this should actually be returning an abstract DOM without appending anything
    ideally only create simple markup and attributes 
    function getUserCardDOM() {

        const article = document.createElement( 'article' );
        article.classList.add("photographerCard");
        const a_toPage = document.createElement( 'a' );
        const img_photo = document.createElement( 'img' );
        img_photo.setAttribute("src", picture);
        const h2_name = document.createElement( 'h2' );
        h2_name.classList.add("photographerName");
        h2_name.textContent = name;
        const h3_place = document.createElement( 'h3' );
        h3_place.classList.add("photographerPlace");
        h3_place.textContent = city + ", " + country;
        const p_tag = document.createElement('p');
        p_tag.classList.add("photographerTag")
        const p_price = document.createElement('p');
        p_tag.textContent = tagline;
        p_price.textContent = price;
        

         cas du DOM de l'index 
        article.appendChild(img);
        article.appendChild(h2);
        article.appendChild(h3);
        article.appendChild(p_tag);
        article.appendChild(p_price);
        return (article);
        
    }

    return {/* name, picture, getUserCardDOM }
}

*/