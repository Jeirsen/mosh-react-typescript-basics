import apiClient from "./api-client";

interface Entity {
  id: number;
}

class HttpsService {
  constructor(public endpoint: string) {}

  getAll<T>() {
    const controller = new AbortController();
    const request = apiClient.get<T[]>(this.endpoint, {
      signal: controller.signal,
    });
    return { request, cancel: () => controller.abort() };
  }

  delete(id: number) {
    return apiClient.delete(`${this.endpoint}/${id}`);
  }

  craete<T>(entity: T) {
    return apiClient.post(this.endpoint, entity);
  }

  update<T extends Entity>(entity: T) {
    return apiClient.patch(`${this.endpoint}/${entity.id}`, entity);
  }
}

const create = (endpoint: string) => new HttpsService(endpoint);

export default create;
