import { HttpInterceptorFn } from '@angular/common/http';

// Definizione di un interceptor HTTP per aggiungere il token di autenticazione alle richieste
export const customInterceptor: HttpInterceptorFn = (req, next) => {
  // Recupera il token di autenticazione dal localStorage in modo sicuro
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

  // Log per debug: mostra se il token è presente
  console.log('Interceptor attivato, token: ', token);

  // Se non esiste un token, invia la richiesta originale senza modifiche
  if (!token) {
    return next(req);
  }

  // Clona la richiesta originale e aggiunge l'header di autorizzazione
  const newReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`, // Aggiunge il token come Bearer Token nell'header Authorization
    },
  });

  // Log per debug: indica che la richiesta è stata modificata
  console.log('Nuova richiesta con interceptor: ', newReq);

  return next(newReq); // Passa la nuova richiesta con l'header aggiornato
};
