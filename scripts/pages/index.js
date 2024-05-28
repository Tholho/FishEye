import UserCardDOM from "../oo/UserCardDOM";
    //control if it is in storage, if it is, return it, else it will set it in storage
    async function getPhotographers() {
        const data = sessionStorage.getItem("sessionJson");
        if (data != null) {
            const jsonData = JSON.parse(data);
            return (jsonData);
        }
        else {

        const jsonData = fetch("data/photographers.json")
            .then(response => {
              if (!response.ok) {
                throw new Error('La requête a échoué');
              }
              return response.json();
            })
            .then(jsonData => {
              sessionStorage.setItem("sessionJson", JSON.stringify(jsonData));
              return(jsonData);
            })
            .catch(error => {
              console.error('Erreur lors de la récupération des données :', error);
            });

        console.log(jsonData)
        return (jsonData);
        }
    }

    function    makeArticle(DOM) {
        const article = document.createElement('article');
        article.classList.add("photographerCard");
        const a_toPage = document.createElement('a');
        a_toPage.href = `photographer.html#${DOM.id}`;
        a_toPage.ariaLabel = `Voir le profil de ${DOM.h2_name.textContent}`
        a_toPage.tabIndex = 0;
        DOM.img_photo.alt = "Photo de profil de " + DOM.h2_name.textContent;
        a_toPage.appendChild(DOM.img_photo);
        a_toPage.appendChild(DOM.h2_name);
        article.appendChild(a_toPage);
        article.appendChild(DOM.h3_place);
        article.appendChild(DOM.p_tagline);
        const article_price = DOM.p_price.cloneNode(true);
        article_price.textContent = article_price.textContent + "€/jour";
        article.appendChild(article_price);
        return (article);
    }

    async function displayData(photographers) {
        const photographersSection = document.querySelector(".photographer_section");
        photographers.forEach((photographer) => {
            const photographerDOM = new UserCardDOM(photographer);
            const articleDOM = makeArticle(photographerDOM);
            photographersSection.appendChild(articleDOM);
        });
    }

    async function init() {
        const { photographers } = await getPhotographers();
        displayData(photographers)
    }
    
    init();
    
