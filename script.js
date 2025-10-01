/*=============== MODALS (multi-cartes) ===============*/
// Gère ouverture/fermeture par carte, sans IDs dupliqués
(function initModals() {
    const modalBlocks = document.querySelectorAll('.modal.modal-btn-container');

    modalBlocks.forEach((block) => {
        const openBtn = block.querySelector('.modal__button');
        const container = block.querySelector('.modal__container');
        const closeEls = block.querySelectorAll('.close-modal');

        if (!openBtn || !container) return;

        openBtn.addEventListener('click', () => {
        container.classList.add('show-modal');
        });

        // Fermer via les éléments de fermeture (croix, boutons…)
        closeEls.forEach((el) => {
        el.addEventListener('click', () => {
            container.classList.remove('show-modal');
            });
        });

        // Fermer en cliquant hors du contenu
        container.addEventListener('click', (e) => {
        const content = container.querySelector('.modal__content');
        if (e.target === container && content) {
            container.classList.remove('show-modal');
            }
        });
    });

    // Fermer avec Échap
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
        document.querySelectorAll('.modal__container.show-modal').forEach((c) => c.classList.remove('show-modal'));
        }
    });
})();