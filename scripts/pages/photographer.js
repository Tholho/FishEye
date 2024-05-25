import UserCardDOM from "../oo/UserCardDOM";
import MediaFactory from "../oo/MediaFactory";
import Portfolio from "../oo/Portfolios";
import sortArticlesBy from "../oo/Sorting";

function sortBy(element) {
    const button = document.querySelector(".dropdownBtn");
    console.log(element);
    sortGallery(element.dataset.value);
    element.parentNode.style.display = "none";
    button.innerHTML = element.textContent + `<i class="fa-solid fa-angle-down" title="Derouler le menu"></i>`;
    button.style.display = "block";
}

function cancelSort() {
    const button = document.querySelector(".dropdownBtn");
    const list = document.querySelector(".sortingSelector");

    list.style.display = "none";
    button.style.display = "block";
}

const cancelHandler = e => {
    const button = document.querySelector(".dropdownBtn");

    if (e.target != button) {
        cancelSort();
    }
};

function displaySortList(portfolio) {
    const button = document.querySelector(".dropdownBtn");
    const list = document.querySelector(".sortingSelector");
    const firstListItem = list.querySelector("li");
    const lastListItem = list.lastChild.previousSibling;
    lastListItem.addEventListener("focusout", cancelSort);

    button.style.display = "none";
    list.style.display = "block";
    firstListItem.focus();
    document.removeEventListener("click", cancelHandler);
    document.addEventListener("click", cancelHandler);
    list.onclick = function (event) {
        event.stopPropagation();
        let target = event.target;
        if (target.role != "option") {
            list.style.display = "none";
            button.style.display = "block";
        }
        else {
            portfolio.sortBy(target.dataset.value);
            target.parentNode.style.display = "none";
            button.innerHTML = target.textContent + `<i class="fa-solid fa-angle-down" title="Derouler le menu"></i>`;
            button.style.display = "block";
            makeGallery(portfolio);
            setupLightbox();
        }
    }
}

function sortingEventChain() {
    const button = document.querySelector(".dropdownBtn");
    button.addEventListener("click", displaySortList);
}


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
                return (jsonData);
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des données :', error);
            });
        return (jsonData);
    }
}

function displayHeaderDOM(photographerDOM) {
    const photographerHeader = document.querySelector(".photograph-header");
    const textDiv = document.createElement('div');
    textDiv.classList.add("photographerMainInfo")
    const h1_name = document.createElement('h1');
    h1_name.innerText = photographerDOM.h2_name.innerText;
    const   h2_place = document.createElement('h2');
    h2_place.innerText = photographerDOM.h3_place.innerText;
    textDiv.appendChild(h1_name);
    textDiv.appendChild(h2_place);
    textDiv.appendChild(photographerDOM.p_tagline);

    photographerHeader.prepend(textDiv);
    photographerDOM.img_photo.alt = "Photo de profil de " + h1_name.innerText;
    photographerHeader.appendChild(photographerDOM.img_photo);
}





async function fillLightbox(domElem) {
    const lightbox = document.querySelector("dialog");
    await lightbox.addEventListener("close", closeLightboxEvent);
    const previousImageFA = document.querySelector(".fa-angle-left");
    const nextImageFA = document.querySelector(".fa-angle-right");
    const closeFA = document.querySelector(".fa-xmark");
    const imgAndTitle = document.querySelector(".imgAndTitle");
    let cloneToLightbox = domElem.cloneNode(true);

    //Extracting image and title from DOM
    let media = cloneToLightbox.firstChild;
    let mediaTitle = cloneToLightbox.firstChild.nextSibling.firstChild.textContent;
    let h2_mediaTitle = document.createElement('h2');
    h2_mediaTitle.textContent = mediaTitle;

    if (media.nodeName == "VIDEO") {
        media.controls = true;
    }
    await imgAndTitle.prepend(h2_mediaTitle);
    await imgAndTitle.prepend(media);

    async function prevMediaEvent() {
        if (domElem.previousSibling) {
            let previousMedia = domElem.previousSibling;
            let previousClone = previousMedia.cloneNode(true);
            if (previousClone.nodeName == "VIDEO") {
                previousClone.controls = true;
            }
            imgAndTitle.innerHTML = '';
            fillLightbox(previousMedia);
            await removeLightboxListeners();
        }
        else {
            return;
        }
    }

    async function nextMediaEvent() {
        if (domElem.nextSibling) {
            let nextMedia = domElem.nextSibling;
            let nextClone = nextMedia.cloneNode(true);
            if (nextClone.nodeName == "VIDEO") {
                nextClone.controls = true;
            }
            imgAndTitle.innerHTML = '';
            fillLightbox(nextMedia);
            await removeLightboxListeners();
        }
        else {
            return;
        }
    }
    function arrowNav(event) {
        if (event.key == "ArrowRight") {
            nextMediaEvent(event);
        }
        else if (event.key == "ArrowLeft") {
            prevMediaEvent(event);
        }
    }
    await closeFA.addEventListener("click", closeLightbox);
    await nextImageFA.addEventListener("click", nextMediaEvent);
    await previousImageFA.addEventListener("click", prevMediaEvent);
    await document.addEventListener("keydown", arrowNav);

    async function closeLightbox() {
        await closeLightboxEvent();
        await lightbox.close();
    }
    
    async function closeLightboxEvent() {
        const imgAndTitle = document.querySelector(".imgAndTitle");
        /*
        const lightboxContent = document.querySelector(".lightboxContent");
        const deleteImg = lightboxContent.querySelector('img');
        const deleteVideo = lightboxContent.querySelector('video');
        if (deleteImg) {
            deleteImg.remove();
        }
        if (deleteVideo) {
            deleteVideo.remove();
        }
        */
       await removeLightboxListeners();
        imgAndTitle.innerHTML = '';
        console.log("wtf")
    }
    async function removeLightboxListeners() {
        await closeFA.removeEventListener("click", closeLightbox);
        await lightbox.removeEventListener("close", closeLightboxEvent);
        await nextImageFA.removeEventListener("click", nextMediaEvent);
        await previousImageFA.removeEventListener("click", prevMediaEvent);
        await document.removeEventListener("keydown", arrowNav);
    }
}



// building the lightbox must be externalized and will be called upon changing content, showmodal should call it once
async function showLightbox(event) {
    let originalEvent = event;
    fillLightbox(this.parentNode);
    const lightbox = document.querySelector(".lightboxModal");
    await lightbox.showModal();
    console.log("hello");

}


//fills the gallery with photographers medias
async function makeGallery(portfolio) {
    const gallery = document.querySelector(".gallery_section")
    const content = document.createElement("div");
    content.classList.add("gallery_content");
    portfolio.medias.forEach((media) => {
        const unit = new MediaFactory(media);
        const art = unit.makeArticle();
        content.appendChild(art);
    });
    let exists = document.querySelector(".gallery_content")
    //controle si la galerie existe, si oui, la remplace
    if (exists) {
        exists.replaceWith(content);
    }
    else {
        gallery.appendChild(content);
    }
}

//Main dynamic filling of the page with json data, it calls 3 important functions, displayHeader that will fill the Hero with
// the appropriate photographer's info, makeGallery that will fill the gallery section with medias, and finally likesManager 
// which will handle all likes dynamics
async function displayData(photographers, id, media) {
    photographers.forEach((photographer) => {
        const photographerModel = new UserCardDOM(photographer);
        if (photographerModel.id == id) {
            displayHeaderDOM(photographerModel);
            const price_footer = document.querySelector(".price_footer");
            price_footer.insertAdjacentText("afterbegin", photographer.price);
        }
    });
    const portfolio = new Portfolio(media, id);
    await makeGallery(portfolio);
    await sortingEventChain();
    await likesManager();
}

// Links the lightbox event to each media
function setupLightbox() {
    const mediaToLightbox = document.querySelectorAll(".mediaPart");
    mediaToLightbox.forEach(media => {
        media.addEventListener("click", showLightbox);
    });
}
const contact_modal = document.querySelector(".modal");
const closeSVG = document.querySelector(".closeSVG");

function closeModal() {
    contact_modal.style.display = "none";
    contact_modal.close();
    closeSVG.removeEventListener("click", closeModal);
    contact_modal.removeEventListener("close", closeModal);
}

function showContact(event) {
    contact_modal.style.display = "flex";
    contact_modal.showModal();
    closeSVG.addEventListener("click", closeModal);
    contact_modal.addEventListener("close", closeModal);
}

// Contact form event
function setupContact() {
    const contactButton = document.querySelector(".contact_button");
    contactButton.addEventListener("click", showContact);
}

//Dynamically initialize photographer's page
async function init() {
    let id = window.location.hash.substring(1);
    const { photographers, media } = await getPhotographers();
    await displayData(photographers, id, media);
    await setupLightbox();
    await setupContact();
};

//Document elements that must be loaded at the proper time 
// because the page must be loaded in timely manner

init();

//This adds a like when user interacts with heart icon and updates sticky footer
function incrementLike(event) {
    event.target.previousSibling.innerText = +event.target.previousSibling.innerText + 1;
    event.target.removeEventListener("click", incrementLike);
    totalLikes();
}

// Main likes function
function likesManager() {
    const likesDOM = document.querySelectorAll(".divLikes i");
    likesDOM.forEach(like => {
        like.addEventListener("click", incrementLike);
    });
    totalLikes();
}

//Sums up all likes from the DOM and updates footer accordingly when called
function totalLikes() {
    const likesSumDOM = document.querySelectorAll(".mediumLikes");
    let total = 0;
    likesSumDOM.forEach(likes => {
        total += +likes.textContent;
    });
    const likes_footer = document.querySelector(".likes_footer");
    likes_footer.innerText = total;
}
