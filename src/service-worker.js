/* eslint-disable no-restricted-globals */

// This service worker can be customized!
// See https://developers.google.com/web/tools/workbox/modules
// for the list of available Workbox modules, or add any other
// code you'd like.
// You can also remove this file if you'd prefer not to use a
// service worker, and the Workbox build step will be skipped.

import { clientsClaim } from "workbox-core";
import { ExpirationPlugin } from "workbox-expiration";
import { precacheAndRoute, createHandlerBoundToURL } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { StaleWhileRevalidate } from "workbox-strategies";

clientsClaim();

// Precache all of the assets generated by your build process.
// Their URLs are injected into the manifest variable below.
// This variable must be present somewhere in your service worker file,
// even if you decide not to use precaching. See https://cra.link/PWA
precacheAndRoute(self.__WB_MANIFEST);

// Set up App Shell-style routing, so that all navigation requests
// are fulfilled with your index.html shell. Learn more at
// https://developers.google.com/web/fundamentals/architecture/app-shell
const fileExtensionRegexp = new RegExp("/[^/?]+\\.[^/]+$");
registerRoute(
  // Return false to exempt requests from being fulfilled by index.html.
  ({ request, url }) => {
    // If this isn't a navigation, skip.
    if (request.mode !== "navigate") {
      return false;
    } // If this is a URL that starts with /_, skip.

    if (url.pathname.startsWith("/_")) {
      return false;
    } // If this looks like a URL for a resource, because it contains // a file extension, skip.

    if (url.pathname.match(fileExtensionRegexp)) {
      return false;
    } // Return true to signal that we want to use the handler.

    return true;
  },
  createHandlerBoundToURL(process.env.PUBLIC_URL + "/index.html")
);

// An example runtime caching route for requests that aren't handled by the
// precache, in this case same-origin .png requests like those from in public/
registerRoute(
  // Add in any other file extensions or routing criteria as needed.
  ({ url }) =>
    url.origin === self.location.origin && url.pathname.endsWith(".png"), // Customize this strategy as needed, e.g., by changing to CacheFirst.
  new StaleWhileRevalidate({
    cacheName: "images",
    plugins: [
      // Ensure that once this runtime cache reaches a maximum size the
      // least-recently used images are removed.
      new ExpirationPlugin({ maxEntries: 50 }),
    ],
  })
);

// This allows the web app to trigger skipWaiting via
// registration.waiting.postMessage({type: 'SKIP_WAITING'})
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// Any other custom service worker logic can go here.
const checkAppVisibility = () => {
  return new Promise((resolve, reject) => {
    self.clients
      .matchAll({
        type: "window",
        includeUncontrolled: true,
      })
      .then(function (windowClients) {
        var clientIsVisible = false;

        for (var i = 0; i < windowClients.length; i++) {
          const windowClient = windowClients[i];

          if (windowClient.visibilityState === "visible") {
            clientIsVisible = true;

            break;
          }
        }

        return resolve(clientIsVisible);
      });
  });
};

self.addEventListener("push", (e) => {
  console.log("New Push Recieved...");
  console.log(e.data);
  const data = e.data.json();
  checkAppVisibility().then((isClientVisible) => {
    console.log("is client visible?", isClientVisible);
    if (isClientVisible === false)
      switch (data.event) {
        case "message_in":
          let title = "New message from " + data.payload.username;
          let notificationObject = {
            body: data.payload.content,
            icon: data.payload.icon,
            badge:
              "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAABLCAYAAAA25wSFAAAABHNCSVQICAgIfAhkiAAABK1JREFUaEPtmmloHVUUx3/nPdIYs73U2CaStElTqpIu6UuXlCpKUUSJbbSCVWtr0WArWE0pIloEqyDW2mCL5JMiFv1QoSQRq7ggUkHUNDFu+aJIEdxQzEKjNcuReS+hWV/m3jsvJTDzdc75n/O799xzZ+6M0KILgWMotQhZzNal/Ai8TJ00uoQUWvR94EYXEUffrWyRk7YaHsA54FJbAWc/5Rh1stdWxwNQW+eA/F5ni+y01QoBbEdujF84A+EacCyjsITCEgpLKNzIHGvA0T3sQmEXCkso7EKONeDiXlsEB680VugS5dDqAnntor/QWAIkiaNcP7cBlINzGkCVl0IA4+U3wcFlDYQz4Dr6nv/cn4GFcPAqu6EYLaFvgUo7CXev2gAANgLeAe9FOR91B/AG8aQuI0qdTwhv49/mPvZJhWAATLJp1tsQrI/DJ4a6vRgOLDNJ4IJtcg2YXq16F8qbpm7T2d9bAg0Vdmp2AM26H+EFu5CTvR5ZAjtL7dRsAY4iPGwXcrLX4UrYVGinZgvwNcIKu5CTvd5aCxWW/c8c4B0tYpBfg0o+JwqfbAQxX4mJFMwBmvVphKeCAnBpoeYAp7SEAX4AMoMCaKyE6yzr3xygWT9AuCGo5HO98rnGTc1/CbXoM8ABt3DjvXeUwqNL3BT9AbToPuBFt1DjvedF4L0aiGW4qaYGOKV5DHAUsP6GO1169YtgT7lb8tOvgVYtR/G+nNcD2e5hxisUZsDbNZAZcVdOzkCyt69DWQdsDnKTmirFppWwvsA9+QszMIu/Guwpg/rFwSQ/6wB3FMMTlo/N0yHP2qnEfaWw17FlTgUhQmPaD7b2VcD2kuDKZqySKLvSBlCUCc9dDavy05M88G48JrcEDuA9WG4thoalkGXWKru9mvaDGxW+r4rJCc/WA/gN8P6bc742FMDucliRayGlnI0XSJmpp9CsRxAaTB1H7b2HspsWwOYiWJ5nq5Lw+z0ekyJTheSrRIseAh4AZt5ilC6EdpTPjlfzbGUuMdOg09nHY+avNpbvQskU2rv1c0js4MFcmZTFs+SsiZgrwBvA3SYBU9oKO+L5ctxEzxVgN9BkEjCVrcKJ6pjcaaLnBND2jy6KnMdoylMCKP0aZfGaPPnTL4QTgBfkTLe2CVT7DejD7tV4TO73YZcwcQbo6Nb9SnAndV5SEWVTVYF87AfCGaCrVy/rH+JnCfDHcYW/JIOV8Wz5ZSYIZwAvQEePHlG13wynTFLpHJ7HzWuyJeVBWiAAbb1aGBniJ4ScmUbM8P4fEWVbqnIKBGBkMT8m8Lxhgr7MVTktUQ7H86R1okNgACM78xfAWl9ZWRip0uc9+CCcjggdq/Ply0ABvunX0oH/+AqYb5GfsYu/gy1D2c4+XT44yKcipO9VZiSntAAkutLfWqXCR+meibQBJBZ1jy6VYT5ECPAgZXw5pBXAC/Wdas6/3TSJsN2wEn2Zpx1gNIszvXqrDPMKcLmvzHwazRpAYjZ6dP55eFKVhwQu8ZnjTGaPB9pGZ4rm3e/s0wVDQ+xS5R5x+FioSn8kQtWsA4yFbD+nV+gA16JsQFgvUONnEIC2KDy4Kibt/wMghtEuGwBAowAAAABJRU5ErkJggg==",
            tag: data.payload.thread_id,
            renotify: true,
            thread_id: data.payload.thread_id,
          };
          self.registration.showNotification(title, notificationObject);
          break;

        default:
          break;
      }
  });
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();

  let url = `https://commamessenger.netlify.app/conversations/${event.notification.tag}`;
  self.clients.openWindow(url);
});
