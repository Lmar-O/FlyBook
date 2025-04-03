function removeItem(id) {
    const url = `api/cart/remove/${id}`
    const data = {
        hello: "hello"
    }

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
        location.reload();
    })
    .catch(error => {
        console.error('Error:', error);
    });
}