const CACHE = "jogo-palavras-v1";

const FILES = [
  "./",
  "./index.html",
  "./palavras_jogo_radical.txt",
  "./starting_gun.wav",
  "./beep.wav",
  "./alarm.wav"
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(FILES))
  );
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
