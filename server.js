import { readFile, readFileSync } from 'node:fs';
import express, { json, urlencoded } from 'express';
const app = express()
const port = 3000

// Enable parsing of JSON request bodies
app.use(json());

// Enable parsing of URL-encoded request bodies
app.use(urlencoded({ extended: true }));

app.use(express.static("public"))
app.set('view engine', 'ejs')

// Variables //

let logged_in_user = null

let users = [] // logged in user length should never exceed one

let user_accounts = [] // this is the "database of all users"

let books = []

let genres_array = []

// -------------- Preliminaries -------------- //

/*  
    Reads data from the csv file and stores it in the 
    books array
*/
const raw_csv = readFileSync('books.csv', 'utf8');

const lines = raw_csv.split('\n');
  
for(let i = 1; i < lines.length; i++) {
  const parsedLines = lines[i].split(',')
  const splitPrice = parsedLines[3].split(' ')
  const book_csv = {
    id: i,
    title: parsedLines[0],
    author: parsedLines[1],
    genre: parsedLines[2],
    price: parsedLines[3],
    priceNum: parseFloat(splitPrice[0]),
    filePath: `/images/${parsedLines[4]}`
  }
  
  books.push(book_csv)
}

//console.log(books)

const genres_map = new Map(books.map(book => [book.genre, "hi"]));
genres_array = Array.from(genres_map.keys())

// console.log(genres_array)
// console.log(genres_array.length)

// -------------- Functions -------------- //
function logUserInByUsername() {

}

function isUserLoggedIn() {
  return (users.length == 1) ? true : false
}

function buyAllItemsInCart() {
  let total = 0
  let salesTax = 1.0825

  users[0].shopping_cart.forEach(item => total += item.book.priceNum)

  total *= salesTax
  
  total = Math.round(total * 100)  / 100

  const order_id = users[0].orders.length + 1

  const now = new Date()
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0');

  const date_str = `${month}/${day}/${year}`

  const new_order = {
    id: order_id,
    total: total,
    date: date_str,
    items_purchased: users[0].shopping_cart
  }

  users[0].orders.push(new_order)
  users[0].shopping_cart = []
}

function getBookByID(id) {
  for(let i = 0; i < books.length; i++) {                 // Find book by id
    if(books[i].id == id) {
      const found_book = books[i]
      return found_book
    }
  }
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

  // console.log("Item was added to cart:")
  // console.log(cart_item)
}

function removeBookFromCartByID(id) {
  // let new_shopping_cart = users[0].shopping_cart.filter(item => item.book.id != id)
  // users[0].shopping_cart = new_shopping_cart

  for(let i = 0; i < users[0].shopping_cart.length; i++) {
    if(users[0].shopping_cart[i].book.id == id) {
      users[0].shopping_cart.splice(i, 1)
      break
    }
  }

  // console.log('Current cart:')
  // console.log(users[0].shopping_cart)
}

// ------------------------------------------- //

// ---------------- Home Page ---------------- //

app.get('/', (req, res) => {
  if(isUserLoggedIn()){
    res.render('index', { isLoggedIn: true, username : `${users[0].username}` })
  }
  else {
    res.render('index', { isLoggedIn: false, username : "Login" })
  }
})

// -------------------------------------------- //

// ---------------- Settings Page ---------------- //

app.get('/settings', (req, res) => {
  if(users.length == 0){
    res.render('settings', { username : "Login"})
  }
  else {
    res.render('settings', { username : `${users[0].username}`})
  }
})

// -------------------------------------------- //

// ---------------- Sign up Page ---------------- //

app.get('/signup', (req, res) => {
  if(isUserLoggedIn()) {
    res.render('signup', { isLoggedIn: true, username : `${users[0].username}` })
  } else {
    res.render('signup', { isLoggedIn: false, username : `Login` })
  }
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
  console.log('User was added to database')
  console.log(user)
  

  // if a duplicate user exists, rerender with error
  // obviously you should not do this in production
  // because storing plain-text password is a huge
  // security risk
  for(let i = 0; i < user_accounts.length; i++) {
    if(user.username == user_accounts[i].username) {
      res.render('signup', { error: 'dupUser' })
      return
    }
  }

  // add to 'database'
  user_accounts.push(user)

  // A redirect to login seems a bit rushed
  // a success notification will help
  res.redirect('/login')
})

// -------------------------------------------- //

// ---------------- Sign out Page ---------------- //

app.get('/signout', (req, res) => {
  if(isUserLoggedIn()) {
    users = []
    res.redirect('/') // this code can be reduced but it works, so im not touching it
    return
  }

  res.redirect('/')
})

// -------------------------------------------- //

// ---------------- Login Page ---------------- //

app.get('/login', (req, res) => {
  if(isUserLoggedIn()) {
    res.render('login', { isLoggedIn: true, username : `${users[0].username}` })
  } else {
    res.render('login', { isLoggedIn: false, username : `Login` })
  }
})

app.post('/login', (req, res) => {
  let user = {
    username: req.body.username,
    password: req.body.password,
  }

  console.log('User is attempting to login');
  console.log(user);

  let isAuth = false;

  // Search the "database" for a user with matching credentials
  let new_user_login_index = 0

  if(user_accounts != null)                           // if there are account that exist in the database
    for(let i = 0; i < user_accounts.length; i++) {   // iterate through the database and find the index of
      if(user.username == user_accounts[i].username &&     // user that is trying to log in
        user.password == user_accounts[i].password) {
         isAuth = true;
         new_user_login_index = i;
     }
    }


  if(isAuth) {
    // Edge case: if users.length == 1, then a swap must be performed
    // Find the current logged-in users index in the database
    // Update current logged-in users account
    // Swap current logged-in user with the new logged-in user
    if(users.length >= 1) {
      let curr_logged_in_user_index = 0
      
      for(let i = 0; i < user_accounts.length; i++) { // iterate through database
        if(users[0].username == user_accounts[i].username && users[0].password == user_accounts[i].password) { 
          curr_logged_in_user_index = i
        }
      }

      // Update current logged-in users account
      user_accounts[curr_logged_in_user_index] = users[0]
    }

    // Swap current logged-in user with the new logged-in user
    users[0] = user_accounts[new_user_login_index]

    res.redirect("/shop")
  } else {
    res.render('login', { 
      error: 'authFailed', 
      errMsg: 'Check password and username',

    })
  }
})

// -------------------------------------------- //

// ---------------- Cart Page ---------------- //

app.get('/cart', (req, res) => {
  if(isUserLoggedIn()) {
    res.render('cart', { data: users[0].shopping_cart, isLoggedIn: true, username : `${users[0].username}` }) // `${users[0].shopping_cart}`
  } else {
    res.redirect('./login')
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
    console.log('this error was sent')
    res.status(200).send({errMsg: 'noLoginError'})
  } else {
    const result = addBookToCartByID(id, qty) // this is so bad
    const book_data = getBookByID(id)
    if(result == -1) {
      res.status(404).send({errMsg: 'Error: Book not found'})
    } else {
      res.status(200).send({Success: 'success', book: book_data})
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

  let results_a = books.filter(book => {return (book.title.toLowerCase().includes(query.toLowerCase()))});   // search filter

  if(genre != null)
    results_a = results_a.filter(book => {return (book.genre.toLowerCase() == genre.toLowerCase())});           // genre filter

  if(author != null)
    results_a = results_a.filter(book => {return (book.author.toLowerCase().includes(author.toLowerCase()))});  // author filter

  if(maxSize != null && results_a.length > maxSize)
    results_a = results_a.slice(0, maxSize);                                                                    // max size filter

  res.status(200).json(results_a);
})

// -------------------------------------------- //

// ---------------- Shop Page ---------------- //

app.get('/shop', (req, res) => {
  
  const data = {
    books: books,
    username: users.length != 0 ? users[0].username : "Login",
    genres: genres_array
  }

  if(isUserLoggedIn()) {
    res.render('shop', { data: data, isLoggedIn: true, username : `${users[0].username}` })
  } else {
    res.render('shop', { data: data, isLoggedIn: false, username : `Login` })
  }
})

// -------------------------------------------- //

// ---------------- Checkout Page ---------------- //

app.get('/checkout', (req, res) => {
  if(isUserLoggedIn()) {
    const cart = users[0].shopping_cart
    const salesTax = 1;
    let total_pretax = 0;
    let total_posttax = 0;

    cart.forEach((item) => {
      total_pretax += item.book.priceNum;
    })

    total_posttax = total_pretax * salesTax

    total_posttax = Math.round(total_posttax * 100)  / 100

    const data = {
      cart: cart,
      total_pretax: total_pretax,
      total_posttax: total_posttax,
    }

    res.render('checkout', { data: data, isLoggedIn: true, username : `${users[0].username}` })
  } else {
    res.redirect('/login')
  }
})

app.post('/checkout', (req, res) => {
  // Server side validation skipped for now
  // console.log(req.body.creditCardNumber)
  // console.log(req.body.cvv)
  // console.log(req.body.cardHolderName)

  if(users.length > 0) {
    buyAllItemsInCart()

    //console.log(users[0])

    res.redirect('shop?success=1')
  } else {
    res.redirect('login')
  }
})

// -------------------------------------------- //

// ---------------- Orders Page ---------------- //

app.get('/orders', (req, res) => {

  if(users.length > 0) {
    res.render('orders', { data: users[0].orders, isLoggedIn: true, username : `${users[0].username}` })
  } else {
    res.redirect('login')
  }
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