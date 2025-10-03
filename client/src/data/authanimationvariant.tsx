export const variants = {
  initial: (direction: number) => ({
    x: direction < 0 ? -300 : 300,
    opacity: 0,
    position: "absolute" as "absolute",
    width: "100%",
  }),
  animate: {
    x: 0,
    opacity: 1,
    position: "relative" as "relative",
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
    position: "absolute" as "absolute",
    width: "100%",
  }),
};
