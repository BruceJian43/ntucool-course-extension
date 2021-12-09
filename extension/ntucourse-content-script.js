const semester_selector = document.querySelector('#select_sem');
const semester = semester_selector == null ? 'unknown' : semester_selector.value;

const tables = document.querySelectorAll('tbody');

let lang = null;
let courseTable = null;
let courseTableTitles = [];

for (const table of tables) {
    const firstRow = table.querySelector('tr');
    if (firstRow != null) {
        const td = firstRow.querySelector('td');
        if (td != null) {
            if (td.innerText == '流水號' || td.innerText == 'serial number') {
                courseTable = table;
                lang = td.innerText == '流水號' ? 'tw' : 'en';
                const titles = firstRow.querySelectorAll('td');
                for (const title of titles) {
                    courseTableTitles.push(title.innerText);
                }
            } 
        }
    }
}

if (courseTable != null) {
    const courseCodeIndex = lang == 'tw' ? courseTableTitles.indexOf('課號') : courseTableTitles.indexOf('Curriculum Number');
    const courseWebsiteIndex = lang == 'tw' ? courseTableTitles.indexOf('課程網頁') : courseTableTitles.indexOf('Course\nWebsite');
    const courseTableRows = courseTable.querySelectorAll('tr');
    const newCol = document.createElement('td');
    newCol.style.width = '8%';
    newCol.innerText = lang == 'tw' ? 'Cool 旁聽' : 'Cool Sit-in';
    courseTableRows[0].appendChild(newCol);
    for (let i = 1; i < courseTableRows.length; i++) {
        const td = document.createElement('td');
        
        // Check if this course using ntu cool as course website
        const rowdata = courseTableRows[i].querySelectorAll('td');
        if (rowdata.length != courseTableTitles.length) {
            continue;
        }
        const courseWebsiteImg = rowdata[courseWebsiteIndex].querySelector('a img[alt="Cool"]');
        if (courseWebsiteImg != null) {
            // parse cool id 
            const hrefSplit = courseWebsiteImg.parentNode.href.split('/');
            const coolID = hrefSplit[hrefSplit.length - 1];
            const input = document.createElement('input');
            input.name = coolID;
            input.type = 'button';
            input.value = lang == 'tw' ? '加入' : 'Add';
            input.addEventListener('click', () => {
                chrome.runtime.sendMessage({ 'id': coolID }, (response) => {
                    let msg = '';
                    if ('errors' in response) {
                        console.log(response);
                        switch (response['errors'][0]['message']) {
                            case 'user authorization required':
                                msg = lang == 'tw' ? '該課程無開放權限' : 'Enroll in this course need to be authenticated'
                                alert(msg);
                                break;
                            case 'user not authorized to perform that action':
                                msg = lang == 'tw' ? '該課程無開放權限' : 'Enroll in this course need to be authenticated'
                                alert(msg);
                                break;
                            case 'invalid id':
                                msg = lang == 'tw' ? 'Cool id 格式錯誤' : 'Invalid cool id';
                                alert(msg);
                                break;
                        }
                    } else {
                        const courseName = response.name;
                        const courseCode = courseCodeIndex == -1 ? 'unknown' : rowdata[courseCodeIndex].innerText;
                        const course = new Course(courseName, courseCode, semester, coolID)
                        chrome.storage.sync.get([coolID], (item) => {
                            if (Object.keys(item).length === 0 && Object.getPrototypeOf(item) === Object.prototype) {
                                chrome.storage.sync.set({ [coolID]: course }, () => {
                                    msg = lang == 'tw' ? `成功加入 ${courseName}` : `Successfully enroll in ${courseName}`;
                                    alert(msg);
                                })
                            } else {
                                msg = lang == 'tw' ? `${courseName}\n已加入過該課程` : `${courseName}\nYou have been enrolled in this course before.`
                                alert(msg);
                            }
                        })
                    }
                });
            })
            td.appendChild(input);
        }
        courseTableRows[i].appendChild(td);
    }
}