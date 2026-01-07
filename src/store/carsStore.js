import { carsApi } from "../api/cars";

const carCache = new Map();
const inFlight = new Map();

export async function getCarsCached(userId, lang = "ar") {
  if (!userId) return [];
  if (carCache.has(userId)) return carCache.get(userId);

  if (inFlight.has(userId)) return inFlight.get(userId);

  const p = carsApi
    .getAllCarsForUser({ userId, lang })
    .then((cars) => {
      carCache.set(userId, cars);
      inFlight.delete(userId);
      return cars;
    })
    .catch((e) => {
      inFlight.delete(userId);
      throw e;
    });

  inFlight.set(userId, p);
  return p;
}

export function warmCarsCache(userId, cars) {
  if (!userId) return;
  carCache.set(userId, cars || []);
}

export function clearCarsCache(userId) {
  if (!userId) carCache.clear();
  else carCache.delete(userId);
}
