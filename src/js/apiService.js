import axios from "axios";
import Notiflix from "notiflix";

export default class SearchImages {
  constructor() {
    this.searchQueary = "";
    this.pageNumber = 1;
    this.KEY = "24237736-ec4fd4f15412e68e53af9bc23";
  }

  axiosImage() {
    if (this.searchQueary) {
      Notiflix.Loading.arrows();
      return axios
        .get(
          `https://pixabay.com/api/?image_type=photo&orientation=horizontal&q=${this.searchQueary}&page=${this.pageNumber}&per_page=12&key=${this.KEY}`,
        )
        .then(result => {
          return result;
        })
        .catch(result => {
          // console.log(result);
          Notiflix.Notify.warning("Something went wrong. Try another search request");
          Notiflix.Loading.remove();
        });
    }
  }

  incrementPage() {
    this.pageNumber += 1;
  }
  resetPage() {
    this.pageNumber = 1;
  }
  get queary() {
    return this.searchQueary;
  }
  set queary(newQueary) {
    this.searchQueary = newQueary;
  }
}
