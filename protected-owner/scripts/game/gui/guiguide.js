
/*
 * This script handles the Guide
 */

const guiguide = (function() {

    const element_Guide = document.getElementById('guide');
    const element_Back = document.getElementById('guide-back')

    // The element that holds all fairy images
    const element_FairyImg = document.getElementById('fairy-pieces');
    // The element that holds all fairy descriptions
    const element_FairyCard = document.getElementById('fairy-card');
    const element_FairyBack = document.getElementById('fairy-back')
    const element_FairyForward = document.getElementById('fairy-forward')

    let fairyIndex = 0;
    let maxFairyIndex = 7;


    function open() {
        style.revealElement(element_Guide);
        initListeners();
        loadAllImages();
    }

    function close() {
        style.hideElement(element_Guide);
        closeListeners();
    }

    function initListeners() {
        element_Back.addEventListener('click', callback_Back)
        element_FairyBack.addEventListener('click', callback_FairyBack)
        element_FairyForward.addEventListener('click', callback_FairyForward)
    }

    function closeListeners() {
        element_Back.removeEventListener('click', callback_Back)
        element_FairyBack.removeEventListener('click', callback_FairyBack)
        element_FairyForward.removeEventListener('click', callback_FairyForward)
    }

    function loadAllImages() {
        const images = element_Guide.querySelectorAll('img');
        images.forEach(img => {
            if (img.src) return; // Already loaded
            img.src = img.getAttribute('data-src');  // Assumes each img has a 'data-src' attribute with the actual image URL
        });
    }

    function callback_Back() {
        close();
        guititle.open();
    }

    function callback_FairyBack(event) {
        event = event || window.event;
        if (fairyIndex === 0) return;
        hideCurrentFairy();
        fairyIndex--;
        revealCurrentFairy();
        updateArrowTransparency();
    }

    function callback_FairyForward(event) {
        event = event || window.event;
        if (fairyIndex === maxFairyIndex) return;
        hideCurrentFairy();
        fairyIndex++;
        revealCurrentFairy();
        updateArrowTransparency();
    }

    function hideCurrentFairy() {
        const allFairyImgs = element_FairyImg.querySelectorAll('img')
        const targetFairyImg = allFairyImgs[fairyIndex];
        style.hideElement(targetFairyImg)

        const allFairyCards = element_FairyCard.querySelectorAll('.fairy-card-desc')
        const targetFairyCard = allFairyCards[fairyIndex];
        style.hideElement(targetFairyCard)
    }

    function revealCurrentFairy() {
        const allFairyImgs = element_FairyImg.querySelectorAll('img')
        const targetFairyImg = allFairyImgs[fairyIndex];
        style.revealElement(targetFairyImg)

        const allFairyCards = element_FairyCard.querySelectorAll('.fairy-card-desc')
        const targetFairyCard = allFairyCards[fairyIndex];
        style.revealElement(targetFairyCard)
    }

    function updateArrowTransparency() {
        if (fairyIndex === 0) element_FairyBack.classList.add('opacity-0_25')
        else                  element_FairyBack.classList.remove('opacity-0_25')

        if (fairyIndex === maxFairyIndex) element_FairyForward.classList.add('opacity-0_25')
        else                              element_FairyForward.classList.remove('opacity-0_25')
    }

    return Object.freeze({
        open,
        close
    })

})();