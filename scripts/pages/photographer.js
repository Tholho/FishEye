import UserCardDOM from "../oo/UserCardDOM";
import MediaFactory from "../oo/MediaFactory";
import Portfolio from "../oo/Portfolios";


const button = document.querySelector(".dropdownBtn");
const list = document.querySelector(".sortingSelector");

function displaySort() {
    button.style.display = "none";
    button.ariaExpanded = "true";
    list.style.display = "block";
}

function cancelSort() {
    list.style.display = "none";
    button.style.display = "block";
    button.ariaExpanded = "false";
}


const cancelHandler = e => {
    const button = document.querySelector(".dropdownBtn");

    if (e.target != button) {
        cancelSort();
    }
};

//json to data, either it comes from the original file, either it comes from session storage
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

//Dynamic creation of the photographer infos section of the page
function displayHeaderDOM(photographerDOM) {
    const photographerHeader = document.querySelector(".photograph-header");

    const name_modal = document.querySelector(".name_modal");
    name_modal.innerText = photographerDOM.h2_name.innerText;

    const modal = document.querySelector(".modal");
    modal.ariaLabel = "Contact me " + photographerDOM.h2_name.innerText;

    const textDiv = document.createElement('div');
    textDiv.classList.add("photographerMainInfo")

    const h1_name = document.createElement('h1');
    h1_name.innerText = photographerDOM.h2_name.innerText;

    const h2_place = document.createElement('h2');
    h2_place.innerText = photographerDOM.h3_place.innerText;

    textDiv.appendChild(h1_name);
    textDiv.appendChild(h2_place);
    textDiv.appendChild(photographerDOM.p_tagline);
    photographerHeader.prepend(textDiv);

    photographerDOM.img_photo.alt = "Photo de profil de " + h1_name.innerText;
    photographerHeader.appendChild(photographerDOM.img_photo);
}

//This big function creates all the DOM and its dynamic linking to allow navigation among medias
async function fillLightbox(domElem) {
    const lightbox = document.querySelector("dialog");
    await lightbox.addEventListener("close", closeLightboxEvent);

    const previousImageLink = document.querySelector(".prevImageLink");
    const nextImageLink = document.querySelector(".nextImageLink");
    const closeFA = document.querySelector(".fa-xmark");
    const imgAndTitle = document.querySelector(".imgAndTitle");

    let cloneToLightbox = domElem.cloneNode(true);

    //Extracting image and title from DOM
    let media = cloneToLightbox.firstChild;
    let mediaTitle = media.nextSibling.firstChild.textContent;

    let h2_mediaTitle = document.createElement('h2');
    h2_mediaTitle.textContent = mediaTitle;

    if (media.nodeName == "VIDEO") {
        media.controls = true;
    }
    await imgAndTitle.prepend(h2_mediaTitle);
    media.ariaLabel = h2_mediaTitle.textContent;
    await imgAndTitle.prepend(media);
    media.focus();
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
    await nextImageLink.addEventListener("click", nextMediaEvent);
    await previousImageLink.addEventListener("click", prevMediaEvent);
    await document.addEventListener("keydown", arrowNav);

    closeFA.removeEventListener("keydown", enterToClick);
    closeFA.addEventListener("keydown", enterToClick);
    nextImageLink.removeEventListener("keydown", enterToClick);
    nextImageLink.addEventListener("keydown", enterToClick);
    previousImageLink.removeEventListener("keydown", enterToClick);
    previousImageLink.addEventListener("keydown", enterToClick);


    async function closeLightbox() {
        await closeLightboxEvent();
        await lightbox.close();
    }

    async function closeLightboxEvent() {
        const imgAndTitle = document.querySelector(".imgAndTitle");

        await removeLightboxListeners();
        imgAndTitle.innerHTML = '';
    }
    async function removeLightboxListeners() {
        await closeFA.removeEventListener("click", closeLightbox);
        await lightbox.removeEventListener("close", closeLightboxEvent);
        await nextImageLink.removeEventListener("click", nextMediaEvent);
        await previousImageLink.removeEventListener("click", prevMediaEvent);
        await document.removeEventListener("keydown", arrowNav);
    }
}

// Shows lightbox and calls the function that creates DOM
async function showLightbox() {
    fillLightbox(this.parentNode);
    const lightbox = document.querySelector(".lightboxModal");
    await lightbox.showModal();
}

//fills the gallery with photographers medias
async function makeGallery(portfolio) {
    const gallery = document.querySelector(".gallery_section")
    const content = document.createElement("div");
    content.classList.add("gallery_content");
    portfolio.medias.forEach(media => {
        const unit = new MediaFactory(media);
        const art = unit.makeArticle();
        content.appendChild(art);
    })
    makeReplaceGallery();
    likesManager(portfolio);

    function makeReplaceGallery() {
        let galleryExists = document.querySelector(".gallery_content")
        if (galleryExists) {
            galleryExists.replaceWith(content);
        }
        else {
            gallery.appendChild(content);
        }
    }
}

//Laying event logic for keyboard navigation and dynamic aria attributes of sorting list
function setupSort() {
    const listItems = list.querySelectorAll("li");
    function arrowSort(event) {
        event.preventDefault();
        if (event.key === "Escape") {
            cancelSort();
        }
        const prevSibling = event.target.previousElementSibling;
        const nextSibling = event.target.nextElementSibling;

        if (event.key === "ArrowUp" || (event.shiftKey && event.key === "Tab") && prevSibling?.nodeName == "LI") {
            prevSibling.focus();
        }
        else if (event.key === "ArrowDown" || (!event.shiftKey && event.key === "Tab") && nextSibling?.nodeName == "LI") {
            nextSibling.focus();
        }
    }

    function selectAria(event) {
        list.setAttribute("aria-activedescendant", event.target.id);
    }

    function deselectAria(event) {
        if (button.innerText === event.target.innerText) {
            list.setAttribute("aria-activedescendant", event.target.id);
            event.target.ariaSelected = "true";
            listItems.forEach(item => {
                if (item != event.target) {
                    item.ariaSelected = "false";
                }
            })
        }
        else {
            event.target.ariaSelected = "false";
        }
    }

    listItems.forEach(item => {
        item.addEventListener("keydown", arrowSort);
        item.addEventListener("focusin", selectAria);
        item.addEventListener("focusout", deselectAria);
    });
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

    await makeGallery(portfolio)
    await likesManager(portfolio);


    const button = document.querySelector(".dropdownBtn");
    const list = document.querySelector(".sortingSelector");
    button.addEventListener("click", displaySortList);


    function displaySortList() {
        const firstListItem = list.querySelector("li");
        displaySort();
        firstListItem.focus();

        document.removeEventListener("click", cancelHandler);
        document.addEventListener("click", cancelHandler);
        list.onclick = function (event) {
            event.stopPropagation();
            let target = event.target;
            if (target.role != "option") {
                cancelSort();
            }
            else {
                portfolio.sortBy(target.dataset.value);
                target.parentNode.style.display = "none";
                button.innerHTML = target.textContent + `<i class="fa-solid fa-angle-down" title="Derouler le menu"></i>`;
                button.style.display = "block";
                makeGallery(portfolio)
                    .then(() => setupLightbox());
                button.ariaExpanded = "false";
            }
        }
        //Keyboard handling of previous click event for accessible navigation
        list.removeEventListener("keydown", enterToClick);
        list.addEventListener("keydown", enterToClick);
    }
}

// Links the lightbox event to each media
function setupLightbox() {
    const mediaToLightbox = document.querySelectorAll(".mediaPart");
    mediaToLightbox.forEach(media => {
        media.addEventListener("click", showLightbox);
        media.addEventListener("keydown", enterToClick);
    });
}
const contact_modal = document.querySelector(".modal");
const closeSVG = document.querySelector(".closeSVG");
const submit = document.querySelector(".submit_button");


// Contact Form closing cleanup
async function closeModal() {
    contact_modal.style.display = "none";
    await closeSVG.removeEventListener("click", closeModal);
    await contact_modal.removeEventListener("close", closeModal);
    await submit.removeEventListener("click", submitForm);
    await submit.removeEventListener("keydown", enterToClick);
    await contact_modal.close();
}

// Contact Form opening events
async function showContact() {
    contact_modal.style.display = "flex";
    contact_modal.showModal();
    await closeSVG.addEventListener("click", closeModal);
    await contact_modal.addEventListener("close", closeModal);
    await submit.addEventListener("click", submitForm);
    await submit.addEventListener("keydown", enterToClick);
    await contact_modal.showModal();
}

// Contact form display event
function setupContact() {
    const contactButton = document.querySelector(".contact_button");
    contactButton.addEventListener("click", showContact);
}

// Contact form submit event
function submitForm(event) {
    event.preventDefault();

    const form_inputs = document.querySelectorAll("input, textarea");
    form_inputs.forEach(input => {
        if (input.value) {
            console.log(input.value);
        }
    });
    closeModal();
}

//Dynamically initialize photographer's page
async function init() {
    let id = window.location.hash.substring(1);
    const { photographers, media } = await getPhotographers();
    displayData(photographers, id, media)
        .then(() => setupLightbox())
        .then(() => setupContact())
        .then(() => setupSort());
};


// Main likes function, ensures each media is only liked once but only client side
function likesManager(portfolio) {
    const likesDOM = document.querySelectorAll(".divLikes i");
    likesDOM.forEach(like => {
        like.addEventListener("click", function incrementLike(event) {
            const medialikes = portfolio.medias.find(media => media.title === event.target.parentNode.previousElementSibling.innerText);
            if (medialikes.liked != 1) {
                medialikes.liked = 1;
                medialikes.likes++;
                event.target.previousSibling.innerText = +event.target.previousSibling.innerText + 1;
                event.target.removeEventListener("click", incrementLike);
            }
            totalLikes();
        });
    });
    totalLikes();
}

// Sums up all likes from the DOM and updates footer accordingly when called
function totalLikes() {
    const likesSumDOM = document.querySelectorAll(".mediumLikes");
    let total = 0;
    likesSumDOM.forEach(likes => {
        total += +likes.textContent;
    });
    const likes_footer = document.querySelector(".likes_footer");
    likes_footer.innerText = total;
}

// Allows to easily makes "Enter Key" trigger click events
function enterToClick(event) {
    if (event.key === "Enter") {
        event.target.click();
    }
};

init();