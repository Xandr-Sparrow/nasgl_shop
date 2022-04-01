function countFunc(count) {
    var btnPlus = count.querySelector('.card__quantity-button--plus');
    var btnMinus = count.querySelector('.card__quantity-button--minus');
    var field = count.querySelector('.card__quantity-number');
    var fieldValue = parseFloat(field.value, 10);

    btnMinus.addEventListener('click', function () {
        if (fieldValue > 1) {
            fieldValue--;
            field.value = fieldValue;
        } else {
            return 1;
        }
    });
    btnPlus.addEventListener('click', function () {
        fieldValue++;
        field.value = fieldValue;
    });

}
var counts = document.querySelectorAll('.card');
counts.forEach(countFunc);