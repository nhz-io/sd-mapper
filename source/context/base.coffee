module.exports = class BaseContext
  constructor: (parent) ->
    @parent = null
    @root = this
    @items = []
    @keys = []
    @count = {}

    if parent
      @parent = parent
      @root = @parent.root

  ref: (data) ->
    return unless data? or data instanceof Object

    count = 0
    for key of data then return if ++count > 1
    unless key is '$' then return

    return data.$

  has: (data) ->
    return @keys[i] if -1 isnt i = @items.indexOf data
    return @parent?.has data

  get: (key) ->
    return @items[i] if -1 isnt i = @keys.indexOf key
    return @parent?.get key

  put: (data, key) ->
    @keys.push key
    @items.push data
    @count[key] = 1
    return [key, 1]

  add: (data) ->
    if key = @has data
      @count[key]++
    else
      key = Math.random().toString(36).substr 2
      @count[key] = 1
      @keys.push key
      @items.push data
    return [key, @count[key]]

  remove: (data) ->
    if key = @has data
      count = --@count[key]
      if count is 0
        i = @keys.indexOf key
        @keys.splice i, 1
        @items.splice i, 1
        delete @count[key]

      return [key, count]

