module.exports = class Context
  constructor: (parent) ->
    @parent = null
    @root = this
    @items = []
    @keys = []
    @count = {}

    if parent instanceof Context
      @parent = parent
      @root = @parent.root

  has: (data) ->
    return @keys[i] if -1 isnt i = @items.indexOf data
    return @parent?.has data

  get: (key) -> return @items[i] if -1 isnt i = @keys.indexOf key

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
