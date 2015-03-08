Serializer = require './serializer'
Deserializer = require './deserializer'
BaseContext = require './context/base'

module.exports =
  Serializer: Serializer
  Deserializer: Deserializer

  BaseContext: BaseContext
  SerializerContext: Serializer.Context
  DeserializerContext: Deserializer.Context

  serializer: (context) ->
    serializer = new Serializer context
    return (data) ->
      context = new Serializer.Context serializer.context
      data = serializer.serialize data, context
      return serializer.compact data, context

  deserializer: (context) ->
    deserializer = new Deserializer context
    return (data) ->
      context = new Deserializer.Context deserializer.context, data
      return deserializer.deserialize data, context
