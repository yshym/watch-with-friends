export const getElementTextContent = (id: string): string | null => {
    const element = document.getElementById(id);
    return element ? element.textContent : null;
};

export const isHTTPS = (): boolean => document.location.protocol === "https:";
