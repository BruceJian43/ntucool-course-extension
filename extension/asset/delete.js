function setCoursesWithCheckbox(table) {
    chrome.storage.sync.get(null, (items) => {
        for (const key in items) {
            const course = items[key];
            const row = document.createElement('tr');
            const properties = ['courseName', 'courseCode', 'semester', 'coolID'];
            for (const prop of properties) {
                const data = document.createElement('td');
                data.innerText = course[prop];
                row.appendChild(data);
            }
            const data = document.createElement('td');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.name = course['coolID'];
            data.appendChild(checkbox);
            row.appendChild(data);
            table.appendChild(row);
        }
    })
}

const removeButton = document.querySelector('#button-remove');
if (removeButton != null) {
    removeButton.addEventListener('click', (e) => {
        const rows = document.querySelectorAll('tr');
        let removeId = [];
        for (let i = 1; i < rows.length; i++) {
            const checkbox = rows[i].querySelector('input');
            if (checkbox.checked)
                removeId.push(checkbox.name);
        }
        chrome.storage.sync.remove(removeId, () => {
            console.log(`Remove ${removeId}`);
        })
        location.reload();
    })
}

const removeAllButton = document.querySelector('#button-remove-all');
if (removeAllButton != null) {
    removeAllButton.addEventListener('click', (e) => {
        chrome.storage.sync.clear();
        location.reload();
    })
}

const courseTable = document.querySelector('tbody');
setCoursesWithCheckbox(courseTable);