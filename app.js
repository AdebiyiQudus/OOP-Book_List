// Book Constructor
function Book(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
}

// UI Constructor
function UI () {}

// AddBookToList method to the  UI constructor function
UI.prototype.addBookToList = function(book){
    // create a list variable for the table body
    const list = document.getElementById('book-list');
    // Create table row element
    const row = document.createElement('tr');

    // Insert cells (data)
    // To create child element from the HTML <td>
    row.innerHTML = `
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.isbn}</td>
    <td><a href='#' class="delete">X</td>
    `;
    list.appendChild(row)
}

// Show Alert method
UI.prototype.showAlert = function(message, className) {
    // To construct an element for an alert we need to create div
    const div = document.createElement('div');
    // Add classes
    div.className = `alert ${className}`;
    // Add text
    div.appendChild(document.createTextNode(message));
    // Get parent
    const container = document.querySelector('.container');
    // Get form
    const form = document.querySelector('#book-form');
    // Insert alert
    container.insertBefore(div, form);

    // Timeout after 3 sec
    setTimeout(function(){
        document.querySelector('.alert').remove();
     }, 3000);
}

// Adding deleteBook method to the UI constructor
    UI.prototype.deleteBook = function(target) {
        if(target.className === 'delete') {
            target.parentElement.parentElement.remove();
        }
    }

// Clear Fields after values get added to the table body
UI.prototype.clearFields = function(){
    document.getElementById('title').value = '';
    document.getElementById('author').value = '';
    document.getElementById('isbn').value = '';
}


// Create Local storage class
class Store {
    // To fetch the books from local storage
    static getBooks() {
        // intializing a local variable => books
        let books;
        if(localStorage.getItem('books') === null) {
            books = [];
        } else {
            // to covert books item in ls to js object syntax
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }

    // To display the books from the local storage
   static displayBooks() {
    // get books before displaying
    const books = Store.getBooks();
    books.forEach(function(book){
        const ui = new UI;

        // Add book to UI
        ui.addBookToList(book)
    });
    }

    // To add books in the UI to the loal storage
   static addBook(book) {
    const books = Store.getBooks();
    books.push(book);

    // To set book item in the ls and covert it to string in the array
    localStorage.setItem('books', JSON.stringify(books));
    }

    // To remove books from the local storage (isbn)
   static removeBook(isbn) {
    const books = Store.getBooks();
    // To remove one book from the UI and Ls
    books.forEach(function(book, index){
        if(book.isbn === isbn) {
            books.splice(index, 1);
        }
    });

    localStorage.setItem('books', JSON.stringify(books));
    }
}

// DOM Load Event => Call the display book function when the Dom is loaded
document.addEventListener('DOMContentLoaded',
Store.displayBooks);

// Event Listener for Add book
document.getElementById('book-form').addEventListener('submit',
function(e){
    // To get form values
    const title = document.getElementById('title').value
        author = document.getElementById('author').value
        isbn = document.getElementById('isbn').value

        // To instantiate the Book object
        const book = new Book(title, author, isbn);
        
        // To Instantaite UI => creatinig ui object from the UI constructor class
        const ui = new UI();
    
        // Validate
        if(title === '' || author === '' || isbn === '') {
          // Error alert
          ui.showAlert('Please fill in all fields', 'error');
        } else {
             // Add book to list
        ui.addBookToList(book);

           // Call add book method to add ls
           Store.addBook(book);

        // Show Success
        ui.showAlert('Book Added!', 'success');
           // Clear Fields
           ui.clearFields();
        }
        e.preventDefault();
});

// Event Listener for delete
document.getElementById('book-list').addEventListener
('click', function(e){
    
    // To Instantaite UI to delete book
    const ui = new UI();
    // Delete book
    ui.deleteBook(e.target);

     // call to remove books from LS (remove previous isbn)
     Store.removeBook
     (e.target.parentElement.previousElementSibling.
         textContent);

    //Show alert message for delete
    ui.showAlert('Book removed!', 'success');

    e.preventDefault();
})