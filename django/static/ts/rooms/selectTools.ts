export const selectedText = (selectElement: HTMLSelectElement) =>
    selectElement.options[selectElement.selectedIndex].textContent;

export const selectedValue = (selectElement: HTMLSelectElement) =>
    selectElement.options[selectElement.selectedIndex].value;
