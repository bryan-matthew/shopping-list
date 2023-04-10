const itemForm = document.querySelector('#item-form');
const itemInput = document.querySelector('#item-input');
const itemList = document.querySelector('#item-list');
const clearBtn = document.querySelector('#clear');
const filter = document.querySelector('#filter');
const addItemBtn = document.querySelector('.form-control button');


function displayItems() {
    const itemsFromStorage = getItemsFromStorage();
    itemsFromStorage.forEach(item => addItemToDOM(item));
    checkUI();
}


function onAddItemSubmit(e) {
    e.preventDefault();
    let item = itemInput.value;
    if(item === "") {
        alert('Input Field is Empty!');
        return;
    }
    if(isEditMode) {
        // Remove items from Local Storage
        const itemToEdit = itemList.querySelector('.edit-mode');
        if(item !== itemToEdit.textContent) {
            if(checkIfItemExists(item)) {
                alert('item exists');
                return;
            }
        }
        removeItemFromStorage(itemToEdit.textContent);
        // Remove items from DOM
        itemToEdit.remove();
        isEditMode = false;
    }
    else {
        // Check for duplicate
        const items = getItemsFromStorage();
        if(checkIfItemExists(item)) {
            alert('item exists');
            return;
        }
    }

    addItemToDOM(item);
    addItemToStorage(item)
    
    itemInput.value = "";
    checkUI();
}


function checkIfItemExists(item) {
    const items = getItemsFromStorage();
    return items.includes(item);
}


function addItemToDOM(itemName) {
    const li = document.createElement('li');
    li.appendChild(document.createTextNode(itemName));
    li.appendChild(createButton("remove-item btn-link text-red"));
    itemList.appendChild(li);
}


function addItemToStorage(itemName) {
    let itemsFromStorage = getItemsFromStorage();

    itemsFromStorage.push(itemName);

    // Insert it to the localStorage
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}


function getItemsFromStorage() {
    let itemsFromStorage;
    if(localStorage.getItem('items') === null) {
        itemsFromStorage = [];
    }
    else {
        itemsFromStorage = JSON.parse(localStorage.getItem('items'));
    }
    return itemsFromStorage;
}


function createButton(classes) {
    const btn = document.createElement('button');
    btn.className = classes;
    btn.appendChild(createIcon("fa-solid fa-xmark"));
    return btn;
}


function createIcon(classes) {
    const icon = document.createElement('i');
    icon.className = classes;
    return icon;
}


let isEditMode = false;


function onClickItem(e) {
    if(e.target.tagName === 'I') {
        const toBeRemoved = e.target.parentElement.parentElement;
        removeItem(toBeRemoved);
    }
    else if(e.target.tagName === 'LI') {
        setItemToEdit(e.target);
    }
}


function setItemToEdit(item) {
    isEditMode = true;
    Array.from(itemList.children).forEach(item => item.classList.remove('edit-mode'));
    item.classList.add('edit-mode');
    addItemBtn.innerHTML = '<i class="fa-solid fa-pen"></i>Update Item';
    addItemBtn.style.background = "#228B22";
    itemInput.value = item.textContent;
}


function removeItem(toBeRemoved) {
    if(confirm(`Are you sure you want to delete ${toBeRemoved.innerText}?`)) {
        toBeRemoved.remove();
        checkUI();
    }

    removeItemFromStorage(toBeRemoved.textContent);
}


function removeItemFromStorage(itemName) {
    // Removing Items from localStorage
    // 1. Get the items from storage
    // 2. Convert it into arraoy
    // 3. Remove the item from array
    // 4. Convert the array into a string
    // 5. Put it back to storage
    let itemsFromStorage = getItemsFromStorage();
     
    // Filter out the item that you are removing
    itemsFromStorage = itemsFromStorage.filter(item => item !== itemName);

    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}


function filterItems(e) {
    const input = e.target.value.toLowerCase();
    const items = Array.from(itemList.children);
    items.forEach(item => {
        if(item.textContent.toLowerCase().indexOf(input) === -1) {
            item.style.display = "none";
        }
        else {
            item.style.display = "flex";
        }
    })
}


function checkUI() {
    itemInput.value = "";
    isEditMode = false;
    addItemBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
    addItemBtn.style.background = '#333';

    if(!itemList.children.length) {
        clearBtn.style.display = "none";
        filter.style.display = "none";
    }
    else {
        clearBtn.style.display = "block";
        filter.style.display = "block";
    }
}


function clearItems(e) {
    while(itemList.firstChild) {
        itemList.firstChild.remove();
    }
    localStorage.removeItem('items');

    checkUI();
}


// Initialize App
function init() {
    itemForm.addEventListener('submit', onAddItemSubmit);
    itemList.addEventListener('click', onClickItem);
    clearBtn.addEventListener('click', clearItems);
    filter.addEventListener('input', filterItems);
    document.addEventListener('DOMContentLoaded', displayItems);
    checkUI();
}


init();