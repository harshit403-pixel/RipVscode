export async function navigate(
  router,
  href
) {
  if (window.leavePage) {
    await window.leavePage();
  }

  router.push(href);

  setTimeout(() => {
    if (window.enterPage) {
      window.enterPage();
    }
  }, 100);
}