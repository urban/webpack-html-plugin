import test from 'tape'

test('assert a string type', function (t) {
  // Amount of assertions we plan to run.
  // Will throw if count doesn't match.
  t.plan(2)

  const bar = 'foo'
  t.equal(typeof bar, 'string', 'assert `bar` type')

  const err = false
  t.ifError(err, 'should not be an error')
})
