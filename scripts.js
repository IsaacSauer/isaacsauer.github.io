// script.js

let itemList = [];
let losers = [];
let referenceValue = 0;

function handleKeyPress(event)
{
    // Check if the pressed key is Enter (key code 13)
    if (event.key === 'Enter')
    {
        addItem();
    }
}

function addItem()
{
    const nameInput = document.getElementById('nameInput');
    const valueInput = document.getElementById('valueInput');

    const name = nameInput.value;
    const value = parseFloat(valueInput.value);

    if (isNaN(value) == false) 
    {
        itemList.push({ name, value });
        updateItemList();
        updateFarthestElement();
    }
    nameInput.value = '';
    valueInput.value = '';
}

//<!-- Add an edit button to each item in the list -->
function updateItemList() {
    const itemListElement = document.getElementById('itemList');
    itemListElement.innerHTML = '';

    itemList.forEach((item, index) => {
        const listItem = document.createElement('li');

        // Create a container for the item text and edit button
        const itemContainer = document.createElement('div');
        itemContainer.style.display = 'flex';
        itemContainer.style.justifyContent = 'space-between';
        itemContainer.style.marginBottom = '5px'; // Add a margin bottom for the gap

        // Display item text
        const itemText = document.createElement('span');
        itemText.textContent = `${item.name}:\t${item.value}`;
        itemContainer.appendChild(itemText);

        // Create a container for the edit and delete buttons
        const buttonsContainer = document.createElement('div');
        buttonsContainer.style.display = 'flex';
        buttonsContainer.style.alignItems = 'center';
        
        // Add an edit button for each item
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.className = 'editButton'; // Assign the editButton class
        editButton.style.fontSize = '0.2em';
        editButton.style.marginRight = '10px'; // Add margin to separate buttons
        editButton.onclick = () => editItem(index);
        buttonsContainer.appendChild(editButton);

        // Add a delete button for each item
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'editButton'; // Assign the editButton class
        deleteButton.style.fontSize = '0.2em';
        deleteButton.onclick = () => deleteItem(index);
        buttonsContainer.appendChild(deleteButton);

        itemContainer.appendChild(buttonsContainer);

        listItem.appendChild(itemContainer);
        itemListElement.appendChild(listItem);
    });
}

// Function to delete an existing item
function deleteItem(index) {
    const confirmDelete = confirm('Are you sure you want to delete this item?');

    if (confirmDelete) {
        itemList.splice(index, 1);
        updateItemList();
        updateFarthestElement();
    }
}

// Function to edit an existing item
function editItem(index) {
    const editedName = prompt('Enter the new name:', itemList[index].name);
    const editedValue = prompt('Enter the new value:', itemList[index].value);

    // Update the item if user provides valid input
    if (editedName !== null && editedValue !== null) {
        itemList[index].name = editedName;
        itemList[index].value = parseFloat(editedValue);
        updateItemList();
        updateFarthestElement();
    }
}

function updateloserList()
{
    const itemListElement = document.getElementById('losers');
    itemListElement.innerHTML = '';

    losers.forEach(item => {
        const listItem = document.createElement('li');
        listItem.textContent = `${item.name}: ${item.value}`;
        itemListElement.appendChild(listItem);
    });
}

function updateFarthestElement() {
    const referenceInput = document.getElementById('referenceInput');
    const referenceValue = parseFloat(referenceInput.value) || 0;

    if (itemList.length > 1) {
        // Initialize the farthestElements array with the first item
        var farthestElements = [];

        // Iterate through the itemList to find farthest elements
        itemList.forEach(current => {
            if(farthestElements.length === 0)
            {
                farthestElements.push(current);
                return;
            }

            const currentDistance = Math.abs(current.value - referenceValue);
            const farthestDistance = Math.abs(farthestElements[0].value - referenceValue);

            if (currentDistance === farthestDistance) {
                // If the current element has the same distance as the farthest, add it to the array
                farthestElements.push(current);
            } else if (currentDistance > farthestDistance) {
                // If the current element has a greater distance, replace the farthestElements array with [current]
                farthestElements.length = 0;
                farthestElements.push(current);
            }
            // Otherwise, do nothing if the current element is closer
        });

        // Update the losers array outside the loop
        losers.length = 0;
        farthestElements.forEach(element => {
            const name = element.name;
            const value = element.value;
            losers.push({ name, value });
        });

        const farthestElementDiv = document.getElementById('farthestElement');
        farthestElementDiv.textContent = '';
    } else {
        const farthestElementDiv = document.getElementById('farthestElement');
        farthestElementDiv.textContent = 'Add more elements to find the farthest one.';
        losers.length = 0;
    }
    // Update the loser list
    updateloserList();
}

function saveList()
{
    localStorage.setItem('list', JSON.stringify(itemList));
    if (isNaN(referenceValue) == false)
    {
        localStorage.setItem('reference', referenceValue);
    }
}

function loadList()
{
    itemList = JSON.parse(localStorage.getItem('list'));
    referenceValue = localStorage.getItem('reference')
    
    const referenceInput = document.getElementById('referenceInput');
    referenceInput.value = referenceValue != null ? referenceValue : "";
    document.getElementById('nameInput').value = '';
    document.getElementById('valueInput').value = '';
    
    updateItemList();
    updateFarthestElement();
}

function clearList()
{
    itemList.length = 0;
    losers.length = 0;
    updateItemList();
    updateFarthestElement();
}