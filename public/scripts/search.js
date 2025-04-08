const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const resultsList = document.getElementById('results-list');
const authorInputField = document.getElementById('author-filter');
const genresContainer = document.getElementById('genres-container');
const shopItemsContainer = document.getElementById('shop-items-container');


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
        console.log('Success:', result);
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
            data.forEach(item => {
                const markup = `<div class="item-card">
            <div>
                <img class="item-image" />    
            </div>
            <div class="item-card-lower-01">
                <div>
                    <label class="item-title-label">${item.title}</label><br>
                    <label class="item-subtitle-label">by ${item.author}</label><br>
                    <label class="item-subtitle-label">${item.genre}</label><br>
                    
                </div>
                <div class="item-card-lower-02">
                    <label class="item-price-label">${item.price}</label>
                    <a class="item-button" onclick="addItemToCart(${item.id})"><label>Add to Cart</label></a>
                </div>
            </div>
        </div>`
            
            shopItemsContainer.insertAdjacentHTML('beforeend', markup)

                // const li_id = document.createElement('li');
                // const li_title = document.createElement('li');
                // const li_genre = document.createElement('li');
                // const li_author = document.createElement('li');
                // const li_price = document.createElement('li');
                // const add_to_cart_button = document.createElement('button');
                // const hr_element = document.createElement('hr');

                // li_id.textContent = item.id;
                // li_title.textContent = item.title;
                // li_genre.textContent = item.genre;
                // li_author.textContent = item.author;
                // li_price.textContent = item.price;

                // add_to_cart_button.textContent = 'Add to Cart';
                // add_to_cart_button.onclick = function() {
                //     const url = `api/cart/add/${item.id}`;
                //     const data = {
                //         hello: "hello"
                //     };

                //     fetch(url, {
                //         method: 'POST',
                //         headers: {
                //             'Content-Type': 'application/json'
                //         },
                //         body: JSON.stringify(data)
                //     })
                //     .then(response => {
                //     if (!response.ok) {
                //         throw new Error(`HTTP error! status: ${response.status}`);
                //     }
                //     return response.json();
                //     })
                //     .then(result => {
                //         console.log('Success:', result);
                //     })
                //     .catch(error => {
                //         console.error('Error:', error);
                //     });

                // };

                // resultsList.appendChild(li_id);
                // resultsList.appendChild(li_title);
                // resultsList.appendChild(li_genre);
                // resultsList.appendChild(li_author);
                // resultsList.appendChild(li_price);
                // resultsList.appendChild(add_to_cart_button);
                

                // resultsList.appendChild(hr_element);
            });
        });
});