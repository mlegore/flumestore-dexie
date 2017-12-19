var Dexie = require('dexie')

var Store = function (opts) {
  return function (name, version) {
    if (Dexie.default)
      Dexie = Dexie.default

    var db = new Dexie(opts.keyValueDB || 'flumedb')
    db.version(version).stores({ [name]: 'key' });
    var store = db[name]

    return {
      get (key) {
        return store.get(key)
          .then(value => {
            if (value) {
              return value.value
            }
            return null
          })
      },
      set (key, value) {
        return store.put({key, value: value})
          .then(val => {
            return val.value
          })
      },
      bulkSet (values) {
        if (values.every(item => item.key && item.value)) {
          throw new Error('All items must have a key and value property')
        }

        return store.bulkPut(values)
      }
    }
  }
}

module.exports.plugin = {
  version: '1.0.0',
  name: 'ssb-flumestore-dexie',
  manifest: {},
  init: function (ssb, config) {
    ssb.flumeUseOptions({
      KeyValueStore: Store(config)
    })

    return {}
  }
}

module.exports.store = Store
