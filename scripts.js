// script.js

let itemList = [];
let losers = [];
let referenceValue = 0;

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
        listItem.textContent = `${item.name}: ${item.value}`;
        itemListElement.appendChild(listItem);
    });
}

function updateFarthestElement() {
    const referenceInput = document.getElementById('referenceInput');
    referenceValue = parseFloat(referenceInput.value) || 0;

    if (itemList.length > 1) {
        const farthestElement = itemList.reduce((farthest, current) => {
            const currentDistance = Math.abs(current.value - referenceValue);
            const farthestDistance = Math.abs(farthest.value - referenceValue);

            return currentDistance > farthestDistance ? current : farthest;
        });

        const farthestElementDiv = document.getElementById('farthestElement');
        farthestElementDiv.textContent = `${farthestElement.name}: ${farthestElement.value}`;
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