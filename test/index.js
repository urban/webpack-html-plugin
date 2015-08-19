import test from 'blue-tape'

test('assert a string type', function (t) {
  // Amount of assertions we plan to run.
  // Will throw if count doesn't match.
  t.plan(2)

  const bar = 'foo'
  t.equal(typeof bar, 'string', 'assert `bar` type')

  const err = false
  t.ifError(err, 'should not be an error')
})

test('generates a default index.html file for a single entry point', (assert) => new Promise((resolve) => {

}))

test('allows custom HTML content for default template', function (t) {

})

test('allows custom HTML', function (t) {

})

test('allows custom output filename', function (t) {

})

test('allows multiple HTML files for a single entry', function (t) {

})

test('should work with the css extract text plugin', function (t) {

})

test('should allow to add cache hashes to assets', function (t) {

})

test('should append webpack public path to script src', function (t) {

})

test('allows subdirectories in webpack output bundles', function (t) {

})

test('allows subdirectories in webpack output bundles with public path', function (t) {

})

test('uses relative paths if in a subdirectory', function (t) {

})
