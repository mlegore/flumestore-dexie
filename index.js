var Dexie = require('dexie')

var Store = function (opts) {
  function (name, version) {
    if (Dexie.default)
        Dexie = Dexie.default

    var db = new Dexie(opts.keyValueDB || 'flumedb')
    db.version(version).stores({ [name]: '++key' });

    return {
      get (cb) {
        return b.state.get(key)
        .then(value => {
          if (value)
            return cb(null, value.value)
          cb(value)
        }, err => {
          cb(err)
        })
      },
      set (key, value, cb) {
        return b.state.put({key, value: value})
        .then(val => {
          cb(null, val)
        }, err => {
          cb(err)
        })
      }
    }
  }
}

module.exports.plugin = {
  version: '1.0.0',
  name: 'ssb-flumestore-dexie',
  manifest: {},
  init: function (ssb, config) {
    ssb._flumeUseOptions({
      KeyValueStore: Store(config)
    })

    return {
      // merge in replacement for createLogStream
      createLogStream
    }
  }
}

module.exports.store = Store
