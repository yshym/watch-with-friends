export selectedText = (selectElement) ->
    selectElement.options[selectElement.selectedIndex].textContent

export selectedValue = (selectElement) ->
    selectElement.options[selectElement.selectedIndex].value
