
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('foodModal');
  const modalName = document.getElementById('modalFoodName');
  const modalDescription = document.getElementById('modalFoodDescription');
  const modalTime = document.getElementById('modalMadeTime');
  const closeButton = document.querySelector('.food-modal-close');

  const fakeTimes = [
    '08:12 AM','09:27 AM','10:05 AM','11:18 AM','12:03 PM',
    '12:47 PM','01:16 PM','02:24 PM','03:11 PM','04:38 PM',
    '05:06 PM','06:22 PM','07:14 PM','08:03 PM','09:31 PM'
  ];

  document.querySelectorAll('.card').forEach((card, index) => {
    card.addEventListener('click', () => {
      const name = card.querySelector('h3')?.textContent.trim() || 'Yummy Kitchen dish';
      const description = card.querySelector('p')?.textContent.trim() || 'A Yummy Kitchen favourite.';

      modalName.textContent = name;
      modalDescription.textContent = description;
      modalTime.textContent = fakeTimes[index % fakeTimes.length];
      modal.classList.add('show');
      modal.setAttribute('aria-hidden', 'false');
    });
  });

  function closeModal() {
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
  }

  closeButton.addEventListener('click', closeModal);
  modal.addEventListener('click', event => {
    if (event.target === modal) closeModal();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeModal();
  });
});
