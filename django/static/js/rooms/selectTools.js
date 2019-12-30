export function selectedText(selectElement) {
    return selectElement.options[selectElement.selectedIndex].textContent
}

export function selectedValue(selectElement) {
    return selectElement.options[selectElement.selectedIndex].value
}
