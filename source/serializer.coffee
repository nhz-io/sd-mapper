Context = require './context/serializer'

module.exports = class Serializer
  @Context = Context

  constructor: (parentContext) -> @context = new Context parentContext

  serialize: (data, context) ->
    unless data? then return data # null or undefined
    if (type = typeof data) is 'function' then return undefined
    if type in [ 'string', 'boolean', 'number' ] then return data
    if data instanceof RegExp then return data

    [key, count] = context.add data
    if count > 1 then return $:key

    if data instanceof Array
      result = []
      for item in data
        if item instanceof Function then continue
        result.push @serialize item, context
      return $:[key, result]

    if data instanceof Object
      result = {}
      for _key, item of data
        if item instanceof Function then continue
        result[_key] = @serialize item, context
      return $:[key, result]

    return undefined

  compact: (data, context) ->

    unless data? then return data # null or undefined
    if (type = typeof data) is 'function' then return undefined
    if type in [ 'string', 'boolean', 'number' ] then return data
    if data instanceof RegExp then return data

    unless (ref = context.ref data) then return data
    unless ref instanceof Array then return data

    [key, value] = ref
    count = context.count[key] or 1

    result = if count is 1 then value else data

    switch
      when typeof value is 'string' then return result

      when value instanceof Array
        for item, i in value
          value[i] = @compact item, context

      when value instanceof Object
        for key, item of value
          value[key] = @compact item, context

    return result
