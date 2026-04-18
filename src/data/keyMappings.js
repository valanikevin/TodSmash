// Each key maps to a word, emoji/visual, color, and category
// Using emojis as visuals so no external images needed

const keyMappings = {
  a: { word: 'Apple', emoji: '🍎', color: '#FF6B6B', category: 'fruit', extras: ['🍎', '🍏', '🍎', '🍏', '🍎'] },
  b: { word: 'Butterfly', emoji: '🦋', color: '#845EC2', category: 'animal', extras: ['🦋', '🦋', '🦋', '🦋', '🦋'] },
  c: { word: 'Cat', emoji: '🐱', color: '#FF9671', category: 'animal', extras: ['🐱', '😺', '😸', '🐈', '🐱'] },
  d: { word: 'Dog', emoji: '🐶', color: '#FFC75F', category: 'animal', extras: ['🐶', '🐕', '🦮', '🐾', '🐶'] },
  e: { word: 'Elephant', emoji: '🐘', color: '#9B9B9B', category: 'animal', extras: ['🐘', '🐘', '🐘', '🐘', '🐘'] },
  f: { word: 'Fish', emoji: '🐟', color: '#00C9A7', category: 'animal', extras: ['🐟', '🐠', '🐡', '🐟', '🐠'] },
  g: { word: 'Grapes', emoji: '🍇', color: '#C34A36', category: 'fruit', extras: ['🍇', '🍇', '🍇', '🍇', '🍇'] },
  h: { word: 'Horse', emoji: '🐴', color: '#8B4513', category: 'animal', extras: ['🐴', '🐎', '🏇', '🐴', '🐎'] },
  i: { word: 'Ice Cream', emoji: '🍦', color: '#FFD93D', category: 'food', extras: ['🍦', '🍨', '🍧', '🍦', '🍨'] },
  j: { word: 'Jellyfish', emoji: '🪼', color: '#FF6F91', category: 'animal', extras: ['🪼', '🪼', '🪼', '🪼', '🪼'] },
  k: { word: 'Kite', emoji: '🪁', color: '#00D2FC', category: 'toy', extras: ['🪁', '🪁', '🪁', '🪁', '🪁'] },
  l: { word: 'Lion', emoji: '🦁', color: '#F9A825', category: 'animal', extras: ['🦁', '🦁', '🦁', '🦁', '🦁'] },
  m: { word: 'Moon', emoji: '🌙', color: '#FFE156', category: 'nature', extras: ['🌙', '🌝', '🌛', '⭐', '✨'] },
  n: { word: 'Nest', emoji: '🪺', color: '#8D6E63', category: 'nature', extras: ['🪺', '🐣', '🐥', '🪺', '🐣'] },
  o: { word: 'Orange', emoji: '🍊', color: '#FF8A00', category: 'fruit', extras: ['🍊', '🍊', '🍊', '🍊', '🍊'] },
  p: { word: 'Penguin', emoji: '🐧', color: '#2C3E50', category: 'animal', extras: ['🐧', '🐧', '🐧', '🐧', '🐧'] },
  q: { word: 'Queen', emoji: '👸', color: '#D4AF37', category: 'people', extras: ['👸', '👑', '💎', '👸', '👑'] },
  r: { word: 'Rainbow', emoji: '🌈', color: '#FF0000', category: 'nature', extras: ['🌈', '🌈', '🌈', '🌈', '🌈'] },
  s: { word: 'Star', emoji: '⭐', color: '#FFD700', category: 'nature', extras: ['⭐', '🌟', '✨', '💫', '⭐'] },
  t: { word: 'Tiger', emoji: '🐯', color: '#FF8C00', category: 'animal', extras: ['🐯', '🐅', '🐯', '🐅', '🐯'] },
  u: { word: 'Umbrella', emoji: '☂️', color: '#E91E63', category: 'object', extras: ['☂️', '🌂', '☔', '☂️', '🌂'] },
  v: { word: 'Violin', emoji: '🎻', color: '#795548', category: 'music', extras: ['🎻', '🎵', '🎶', '🎻', '🎵'] },
  w: { word: 'Whale', emoji: '🐳', color: '#2196F3', category: 'animal', extras: ['🐳', '🐋', '🐳', '🐋', '🐳'] },
  x: { word: 'Xylophone', emoji: '🎵', color: '#9C27B0', category: 'music', extras: ['🎵', '🎶', '🎼', '🎵', '🎶'] },
  y: { word: 'Yak', emoji: '🐃', color: '#6D4C41', category: 'animal', extras: ['🐃', '🐃', '🐃', '🐃', '🐃'] },
  z: { word: 'Zebra', emoji: '🦓', color: '#212121', category: 'animal', extras: ['🦓', '🦓', '🦓', '🦓', '🦓'] },

  // Number keys
  '0': { word: 'Zero', emoji: '0️⃣', color: '#607D8B', category: 'number', extras: ['0️⃣', '🔢', '0️⃣', '🔢', '0️⃣'] },
  '1': { word: 'One', emoji: '1️⃣', color: '#F44336', category: 'number', extras: ['1️⃣', '☝️', '1️⃣', '☝️', '1️⃣'] },
  '2': { word: 'Two', emoji: '2️⃣', color: '#E91E63', category: 'number', extras: ['2️⃣', '✌️', '2️⃣', '✌️', '2️⃣'] },
  '3': { word: 'Three', emoji: '3️⃣', color: '#9C27B0', category: 'number', extras: ['3️⃣', '🔱', '3️⃣', '🔱', '3️⃣'] },
  '4': { word: 'Four', emoji: '4️⃣', color: '#673AB7', category: 'number', extras: ['4️⃣', '🍀', '4️⃣', '🍀', '4️⃣'] },
  '5': { word: 'Five', emoji: '5️⃣', color: '#3F51B5', category: 'number', extras: ['5️⃣', '🖐️', '5️⃣', '🖐️', '5️⃣'] },
  '6': { word: 'Six', emoji: '6️⃣', color: '#2196F3', category: 'number', extras: ['6️⃣', '🎲', '6️⃣', '🎲', '6️⃣'] },
  '7': { word: 'Seven', emoji: '7️⃣', color: '#00BCD4', category: 'number', extras: ['7️⃣', '🌈', '7️⃣', '🌈', '7️⃣'] },
  '8': { word: 'Eight', emoji: '8️⃣', color: '#009688', category: 'number', extras: ['8️⃣', '🎱', '8️⃣', '🎱', '8️⃣'] },
  '9': { word: 'Nine', emoji: '9️⃣', color: '#4CAF50', category: 'number', extras: ['9️⃣', '🎯', '9️⃣', '🎯', '9️⃣'] },

  // Special keys
  ' ': { word: 'Space! Whoosh!', emoji: '🚀', color: '#1A237E', category: 'special', extras: ['🚀', '🌍', '🌙', '⭐', '🛸'] },
  'Enter': { word: 'Boom!', emoji: '💥', color: '#FF5722', category: 'special', extras: ['💥', '🎆', '🎇', '💥', '🎆'] },
  'Backspace': { word: 'Oops!', emoji: '🙊', color: '#795548', category: 'special', extras: ['🙊', '🙈', '🙉', '🙊', '🙈'] },
  'Tab': { word: 'Zoom!', emoji: '⚡', color: '#FFEB3B', category: 'special', extras: ['⚡', '💨', '🏃', '⚡', '💨'] },
  'Escape': { word: 'Peek-a-boo!', emoji: '🙈', color: '#FF9800', category: 'special', extras: ['🙈', '🙉', '🙊', '👀', '🙈'] },
  'ArrowUp': { word: 'Up Up Up!', emoji: '🎈', color: '#E040FB', category: 'special', extras: ['🎈', '⬆️', '🚁', '🎈', '⬆️'] },
  'ArrowDown': { word: 'Down Down!', emoji: '🏄', color: '#00BFA5', category: 'special', extras: ['🏄', '⬇️', '🎢', '🏄', '⬇️'] },
  'ArrowLeft': { word: 'Left!', emoji: '👈', color: '#FF6E40', category: 'special', extras: ['👈', '⬅️', '🏃', '👈', '⬅️'] },
  'ArrowRight': { word: 'Right!', emoji: '👉', color: '#7C4DFF', category: 'special', extras: ['👉', '➡️', '🏃', '👉', '➡️'] },
  'Shift': { word: 'Sparkle!', emoji: '✨', color: '#FFD740', category: 'special', extras: ['✨', '💫', '⭐', '🌟', '✨'] },
  'Control': { word: 'Magic!', emoji: '🪄', color: '#AA00FF', category: 'special', extras: ['🪄', '✨', '🎩', '🐇', '🪄'] },
  'Alt': { word: 'Wow!', emoji: '🎉', color: '#FF1744', category: 'special', extras: ['🎉', '🎊', '🥳', '🎉', '🎊'] },
  'Meta': { word: 'Super!', emoji: '🦸', color: '#3D5AFE', category: 'special', extras: ['🦸', '💪', '⭐', '🦸', '💪'] },
  'CapsLock': { word: 'Party!', emoji: '🥳', color: '#00E676', category: 'special', extras: ['🥳', '🎉', '🎊', '🎈', '🥳'] },
};

// Fallback for any unmapped key
export const getFallbackMapping = (key) => ({
  word: `${key}!`,
  emoji: '🎪',
  color: `hsl(${Math.random() * 360}, 80%, 60%)`,
  category: 'special',
  extras: ['🎪', '🎠', '🎡', '🎢', '🎪'],
});

export default keyMappings;
