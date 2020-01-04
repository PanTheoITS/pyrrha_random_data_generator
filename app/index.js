choicesForm.addEventListener('submit', (event) => {
    event.preventDefault();
    let elements = document.querySelectorAll('#choicesForm select,input:not([type="submit"]):not([type="range"])');
    let formValues = [];
    elements.forEach((element) => {
        formValues.push({
            name: element.name,
            value: element.value.trim()
        });
    });
    if (formValues.length > 4) {
        ipcRenderer.send('formSubmit', formValues);
    } else {
        ipcRenderer.send('noFields');
    }
});

let textFields = document.querySelectorAll('#choicesForm input[type="text"]');
textFields.forEach((textField) => {
    textField.title = 'You can change the name of this field (20 characters max).';

});

let spans = document.querySelectorAll('span');
spans.forEach((span) => {
    span.classList.add('delField');
    span.title = 'Disable Field';
    span.addEventListener('click', (event) => {
        let field = event.target.parentElement.previousElementSibling.children[1];
        let selSpan = event.target;
        if (selSpan.getAttribute('id')) {
            let fieldTemplate = `<input class="form-control" type="text" name="${selSpan.getAttribute('id')}" value="${selSpan.getAttribute('id')}" maxlength="20">`;
            let fieldParent = event.target.parentElement.previousElementSibling;
            fieldParent.innerHTML += fieldTemplate;
            selSpan.innerHTML = '&#9746;';
            selSpan.title = 'Disable Field';
            selSpan.removeAttribute('id');
        } else {
            selSpan.setAttribute('id', field.getAttribute('name'));
            selSpan.innerHTML = '&#9745;';
            selSpan.title = 'Enable Field';
            field.remove();
        }

    });
});

let slider = document.querySelector('input[type="range"]');
let recNumber = document.querySelector('input[type="number"]');
recNumber.addEventListener('input', () => {
    slider.value = (recNumber.value == '') ? 1 : recNumber.value;

});
slider.addEventListener('input', () => {
    recNumber.value = slider.value;
});