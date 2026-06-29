import { httpClient } from "./httpClient";

function entity(collection) {
  return {
    list: filters => {
      const params = new URLSearchParams(filters || {});
      const query = params.toString();
      return httpClient.get(`/${collection}${query ? `?${query}` : ""}`);
    },
    getSchema: () => httpClient.get(`/${collection}/schema`),
    create: data => httpClient.post(`/${collection}`, data),
    update: (id, data) => httpClient.patch(`/${collection}/${id}`, data),
    delete: id => httpClient.delete(`/${collection}/${id}`)
  };
}

export const entities = {
  pc: entity("pc"),
  game: entity("game"),
  product: entity("product"),
  reservation: entity("reservation"),
  transaction: entity("transaction"),
  foodOrder: entity("food-order"),
  tournament: entity("tournament"),
  tournamentRegistration: entity("tournament-registration"),
  userProfile: entity("user-profile")
};

export const listSchemas = () => httpClient.get("/schemas");
