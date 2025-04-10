const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const resultsList = document.getElementById('results-list');
const authorInputField = document.getElementById('author-filter');
const genresContainer = document.getElementById('genres-container');
const shopItemsContainer = document.getElementById('shop-items-container');
const msgFeedback = document.getElementById('msg-feedback');
const msgFeedbackItemName = document.getElementById('msg-feedback-item-name');
const okButton = document.getElementById('ok-button');

okButton.addEventListener("click", () => {
    msgFeedback.style.display = 'none'
})

searchInput.addEventListener("keypress", (event) => {
    if(event.key == "Enter") {
        event.preventDefault()
        searchButton.click()
    }
})

function addItemToCart(id) {
    const url = `api/cart/add/${id}`;
    const data = {
        hello: "hello"
    };

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
    })
    .then(result => {
        if(result.errMsg == 'noLoginError') {
            window.location.replace("login");
        } else {
            console.log('Success:', result.book.title);
            msgFeedbackItemName.textContent = `${result.book.title}`
            console.log(msgFeedback.style.display)
            msgFeedback.style.display = 'flex'
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

searchButton.addEventListener('click', () => {
    const query = searchInput.value;
    let searchStr = `api/search?q=${query}`;
    
    /**
     * Instead of having radio buttons, it is possible to
     * use checkboxes, and store each checked boxs' label
     * into the array. Note that the backend must be 
     * modified reflect this change.
     */
    const radio_collection = genresContainer.getElementsByClassName("genre-filter-button")
    for(let i = 0; i < radio_collection.length; i++) {
        if(radio_collection[i].checked) {
            searchStr = searchStr + `&genre=${radio_collection[i].parentElement.textContent}`
        }
    }

    if(authorInputField.value != null && authorInputField.value != "") {
        searchStr = searchStr + `&author=${authorInputField.value}`
    }

    fetch(searchStr)
        .then(response => response.json())
        .then(data => {
            shopItemsContainer.innerHTML = '';

            if(data == null || data.length > 0) {
            data.forEach(item => {
                const markup = `<div class="item-card">
            <div class="shop-items-img-container">
                <img src="${item.filePath}" alt="Image of ${item.title} by ${item.author}" />    
            </div>
            <div class="item-card-lower-01">
                <div class="shop-item-info-container">
                    <h1 class="item-title-label">${item.title}</h1>
                    <p class="item-subtitle-label">by ${item.author}</p>
                    <p class="item-subtitle-label">${item.genre}</p>
                </div>
                <div class="item-card-lower-02">
                    <h1 class="item-price-label">${item.price}</h1>
                    <button class="item-button" aria-label="Add ${item.title} by ${item.author} to Cart" onclick="addItemToCart(${item.id})">Add to Cart</button>
                </div>
            </div>
        </div>`
            
            shopItemsContainer.insertAdjacentHTML('beforeend', markup)
                
            });
            } else {
                const fillermarkup = `<div class="center-content"><p class="no-items-feedback"></p></div>`
                const markup = `<div class="center-content"><p class="no-items-feedback">No results found</p></div>`
                shopItemsContainer.insertAdjacentHTML('beforeend', fillermarkup)
                shopItemsContainer.insertAdjacentHTML('beforeend', markup)
            }
        });
});