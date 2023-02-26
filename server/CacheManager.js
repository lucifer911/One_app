class CacheManager {
    Data = {}

    getEntry(key) {
        if (this.Data.hasOwnProperty(key)) {
            return this.Data[key]
        }
        return null
    }

    addEntry(key, val) {
        this.Data[key] = val
    }

    hasEntry(key) {
        return this.Data.hasOwnProperty(key)
    }
}


module.exports = CacheManager;