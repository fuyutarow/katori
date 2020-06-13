export const isPWA = () => {
  return window && window.matchMedia('(display-mode: standalone)').matches;
};
