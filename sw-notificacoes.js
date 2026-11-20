// Importado pelo service worker gerado (src/pwa/plugin.ts).

// Push da função `lembretes` (supabase/functions/lembretes): { titulo, corpo, tag, url }.
// Todo push vira notificação: o iOS corta a inscrição de quem recebe e não mostra.
self.addEventListener('push', (evento) => {
  let msg = {}
  try {
    msg = evento.data ? evento.data.json() : {}
  } catch {
    msg = { corpo: evento.data ? evento.data.text() : '' }
  }
  const base = self.registration.scope
  evento.waitUntil(
    self.registration.showNotification(msg.titulo || 'Vntem', {
      body: msg.corpo || '',
      // A tag é o id do lembrete: o mesmo aviso duas vezes troca um pelo outro, sem empilhar.
      tag: msg.tag || undefined,
      icon: new URL('pwa-192x192.png', base).href,
      badge: new URL('pwa-96x96.png', base).href,
      data: { url: msg.url || './' },
      lang: 'pt-BR',
    }),
  )
})

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
