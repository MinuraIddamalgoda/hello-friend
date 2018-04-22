const folders = [];
ThemeList = {
    DEFAULT: 0,
    NEOPOLITAN: 1,
    MOTHER_EARTH: 2
};
var selectedTheme = ThemeList.DEFAULT;

chrome.bookmarks.getTree(items => {
    const bookmarksBar = items[0].children.find(x => /bookmarks bar/i.test(x.title));
    const rootFolder = { title: '/', children: [] };

    bookmarksBar.children.forEach(node => {
        const folder = { children: [] };

        if (node.children && node.children.length) {
            folder.title = node.title;
            node.children.forEach(child => {
                if (!child.url.startsWith('javascript:'))
                    folder.children.push({ title: child.title, url: child.url });
            });
        } else { // if not a folder, it's a shortcut
            if (!node.url.startsWith('javascript:'))
                rootFolder.children.push({ title: node.title, url: node.url });
        }

        if (folder.children.length)
            folders.push(folder);
    });

    if (rootFolder.children.length)
        folders.unshift(rootFolder);

    render(folders, selectedTheme);
});

function render(folders, theme) {
    const colors = getColours(theme);
    const root = document.getElementById('container');
    let i = 0;
    root.innerHTML = folders.map(folder => {
        const listItems = folder.children.map(item => {
            if (item.title === '-') return '<li class="separator">&nbsp;<li>'
            const title = trunc(item.title);
            return `<li><a href="${item.url}" title="${title.endsWith('...') ? item.title : ''}">${title}</a></li>`
        }).join('');
        i = (i >= colors.length - 1) ? 0 : (i + 1);
        return `<div class="column"><h2 class="folder-name" style="color: ${colors[i]}">${folder.title}</h1><ul>${listItems}</ul></div>`;
    }).join('');
}

function trunc(text) {
    if (text.length <= 28)
        return text;

    return text.substr(0, 30) + '...'
}

function getColours(theme) {
    switch(theme) {
        case ThemeList.DEFAULT:
            return ['#cc6666', '#de935f', '#f0c674', '#8abeb7', '#81a2be', '#b294bb', '#a3685a'];
        case ThemeList.NEOPOLITAN:
            return ["#e0b2b5", "#b99692", "#9c9a9b", "#e1c3ae", "#c9c0ae", "#8f5a61", "#503d41"];
        case ThemeList.MOTHER_EARTH:
            return ["#488761", "#9f725c", "#ac955b", "#7b5028", "#9db337", "#e2cd88", "#8ba877"];
        default:
            return null;
    }
}

function setTheme(index) {
    switch(index) {
        case 0:
            console.log("theme changed");
            selectedTheme = ThemeList.DEFAULT;
            render(folders, selectedTheme);
            window.location.href = "index.html";
            break;
        case 1:
            console.log("theme changed");
            selectedTheme = ThemeList.NEOPOLITAN;
            render(folders, selectedTheme);
            window.location.href = "index.html";
            break;
        case 2:
            console.log("theme changed");
            selectedTheme = ThemeList.MOTHER_EARTH;
            render(folders, selectedTheme);
            window.location.href = "index.html";
            break;
    }
}
