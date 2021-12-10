/**
 * Create <div class="ic-DashboardCard__box"> html element in NTU COOl.
 * It's used to display course cards;
 * @param {string} boxName The name of the created box.
 * @returns {HTMLElement} 
 */
function createDashboradCardBox(boxName) {

    /**
     * Create <div class="ic-DashboardCard__box__container"> html element in NTU COOl.
     * @returns {HTMLElement}
     */
    function createDashboardCardBoxContainer() {
        const div = document.createElement('div');
        div.classList.add('ic-DashboardCard__box__container');
        return div;
    }

    /**
     * Create <div class="ic-DashboardCard__box__header"> html element in NTU COOl.
     * @param {string} boxName
     * @returns {HTMLElement}
     */
    function createDashboardCardBoxHeader(boxName) {
        const header = document.createElement('h2');
        header.classList.add('ic-DashboardCard__box__header');
        const span = document.createElement('span');
        span.innerText = boxName;
        header.appendChild(span);
        return header;
    }

    const box = document.createElement('div');
    box.classList.add('ic-DashboardCard__box');
    const header = createDashboardCardBoxHeader(boxName);
    const cardContainer = createDashboardCardBoxContainer();
    box.appendChild(header);
    box.appendChild(cardContainer);
    return box;
}

/**
 * Set all sitting-in course cards into the specified card box.
 * @param {HTMLElement} dashboardCardBox The card box we specifiy to store cards.
 */
function setDashboardCards(dashboardCardBox) {

    /**
     * Create <div class="ic-DashboardCard__header"> html element in NTU COOl.
     * @returns {HTMLElement}
     */
    function createDashboardCardHeader() {
        const header = document.createElement('div');
        header.classList.add('ic-DashboardCard__header');

        const headerSpan = document.createElement('span');
        headerSpan.classList.add('screenreader-only');

        const headerHero = document.createElement('div');
        headerHero.classList.add('ic-DashboardCard__header_hero');
        headerHero.ariaHidden = true;

        const anchor = document.createElement('a');
        anchor.classList.add('ic-DashboardCard__link');

        const headerContent = document.createElement('div');
        headerContent.classList.add('ic-DashboardCard__header_content');

        const headerContentHeading = document.createElement('h3');
        const headerContentheadingSpan = document.createElement('span');
        headerContentHeading.classList.add('ic-DashboardCard__header-title', 'ellipsis');
        headerContentHeading.appendChild(headerContentheadingSpan);

        const headerContentSubtitle = document.createElement('div');
        headerContentSubtitle.classList.add('ic-DashboardCard__header-subtitle', 'ellipsis');

        const headerContentTerm = document.createElement('div');
        headerContentTerm.classList.add('ic-DashboardCard__header-term', 'ellipsis');

        headerContent.appendChild(headerContentHeading);
        headerContent.appendChild(headerContentSubtitle);
        headerContent.appendChild(headerContentTerm);

        anchor.appendChild(headerContent);

        header.appendChild(headerSpan);
        header.appendChild(headerHero);
        header.appendChild(anchor);

        return header;

    }

    /**
     * Create <nav class="ic-DashboardCard__action-container"> html element in NTU COOl.
     * @returns {HTMLElement}
     */
    function createDashboardCardNav() {
        const nav = document.createElement('nav');
        nav.classList.add('ic-DashboardCard__action-container');
        return nav;
    }

    /**
     * Create <nav class="ic-DashboardCard"> html element in NTU COOl.
     * If we cannot find any existing card on the page, we will use this template to create new card. 
     * @returns {HTMLElement}
     */
    function createDashboardCardTemplate() {
        const card = document.createElement('div');
        card.classList.add('ic-DashboardCard');
        card.style = 'opacity: 1;';
        
        const header = createDashboardCardHeader();
        const nav = createDashboardCardNav();

        card.appendChild(header);
        card.appendChild(nav);

        return card;

    }

    let exampleCard = document.querySelector('.ic-DashboardCard');
    if (exampleCard == null) {
        exampleCard = createDashboardCardTemplate();
    } else {
        // We need to remove irrelevant information if we use a existing card as our template. 
        const exampleCardNav = exampleCard.querySelector('nav');
        while (exampleCardNav != null && exampleCardNav.firstElementChild != null) {
            exampleCardNav.removeChild(exampleCardNav.lastElementChild);
        }
    }
    
    /**
     * Create a new course card and set it into card box container. 
     * @param {Course} course 
     * @param {HTMLElement} cardBoxContainer <div class="ic-DashboardCard__box__container">
     */
    function setCard(course, cardBoxContainer) {

        const defaultColor = 'rgb(50, 74, 77)';

        const newCard = exampleCard.cloneNode(true);
        const anchor = newCard.querySelector('.ic-DashboardCard__link');
        const headerContentHeading = newCard.querySelector('.ic-DashboardCard__header-title');
        const headerContentHeadingSpan = headerContentHeading.querySelector('span');
        const headerContentSubtitle = newCard.querySelector('.ic-DashboardCard__header-subtitle');
        const headerContentTerm = newCard.querySelector('.ic-DashboardCard__header-term');


        headerContentHeading.title = course.courseName;

        const subtitle = `${course.courseName.split(' ')[0]} (${course.courseCode})`;
        headerContentHeadingSpan.innerText = course.courseName;
        headerContentSubtitle.title = subtitle;
        headerContentSubtitle.innerText = subtitle;
        headerContentTerm.title = course.semester;
        headerContentTerm.innerText = course.semester;

        anchor.href = `/courses/${course.coolID}`;

        const headerHero = newCard.querySelector('.ic-DashboardCard__header_hero');
        const headerContentheadingSpan = newCard.querySelector('.ic-DashboardCard__header-title span');
        headerHero.style = `background-color: ${defaultColor};`;
        headerContentheadingSpan.style = `color: ${defaultColor};`;

        const nav = newCard.querySelector('nav');
        nav.ariaLabel = `Actions for ${course.courseName}`;
        
        const screenreaderSpan = newCard.querySelector('.screenreader-only');
        screenreaderSpan.innerText = `Course card region for ${course.courseName}`;
        newCard.ariaLabel = course.courseName;

        cardBoxContainer.appendChild(newCard);
    }

    const dashboardCardBoxContainer = dashboardCardBox.querySelector('.ic-DashboardCard__box__container');
    chrome.storage.sync.get(null, (items) => {
        for (let key in items) {
            const course = items[key];
            setCard(course, dashboardCardBoxContainer);
        }
    })
}

/**
 * Set the list of sitting-in courses into sidebar.
 * @param {HTMLElement} sidebarUnorderedList 
 */
function setSidebarListItems(sidebarUnorderedList) {

    function createListItemTemplate() {
        const li = document.createElement('li');
        li.classList.add('fOyUs_bGBk', 'jpyTq_bGBk', 'jpyTq_ycrn', 'jpyTq_bCcs');
        li.style = 'padding: 0px; max-width: 100%;'
        const anchor = document.createElement('a');
        anchor.classList.add(['fOyUs_bGBk', 'fbyHH_bGBk', 'fbyHH_bSMN']);
        const div = document.createElement('div');
        div.classList.add('enRcg_bGBk', 'enRcg_dfBC', 'enRcg_pEgL', 'enRcg_eQnG');
        div.style.fontSize = '12px';
        li.appendChild(anchor);
        li.appendChild(div);
        return li;
    }

    let exampleItem = sidebarUnorderedList.querySelector('li');
    if (exampleItem == null) {
        exampleItem = createListItemTemplate();
    }

    function setItem(course) {
        const isIdValid = /^\d+$/.test(course.coolID);
        if (isIdValid) {
            const newItem = exampleItem.cloneNode(true);
            const anchor = newItem.querySelector('a');
            anchor.href = `/courses/${course.coolID}`
            anchor.innerText = course.courseName;
            const div = newItem.querySelector('div');
            div.innerText = course.semester;
            sidebarUnorderedList.appendChild(newItem);
        }
    }
    chrome.storage.sync.get(null, (items) => {
        for (let key in items) {
            const course = items[key];
            setItem(course);
        }
    })
}

/**
 * Check if the sidebar is unfolded.
 * If it is unfolded, we need to set items to it.
 * @param {MutationRecord[]} mutations
 * @param {MutationObserver} observer
 */
function sidebarObserverCallback(mutations, observer) {
    for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
            if (node.tagName == 'UL' && !observer.isListItemsSet) {
                observer.isListItemsSet = true;
                setSidebarListItems(node);
            }
        }
    }
}   

/**
 * Check the existence of dashboard and if sidebar is unfolded.
 * @param {MutationRecord[]} mutations
 * @param {MutationObserver} observer
 */
function bodyObserverCallback(mutations, observer) {
    for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
            if (node instanceof HTMLElement) {
                // Dashboard
                if (node.classList.contains('unpublished_courses_redesign')) {
                    sitInDashboardCardBox = createDashboradCardBox('Sit-in');
                    node.appendChild(sitInDashboardCardBox);
                    setDashboardCards(sitInDashboardCardBox);
                }
                // Sidebar
                if (node.tagName == 'SPAN' && node.dir == 'ltr') {
                    if (node.ariaHidden == null) {
                        const unorderedList = node.querySelector('ul');
                        if (unorderedList == null) {
                            const sidebarObserver = new MutationObserver(sidebarObserverCallback);
                            sidebarObserver.isListItemsSet = false;
                            sidebarObserver.observe(node, { subtree: true, childList: true });
                        } else {
                            setSidebarListItems(unorderedList);
                        }
                    } 
                }
            }
        }
    }
}

const bodyObserver = new MutationObserver(bodyObserverCallback);
const dashboard = document.querySelector('.unpublished_courses_redesign');
if (dashboard != null) {
    sitInDashboardCardBox = createDashboradCardBox('Sit-in');
    dashboard.appendChild(sitInDashboardCardBox);
    setDashboardCards(sitInDashboardCardBox);
}
bodyObserver.observe(document.body, { subtree: true, childList: true });
