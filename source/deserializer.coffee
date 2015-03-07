Context = require './context/deserializer'

module.exports = class Deserializer
  @Context = Context

  constructor: (parentContext) ->
    @context = new Context parentContext

  deserialize: (data, context) ->
    context ||= @context

    unless data? then return data # null or undefined
    if typeof data in [ 'boolean', 'number', 'string', 'function' ]
      return data

    if data instanceof RegExp then return data

    if data instanceof Array
      result = []
      for item in data
        result.push @deserialize data, context
      return result

    if data instanceof Object
      if ref = context.ref data
        key = if ref instanceof Array then ref[0] else ref
        return (context.get key) or data

      result = {}
      for key, item of data
        result[key] = @deserialize item, context
      return result

    return data
