// Pi Web adaptation of Anthony Fu's Vitesse Black palette.
// https://github.com/antfu/vscode-theme-vitesse
// Opaque foregrounds keep small web controls readable against black surfaces.
export const theme = {
  id: "black",
  name: "Vitesse Black",
  description: "Neutral black surfaces, warm text, and muted green accents.",
  order: 5,
  colorScheme: "dark",
  tokens: {
    "--pi-bg": "#000000",
    "--pi-surface": "#0b0b0b",
    "--pi-surface-hover": "#121212",
    "--pi-terminal-bg": "#000000",
    "--pi-terminal-text": "#dbd7ca",
    "--pi-border": "#292929",
    "--pi-border-muted": "#191919",
    "--pi-text": "#dbd7ca",
    "--pi-text-secondary": "#bfbaaa",
    "--pi-text-bright": "#eeeae0",
    "--pi-muted": "#a09e97",
    "--pi-dim": "#818079",
    "--pi-accent": "#4d9375",
    "--pi-accent-border": "#427e64",
    "--pi-selection-bg": "#171f1b",
    "--pi-success": "#4d9375",
    "--pi-success-border": "#427e64",
    "--pi-success-bg": "#0c1510",
    "--pi-success-surface": "#101b14",
    "--pi-success-ring": "#4d937540",
    "--pi-warning": "#e6cc77",
    "--pi-warning-border": "#a48d4f",
    "--pi-warning-surface": "#19160d",
    "--pi-danger": "#cb7676",
    "--pi-purple": "#a78ab5",
    "--pi-purple-border": "#62536a",
    "--pi-purple-surface": "#17121a",
    "--pi-overlay": "#000000b3",
    "--pi-shadow-soft": "#00000066",
    "--pi-shadow": "#00000099",
    "--pi-shadow-strong": "#000000cc",
    "--pi-bg-overlay-soft": "#000000dd",
    "--pi-bg-overlay": "#000000ee",
    "--pi-success-bg-overlay": "#0c1510ee",
    "--pi-terminal-selection": "#eeeeee18"
  }
};

export default {
  apiVersion: 4,
  name: "Vitesse",
  activate: () => ({ contributions: { themes: [theme] } })
};
