

export const addClass = (el, cssClass) => {
    if (!el) return;
    if (!el.className)
        el.className = "";

    if (el.className.indexOf(cssClass) === -1) {
        el.className += " " + cssClass;
    }
}

export const removeClass = (el, cssClass) => {
    let classList = el.className.split(" ");
    let uniqueClassList = [];
    classList.forEach((cssClass, i) => {
        if (uniqueClassList.indexOf(cssClass) === -1) {
            uniqueClassList.push(cssClass);
        }
    });
    const indexOfClass = uniqueClassList.indexOf(cssClass);
    el.className = classList = uniqueClassList.slice(0, indexOfClass).concat(uniqueClassList.slice(indexOfClass + 1)).join(" ");
}

export const toggleClass = (el, cssClass) => {
    if (!el) return;
    if (!el.className)
        el.className = "";

    let classList = el.className.split(" ");
    if (classList.indexOf(cssClass) > -1) {
        removeClass(el, cssClass);
    } else {
        addClass(el, cssClass);
    }
}
