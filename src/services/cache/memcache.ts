class MEM_CACHE {
  cache = new Map<string, string>();

  async set(key: string, value: string) {
    // console.log("SET", key, value);
    this.cache.set(key, value);
  }

  async get(key: string) {
    // console.log("GET", key);
    const val = this.cache.get(key);
    if (!val) {
      return undefined;
    }
    const valParsed = JSON.parse(val);
    if (
      valParsed.cacheTime + valParsed.cachePolicy.maxAge * 1000 <
      Date.now()
    ) {
      this.cache.delete(key);
      return undefined;
    }
    return this.cache.get(key);
  }

  async delete(key: string) {
    this.cache.delete(key);
  }

  processor = {
    set: this.set.bind(this),
    get: this.get.bind(this),
    delete: this.delete.bind(this),
  };
}

export const MEM_CACHE_INSTANCE = new MEM_CACHE();
