BaseContext = require './base'

module.exports = class DeserializerContext extends BaseContext
  constructor: (parentContext, data) ->
    super parentContext
    if arguments.length > 1
      @populate data
      @resolve()

  populate: (data) ->
    return data unless data?
    return data if typeof data in [ 'string', 'boolean', 'number' ]
    return data if data instanceof RegExp

    if data instanceof Array
      result = []
      for item in data
        result.push @populate item
      return result

    return data unless data instanceof Object

    if ref = @ref data
      return data unless ref instanceof Array
      [key, value] = ref

      if value instanceof Array
        result = []
        @put result, key
        for item in value
          result.push @populate item
        return result

      if value instanceof Object
        result = {}
        @put result, key
        for key, item of value
          result[key] = @populate item
        return result

    else
      result = {}
      for key, item of data
        result[key] = @populate item
      return result

  resolve: (data) ->
    if arguments.length is 0 then data = @items

    switch
      when not data? then return data
      when typeof data in [ 'string', 'boolean', 'number'] then return data
      when data instanceof RegExp then return data

      when data instanceof Array
        for item, i in data
          data[i] = @resolve item
        return data

      when data instanceof Object
        if (ref = @ref data) and typeof ref is 'string'
          item = @get ref
          return (@get ref) or data

        for key, item of data
          data[key] = @resolve item
        return data

    return data
