export function getElementTextContent(id: string): string | null {
    let element = document.getElementById(id);
    return element ? element.textContent : null;
}
