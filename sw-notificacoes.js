// Importado pelo service worker gerado (src/pwa/plugin.ts).
// Toque numa notificação: foca o app aberto ou abre na URL da notificação.
self.addEventListener('notificationclick', (evento) => {
  evento.notification.close()
  // Relativa ao escopo do app (a raiz no dev, /vntem/ no GitHub Pages).
  const url = new URL((evento.notification.data && evento.notification.data.url) || './', self.registration.scope).href
  evento.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((janelas) => {
      for (const janela of janelas) {
        if (new URL(janela.url).origin === self.location.origin && 'focus' in janela) {
          return janela.navigate(url).then((j) => (j || janela).focus())
        }
      }
      return self.clients.openWindow(url)
    }),
  )
})
