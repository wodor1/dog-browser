import '../css/searchImageComponent.css';
import ContentComponent from '../contentComponent/contentComponent.js';
import LazyLoad from "vanilla-lazyload";
import preloading from '../img/preloading.gif';

class SearchImage extends ContentComponent {
  constructor() {
    super();
    this.render();
  }

  async getImages(dogBreed) {
    dogBreed = dogBreed.split(' ');
    let urlString;
    if (dogBreed.length === 1) {
      urlString = `https://dog.ceo/api/breed/${dogBreed[0]}/images`;
    } else if (dogBreed.length === 2) {
      urlString = `https://dog.ceo/api/breed/${dogBreed[1]}/${dogBreed[0]}/images`;
    }
    const response = await fetch(urlString);
    if (response.status === 404) {
      return;
    }
    if (!response.ok) {
      throw new Error('API response error');
    }
    const data = await response.json();
    return data.message;
  }

  displayImage(imageList) {
    const image = document.createElement('img');
    const classes = image.classList;
    classes.add("lazy");
    image.textContent = classes;
    image.src = preloading;
    image.setAttribute('data-srcset', imageList[Math.floor(Math.random() * imageList.length)]);
    //image.src = imageList[Math.floor(Math.random() * imageList.length)];
    // this.clearContent();
    this.clearErrors();
    const lazyLoadInstance = new LazyLoad({
    });
    document.querySelector('#content').appendChild(image);
    lazyLoadInstance.update();
  }

  handleSearch() {
     // megakadályozzuk a form küldését
     event.preventDefault();
     const searchTerm = document.querySelector('#dogSearchInput').value.toLowerCase();
     if (!searchTerm) {
       this.displayError('Please enter a search term');
       return;
     }
     this.getImages(searchTerm)
       .then((imageList) => {
         if (imageList) {
           let count = parseFloat(Math.floor(document.querySelector('#imageNumberInput').value));
           this.clearContent();
           if (count === 1 || isNaN(count) === true || count === 0) {
             count = 1;
             this.displayImage(imageList);
           } else if (count > 1) {
             for (let i = 1; i <= count; i++) {
               this.displayImage(imageList);
             }
           } else {
               this.displayError('Please enter a valid number');
           }
         } else {
           this.displayError('Breed not found. Please try to list the breeds first.');
         }
       })
       .catch((error) => {
         this.displayError('Something went wrong. Please try again later.');
         console.error(error);
       });
  }

  render() {
    const markup = `
    <form class="dog-search">
      <span class="search-icon"></span>
      <input type="text" id="dogSearchInput">
      <input type="text" id="imageNumberInput" placeholder="1">
      <button type="submit">Search</button>
    </form>
    `;
    document.querySelector('#header').insertAdjacentHTML('beforeend', markup);
    document.addEventListener('onSearch', (e) => {
      document.querySelector('#dogSearchInput').value = e.detail;
      this.handleSearch();
    });
    document.querySelector('.dog-search button').addEventListener('click', (e) =>  {
      e.preventDefault();
      this.handleSearch();
    });
  }
}

export default SearchImage;