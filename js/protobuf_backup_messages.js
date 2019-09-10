/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

/**
 * BackupMode enum.
 * @exports BackupMode
 * @enum {string}
 * @property {number} PLAINTEXT=0 PLAINTEXT value
 */
$root.BackupMode = (function() {
    var valuesById = {}, values = Object.create(valuesById);
    values[valuesById[0] = "PLAINTEXT"] = 0;
    return values;
})();

$root.BackupMetaData = (function() {

    /**
     * Properties of a BackupMetaData.
     * @exports IBackupMetaData
     * @interface IBackupMetaData
     * @property {number|null} [timestamp] BackupMetaData timestamp
     * @property {string|null} [name] BackupMetaData name
     * @property {BackupMode|null} [mode] BackupMetaData mode
     */

    /**
     * Constructs a new BackupMetaData.
     * @exports BackupMetaData
     * @classdesc Represents a BackupMetaData.
     * @implements IBackupMetaData
     * @constructor
     * @param {IBackupMetaData=} [properties] Properties to set
     */
    function BackupMetaData(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * BackupMetaData timestamp.
     * @member {number} timestamp
     * @memberof BackupMetaData
     * @instance
     */
    BackupMetaData.prototype.timestamp = 0;

    /**
     * BackupMetaData name.
     * @member {string} name
     * @memberof BackupMetaData
     * @instance
     */
    BackupMetaData.prototype.name = "";

    /**
     * BackupMetaData mode.
     * @member {BackupMode} mode
     * @memberof BackupMetaData
     * @instance
     */
    BackupMetaData.prototype.mode = 0;

    /**
     * Creates a new BackupMetaData instance using the specified properties.
     * @function create
     * @memberof BackupMetaData
     * @static
     * @param {IBackupMetaData=} [properties] Properties to set
     * @returns {BackupMetaData} BackupMetaData instance
     */
    BackupMetaData.create = function create(properties) {
        return new BackupMetaData(properties);
    };

    /**
     * Encodes the specified BackupMetaData message. Does not implicitly {@link BackupMetaData.verify|verify} messages.
     * @function encode
     * @memberof BackupMetaData
     * @static
     * @param {IBackupMetaData} message BackupMetaData message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    BackupMetaData.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.timestamp != null && message.hasOwnProperty("timestamp"))
            writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.timestamp);
        if (message.name != null && message.hasOwnProperty("name"))
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.name);
        if (message.mode != null && message.hasOwnProperty("mode"))
            writer.uint32(/* id 3, wireType 0 =*/24).int32(message.mode);
        return writer;
    };

    /**
     * Encodes the specified BackupMetaData message, length delimited. Does not implicitly {@link BackupMetaData.verify|verify} messages.
     * @function encodeDelimited
     * @memberof BackupMetaData
     * @static
     * @param {IBackupMetaData} message BackupMetaData message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    BackupMetaData.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a BackupMetaData message from the specified reader or buffer.
     * @function decode
     * @memberof BackupMetaData
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {BackupMetaData} BackupMetaData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    BackupMetaData.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.BackupMetaData();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.timestamp = reader.uint32();
                break;
            case 2:
                message.name = reader.string();
                break;
            case 3:
                message.mode = reader.int32();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a BackupMetaData message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof BackupMetaData
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {BackupMetaData} BackupMetaData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    BackupMetaData.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a BackupMetaData message.
     * @function verify
     * @memberof BackupMetaData
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    BackupMetaData.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.timestamp != null && message.hasOwnProperty("timestamp"))
            if (!$util.isInteger(message.timestamp))
                return "timestamp: integer expected";
        if (message.name != null && message.hasOwnProperty("name"))
            if (!$util.isString(message.name))
                return "name: string expected";
        if (message.mode != null && message.hasOwnProperty("mode"))
            switch (message.mode) {
            default:
                return "mode: enum value expected";
            case 0:
                break;
            }
        return null;
    };

    /**
     * Creates a BackupMetaData message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof BackupMetaData
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {BackupMetaData} BackupMetaData
     */
    BackupMetaData.fromObject = function fromObject(object) {
        if (object instanceof $root.BackupMetaData)
            return object;
        var message = new $root.BackupMetaData();
        if (object.timestamp != null)
            message.timestamp = object.timestamp >>> 0;
        if (object.name != null)
            message.name = String(object.name);
        switch (object.mode) {
        case "PLAINTEXT":
        case 0:
            message.mode = 0;
            break;
        }
        return message;
    };

    /**
     * Creates a plain object from a BackupMetaData message. Also converts values to other types if specified.
     * @function toObject
     * @memberof BackupMetaData
     * @static
     * @param {BackupMetaData} message BackupMetaData
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    BackupMetaData.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.timestamp = 0;
            object.name = "";
            object.mode = options.enums === String ? "PLAINTEXT" : 0;
        }
        if (message.timestamp != null && message.hasOwnProperty("timestamp"))
            object.timestamp = message.timestamp;
        if (message.name != null && message.hasOwnProperty("name"))
            object.name = message.name;
        if (message.mode != null && message.hasOwnProperty("mode"))
            object.mode = options.enums === String ? $root.BackupMode[message.mode] : message.mode;
        return object;
    };

    /**
     * Converts this BackupMetaData to JSON.
     * @function toJSON
     * @memberof BackupMetaData
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    BackupMetaData.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return BackupMetaData;
})();

$root.BackupData = (function() {

    /**
     * Properties of a BackupData.
     * @exports IBackupData
     * @interface IBackupData
     * @property {number|null} [seedLength] BackupData seedLength
     * @property {Uint8Array|null} [seed] BackupData seed
     * @property {number|null} [birthdate] BackupData birthdate
     * @property {string|null} [generator] BackupData generator
     */

    /**
     * Constructs a new BackupData.
     * @exports BackupData
     * @classdesc BackupData is encoded in the data field of the BackupContent
     * and depends on the BackupMode.
     * Defining it as a protobuf message allows language/architecture independent
     * encoding/decoding.
     * @implements IBackupData
     * @constructor
     * @param {IBackupData=} [properties] Properties to set
     */
    function BackupData(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * BackupData seedLength.
     * @member {number} seedLength
     * @memberof BackupData
     * @instance
     */
    BackupData.prototype.seedLength = 0;

    /**
     * BackupData seed.
     * @member {Uint8Array} seed
     * @memberof BackupData
     * @instance
     */
    BackupData.prototype.seed = $util.newBuffer([]);

    /**
     * BackupData birthdate.
     * @member {number} birthdate
     * @memberof BackupData
     * @instance
     */
    BackupData.prototype.birthdate = 0;

    /**
     * BackupData generator.
     * @member {string} generator
     * @memberof BackupData
     * @instance
     */
    BackupData.prototype.generator = "";

    /**
     * Creates a new BackupData instance using the specified properties.
     * @function create
     * @memberof BackupData
     * @static
     * @param {IBackupData=} [properties] Properties to set
     * @returns {BackupData} BackupData instance
     */
    BackupData.create = function create(properties) {
        return new BackupData(properties);
    };

    /**
     * Encodes the specified BackupData message. Does not implicitly {@link BackupData.verify|verify} messages.
     * @function encode
     * @memberof BackupData
     * @static
     * @param {IBackupData} message BackupData message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    BackupData.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.seedLength != null && message.hasOwnProperty("seedLength"))
            writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.seedLength);
        if (message.seed != null && message.hasOwnProperty("seed"))
            writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.seed);
        if (message.birthdate != null && message.hasOwnProperty("birthdate"))
            writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.birthdate);
        if (message.generator != null && message.hasOwnProperty("generator"))
            writer.uint32(/* id 4, wireType 2 =*/34).string(message.generator);
        return writer;
    };

    /**
     * Encodes the specified BackupData message, length delimited. Does not implicitly {@link BackupData.verify|verify} messages.
     * @function encodeDelimited
     * @memberof BackupData
     * @static
     * @param {IBackupData} message BackupData message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    BackupData.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a BackupData message from the specified reader or buffer.
     * @function decode
     * @memberof BackupData
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {BackupData} BackupData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    BackupData.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.BackupData();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.seedLength = reader.uint32();
                break;
            case 2:
                message.seed = reader.bytes();
                break;
            case 3:
                message.birthdate = reader.uint32();
                break;
            case 4:
                message.generator = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a BackupData message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof BackupData
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {BackupData} BackupData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    BackupData.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a BackupData message.
     * @function verify
     * @memberof BackupData
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    BackupData.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.seedLength != null && message.hasOwnProperty("seedLength"))
            if (!$util.isInteger(message.seedLength))
                return "seedLength: integer expected";
        if (message.seed != null && message.hasOwnProperty("seed"))
            if (!(message.seed && typeof message.seed.length === "number" || $util.isString(message.seed)))
                return "seed: buffer expected";
        if (message.birthdate != null && message.hasOwnProperty("birthdate"))
            if (!$util.isInteger(message.birthdate))
                return "birthdate: integer expected";
        if (message.generator != null && message.hasOwnProperty("generator"))
            if (!$util.isString(message.generator))
                return "generator: string expected";
        return null;
    };

    /**
     * Creates a BackupData message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof BackupData
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {BackupData} BackupData
     */
    BackupData.fromObject = function fromObject(object) {
        if (object instanceof $root.BackupData)
            return object;
        var message = new $root.BackupData();
        if (object.seedLength != null)
            message.seedLength = object.seedLength >>> 0;
        if (object.seed != null)
            if (typeof object.seed === "string")
                $util.base64.decode(object.seed, message.seed = $util.newBuffer($util.base64.length(object.seed)), 0);
            else if (object.seed.length)
                message.seed = object.seed;
        if (object.birthdate != null)
            message.birthdate = object.birthdate >>> 0;
        if (object.generator != null)
            message.generator = String(object.generator);
        return message;
    };

    /**
     * Creates a plain object from a BackupData message. Also converts values to other types if specified.
     * @function toObject
     * @memberof BackupData
     * @static
     * @param {BackupData} message BackupData
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    BackupData.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.seedLength = 0;
            if (options.bytes === String)
                object.seed = "";
            else {
                object.seed = [];
                if (options.bytes !== Array)
                    object.seed = $util.newBuffer(object.seed);
            }
            object.birthdate = 0;
            object.generator = "";
        }
        if (message.seedLength != null && message.hasOwnProperty("seedLength"))
            object.seedLength = message.seedLength;
        if (message.seed != null && message.hasOwnProperty("seed"))
            object.seed = options.bytes === String ? $util.base64.encode(message.seed, 0, message.seed.length) : options.bytes === Array ? Array.prototype.slice.call(message.seed) : message.seed;
        if (message.birthdate != null && message.hasOwnProperty("birthdate"))
            object.birthdate = message.birthdate;
        if (message.generator != null && message.hasOwnProperty("generator"))
            object.generator = message.generator;
        return object;
    };

    /**
     * Converts this BackupData to JSON.
     * @function toJSON
     * @memberof BackupData
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    BackupData.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return BackupData;
})();

$root.BackupContent = (function() {

    /**
     * Properties of a BackupContent.
     * @exports IBackupContent
     * @interface IBackupContent
     * @property {Uint8Array|null} [checksum] BackupContent checksum
     * @property {IBackupMetaData|null} [metadata] BackupContent metadata
     * @property {number|null} [length] BackupContent length
     * @property {Uint8Array|null} [data] BackupContent data
     */

    /**
     * Constructs a new BackupContent.
     * @exports BackupContent
     * @classdesc Represents a BackupContent.
     * @implements IBackupContent
     * @constructor
     * @param {IBackupContent=} [properties] Properties to set
     */
    function BackupContent(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * BackupContent checksum.
     * @member {Uint8Array} checksum
     * @memberof BackupContent
     * @instance
     */
    BackupContent.prototype.checksum = $util.newBuffer([]);

    /**
     * BackupContent metadata.
     * @member {IBackupMetaData|null|undefined} metadata
     * @memberof BackupContent
     * @instance
     */
    BackupContent.prototype.metadata = null;

    /**
     * BackupContent length.
     * @member {number} length
     * @memberof BackupContent
     * @instance
     */
    BackupContent.prototype.length = 0;

    /**
     * BackupContent data.
     * @member {Uint8Array} data
     * @memberof BackupContent
     * @instance
     */
    BackupContent.prototype.data = $util.newBuffer([]);

    /**
     * Creates a new BackupContent instance using the specified properties.
     * @function create
     * @memberof BackupContent
     * @static
     * @param {IBackupContent=} [properties] Properties to set
     * @returns {BackupContent} BackupContent instance
     */
    BackupContent.create = function create(properties) {
        return new BackupContent(properties);
    };

    /**
     * Encodes the specified BackupContent message. Does not implicitly {@link BackupContent.verify|verify} messages.
     * @function encode
     * @memberof BackupContent
     * @static
     * @param {IBackupContent} message BackupContent message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    BackupContent.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.checksum != null && message.hasOwnProperty("checksum"))
            writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.checksum);
        if (message.metadata != null && message.hasOwnProperty("metadata"))
            $root.BackupMetaData.encode(message.metadata, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
        if (message.length != null && message.hasOwnProperty("length"))
            writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.length);
        if (message.data != null && message.hasOwnProperty("data"))
            writer.uint32(/* id 4, wireType 2 =*/34).bytes(message.data);
        return writer;
    };

    /**
     * Encodes the specified BackupContent message, length delimited. Does not implicitly {@link BackupContent.verify|verify} messages.
     * @function encodeDelimited
     * @memberof BackupContent
     * @static
     * @param {IBackupContent} message BackupContent message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    BackupContent.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a BackupContent message from the specified reader or buffer.
     * @function decode
     * @memberof BackupContent
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {BackupContent} BackupContent
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    BackupContent.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.BackupContent();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.checksum = reader.bytes();
                break;
            case 2:
                message.metadata = $root.BackupMetaData.decode(reader, reader.uint32());
                break;
            case 3:
                message.length = reader.uint32();
                break;
            case 4:
                message.data = reader.bytes();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a BackupContent message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof BackupContent
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {BackupContent} BackupContent
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    BackupContent.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a BackupContent message.
     * @function verify
     * @memberof BackupContent
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    BackupContent.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.checksum != null && message.hasOwnProperty("checksum"))
            if (!(message.checksum && typeof message.checksum.length === "number" || $util.isString(message.checksum)))
                return "checksum: buffer expected";
        if (message.metadata != null && message.hasOwnProperty("metadata")) {
            var error = $root.BackupMetaData.verify(message.metadata);
            if (error)
                return "metadata." + error;
        }
        if (message.length != null && message.hasOwnProperty("length"))
            if (!$util.isInteger(message.length))
                return "length: integer expected";
        if (message.data != null && message.hasOwnProperty("data"))
            if (!(message.data && typeof message.data.length === "number" || $util.isString(message.data)))
                return "data: buffer expected";
        return null;
    };

    /**
     * Creates a BackupContent message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof BackupContent
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {BackupContent} BackupContent
     */
    BackupContent.fromObject = function fromObject(object) {
        if (object instanceof $root.BackupContent)
            return object;
        var message = new $root.BackupContent();
        if (object.checksum != null)
            if (typeof object.checksum === "string")
                $util.base64.decode(object.checksum, message.checksum = $util.newBuffer($util.base64.length(object.checksum)), 0);
            else if (object.checksum.length)
                message.checksum = object.checksum;
        if (object.metadata != null) {
            if (typeof object.metadata !== "object")
                throw TypeError(".BackupContent.metadata: object expected");
            message.metadata = $root.BackupMetaData.fromObject(object.metadata);
        }
        if (object.length != null)
            message.length = object.length >>> 0;
        if (object.data != null)
            if (typeof object.data === "string")
                $util.base64.decode(object.data, message.data = $util.newBuffer($util.base64.length(object.data)), 0);
            else if (object.data.length)
                message.data = object.data;
        return message;
    };

    /**
     * Creates a plain object from a BackupContent message. Also converts values to other types if specified.
     * @function toObject
     * @memberof BackupContent
     * @static
     * @param {BackupContent} message BackupContent
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    BackupContent.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            if (options.bytes === String)
                object.checksum = "";
            else {
                object.checksum = [];
                if (options.bytes !== Array)
                    object.checksum = $util.newBuffer(object.checksum);
            }
            object.metadata = null;
            object.length = 0;
            if (options.bytes === String)
                object.data = "";
            else {
                object.data = [];
                if (options.bytes !== Array)
                    object.data = $util.newBuffer(object.data);
            }
        }
        if (message.checksum != null && message.hasOwnProperty("checksum"))
            object.checksum = options.bytes === String ? $util.base64.encode(message.checksum, 0, message.checksum.length) : options.bytes === Array ? Array.prototype.slice.call(message.checksum) : message.checksum;
        if (message.metadata != null && message.hasOwnProperty("metadata"))
            object.metadata = $root.BackupMetaData.toObject(message.metadata, options);
        if (message.length != null && message.hasOwnProperty("length"))
            object.length = message.length;
        if (message.data != null && message.hasOwnProperty("data"))
            object.data = options.bytes === String ? $util.base64.encode(message.data, 0, message.data.length) : options.bytes === Array ? Array.prototype.slice.call(message.data) : message.data;
        return object;
    };

    /**
     * Converts this BackupContent to JSON.
     * @function toJSON
     * @memberof BackupContent
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    BackupContent.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return BackupContent;
})();

$root.BackupV1 = (function() {

    /**
     * Properties of a BackupV1.
     * @exports IBackupV1
     * @interface IBackupV1
     * @property {IBackupContent|null} [content] BackupV1 content
     */

    /**
     * Constructs a new BackupV1.
     * @exports BackupV1
     * @classdesc Represents a BackupV1.
     * @implements IBackupV1
     * @constructor
     * @param {IBackupV1=} [properties] Properties to set
     */
    function BackupV1(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * BackupV1 content.
     * @member {IBackupContent|null|undefined} content
     * @memberof BackupV1
     * @instance
     */
    BackupV1.prototype.content = null;

    /**
     * Creates a new BackupV1 instance using the specified properties.
     * @function create
     * @memberof BackupV1
     * @static
     * @param {IBackupV1=} [properties] Properties to set
     * @returns {BackupV1} BackupV1 instance
     */
    BackupV1.create = function create(properties) {
        return new BackupV1(properties);
    };

    /**
     * Encodes the specified BackupV1 message. Does not implicitly {@link BackupV1.verify|verify} messages.
     * @function encode
     * @memberof BackupV1
     * @static
     * @param {IBackupV1} message BackupV1 message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    BackupV1.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.content != null && message.hasOwnProperty("content"))
            $root.BackupContent.encode(message.content, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified BackupV1 message, length delimited. Does not implicitly {@link BackupV1.verify|verify} messages.
     * @function encodeDelimited
     * @memberof BackupV1
     * @static
     * @param {IBackupV1} message BackupV1 message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    BackupV1.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a BackupV1 message from the specified reader or buffer.
     * @function decode
     * @memberof BackupV1
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {BackupV1} BackupV1
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    BackupV1.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.BackupV1();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.content = $root.BackupContent.decode(reader, reader.uint32());
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a BackupV1 message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof BackupV1
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {BackupV1} BackupV1
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    BackupV1.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a BackupV1 message.
     * @function verify
     * @memberof BackupV1
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    BackupV1.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.content != null && message.hasOwnProperty("content")) {
            var error = $root.BackupContent.verify(message.content);
            if (error)
                return "content." + error;
        }
        return null;
    };

    /**
     * Creates a BackupV1 message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof BackupV1
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {BackupV1} BackupV1
     */
    BackupV1.fromObject = function fromObject(object) {
        if (object instanceof $root.BackupV1)
            return object;
        var message = new $root.BackupV1();
        if (object.content != null) {
            if (typeof object.content !== "object")
                throw TypeError(".BackupV1.content: object expected");
            message.content = $root.BackupContent.fromObject(object.content);
        }
        return message;
    };

    /**
     * Creates a plain object from a BackupV1 message. Also converts values to other types if specified.
     * @function toObject
     * @memberof BackupV1
     * @static
     * @param {BackupV1} message BackupV1
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    BackupV1.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults)
            object.content = null;
        if (message.content != null && message.hasOwnProperty("content"))
            object.content = $root.BackupContent.toObject(message.content, options);
        return object;
    };

    /**
     * Converts this BackupV1 to JSON.
     * @function toJSON
     * @memberof BackupV1
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    BackupV1.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return BackupV1;
})();

$root.Backup = (function() {

    /**
     * Properties of a Backup.
     * @exports IBackup
     * @interface IBackup
     * @property {IBackupV1|null} [backupV1] Backup backupV1
     */

    /**
     * Constructs a new Backup.
     * @exports Backup
     * @classdesc Represents a Backup.
     * @implements IBackup
     * @constructor
     * @param {IBackup=} [properties] Properties to set
     */
    function Backup(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Backup backupV1.
     * @member {IBackupV1|null|undefined} backupV1
     * @memberof Backup
     * @instance
     */
    Backup.prototype.backupV1 = null;

    // OneOf field names bound to virtual getters and setters
    var $oneOfFields;

    /**
     * Backup backupVersion.
     * @member {"backupV1"|undefined} backupVersion
     * @memberof Backup
     * @instance
     */
    Object.defineProperty(Backup.prototype, "backupVersion", {
        get: $util.oneOfGetter($oneOfFields = ["backupV1"]),
        set: $util.oneOfSetter($oneOfFields)
    });

    /**
     * Creates a new Backup instance using the specified properties.
     * @function create
     * @memberof Backup
     * @static
     * @param {IBackup=} [properties] Properties to set
     * @returns {Backup} Backup instance
     */
    Backup.create = function create(properties) {
        return new Backup(properties);
    };

    /**
     * Encodes the specified Backup message. Does not implicitly {@link Backup.verify|verify} messages.
     * @function encode
     * @memberof Backup
     * @static
     * @param {IBackup} message Backup message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Backup.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.backupV1 != null && message.hasOwnProperty("backupV1"))
            $root.BackupV1.encode(message.backupV1, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified Backup message, length delimited. Does not implicitly {@link Backup.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Backup
     * @static
     * @param {IBackup} message Backup message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Backup.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a Backup message from the specified reader or buffer.
     * @function decode
     * @memberof Backup
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Backup} Backup
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Backup.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Backup();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.backupV1 = $root.BackupV1.decode(reader, reader.uint32());
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a Backup message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Backup
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Backup} Backup
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Backup.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a Backup message.
     * @function verify
     * @memberof Backup
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Backup.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        var properties = {};
        if (message.backupV1 != null && message.hasOwnProperty("backupV1")) {
            properties.backupVersion = 1;
            {
                var error = $root.BackupV1.verify(message.backupV1);
                if (error)
                    return "backupV1." + error;
            }
        }
        return null;
    };

    /**
     * Creates a Backup message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Backup
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Backup} Backup
     */
    Backup.fromObject = function fromObject(object) {
        if (object instanceof $root.Backup)
            return object;
        var message = new $root.Backup();
        if (object.backupV1 != null) {
            if (typeof object.backupV1 !== "object")
                throw TypeError(".Backup.backupV1: object expected");
            message.backupV1 = $root.BackupV1.fromObject(object.backupV1);
        }
        return message;
    };

    /**
     * Creates a plain object from a Backup message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Backup
     * @static
     * @param {Backup} message Backup
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Backup.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (message.backupV1 != null && message.hasOwnProperty("backupV1")) {
            object.backupV1 = $root.BackupV1.toObject(message.backupV1, options);
            if (options.oneofs)
                object.backupVersion = "backupV1";
        }
        return object;
    };

    /**
     * Converts this Backup to JSON.
     * @function toJSON
     * @memberof Backup
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Backup.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return Backup;
})();

module.exports = $root;
