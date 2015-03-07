Serializer = require './serializer'
Deserializer = require './deserializer'

module.exports =
  Serializer: (context) ->
    serializer = new Serializer context
    return (data) ->
      context = new Serializer.Context serializer.context
      data = serializer.serialize data, context
      return serializer.compact data, context

  Deserializer: (context) ->
    deserializer = new Deserializer context
    return (data) ->
      context = new Deserializer.Context deserializer.context, data
      return deserializer.deserialize data, context
