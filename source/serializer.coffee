Mapper = require './mapper'
Context = require './context'

isRef = (data) ->
  return false unless data? or data instanceof Object

  count = 0
  for key of data
    if ++count > 1 then return false

  unless key is '$' then return false

  return data.$

module.exports = class Serializer

  constructor: (@parentContext) ->
    return (data) =>
      context = new Context @parentContext
      @serialize data, new Context @parentContext
      data = @serialize data, context
      return @compact data, context

  serialize: (data, context) ->
    unless data? then return data # null or undefined
    if (type = typeof data) is 'function' then return undefined
    if (type is 'boolean') or (type is 'number') then return data

    [key, count] = context.add data
    if count > 1 then return $:key

    if (type is 'string') or (data instanceof RegExp)
      return $:[key, data]

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
    if (type is 'boolean') or (type is 'number') then return data

    unless (ref = isRef data) then return data
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
