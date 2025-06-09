  const modal = document.getElementById('imgModal');
  const modalImg = document.getElementById('modalImg');

  document.querySelectorAll('.certificate-images img').forEach(img => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', () => {
      modal.style.display = 'flex';
      modalImg.src = img.src;
    });
  });

  modal.addEventListener('click', () => {
    modal.style.display = 'none';
  });