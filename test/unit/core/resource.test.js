/* global Resource:true */
import {assert} from 'chai'

let isBrowser = false

try {
  isBrowser = !!window
} catch (e) {
}

const defaults = {
  autoInject: isBrowser,
  bypassCache: false,
  csp: false,
  defaultAdapter: 'http',
  eagerEject: false,
  idAttribute: 'id',
  linkRelations: isBrowser,
  relationsEnumerable: false,
  returnMeta: false,
  strategy: 'single',
  useFilter: true
}

export function init () {
  describe('Resource', function () {
    it('should be a constructor function', function () {
      assert.isFunction(Resource, 'should be a function')
      let instance = new Resource()
      assert.isTrue(instance instanceof Resource, 'instance should be an instance')
      instance = new Resource({ foo: 'bar' })
      assert.deepEqual(instance, { foo: 'bar' }, 'instance should get initialization properties')
    })
    it('should have the correct static defaults', function () {
      for (var key in defaults) {
        assert.equal(Resource[key], defaults[key], key + ' should be ' + defaults[key])
      }
    })
    it('child should inherit static defaults', function () {
      let Child = Resource.extend()
      for (var key in defaults) {
        assert.equal(Child[key], defaults[key], key + ' should be ' + defaults[key])
      }
      class Child2 extends Resource {}
      for (var key in defaults) {
        assert.equal(Child2[key], defaults[key], key + ' should be ' + defaults[key])
      }
    })
    it('child should override static defaults', function () {
      /////////////////////////////////////////
      // ES5 ways of creating a new Resource //
      /////////////////////////////////////////
      let Child = Resource.extend({}, {
        idAttribute: '_id'
      })

      // Not yet implemented in v3
      // let Child2 = store.defineResource({
      //   idAttribute: '_id'
      // })

      /////////////////////////////////////////
      // ES6 ways of creating a new Resource //
      /////////////////////////////////////////
      class Child3 extends Resource {}
      configure({
        idAttribute: '_id'
      })(Child3)

      class Child4 extends Resource {}
      Child4.configure({
        idAttribute: '_id'
      })

      /////////////////////////////////////////
      // ES7 ways of creating a new Resource //
      /////////////////////////////////////////
      class Child5 extends Resource {
        static idAttribute = '_id'
      }

      // Doesn't work right now because of https://github.com/babel/babel/issues/2645
      // @configure({
      //   idAttribute: '_id'
      // })
      // class Child6 extends Resource {}

      check(Child)
      // check(Child2)
      check(Child3)
      check(Child4)
      check(Child5)
      // check(Child6)

      function check (Class) {
        for (var key in defaults) {
          if (key === 'idAttribute') {
            assert.equal(Class.idAttribute, '_id', 'should be "_id"')
          } else {
            assert.equal(Class[key], defaults[key], key + ' should be ' + defaults[key])
          }
        }
      }
    })
  })
}