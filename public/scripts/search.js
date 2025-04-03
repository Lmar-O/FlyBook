const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const resultsList = document.getElementById('results-list');
const fantasyRadioButton = document.getElementById('genre-filter-fantasy');
const adventureRadioButton = document.getElementById('genre-filter-adventure');
const educationalRadioButton = document.getElementById('genre-filter-educational');
const authorInputField = document.getElementById('author-filter');


searchButton.addEventListener('click', () => {
    const query = searchInput.value;
    let searchStr = `api/search?q=${query}`

    if(fantasyRadioButton.checked == true) {
        searchStr = searchStr + '&genre=Fantasy'
    } else
    if(adventureRadioButton.checked == true) {
        searchStr = searchStr + '&genre=Adventure'
    } else
    if(educationalRadioButton.checked == true) {
        searchStr = searchStr + '&genre=Educational'
    }

    if(authorInputField.value != null && authorInputField.value != "") {
        searchStr = searchStr + `&author=${authorInputField.value}`
    }

    fetch(searchStr)
        .then(response => response.json())
        .then(data => {
            resultsList.innerHTML = '';
            data.forEach(item => {
                const li_id = document.createElement('li');
                const li_name = document.createElement('li');
                const li_genre = document.createElement('li');
                const li_author = document.createElement('li');
                const li_price = document.createElement('li');
                const add_to_cart_button = document.createElement('button');
                const hr_element = document.createElement('hr');

                li_id.textContent = item.id;
                li_name.textContent = item.name;
                li_genre.textContent = item.genre;
                li_author.textContent = item.author;
                li_price.textContent = item.price;

                add_to_cart_button.textContent = 'Add to Cart';
                add_to_cart_button.onclick = function() {
                    const url = `api/cart/add/${item.id}`;
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

                };

                resultsList.appendChild(li_id);
                resultsList.appendChild(li_name);
                resultsList.appendChild(li_genre);
                resultsList.appendChild(li_author);
                resultsList.appendChild(li_price);
                resultsList.appendChild(add_to_cart_button);
                

                resultsList.appendChild(hr_element);
            });
        });
});