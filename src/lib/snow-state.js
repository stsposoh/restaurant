export const snowState = {
  dolly: 0,
  rise: 0,
  opacity: 1,
  falling: false,
  // Owned by the finale; kept apart from `opacity` (owned by the Ascent) so their timelines never fight.
  finale: 0,
};
