export default class DataManager {
  #data = {};

  add(key, value) {
    if (this.#data.hasOwnProperty(key)) {
      throw new Error(`Key already exists: ${key}. Use set to update the value.`);
    }

    this.set(key, value);
  }

  set(key, value) {
    this.#data = { ...this.#data, [key]: value };
  }

  get(key) {
    return this.#data[key];
  }

  clear(key) {
    const newData = { ...this.#data };

    delete newData[key];

    this.#data = newData;
  }

  clearAll() {
    this.#data = {};
  }
}