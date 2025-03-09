/*
# Title: Web Programming Assignment 2 E-Commerse Website
# Author: Bryan Jones
# ID: 1907425
# Tested on: Chrome for Windows, Mozilla Firefox for Linux, Github Pages
#
#Description: Assignment 2 E-Commerse Website containing HTML, CSS and Javascript code along with Website Assets
#
#Note:
*/

// script.js for handling website logic

// === Global Variables ===
// variables to store various elements on the webpage
const cart = []; // an array to store items added to the cart
const cartModal = document.getElementById("cart-modal"); // modal window for the cart
const cartList = document.getElementById("cart-list"); // element to list all cart items
const cartCount = document.getElementById("cart-count"); // element to display cart item count
const cartLink = document.getElementById("cart-link"); // element that opens the cart modal
const checkoutBtn = document.getElementById("checkout-btn"); // button to checkout
const checkoutSuccess = document.getElementById("checkout-success"); // element to display successful checkout message
const invoiceModal = document.getElementById("invoice-modal"); // modal window for the invoice
const invoiceList = document.getElementById("invoice-list"); // element to list all invoice items
const subtotalEl = document.getElementById("subtotal"); // element to display the subtotal
const taxEl = document.getElementById("tax"); // element to display the tax amount
const discountEl = document.getElementById("discount"); // element to display the discount
const totalEl = document.getElementById("total"); // element to display the total amount
const productGrid = document.getElementById("product-grid"); // grid to display products
const repairModal = document.getElementById("repair-modal"); //  modal window for repair scheduling
const scheduleRepairBtn = document.getElementById("schedule-repair-btn"); // button to schedule repair
const repairForm = document.getElementById("repair-form"); // form for scheduling repairs
const repairSuccess = document.getElementById("repair-success"); // element to display successful repair message

// === Cart Functions ===

/**
 * Updates the cart display in the modal
 * Clears the current cart list and populate it with updated cart items
 * Updates the cart count display
 */
function updateCart() {
    cartList.innerHTML = ""; // clear the current cart list
    cart.forEach((item, index) => {
        cartList.innerHTML += `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <span>${item.name}</span>
                <span>$${(item.price * item.quantity).toFixed(2)}</span>
                <input type="number" value="${item.quantity}" min="1" data-index="${index}" class="quantity-input">
                <button class="remove-btn" data-index="${index}">Remove</button>
            </div>
        `;
    });
    const { total } = calculateTotals(); // calculate the cart totals
    cartList.innerHTML += `
        <div class="cart-total">
            <span>Total: $${total.toFixed(2)}</span>
        </div>
    `;
    // update the cart count display
    cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0) || 0;
}

/**
 * Adds an item to the cart or updates the quantity if it already exists
 * Updates the cart display and animates the add-to-cart button
 */
function addToCart(name, price, button) {
    const image = button.parentElement.querySelector("img").src; // get the image source of the product
    const item = cart.find(i => i.name === name); // find if the item is already in the cart
    item ? item.quantity++ : cart.push({ name, price, image, quantity: 1 }); // update quantity or add new item
    updateCart(); // update the cart display
    button.textContent = "Added"; // update button text to indicate item added
    button.classList.add("added-animation"); // add animation class to button
    setTimeout(() => {
        button.textContent = "Add to Cart"; // revert button text after animation
        button.classList.remove("added-animation"); // remove animation class
    }, 1000); // animation duration
}

/**
 * Updates the quantity of a cart item or removes it if quantity is less than 1
 * Updates the cart display
 */
function updateCartItem(index, quantity) {
    if (quantity < 1) {
        cart.splice(index, 1); // remove item from cart if quantity is less than 1
    } else {
        cart[index].quantity = quantity; // update item quantity
    }
    updateCart(); // update the cart display
}

// === Invoice Functions ===

/**
 * Calculates the subtotal, tax, discount, and total for the cart
 * Returns an object with these values
 */
function calculateTotals() {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0); // calculate subtotal
    const tax = subtotal * 0.10; // calculate tax (10% of subtotal)
    const discount = subtotal > 100 ? subtotal * 0.05 : 0; // calculate discount if subtotal is greater than $100
    const total = subtotal + tax - discount; // calculate total
    return { subtotal, tax, discount, total }; // return an object with all values
}

/**
 * Updates the invoice modal with the current cart items and totals
 * Displays the current date on the invoice
 */
function updateInvoice() {
    // populate the invoice list with cart items
    invoiceList.innerHTML = cart.map(item => 
        `<div class="cart-item">
            <span>${item.name}</span>
            <span>${item.quantity}</span>
            <span>$${(item.price * item.quantity).toFixed(2)}</span>
        </div>`
    ).join("");
    const { subtotal, tax, discount, total } = calculateTotals(); // calculate the totals
    // update the totals display
    subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    taxEl.textContent = `$${tax.toFixed(2)}`;
    discountEl.textContent = `$${discount.toFixed(2)}`;
    totalEl.textContent = `$${total.toFixed(2)}`;
    // display the current date on the invoice
    document.getElementById("invoice-date").textContent = new Date().toLocaleDateString();
}

// === Product Grid Functions ===

/**
 * Populates the product grid with product cards
 * Adds event listeners to the add-to-cart buttons
 */
function populateProductGrid(products) {
    products.forEach(product => {
        productGrid.innerHTML += `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>$${product.price.toFixed(2)}</p>
                <button class="base-button add-to-cart" data-name="${product.name}" data-price="${product.price}">
                    Add to Cart
                </button>
            </div>
        `;
    });
    // add event listeners to the add-to-cart buttons
    document.querySelectorAll(".add-to-cart").forEach(button => {
        button.addEventListener("click", () => {
            addToCart(button.dataset.name, parseFloat(button.dataset.price), button);
        });
    });
}

// fetch products from the JSON file and populate the product grid
fetch("products.json")
    .then(response => response.json())
    .then(data => populateProductGrid(data))
    .catch(error => console.error("Error loading products:", error));

// === Repair Modal Functions ===

/**
 * Handles the repair form submission
 * Displays a success message and resets the form
 */
function scheduleRepair(event) {
    event.preventDefault(); // prevent default form submission
    repairSuccess.style.display = "block"; // show success message
    setTimeout(() => {
        repairSuccess.style.display = "none"; // hide success message after 2 seconds
        repairForm.reset(); // reset the form
        repairModal.style.display = "none"; // close the repair modal
    }, 2000); // duration for displaying the success message
}

// === Utility Functions ===

/**
 * Closes the specified modal window
 */
function closeModal(modal) {
    if (modal) modal.style.display = "none"; // hide the modal window
}

// === Event Listeners ===
document.addEventListener("DOMContentLoaded", () => {
    const cartOverlay = document.getElementById("cart-overlay"); // overlay for cart modal
    const invoiceOverlay = document.getElementById("invoice-overlay"); // overlay for invoice modal
    const repairOverlay = document.getElementById("repair-overlay"); // overlay for repair modal

    // event listener to open the cart modal
    if (cartLink) cartLink.addEventListener("click", () => {
        cartModal.style.display = "block"; // show the cart modal
        cartOverlay.style.display = "block"; // show the cart overlay
    });

    // event listener for the checkout button
    if (checkoutBtn) checkoutBtn.addEventListener("click", () => {
        if (!cart.length) {
            alert("Please add at least one product to checkout."); // alert if the cart is empty
            return;
        }
        cartModal.style.display = "none"; // hide the cart modal
        cartOverlay.style.display = "none"; // hide the cart overlay
        invoiceModal.style.display = "block"; // show the invoice modal
        invoiceOverlay.style.display = "block"; // show the invoice overlay
        updateInvoice(); // update the invoice display
        checkoutSuccess.style.display = "block"; // show the success message
    });

    // event listener for remove buttons in cart list
    cartList.addEventListener("click", event => {
        if (event.target.classList.contains("remove-btn")) {
            updateCartItem(parseInt(event.target.dataset.index), 0); // remove item from cart
        }
    });

    // event listener for quantity input changes in cart list
    cartList.addEventListener("change", event => {
        if (event.target.classList.contains("quantity-input")) {
            updateCartItem(parseInt(event.target.dataset.index), parseInt(event.target.value)); // update item quantity
        }
    });

    // event listener to open the repair modal
    if (scheduleRepairBtn) scheduleRepairBtn.addEventListener("click", () => {
        repairModal.style.display = "block"; // show the repair modal
        repairOverlay.style.display = "block"; // show the repair overlay
    });

    // event listener for repair form submission
    if (repairForm) repairForm.addEventListener("submit", scheduleRepair); // handle repair form submission

    // event listener for closing modals using close buttons
    document.querySelectorAll(".modal-close").forEach(btn => {
        btn.addEventListener("click", () => {
            const modal = btn.closest("#cart-modal") || btn.closest("#invoice-modal") || btn.closest("#repair-modal");
            const overlay = modal === cartModal ? cartOverlay : modal === invoiceModal ? invoiceOverlay : repairOverlay;
            if (modal === invoiceModal) {
                cart.length = 0; // clear cart after invoice is closed
                updateCart(); // update cart display
                checkoutSuccess.style.display = "none"; // hide success message
            }
            closeModal(modal); // close the modal
            if (overlay) overlay.style.display = "none"; // hide the overlay
        });
    });

    // event listener for clicking outside the modal to close it
    window.addEventListener("click", event => {
        if (event.target === cartOverlay) {
            closeModal(cartModal); // close the cart modal
            cartOverlay.style.display = "none"; // hide the cart overlay
        }
        if (event.target === invoiceOverlay) {
            cart.length = 0; // clear cart after invoice overlay is clicked
            updateCart(); // update cart display
            checkoutSuccess.style.display = "none"; // hide success message
            closeModal(invoiceModal); // close the invoice modal
            invoiceOverlay.style.display = "none"; // hide the invoice overlay
        }
        if (event.target === repairOverlay) {
            closeModal(repairModal); // close the repair modal
            repairOverlay.style.display = "none"; // hide the repair overlay
        }
    });

    // get the main checkout button element
    const checkoutBtnMain = document.getElementById("checkout-btn-main");

    // check if the main checkout button exists
    if (checkoutBtnMain) {
        // add click event listener to the main checkout button
        checkoutBtnMain.addEventListener("click", () => {
            // if the cart is empty, alert the user and stop further execution
            if (!cart.length) {
                alert("Please add at least one product to checkout.");
                return;
            }
            // display the invoice modal and overlay
            invoiceModal.style.display = "block";
            invoiceOverlay.style.display = "block";
            // update the invoice display
            updateInvoice();
            // show the success message
            checkoutSuccess.style.display = "block";
        });
    }

    // get the main cancel button element
    const cancelBtnMain = document.getElementById("cancel-btn-main");

    // check if the main cancel button exists
    if (cancelBtnMain) {
        // add click event listener to the main cancel button
        cancelBtnMain.addEventListener("click", () => {
            // clear the cart
            cart.length = 0;
            // update the cart display
            updateCart();
        });
    }

    // get the main exit button element
    const exitBtnMain = document.getElementById("exit-btn-main");

    // check if the main exit button exists
    if (exitBtnMain) {
        // add click event listener to the main exit button
        exitBtnMain.addEventListener("click", () => {
            // redirect to the home page
            window.location.href = "index.html";
        });
    }

    // get the invoice cancel button element
    const cancelBtn = document.getElementById("invoice-cancel");

    // check if the invoice cancel button exists
    if (cancelBtn) {
        // add click event listener to the invoice cancel button
        cancelBtn.addEventListener("click", () => {
            // display order canceled message and change its color
            checkoutSuccess.textContent = "Order Canceled";
            checkoutSuccess.style.color = "red";
            // clear the cart
            cart.length = 0;
            // update the cart display
            updateCart();
            // after 5 seconds, hide the invoice modal and overlay, and reset success message
            setTimeout(() => {
                invoiceModal.style.display = "none";
                invoiceOverlay.style.display = "none";
                checkoutSuccess.textContent = "Purchase Successful";
                checkoutSuccess.style.color = "#2ecc71";
                cancelBtn.textContent = "Cancel";
                cancelBtn.classList.remove("canceled");
            }, 5000); // duration for hiding the modal and updating button text
        });
    }

    // get the invoice exit button element
    const exitBtn = document.getElementById("invoice-exit");

    // check if the invoice exit button exists
    if (exitBtn) {
        // add click event listener to the invoice exit button
        exitBtn.addEventListener("click", () => {
            // hide the invoice modal and overlay, and the success message
            invoiceModal.style.display = "none";
            invoiceOverlay.style.display = "none";
            checkoutSuccess.style.display = "none";
            // redirect to the products page
            window.location.href = "products.html";
        });
    }
});