function setCourses(table) {
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
            table.appendChild(row);
        }
    })
}
const courseTable = document.querySelector('tbody');
if (courseTable != null) {
    setCourses(courseTable);
}