const express = require('express')
const app = express()
const port = 3000

// Enable parsing of JSON request bodies
app.use(express.json());

// Enable parsing of URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"))
app.set('view engine', 'ejs')

// Variables //
let logged_in_user = null

let users = [
  {
    username : "testUser01",
    password : "password123",
    email : "something@test.com",
    shopping_cart : [],
    orders : []
  }
]

let books = [
  {
    id : 0,
    name : "Harry Potter",
    genre : "Fantasy",
    author : "James Henry",
    price : 10.00
  },
  {
    id : 1,
    name : "Harry Potter V2",
    genre : "Fantasy",
    author : "James Henry",
    price : 15.99
  },
  {
    id : 3,
    name : "LOTR",
    genre : "Fantasy",
    author : "Micheal Jay",
    price : 12.99
  },
  {
    id : 2,
    name : "Introduction to Algorithms",
    genre : "Educational",
    author : "Aubrey Levy",
    price : 15.00
  },
]

// Functions //
function logUserInByUsername() {

}

function buyAllItemsInCart() {
  let total = 0
  users[0].shopping_cart.forEach(book => total += book.price)

  const order_id = users[0].orders.length + 1

  const dateObj = new Date()
  const day = dateObj.getDay()
  const month = dateObj.getMonth()
  const year = dateObj.getFullYear()

  const date_str = day + '/' + month + '/' + year

  const new_order = {
    id: order_id,
    total: total,
    date: date_str,
    items_purchased: shopping_cart
  }

  users[0].orders.push(new_order)
}

function addBookToCartByID(id, qty) {
  let book = null

  for(let i = 0; i < books.length; i++) {                 // Find book by id
    if(books[i].id == id) {
      book = books[i]
    }
  }

  if(book == null) {                                      // If book is not found, return -1
    console.log(`Error: Book with id=${id} not found`)
    return -1
  }

  const cart_item = {                                     // Create a cart item object
    book: book,
    quantity: qty
  }
  
  users[0].shopping_cart.push(cart_item)                  // Push into the logged in user's cart

  console.log("Item was added to cart:")
  console.log(cart_item)
}

function removeBookFromCartByID(id) {
  let new_shopping_cart = users[0].shopping_cart.filter(item => item.book.id != id)
  users[0].shopping_cart = new_shopping_cart

  console.log('Current cart:')
  console.log(users[0].shopping_cart)
}

// ---------------- Home Page ---------------- //

app.get('/', (req, res) => {
  if(users.length == 0){
    res.render('index', { username : "Login"})
  }
  else {
    res.render('index', { username : `${users[0].username}`})
  }
})

// -------------------------------------------- //

// ---------------- Sign up Page ---------------- //

app.get('/signup', (req, res) => {
  res.render('signup')
})

app.post('/signup', (req, res) => {
  let user = {
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      shopping_cart: [],
      orders: []
  }

  // Server side validation omitted for now
  users.push(user)
  //console.log(users)

  // A redirect to login seems a bit rushed
  // a success notification will help
  res.redirect('/login')
})

// -------------------------------------------- //

// ---------------- Login Page ---------------- //

app.get('/login', (req, res) => {
  res.render('login')
})

app.post('/login', (req, res) => {
  let user = {
    username: req.body.username,
    password: req.body.password,
  }

  let isAuth = false;

  // Search the "database" for a user with matching credentials
  users.forEach((stored_user) => {
    if(user.username == stored_user.username &&
       user.password == stored_user.password) {
        isAuth = true;
    }
  })

  
  if(isAuth) {
    res.redirect("/shop")
  } else {
    res.render('login', { error: 'authFailed', errMsg: 'Check password and username'})
  }
})

// -------------------------------------------- //

// ---------------- Cart Page ---------------- //

app.get('/cart', (req, res) => {
  if(users.length == 0) {
    res.redirect('./login')
  } else {
    res.render('cart', {data: users[0].shopping_cart}) // `${users[0].shopping_cart}`
  }
})

app.get('/api/cart/all', (req, res) => {
  if(users.length == 0) {
    res.redirect('./login')
  } else {
    res.status(200).send({ cart: `${users[0].shopping_cart}` })
  }
})

app.post('/api/cart/add/:id/:qty', (req, res) => {
  const id = req.params.id
  const qty = req.params.qty

  if(qty < 1) {
    res.status(404).send('<p>Error: Quantity cannot be negative or zero.<p>')
  } else
  if(users.length == 0) {
    res.redirect('./login')
  } else {
    const result = addBookToCartByID(id, qty)

    if(result == -1) {
      res.status(404).send('<p>Error: Book not found.<p>')
    } else {
      res.status(200).send('<p>success<p>')
    }
  }
})

app.post('/api/cart/add/:id', (req, res) => {
  const id = req.params.id
  const qty = 1

  if(users.length == 0) {
    res.redirect('./login')
  } else {
    const result = addBookToCartByID(id, qty)

    if(result == -1) {
      res.status(404).send({errMsg: 'Error: Book not found'})
    } else {
      res.status(200).send({Success: 'success'})
    }
  }
})

app.post('/api/cart/remove/:id', (req, res) => {
  const id = req.params.id

  if(users.length == 0) {
    res.redirect('./login')
  } else {
    removeBookFromCartByID(id)
    res.status(200).send({Success: 'success'})
  }
})

// -------------------------------------------- //

// ---------------- Search API ---------------- //

app.get('/api/search', (req, res) => {
  const query = req.query.q
  const genre = req.query.genre
  const author = req.query.author
  const maxSize = req.query.maxSize

  if(query == null) {
    res.json({errMsg: 'Error: query cannot be null'})
    return
  }

  if(maxSize < 1) {
    res.json({errMsg: 'Error: maxSize must be greater than zero'})
    return
  }

  let results = books.filter(book => {return (book.name.toLowerCase().includes(query.toLowerCase()))});   // search filter

  if(genre != null)
    results = books.filter(book => {return (book.genre.toLowerCase() == genre.toLowerCase())});           // genre filter

  if(author != null)
    results = books.filter(book => {return (book.author.toLowerCase().includes(author.toLowerCase()))});  // author filter

  if(maxSize != null && results.length > maxSize)
    results = books.slice(0, maxSize);                                                                    // max size filter

  res.status(200).json(results);
})

// -------------------------------------------- //

// ---------------- Shop Page ---------------- //

app.get('/shop', (req, res) => {
  if(users.length > 0) {

    const data = {
      books: books,
      username: users.length != 0 ? users[0].username : "Login",
    }

    res.render('shop', { data: data })
  } else {
    res.render('shop')
  }
})

// -------------------------------------------- //

// ---------------- Orders Page ---------------- //

app.get('/orders', (req, res) => {
  res.render('orders')
})

app.get('api/orders', (req, res) => {
  const maxSize = req.query.maxSize

  if(maxSize < 1) {
    res.json({errMsg: 'Error: maxSize must be greater than zero'})
    return
  }

  if(maxSize != null && users[0].orders.length > maxSize)
    results = users[0].orders.slice(0, maxSize);

  res.status(200).json(results);
})

// -------------------------------------------- //

app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`)
})