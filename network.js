const figure = document.querySelector('.network-figure');
const caption = document.getElementById('network-caption');
const principles = {
    discover: 'Find a useful signal you didn’t know to search for.',
    connect: 'Bring together what one agent knows and another needs.',
    trust: 'Share only what the task requires. Keep authority bounded.'
};
figure.querySelectorAll('button[data-principle]').forEach(button => {
    button.addEventListener('click', () => {
        figure.querySelectorAll('button').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
        figure.dataset.active = button.dataset.principle;
        caption.textContent = principles[button.dataset.principle];
    });
});
