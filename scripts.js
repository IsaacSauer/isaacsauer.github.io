// script.js

let itemList = [];
let losers = [];
let referenceValue = 0;

function handleKeyPress(event) {
    // Check if the pressed key is Enter (key code 13)
    if (event.key === 'Enter') {
        addItem();
    }
}

function addItem() {
    const nameInput = document.getElementById('nameInput');
    const valueInput = document.getElementById('valueInput');

    const name = nameInput.value;
    const value = parseFloat(valueInput.value);

    if (isNaN(value) == false) {
        itemList.push({ name, value });
        updateItemList();
        updateFarthestElement();
    }
    nameInput.value = '';
    valueInput.value = '';
}

function updateItemList() {
    const itemListElement = document.getElementById('itemList');
    itemListElement.innerHTML = '';

    itemList.forEach(item => {
        const listItem = document.createElement('li');
        listItem.textContent = `${item.name}:\t${item.value}`;
        itemListElement.appendChild(listItem);
    });
}

function updateloserList() {
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
        const farthestElements = [itemList[0]];

        // Iterate through the itemList to find farthest elements
        itemList.forEach(current => {
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

            // Update the losers array
            losers.length = 0;
            farthestElements.forEach(element => {
                const name = element.name;
                const value = element.value;
                losers.push({ name, value });
            });

            // Update the loser list
            updateloserList();
        });
    } else {
        const farthestElementDiv = document.getElementById('farthestElement');
        farthestElementDiv.textContent = 'Add more elements to find the farthest one.';
    }
}

function saveList()
{
    localStorage.setItem('list', JSON.stringify(itemList));
    if (isNaN(referenceValue) == false) {
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