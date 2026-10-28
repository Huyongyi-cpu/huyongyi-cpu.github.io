const figure = document.querySelector('.network-figure');
const caption = document.getElementById('network-caption');
// Captions live on each button (data-caption) so every language page carries its own copy.
figure.querySelectorAll('button[data-principle]').forEach(button => {
    button.addEventListener('click', () => {
        figure.querySelectorAll('button').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
        figure.dataset.active = button.dataset.principle;
        caption.textContent = button.dataset.caption;
    });
});
