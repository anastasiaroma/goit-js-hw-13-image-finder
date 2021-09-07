import SearchImage from "./apiService";
import refs from "./get-refs";
import createGalleryMurkup from "../templates/gallery";
import "../../node_modules/material-design-icons/iconfont/material-icons.css";
import Notiflix from "notiflix";
import "../sass/main.scss";
const searchImage = new SearchImage();

refs.form.addEventListener("submit", createGallary);
refs.input.focus();

Notiflix.Loading.init({
  svgColor: "#393b3d",
});
Notiflix.Notify.init({
  success: {
    background: "rgba(89, 235, 76, 0.5)",
  },
});

let totalResult = 0;
const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      loadMore();
      observer.unobserve(entry.target);
    }
  });
});
function AddObserver() {
  observer.observe(refs.gallery.lastElementChild);
}

function createGallary(e) {
  searchImage.resetPage();
  e.preventDefault();
  searchImage.queary = refs.input.value;
  if (searchImage.searchQueary) {
    searchImage.axiosImage().then(obj => {
      if (obj.data.hits.length > 0) {
        Notiflix.Notify.success(`We found ${obj.data.totalHits} pictures for you`);
        refs.gallery.innerHTML = "";
        createDOMelement(obj);
        searchImage.incrementPage();
      } else {
        Notiflix.Notify.warning("We didn't find no one image, please try another search request");
        Notiflix.Loading.remove();
      }
    });
  }
}

function createDOMelement(obj) {
  const gallery = createGalleryMurkup(obj.data.hits);
  refs.gallery.insertAdjacentHTML("beforeend", gallery);
  Notiflix.Loading.remove();
  totalResult = refs.gallery.children.length;

  if (totalResult < obj.data.totalHits) {
    AddObserver();
  } else {
    Notiflix.Notify.warning("The end of search result");
  }
}

function loadMore() {
  searchImage.axiosImage().then(obj => {
    createDOMelement(obj);
    searchImage.incrementPage();
  });
  checkCurrentImg();
}

// modal slider

let currentImgIndex = 0;
let arrayImg = null;

document.addEventListener("keydown", onESCKeydown);
document.addEventListener("keydown", onArrowPress);
refs.gallery.addEventListener("click", showModalslider);

function showModalslider(e) {
  if (e.target.nodeName !== "IMG") {
    return;
  }
  refs.body.classList.add("overflow-hiden");
  e.preventDefault();
  refs.modalEl.classList.add("is-open");
  refs.modalImgEl.src = e.target.closest(".grid__item__image").dataset.origin;
  refs.modalImgEl.alt = e.target.alt;

  refs.modalCloseBtn.addEventListener("click", onModalCloseBtnClick);
  refs.overlayEl.addEventListener("click", onModalCloseBtnClick);
  checkCurrentImg();
  refs.turnRight.addEventListener("click", turnRight);
  refs.turnLeft.addEventListener("click", turnLeft);
  updatePaginate();
}

function onModalCloseBtnClick() {
  refs.modalEl.classList.remove("is-open");
  refs.modalImgEl.src = "";
  refs.modalImgEl.alt = "";
  refs.modalCloseBtn.removeEventListener("click", onModalCloseBtnClick);
  refs.overlayEl.removeEventListener("click", onModalCloseBtnClick);
  refs.body.classList.remove("overflow-hiden");
}

function onESCKeydown(e) {
  if (e.code !== "Escape") {
    return;
  }
  onModalCloseBtnClick();
}
function updatePaginate() {
  refs.paginate.textContent = `${currentImgIndex + 1} / ${arrayImg.length}`;
}

function checkCurrentImg() {
  if (refs.modalEl.classList.contains("is-open")) {
    const currentImgSrc = refs.modalImgEl.src;
    arrayImg = [...document.querySelectorAll(".grid__item__image")];
    currentImgIndex = arrayImg.indexOf(arrayImg.find(item => item.dataset.origin === currentImgSrc));
  }
}
function onArrowPress() {
  if (event.code === "ArrowRight") turnRight();
  if (event.code === "ArrowLeft") turnLeft();
}

function turnRight() {
  if (currentImgIndex === arrayImg.length - 1) {
    loadMore();
  }
  const nextImg = arrayImg[currentImgIndex + 1];
  if (nextImg) {
    refs.modalImgEl.src = nextImg.dataset.origin;
    refs.modalImgEl.alt = nextImg.alt;
  }
  checkCurrentImg();
  updatePaginate();
}

function turnLeft() {
  if (currentImgIndex === 0) return;
  const prevImg = arrayImg[currentImgIndex - 1];
  refs.modalImgEl.src = prevImg.dataset.origin;
  refs.modalImgEl.alt = prevImg.alt;
  checkCurrentImg();
  updatePaginate();
}
