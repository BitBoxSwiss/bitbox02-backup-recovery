(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (Buffer){(function (){
// SPDX-License-Identifier: Apache-2.0

const { sha256 } = require('@noble/hashes/sha256');

function uint32LE(value) {
    const bytes = Buffer.alloc(4);
    bytes.writeUInt32LE(value);
    return bytes;
}

function hasValidChecksum(content, data) {
    const metadata = content.metadata;
    if (!metadata || content.checksum.length !== 32 || data.seed.length !== 32) {
        return false;
    }
    const name = Buffer.from(metadata.name, 'utf8');
    const generator = Buffer.from(data.generator, 'utf8');
    if (name.length > 64 || generator.length > 20) {
        return false;
    }
    const paddedName = Buffer.alloc(64);
    name.copy(paddedName);
    const paddedGenerator = Buffer.alloc(20);
    generator.copy(paddedGenerator);

    // Match backup.rs::compute_checksum, including the fixed-size padded seed and
    // the obsolete length field. This is not a hash of the protobuf serialization.
    const checksum = sha256.create()
        .update(uint32LE(metadata.timestamp))
        .update(Uint8Array.of(metadata.mode & 0xff))
        .update(paddedName)
        .update(uint32LE(data.seedLength))
        .update(data.seed)
        .update(uint32LE(data.birthdate))
        .update(paddedGenerator)
        .update(uint32LE(content.length))
        .digest();
    return checksum.every((byte, i) => byte === content.checksum[i]);
}

module.exports = hasValidChecksum;

}).call(this)}).call(this,require("buffer").Buffer)
},{"@noble/hashes/sha256":10,"buffer":33}],2:[function(require,module,exports){
// Copyright 2019 Shift Cryptosecurity AG
// Copyright 2023 Shift Crypto AG
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

const Protobuf = require('./protobuf_backup_messages');
const bip39 = require('bip39');
const hasValidChecksum = require('./checksum');

const Backup = Protobuf.Backup;
const BackupData = Protobuf.BackupData;

function deserializeThis(messageBytes) {
    const backup = Backup.decode(new Uint8Array(messageBytes));
    const content = backup.backupV1.content;
    const backupData = BackupData.decode(new Uint8Array(content.data));
    const seedwords = bip39.entropyToMnemonic(backupData.seed.subarray(0, backupData.seedLength));
    const backupname = content.metadata ? content.metadata.name : '';
    // A damaged checksum or metadata must not prevent recovery of an intact seed.
    document.getElementById("backup-warning").hidden = hasValidChecksum(content, backupData);
    document.getElementById("backup-bip39").value = seedwords;
    const date = new Date(backupData.birthdate * 1000)
    document.getElementById("seed-timestamp").innerText = date;
    document.getElementById("firmware-version").innerText = backupData.generator;
    document.getElementById("backup-name").innerText = backupname;
}

document.getElementById("the-file-input").addEventListener("input", function () {
    // get the file instance. The file has a blob prototype that can be read
    const file = this.files[0];

    // test reading as array buffer
    const fileReader = new FileReader();
    fileReader.onloadend = function (event) {
        deserializeThis(event.target.result);
    }
    fileReader.readAsArrayBuffer(file);
});

},{"./checksum":1,"./protobuf_backup_messages":3,"bip39":22}],3:[function(require,module,exports){
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
 * @enum {number}
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
        if (message.timestamp != null && Object.hasOwnProperty.call(message, "timestamp"))
            writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.timestamp);
        if (message.name != null && Object.hasOwnProperty.call(message, "name"))
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.name);
        if (message.mode != null && Object.hasOwnProperty.call(message, "mode"))
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
            case 1: {
                    message.timestamp = reader.uint32();
                    break;
                }
            case 2: {
                    message.name = reader.string();
                    break;
                }
            case 3: {
                    message.mode = reader.int32();
                    break;
                }
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
        default:
            if (typeof object.mode === "number") {
                message.mode = object.mode;
                break;
            }
            break;
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
            object.mode = options.enums === String ? $root.BackupMode[message.mode] === undefined ? message.mode : $root.BackupMode[message.mode] : message.mode;
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

    /**
     * Gets the default type url for BackupMetaData
     * @function getTypeUrl
     * @memberof BackupMetaData
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    BackupMetaData.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/BackupMetaData";
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
        if (message.seedLength != null && Object.hasOwnProperty.call(message, "seedLength"))
            writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.seedLength);
        if (message.seed != null && Object.hasOwnProperty.call(message, "seed"))
            writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.seed);
        if (message.birthdate != null && Object.hasOwnProperty.call(message, "birthdate"))
            writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.birthdate);
        if (message.generator != null && Object.hasOwnProperty.call(message, "generator"))
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
            case 1: {
                    message.seedLength = reader.uint32();
                    break;
                }
            case 2: {
                    message.seed = reader.bytes();
                    break;
                }
            case 3: {
                    message.birthdate = reader.uint32();
                    break;
                }
            case 4: {
                    message.generator = reader.string();
                    break;
                }
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
            else if (object.seed.length >= 0)
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

    /**
     * Gets the default type url for BackupData
     * @function getTypeUrl
     * @memberof BackupData
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    BackupData.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/BackupData";
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
        if (message.checksum != null && Object.hasOwnProperty.call(message, "checksum"))
            writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.checksum);
        if (message.metadata != null && Object.hasOwnProperty.call(message, "metadata"))
            $root.BackupMetaData.encode(message.metadata, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
        if (message.length != null && Object.hasOwnProperty.call(message, "length"))
            writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.length);
        if (message.data != null && Object.hasOwnProperty.call(message, "data"))
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
            case 1: {
                    message.checksum = reader.bytes();
                    break;
                }
            case 2: {
                    message.metadata = $root.BackupMetaData.decode(reader, reader.uint32());
                    break;
                }
            case 3: {
                    message.length = reader.uint32();
                    break;
                }
            case 4: {
                    message.data = reader.bytes();
                    break;
                }
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
            else if (object.checksum.length >= 0)
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
            else if (object.data.length >= 0)
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

    /**
     * Gets the default type url for BackupContent
     * @function getTypeUrl
     * @memberof BackupContent
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    BackupContent.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/BackupContent";
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
        if (message.content != null && Object.hasOwnProperty.call(message, "content"))
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
            case 1: {
                    message.content = $root.BackupContent.decode(reader, reader.uint32());
                    break;
                }
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

    /**
     * Gets the default type url for BackupV1
     * @function getTypeUrl
     * @memberof BackupV1
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    BackupV1.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/BackupV1";
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
        if (message.backupV1 != null && Object.hasOwnProperty.call(message, "backupV1"))
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
            case 1: {
                    message.backupV1 = $root.BackupV1.decode(reader, reader.uint32());
                    break;
                }
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

    /**
     * Gets the default type url for Backup
     * @function getTypeUrl
     * @memberof Backup
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    Backup.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/Backup";
    };

    return Backup;
})();

module.exports = $root;

},{"protobufjs/minimal":35}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.output = exports.exists = exports.hash = exports.bytes = exports.bool = exports.number = void 0;
function number(n) {
    if (!Number.isSafeInteger(n) || n < 0)
        throw new Error(`Wrong positive integer: ${n}`);
}
exports.number = number;
function bool(b) {
    if (typeof b !== 'boolean')
        throw new Error(`Expected boolean, not ${b}`);
}
exports.bool = bool;
function bytes(b, ...lengths) {
    if (!(b instanceof Uint8Array))
        throw new Error('Expected Uint8Array');
    if (lengths.length > 0 && !lengths.includes(b.length))
        throw new Error(`Expected Uint8Array of length ${lengths}, not of length=${b.length}`);
}
exports.bytes = bytes;
function hash(hash) {
    if (typeof hash !== 'function' || typeof hash.create !== 'function')
        throw new Error('Hash should be wrapped by utils.wrapConstructor');
    number(hash.outputLen);
    number(hash.blockLen);
}
exports.hash = hash;
function exists(instance, checkFinished = true) {
    if (instance.destroyed)
        throw new Error('Hash instance has been destroyed');
    if (checkFinished && instance.finished)
        throw new Error('Hash#digest() has already been called');
}
exports.exists = exists;
function output(out, instance) {
    bytes(out);
    const min = instance.outputLen;
    if (out.length < min) {
        throw new Error(`digestInto() expects output buffer of length at least ${min}`);
    }
}
exports.output = output;
const assert = {
    number,
    bool,
    bytes,
    hash,
    exists,
    output,
};
exports.default = assert;

},{}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SHA2 = void 0;
const _assert_js_1 = require("./_assert.js");
const utils_js_1 = require("./utils.js");
// Polyfill for Safari 14
function setBigUint64(view, byteOffset, value, isLE) {
    if (typeof view.setBigUint64 === 'function')
        return view.setBigUint64(byteOffset, value, isLE);
    const _32n = BigInt(32);
    const _u32_max = BigInt(0xffffffff);
    const wh = Number((value >> _32n) & _u32_max);
    const wl = Number(value & _u32_max);
    const h = isLE ? 4 : 0;
    const l = isLE ? 0 : 4;
    view.setUint32(byteOffset + h, wh, isLE);
    view.setUint32(byteOffset + l, wl, isLE);
}
// Base SHA2 class (RFC 6234)
class SHA2 extends utils_js_1.Hash {
    constructor(blockLen, outputLen, padOffset, isLE) {
        super();
        this.blockLen = blockLen;
        this.outputLen = outputLen;
        this.padOffset = padOffset;
        this.isLE = isLE;
        this.finished = false;
        this.length = 0;
        this.pos = 0;
        this.destroyed = false;
        this.buffer = new Uint8Array(blockLen);
        this.view = (0, utils_js_1.createView)(this.buffer);
    }
    update(data) {
        _assert_js_1.default.exists(this);
        const { view, buffer, blockLen } = this;
        data = (0, utils_js_1.toBytes)(data);
        const len = data.length;
        for (let pos = 0; pos < len;) {
            const take = Math.min(blockLen - this.pos, len - pos);
            // Fast path: we have at least one block in input, cast it to view and process
            if (take === blockLen) {
                const dataView = (0, utils_js_1.createView)(data);
                for (; blockLen <= len - pos; pos += blockLen)
                    this.process(dataView, pos);
                continue;
            }
            buffer.set(data.subarray(pos, pos + take), this.pos);
            this.pos += take;
            pos += take;
            if (this.pos === blockLen) {
                this.process(view, 0);
                this.pos = 0;
            }
        }
        this.length += data.length;
        this.roundClean();
        return this;
    }
    digestInto(out) {
        _assert_js_1.default.exists(this);
        _assert_js_1.default.output(out, this);
        this.finished = true;
        // Padding
        // We can avoid allocation of buffer for padding completely if it
        // was previously not allocated here. But it won't change performance.
        const { buffer, view, blockLen, isLE } = this;
        let { pos } = this;
        // append the bit '1' to the message
        buffer[pos++] = 0b10000000;
        this.buffer.subarray(pos).fill(0);
        // we have less than padOffset left in buffer, so we cannot put length in current block, need process it and pad again
        if (this.padOffset > blockLen - pos) {
            this.process(view, 0);
            pos = 0;
        }
        // Pad until full block byte with zeros
        for (let i = pos; i < blockLen; i++)
            buffer[i] = 0;
        // Note: sha512 requires length to be 128bit integer, but length in JS will overflow before that
        // You need to write around 2 exabytes (u64_max / 8 / (1024**6)) for this to happen.
        // So we just write lowest 64 bits of that value.
        setBigUint64(view, blockLen - 8, BigInt(this.length * 8), isLE);
        this.process(view, 0);
        const oview = (0, utils_js_1.createView)(out);
        const len = this.outputLen;
        // NOTE: we do division by 4 later, which should be fused in single op with modulo by JIT
        if (len % 4)
            throw new Error('_sha2: outputLen should be aligned to 32bit');
        const outLen = len / 4;
        const state = this.get();
        if (outLen > state.length)
            throw new Error('_sha2: outputLen bigger than state');
        for (let i = 0; i < outLen; i++)
            oview.setUint32(4 * i, state[i], isLE);
    }
    digest() {
        const { buffer, outputLen } = this;
        this.digestInto(buffer);
        const res = buffer.slice(0, outputLen);
        this.destroy();
        return res;
    }
    _cloneInto(to) {
        to || (to = new this.constructor());
        to.set(...this.get());
        const { blockLen, buffer, length, finished, destroyed, pos } = this;
        to.length = length;
        to.pos = pos;
        to.finished = finished;
        to.destroyed = destroyed;
        if (length % blockLen)
            to.buffer.set(buffer);
        return to;
    }
}
exports.SHA2 = SHA2;

},{"./_assert.js":4,"./utils.js":12}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.add = exports.toBig = exports.split = exports.fromBig = void 0;
const U32_MASK64 = BigInt(2 ** 32 - 1);
const _32n = BigInt(32);
// We are not using BigUint64Array, because they are extremely slow as per 2022
function fromBig(n, le = false) {
    if (le)
        return { h: Number(n & U32_MASK64), l: Number((n >> _32n) & U32_MASK64) };
    return { h: Number((n >> _32n) & U32_MASK64) | 0, l: Number(n & U32_MASK64) | 0 };
}
exports.fromBig = fromBig;
function split(lst, le = false) {
    let Ah = new Uint32Array(lst.length);
    let Al = new Uint32Array(lst.length);
    for (let i = 0; i < lst.length; i++) {
        const { h, l } = fromBig(lst[i], le);
        [Ah[i], Al[i]] = [h, l];
    }
    return [Ah, Al];
}
exports.split = split;
const toBig = (h, l) => (BigInt(h >>> 0) << _32n) | BigInt(l >>> 0);
exports.toBig = toBig;
// for Shift in [0, 32)
const shrSH = (h, l, s) => h >>> s;
const shrSL = (h, l, s) => (h << (32 - s)) | (l >>> s);
// Right rotate for Shift in [1, 32)
const rotrSH = (h, l, s) => (h >>> s) | (l << (32 - s));
const rotrSL = (h, l, s) => (h << (32 - s)) | (l >>> s);
// Right rotate for Shift in (32, 64), NOTE: 32 is special case.
const rotrBH = (h, l, s) => (h << (64 - s)) | (l >>> (s - 32));
const rotrBL = (h, l, s) => (h >>> (s - 32)) | (l << (64 - s));
// Right rotate for shift===32 (just swaps l&h)
const rotr32H = (h, l) => l;
const rotr32L = (h, l) => h;
// Left rotate for Shift in [1, 32)
const rotlSH = (h, l, s) => (h << s) | (l >>> (32 - s));
const rotlSL = (h, l, s) => (l << s) | (h >>> (32 - s));
// Left rotate for Shift in (32, 64), NOTE: 32 is special case.
const rotlBH = (h, l, s) => (l << (s - 32)) | (h >>> (64 - s));
const rotlBL = (h, l, s) => (h << (s - 32)) | (l >>> (64 - s));
// JS uses 32-bit signed integers for bitwise operations which means we cannot
// simple take carry out of low bit sum by shift, we need to use division.
// Removing "export" has 5% perf penalty -_-
function add(Ah, Al, Bh, Bl) {
    const l = (Al >>> 0) + (Bl >>> 0);
    return { h: (Ah + Bh + ((l / 2 ** 32) | 0)) | 0, l: l | 0 };
}
exports.add = add;
// Addition with more than 2 elements
const add3L = (Al, Bl, Cl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0);
const add3H = (low, Ah, Bh, Ch) => (Ah + Bh + Ch + ((low / 2 ** 32) | 0)) | 0;
const add4L = (Al, Bl, Cl, Dl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0);
const add4H = (low, Ah, Bh, Ch, Dh) => (Ah + Bh + Ch + Dh + ((low / 2 ** 32) | 0)) | 0;
const add5L = (Al, Bl, Cl, Dl, El) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0) + (El >>> 0);
const add5H = (low, Ah, Bh, Ch, Dh, Eh) => (Ah + Bh + Ch + Dh + Eh + ((low / 2 ** 32) | 0)) | 0;
// prettier-ignore
const u64 = {
    fromBig, split, toBig: exports.toBig,
    shrSH, shrSL,
    rotrSH, rotrSL, rotrBH, rotrBL,
    rotr32H, rotr32L,
    rotlSH, rotlSL, rotlBH, rotlBL,
    add, add3L, add3H, add4L, add4H, add5H, add5L,
};
exports.default = u64;

},{}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.crypto = void 0;
exports.crypto = typeof globalThis === 'object' && 'crypto' in globalThis ? globalThis.crypto : undefined;

},{}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hmac = exports.HMAC = void 0;
const _assert_js_1 = require("./_assert.js");
const utils_js_1 = require("./utils.js");
// HMAC (RFC 2104)
class HMAC extends utils_js_1.Hash {
    constructor(hash, _key) {
        super();
        this.finished = false;
        this.destroyed = false;
        _assert_js_1.default.hash(hash);
        const key = (0, utils_js_1.toBytes)(_key);
        this.iHash = hash.create();
        if (typeof this.iHash.update !== 'function')
            throw new Error('Expected instance of class which extends utils.Hash');
        this.blockLen = this.iHash.blockLen;
        this.outputLen = this.iHash.outputLen;
        const blockLen = this.blockLen;
        const pad = new Uint8Array(blockLen);
        // blockLen can be bigger than outputLen
        pad.set(key.length > blockLen ? hash.create().update(key).digest() : key);
        for (let i = 0; i < pad.length; i++)
            pad[i] ^= 0x36;
        this.iHash.update(pad);
        // By doing update (processing of first block) of outer hash here we can re-use it between multiple calls via clone
        this.oHash = hash.create();
        // Undo internal XOR && apply outer XOR
        for (let i = 0; i < pad.length; i++)
            pad[i] ^= 0x36 ^ 0x5c;
        this.oHash.update(pad);
        pad.fill(0);
    }
    update(buf) {
        _assert_js_1.default.exists(this);
        this.iHash.update(buf);
        return this;
    }
    digestInto(out) {
        _assert_js_1.default.exists(this);
        _assert_js_1.default.bytes(out, this.outputLen);
        this.finished = true;
        this.iHash.digestInto(out);
        this.oHash.update(out);
        this.oHash.digestInto(out);
        this.destroy();
    }
    digest() {
        const out = new Uint8Array(this.oHash.outputLen);
        this.digestInto(out);
        return out;
    }
    _cloneInto(to) {
        // Create new instance without calling constructor since key already in state and we don't know it.
        to || (to = Object.create(Object.getPrototypeOf(this), {}));
        const { oHash, iHash, finished, destroyed, blockLen, outputLen } = this;
        to = to;
        to.finished = finished;
        to.destroyed = destroyed;
        to.blockLen = blockLen;
        to.outputLen = outputLen;
        to.oHash = oHash._cloneInto(to.oHash);
        to.iHash = iHash._cloneInto(to.iHash);
        return to;
    }
    destroy() {
        this.destroyed = true;
        this.oHash.destroy();
        this.iHash.destroy();
    }
}
exports.HMAC = HMAC;
/**
 * HMAC: RFC2104 message authentication code.
 * @param hash - function that would be used e.g. sha256
 * @param key - message key
 * @param message - message data
 */
const hmac = (hash, key, message) => new HMAC(hash, key).update(message).digest();
exports.hmac = hmac;
exports.hmac.create = (hash, key) => new HMAC(hash, key);

},{"./_assert.js":4,"./utils.js":12}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pbkdf2Async = exports.pbkdf2 = void 0;
const _assert_js_1 = require("./_assert.js");
const hmac_js_1 = require("./hmac.js");
const utils_js_1 = require("./utils.js");
// Common prologue and epilogue for sync/async functions
function pbkdf2Init(hash, _password, _salt, _opts) {
    _assert_js_1.default.hash(hash);
    const opts = (0, utils_js_1.checkOpts)({ dkLen: 32, asyncTick: 10 }, _opts);
    const { c, dkLen, asyncTick } = opts;
    _assert_js_1.default.number(c);
    _assert_js_1.default.number(dkLen);
    _assert_js_1.default.number(asyncTick);
    if (c < 1)
        throw new Error('PBKDF2: iterations (c) should be >= 1');
    const password = (0, utils_js_1.toBytes)(_password);
    const salt = (0, utils_js_1.toBytes)(_salt);
    // DK = PBKDF2(PRF, Password, Salt, c, dkLen);
    const DK = new Uint8Array(dkLen);
    // U1 = PRF(Password, Salt + INT_32_BE(i))
    const PRF = hmac_js_1.hmac.create(hash, password);
    const PRFSalt = PRF._cloneInto().update(salt);
    return { c, dkLen, asyncTick, DK, PRF, PRFSalt };
}
function pbkdf2Output(PRF, PRFSalt, DK, prfW, u) {
    PRF.destroy();
    PRFSalt.destroy();
    if (prfW)
        prfW.destroy();
    u.fill(0);
    return DK;
}
/**
 * PBKDF2-HMAC: RFC 2898 key derivation function
 * @param hash - hash function that would be used e.g. sha256
 * @param password - password from which a derived key is generated
 * @param salt - cryptographic salt
 * @param opts - {c, dkLen} where c is work factor and dkLen is output message size
 */
function pbkdf2(hash, password, salt, opts) {
    const { c, dkLen, DK, PRF, PRFSalt } = pbkdf2Init(hash, password, salt, opts);
    let prfW; // Working copy
    const arr = new Uint8Array(4);
    const view = (0, utils_js_1.createView)(arr);
    const u = new Uint8Array(PRF.outputLen);
    // DK = T1 + T2 + ⋯ + Tdklen/hlen
    for (let ti = 1, pos = 0; pos < dkLen; ti++, pos += PRF.outputLen) {
        // Ti = F(Password, Salt, c, i)
        const Ti = DK.subarray(pos, pos + PRF.outputLen);
        view.setInt32(0, ti, false);
        // F(Password, Salt, c, i) = U1 ^ U2 ^ ⋯ ^ Uc
        // U1 = PRF(Password, Salt + INT_32_BE(i))
        (prfW = PRFSalt._cloneInto(prfW)).update(arr).digestInto(u);
        Ti.set(u.subarray(0, Ti.length));
        for (let ui = 1; ui < c; ui++) {
            // Uc = PRF(Password, Uc−1)
            PRF._cloneInto(prfW).update(u).digestInto(u);
            for (let i = 0; i < Ti.length; i++)
                Ti[i] ^= u[i];
        }
    }
    return pbkdf2Output(PRF, PRFSalt, DK, prfW, u);
}
exports.pbkdf2 = pbkdf2;
async function pbkdf2Async(hash, password, salt, opts) {
    const { c, dkLen, asyncTick, DK, PRF, PRFSalt } = pbkdf2Init(hash, password, salt, opts);
    let prfW; // Working copy
    const arr = new Uint8Array(4);
    const view = (0, utils_js_1.createView)(arr);
    const u = new Uint8Array(PRF.outputLen);
    // DK = T1 + T2 + ⋯ + Tdklen/hlen
    for (let ti = 1, pos = 0; pos < dkLen; ti++, pos += PRF.outputLen) {
        // Ti = F(Password, Salt, c, i)
        const Ti = DK.subarray(pos, pos + PRF.outputLen);
        view.setInt32(0, ti, false);
        // F(Password, Salt, c, i) = U1 ^ U2 ^ ⋯ ^ Uc
        // U1 = PRF(Password, Salt + INT_32_BE(i))
        (prfW = PRFSalt._cloneInto(prfW)).update(arr).digestInto(u);
        Ti.set(u.subarray(0, Ti.length));
        await (0, utils_js_1.asyncLoop)(c - 1, asyncTick, (i) => {
            // Uc = PRF(Password, Uc−1)
            PRF._cloneInto(prfW).update(u).digestInto(u);
            for (let i = 0; i < Ti.length; i++)
                Ti[i] ^= u[i];
        });
    }
    return pbkdf2Output(PRF, PRFSalt, DK, prfW, u);
}
exports.pbkdf2Async = pbkdf2Async;

},{"./_assert.js":4,"./hmac.js":8,"./utils.js":12}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sha224 = exports.sha256 = void 0;
const _sha2_js_1 = require("./_sha2.js");
const utils_js_1 = require("./utils.js");
// Choice: a ? b : c
const Chi = (a, b, c) => (a & b) ^ (~a & c);
// Majority function, true if any two inpust is true
const Maj = (a, b, c) => (a & b) ^ (a & c) ^ (b & c);
// Round constants:
// first 32 bits of the fractional parts of the cube roots of the first 64 primes 2..311)
// prettier-ignore
const SHA256_K = new Uint32Array([
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
]);
// Initial state (first 32 bits of the fractional parts of the square roots of the first 8 primes 2..19):
// prettier-ignore
const IV = new Uint32Array([
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
]);
// Temporary buffer, not used to store anything between runs
// Named this way because it matches specification.
const SHA256_W = new Uint32Array(64);
class SHA256 extends _sha2_js_1.SHA2 {
    constructor() {
        super(64, 32, 8, false);
        // We cannot use array here since array allows indexing by variable
        // which means optimizer/compiler cannot use registers.
        this.A = IV[0] | 0;
        this.B = IV[1] | 0;
        this.C = IV[2] | 0;
        this.D = IV[3] | 0;
        this.E = IV[4] | 0;
        this.F = IV[5] | 0;
        this.G = IV[6] | 0;
        this.H = IV[7] | 0;
    }
    get() {
        const { A, B, C, D, E, F, G, H } = this;
        return [A, B, C, D, E, F, G, H];
    }
    // prettier-ignore
    set(A, B, C, D, E, F, G, H) {
        this.A = A | 0;
        this.B = B | 0;
        this.C = C | 0;
        this.D = D | 0;
        this.E = E | 0;
        this.F = F | 0;
        this.G = G | 0;
        this.H = H | 0;
    }
    process(view, offset) {
        // Extend the first 16 words into the remaining 48 words w[16..63] of the message schedule array
        for (let i = 0; i < 16; i++, offset += 4)
            SHA256_W[i] = view.getUint32(offset, false);
        for (let i = 16; i < 64; i++) {
            const W15 = SHA256_W[i - 15];
            const W2 = SHA256_W[i - 2];
            const s0 = (0, utils_js_1.rotr)(W15, 7) ^ (0, utils_js_1.rotr)(W15, 18) ^ (W15 >>> 3);
            const s1 = (0, utils_js_1.rotr)(W2, 17) ^ (0, utils_js_1.rotr)(W2, 19) ^ (W2 >>> 10);
            SHA256_W[i] = (s1 + SHA256_W[i - 7] + s0 + SHA256_W[i - 16]) | 0;
        }
        // Compression function main loop, 64 rounds
        let { A, B, C, D, E, F, G, H } = this;
        for (let i = 0; i < 64; i++) {
            const sigma1 = (0, utils_js_1.rotr)(E, 6) ^ (0, utils_js_1.rotr)(E, 11) ^ (0, utils_js_1.rotr)(E, 25);
            const T1 = (H + sigma1 + Chi(E, F, G) + SHA256_K[i] + SHA256_W[i]) | 0;
            const sigma0 = (0, utils_js_1.rotr)(A, 2) ^ (0, utils_js_1.rotr)(A, 13) ^ (0, utils_js_1.rotr)(A, 22);
            const T2 = (sigma0 + Maj(A, B, C)) | 0;
            H = G;
            G = F;
            F = E;
            E = (D + T1) | 0;
            D = C;
            C = B;
            B = A;
            A = (T1 + T2) | 0;
        }
        // Add the compressed chunk to the current hash value
        A = (A + this.A) | 0;
        B = (B + this.B) | 0;
        C = (C + this.C) | 0;
        D = (D + this.D) | 0;
        E = (E + this.E) | 0;
        F = (F + this.F) | 0;
        G = (G + this.G) | 0;
        H = (H + this.H) | 0;
        this.set(A, B, C, D, E, F, G, H);
    }
    roundClean() {
        SHA256_W.fill(0);
    }
    destroy() {
        this.set(0, 0, 0, 0, 0, 0, 0, 0);
        this.buffer.fill(0);
    }
}
// Constants from https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.180-4.pdf
class SHA224 extends SHA256 {
    constructor() {
        super();
        this.A = 0xc1059ed8 | 0;
        this.B = 0x367cd507 | 0;
        this.C = 0x3070dd17 | 0;
        this.D = 0xf70e5939 | 0;
        this.E = 0xffc00b31 | 0;
        this.F = 0x68581511 | 0;
        this.G = 0x64f98fa7 | 0;
        this.H = 0xbefa4fa4 | 0;
        this.outputLen = 28;
    }
}
/**
 * SHA2-256 hash function
 * @param message - data that would be hashed
 */
exports.sha256 = (0, utils_js_1.wrapConstructor)(() => new SHA256());
exports.sha224 = (0, utils_js_1.wrapConstructor)(() => new SHA224());

},{"./_sha2.js":5,"./utils.js":12}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sha384 = exports.sha512_256 = exports.sha512_224 = exports.sha512 = exports.SHA512 = void 0;
const _sha2_js_1 = require("./_sha2.js");
const _u64_js_1 = require("./_u64.js");
const utils_js_1 = require("./utils.js");
// Round contants (first 32 bits of the fractional parts of the cube roots of the first 80 primes 2..409):
// prettier-ignore
const [SHA512_Kh, SHA512_Kl] = _u64_js_1.default.split([
    '0x428a2f98d728ae22', '0x7137449123ef65cd', '0xb5c0fbcfec4d3b2f', '0xe9b5dba58189dbbc',
    '0x3956c25bf348b538', '0x59f111f1b605d019', '0x923f82a4af194f9b', '0xab1c5ed5da6d8118',
    '0xd807aa98a3030242', '0x12835b0145706fbe', '0x243185be4ee4b28c', '0x550c7dc3d5ffb4e2',
    '0x72be5d74f27b896f', '0x80deb1fe3b1696b1', '0x9bdc06a725c71235', '0xc19bf174cf692694',
    '0xe49b69c19ef14ad2', '0xefbe4786384f25e3', '0x0fc19dc68b8cd5b5', '0x240ca1cc77ac9c65',
    '0x2de92c6f592b0275', '0x4a7484aa6ea6e483', '0x5cb0a9dcbd41fbd4', '0x76f988da831153b5',
    '0x983e5152ee66dfab', '0xa831c66d2db43210', '0xb00327c898fb213f', '0xbf597fc7beef0ee4',
    '0xc6e00bf33da88fc2', '0xd5a79147930aa725', '0x06ca6351e003826f', '0x142929670a0e6e70',
    '0x27b70a8546d22ffc', '0x2e1b21385c26c926', '0x4d2c6dfc5ac42aed', '0x53380d139d95b3df',
    '0x650a73548baf63de', '0x766a0abb3c77b2a8', '0x81c2c92e47edaee6', '0x92722c851482353b',
    '0xa2bfe8a14cf10364', '0xa81a664bbc423001', '0xc24b8b70d0f89791', '0xc76c51a30654be30',
    '0xd192e819d6ef5218', '0xd69906245565a910', '0xf40e35855771202a', '0x106aa07032bbd1b8',
    '0x19a4c116b8d2d0c8', '0x1e376c085141ab53', '0x2748774cdf8eeb99', '0x34b0bcb5e19b48a8',
    '0x391c0cb3c5c95a63', '0x4ed8aa4ae3418acb', '0x5b9cca4f7763e373', '0x682e6ff3d6b2b8a3',
    '0x748f82ee5defb2fc', '0x78a5636f43172f60', '0x84c87814a1f0ab72', '0x8cc702081a6439ec',
    '0x90befffa23631e28', '0xa4506cebde82bde9', '0xbef9a3f7b2c67915', '0xc67178f2e372532b',
    '0xca273eceea26619c', '0xd186b8c721c0c207', '0xeada7dd6cde0eb1e', '0xf57d4f7fee6ed178',
    '0x06f067aa72176fba', '0x0a637dc5a2c898a6', '0x113f9804bef90dae', '0x1b710b35131c471b',
    '0x28db77f523047d84', '0x32caab7b40c72493', '0x3c9ebe0a15c9bebc', '0x431d67c49c100d4c',
    '0x4cc5d4becb3e42b6', '0x597f299cfc657e2a', '0x5fcb6fab3ad6faec', '0x6c44198c4a475817'
].map(n => BigInt(n)));
// Temporary buffer, not used to store anything between runs
const SHA512_W_H = new Uint32Array(80);
const SHA512_W_L = new Uint32Array(80);
class SHA512 extends _sha2_js_1.SHA2 {
    constructor() {
        super(128, 64, 16, false);
        // We cannot use array here since array allows indexing by variable which means optimizer/compiler cannot use registers.
        // Also looks cleaner and easier to verify with spec.
        // Initial state (first 32 bits of the fractional parts of the square roots of the first 8 primes 2..19):
        // h -- high 32 bits, l -- low 32 bits
        this.Ah = 0x6a09e667 | 0;
        this.Al = 0xf3bcc908 | 0;
        this.Bh = 0xbb67ae85 | 0;
        this.Bl = 0x84caa73b | 0;
        this.Ch = 0x3c6ef372 | 0;
        this.Cl = 0xfe94f82b | 0;
        this.Dh = 0xa54ff53a | 0;
        this.Dl = 0x5f1d36f1 | 0;
        this.Eh = 0x510e527f | 0;
        this.El = 0xade682d1 | 0;
        this.Fh = 0x9b05688c | 0;
        this.Fl = 0x2b3e6c1f | 0;
        this.Gh = 0x1f83d9ab | 0;
        this.Gl = 0xfb41bd6b | 0;
        this.Hh = 0x5be0cd19 | 0;
        this.Hl = 0x137e2179 | 0;
    }
    // prettier-ignore
    get() {
        const { Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl } = this;
        return [Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl];
    }
    // prettier-ignore
    set(Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl) {
        this.Ah = Ah | 0;
        this.Al = Al | 0;
        this.Bh = Bh | 0;
        this.Bl = Bl | 0;
        this.Ch = Ch | 0;
        this.Cl = Cl | 0;
        this.Dh = Dh | 0;
        this.Dl = Dl | 0;
        this.Eh = Eh | 0;
        this.El = El | 0;
        this.Fh = Fh | 0;
        this.Fl = Fl | 0;
        this.Gh = Gh | 0;
        this.Gl = Gl | 0;
        this.Hh = Hh | 0;
        this.Hl = Hl | 0;
    }
    process(view, offset) {
        // Extend the first 16 words into the remaining 64 words w[16..79] of the message schedule array
        for (let i = 0; i < 16; i++, offset += 4) {
            SHA512_W_H[i] = view.getUint32(offset);
            SHA512_W_L[i] = view.getUint32((offset += 4));
        }
        for (let i = 16; i < 80; i++) {
            // s0 := (w[i-15] rightrotate 1) xor (w[i-15] rightrotate 8) xor (w[i-15] rightshift 7)
            const W15h = SHA512_W_H[i - 15] | 0;
            const W15l = SHA512_W_L[i - 15] | 0;
            const s0h = _u64_js_1.default.rotrSH(W15h, W15l, 1) ^ _u64_js_1.default.rotrSH(W15h, W15l, 8) ^ _u64_js_1.default.shrSH(W15h, W15l, 7);
            const s0l = _u64_js_1.default.rotrSL(W15h, W15l, 1) ^ _u64_js_1.default.rotrSL(W15h, W15l, 8) ^ _u64_js_1.default.shrSL(W15h, W15l, 7);
            // s1 := (w[i-2] rightrotate 19) xor (w[i-2] rightrotate 61) xor (w[i-2] rightshift 6)
            const W2h = SHA512_W_H[i - 2] | 0;
            const W2l = SHA512_W_L[i - 2] | 0;
            const s1h = _u64_js_1.default.rotrSH(W2h, W2l, 19) ^ _u64_js_1.default.rotrBH(W2h, W2l, 61) ^ _u64_js_1.default.shrSH(W2h, W2l, 6);
            const s1l = _u64_js_1.default.rotrSL(W2h, W2l, 19) ^ _u64_js_1.default.rotrBL(W2h, W2l, 61) ^ _u64_js_1.default.shrSL(W2h, W2l, 6);
            // SHA256_W[i] = s0 + s1 + SHA256_W[i - 7] + SHA256_W[i - 16];
            const SUMl = _u64_js_1.default.add4L(s0l, s1l, SHA512_W_L[i - 7], SHA512_W_L[i - 16]);
            const SUMh = _u64_js_1.default.add4H(SUMl, s0h, s1h, SHA512_W_H[i - 7], SHA512_W_H[i - 16]);
            SHA512_W_H[i] = SUMh | 0;
            SHA512_W_L[i] = SUMl | 0;
        }
        let { Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl } = this;
        // Compression function main loop, 80 rounds
        for (let i = 0; i < 80; i++) {
            // S1 := (e rightrotate 14) xor (e rightrotate 18) xor (e rightrotate 41)
            const sigma1h = _u64_js_1.default.rotrSH(Eh, El, 14) ^ _u64_js_1.default.rotrSH(Eh, El, 18) ^ _u64_js_1.default.rotrBH(Eh, El, 41);
            const sigma1l = _u64_js_1.default.rotrSL(Eh, El, 14) ^ _u64_js_1.default.rotrSL(Eh, El, 18) ^ _u64_js_1.default.rotrBL(Eh, El, 41);
            //const T1 = (H + sigma1 + Chi(E, F, G) + SHA256_K[i] + SHA256_W[i]) | 0;
            const CHIh = (Eh & Fh) ^ (~Eh & Gh);
            const CHIl = (El & Fl) ^ (~El & Gl);
            // T1 = H + sigma1 + Chi(E, F, G) + SHA512_K[i] + SHA512_W[i]
            // prettier-ignore
            const T1ll = _u64_js_1.default.add5L(Hl, sigma1l, CHIl, SHA512_Kl[i], SHA512_W_L[i]);
            const T1h = _u64_js_1.default.add5H(T1ll, Hh, sigma1h, CHIh, SHA512_Kh[i], SHA512_W_H[i]);
            const T1l = T1ll | 0;
            // S0 := (a rightrotate 28) xor (a rightrotate 34) xor (a rightrotate 39)
            const sigma0h = _u64_js_1.default.rotrSH(Ah, Al, 28) ^ _u64_js_1.default.rotrBH(Ah, Al, 34) ^ _u64_js_1.default.rotrBH(Ah, Al, 39);
            const sigma0l = _u64_js_1.default.rotrSL(Ah, Al, 28) ^ _u64_js_1.default.rotrBL(Ah, Al, 34) ^ _u64_js_1.default.rotrBL(Ah, Al, 39);
            const MAJh = (Ah & Bh) ^ (Ah & Ch) ^ (Bh & Ch);
            const MAJl = (Al & Bl) ^ (Al & Cl) ^ (Bl & Cl);
            Hh = Gh | 0;
            Hl = Gl | 0;
            Gh = Fh | 0;
            Gl = Fl | 0;
            Fh = Eh | 0;
            Fl = El | 0;
            ({ h: Eh, l: El } = _u64_js_1.default.add(Dh | 0, Dl | 0, T1h | 0, T1l | 0));
            Dh = Ch | 0;
            Dl = Cl | 0;
            Ch = Bh | 0;
            Cl = Bl | 0;
            Bh = Ah | 0;
            Bl = Al | 0;
            const All = _u64_js_1.default.add3L(T1l, sigma0l, MAJl);
            Ah = _u64_js_1.default.add3H(All, T1h, sigma0h, MAJh);
            Al = All | 0;
        }
        // Add the compressed chunk to the current hash value
        ({ h: Ah, l: Al } = _u64_js_1.default.add(this.Ah | 0, this.Al | 0, Ah | 0, Al | 0));
        ({ h: Bh, l: Bl } = _u64_js_1.default.add(this.Bh | 0, this.Bl | 0, Bh | 0, Bl | 0));
        ({ h: Ch, l: Cl } = _u64_js_1.default.add(this.Ch | 0, this.Cl | 0, Ch | 0, Cl | 0));
        ({ h: Dh, l: Dl } = _u64_js_1.default.add(this.Dh | 0, this.Dl | 0, Dh | 0, Dl | 0));
        ({ h: Eh, l: El } = _u64_js_1.default.add(this.Eh | 0, this.El | 0, Eh | 0, El | 0));
        ({ h: Fh, l: Fl } = _u64_js_1.default.add(this.Fh | 0, this.Fl | 0, Fh | 0, Fl | 0));
        ({ h: Gh, l: Gl } = _u64_js_1.default.add(this.Gh | 0, this.Gl | 0, Gh | 0, Gl | 0));
        ({ h: Hh, l: Hl } = _u64_js_1.default.add(this.Hh | 0, this.Hl | 0, Hh | 0, Hl | 0));
        this.set(Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl);
    }
    roundClean() {
        SHA512_W_H.fill(0);
        SHA512_W_L.fill(0);
    }
    destroy() {
        this.buffer.fill(0);
        this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    }
}
exports.SHA512 = SHA512;
class SHA512_224 extends SHA512 {
    constructor() {
        super();
        // h -- high 32 bits, l -- low 32 bits
        this.Ah = 0x8c3d37c8 | 0;
        this.Al = 0x19544da2 | 0;
        this.Bh = 0x73e19966 | 0;
        this.Bl = 0x89dcd4d6 | 0;
        this.Ch = 0x1dfab7ae | 0;
        this.Cl = 0x32ff9c82 | 0;
        this.Dh = 0x679dd514 | 0;
        this.Dl = 0x582f9fcf | 0;
        this.Eh = 0x0f6d2b69 | 0;
        this.El = 0x7bd44da8 | 0;
        this.Fh = 0x77e36f73 | 0;
        this.Fl = 0x04c48942 | 0;
        this.Gh = 0x3f9d85a8 | 0;
        this.Gl = 0x6a1d36c8 | 0;
        this.Hh = 0x1112e6ad | 0;
        this.Hl = 0x91d692a1 | 0;
        this.outputLen = 28;
    }
}
class SHA512_256 extends SHA512 {
    constructor() {
        super();
        // h -- high 32 bits, l -- low 32 bits
        this.Ah = 0x22312194 | 0;
        this.Al = 0xfc2bf72c | 0;
        this.Bh = 0x9f555fa3 | 0;
        this.Bl = 0xc84c64c2 | 0;
        this.Ch = 0x2393b86b | 0;
        this.Cl = 0x6f53b151 | 0;
        this.Dh = 0x96387719 | 0;
        this.Dl = 0x5940eabd | 0;
        this.Eh = 0x96283ee2 | 0;
        this.El = 0xa88effe3 | 0;
        this.Fh = 0xbe5e1e25 | 0;
        this.Fl = 0x53863992 | 0;
        this.Gh = 0x2b0199fc | 0;
        this.Gl = 0x2c85b8aa | 0;
        this.Hh = 0x0eb72ddc | 0;
        this.Hl = 0x81c52ca2 | 0;
        this.outputLen = 32;
    }
}
class SHA384 extends SHA512 {
    constructor() {
        super();
        // h -- high 32 bits, l -- low 32 bits
        this.Ah = 0xcbbb9d5d | 0;
        this.Al = 0xc1059ed8 | 0;
        this.Bh = 0x629a292a | 0;
        this.Bl = 0x367cd507 | 0;
        this.Ch = 0x9159015a | 0;
        this.Cl = 0x3070dd17 | 0;
        this.Dh = 0x152fecd8 | 0;
        this.Dl = 0xf70e5939 | 0;
        this.Eh = 0x67332667 | 0;
        this.El = 0xffc00b31 | 0;
        this.Fh = 0x8eb44a87 | 0;
        this.Fl = 0x68581511 | 0;
        this.Gh = 0xdb0c2e0d | 0;
        this.Gl = 0x64f98fa7 | 0;
        this.Hh = 0x47b5481d | 0;
        this.Hl = 0xbefa4fa4 | 0;
        this.outputLen = 48;
    }
}
exports.sha512 = (0, utils_js_1.wrapConstructor)(() => new SHA512());
exports.sha512_224 = (0, utils_js_1.wrapConstructor)(() => new SHA512_224());
exports.sha512_256 = (0, utils_js_1.wrapConstructor)(() => new SHA512_256());
exports.sha384 = (0, utils_js_1.wrapConstructor)(() => new SHA384());

},{"./_sha2.js":5,"./_u64.js":6,"./utils.js":12}],12:[function(require,module,exports){
"use strict";
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomBytes = exports.wrapXOFConstructorWithOpts = exports.wrapConstructorWithOpts = exports.wrapConstructor = exports.checkOpts = exports.Hash = exports.concatBytes = exports.toBytes = exports.utf8ToBytes = exports.asyncLoop = exports.nextTick = exports.hexToBytes = exports.bytesToHex = exports.isLE = exports.rotr = exports.createView = exports.u32 = exports.u8 = void 0;
// We use WebCrypto aka globalThis.crypto, which exists in browsers and node.js 16+.
// node.js versions earlier than v19 don't declare it in global scope.
// For node.js, package.json#exports field mapping rewrites import
// from `crypto` to `cryptoNode`, which imports native module.
// Makes the utils un-importable in browsers without a bundler.
// Once node.js 18 is deprecated, we can just drop the import.
const crypto_1 = require("@noble/hashes/crypto");
const u8a = (a) => a instanceof Uint8Array;
// Cast array to different type
const u8 = (arr) => new Uint8Array(arr.buffer, arr.byteOffset, arr.byteLength);
exports.u8 = u8;
const u32 = (arr) => new Uint32Array(arr.buffer, arr.byteOffset, Math.floor(arr.byteLength / 4));
exports.u32 = u32;
// Cast array to view
const createView = (arr) => new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
exports.createView = createView;
// The rotate right (circular right shift) operation for uint32
const rotr = (word, shift) => (word << (32 - shift)) | (word >>> shift);
exports.rotr = rotr;
// big-endian hardware is rare. Just in case someone still decides to run hashes:
// early-throw an error because we don't support BE yet.
exports.isLE = new Uint8Array(new Uint32Array([0x11223344]).buffer)[0] === 0x44;
if (!exports.isLE)
    throw new Error('Non little-endian hardware is not supported');
const hexes = Array.from({ length: 256 }, (v, i) => i.toString(16).padStart(2, '0'));
/**
 * @example bytesToHex(Uint8Array.from([0xca, 0xfe, 0x01, 0x23])) // 'cafe0123'
 */
function bytesToHex(bytes) {
    if (!u8a(bytes))
        throw new Error('Uint8Array expected');
    // pre-caching improves the speed 6x
    let hex = '';
    for (let i = 0; i < bytes.length; i++) {
        hex += hexes[bytes[i]];
    }
    return hex;
}
exports.bytesToHex = bytesToHex;
/**
 * @example hexToBytes('cafe0123') // Uint8Array.from([0xca, 0xfe, 0x01, 0x23])
 */
function hexToBytes(hex) {
    if (typeof hex !== 'string')
        throw new Error('hex string expected, got ' + typeof hex);
    const len = hex.length;
    if (len % 2)
        throw new Error('padded hex string expected, got unpadded hex of length ' + len);
    const array = new Uint8Array(len / 2);
    for (let i = 0; i < array.length; i++) {
        const j = i * 2;
        const hexByte = hex.slice(j, j + 2);
        const byte = Number.parseInt(hexByte, 16);
        if (Number.isNaN(byte) || byte < 0)
            throw new Error('Invalid byte sequence');
        array[i] = byte;
    }
    return array;
}
exports.hexToBytes = hexToBytes;
// There is no setImmediate in browser and setTimeout is slow.
// call of async fn will return Promise, which will be fullfiled only on
// next scheduler queue processing step and this is exactly what we need.
const nextTick = async () => { };
exports.nextTick = nextTick;
// Returns control to thread each 'tick' ms to avoid blocking
async function asyncLoop(iters, tick, cb) {
    let ts = Date.now();
    for (let i = 0; i < iters; i++) {
        cb(i);
        // Date.now() is not monotonic, so in case if clock goes backwards we return return control too
        const diff = Date.now() - ts;
        if (diff >= 0 && diff < tick)
            continue;
        await (0, exports.nextTick)();
        ts += diff;
    }
}
exports.asyncLoop = asyncLoop;
/**
 * @example utf8ToBytes('abc') // new Uint8Array([97, 98, 99])
 */
function utf8ToBytes(str) {
    if (typeof str !== 'string')
        throw new Error(`utf8ToBytes expected string, got ${typeof str}`);
    return new Uint8Array(new TextEncoder().encode(str)); // https://bugzil.la/1681809
}
exports.utf8ToBytes = utf8ToBytes;
/**
 * Normalizes (non-hex) string or Uint8Array to Uint8Array.
 * Warning: when Uint8Array is passed, it would NOT get copied.
 * Keep in mind for future mutable operations.
 */
function toBytes(data) {
    if (typeof data === 'string')
        data = utf8ToBytes(data);
    if (!u8a(data))
        throw new Error(`expected Uint8Array, got ${typeof data}`);
    return data;
}
exports.toBytes = toBytes;
/**
 * Copies several Uint8Arrays into one.
 */
function concatBytes(...arrays) {
    const r = new Uint8Array(arrays.reduce((sum, a) => sum + a.length, 0));
    let pad = 0; // walk through each item, ensure they have proper type
    arrays.forEach((a) => {
        if (!u8a(a))
            throw new Error('Uint8Array expected');
        r.set(a, pad);
        pad += a.length;
    });
    return r;
}
exports.concatBytes = concatBytes;
// For runtime check if class implements interface
class Hash {
    // Safe version that clones internal state
    clone() {
        return this._cloneInto();
    }
}
exports.Hash = Hash;
// Check if object doens't have custom constructor (like Uint8Array/Array)
const isPlainObject = (obj) => Object.prototype.toString.call(obj) === '[object Object]' && obj.constructor === Object;
function checkOpts(defaults, opts) {
    if (opts !== undefined && (typeof opts !== 'object' || !isPlainObject(opts)))
        throw new Error('Options should be object or undefined');
    const merged = Object.assign(defaults, opts);
    return merged;
}
exports.checkOpts = checkOpts;
function wrapConstructor(hashCons) {
    const hashC = (msg) => hashCons().update(toBytes(msg)).digest();
    const tmp = hashCons();
    hashC.outputLen = tmp.outputLen;
    hashC.blockLen = tmp.blockLen;
    hashC.create = () => hashCons();
    return hashC;
}
exports.wrapConstructor = wrapConstructor;
function wrapConstructorWithOpts(hashCons) {
    const hashC = (msg, opts) => hashCons(opts).update(toBytes(msg)).digest();
    const tmp = hashCons({});
    hashC.outputLen = tmp.outputLen;
    hashC.blockLen = tmp.blockLen;
    hashC.create = (opts) => hashCons(opts);
    return hashC;
}
exports.wrapConstructorWithOpts = wrapConstructorWithOpts;
function wrapXOFConstructorWithOpts(hashCons) {
    const hashC = (msg, opts) => hashCons(opts).update(toBytes(msg)).digest();
    const tmp = hashCons({});
    hashC.outputLen = tmp.outputLen;
    hashC.blockLen = tmp.blockLen;
    hashC.create = (opts) => hashCons(opts);
    return hashC;
}
exports.wrapXOFConstructorWithOpts = wrapXOFConstructorWithOpts;
/**
 * Secure PRNG. Uses `crypto.getRandomValues`, which defers to OS.
 */
function randomBytes(bytesLength = 32) {
    if (crypto_1.crypto && typeof crypto_1.crypto.getRandomValues === 'function') {
        return crypto_1.crypto.getRandomValues(new Uint8Array(bytesLength));
    }
    throw new Error('crypto.getRandomValues must be defined');
}
exports.randomBytes = randomBytes;

},{"@noble/hashes/crypto":7}],13:[function(require,module,exports){
"use strict";
module.exports = asPromise;

/**
 * Callback as used by {@link util.asPromise}.
 * @typedef asPromiseCallback
 * @type {function}
 * @param {Error|null} error Error, if any
 * @param {...*} params Additional arguments
 * @returns {undefined}
 */

/**
 * Returns a promise from a node-style callback function.
 * @memberof util
 * @param {asPromiseCallback} fn Function to call
 * @param {*} ctx Function context
 * @param {...*} params Function arguments
 * @returns {Promise<*>} Promisified function
 */
function asPromise(fn, ctx/*, varargs */) {
    var params  = new Array(arguments.length - 1),
        offset  = 0,
        index   = 2,
        pending = true;
    while (index < arguments.length)
        params[offset++] = arguments[index++];
    return new Promise(function executor(resolve, reject) {
        params[offset] = function callback(err/*, varargs */) {
            if (pending) {
                pending = false;
                if (err)
                    reject(err);
                else {
                    var params = new Array(arguments.length - 1),
                        offset = 0;
                    while (offset < params.length)
                        params[offset++] = arguments[offset];
                    resolve.apply(null, params);
                }
            }
        };
        try {
            fn.apply(ctx || null, params);
        } catch (err) {
            if (pending) {
                pending = false;
                reject(err);
            }
        }
    });
}

},{}],14:[function(require,module,exports){
"use strict";

/**
 * A minimal base64 implementation for number arrays.
 * @memberof util
 * @namespace
 */
var base64 = exports;

/**
 * Calculates the byte length of a base64 encoded string.
 * @param {string} string Base64 encoded string
 * @returns {number} Byte length
 */
base64.length = function length(string) {
    var p = string.length;
    if (!p)
        return 0;
    var n = 0;
    while (--p % 4 > 1 && string.charAt(p) === "=")
        ++n;
    return Math.ceil(string.length * 3) / 4 - n;
};

// Base64 encoding table
var b64 = new Array(64);

// Base64 decoding table
var s64 = new Array(123);

// 65..90, 97..122, 48..57, 43, 47
for (var i = 0; i < 64;)
    s64[b64[i] = i < 26 ? i + 65 : i < 52 ? i + 71 : i < 62 ? i - 4 : i - 59 | 43] = i++;

/**
 * Encodes a buffer to a base64 encoded string.
 * @param {Uint8Array} buffer Source buffer
 * @param {number} start Source start
 * @param {number} end Source end
 * @returns {string} Base64 encoded string
 */
base64.encode = function encode(buffer, start, end) {
    var parts = null,
        chunk = [];
    var i = 0, // output index
        j = 0, // goto index
        t;     // temporary
    while (start < end) {
        var b = buffer[start++];
        switch (j) {
            case 0:
                chunk[i++] = b64[b >> 2];
                t = (b & 3) << 4;
                j = 1;
                break;
            case 1:
                chunk[i++] = b64[t | b >> 4];
                t = (b & 15) << 2;
                j = 2;
                break;
            case 2:
                chunk[i++] = b64[t | b >> 6];
                chunk[i++] = b64[b & 63];
                j = 0;
                break;
        }
        if (i > 8191) {
            (parts || (parts = [])).push(String.fromCharCode.apply(String, chunk));
            i = 0;
        }
    }
    if (j) {
        chunk[i++] = b64[t];
        chunk[i++] = 61;
        if (j === 1)
            chunk[i++] = 61;
    }
    if (parts) {
        if (i)
            parts.push(String.fromCharCode.apply(String, chunk.slice(0, i)));
        return parts.join("");
    }
    return String.fromCharCode.apply(String, chunk.slice(0, i));
};

var invalidEncoding = "invalid encoding";

/**
 * Decodes a base64 encoded string to a buffer.
 * @param {string} string Source string
 * @param {Uint8Array} buffer Destination buffer
 * @param {number} offset Destination offset
 * @returns {number} Number of bytes written
 * @throws {Error} If encoding is invalid
 */
base64.decode = function decode(string, buffer, offset) {
    var start = offset;
    var j = 0, // goto index
        t;     // temporary
    for (var i = 0; i < string.length;) {
        var c = string.charCodeAt(i++);
        if (c === 61 && j > 1)
            break;
        if ((c = s64[c]) === undefined)
            throw Error(invalidEncoding);
        switch (j) {
            case 0:
                t = c;
                j = 1;
                break;
            case 1:
                buffer[offset++] = t << 2 | (c & 48) >> 4;
                t = c;
                j = 2;
                break;
            case 2:
                buffer[offset++] = (t & 15) << 4 | (c & 60) >> 2;
                t = c;
                j = 3;
                break;
            case 3:
                buffer[offset++] = (t & 3) << 6 | c;
                j = 0;
                break;
        }
    }
    if (j === 1)
        throw Error(invalidEncoding);
    return offset - start;
};

/**
 * Tests if the specified string appears to be base64 encoded.
 * @param {string} string String to test
 * @returns {boolean} `true` if probably base64 encoded, otherwise false
 */
base64.test = function test(string) {
    return /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(string);
};

},{}],15:[function(require,module,exports){
"use strict";
module.exports = EventEmitter;

/**
 * Constructs a new event emitter instance.
 * @classdesc A minimal event emitter.
 * @memberof util
 * @constructor
 */
function EventEmitter() {

    /**
     * Registered listeners.
     * @type {Object.<string,*>}
     * @private
     */
    this._listeners = {};
}

/**
 * Registers an event listener.
 * @param {string} evt Event name
 * @param {function} fn Listener
 * @param {*} [ctx] Listener context
 * @returns {util.EventEmitter} `this`
 */
EventEmitter.prototype.on = function on(evt, fn, ctx) {
    (this._listeners[evt] || (this._listeners[evt] = [])).push({
        fn  : fn,
        ctx : ctx || this
    });
    return this;
};

/**
 * Removes an event listener or any matching listeners if arguments are omitted.
 * @param {string} [evt] Event name. Removes all listeners if omitted.
 * @param {function} [fn] Listener to remove. Removes all listeners of `evt` if omitted.
 * @returns {util.EventEmitter} `this`
 */
EventEmitter.prototype.off = function off(evt, fn) {
    if (evt === undefined)
        this._listeners = {};
    else {
        if (fn === undefined)
            this._listeners[evt] = [];
        else {
            var listeners = this._listeners[evt];
            for (var i = 0; i < listeners.length;)
                if (listeners[i].fn === fn)
                    listeners.splice(i, 1);
                else
                    ++i;
        }
    }
    return this;
};

/**
 * Emits an event by calling its listeners with the specified arguments.
 * @param {string} evt Event name
 * @param {...*} args Arguments
 * @returns {util.EventEmitter} `this`
 */
EventEmitter.prototype.emit = function emit(evt) {
    var listeners = this._listeners[evt];
    if (listeners) {
        var args = [],
            i = 1;
        for (; i < arguments.length;)
            args.push(arguments[i++]);
        for (i = 0; i < listeners.length;)
            listeners[i].fn.apply(listeners[i++].ctx, args);
    }
    return this;
};

},{}],16:[function(require,module,exports){
"use strict";

module.exports = factory(factory);

/**
 * Reads / writes floats / doubles from / to buffers.
 * @name util.float
 * @namespace
 */

/**
 * Writes a 32 bit float to a buffer using little endian byte order.
 * @name util.float.writeFloatLE
 * @function
 * @param {number} val Value to write
 * @param {Uint8Array} buf Target buffer
 * @param {number} pos Target buffer offset
 * @returns {undefined}
 */

/**
 * Writes a 32 bit float to a buffer using big endian byte order.
 * @name util.float.writeFloatBE
 * @function
 * @param {number} val Value to write
 * @param {Uint8Array} buf Target buffer
 * @param {number} pos Target buffer offset
 * @returns {undefined}
 */

/**
 * Reads a 32 bit float from a buffer using little endian byte order.
 * @name util.float.readFloatLE
 * @function
 * @param {Uint8Array} buf Source buffer
 * @param {number} pos Source buffer offset
 * @returns {number} Value read
 */

/**
 * Reads a 32 bit float from a buffer using big endian byte order.
 * @name util.float.readFloatBE
 * @function
 * @param {Uint8Array} buf Source buffer
 * @param {number} pos Source buffer offset
 * @returns {number} Value read
 */

/**
 * Writes a 64 bit double to a buffer using little endian byte order.
 * @name util.float.writeDoubleLE
 * @function
 * @param {number} val Value to write
 * @param {Uint8Array} buf Target buffer
 * @param {number} pos Target buffer offset
 * @returns {undefined}
 */

/**
 * Writes a 64 bit double to a buffer using big endian byte order.
 * @name util.float.writeDoubleBE
 * @function
 * @param {number} val Value to write
 * @param {Uint8Array} buf Target buffer
 * @param {number} pos Target buffer offset
 * @returns {undefined}
 */

/**
 * Reads a 64 bit double from a buffer using little endian byte order.
 * @name util.float.readDoubleLE
 * @function
 * @param {Uint8Array} buf Source buffer
 * @param {number} pos Source buffer offset
 * @returns {number} Value read
 */

/**
 * Reads a 64 bit double from a buffer using big endian byte order.
 * @name util.float.readDoubleBE
 * @function
 * @param {Uint8Array} buf Source buffer
 * @param {number} pos Source buffer offset
 * @returns {number} Value read
 */

// Factory function for the purpose of node-based testing in modified global environments
function factory(exports) {

    // float: typed array
    if (typeof Float32Array !== "undefined") (function() {

        var f32 = new Float32Array([ -0 ]),
            f8b = new Uint8Array(f32.buffer),
            le  = f8b[3] === 128;

        function writeFloat_f32_cpy(val, buf, pos) {
            f32[0] = val;
            buf[pos    ] = f8b[0];
            buf[pos + 1] = f8b[1];
            buf[pos + 2] = f8b[2];
            buf[pos + 3] = f8b[3];
        }

        function writeFloat_f32_rev(val, buf, pos) {
            f32[0] = val;
            buf[pos    ] = f8b[3];
            buf[pos + 1] = f8b[2];
            buf[pos + 2] = f8b[1];
            buf[pos + 3] = f8b[0];
        }

        /* istanbul ignore next */
        exports.writeFloatLE = le ? writeFloat_f32_cpy : writeFloat_f32_rev;
        /* istanbul ignore next */
        exports.writeFloatBE = le ? writeFloat_f32_rev : writeFloat_f32_cpy;

        function readFloat_f32_cpy(buf, pos) {
            f8b[0] = buf[pos    ];
            f8b[1] = buf[pos + 1];
            f8b[2] = buf[pos + 2];
            f8b[3] = buf[pos + 3];
            return f32[0];
        }

        function readFloat_f32_rev(buf, pos) {
            f8b[3] = buf[pos    ];
            f8b[2] = buf[pos + 1];
            f8b[1] = buf[pos + 2];
            f8b[0] = buf[pos + 3];
            return f32[0];
        }

        /* istanbul ignore next */
        exports.readFloatLE = le ? readFloat_f32_cpy : readFloat_f32_rev;
        /* istanbul ignore next */
        exports.readFloatBE = le ? readFloat_f32_rev : readFloat_f32_cpy;

    // float: ieee754
    })(); else (function() {

        function writeFloat_ieee754(writeUint, val, buf, pos) {
            var sign = val < 0 ? 1 : 0;
            if (sign)
                val = -val;
            if (val === 0)
                writeUint(1 / val > 0 ? /* positive */ 0 : /* negative 0 */ 2147483648, buf, pos);
            else if (isNaN(val))
                writeUint(2143289344, buf, pos);
            else if (val > 3.4028234663852886e+38) // +-Infinity
                writeUint((sign << 31 | 2139095040) >>> 0, buf, pos);
            else if (val < 1.1754943508222875e-38) // denormal
                writeUint((sign << 31 | Math.round(val / 1.401298464324817e-45)) >>> 0, buf, pos);
            else {
                var exponent = Math.floor(Math.log(val) / Math.LN2),
                    mantissa = Math.round(val * Math.pow(2, -exponent) * 8388608) & 8388607;
                writeUint((sign << 31 | exponent + 127 << 23 | mantissa) >>> 0, buf, pos);
            }
        }

        exports.writeFloatLE = writeFloat_ieee754.bind(null, writeUintLE);
        exports.writeFloatBE = writeFloat_ieee754.bind(null, writeUintBE);

        function readFloat_ieee754(readUint, buf, pos) {
            var uint = readUint(buf, pos),
                sign = (uint >> 31) * 2 + 1,
                exponent = uint >>> 23 & 255,
                mantissa = uint & 8388607;
            return exponent === 255
                ? mantissa
                ? NaN
                : sign * Infinity
                : exponent === 0 // denormal
                ? sign * 1.401298464324817e-45 * mantissa
                : sign * Math.pow(2, exponent - 150) * (mantissa + 8388608);
        }

        exports.readFloatLE = readFloat_ieee754.bind(null, readUintLE);
        exports.readFloatBE = readFloat_ieee754.bind(null, readUintBE);

    })();

    // double: typed array
    if (typeof Float64Array !== "undefined") (function() {

        var f64 = new Float64Array([-0]),
            f8b = new Uint8Array(f64.buffer),
            le  = f8b[7] === 128;

        function writeDouble_f64_cpy(val, buf, pos) {
            f64[0] = val;
            buf[pos    ] = f8b[0];
            buf[pos + 1] = f8b[1];
            buf[pos + 2] = f8b[2];
            buf[pos + 3] = f8b[3];
            buf[pos + 4] = f8b[4];
            buf[pos + 5] = f8b[5];
            buf[pos + 6] = f8b[6];
            buf[pos + 7] = f8b[7];
        }

        function writeDouble_f64_rev(val, buf, pos) {
            f64[0] = val;
            buf[pos    ] = f8b[7];
            buf[pos + 1] = f8b[6];
            buf[pos + 2] = f8b[5];
            buf[pos + 3] = f8b[4];
            buf[pos + 4] = f8b[3];
            buf[pos + 5] = f8b[2];
            buf[pos + 6] = f8b[1];
            buf[pos + 7] = f8b[0];
        }

        /* istanbul ignore next */
        exports.writeDoubleLE = le ? writeDouble_f64_cpy : writeDouble_f64_rev;
        /* istanbul ignore next */
        exports.writeDoubleBE = le ? writeDouble_f64_rev : writeDouble_f64_cpy;

        function readDouble_f64_cpy(buf, pos) {
            f8b[0] = buf[pos    ];
            f8b[1] = buf[pos + 1];
            f8b[2] = buf[pos + 2];
            f8b[3] = buf[pos + 3];
            f8b[4] = buf[pos + 4];
            f8b[5] = buf[pos + 5];
            f8b[6] = buf[pos + 6];
            f8b[7] = buf[pos + 7];
            return f64[0];
        }

        function readDouble_f64_rev(buf, pos) {
            f8b[7] = buf[pos    ];
            f8b[6] = buf[pos + 1];
            f8b[5] = buf[pos + 2];
            f8b[4] = buf[pos + 3];
            f8b[3] = buf[pos + 4];
            f8b[2] = buf[pos + 5];
            f8b[1] = buf[pos + 6];
            f8b[0] = buf[pos + 7];
            return f64[0];
        }

        /* istanbul ignore next */
        exports.readDoubleLE = le ? readDouble_f64_cpy : readDouble_f64_rev;
        /* istanbul ignore next */
        exports.readDoubleBE = le ? readDouble_f64_rev : readDouble_f64_cpy;

    // double: ieee754
    })(); else (function() {

        function writeDouble_ieee754(writeUint, off0, off1, val, buf, pos) {
            var sign = val < 0 ? 1 : 0;
            if (sign)
                val = -val;
            if (val === 0) {
                writeUint(0, buf, pos + off0);
                writeUint(1 / val > 0 ? /* positive */ 0 : /* negative 0 */ 2147483648, buf, pos + off1);
            } else if (isNaN(val)) {
                writeUint(0, buf, pos + off0);
                writeUint(2146959360, buf, pos + off1);
            } else if (val > 1.7976931348623157e+308) { // +-Infinity
                writeUint(0, buf, pos + off0);
                writeUint((sign << 31 | 2146435072) >>> 0, buf, pos + off1);
            } else {
                var mantissa;
                if (val < 2.2250738585072014e-308) { // denormal
                    mantissa = val / 5e-324;
                    writeUint(mantissa >>> 0, buf, pos + off0);
                    writeUint((sign << 31 | mantissa / 4294967296) >>> 0, buf, pos + off1);
                } else {
                    var exponent = Math.floor(Math.log(val) / Math.LN2);
                    if (exponent === 1024)
                        exponent = 1023;
                    mantissa = val * Math.pow(2, -exponent);
                    writeUint(mantissa * 4503599627370496 >>> 0, buf, pos + off0);
                    writeUint((sign << 31 | exponent + 1023 << 20 | mantissa * 1048576 & 1048575) >>> 0, buf, pos + off1);
                }
            }
        }

        exports.writeDoubleLE = writeDouble_ieee754.bind(null, writeUintLE, 0, 4);
        exports.writeDoubleBE = writeDouble_ieee754.bind(null, writeUintBE, 4, 0);

        function readDouble_ieee754(readUint, off0, off1, buf, pos) {
            var lo = readUint(buf, pos + off0),
                hi = readUint(buf, pos + off1);
            var sign = (hi >> 31) * 2 + 1,
                exponent = hi >>> 20 & 2047,
                mantissa = 4294967296 * (hi & 1048575) + lo;
            return exponent === 2047
                ? mantissa
                ? NaN
                : sign * Infinity
                : exponent === 0 // denormal
                ? sign * 5e-324 * mantissa
                : sign * Math.pow(2, exponent - 1075) * (mantissa + 4503599627370496);
        }

        exports.readDoubleLE = readDouble_ieee754.bind(null, readUintLE, 0, 4);
        exports.readDoubleBE = readDouble_ieee754.bind(null, readUintBE, 4, 0);

    })();

    return exports;
}

// uint helpers

function writeUintLE(val, buf, pos) {
    buf[pos    ] =  val        & 255;
    buf[pos + 1] =  val >>> 8  & 255;
    buf[pos + 2] =  val >>> 16 & 255;
    buf[pos + 3] =  val >>> 24;
}

function writeUintBE(val, buf, pos) {
    buf[pos    ] =  val >>> 24;
    buf[pos + 1] =  val >>> 16 & 255;
    buf[pos + 2] =  val >>> 8  & 255;
    buf[pos + 3] =  val        & 255;
}

function readUintLE(buf, pos) {
    return (buf[pos    ]
          | buf[pos + 1] << 8
          | buf[pos + 2] << 16
          | buf[pos + 3] << 24) >>> 0;
}

function readUintBE(buf, pos) {
    return (buf[pos    ] << 24
          | buf[pos + 1] << 16
          | buf[pos + 2] << 8
          | buf[pos + 3]) >>> 0;
}

},{}],17:[function(require,module,exports){
"use strict";
module.exports = inquire;

/**
 * Requires a module only if available.
 * @memberof util
 * @param {string} moduleName Module to require
 * @returns {?Object} Required module if available and not empty, otherwise `null`
 */
function inquire(moduleName) {
    try {
        var mod = eval("quire".replace(/^/,"re"))(moduleName); // eslint-disable-line no-eval
        if (mod && (mod.length || Object.keys(mod).length))
            return mod;
    } catch (e) {} // eslint-disable-line no-empty
    return null;
}

},{}],18:[function(require,module,exports){
"use strict";
module.exports = pool;

/**
 * An allocator as used by {@link util.pool}.
 * @typedef PoolAllocator
 * @type {function}
 * @param {number} size Buffer size
 * @returns {Uint8Array} Buffer
 */

/**
 * A slicer as used by {@link util.pool}.
 * @typedef PoolSlicer
 * @type {function}
 * @param {number} start Start offset
 * @param {number} end End offset
 * @returns {Uint8Array} Buffer slice
 * @this {Uint8Array}
 */

/**
 * A general purpose buffer pool.
 * @memberof util
 * @function
 * @param {PoolAllocator} alloc Allocator
 * @param {PoolSlicer} slice Slicer
 * @param {number} [size=8192] Slab size
 * @returns {PoolAllocator} Pooled allocator
 */
function pool(alloc, slice, size) {
    var SIZE   = size || 8192;
    var MAX    = SIZE >>> 1;
    var slab   = null;
    var offset = SIZE;
    return function pool_alloc(size) {
        if (size < 1 || size > MAX)
            return alloc(size);
        if (offset + size > SIZE) {
            slab = alloc(SIZE);
            offset = 0;
        }
        var buf = slice.call(slab, offset, offset += size);
        if (offset & 7) // align to 32 bit
            offset = (offset | 7) + 1;
        return buf;
    };
}

},{}],19:[function(require,module,exports){
"use strict";

/**
 * A minimal UTF8 implementation for number arrays.
 * @memberof util
 * @namespace
 */
var utf8 = exports;

/**
 * Calculates the UTF8 byte length of a string.
 * @param {string} string String
 * @returns {number} Byte length
 */
utf8.length = function utf8_length(string) {
    var len = 0,
        c = 0;
    for (var i = 0; i < string.length; ++i) {
        c = string.charCodeAt(i);
        if (c < 128)
            len += 1;
        else if (c < 2048)
            len += 2;
        else if ((c & 0xFC00) === 0xD800 && (string.charCodeAt(i + 1) & 0xFC00) === 0xDC00) {
            ++i;
            len += 4;
        } else
            len += 3;
    }
    return len;
};

/**
 * Reads UTF8 bytes as a string.
 * @param {Uint8Array} buffer Source buffer
 * @param {number} start Source start
 * @param {number} end Source end
 * @returns {string} String read
 */
utf8.read = function utf8_read(buffer, start, end) {
    var len = end - start;
    if (len < 1)
        return "";
    var parts = null,
        chunk = [],
        i = 0, // char offset
        t;     // temporary
    while (start < end) {
        t = buffer[start++];
        if (t < 128)
            chunk[i++] = t;
        else if (t > 191 && t < 224)
            chunk[i++] = (t & 31) << 6 | buffer[start++] & 63;
        else if (t > 239 && t < 365) {
            t = ((t & 7) << 18 | (buffer[start++] & 63) << 12 | (buffer[start++] & 63) << 6 | buffer[start++] & 63) - 0x10000;
            chunk[i++] = 0xD800 + (t >> 10);
            chunk[i++] = 0xDC00 + (t & 1023);
        } else
            chunk[i++] = (t & 15) << 12 | (buffer[start++] & 63) << 6 | buffer[start++] & 63;
        if (i > 8191) {
            (parts || (parts = [])).push(String.fromCharCode.apply(String, chunk));
            i = 0;
        }
    }
    if (parts) {
        if (i)
            parts.push(String.fromCharCode.apply(String, chunk.slice(0, i)));
        return parts.join("");
    }
    return String.fromCharCode.apply(String, chunk.slice(0, i));
};

/**
 * Writes a string as UTF8 bytes.
 * @param {string} string Source string
 * @param {Uint8Array} buffer Destination buffer
 * @param {number} offset Destination offset
 * @returns {number} Bytes written
 */
utf8.write = function utf8_write(string, buffer, offset) {
    var start = offset,
        c1, // character 1
        c2; // character 2
    for (var i = 0; i < string.length; ++i) {
        c1 = string.charCodeAt(i);
        if (c1 < 128) {
            buffer[offset++] = c1;
        } else if (c1 < 2048) {
            buffer[offset++] = c1 >> 6       | 192;
            buffer[offset++] = c1       & 63 | 128;
        } else if ((c1 & 0xFC00) === 0xD800 && ((c2 = string.charCodeAt(i + 1)) & 0xFC00) === 0xDC00) {
            c1 = 0x10000 + ((c1 & 0x03FF) << 10) + (c2 & 0x03FF);
            ++i;
            buffer[offset++] = c1 >> 18      | 240;
            buffer[offset++] = c1 >> 12 & 63 | 128;
            buffer[offset++] = c1 >> 6  & 63 | 128;
            buffer[offset++] = c1       & 63 | 128;
        } else {
            buffer[offset++] = c1 >> 12      | 224;
            buffer[offset++] = c1 >> 6  & 63 | 128;
            buffer[offset++] = c1       & 63 | 128;
        }
    }
    return offset - start;
};

},{}],20:[function(require,module,exports){
'use strict'

exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  var i
  for (i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}

},{}],21:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// browserify by default only pulls in files that are hard coded in requires
// In order of last to first in this file, the default wordlist will be chosen
// based on what is present. (Bundles may remove wordlists they don't need)
const wordlists = {};
exports.wordlists = wordlists;
let _default;
exports._default = _default;
try {
    exports._default = _default = require('./wordlists/czech.json');
    wordlists.czech = _default;
}
catch (err) { }
try {
    exports._default = _default = require('./wordlists/chinese_simplified.json');
    wordlists.chinese_simplified = _default;
}
catch (err) { }
try {
    exports._default = _default = require('./wordlists/chinese_traditional.json');
    wordlists.chinese_traditional = _default;
}
catch (err) { }
try {
    exports._default = _default = require('./wordlists/korean.json');
    wordlists.korean = _default;
}
catch (err) { }
try {
    exports._default = _default = require('./wordlists/french.json');
    wordlists.french = _default;
}
catch (err) { }
try {
    exports._default = _default = require('./wordlists/italian.json');
    wordlists.italian = _default;
}
catch (err) { }
try {
    exports._default = _default = require('./wordlists/spanish.json');
    wordlists.spanish = _default;
}
catch (err) { }
try {
    exports._default = _default = require('./wordlists/japanese.json');
    wordlists.japanese = _default;
    wordlists.JA = _default;
}
catch (err) { }
try {
    exports._default = _default = require('./wordlists/portuguese.json');
    wordlists.portuguese = _default;
}
catch (err) { }
try {
    exports._default = _default = require('./wordlists/english.json');
    wordlists.english = _default;
    wordlists.EN = _default;
}
catch (err) { }

},{"./wordlists/chinese_simplified.json":23,"./wordlists/chinese_traditional.json":24,"./wordlists/czech.json":25,"./wordlists/english.json":26,"./wordlists/french.json":27,"./wordlists/italian.json":28,"./wordlists/japanese.json":29,"./wordlists/korean.json":30,"./wordlists/portuguese.json":31,"./wordlists/spanish.json":32}],22:[function(require,module,exports){
(function (Buffer){(function (){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sha256_1 = require("@noble/hashes/sha256");
const sha512_1 = require("@noble/hashes/sha512");
const pbkdf2_1 = require("@noble/hashes/pbkdf2");
const utils_1 = require("@noble/hashes/utils");
const _wordlists_1 = require("./_wordlists");
let DEFAULT_WORDLIST = _wordlists_1._default;
const INVALID_MNEMONIC = 'Invalid mnemonic';
const INVALID_ENTROPY = 'Invalid entropy';
const INVALID_CHECKSUM = 'Invalid mnemonic checksum';
const WORDLIST_REQUIRED = 'A wordlist is required but a default could not be found.\n' +
    'Please pass a 2048 word array explicitly.';
function normalize(str) {
    return (str || '').normalize('NFKD');
}
function lpad(str, padString, length) {
    while (str.length < length) {
        str = padString + str;
    }
    return str;
}
function binaryToByte(bin) {
    return parseInt(bin, 2);
}
function bytesToBinary(bytes) {
    return bytes.map((x) => lpad(x.toString(2), '0', 8)).join('');
}
function deriveChecksumBits(entropyBuffer) {
    const ENT = entropyBuffer.length * 8;
    const CS = ENT / 32;
    const hash = sha256_1.sha256(Uint8Array.from(entropyBuffer));
    return bytesToBinary(Array.from(hash)).slice(0, CS);
}
function salt(password) {
    return 'mnemonic' + (password || '');
}
function mnemonicToSeedSync(mnemonic, password) {
    const mnemonicBuffer = Uint8Array.from(Buffer.from(normalize(mnemonic), 'utf8'));
    const saltBuffer = Uint8Array.from(Buffer.from(salt(normalize(password)), 'utf8'));
    const res = pbkdf2_1.pbkdf2(sha512_1.sha512, mnemonicBuffer, saltBuffer, {
        c: 2048,
        dkLen: 64,
    });
    return Buffer.from(res);
}
exports.mnemonicToSeedSync = mnemonicToSeedSync;
function mnemonicToSeed(mnemonic, password) {
    const mnemonicBuffer = Uint8Array.from(Buffer.from(normalize(mnemonic), 'utf8'));
    const saltBuffer = Uint8Array.from(Buffer.from(salt(normalize(password)), 'utf8'));
    return pbkdf2_1.pbkdf2Async(sha512_1.sha512, mnemonicBuffer, saltBuffer, {
        c: 2048,
        dkLen: 64,
    }).then((res) => Buffer.from(res));
}
exports.mnemonicToSeed = mnemonicToSeed;
function mnemonicToEntropy(mnemonic, wordlist) {
    wordlist = wordlist || DEFAULT_WORDLIST;
    if (!wordlist) {
        throw new Error(WORDLIST_REQUIRED);
    }
    const words = normalize(mnemonic).split(' ');
    if (words.length % 3 !== 0) {
        throw new Error(INVALID_MNEMONIC);
    }
    // convert word indices to 11 bit binary strings
    const bits = words
        .map((word) => {
        const index = wordlist.indexOf(word);
        if (index === -1) {
            throw new Error(INVALID_MNEMONIC);
        }
        return lpad(index.toString(2), '0', 11);
    })
        .join('');
    // split the binary string into ENT/CS
    const dividerIndex = Math.floor(bits.length / 33) * 32;
    const entropyBits = bits.slice(0, dividerIndex);
    const checksumBits = bits.slice(dividerIndex);
    // calculate the checksum and compare
    const entropyBytes = entropyBits.match(/(.{1,8})/g).map(binaryToByte);
    if (entropyBytes.length < 16) {
        throw new Error(INVALID_ENTROPY);
    }
    if (entropyBytes.length > 32) {
        throw new Error(INVALID_ENTROPY);
    }
    if (entropyBytes.length % 4 !== 0) {
        throw new Error(INVALID_ENTROPY);
    }
    const entropy = Buffer.from(entropyBytes);
    const newChecksum = deriveChecksumBits(entropy);
    if (newChecksum !== checksumBits) {
        throw new Error(INVALID_CHECKSUM);
    }
    return entropy.toString('hex');
}
exports.mnemonicToEntropy = mnemonicToEntropy;
function entropyToMnemonic(entropy, wordlist) {
    if (!Buffer.isBuffer(entropy)) {
        entropy = Buffer.from(entropy, 'hex');
    }
    wordlist = wordlist || DEFAULT_WORDLIST;
    if (!wordlist) {
        throw new Error(WORDLIST_REQUIRED);
    }
    // 128 <= ENT <= 256
    if (entropy.length < 16) {
        throw new TypeError(INVALID_ENTROPY);
    }
    if (entropy.length > 32) {
        throw new TypeError(INVALID_ENTROPY);
    }
    if (entropy.length % 4 !== 0) {
        throw new TypeError(INVALID_ENTROPY);
    }
    const entropyBits = bytesToBinary(Array.from(entropy));
    const checksumBits = deriveChecksumBits(entropy);
    const bits = entropyBits + checksumBits;
    const chunks = bits.match(/(.{1,11})/g);
    const words = chunks.map((binary) => {
        const index = binaryToByte(binary);
        return wordlist[index];
    });
    return wordlist[0] === '\u3042\u3044\u3053\u304f\u3057\u3093' // Japanese wordlist
        ? words.join('\u3000')
        : words.join(' ');
}
exports.entropyToMnemonic = entropyToMnemonic;
function generateMnemonic(strength, rng, wordlist) {
    strength = strength || 128;
    if (strength % 32 !== 0) {
        throw new TypeError(INVALID_ENTROPY);
    }
    rng = rng || ((size) => Buffer.from(utils_1.randomBytes(size)));
    return entropyToMnemonic(rng(strength / 8), wordlist);
}
exports.generateMnemonic = generateMnemonic;
function validateMnemonic(mnemonic, wordlist) {
    try {
        mnemonicToEntropy(mnemonic, wordlist);
    }
    catch (e) {
        return false;
    }
    return true;
}
exports.validateMnemonic = validateMnemonic;
function setDefaultWordlist(language) {
    const result = _wordlists_1.wordlists[language];
    if (result) {
        DEFAULT_WORDLIST = result;
    }
    else {
        throw new Error('Could not find wordlist for language "' + language + '"');
    }
}
exports.setDefaultWordlist = setDefaultWordlist;
function getDefaultWordlist() {
    if (!DEFAULT_WORDLIST) {
        throw new Error('No Default Wordlist set');
    }
    return Object.keys(_wordlists_1.wordlists).filter((lang) => {
        if (lang === 'JA' || lang === 'EN') {
            return false;
        }
        return _wordlists_1.wordlists[lang].every((word, index) => word === DEFAULT_WORDLIST[index]);
    })[0];
}
exports.getDefaultWordlist = getDefaultWordlist;
var _wordlists_2 = require("./_wordlists");
exports.wordlists = _wordlists_2.wordlists;

}).call(this)}).call(this,require("buffer").Buffer)
},{"./_wordlists":21,"@noble/hashes/pbkdf2":9,"@noble/hashes/sha256":10,"@noble/hashes/sha512":11,"@noble/hashes/utils":12,"buffer":33}],23:[function(require,module,exports){
module.exports=[
    "的",
    "一",
    "是",
    "在",
    "不",
    "了",
    "有",
    "和",
    "人",
    "这",
    "中",
    "大",
    "为",
    "上",
    "个",
    "国",
    "我",
    "以",
    "要",
    "他",
    "时",
    "来",
    "用",
    "们",
    "生",
    "到",
    "作",
    "地",
    "于",
    "出",
    "就",
    "分",
    "对",
    "成",
    "会",
    "可",
    "主",
    "发",
    "年",
    "动",
    "同",
    "工",
    "也",
    "能",
    "下",
    "过",
    "子",
    "说",
    "产",
    "种",
    "面",
    "而",
    "方",
    "后",
    "多",
    "定",
    "行",
    "学",
    "法",
    "所",
    "民",
    "得",
    "经",
    "十",
    "三",
    "之",
    "进",
    "着",
    "等",
    "部",
    "度",
    "家",
    "电",
    "力",
    "里",
    "如",
    "水",
    "化",
    "高",
    "自",
    "二",
    "理",
    "起",
    "小",
    "物",
    "现",
    "实",
    "加",
    "量",
    "都",
    "两",
    "体",
    "制",
    "机",
    "当",
    "使",
    "点",
    "从",
    "业",
    "本",
    "去",
    "把",
    "性",
    "好",
    "应",
    "开",
    "它",
    "合",
    "还",
    "因",
    "由",
    "其",
    "些",
    "然",
    "前",
    "外",
    "天",
    "政",
    "四",
    "日",
    "那",
    "社",
    "义",
    "事",
    "平",
    "形",
    "相",
    "全",
    "表",
    "间",
    "样",
    "与",
    "关",
    "各",
    "重",
    "新",
    "线",
    "内",
    "数",
    "正",
    "心",
    "反",
    "你",
    "明",
    "看",
    "原",
    "又",
    "么",
    "利",
    "比",
    "或",
    "但",
    "质",
    "气",
    "第",
    "向",
    "道",
    "命",
    "此",
    "变",
    "条",
    "只",
    "没",
    "结",
    "解",
    "问",
    "意",
    "建",
    "月",
    "公",
    "无",
    "系",
    "军",
    "很",
    "情",
    "者",
    "最",
    "立",
    "代",
    "想",
    "已",
    "通",
    "并",
    "提",
    "直",
    "题",
    "党",
    "程",
    "展",
    "五",
    "果",
    "料",
    "象",
    "员",
    "革",
    "位",
    "入",
    "常",
    "文",
    "总",
    "次",
    "品",
    "式",
    "活",
    "设",
    "及",
    "管",
    "特",
    "件",
    "长",
    "求",
    "老",
    "头",
    "基",
    "资",
    "边",
    "流",
    "路",
    "级",
    "少",
    "图",
    "山",
    "统",
    "接",
    "知",
    "较",
    "将",
    "组",
    "见",
    "计",
    "别",
    "她",
    "手",
    "角",
    "期",
    "根",
    "论",
    "运",
    "农",
    "指",
    "几",
    "九",
    "区",
    "强",
    "放",
    "决",
    "西",
    "被",
    "干",
    "做",
    "必",
    "战",
    "先",
    "回",
    "则",
    "任",
    "取",
    "据",
    "处",
    "队",
    "南",
    "给",
    "色",
    "光",
    "门",
    "即",
    "保",
    "治",
    "北",
    "造",
    "百",
    "规",
    "热",
    "领",
    "七",
    "海",
    "口",
    "东",
    "导",
    "器",
    "压",
    "志",
    "世",
    "金",
    "增",
    "争",
    "济",
    "阶",
    "油",
    "思",
    "术",
    "极",
    "交",
    "受",
    "联",
    "什",
    "认",
    "六",
    "共",
    "权",
    "收",
    "证",
    "改",
    "清",
    "美",
    "再",
    "采",
    "转",
    "更",
    "单",
    "风",
    "切",
    "打",
    "白",
    "教",
    "速",
    "花",
    "带",
    "安",
    "场",
    "身",
    "车",
    "例",
    "真",
    "务",
    "具",
    "万",
    "每",
    "目",
    "至",
    "达",
    "走",
    "积",
    "示",
    "议",
    "声",
    "报",
    "斗",
    "完",
    "类",
    "八",
    "离",
    "华",
    "名",
    "确",
    "才",
    "科",
    "张",
    "信",
    "马",
    "节",
    "话",
    "米",
    "整",
    "空",
    "元",
    "况",
    "今",
    "集",
    "温",
    "传",
    "土",
    "许",
    "步",
    "群",
    "广",
    "石",
    "记",
    "需",
    "段",
    "研",
    "界",
    "拉",
    "林",
    "律",
    "叫",
    "且",
    "究",
    "观",
    "越",
    "织",
    "装",
    "影",
    "算",
    "低",
    "持",
    "音",
    "众",
    "书",
    "布",
    "复",
    "容",
    "儿",
    "须",
    "际",
    "商",
    "非",
    "验",
    "连",
    "断",
    "深",
    "难",
    "近",
    "矿",
    "千",
    "周",
    "委",
    "素",
    "技",
    "备",
    "半",
    "办",
    "青",
    "省",
    "列",
    "习",
    "响",
    "约",
    "支",
    "般",
    "史",
    "感",
    "劳",
    "便",
    "团",
    "往",
    "酸",
    "历",
    "市",
    "克",
    "何",
    "除",
    "消",
    "构",
    "府",
    "称",
    "太",
    "准",
    "精",
    "值",
    "号",
    "率",
    "族",
    "维",
    "划",
    "选",
    "标",
    "写",
    "存",
    "候",
    "毛",
    "亲",
    "快",
    "效",
    "斯",
    "院",
    "查",
    "江",
    "型",
    "眼",
    "王",
    "按",
    "格",
    "养",
    "易",
    "置",
    "派",
    "层",
    "片",
    "始",
    "却",
    "专",
    "状",
    "育",
    "厂",
    "京",
    "识",
    "适",
    "属",
    "圆",
    "包",
    "火",
    "住",
    "调",
    "满",
    "县",
    "局",
    "照",
    "参",
    "红",
    "细",
    "引",
    "听",
    "该",
    "铁",
    "价",
    "严",
    "首",
    "底",
    "液",
    "官",
    "德",
    "随",
    "病",
    "苏",
    "失",
    "尔",
    "死",
    "讲",
    "配",
    "女",
    "黄",
    "推",
    "显",
    "谈",
    "罪",
    "神",
    "艺",
    "呢",
    "席",
    "含",
    "企",
    "望",
    "密",
    "批",
    "营",
    "项",
    "防",
    "举",
    "球",
    "英",
    "氧",
    "势",
    "告",
    "李",
    "台",
    "落",
    "木",
    "帮",
    "轮",
    "破",
    "亚",
    "师",
    "围",
    "注",
    "远",
    "字",
    "材",
    "排",
    "供",
    "河",
    "态",
    "封",
    "另",
    "施",
    "减",
    "树",
    "溶",
    "怎",
    "止",
    "案",
    "言",
    "士",
    "均",
    "武",
    "固",
    "叶",
    "鱼",
    "波",
    "视",
    "仅",
    "费",
    "紧",
    "爱",
    "左",
    "章",
    "早",
    "朝",
    "害",
    "续",
    "轻",
    "服",
    "试",
    "食",
    "充",
    "兵",
    "源",
    "判",
    "护",
    "司",
    "足",
    "某",
    "练",
    "差",
    "致",
    "板",
    "田",
    "降",
    "黑",
    "犯",
    "负",
    "击",
    "范",
    "继",
    "兴",
    "似",
    "余",
    "坚",
    "曲",
    "输",
    "修",
    "故",
    "城",
    "夫",
    "够",
    "送",
    "笔",
    "船",
    "占",
    "右",
    "财",
    "吃",
    "富",
    "春",
    "职",
    "觉",
    "汉",
    "画",
    "功",
    "巴",
    "跟",
    "虽",
    "杂",
    "飞",
    "检",
    "吸",
    "助",
    "升",
    "阳",
    "互",
    "初",
    "创",
    "抗",
    "考",
    "投",
    "坏",
    "策",
    "古",
    "径",
    "换",
    "未",
    "跑",
    "留",
    "钢",
    "曾",
    "端",
    "责",
    "站",
    "简",
    "述",
    "钱",
    "副",
    "尽",
    "帝",
    "射",
    "草",
    "冲",
    "承",
    "独",
    "令",
    "限",
    "阿",
    "宣",
    "环",
    "双",
    "请",
    "超",
    "微",
    "让",
    "控",
    "州",
    "良",
    "轴",
    "找",
    "否",
    "纪",
    "益",
    "依",
    "优",
    "顶",
    "础",
    "载",
    "倒",
    "房",
    "突",
    "坐",
    "粉",
    "敌",
    "略",
    "客",
    "袁",
    "冷",
    "胜",
    "绝",
    "析",
    "块",
    "剂",
    "测",
    "丝",
    "协",
    "诉",
    "念",
    "陈",
    "仍",
    "罗",
    "盐",
    "友",
    "洋",
    "错",
    "苦",
    "夜",
    "刑",
    "移",
    "频",
    "逐",
    "靠",
    "混",
    "母",
    "短",
    "皮",
    "终",
    "聚",
    "汽",
    "村",
    "云",
    "哪",
    "既",
    "距",
    "卫",
    "停",
    "烈",
    "央",
    "察",
    "烧",
    "迅",
    "境",
    "若",
    "印",
    "洲",
    "刻",
    "括",
    "激",
    "孔",
    "搞",
    "甚",
    "室",
    "待",
    "核",
    "校",
    "散",
    "侵",
    "吧",
    "甲",
    "游",
    "久",
    "菜",
    "味",
    "旧",
    "模",
    "湖",
    "货",
    "损",
    "预",
    "阻",
    "毫",
    "普",
    "稳",
    "乙",
    "妈",
    "植",
    "息",
    "扩",
    "银",
    "语",
    "挥",
    "酒",
    "守",
    "拿",
    "序",
    "纸",
    "医",
    "缺",
    "雨",
    "吗",
    "针",
    "刘",
    "啊",
    "急",
    "唱",
    "误",
    "训",
    "愿",
    "审",
    "附",
    "获",
    "茶",
    "鲜",
    "粮",
    "斤",
    "孩",
    "脱",
    "硫",
    "肥",
    "善",
    "龙",
    "演",
    "父",
    "渐",
    "血",
    "欢",
    "械",
    "掌",
    "歌",
    "沙",
    "刚",
    "攻",
    "谓",
    "盾",
    "讨",
    "晚",
    "粒",
    "乱",
    "燃",
    "矛",
    "乎",
    "杀",
    "药",
    "宁",
    "鲁",
    "贵",
    "钟",
    "煤",
    "读",
    "班",
    "伯",
    "香",
    "介",
    "迫",
    "句",
    "丰",
    "培",
    "握",
    "兰",
    "担",
    "弦",
    "蛋",
    "沉",
    "假",
    "穿",
    "执",
    "答",
    "乐",
    "谁",
    "顺",
    "烟",
    "缩",
    "征",
    "脸",
    "喜",
    "松",
    "脚",
    "困",
    "异",
    "免",
    "背",
    "星",
    "福",
    "买",
    "染",
    "井",
    "概",
    "慢",
    "怕",
    "磁",
    "倍",
    "祖",
    "皇",
    "促",
    "静",
    "补",
    "评",
    "翻",
    "肉",
    "践",
    "尼",
    "衣",
    "宽",
    "扬",
    "棉",
    "希",
    "伤",
    "操",
    "垂",
    "秋",
    "宜",
    "氢",
    "套",
    "督",
    "振",
    "架",
    "亮",
    "末",
    "宪",
    "庆",
    "编",
    "牛",
    "触",
    "映",
    "雷",
    "销",
    "诗",
    "座",
    "居",
    "抓",
    "裂",
    "胞",
    "呼",
    "娘",
    "景",
    "威",
    "绿",
    "晶",
    "厚",
    "盟",
    "衡",
    "鸡",
    "孙",
    "延",
    "危",
    "胶",
    "屋",
    "乡",
    "临",
    "陆",
    "顾",
    "掉",
    "呀",
    "灯",
    "岁",
    "措",
    "束",
    "耐",
    "剧",
    "玉",
    "赵",
    "跳",
    "哥",
    "季",
    "课",
    "凯",
    "胡",
    "额",
    "款",
    "绍",
    "卷",
    "齐",
    "伟",
    "蒸",
    "殖",
    "永",
    "宗",
    "苗",
    "川",
    "炉",
    "岩",
    "弱",
    "零",
    "杨",
    "奏",
    "沿",
    "露",
    "杆",
    "探",
    "滑",
    "镇",
    "饭",
    "浓",
    "航",
    "怀",
    "赶",
    "库",
    "夺",
    "伊",
    "灵",
    "税",
    "途",
    "灭",
    "赛",
    "归",
    "召",
    "鼓",
    "播",
    "盘",
    "裁",
    "险",
    "康",
    "唯",
    "录",
    "菌",
    "纯",
    "借",
    "糖",
    "盖",
    "横",
    "符",
    "私",
    "努",
    "堂",
    "域",
    "枪",
    "润",
    "幅",
    "哈",
    "竟",
    "熟",
    "虫",
    "泽",
    "脑",
    "壤",
    "碳",
    "欧",
    "遍",
    "侧",
    "寨",
    "敢",
    "彻",
    "虑",
    "斜",
    "薄",
    "庭",
    "纳",
    "弹",
    "饲",
    "伸",
    "折",
    "麦",
    "湿",
    "暗",
    "荷",
    "瓦",
    "塞",
    "床",
    "筑",
    "恶",
    "户",
    "访",
    "塔",
    "奇",
    "透",
    "梁",
    "刀",
    "旋",
    "迹",
    "卡",
    "氯",
    "遇",
    "份",
    "毒",
    "泥",
    "退",
    "洗",
    "摆",
    "灰",
    "彩",
    "卖",
    "耗",
    "夏",
    "择",
    "忙",
    "铜",
    "献",
    "硬",
    "予",
    "繁",
    "圈",
    "雪",
    "函",
    "亦",
    "抽",
    "篇",
    "阵",
    "阴",
    "丁",
    "尺",
    "追",
    "堆",
    "雄",
    "迎",
    "泛",
    "爸",
    "楼",
    "避",
    "谋",
    "吨",
    "野",
    "猪",
    "旗",
    "累",
    "偏",
    "典",
    "馆",
    "索",
    "秦",
    "脂",
    "潮",
    "爷",
    "豆",
    "忽",
    "托",
    "惊",
    "塑",
    "遗",
    "愈",
    "朱",
    "替",
    "纤",
    "粗",
    "倾",
    "尚",
    "痛",
    "楚",
    "谢",
    "奋",
    "购",
    "磨",
    "君",
    "池",
    "旁",
    "碎",
    "骨",
    "监",
    "捕",
    "弟",
    "暴",
    "割",
    "贯",
    "殊",
    "释",
    "词",
    "亡",
    "壁",
    "顿",
    "宝",
    "午",
    "尘",
    "闻",
    "揭",
    "炮",
    "残",
    "冬",
    "桥",
    "妇",
    "警",
    "综",
    "招",
    "吴",
    "付",
    "浮",
    "遭",
    "徐",
    "您",
    "摇",
    "谷",
    "赞",
    "箱",
    "隔",
    "订",
    "男",
    "吹",
    "园",
    "纷",
    "唐",
    "败",
    "宋",
    "玻",
    "巨",
    "耕",
    "坦",
    "荣",
    "闭",
    "湾",
    "键",
    "凡",
    "驻",
    "锅",
    "救",
    "恩",
    "剥",
    "凝",
    "碱",
    "齿",
    "截",
    "炼",
    "麻",
    "纺",
    "禁",
    "废",
    "盛",
    "版",
    "缓",
    "净",
    "睛",
    "昌",
    "婚",
    "涉",
    "筒",
    "嘴",
    "插",
    "岸",
    "朗",
    "庄",
    "街",
    "藏",
    "姑",
    "贸",
    "腐",
    "奴",
    "啦",
    "惯",
    "乘",
    "伙",
    "恢",
    "匀",
    "纱",
    "扎",
    "辩",
    "耳",
    "彪",
    "臣",
    "亿",
    "璃",
    "抵",
    "脉",
    "秀",
    "萨",
    "俄",
    "网",
    "舞",
    "店",
    "喷",
    "纵",
    "寸",
    "汗",
    "挂",
    "洪",
    "贺",
    "闪",
    "柬",
    "爆",
    "烯",
    "津",
    "稻",
    "墙",
    "软",
    "勇",
    "像",
    "滚",
    "厘",
    "蒙",
    "芳",
    "肯",
    "坡",
    "柱",
    "荡",
    "腿",
    "仪",
    "旅",
    "尾",
    "轧",
    "冰",
    "贡",
    "登",
    "黎",
    "削",
    "钻",
    "勒",
    "逃",
    "障",
    "氨",
    "郭",
    "峰",
    "币",
    "港",
    "伏",
    "轨",
    "亩",
    "毕",
    "擦",
    "莫",
    "刺",
    "浪",
    "秘",
    "援",
    "株",
    "健",
    "售",
    "股",
    "岛",
    "甘",
    "泡",
    "睡",
    "童",
    "铸",
    "汤",
    "阀",
    "休",
    "汇",
    "舍",
    "牧",
    "绕",
    "炸",
    "哲",
    "磷",
    "绩",
    "朋",
    "淡",
    "尖",
    "启",
    "陷",
    "柴",
    "呈",
    "徒",
    "颜",
    "泪",
    "稍",
    "忘",
    "泵",
    "蓝",
    "拖",
    "洞",
    "授",
    "镜",
    "辛",
    "壮",
    "锋",
    "贫",
    "虚",
    "弯",
    "摩",
    "泰",
    "幼",
    "廷",
    "尊",
    "窗",
    "纲",
    "弄",
    "隶",
    "疑",
    "氏",
    "宫",
    "姐",
    "震",
    "瑞",
    "怪",
    "尤",
    "琴",
    "循",
    "描",
    "膜",
    "违",
    "夹",
    "腰",
    "缘",
    "珠",
    "穷",
    "森",
    "枝",
    "竹",
    "沟",
    "催",
    "绳",
    "忆",
    "邦",
    "剩",
    "幸",
    "浆",
    "栏",
    "拥",
    "牙",
    "贮",
    "礼",
    "滤",
    "钠",
    "纹",
    "罢",
    "拍",
    "咱",
    "喊",
    "袖",
    "埃",
    "勤",
    "罚",
    "焦",
    "潜",
    "伍",
    "墨",
    "欲",
    "缝",
    "姓",
    "刊",
    "饱",
    "仿",
    "奖",
    "铝",
    "鬼",
    "丽",
    "跨",
    "默",
    "挖",
    "链",
    "扫",
    "喝",
    "袋",
    "炭",
    "污",
    "幕",
    "诸",
    "弧",
    "励",
    "梅",
    "奶",
    "洁",
    "灾",
    "舟",
    "鉴",
    "苯",
    "讼",
    "抱",
    "毁",
    "懂",
    "寒",
    "智",
    "埔",
    "寄",
    "届",
    "跃",
    "渡",
    "挑",
    "丹",
    "艰",
    "贝",
    "碰",
    "拔",
    "爹",
    "戴",
    "码",
    "梦",
    "芽",
    "熔",
    "赤",
    "渔",
    "哭",
    "敬",
    "颗",
    "奔",
    "铅",
    "仲",
    "虎",
    "稀",
    "妹",
    "乏",
    "珍",
    "申",
    "桌",
    "遵",
    "允",
    "隆",
    "螺",
    "仓",
    "魏",
    "锐",
    "晓",
    "氮",
    "兼",
    "隐",
    "碍",
    "赫",
    "拨",
    "忠",
    "肃",
    "缸",
    "牵",
    "抢",
    "博",
    "巧",
    "壳",
    "兄",
    "杜",
    "讯",
    "诚",
    "碧",
    "祥",
    "柯",
    "页",
    "巡",
    "矩",
    "悲",
    "灌",
    "龄",
    "伦",
    "票",
    "寻",
    "桂",
    "铺",
    "圣",
    "恐",
    "恰",
    "郑",
    "趣",
    "抬",
    "荒",
    "腾",
    "贴",
    "柔",
    "滴",
    "猛",
    "阔",
    "辆",
    "妻",
    "填",
    "撤",
    "储",
    "签",
    "闹",
    "扰",
    "紫",
    "砂",
    "递",
    "戏",
    "吊",
    "陶",
    "伐",
    "喂",
    "疗",
    "瓶",
    "婆",
    "抚",
    "臂",
    "摸",
    "忍",
    "虾",
    "蜡",
    "邻",
    "胸",
    "巩",
    "挤",
    "偶",
    "弃",
    "槽",
    "劲",
    "乳",
    "邓",
    "吉",
    "仁",
    "烂",
    "砖",
    "租",
    "乌",
    "舰",
    "伴",
    "瓜",
    "浅",
    "丙",
    "暂",
    "燥",
    "橡",
    "柳",
    "迷",
    "暖",
    "牌",
    "秧",
    "胆",
    "详",
    "簧",
    "踏",
    "瓷",
    "谱",
    "呆",
    "宾",
    "糊",
    "洛",
    "辉",
    "愤",
    "竞",
    "隙",
    "怒",
    "粘",
    "乃",
    "绪",
    "肩",
    "籍",
    "敏",
    "涂",
    "熙",
    "皆",
    "侦",
    "悬",
    "掘",
    "享",
    "纠",
    "醒",
    "狂",
    "锁",
    "淀",
    "恨",
    "牲",
    "霸",
    "爬",
    "赏",
    "逆",
    "玩",
    "陵",
    "祝",
    "秒",
    "浙",
    "貌",
    "役",
    "彼",
    "悉",
    "鸭",
    "趋",
    "凤",
    "晨",
    "畜",
    "辈",
    "秩",
    "卵",
    "署",
    "梯",
    "炎",
    "滩",
    "棋",
    "驱",
    "筛",
    "峡",
    "冒",
    "啥",
    "寿",
    "译",
    "浸",
    "泉",
    "帽",
    "迟",
    "硅",
    "疆",
    "贷",
    "漏",
    "稿",
    "冠",
    "嫩",
    "胁",
    "芯",
    "牢",
    "叛",
    "蚀",
    "奥",
    "鸣",
    "岭",
    "羊",
    "凭",
    "串",
    "塘",
    "绘",
    "酵",
    "融",
    "盆",
    "锡",
    "庙",
    "筹",
    "冻",
    "辅",
    "摄",
    "袭",
    "筋",
    "拒",
    "僚",
    "旱",
    "钾",
    "鸟",
    "漆",
    "沈",
    "眉",
    "疏",
    "添",
    "棒",
    "穗",
    "硝",
    "韩",
    "逼",
    "扭",
    "侨",
    "凉",
    "挺",
    "碗",
    "栽",
    "炒",
    "杯",
    "患",
    "馏",
    "劝",
    "豪",
    "辽",
    "勃",
    "鸿",
    "旦",
    "吏",
    "拜",
    "狗",
    "埋",
    "辊",
    "掩",
    "饮",
    "搬",
    "骂",
    "辞",
    "勾",
    "扣",
    "估",
    "蒋",
    "绒",
    "雾",
    "丈",
    "朵",
    "姆",
    "拟",
    "宇",
    "辑",
    "陕",
    "雕",
    "偿",
    "蓄",
    "崇",
    "剪",
    "倡",
    "厅",
    "咬",
    "驶",
    "薯",
    "刷",
    "斥",
    "番",
    "赋",
    "奉",
    "佛",
    "浇",
    "漫",
    "曼",
    "扇",
    "钙",
    "桃",
    "扶",
    "仔",
    "返",
    "俗",
    "亏",
    "腔",
    "鞋",
    "棱",
    "覆",
    "框",
    "悄",
    "叔",
    "撞",
    "骗",
    "勘",
    "旺",
    "沸",
    "孤",
    "吐",
    "孟",
    "渠",
    "屈",
    "疾",
    "妙",
    "惜",
    "仰",
    "狠",
    "胀",
    "谐",
    "抛",
    "霉",
    "桑",
    "岗",
    "嘛",
    "衰",
    "盗",
    "渗",
    "脏",
    "赖",
    "涌",
    "甜",
    "曹",
    "阅",
    "肌",
    "哩",
    "厉",
    "烃",
    "纬",
    "毅",
    "昨",
    "伪",
    "症",
    "煮",
    "叹",
    "钉",
    "搭",
    "茎",
    "笼",
    "酷",
    "偷",
    "弓",
    "锥",
    "恒",
    "杰",
    "坑",
    "鼻",
    "翼",
    "纶",
    "叙",
    "狱",
    "逮",
    "罐",
    "络",
    "棚",
    "抑",
    "膨",
    "蔬",
    "寺",
    "骤",
    "穆",
    "冶",
    "枯",
    "册",
    "尸",
    "凸",
    "绅",
    "坯",
    "牺",
    "焰",
    "轰",
    "欣",
    "晋",
    "瘦",
    "御",
    "锭",
    "锦",
    "丧",
    "旬",
    "锻",
    "垄",
    "搜",
    "扑",
    "邀",
    "亭",
    "酯",
    "迈",
    "舒",
    "脆",
    "酶",
    "闲",
    "忧",
    "酚",
    "顽",
    "羽",
    "涨",
    "卸",
    "仗",
    "陪",
    "辟",
    "惩",
    "杭",
    "姚",
    "肚",
    "捉",
    "飘",
    "漂",
    "昆",
    "欺",
    "吾",
    "郎",
    "烷",
    "汁",
    "呵",
    "饰",
    "萧",
    "雅",
    "邮",
    "迁",
    "燕",
    "撒",
    "姻",
    "赴",
    "宴",
    "烦",
    "债",
    "帐",
    "斑",
    "铃",
    "旨",
    "醇",
    "董",
    "饼",
    "雏",
    "姿",
    "拌",
    "傅",
    "腹",
    "妥",
    "揉",
    "贤",
    "拆",
    "歪",
    "葡",
    "胺",
    "丢",
    "浩",
    "徽",
    "昂",
    "垫",
    "挡",
    "览",
    "贪",
    "慰",
    "缴",
    "汪",
    "慌",
    "冯",
    "诺",
    "姜",
    "谊",
    "凶",
    "劣",
    "诬",
    "耀",
    "昏",
    "躺",
    "盈",
    "骑",
    "乔",
    "溪",
    "丛",
    "卢",
    "抹",
    "闷",
    "咨",
    "刮",
    "驾",
    "缆",
    "悟",
    "摘",
    "铒",
    "掷",
    "颇",
    "幻",
    "柄",
    "惠",
    "惨",
    "佳",
    "仇",
    "腊",
    "窝",
    "涤",
    "剑",
    "瞧",
    "堡",
    "泼",
    "葱",
    "罩",
    "霍",
    "捞",
    "胎",
    "苍",
    "滨",
    "俩",
    "捅",
    "湘",
    "砍",
    "霞",
    "邵",
    "萄",
    "疯",
    "淮",
    "遂",
    "熊",
    "粪",
    "烘",
    "宿",
    "档",
    "戈",
    "驳",
    "嫂",
    "裕",
    "徙",
    "箭",
    "捐",
    "肠",
    "撑",
    "晒",
    "辨",
    "殿",
    "莲",
    "摊",
    "搅",
    "酱",
    "屏",
    "疫",
    "哀",
    "蔡",
    "堵",
    "沫",
    "皱",
    "畅",
    "叠",
    "阁",
    "莱",
    "敲",
    "辖",
    "钩",
    "痕",
    "坝",
    "巷",
    "饿",
    "祸",
    "丘",
    "玄",
    "溜",
    "曰",
    "逻",
    "彭",
    "尝",
    "卿",
    "妨",
    "艇",
    "吞",
    "韦",
    "怨",
    "矮",
    "歇"
]

},{}],24:[function(require,module,exports){
module.exports=[
    "的",
    "一",
    "是",
    "在",
    "不",
    "了",
    "有",
    "和",
    "人",
    "這",
    "中",
    "大",
    "為",
    "上",
    "個",
    "國",
    "我",
    "以",
    "要",
    "他",
    "時",
    "來",
    "用",
    "們",
    "生",
    "到",
    "作",
    "地",
    "於",
    "出",
    "就",
    "分",
    "對",
    "成",
    "會",
    "可",
    "主",
    "發",
    "年",
    "動",
    "同",
    "工",
    "也",
    "能",
    "下",
    "過",
    "子",
    "說",
    "產",
    "種",
    "面",
    "而",
    "方",
    "後",
    "多",
    "定",
    "行",
    "學",
    "法",
    "所",
    "民",
    "得",
    "經",
    "十",
    "三",
    "之",
    "進",
    "著",
    "等",
    "部",
    "度",
    "家",
    "電",
    "力",
    "裡",
    "如",
    "水",
    "化",
    "高",
    "自",
    "二",
    "理",
    "起",
    "小",
    "物",
    "現",
    "實",
    "加",
    "量",
    "都",
    "兩",
    "體",
    "制",
    "機",
    "當",
    "使",
    "點",
    "從",
    "業",
    "本",
    "去",
    "把",
    "性",
    "好",
    "應",
    "開",
    "它",
    "合",
    "還",
    "因",
    "由",
    "其",
    "些",
    "然",
    "前",
    "外",
    "天",
    "政",
    "四",
    "日",
    "那",
    "社",
    "義",
    "事",
    "平",
    "形",
    "相",
    "全",
    "表",
    "間",
    "樣",
    "與",
    "關",
    "各",
    "重",
    "新",
    "線",
    "內",
    "數",
    "正",
    "心",
    "反",
    "你",
    "明",
    "看",
    "原",
    "又",
    "麼",
    "利",
    "比",
    "或",
    "但",
    "質",
    "氣",
    "第",
    "向",
    "道",
    "命",
    "此",
    "變",
    "條",
    "只",
    "沒",
    "結",
    "解",
    "問",
    "意",
    "建",
    "月",
    "公",
    "無",
    "系",
    "軍",
    "很",
    "情",
    "者",
    "最",
    "立",
    "代",
    "想",
    "已",
    "通",
    "並",
    "提",
    "直",
    "題",
    "黨",
    "程",
    "展",
    "五",
    "果",
    "料",
    "象",
    "員",
    "革",
    "位",
    "入",
    "常",
    "文",
    "總",
    "次",
    "品",
    "式",
    "活",
    "設",
    "及",
    "管",
    "特",
    "件",
    "長",
    "求",
    "老",
    "頭",
    "基",
    "資",
    "邊",
    "流",
    "路",
    "級",
    "少",
    "圖",
    "山",
    "統",
    "接",
    "知",
    "較",
    "將",
    "組",
    "見",
    "計",
    "別",
    "她",
    "手",
    "角",
    "期",
    "根",
    "論",
    "運",
    "農",
    "指",
    "幾",
    "九",
    "區",
    "強",
    "放",
    "決",
    "西",
    "被",
    "幹",
    "做",
    "必",
    "戰",
    "先",
    "回",
    "則",
    "任",
    "取",
    "據",
    "處",
    "隊",
    "南",
    "給",
    "色",
    "光",
    "門",
    "即",
    "保",
    "治",
    "北",
    "造",
    "百",
    "規",
    "熱",
    "領",
    "七",
    "海",
    "口",
    "東",
    "導",
    "器",
    "壓",
    "志",
    "世",
    "金",
    "增",
    "爭",
    "濟",
    "階",
    "油",
    "思",
    "術",
    "極",
    "交",
    "受",
    "聯",
    "什",
    "認",
    "六",
    "共",
    "權",
    "收",
    "證",
    "改",
    "清",
    "美",
    "再",
    "採",
    "轉",
    "更",
    "單",
    "風",
    "切",
    "打",
    "白",
    "教",
    "速",
    "花",
    "帶",
    "安",
    "場",
    "身",
    "車",
    "例",
    "真",
    "務",
    "具",
    "萬",
    "每",
    "目",
    "至",
    "達",
    "走",
    "積",
    "示",
    "議",
    "聲",
    "報",
    "鬥",
    "完",
    "類",
    "八",
    "離",
    "華",
    "名",
    "確",
    "才",
    "科",
    "張",
    "信",
    "馬",
    "節",
    "話",
    "米",
    "整",
    "空",
    "元",
    "況",
    "今",
    "集",
    "溫",
    "傳",
    "土",
    "許",
    "步",
    "群",
    "廣",
    "石",
    "記",
    "需",
    "段",
    "研",
    "界",
    "拉",
    "林",
    "律",
    "叫",
    "且",
    "究",
    "觀",
    "越",
    "織",
    "裝",
    "影",
    "算",
    "低",
    "持",
    "音",
    "眾",
    "書",
    "布",
    "复",
    "容",
    "兒",
    "須",
    "際",
    "商",
    "非",
    "驗",
    "連",
    "斷",
    "深",
    "難",
    "近",
    "礦",
    "千",
    "週",
    "委",
    "素",
    "技",
    "備",
    "半",
    "辦",
    "青",
    "省",
    "列",
    "習",
    "響",
    "約",
    "支",
    "般",
    "史",
    "感",
    "勞",
    "便",
    "團",
    "往",
    "酸",
    "歷",
    "市",
    "克",
    "何",
    "除",
    "消",
    "構",
    "府",
    "稱",
    "太",
    "準",
    "精",
    "值",
    "號",
    "率",
    "族",
    "維",
    "劃",
    "選",
    "標",
    "寫",
    "存",
    "候",
    "毛",
    "親",
    "快",
    "效",
    "斯",
    "院",
    "查",
    "江",
    "型",
    "眼",
    "王",
    "按",
    "格",
    "養",
    "易",
    "置",
    "派",
    "層",
    "片",
    "始",
    "卻",
    "專",
    "狀",
    "育",
    "廠",
    "京",
    "識",
    "適",
    "屬",
    "圓",
    "包",
    "火",
    "住",
    "調",
    "滿",
    "縣",
    "局",
    "照",
    "參",
    "紅",
    "細",
    "引",
    "聽",
    "該",
    "鐵",
    "價",
    "嚴",
    "首",
    "底",
    "液",
    "官",
    "德",
    "隨",
    "病",
    "蘇",
    "失",
    "爾",
    "死",
    "講",
    "配",
    "女",
    "黃",
    "推",
    "顯",
    "談",
    "罪",
    "神",
    "藝",
    "呢",
    "席",
    "含",
    "企",
    "望",
    "密",
    "批",
    "營",
    "項",
    "防",
    "舉",
    "球",
    "英",
    "氧",
    "勢",
    "告",
    "李",
    "台",
    "落",
    "木",
    "幫",
    "輪",
    "破",
    "亞",
    "師",
    "圍",
    "注",
    "遠",
    "字",
    "材",
    "排",
    "供",
    "河",
    "態",
    "封",
    "另",
    "施",
    "減",
    "樹",
    "溶",
    "怎",
    "止",
    "案",
    "言",
    "士",
    "均",
    "武",
    "固",
    "葉",
    "魚",
    "波",
    "視",
    "僅",
    "費",
    "緊",
    "愛",
    "左",
    "章",
    "早",
    "朝",
    "害",
    "續",
    "輕",
    "服",
    "試",
    "食",
    "充",
    "兵",
    "源",
    "判",
    "護",
    "司",
    "足",
    "某",
    "練",
    "差",
    "致",
    "板",
    "田",
    "降",
    "黑",
    "犯",
    "負",
    "擊",
    "范",
    "繼",
    "興",
    "似",
    "餘",
    "堅",
    "曲",
    "輸",
    "修",
    "故",
    "城",
    "夫",
    "夠",
    "送",
    "筆",
    "船",
    "佔",
    "右",
    "財",
    "吃",
    "富",
    "春",
    "職",
    "覺",
    "漢",
    "畫",
    "功",
    "巴",
    "跟",
    "雖",
    "雜",
    "飛",
    "檢",
    "吸",
    "助",
    "昇",
    "陽",
    "互",
    "初",
    "創",
    "抗",
    "考",
    "投",
    "壞",
    "策",
    "古",
    "徑",
    "換",
    "未",
    "跑",
    "留",
    "鋼",
    "曾",
    "端",
    "責",
    "站",
    "簡",
    "述",
    "錢",
    "副",
    "盡",
    "帝",
    "射",
    "草",
    "衝",
    "承",
    "獨",
    "令",
    "限",
    "阿",
    "宣",
    "環",
    "雙",
    "請",
    "超",
    "微",
    "讓",
    "控",
    "州",
    "良",
    "軸",
    "找",
    "否",
    "紀",
    "益",
    "依",
    "優",
    "頂",
    "礎",
    "載",
    "倒",
    "房",
    "突",
    "坐",
    "粉",
    "敵",
    "略",
    "客",
    "袁",
    "冷",
    "勝",
    "絕",
    "析",
    "塊",
    "劑",
    "測",
    "絲",
    "協",
    "訴",
    "念",
    "陳",
    "仍",
    "羅",
    "鹽",
    "友",
    "洋",
    "錯",
    "苦",
    "夜",
    "刑",
    "移",
    "頻",
    "逐",
    "靠",
    "混",
    "母",
    "短",
    "皮",
    "終",
    "聚",
    "汽",
    "村",
    "雲",
    "哪",
    "既",
    "距",
    "衛",
    "停",
    "烈",
    "央",
    "察",
    "燒",
    "迅",
    "境",
    "若",
    "印",
    "洲",
    "刻",
    "括",
    "激",
    "孔",
    "搞",
    "甚",
    "室",
    "待",
    "核",
    "校",
    "散",
    "侵",
    "吧",
    "甲",
    "遊",
    "久",
    "菜",
    "味",
    "舊",
    "模",
    "湖",
    "貨",
    "損",
    "預",
    "阻",
    "毫",
    "普",
    "穩",
    "乙",
    "媽",
    "植",
    "息",
    "擴",
    "銀",
    "語",
    "揮",
    "酒",
    "守",
    "拿",
    "序",
    "紙",
    "醫",
    "缺",
    "雨",
    "嗎",
    "針",
    "劉",
    "啊",
    "急",
    "唱",
    "誤",
    "訓",
    "願",
    "審",
    "附",
    "獲",
    "茶",
    "鮮",
    "糧",
    "斤",
    "孩",
    "脫",
    "硫",
    "肥",
    "善",
    "龍",
    "演",
    "父",
    "漸",
    "血",
    "歡",
    "械",
    "掌",
    "歌",
    "沙",
    "剛",
    "攻",
    "謂",
    "盾",
    "討",
    "晚",
    "粒",
    "亂",
    "燃",
    "矛",
    "乎",
    "殺",
    "藥",
    "寧",
    "魯",
    "貴",
    "鐘",
    "煤",
    "讀",
    "班",
    "伯",
    "香",
    "介",
    "迫",
    "句",
    "豐",
    "培",
    "握",
    "蘭",
    "擔",
    "弦",
    "蛋",
    "沉",
    "假",
    "穿",
    "執",
    "答",
    "樂",
    "誰",
    "順",
    "煙",
    "縮",
    "徵",
    "臉",
    "喜",
    "松",
    "腳",
    "困",
    "異",
    "免",
    "背",
    "星",
    "福",
    "買",
    "染",
    "井",
    "概",
    "慢",
    "怕",
    "磁",
    "倍",
    "祖",
    "皇",
    "促",
    "靜",
    "補",
    "評",
    "翻",
    "肉",
    "踐",
    "尼",
    "衣",
    "寬",
    "揚",
    "棉",
    "希",
    "傷",
    "操",
    "垂",
    "秋",
    "宜",
    "氫",
    "套",
    "督",
    "振",
    "架",
    "亮",
    "末",
    "憲",
    "慶",
    "編",
    "牛",
    "觸",
    "映",
    "雷",
    "銷",
    "詩",
    "座",
    "居",
    "抓",
    "裂",
    "胞",
    "呼",
    "娘",
    "景",
    "威",
    "綠",
    "晶",
    "厚",
    "盟",
    "衡",
    "雞",
    "孫",
    "延",
    "危",
    "膠",
    "屋",
    "鄉",
    "臨",
    "陸",
    "顧",
    "掉",
    "呀",
    "燈",
    "歲",
    "措",
    "束",
    "耐",
    "劇",
    "玉",
    "趙",
    "跳",
    "哥",
    "季",
    "課",
    "凱",
    "胡",
    "額",
    "款",
    "紹",
    "卷",
    "齊",
    "偉",
    "蒸",
    "殖",
    "永",
    "宗",
    "苗",
    "川",
    "爐",
    "岩",
    "弱",
    "零",
    "楊",
    "奏",
    "沿",
    "露",
    "桿",
    "探",
    "滑",
    "鎮",
    "飯",
    "濃",
    "航",
    "懷",
    "趕",
    "庫",
    "奪",
    "伊",
    "靈",
    "稅",
    "途",
    "滅",
    "賽",
    "歸",
    "召",
    "鼓",
    "播",
    "盤",
    "裁",
    "險",
    "康",
    "唯",
    "錄",
    "菌",
    "純",
    "借",
    "糖",
    "蓋",
    "橫",
    "符",
    "私",
    "努",
    "堂",
    "域",
    "槍",
    "潤",
    "幅",
    "哈",
    "竟",
    "熟",
    "蟲",
    "澤",
    "腦",
    "壤",
    "碳",
    "歐",
    "遍",
    "側",
    "寨",
    "敢",
    "徹",
    "慮",
    "斜",
    "薄",
    "庭",
    "納",
    "彈",
    "飼",
    "伸",
    "折",
    "麥",
    "濕",
    "暗",
    "荷",
    "瓦",
    "塞",
    "床",
    "築",
    "惡",
    "戶",
    "訪",
    "塔",
    "奇",
    "透",
    "梁",
    "刀",
    "旋",
    "跡",
    "卡",
    "氯",
    "遇",
    "份",
    "毒",
    "泥",
    "退",
    "洗",
    "擺",
    "灰",
    "彩",
    "賣",
    "耗",
    "夏",
    "擇",
    "忙",
    "銅",
    "獻",
    "硬",
    "予",
    "繁",
    "圈",
    "雪",
    "函",
    "亦",
    "抽",
    "篇",
    "陣",
    "陰",
    "丁",
    "尺",
    "追",
    "堆",
    "雄",
    "迎",
    "泛",
    "爸",
    "樓",
    "避",
    "謀",
    "噸",
    "野",
    "豬",
    "旗",
    "累",
    "偏",
    "典",
    "館",
    "索",
    "秦",
    "脂",
    "潮",
    "爺",
    "豆",
    "忽",
    "托",
    "驚",
    "塑",
    "遺",
    "愈",
    "朱",
    "替",
    "纖",
    "粗",
    "傾",
    "尚",
    "痛",
    "楚",
    "謝",
    "奮",
    "購",
    "磨",
    "君",
    "池",
    "旁",
    "碎",
    "骨",
    "監",
    "捕",
    "弟",
    "暴",
    "割",
    "貫",
    "殊",
    "釋",
    "詞",
    "亡",
    "壁",
    "頓",
    "寶",
    "午",
    "塵",
    "聞",
    "揭",
    "炮",
    "殘",
    "冬",
    "橋",
    "婦",
    "警",
    "綜",
    "招",
    "吳",
    "付",
    "浮",
    "遭",
    "徐",
    "您",
    "搖",
    "谷",
    "贊",
    "箱",
    "隔",
    "訂",
    "男",
    "吹",
    "園",
    "紛",
    "唐",
    "敗",
    "宋",
    "玻",
    "巨",
    "耕",
    "坦",
    "榮",
    "閉",
    "灣",
    "鍵",
    "凡",
    "駐",
    "鍋",
    "救",
    "恩",
    "剝",
    "凝",
    "鹼",
    "齒",
    "截",
    "煉",
    "麻",
    "紡",
    "禁",
    "廢",
    "盛",
    "版",
    "緩",
    "淨",
    "睛",
    "昌",
    "婚",
    "涉",
    "筒",
    "嘴",
    "插",
    "岸",
    "朗",
    "莊",
    "街",
    "藏",
    "姑",
    "貿",
    "腐",
    "奴",
    "啦",
    "慣",
    "乘",
    "夥",
    "恢",
    "勻",
    "紗",
    "扎",
    "辯",
    "耳",
    "彪",
    "臣",
    "億",
    "璃",
    "抵",
    "脈",
    "秀",
    "薩",
    "俄",
    "網",
    "舞",
    "店",
    "噴",
    "縱",
    "寸",
    "汗",
    "掛",
    "洪",
    "賀",
    "閃",
    "柬",
    "爆",
    "烯",
    "津",
    "稻",
    "牆",
    "軟",
    "勇",
    "像",
    "滾",
    "厘",
    "蒙",
    "芳",
    "肯",
    "坡",
    "柱",
    "盪",
    "腿",
    "儀",
    "旅",
    "尾",
    "軋",
    "冰",
    "貢",
    "登",
    "黎",
    "削",
    "鑽",
    "勒",
    "逃",
    "障",
    "氨",
    "郭",
    "峰",
    "幣",
    "港",
    "伏",
    "軌",
    "畝",
    "畢",
    "擦",
    "莫",
    "刺",
    "浪",
    "秘",
    "援",
    "株",
    "健",
    "售",
    "股",
    "島",
    "甘",
    "泡",
    "睡",
    "童",
    "鑄",
    "湯",
    "閥",
    "休",
    "匯",
    "舍",
    "牧",
    "繞",
    "炸",
    "哲",
    "磷",
    "績",
    "朋",
    "淡",
    "尖",
    "啟",
    "陷",
    "柴",
    "呈",
    "徒",
    "顏",
    "淚",
    "稍",
    "忘",
    "泵",
    "藍",
    "拖",
    "洞",
    "授",
    "鏡",
    "辛",
    "壯",
    "鋒",
    "貧",
    "虛",
    "彎",
    "摩",
    "泰",
    "幼",
    "廷",
    "尊",
    "窗",
    "綱",
    "弄",
    "隸",
    "疑",
    "氏",
    "宮",
    "姐",
    "震",
    "瑞",
    "怪",
    "尤",
    "琴",
    "循",
    "描",
    "膜",
    "違",
    "夾",
    "腰",
    "緣",
    "珠",
    "窮",
    "森",
    "枝",
    "竹",
    "溝",
    "催",
    "繩",
    "憶",
    "邦",
    "剩",
    "幸",
    "漿",
    "欄",
    "擁",
    "牙",
    "貯",
    "禮",
    "濾",
    "鈉",
    "紋",
    "罷",
    "拍",
    "咱",
    "喊",
    "袖",
    "埃",
    "勤",
    "罰",
    "焦",
    "潛",
    "伍",
    "墨",
    "欲",
    "縫",
    "姓",
    "刊",
    "飽",
    "仿",
    "獎",
    "鋁",
    "鬼",
    "麗",
    "跨",
    "默",
    "挖",
    "鏈",
    "掃",
    "喝",
    "袋",
    "炭",
    "污",
    "幕",
    "諸",
    "弧",
    "勵",
    "梅",
    "奶",
    "潔",
    "災",
    "舟",
    "鑑",
    "苯",
    "訟",
    "抱",
    "毀",
    "懂",
    "寒",
    "智",
    "埔",
    "寄",
    "屆",
    "躍",
    "渡",
    "挑",
    "丹",
    "艱",
    "貝",
    "碰",
    "拔",
    "爹",
    "戴",
    "碼",
    "夢",
    "芽",
    "熔",
    "赤",
    "漁",
    "哭",
    "敬",
    "顆",
    "奔",
    "鉛",
    "仲",
    "虎",
    "稀",
    "妹",
    "乏",
    "珍",
    "申",
    "桌",
    "遵",
    "允",
    "隆",
    "螺",
    "倉",
    "魏",
    "銳",
    "曉",
    "氮",
    "兼",
    "隱",
    "礙",
    "赫",
    "撥",
    "忠",
    "肅",
    "缸",
    "牽",
    "搶",
    "博",
    "巧",
    "殼",
    "兄",
    "杜",
    "訊",
    "誠",
    "碧",
    "祥",
    "柯",
    "頁",
    "巡",
    "矩",
    "悲",
    "灌",
    "齡",
    "倫",
    "票",
    "尋",
    "桂",
    "鋪",
    "聖",
    "恐",
    "恰",
    "鄭",
    "趣",
    "抬",
    "荒",
    "騰",
    "貼",
    "柔",
    "滴",
    "猛",
    "闊",
    "輛",
    "妻",
    "填",
    "撤",
    "儲",
    "簽",
    "鬧",
    "擾",
    "紫",
    "砂",
    "遞",
    "戲",
    "吊",
    "陶",
    "伐",
    "餵",
    "療",
    "瓶",
    "婆",
    "撫",
    "臂",
    "摸",
    "忍",
    "蝦",
    "蠟",
    "鄰",
    "胸",
    "鞏",
    "擠",
    "偶",
    "棄",
    "槽",
    "勁",
    "乳",
    "鄧",
    "吉",
    "仁",
    "爛",
    "磚",
    "租",
    "烏",
    "艦",
    "伴",
    "瓜",
    "淺",
    "丙",
    "暫",
    "燥",
    "橡",
    "柳",
    "迷",
    "暖",
    "牌",
    "秧",
    "膽",
    "詳",
    "簧",
    "踏",
    "瓷",
    "譜",
    "呆",
    "賓",
    "糊",
    "洛",
    "輝",
    "憤",
    "競",
    "隙",
    "怒",
    "粘",
    "乃",
    "緒",
    "肩",
    "籍",
    "敏",
    "塗",
    "熙",
    "皆",
    "偵",
    "懸",
    "掘",
    "享",
    "糾",
    "醒",
    "狂",
    "鎖",
    "淀",
    "恨",
    "牲",
    "霸",
    "爬",
    "賞",
    "逆",
    "玩",
    "陵",
    "祝",
    "秒",
    "浙",
    "貌",
    "役",
    "彼",
    "悉",
    "鴨",
    "趨",
    "鳳",
    "晨",
    "畜",
    "輩",
    "秩",
    "卵",
    "署",
    "梯",
    "炎",
    "灘",
    "棋",
    "驅",
    "篩",
    "峽",
    "冒",
    "啥",
    "壽",
    "譯",
    "浸",
    "泉",
    "帽",
    "遲",
    "矽",
    "疆",
    "貸",
    "漏",
    "稿",
    "冠",
    "嫩",
    "脅",
    "芯",
    "牢",
    "叛",
    "蝕",
    "奧",
    "鳴",
    "嶺",
    "羊",
    "憑",
    "串",
    "塘",
    "繪",
    "酵",
    "融",
    "盆",
    "錫",
    "廟",
    "籌",
    "凍",
    "輔",
    "攝",
    "襲",
    "筋",
    "拒",
    "僚",
    "旱",
    "鉀",
    "鳥",
    "漆",
    "沈",
    "眉",
    "疏",
    "添",
    "棒",
    "穗",
    "硝",
    "韓",
    "逼",
    "扭",
    "僑",
    "涼",
    "挺",
    "碗",
    "栽",
    "炒",
    "杯",
    "患",
    "餾",
    "勸",
    "豪",
    "遼",
    "勃",
    "鴻",
    "旦",
    "吏",
    "拜",
    "狗",
    "埋",
    "輥",
    "掩",
    "飲",
    "搬",
    "罵",
    "辭",
    "勾",
    "扣",
    "估",
    "蔣",
    "絨",
    "霧",
    "丈",
    "朵",
    "姆",
    "擬",
    "宇",
    "輯",
    "陝",
    "雕",
    "償",
    "蓄",
    "崇",
    "剪",
    "倡",
    "廳",
    "咬",
    "駛",
    "薯",
    "刷",
    "斥",
    "番",
    "賦",
    "奉",
    "佛",
    "澆",
    "漫",
    "曼",
    "扇",
    "鈣",
    "桃",
    "扶",
    "仔",
    "返",
    "俗",
    "虧",
    "腔",
    "鞋",
    "棱",
    "覆",
    "框",
    "悄",
    "叔",
    "撞",
    "騙",
    "勘",
    "旺",
    "沸",
    "孤",
    "吐",
    "孟",
    "渠",
    "屈",
    "疾",
    "妙",
    "惜",
    "仰",
    "狠",
    "脹",
    "諧",
    "拋",
    "黴",
    "桑",
    "崗",
    "嘛",
    "衰",
    "盜",
    "滲",
    "臟",
    "賴",
    "湧",
    "甜",
    "曹",
    "閱",
    "肌",
    "哩",
    "厲",
    "烴",
    "緯",
    "毅",
    "昨",
    "偽",
    "症",
    "煮",
    "嘆",
    "釘",
    "搭",
    "莖",
    "籠",
    "酷",
    "偷",
    "弓",
    "錐",
    "恆",
    "傑",
    "坑",
    "鼻",
    "翼",
    "綸",
    "敘",
    "獄",
    "逮",
    "罐",
    "絡",
    "棚",
    "抑",
    "膨",
    "蔬",
    "寺",
    "驟",
    "穆",
    "冶",
    "枯",
    "冊",
    "屍",
    "凸",
    "紳",
    "坯",
    "犧",
    "焰",
    "轟",
    "欣",
    "晉",
    "瘦",
    "禦",
    "錠",
    "錦",
    "喪",
    "旬",
    "鍛",
    "壟",
    "搜",
    "撲",
    "邀",
    "亭",
    "酯",
    "邁",
    "舒",
    "脆",
    "酶",
    "閒",
    "憂",
    "酚",
    "頑",
    "羽",
    "漲",
    "卸",
    "仗",
    "陪",
    "闢",
    "懲",
    "杭",
    "姚",
    "肚",
    "捉",
    "飄",
    "漂",
    "昆",
    "欺",
    "吾",
    "郎",
    "烷",
    "汁",
    "呵",
    "飾",
    "蕭",
    "雅",
    "郵",
    "遷",
    "燕",
    "撒",
    "姻",
    "赴",
    "宴",
    "煩",
    "債",
    "帳",
    "斑",
    "鈴",
    "旨",
    "醇",
    "董",
    "餅",
    "雛",
    "姿",
    "拌",
    "傅",
    "腹",
    "妥",
    "揉",
    "賢",
    "拆",
    "歪",
    "葡",
    "胺",
    "丟",
    "浩",
    "徽",
    "昂",
    "墊",
    "擋",
    "覽",
    "貪",
    "慰",
    "繳",
    "汪",
    "慌",
    "馮",
    "諾",
    "姜",
    "誼",
    "兇",
    "劣",
    "誣",
    "耀",
    "昏",
    "躺",
    "盈",
    "騎",
    "喬",
    "溪",
    "叢",
    "盧",
    "抹",
    "悶",
    "諮",
    "刮",
    "駕",
    "纜",
    "悟",
    "摘",
    "鉺",
    "擲",
    "頗",
    "幻",
    "柄",
    "惠",
    "慘",
    "佳",
    "仇",
    "臘",
    "窩",
    "滌",
    "劍",
    "瞧",
    "堡",
    "潑",
    "蔥",
    "罩",
    "霍",
    "撈",
    "胎",
    "蒼",
    "濱",
    "倆",
    "捅",
    "湘",
    "砍",
    "霞",
    "邵",
    "萄",
    "瘋",
    "淮",
    "遂",
    "熊",
    "糞",
    "烘",
    "宿",
    "檔",
    "戈",
    "駁",
    "嫂",
    "裕",
    "徙",
    "箭",
    "捐",
    "腸",
    "撐",
    "曬",
    "辨",
    "殿",
    "蓮",
    "攤",
    "攪",
    "醬",
    "屏",
    "疫",
    "哀",
    "蔡",
    "堵",
    "沫",
    "皺",
    "暢",
    "疊",
    "閣",
    "萊",
    "敲",
    "轄",
    "鉤",
    "痕",
    "壩",
    "巷",
    "餓",
    "禍",
    "丘",
    "玄",
    "溜",
    "曰",
    "邏",
    "彭",
    "嘗",
    "卿",
    "妨",
    "艇",
    "吞",
    "韋",
    "怨",
    "矮",
    "歇"
]

},{}],25:[function(require,module,exports){
module.exports=[
    "abdikace",
    "abeceda",
    "adresa",
    "agrese",
    "akce",
    "aktovka",
    "alej",
    "alkohol",
    "amputace",
    "ananas",
    "andulka",
    "anekdota",
    "anketa",
    "antika",
    "anulovat",
    "archa",
    "arogance",
    "asfalt",
    "asistent",
    "aspirace",
    "astma",
    "astronom",
    "atlas",
    "atletika",
    "atol",
    "autobus",
    "azyl",
    "babka",
    "bachor",
    "bacil",
    "baculka",
    "badatel",
    "bageta",
    "bagr",
    "bahno",
    "bakterie",
    "balada",
    "baletka",
    "balkon",
    "balonek",
    "balvan",
    "balza",
    "bambus",
    "bankomat",
    "barbar",
    "baret",
    "barman",
    "baroko",
    "barva",
    "baterka",
    "batoh",
    "bavlna",
    "bazalka",
    "bazilika",
    "bazuka",
    "bedna",
    "beran",
    "beseda",
    "bestie",
    "beton",
    "bezinka",
    "bezmoc",
    "beztak",
    "bicykl",
    "bidlo",
    "biftek",
    "bikiny",
    "bilance",
    "biograf",
    "biolog",
    "bitva",
    "bizon",
    "blahobyt",
    "blatouch",
    "blecha",
    "bledule",
    "blesk",
    "blikat",
    "blizna",
    "blokovat",
    "bloudit",
    "blud",
    "bobek",
    "bobr",
    "bodlina",
    "bodnout",
    "bohatost",
    "bojkot",
    "bojovat",
    "bokorys",
    "bolest",
    "borec",
    "borovice",
    "bota",
    "boubel",
    "bouchat",
    "bouda",
    "boule",
    "bourat",
    "boxer",
    "bradavka",
    "brambora",
    "branka",
    "bratr",
    "brepta",
    "briketa",
    "brko",
    "brloh",
    "bronz",
    "broskev",
    "brunetka",
    "brusinka",
    "brzda",
    "brzy",
    "bublina",
    "bubnovat",
    "buchta",
    "buditel",
    "budka",
    "budova",
    "bufet",
    "bujarost",
    "bukvice",
    "buldok",
    "bulva",
    "bunda",
    "bunkr",
    "burza",
    "butik",
    "buvol",
    "buzola",
    "bydlet",
    "bylina",
    "bytovka",
    "bzukot",
    "capart",
    "carevna",
    "cedr",
    "cedule",
    "cejch",
    "cejn",
    "cela",
    "celer",
    "celkem",
    "celnice",
    "cenina",
    "cennost",
    "cenovka",
    "centrum",
    "cenzor",
    "cestopis",
    "cetka",
    "chalupa",
    "chapadlo",
    "charita",
    "chata",
    "chechtat",
    "chemie",
    "chichot",
    "chirurg",
    "chlad",
    "chleba",
    "chlubit",
    "chmel",
    "chmura",
    "chobot",
    "chochol",
    "chodba",
    "cholera",
    "chomout",
    "chopit",
    "choroba",
    "chov",
    "chrapot",
    "chrlit",
    "chrt",
    "chrup",
    "chtivost",
    "chudina",
    "chutnat",
    "chvat",
    "chvilka",
    "chvost",
    "chyba",
    "chystat",
    "chytit",
    "cibule",
    "cigareta",
    "cihelna",
    "cihla",
    "cinkot",
    "cirkus",
    "cisterna",
    "citace",
    "citrus",
    "cizinec",
    "cizost",
    "clona",
    "cokoliv",
    "couvat",
    "ctitel",
    "ctnost",
    "cudnost",
    "cuketa",
    "cukr",
    "cupot",
    "cvaknout",
    "cval",
    "cvik",
    "cvrkot",
    "cyklista",
    "daleko",
    "dareba",
    "datel",
    "datum",
    "dcera",
    "debata",
    "dechovka",
    "decibel",
    "deficit",
    "deflace",
    "dekl",
    "dekret",
    "demokrat",
    "deprese",
    "derby",
    "deska",
    "detektiv",
    "dikobraz",
    "diktovat",
    "dioda",
    "diplom",
    "disk",
    "displej",
    "divadlo",
    "divoch",
    "dlaha",
    "dlouho",
    "dluhopis",
    "dnes",
    "dobro",
    "dobytek",
    "docent",
    "dochutit",
    "dodnes",
    "dohled",
    "dohoda",
    "dohra",
    "dojem",
    "dojnice",
    "doklad",
    "dokola",
    "doktor",
    "dokument",
    "dolar",
    "doleva",
    "dolina",
    "doma",
    "dominant",
    "domluvit",
    "domov",
    "donutit",
    "dopad",
    "dopis",
    "doplnit",
    "doposud",
    "doprovod",
    "dopustit",
    "dorazit",
    "dorost",
    "dort",
    "dosah",
    "doslov",
    "dostatek",
    "dosud",
    "dosyta",
    "dotaz",
    "dotek",
    "dotknout",
    "doufat",
    "doutnat",
    "dovozce",
    "dozadu",
    "doznat",
    "dozorce",
    "drahota",
    "drak",
    "dramatik",
    "dravec",
    "draze",
    "drdol",
    "drobnost",
    "drogerie",
    "drozd",
    "drsnost",
    "drtit",
    "drzost",
    "duben",
    "duchovno",
    "dudek",
    "duha",
    "duhovka",
    "dusit",
    "dusno",
    "dutost",
    "dvojice",
    "dvorec",
    "dynamit",
    "ekolog",
    "ekonomie",
    "elektron",
    "elipsa",
    "email",
    "emise",
    "emoce",
    "empatie",
    "epizoda",
    "epocha",
    "epopej",
    "epos",
    "esej",
    "esence",
    "eskorta",
    "eskymo",
    "etiketa",
    "euforie",
    "evoluce",
    "exekuce",
    "exkurze",
    "expedice",
    "exploze",
    "export",
    "extrakt",
    "facka",
    "fajfka",
    "fakulta",
    "fanatik",
    "fantazie",
    "farmacie",
    "favorit",
    "fazole",
    "federace",
    "fejeton",
    "fenka",
    "fialka",
    "figurant",
    "filozof",
    "filtr",
    "finance",
    "finta",
    "fixace",
    "fjord",
    "flanel",
    "flirt",
    "flotila",
    "fond",
    "fosfor",
    "fotbal",
    "fotka",
    "foton",
    "frakce",
    "freska",
    "fronta",
    "fukar",
    "funkce",
    "fyzika",
    "galeje",
    "garant",
    "genetika",
    "geolog",
    "gilotina",
    "glazura",
    "glejt",
    "golem",
    "golfista",
    "gotika",
    "graf",
    "gramofon",
    "granule",
    "grep",
    "gril",
    "grog",
    "groteska",
    "guma",
    "hadice",
    "hadr",
    "hala",
    "halenka",
    "hanba",
    "hanopis",
    "harfa",
    "harpuna",
    "havran",
    "hebkost",
    "hejkal",
    "hejno",
    "hejtman",
    "hektar",
    "helma",
    "hematom",
    "herec",
    "herna",
    "heslo",
    "hezky",
    "historik",
    "hladovka",
    "hlasivky",
    "hlava",
    "hledat",
    "hlen",
    "hlodavec",
    "hloh",
    "hloupost",
    "hltat",
    "hlubina",
    "hluchota",
    "hmat",
    "hmota",
    "hmyz",
    "hnis",
    "hnojivo",
    "hnout",
    "hoblina",
    "hoboj",
    "hoch",
    "hodiny",
    "hodlat",
    "hodnota",
    "hodovat",
    "hojnost",
    "hokej",
    "holinka",
    "holka",
    "holub",
    "homole",
    "honitba",
    "honorace",
    "horal",
    "horda",
    "horizont",
    "horko",
    "horlivec",
    "hormon",
    "hornina",
    "horoskop",
    "horstvo",
    "hospoda",
    "hostina",
    "hotovost",
    "houba",
    "houf",
    "houpat",
    "houska",
    "hovor",
    "hradba",
    "hranice",
    "hravost",
    "hrazda",
    "hrbolek",
    "hrdina",
    "hrdlo",
    "hrdost",
    "hrnek",
    "hrobka",
    "hromada",
    "hrot",
    "hrouda",
    "hrozen",
    "hrstka",
    "hrubost",
    "hryzat",
    "hubenost",
    "hubnout",
    "hudba",
    "hukot",
    "humr",
    "husita",
    "hustota",
    "hvozd",
    "hybnost",
    "hydrant",
    "hygiena",
    "hymna",
    "hysterik",
    "idylka",
    "ihned",
    "ikona",
    "iluze",
    "imunita",
    "infekce",
    "inflace",
    "inkaso",
    "inovace",
    "inspekce",
    "internet",
    "invalida",
    "investor",
    "inzerce",
    "ironie",
    "jablko",
    "jachta",
    "jahoda",
    "jakmile",
    "jakost",
    "jalovec",
    "jantar",
    "jarmark",
    "jaro",
    "jasan",
    "jasno",
    "jatka",
    "javor",
    "jazyk",
    "jedinec",
    "jedle",
    "jednatel",
    "jehlan",
    "jekot",
    "jelen",
    "jelito",
    "jemnost",
    "jenom",
    "jepice",
    "jeseter",
    "jevit",
    "jezdec",
    "jezero",
    "jinak",
    "jindy",
    "jinoch",
    "jiskra",
    "jistota",
    "jitrnice",
    "jizva",
    "jmenovat",
    "jogurt",
    "jurta",
    "kabaret",
    "kabel",
    "kabinet",
    "kachna",
    "kadet",
    "kadidlo",
    "kahan",
    "kajak",
    "kajuta",
    "kakao",
    "kaktus",
    "kalamita",
    "kalhoty",
    "kalibr",
    "kalnost",
    "kamera",
    "kamkoliv",
    "kamna",
    "kanibal",
    "kanoe",
    "kantor",
    "kapalina",
    "kapela",
    "kapitola",
    "kapka",
    "kaple",
    "kapota",
    "kapr",
    "kapusta",
    "kapybara",
    "karamel",
    "karotka",
    "karton",
    "kasa",
    "katalog",
    "katedra",
    "kauce",
    "kauza",
    "kavalec",
    "kazajka",
    "kazeta",
    "kazivost",
    "kdekoliv",
    "kdesi",
    "kedluben",
    "kemp",
    "keramika",
    "kino",
    "klacek",
    "kladivo",
    "klam",
    "klapot",
    "klasika",
    "klaun",
    "klec",
    "klenba",
    "klepat",
    "klesnout",
    "klid",
    "klima",
    "klisna",
    "klobouk",
    "klokan",
    "klopa",
    "kloub",
    "klubovna",
    "klusat",
    "kluzkost",
    "kmen",
    "kmitat",
    "kmotr",
    "kniha",
    "knot",
    "koalice",
    "koberec",
    "kobka",
    "kobliha",
    "kobyla",
    "kocour",
    "kohout",
    "kojenec",
    "kokos",
    "koktejl",
    "kolaps",
    "koleda",
    "kolize",
    "kolo",
    "komando",
    "kometa",
    "komik",
    "komnata",
    "komora",
    "kompas",
    "komunita",
    "konat",
    "koncept",
    "kondice",
    "konec",
    "konfese",
    "kongres",
    "konina",
    "konkurs",
    "kontakt",
    "konzerva",
    "kopanec",
    "kopie",
    "kopnout",
    "koprovka",
    "korbel",
    "korektor",
    "kormidlo",
    "koroptev",
    "korpus",
    "koruna",
    "koryto",
    "korzet",
    "kosatec",
    "kostka",
    "kotel",
    "kotleta",
    "kotoul",
    "koukat",
    "koupelna",
    "kousek",
    "kouzlo",
    "kovboj",
    "koza",
    "kozoroh",
    "krabice",
    "krach",
    "krajina",
    "kralovat",
    "krasopis",
    "kravata",
    "kredit",
    "krejcar",
    "kresba",
    "kreveta",
    "kriket",
    "kritik",
    "krize",
    "krkavec",
    "krmelec",
    "krmivo",
    "krocan",
    "krok",
    "kronika",
    "kropit",
    "kroupa",
    "krovka",
    "krtek",
    "kruhadlo",
    "krupice",
    "krutost",
    "krvinka",
    "krychle",
    "krypta",
    "krystal",
    "kryt",
    "kudlanka",
    "kufr",
    "kujnost",
    "kukla",
    "kulajda",
    "kulich",
    "kulka",
    "kulomet",
    "kultura",
    "kuna",
    "kupodivu",
    "kurt",
    "kurzor",
    "kutil",
    "kvalita",
    "kvasinka",
    "kvestor",
    "kynolog",
    "kyselina",
    "kytara",
    "kytice",
    "kytka",
    "kytovec",
    "kyvadlo",
    "labrador",
    "lachtan",
    "ladnost",
    "laik",
    "lakomec",
    "lamela",
    "lampa",
    "lanovka",
    "lasice",
    "laso",
    "lastura",
    "latinka",
    "lavina",
    "lebka",
    "leckdy",
    "leden",
    "lednice",
    "ledovka",
    "ledvina",
    "legenda",
    "legie",
    "legrace",
    "lehce",
    "lehkost",
    "lehnout",
    "lektvar",
    "lenochod",
    "lentilka",
    "lepenka",
    "lepidlo",
    "letadlo",
    "letec",
    "letmo",
    "letokruh",
    "levhart",
    "levitace",
    "levobok",
    "libra",
    "lichotka",
    "lidojed",
    "lidskost",
    "lihovina",
    "lijavec",
    "lilek",
    "limetka",
    "linie",
    "linka",
    "linoleum",
    "listopad",
    "litina",
    "litovat",
    "lobista",
    "lodivod",
    "logika",
    "logoped",
    "lokalita",
    "loket",
    "lomcovat",
    "lopata",
    "lopuch",
    "lord",
    "losos",
    "lotr",
    "loudal",
    "louh",
    "louka",
    "louskat",
    "lovec",
    "lstivost",
    "lucerna",
    "lucifer",
    "lump",
    "lusk",
    "lustrace",
    "lvice",
    "lyra",
    "lyrika",
    "lysina",
    "madam",
    "madlo",
    "magistr",
    "mahagon",
    "majetek",
    "majitel",
    "majorita",
    "makak",
    "makovice",
    "makrela",
    "malba",
    "malina",
    "malovat",
    "malvice",
    "maminka",
    "mandle",
    "manko",
    "marnost",
    "masakr",
    "maskot",
    "masopust",
    "matice",
    "matrika",
    "maturita",
    "mazanec",
    "mazivo",
    "mazlit",
    "mazurka",
    "mdloba",
    "mechanik",
    "meditace",
    "medovina",
    "melasa",
    "meloun",
    "mentolka",
    "metla",
    "metoda",
    "metr",
    "mezera",
    "migrace",
    "mihnout",
    "mihule",
    "mikina",
    "mikrofon",
    "milenec",
    "milimetr",
    "milost",
    "mimika",
    "mincovna",
    "minibar",
    "minomet",
    "minulost",
    "miska",
    "mistr",
    "mixovat",
    "mladost",
    "mlha",
    "mlhovina",
    "mlok",
    "mlsat",
    "mluvit",
    "mnich",
    "mnohem",
    "mobil",
    "mocnost",
    "modelka",
    "modlitba",
    "mohyla",
    "mokro",
    "molekula",
    "momentka",
    "monarcha",
    "monokl",
    "monstrum",
    "montovat",
    "monzun",
    "mosaz",
    "moskyt",
    "most",
    "motivace",
    "motorka",
    "motyka",
    "moucha",
    "moudrost",
    "mozaika",
    "mozek",
    "mozol",
    "mramor",
    "mravenec",
    "mrkev",
    "mrtvola",
    "mrzet",
    "mrzutost",
    "mstitel",
    "mudrc",
    "muflon",
    "mulat",
    "mumie",
    "munice",
    "muset",
    "mutace",
    "muzeum",
    "muzikant",
    "myslivec",
    "mzda",
    "nabourat",
    "nachytat",
    "nadace",
    "nadbytek",
    "nadhoz",
    "nadobro",
    "nadpis",
    "nahlas",
    "nahnat",
    "nahodile",
    "nahradit",
    "naivita",
    "najednou",
    "najisto",
    "najmout",
    "naklonit",
    "nakonec",
    "nakrmit",
    "nalevo",
    "namazat",
    "namluvit",
    "nanometr",
    "naoko",
    "naopak",
    "naostro",
    "napadat",
    "napevno",
    "naplnit",
    "napnout",
    "naposled",
    "naprosto",
    "narodit",
    "naruby",
    "narychlo",
    "nasadit",
    "nasekat",
    "naslepo",
    "nastat",
    "natolik",
    "navenek",
    "navrch",
    "navzdory",
    "nazvat",
    "nebe",
    "nechat",
    "necky",
    "nedaleko",
    "nedbat",
    "neduh",
    "negace",
    "nehet",
    "nehoda",
    "nejen",
    "nejprve",
    "neklid",
    "nelibost",
    "nemilost",
    "nemoc",
    "neochota",
    "neonka",
    "nepokoj",
    "nerost",
    "nerv",
    "nesmysl",
    "nesoulad",
    "netvor",
    "neuron",
    "nevina",
    "nezvykle",
    "nicota",
    "nijak",
    "nikam",
    "nikdy",
    "nikl",
    "nikterak",
    "nitro",
    "nocleh",
    "nohavice",
    "nominace",
    "nora",
    "norek",
    "nositel",
    "nosnost",
    "nouze",
    "noviny",
    "novota",
    "nozdra",
    "nuda",
    "nudle",
    "nuget",
    "nutit",
    "nutnost",
    "nutrie",
    "nymfa",
    "obal",
    "obarvit",
    "obava",
    "obdiv",
    "obec",
    "obehnat",
    "obejmout",
    "obezita",
    "obhajoba",
    "obilnice",
    "objasnit",
    "objekt",
    "obklopit",
    "oblast",
    "oblek",
    "obliba",
    "obloha",
    "obluda",
    "obnos",
    "obohatit",
    "obojek",
    "obout",
    "obrazec",
    "obrna",
    "obruba",
    "obrys",
    "obsah",
    "obsluha",
    "obstarat",
    "obuv",
    "obvaz",
    "obvinit",
    "obvod",
    "obvykle",
    "obyvatel",
    "obzor",
    "ocas",
    "ocel",
    "ocenit",
    "ochladit",
    "ochota",
    "ochrana",
    "ocitnout",
    "odboj",
    "odbyt",
    "odchod",
    "odcizit",
    "odebrat",
    "odeslat",
    "odevzdat",
    "odezva",
    "odhadce",
    "odhodit",
    "odjet",
    "odjinud",
    "odkaz",
    "odkoupit",
    "odliv",
    "odluka",
    "odmlka",
    "odolnost",
    "odpad",
    "odpis",
    "odplout",
    "odpor",
    "odpustit",
    "odpykat",
    "odrazka",
    "odsoudit",
    "odstup",
    "odsun",
    "odtok",
    "odtud",
    "odvaha",
    "odveta",
    "odvolat",
    "odvracet",
    "odznak",
    "ofina",
    "ofsajd",
    "ohlas",
    "ohnisko",
    "ohrada",
    "ohrozit",
    "ohryzek",
    "okap",
    "okenice",
    "oklika",
    "okno",
    "okouzlit",
    "okovy",
    "okrasa",
    "okres",
    "okrsek",
    "okruh",
    "okupant",
    "okurka",
    "okusit",
    "olejnina",
    "olizovat",
    "omak",
    "omeleta",
    "omezit",
    "omladina",
    "omlouvat",
    "omluva",
    "omyl",
    "onehdy",
    "opakovat",
    "opasek",
    "operace",
    "opice",
    "opilost",
    "opisovat",
    "opora",
    "opozice",
    "opravdu",
    "oproti",
    "orbital",
    "orchestr",
    "orgie",
    "orlice",
    "orloj",
    "ortel",
    "osada",
    "oschnout",
    "osika",
    "osivo",
    "oslava",
    "oslepit",
    "oslnit",
    "oslovit",
    "osnova",
    "osoba",
    "osolit",
    "ospalec",
    "osten",
    "ostraha",
    "ostuda",
    "ostych",
    "osvojit",
    "oteplit",
    "otisk",
    "otop",
    "otrhat",
    "otrlost",
    "otrok",
    "otruby",
    "otvor",
    "ovanout",
    "ovar",
    "oves",
    "ovlivnit",
    "ovoce",
    "oxid",
    "ozdoba",
    "pachatel",
    "pacient",
    "padouch",
    "pahorek",
    "pakt",
    "palanda",
    "palec",
    "palivo",
    "paluba",
    "pamflet",
    "pamlsek",
    "panenka",
    "panika",
    "panna",
    "panovat",
    "panstvo",
    "pantofle",
    "paprika",
    "parketa",
    "parodie",
    "parta",
    "paruka",
    "paryba",
    "paseka",
    "pasivita",
    "pastelka",
    "patent",
    "patrona",
    "pavouk",
    "pazneht",
    "pazourek",
    "pecka",
    "pedagog",
    "pejsek",
    "peklo",
    "peloton",
    "penalta",
    "pendrek",
    "penze",
    "periskop",
    "pero",
    "pestrost",
    "petarda",
    "petice",
    "petrolej",
    "pevnina",
    "pexeso",
    "pianista",
    "piha",
    "pijavice",
    "pikle",
    "piknik",
    "pilina",
    "pilnost",
    "pilulka",
    "pinzeta",
    "pipeta",
    "pisatel",
    "pistole",
    "pitevna",
    "pivnice",
    "pivovar",
    "placenta",
    "plakat",
    "plamen",
    "planeta",
    "plastika",
    "platit",
    "plavidlo",
    "plaz",
    "plech",
    "plemeno",
    "plenta",
    "ples",
    "pletivo",
    "plevel",
    "plivat",
    "plnit",
    "plno",
    "plocha",
    "plodina",
    "plomba",
    "plout",
    "pluk",
    "plyn",
    "pobavit",
    "pobyt",
    "pochod",
    "pocit",
    "poctivec",
    "podat",
    "podcenit",
    "podepsat",
    "podhled",
    "podivit",
    "podklad",
    "podmanit",
    "podnik",
    "podoba",
    "podpora",
    "podraz",
    "podstata",
    "podvod",
    "podzim",
    "poezie",
    "pohanka",
    "pohnutka",
    "pohovor",
    "pohroma",
    "pohyb",
    "pointa",
    "pojistka",
    "pojmout",
    "pokazit",
    "pokles",
    "pokoj",
    "pokrok",
    "pokuta",
    "pokyn",
    "poledne",
    "polibek",
    "polknout",
    "poloha",
    "polynom",
    "pomalu",
    "pominout",
    "pomlka",
    "pomoc",
    "pomsta",
    "pomyslet",
    "ponechat",
    "ponorka",
    "ponurost",
    "popadat",
    "popel",
    "popisek",
    "poplach",
    "poprosit",
    "popsat",
    "popud",
    "poradce",
    "porce",
    "porod",
    "porucha",
    "poryv",
    "posadit",
    "posed",
    "posila",
    "poskok",
    "poslanec",
    "posoudit",
    "pospolu",
    "postava",
    "posudek",
    "posyp",
    "potah",
    "potkan",
    "potlesk",
    "potomek",
    "potrava",
    "potupa",
    "potvora",
    "poukaz",
    "pouto",
    "pouzdro",
    "povaha",
    "povidla",
    "povlak",
    "povoz",
    "povrch",
    "povstat",
    "povyk",
    "povzdech",
    "pozdrav",
    "pozemek",
    "poznatek",
    "pozor",
    "pozvat",
    "pracovat",
    "prahory",
    "praktika",
    "prales",
    "praotec",
    "praporek",
    "prase",
    "pravda",
    "princip",
    "prkno",
    "probudit",
    "procento",
    "prodej",
    "profese",
    "prohra",
    "projekt",
    "prolomit",
    "promile",
    "pronikat",
    "propad",
    "prorok",
    "prosba",
    "proton",
    "proutek",
    "provaz",
    "prskavka",
    "prsten",
    "prudkost",
    "prut",
    "prvek",
    "prvohory",
    "psanec",
    "psovod",
    "pstruh",
    "ptactvo",
    "puberta",
    "puch",
    "pudl",
    "pukavec",
    "puklina",
    "pukrle",
    "pult",
    "pumpa",
    "punc",
    "pupen",
    "pusa",
    "pusinka",
    "pustina",
    "putovat",
    "putyka",
    "pyramida",
    "pysk",
    "pytel",
    "racek",
    "rachot",
    "radiace",
    "radnice",
    "radon",
    "raft",
    "ragby",
    "raketa",
    "rakovina",
    "rameno",
    "rampouch",
    "rande",
    "rarach",
    "rarita",
    "rasovna",
    "rastr",
    "ratolest",
    "razance",
    "razidlo",
    "reagovat",
    "reakce",
    "recept",
    "redaktor",
    "referent",
    "reflex",
    "rejnok",
    "reklama",
    "rekord",
    "rekrut",
    "rektor",
    "reputace",
    "revize",
    "revma",
    "revolver",
    "rezerva",
    "riskovat",
    "riziko",
    "robotika",
    "rodokmen",
    "rohovka",
    "rokle",
    "rokoko",
    "romaneto",
    "ropovod",
    "ropucha",
    "rorejs",
    "rosol",
    "rostlina",
    "rotmistr",
    "rotoped",
    "rotunda",
    "roubenka",
    "roucho",
    "roup",
    "roura",
    "rovina",
    "rovnice",
    "rozbor",
    "rozchod",
    "rozdat",
    "rozeznat",
    "rozhodce",
    "rozinka",
    "rozjezd",
    "rozkaz",
    "rozloha",
    "rozmar",
    "rozpad",
    "rozruch",
    "rozsah",
    "roztok",
    "rozum",
    "rozvod",
    "rubrika",
    "ruchadlo",
    "rukavice",
    "rukopis",
    "ryba",
    "rybolov",
    "rychlost",
    "rydlo",
    "rypadlo",
    "rytina",
    "ryzost",
    "sadista",
    "sahat",
    "sako",
    "samec",
    "samizdat",
    "samota",
    "sanitka",
    "sardinka",
    "sasanka",
    "satelit",
    "sazba",
    "sazenice",
    "sbor",
    "schovat",
    "sebranka",
    "secese",
    "sedadlo",
    "sediment",
    "sedlo",
    "sehnat",
    "sejmout",
    "sekera",
    "sekta",
    "sekunda",
    "sekvoje",
    "semeno",
    "seno",
    "servis",
    "sesadit",
    "seshora",
    "seskok",
    "seslat",
    "sestra",
    "sesuv",
    "sesypat",
    "setba",
    "setina",
    "setkat",
    "setnout",
    "setrvat",
    "sever",
    "seznam",
    "shoda",
    "shrnout",
    "sifon",
    "silnice",
    "sirka",
    "sirotek",
    "sirup",
    "situace",
    "skafandr",
    "skalisko",
    "skanzen",
    "skaut",
    "skeptik",
    "skica",
    "skladba",
    "sklenice",
    "sklo",
    "skluz",
    "skoba",
    "skokan",
    "skoro",
    "skripta",
    "skrz",
    "skupina",
    "skvost",
    "skvrna",
    "slabika",
    "sladidlo",
    "slanina",
    "slast",
    "slavnost",
    "sledovat",
    "slepec",
    "sleva",
    "slezina",
    "slib",
    "slina",
    "sliznice",
    "slon",
    "sloupek",
    "slovo",
    "sluch",
    "sluha",
    "slunce",
    "slupka",
    "slza",
    "smaragd",
    "smetana",
    "smilstvo",
    "smlouva",
    "smog",
    "smrad",
    "smrk",
    "smrtka",
    "smutek",
    "smysl",
    "snad",
    "snaha",
    "snob",
    "sobota",
    "socha",
    "sodovka",
    "sokol",
    "sopka",
    "sotva",
    "souboj",
    "soucit",
    "soudce",
    "souhlas",
    "soulad",
    "soumrak",
    "souprava",
    "soused",
    "soutok",
    "souviset",
    "spalovna",
    "spasitel",
    "spis",
    "splav",
    "spodek",
    "spojenec",
    "spolu",
    "sponzor",
    "spornost",
    "spousta",
    "sprcha",
    "spustit",
    "sranda",
    "sraz",
    "srdce",
    "srna",
    "srnec",
    "srovnat",
    "srpen",
    "srst",
    "srub",
    "stanice",
    "starosta",
    "statika",
    "stavba",
    "stehno",
    "stezka",
    "stodola",
    "stolek",
    "stopa",
    "storno",
    "stoupat",
    "strach",
    "stres",
    "strhnout",
    "strom",
    "struna",
    "studna",
    "stupnice",
    "stvol",
    "styk",
    "subjekt",
    "subtropy",
    "suchar",
    "sudost",
    "sukno",
    "sundat",
    "sunout",
    "surikata",
    "surovina",
    "svah",
    "svalstvo",
    "svetr",
    "svatba",
    "svazek",
    "svisle",
    "svitek",
    "svoboda",
    "svodidlo",
    "svorka",
    "svrab",
    "sykavka",
    "sykot",
    "synek",
    "synovec",
    "sypat",
    "sypkost",
    "syrovost",
    "sysel",
    "sytost",
    "tabletka",
    "tabule",
    "tahoun",
    "tajemno",
    "tajfun",
    "tajga",
    "tajit",
    "tajnost",
    "taktika",
    "tamhle",
    "tampon",
    "tancovat",
    "tanec",
    "tanker",
    "tapeta",
    "tavenina",
    "tazatel",
    "technika",
    "tehdy",
    "tekutina",
    "telefon",
    "temnota",
    "tendence",
    "tenista",
    "tenor",
    "teplota",
    "tepna",
    "teprve",
    "terapie",
    "termoska",
    "textil",
    "ticho",
    "tiskopis",
    "titulek",
    "tkadlec",
    "tkanina",
    "tlapka",
    "tleskat",
    "tlukot",
    "tlupa",
    "tmel",
    "toaleta",
    "topinka",
    "topol",
    "torzo",
    "touha",
    "toulec",
    "tradice",
    "traktor",
    "tramp",
    "trasa",
    "traverza",
    "trefit",
    "trest",
    "trezor",
    "trhavina",
    "trhlina",
    "trochu",
    "trojice",
    "troska",
    "trouba",
    "trpce",
    "trpitel",
    "trpkost",
    "trubec",
    "truchlit",
    "truhlice",
    "trus",
    "trvat",
    "tudy",
    "tuhnout",
    "tuhost",
    "tundra",
    "turista",
    "turnaj",
    "tuzemsko",
    "tvaroh",
    "tvorba",
    "tvrdost",
    "tvrz",
    "tygr",
    "tykev",
    "ubohost",
    "uboze",
    "ubrat",
    "ubrousek",
    "ubrus",
    "ubytovna",
    "ucho",
    "uctivost",
    "udivit",
    "uhradit",
    "ujednat",
    "ujistit",
    "ujmout",
    "ukazatel",
    "uklidnit",
    "uklonit",
    "ukotvit",
    "ukrojit",
    "ulice",
    "ulita",
    "ulovit",
    "umyvadlo",
    "unavit",
    "uniforma",
    "uniknout",
    "upadnout",
    "uplatnit",
    "uplynout",
    "upoutat",
    "upravit",
    "uran",
    "urazit",
    "usednout",
    "usilovat",
    "usmrtit",
    "usnadnit",
    "usnout",
    "usoudit",
    "ustlat",
    "ustrnout",
    "utahovat",
    "utkat",
    "utlumit",
    "utonout",
    "utopenec",
    "utrousit",
    "uvalit",
    "uvolnit",
    "uvozovka",
    "uzdravit",
    "uzel",
    "uzenina",
    "uzlina",
    "uznat",
    "vagon",
    "valcha",
    "valoun",
    "vana",
    "vandal",
    "vanilka",
    "varan",
    "varhany",
    "varovat",
    "vcelku",
    "vchod",
    "vdova",
    "vedro",
    "vegetace",
    "vejce",
    "velbloud",
    "veletrh",
    "velitel",
    "velmoc",
    "velryba",
    "venkov",
    "veranda",
    "verze",
    "veselka",
    "veskrze",
    "vesnice",
    "vespodu",
    "vesta",
    "veterina",
    "veverka",
    "vibrace",
    "vichr",
    "videohra",
    "vidina",
    "vidle",
    "vila",
    "vinice",
    "viset",
    "vitalita",
    "vize",
    "vizitka",
    "vjezd",
    "vklad",
    "vkus",
    "vlajka",
    "vlak",
    "vlasec",
    "vlevo",
    "vlhkost",
    "vliv",
    "vlnovka",
    "vloupat",
    "vnucovat",
    "vnuk",
    "voda",
    "vodivost",
    "vodoznak",
    "vodstvo",
    "vojensky",
    "vojna",
    "vojsko",
    "volant",
    "volba",
    "volit",
    "volno",
    "voskovka",
    "vozidlo",
    "vozovna",
    "vpravo",
    "vrabec",
    "vracet",
    "vrah",
    "vrata",
    "vrba",
    "vrcholek",
    "vrhat",
    "vrstva",
    "vrtule",
    "vsadit",
    "vstoupit",
    "vstup",
    "vtip",
    "vybavit",
    "vybrat",
    "vychovat",
    "vydat",
    "vydra",
    "vyfotit",
    "vyhledat",
    "vyhnout",
    "vyhodit",
    "vyhradit",
    "vyhubit",
    "vyjasnit",
    "vyjet",
    "vyjmout",
    "vyklopit",
    "vykonat",
    "vylekat",
    "vymazat",
    "vymezit",
    "vymizet",
    "vymyslet",
    "vynechat",
    "vynikat",
    "vynutit",
    "vypadat",
    "vyplatit",
    "vypravit",
    "vypustit",
    "vyrazit",
    "vyrovnat",
    "vyrvat",
    "vyslovit",
    "vysoko",
    "vystavit",
    "vysunout",
    "vysypat",
    "vytasit",
    "vytesat",
    "vytratit",
    "vyvinout",
    "vyvolat",
    "vyvrhel",
    "vyzdobit",
    "vyznat",
    "vzadu",
    "vzbudit",
    "vzchopit",
    "vzdor",
    "vzduch",
    "vzdychat",
    "vzestup",
    "vzhledem",
    "vzkaz",
    "vzlykat",
    "vznik",
    "vzorek",
    "vzpoura",
    "vztah",
    "vztek",
    "xylofon",
    "zabrat",
    "zabydlet",
    "zachovat",
    "zadarmo",
    "zadusit",
    "zafoukat",
    "zahltit",
    "zahodit",
    "zahrada",
    "zahynout",
    "zajatec",
    "zajet",
    "zajistit",
    "zaklepat",
    "zakoupit",
    "zalepit",
    "zamezit",
    "zamotat",
    "zamyslet",
    "zanechat",
    "zanikat",
    "zaplatit",
    "zapojit",
    "zapsat",
    "zarazit",
    "zastavit",
    "zasunout",
    "zatajit",
    "zatemnit",
    "zatknout",
    "zaujmout",
    "zavalit",
    "zavelet",
    "zavinit",
    "zavolat",
    "zavrtat",
    "zazvonit",
    "zbavit",
    "zbrusu",
    "zbudovat",
    "zbytek",
    "zdaleka",
    "zdarma",
    "zdatnost",
    "zdivo",
    "zdobit",
    "zdroj",
    "zdvih",
    "zdymadlo",
    "zelenina",
    "zeman",
    "zemina",
    "zeptat",
    "zezadu",
    "zezdola",
    "zhatit",
    "zhltnout",
    "zhluboka",
    "zhotovit",
    "zhruba",
    "zima",
    "zimnice",
    "zjemnit",
    "zklamat",
    "zkoumat",
    "zkratka",
    "zkumavka",
    "zlato",
    "zlehka",
    "zloba",
    "zlom",
    "zlost",
    "zlozvyk",
    "zmapovat",
    "zmar",
    "zmatek",
    "zmije",
    "zmizet",
    "zmocnit",
    "zmodrat",
    "zmrzlina",
    "zmutovat",
    "znak",
    "znalost",
    "znamenat",
    "znovu",
    "zobrazit",
    "zotavit",
    "zoubek",
    "zoufale",
    "zplodit",
    "zpomalit",
    "zprava",
    "zprostit",
    "zprudka",
    "zprvu",
    "zrada",
    "zranit",
    "zrcadlo",
    "zrnitost",
    "zrno",
    "zrovna",
    "zrychlit",
    "zrzavost",
    "zticha",
    "ztratit",
    "zubovina",
    "zubr",
    "zvednout",
    "zvenku",
    "zvesela",
    "zvon",
    "zvrat",
    "zvukovod",
    "zvyk"
]

},{}],26:[function(require,module,exports){
module.exports=[
    "abandon",
    "ability",
    "able",
    "about",
    "above",
    "absent",
    "absorb",
    "abstract",
    "absurd",
    "abuse",
    "access",
    "accident",
    "account",
    "accuse",
    "achieve",
    "acid",
    "acoustic",
    "acquire",
    "across",
    "act",
    "action",
    "actor",
    "actress",
    "actual",
    "adapt",
    "add",
    "addict",
    "address",
    "adjust",
    "admit",
    "adult",
    "advance",
    "advice",
    "aerobic",
    "affair",
    "afford",
    "afraid",
    "again",
    "age",
    "agent",
    "agree",
    "ahead",
    "aim",
    "air",
    "airport",
    "aisle",
    "alarm",
    "album",
    "alcohol",
    "alert",
    "alien",
    "all",
    "alley",
    "allow",
    "almost",
    "alone",
    "alpha",
    "already",
    "also",
    "alter",
    "always",
    "amateur",
    "amazing",
    "among",
    "amount",
    "amused",
    "analyst",
    "anchor",
    "ancient",
    "anger",
    "angle",
    "angry",
    "animal",
    "ankle",
    "announce",
    "annual",
    "another",
    "answer",
    "antenna",
    "antique",
    "anxiety",
    "any",
    "apart",
    "apology",
    "appear",
    "apple",
    "approve",
    "april",
    "arch",
    "arctic",
    "area",
    "arena",
    "argue",
    "arm",
    "armed",
    "armor",
    "army",
    "around",
    "arrange",
    "arrest",
    "arrive",
    "arrow",
    "art",
    "artefact",
    "artist",
    "artwork",
    "ask",
    "aspect",
    "assault",
    "asset",
    "assist",
    "assume",
    "asthma",
    "athlete",
    "atom",
    "attack",
    "attend",
    "attitude",
    "attract",
    "auction",
    "audit",
    "august",
    "aunt",
    "author",
    "auto",
    "autumn",
    "average",
    "avocado",
    "avoid",
    "awake",
    "aware",
    "away",
    "awesome",
    "awful",
    "awkward",
    "axis",
    "baby",
    "bachelor",
    "bacon",
    "badge",
    "bag",
    "balance",
    "balcony",
    "ball",
    "bamboo",
    "banana",
    "banner",
    "bar",
    "barely",
    "bargain",
    "barrel",
    "base",
    "basic",
    "basket",
    "battle",
    "beach",
    "bean",
    "beauty",
    "because",
    "become",
    "beef",
    "before",
    "begin",
    "behave",
    "behind",
    "believe",
    "below",
    "belt",
    "bench",
    "benefit",
    "best",
    "betray",
    "better",
    "between",
    "beyond",
    "bicycle",
    "bid",
    "bike",
    "bind",
    "biology",
    "bird",
    "birth",
    "bitter",
    "black",
    "blade",
    "blame",
    "blanket",
    "blast",
    "bleak",
    "bless",
    "blind",
    "blood",
    "blossom",
    "blouse",
    "blue",
    "blur",
    "blush",
    "board",
    "boat",
    "body",
    "boil",
    "bomb",
    "bone",
    "bonus",
    "book",
    "boost",
    "border",
    "boring",
    "borrow",
    "boss",
    "bottom",
    "bounce",
    "box",
    "boy",
    "bracket",
    "brain",
    "brand",
    "brass",
    "brave",
    "bread",
    "breeze",
    "brick",
    "bridge",
    "brief",
    "bright",
    "bring",
    "brisk",
    "broccoli",
    "broken",
    "bronze",
    "broom",
    "brother",
    "brown",
    "brush",
    "bubble",
    "buddy",
    "budget",
    "buffalo",
    "build",
    "bulb",
    "bulk",
    "bullet",
    "bundle",
    "bunker",
    "burden",
    "burger",
    "burst",
    "bus",
    "business",
    "busy",
    "butter",
    "buyer",
    "buzz",
    "cabbage",
    "cabin",
    "cable",
    "cactus",
    "cage",
    "cake",
    "call",
    "calm",
    "camera",
    "camp",
    "can",
    "canal",
    "cancel",
    "candy",
    "cannon",
    "canoe",
    "canvas",
    "canyon",
    "capable",
    "capital",
    "captain",
    "car",
    "carbon",
    "card",
    "cargo",
    "carpet",
    "carry",
    "cart",
    "case",
    "cash",
    "casino",
    "castle",
    "casual",
    "cat",
    "catalog",
    "catch",
    "category",
    "cattle",
    "caught",
    "cause",
    "caution",
    "cave",
    "ceiling",
    "celery",
    "cement",
    "census",
    "century",
    "cereal",
    "certain",
    "chair",
    "chalk",
    "champion",
    "change",
    "chaos",
    "chapter",
    "charge",
    "chase",
    "chat",
    "cheap",
    "check",
    "cheese",
    "chef",
    "cherry",
    "chest",
    "chicken",
    "chief",
    "child",
    "chimney",
    "choice",
    "choose",
    "chronic",
    "chuckle",
    "chunk",
    "churn",
    "cigar",
    "cinnamon",
    "circle",
    "citizen",
    "city",
    "civil",
    "claim",
    "clap",
    "clarify",
    "claw",
    "clay",
    "clean",
    "clerk",
    "clever",
    "click",
    "client",
    "cliff",
    "climb",
    "clinic",
    "clip",
    "clock",
    "clog",
    "close",
    "cloth",
    "cloud",
    "clown",
    "club",
    "clump",
    "cluster",
    "clutch",
    "coach",
    "coast",
    "coconut",
    "code",
    "coffee",
    "coil",
    "coin",
    "collect",
    "color",
    "column",
    "combine",
    "come",
    "comfort",
    "comic",
    "common",
    "company",
    "concert",
    "conduct",
    "confirm",
    "congress",
    "connect",
    "consider",
    "control",
    "convince",
    "cook",
    "cool",
    "copper",
    "copy",
    "coral",
    "core",
    "corn",
    "correct",
    "cost",
    "cotton",
    "couch",
    "country",
    "couple",
    "course",
    "cousin",
    "cover",
    "coyote",
    "crack",
    "cradle",
    "craft",
    "cram",
    "crane",
    "crash",
    "crater",
    "crawl",
    "crazy",
    "cream",
    "credit",
    "creek",
    "crew",
    "cricket",
    "crime",
    "crisp",
    "critic",
    "crop",
    "cross",
    "crouch",
    "crowd",
    "crucial",
    "cruel",
    "cruise",
    "crumble",
    "crunch",
    "crush",
    "cry",
    "crystal",
    "cube",
    "culture",
    "cup",
    "cupboard",
    "curious",
    "current",
    "curtain",
    "curve",
    "cushion",
    "custom",
    "cute",
    "cycle",
    "dad",
    "damage",
    "damp",
    "dance",
    "danger",
    "daring",
    "dash",
    "daughter",
    "dawn",
    "day",
    "deal",
    "debate",
    "debris",
    "decade",
    "december",
    "decide",
    "decline",
    "decorate",
    "decrease",
    "deer",
    "defense",
    "define",
    "defy",
    "degree",
    "delay",
    "deliver",
    "demand",
    "demise",
    "denial",
    "dentist",
    "deny",
    "depart",
    "depend",
    "deposit",
    "depth",
    "deputy",
    "derive",
    "describe",
    "desert",
    "design",
    "desk",
    "despair",
    "destroy",
    "detail",
    "detect",
    "develop",
    "device",
    "devote",
    "diagram",
    "dial",
    "diamond",
    "diary",
    "dice",
    "diesel",
    "diet",
    "differ",
    "digital",
    "dignity",
    "dilemma",
    "dinner",
    "dinosaur",
    "direct",
    "dirt",
    "disagree",
    "discover",
    "disease",
    "dish",
    "dismiss",
    "disorder",
    "display",
    "distance",
    "divert",
    "divide",
    "divorce",
    "dizzy",
    "doctor",
    "document",
    "dog",
    "doll",
    "dolphin",
    "domain",
    "donate",
    "donkey",
    "donor",
    "door",
    "dose",
    "double",
    "dove",
    "draft",
    "dragon",
    "drama",
    "drastic",
    "draw",
    "dream",
    "dress",
    "drift",
    "drill",
    "drink",
    "drip",
    "drive",
    "drop",
    "drum",
    "dry",
    "duck",
    "dumb",
    "dune",
    "during",
    "dust",
    "dutch",
    "duty",
    "dwarf",
    "dynamic",
    "eager",
    "eagle",
    "early",
    "earn",
    "earth",
    "easily",
    "east",
    "easy",
    "echo",
    "ecology",
    "economy",
    "edge",
    "edit",
    "educate",
    "effort",
    "egg",
    "eight",
    "either",
    "elbow",
    "elder",
    "electric",
    "elegant",
    "element",
    "elephant",
    "elevator",
    "elite",
    "else",
    "embark",
    "embody",
    "embrace",
    "emerge",
    "emotion",
    "employ",
    "empower",
    "empty",
    "enable",
    "enact",
    "end",
    "endless",
    "endorse",
    "enemy",
    "energy",
    "enforce",
    "engage",
    "engine",
    "enhance",
    "enjoy",
    "enlist",
    "enough",
    "enrich",
    "enroll",
    "ensure",
    "enter",
    "entire",
    "entry",
    "envelope",
    "episode",
    "equal",
    "equip",
    "era",
    "erase",
    "erode",
    "erosion",
    "error",
    "erupt",
    "escape",
    "essay",
    "essence",
    "estate",
    "eternal",
    "ethics",
    "evidence",
    "evil",
    "evoke",
    "evolve",
    "exact",
    "example",
    "excess",
    "exchange",
    "excite",
    "exclude",
    "excuse",
    "execute",
    "exercise",
    "exhaust",
    "exhibit",
    "exile",
    "exist",
    "exit",
    "exotic",
    "expand",
    "expect",
    "expire",
    "explain",
    "expose",
    "express",
    "extend",
    "extra",
    "eye",
    "eyebrow",
    "fabric",
    "face",
    "faculty",
    "fade",
    "faint",
    "faith",
    "fall",
    "false",
    "fame",
    "family",
    "famous",
    "fan",
    "fancy",
    "fantasy",
    "farm",
    "fashion",
    "fat",
    "fatal",
    "father",
    "fatigue",
    "fault",
    "favorite",
    "feature",
    "february",
    "federal",
    "fee",
    "feed",
    "feel",
    "female",
    "fence",
    "festival",
    "fetch",
    "fever",
    "few",
    "fiber",
    "fiction",
    "field",
    "figure",
    "file",
    "film",
    "filter",
    "final",
    "find",
    "fine",
    "finger",
    "finish",
    "fire",
    "firm",
    "first",
    "fiscal",
    "fish",
    "fit",
    "fitness",
    "fix",
    "flag",
    "flame",
    "flash",
    "flat",
    "flavor",
    "flee",
    "flight",
    "flip",
    "float",
    "flock",
    "floor",
    "flower",
    "fluid",
    "flush",
    "fly",
    "foam",
    "focus",
    "fog",
    "foil",
    "fold",
    "follow",
    "food",
    "foot",
    "force",
    "forest",
    "forget",
    "fork",
    "fortune",
    "forum",
    "forward",
    "fossil",
    "foster",
    "found",
    "fox",
    "fragile",
    "frame",
    "frequent",
    "fresh",
    "friend",
    "fringe",
    "frog",
    "front",
    "frost",
    "frown",
    "frozen",
    "fruit",
    "fuel",
    "fun",
    "funny",
    "furnace",
    "fury",
    "future",
    "gadget",
    "gain",
    "galaxy",
    "gallery",
    "game",
    "gap",
    "garage",
    "garbage",
    "garden",
    "garlic",
    "garment",
    "gas",
    "gasp",
    "gate",
    "gather",
    "gauge",
    "gaze",
    "general",
    "genius",
    "genre",
    "gentle",
    "genuine",
    "gesture",
    "ghost",
    "giant",
    "gift",
    "giggle",
    "ginger",
    "giraffe",
    "girl",
    "give",
    "glad",
    "glance",
    "glare",
    "glass",
    "glide",
    "glimpse",
    "globe",
    "gloom",
    "glory",
    "glove",
    "glow",
    "glue",
    "goat",
    "goddess",
    "gold",
    "good",
    "goose",
    "gorilla",
    "gospel",
    "gossip",
    "govern",
    "gown",
    "grab",
    "grace",
    "grain",
    "grant",
    "grape",
    "grass",
    "gravity",
    "great",
    "green",
    "grid",
    "grief",
    "grit",
    "grocery",
    "group",
    "grow",
    "grunt",
    "guard",
    "guess",
    "guide",
    "guilt",
    "guitar",
    "gun",
    "gym",
    "habit",
    "hair",
    "half",
    "hammer",
    "hamster",
    "hand",
    "happy",
    "harbor",
    "hard",
    "harsh",
    "harvest",
    "hat",
    "have",
    "hawk",
    "hazard",
    "head",
    "health",
    "heart",
    "heavy",
    "hedgehog",
    "height",
    "hello",
    "helmet",
    "help",
    "hen",
    "hero",
    "hidden",
    "high",
    "hill",
    "hint",
    "hip",
    "hire",
    "history",
    "hobby",
    "hockey",
    "hold",
    "hole",
    "holiday",
    "hollow",
    "home",
    "honey",
    "hood",
    "hope",
    "horn",
    "horror",
    "horse",
    "hospital",
    "host",
    "hotel",
    "hour",
    "hover",
    "hub",
    "huge",
    "human",
    "humble",
    "humor",
    "hundred",
    "hungry",
    "hunt",
    "hurdle",
    "hurry",
    "hurt",
    "husband",
    "hybrid",
    "ice",
    "icon",
    "idea",
    "identify",
    "idle",
    "ignore",
    "ill",
    "illegal",
    "illness",
    "image",
    "imitate",
    "immense",
    "immune",
    "impact",
    "impose",
    "improve",
    "impulse",
    "inch",
    "include",
    "income",
    "increase",
    "index",
    "indicate",
    "indoor",
    "industry",
    "infant",
    "inflict",
    "inform",
    "inhale",
    "inherit",
    "initial",
    "inject",
    "injury",
    "inmate",
    "inner",
    "innocent",
    "input",
    "inquiry",
    "insane",
    "insect",
    "inside",
    "inspire",
    "install",
    "intact",
    "interest",
    "into",
    "invest",
    "invite",
    "involve",
    "iron",
    "island",
    "isolate",
    "issue",
    "item",
    "ivory",
    "jacket",
    "jaguar",
    "jar",
    "jazz",
    "jealous",
    "jeans",
    "jelly",
    "jewel",
    "job",
    "join",
    "joke",
    "journey",
    "joy",
    "judge",
    "juice",
    "jump",
    "jungle",
    "junior",
    "junk",
    "just",
    "kangaroo",
    "keen",
    "keep",
    "ketchup",
    "key",
    "kick",
    "kid",
    "kidney",
    "kind",
    "kingdom",
    "kiss",
    "kit",
    "kitchen",
    "kite",
    "kitten",
    "kiwi",
    "knee",
    "knife",
    "knock",
    "know",
    "lab",
    "label",
    "labor",
    "ladder",
    "lady",
    "lake",
    "lamp",
    "language",
    "laptop",
    "large",
    "later",
    "latin",
    "laugh",
    "laundry",
    "lava",
    "law",
    "lawn",
    "lawsuit",
    "layer",
    "lazy",
    "leader",
    "leaf",
    "learn",
    "leave",
    "lecture",
    "left",
    "leg",
    "legal",
    "legend",
    "leisure",
    "lemon",
    "lend",
    "length",
    "lens",
    "leopard",
    "lesson",
    "letter",
    "level",
    "liar",
    "liberty",
    "library",
    "license",
    "life",
    "lift",
    "light",
    "like",
    "limb",
    "limit",
    "link",
    "lion",
    "liquid",
    "list",
    "little",
    "live",
    "lizard",
    "load",
    "loan",
    "lobster",
    "local",
    "lock",
    "logic",
    "lonely",
    "long",
    "loop",
    "lottery",
    "loud",
    "lounge",
    "love",
    "loyal",
    "lucky",
    "luggage",
    "lumber",
    "lunar",
    "lunch",
    "luxury",
    "lyrics",
    "machine",
    "mad",
    "magic",
    "magnet",
    "maid",
    "mail",
    "main",
    "major",
    "make",
    "mammal",
    "man",
    "manage",
    "mandate",
    "mango",
    "mansion",
    "manual",
    "maple",
    "marble",
    "march",
    "margin",
    "marine",
    "market",
    "marriage",
    "mask",
    "mass",
    "master",
    "match",
    "material",
    "math",
    "matrix",
    "matter",
    "maximum",
    "maze",
    "meadow",
    "mean",
    "measure",
    "meat",
    "mechanic",
    "medal",
    "media",
    "melody",
    "melt",
    "member",
    "memory",
    "mention",
    "menu",
    "mercy",
    "merge",
    "merit",
    "merry",
    "mesh",
    "message",
    "metal",
    "method",
    "middle",
    "midnight",
    "milk",
    "million",
    "mimic",
    "mind",
    "minimum",
    "minor",
    "minute",
    "miracle",
    "mirror",
    "misery",
    "miss",
    "mistake",
    "mix",
    "mixed",
    "mixture",
    "mobile",
    "model",
    "modify",
    "mom",
    "moment",
    "monitor",
    "monkey",
    "monster",
    "month",
    "moon",
    "moral",
    "more",
    "morning",
    "mosquito",
    "mother",
    "motion",
    "motor",
    "mountain",
    "mouse",
    "move",
    "movie",
    "much",
    "muffin",
    "mule",
    "multiply",
    "muscle",
    "museum",
    "mushroom",
    "music",
    "must",
    "mutual",
    "myself",
    "mystery",
    "myth",
    "naive",
    "name",
    "napkin",
    "narrow",
    "nasty",
    "nation",
    "nature",
    "near",
    "neck",
    "need",
    "negative",
    "neglect",
    "neither",
    "nephew",
    "nerve",
    "nest",
    "net",
    "network",
    "neutral",
    "never",
    "news",
    "next",
    "nice",
    "night",
    "noble",
    "noise",
    "nominee",
    "noodle",
    "normal",
    "north",
    "nose",
    "notable",
    "note",
    "nothing",
    "notice",
    "novel",
    "now",
    "nuclear",
    "number",
    "nurse",
    "nut",
    "oak",
    "obey",
    "object",
    "oblige",
    "obscure",
    "observe",
    "obtain",
    "obvious",
    "occur",
    "ocean",
    "october",
    "odor",
    "off",
    "offer",
    "office",
    "often",
    "oil",
    "okay",
    "old",
    "olive",
    "olympic",
    "omit",
    "once",
    "one",
    "onion",
    "online",
    "only",
    "open",
    "opera",
    "opinion",
    "oppose",
    "option",
    "orange",
    "orbit",
    "orchard",
    "order",
    "ordinary",
    "organ",
    "orient",
    "original",
    "orphan",
    "ostrich",
    "other",
    "outdoor",
    "outer",
    "output",
    "outside",
    "oval",
    "oven",
    "over",
    "own",
    "owner",
    "oxygen",
    "oyster",
    "ozone",
    "pact",
    "paddle",
    "page",
    "pair",
    "palace",
    "palm",
    "panda",
    "panel",
    "panic",
    "panther",
    "paper",
    "parade",
    "parent",
    "park",
    "parrot",
    "party",
    "pass",
    "patch",
    "path",
    "patient",
    "patrol",
    "pattern",
    "pause",
    "pave",
    "payment",
    "peace",
    "peanut",
    "pear",
    "peasant",
    "pelican",
    "pen",
    "penalty",
    "pencil",
    "people",
    "pepper",
    "perfect",
    "permit",
    "person",
    "pet",
    "phone",
    "photo",
    "phrase",
    "physical",
    "piano",
    "picnic",
    "picture",
    "piece",
    "pig",
    "pigeon",
    "pill",
    "pilot",
    "pink",
    "pioneer",
    "pipe",
    "pistol",
    "pitch",
    "pizza",
    "place",
    "planet",
    "plastic",
    "plate",
    "play",
    "please",
    "pledge",
    "pluck",
    "plug",
    "plunge",
    "poem",
    "poet",
    "point",
    "polar",
    "pole",
    "police",
    "pond",
    "pony",
    "pool",
    "popular",
    "portion",
    "position",
    "possible",
    "post",
    "potato",
    "pottery",
    "poverty",
    "powder",
    "power",
    "practice",
    "praise",
    "predict",
    "prefer",
    "prepare",
    "present",
    "pretty",
    "prevent",
    "price",
    "pride",
    "primary",
    "print",
    "priority",
    "prison",
    "private",
    "prize",
    "problem",
    "process",
    "produce",
    "profit",
    "program",
    "project",
    "promote",
    "proof",
    "property",
    "prosper",
    "protect",
    "proud",
    "provide",
    "public",
    "pudding",
    "pull",
    "pulp",
    "pulse",
    "pumpkin",
    "punch",
    "pupil",
    "puppy",
    "purchase",
    "purity",
    "purpose",
    "purse",
    "push",
    "put",
    "puzzle",
    "pyramid",
    "quality",
    "quantum",
    "quarter",
    "question",
    "quick",
    "quit",
    "quiz",
    "quote",
    "rabbit",
    "raccoon",
    "race",
    "rack",
    "radar",
    "radio",
    "rail",
    "rain",
    "raise",
    "rally",
    "ramp",
    "ranch",
    "random",
    "range",
    "rapid",
    "rare",
    "rate",
    "rather",
    "raven",
    "raw",
    "razor",
    "ready",
    "real",
    "reason",
    "rebel",
    "rebuild",
    "recall",
    "receive",
    "recipe",
    "record",
    "recycle",
    "reduce",
    "reflect",
    "reform",
    "refuse",
    "region",
    "regret",
    "regular",
    "reject",
    "relax",
    "release",
    "relief",
    "rely",
    "remain",
    "remember",
    "remind",
    "remove",
    "render",
    "renew",
    "rent",
    "reopen",
    "repair",
    "repeat",
    "replace",
    "report",
    "require",
    "rescue",
    "resemble",
    "resist",
    "resource",
    "response",
    "result",
    "retire",
    "retreat",
    "return",
    "reunion",
    "reveal",
    "review",
    "reward",
    "rhythm",
    "rib",
    "ribbon",
    "rice",
    "rich",
    "ride",
    "ridge",
    "rifle",
    "right",
    "rigid",
    "ring",
    "riot",
    "ripple",
    "risk",
    "ritual",
    "rival",
    "river",
    "road",
    "roast",
    "robot",
    "robust",
    "rocket",
    "romance",
    "roof",
    "rookie",
    "room",
    "rose",
    "rotate",
    "rough",
    "round",
    "route",
    "royal",
    "rubber",
    "rude",
    "rug",
    "rule",
    "run",
    "runway",
    "rural",
    "sad",
    "saddle",
    "sadness",
    "safe",
    "sail",
    "salad",
    "salmon",
    "salon",
    "salt",
    "salute",
    "same",
    "sample",
    "sand",
    "satisfy",
    "satoshi",
    "sauce",
    "sausage",
    "save",
    "say",
    "scale",
    "scan",
    "scare",
    "scatter",
    "scene",
    "scheme",
    "school",
    "science",
    "scissors",
    "scorpion",
    "scout",
    "scrap",
    "screen",
    "script",
    "scrub",
    "sea",
    "search",
    "season",
    "seat",
    "second",
    "secret",
    "section",
    "security",
    "seed",
    "seek",
    "segment",
    "select",
    "sell",
    "seminar",
    "senior",
    "sense",
    "sentence",
    "series",
    "service",
    "session",
    "settle",
    "setup",
    "seven",
    "shadow",
    "shaft",
    "shallow",
    "share",
    "shed",
    "shell",
    "sheriff",
    "shield",
    "shift",
    "shine",
    "ship",
    "shiver",
    "shock",
    "shoe",
    "shoot",
    "shop",
    "short",
    "shoulder",
    "shove",
    "shrimp",
    "shrug",
    "shuffle",
    "shy",
    "sibling",
    "sick",
    "side",
    "siege",
    "sight",
    "sign",
    "silent",
    "silk",
    "silly",
    "silver",
    "similar",
    "simple",
    "since",
    "sing",
    "siren",
    "sister",
    "situate",
    "six",
    "size",
    "skate",
    "sketch",
    "ski",
    "skill",
    "skin",
    "skirt",
    "skull",
    "slab",
    "slam",
    "sleep",
    "slender",
    "slice",
    "slide",
    "slight",
    "slim",
    "slogan",
    "slot",
    "slow",
    "slush",
    "small",
    "smart",
    "smile",
    "smoke",
    "smooth",
    "snack",
    "snake",
    "snap",
    "sniff",
    "snow",
    "soap",
    "soccer",
    "social",
    "sock",
    "soda",
    "soft",
    "solar",
    "soldier",
    "solid",
    "solution",
    "solve",
    "someone",
    "song",
    "soon",
    "sorry",
    "sort",
    "soul",
    "sound",
    "soup",
    "source",
    "south",
    "space",
    "spare",
    "spatial",
    "spawn",
    "speak",
    "special",
    "speed",
    "spell",
    "spend",
    "sphere",
    "spice",
    "spider",
    "spike",
    "spin",
    "spirit",
    "split",
    "spoil",
    "sponsor",
    "spoon",
    "sport",
    "spot",
    "spray",
    "spread",
    "spring",
    "spy",
    "square",
    "squeeze",
    "squirrel",
    "stable",
    "stadium",
    "staff",
    "stage",
    "stairs",
    "stamp",
    "stand",
    "start",
    "state",
    "stay",
    "steak",
    "steel",
    "stem",
    "step",
    "stereo",
    "stick",
    "still",
    "sting",
    "stock",
    "stomach",
    "stone",
    "stool",
    "story",
    "stove",
    "strategy",
    "street",
    "strike",
    "strong",
    "struggle",
    "student",
    "stuff",
    "stumble",
    "style",
    "subject",
    "submit",
    "subway",
    "success",
    "such",
    "sudden",
    "suffer",
    "sugar",
    "suggest",
    "suit",
    "summer",
    "sun",
    "sunny",
    "sunset",
    "super",
    "supply",
    "supreme",
    "sure",
    "surface",
    "surge",
    "surprise",
    "surround",
    "survey",
    "suspect",
    "sustain",
    "swallow",
    "swamp",
    "swap",
    "swarm",
    "swear",
    "sweet",
    "swift",
    "swim",
    "swing",
    "switch",
    "sword",
    "symbol",
    "symptom",
    "syrup",
    "system",
    "table",
    "tackle",
    "tag",
    "tail",
    "talent",
    "talk",
    "tank",
    "tape",
    "target",
    "task",
    "taste",
    "tattoo",
    "taxi",
    "teach",
    "team",
    "tell",
    "ten",
    "tenant",
    "tennis",
    "tent",
    "term",
    "test",
    "text",
    "thank",
    "that",
    "theme",
    "then",
    "theory",
    "there",
    "they",
    "thing",
    "this",
    "thought",
    "three",
    "thrive",
    "throw",
    "thumb",
    "thunder",
    "ticket",
    "tide",
    "tiger",
    "tilt",
    "timber",
    "time",
    "tiny",
    "tip",
    "tired",
    "tissue",
    "title",
    "toast",
    "tobacco",
    "today",
    "toddler",
    "toe",
    "together",
    "toilet",
    "token",
    "tomato",
    "tomorrow",
    "tone",
    "tongue",
    "tonight",
    "tool",
    "tooth",
    "top",
    "topic",
    "topple",
    "torch",
    "tornado",
    "tortoise",
    "toss",
    "total",
    "tourist",
    "toward",
    "tower",
    "town",
    "toy",
    "track",
    "trade",
    "traffic",
    "tragic",
    "train",
    "transfer",
    "trap",
    "trash",
    "travel",
    "tray",
    "treat",
    "tree",
    "trend",
    "trial",
    "tribe",
    "trick",
    "trigger",
    "trim",
    "trip",
    "trophy",
    "trouble",
    "truck",
    "true",
    "truly",
    "trumpet",
    "trust",
    "truth",
    "try",
    "tube",
    "tuition",
    "tumble",
    "tuna",
    "tunnel",
    "turkey",
    "turn",
    "turtle",
    "twelve",
    "twenty",
    "twice",
    "twin",
    "twist",
    "two",
    "type",
    "typical",
    "ugly",
    "umbrella",
    "unable",
    "unaware",
    "uncle",
    "uncover",
    "under",
    "undo",
    "unfair",
    "unfold",
    "unhappy",
    "uniform",
    "unique",
    "unit",
    "universe",
    "unknown",
    "unlock",
    "until",
    "unusual",
    "unveil",
    "update",
    "upgrade",
    "uphold",
    "upon",
    "upper",
    "upset",
    "urban",
    "urge",
    "usage",
    "use",
    "used",
    "useful",
    "useless",
    "usual",
    "utility",
    "vacant",
    "vacuum",
    "vague",
    "valid",
    "valley",
    "valve",
    "van",
    "vanish",
    "vapor",
    "various",
    "vast",
    "vault",
    "vehicle",
    "velvet",
    "vendor",
    "venture",
    "venue",
    "verb",
    "verify",
    "version",
    "very",
    "vessel",
    "veteran",
    "viable",
    "vibrant",
    "vicious",
    "victory",
    "video",
    "view",
    "village",
    "vintage",
    "violin",
    "virtual",
    "virus",
    "visa",
    "visit",
    "visual",
    "vital",
    "vivid",
    "vocal",
    "voice",
    "void",
    "volcano",
    "volume",
    "vote",
    "voyage",
    "wage",
    "wagon",
    "wait",
    "walk",
    "wall",
    "walnut",
    "want",
    "warfare",
    "warm",
    "warrior",
    "wash",
    "wasp",
    "waste",
    "water",
    "wave",
    "way",
    "wealth",
    "weapon",
    "wear",
    "weasel",
    "weather",
    "web",
    "wedding",
    "weekend",
    "weird",
    "welcome",
    "west",
    "wet",
    "whale",
    "what",
    "wheat",
    "wheel",
    "when",
    "where",
    "whip",
    "whisper",
    "wide",
    "width",
    "wife",
    "wild",
    "will",
    "win",
    "window",
    "wine",
    "wing",
    "wink",
    "winner",
    "winter",
    "wire",
    "wisdom",
    "wise",
    "wish",
    "witness",
    "wolf",
    "woman",
    "wonder",
    "wood",
    "wool",
    "word",
    "work",
    "world",
    "worry",
    "worth",
    "wrap",
    "wreck",
    "wrestle",
    "wrist",
    "write",
    "wrong",
    "yard",
    "year",
    "yellow",
    "you",
    "young",
    "youth",
    "zebra",
    "zero",
    "zone",
    "zoo"
]

},{}],27:[function(require,module,exports){
module.exports=[
    "abaisser",
    "abandon",
    "abdiquer",
    "abeille",
    "abolir",
    "aborder",
    "aboutir",
    "aboyer",
    "abrasif",
    "abreuver",
    "abriter",
    "abroger",
    "abrupt",
    "absence",
    "absolu",
    "absurde",
    "abusif",
    "abyssal",
    "académie",
    "acajou",
    "acarien",
    "accabler",
    "accepter",
    "acclamer",
    "accolade",
    "accroche",
    "accuser",
    "acerbe",
    "achat",
    "acheter",
    "aciduler",
    "acier",
    "acompte",
    "acquérir",
    "acronyme",
    "acteur",
    "actif",
    "actuel",
    "adepte",
    "adéquat",
    "adhésif",
    "adjectif",
    "adjuger",
    "admettre",
    "admirer",
    "adopter",
    "adorer",
    "adoucir",
    "adresse",
    "adroit",
    "adulte",
    "adverbe",
    "aérer",
    "aéronef",
    "affaire",
    "affecter",
    "affiche",
    "affreux",
    "affubler",
    "agacer",
    "agencer",
    "agile",
    "agiter",
    "agrafer",
    "agréable",
    "agrume",
    "aider",
    "aiguille",
    "ailier",
    "aimable",
    "aisance",
    "ajouter",
    "ajuster",
    "alarmer",
    "alchimie",
    "alerte",
    "algèbre",
    "algue",
    "aliéner",
    "aliment",
    "alléger",
    "alliage",
    "allouer",
    "allumer",
    "alourdir",
    "alpaga",
    "altesse",
    "alvéole",
    "amateur",
    "ambigu",
    "ambre",
    "aménager",
    "amertume",
    "amidon",
    "amiral",
    "amorcer",
    "amour",
    "amovible",
    "amphibie",
    "ampleur",
    "amusant",
    "analyse",
    "anaphore",
    "anarchie",
    "anatomie",
    "ancien",
    "anéantir",
    "angle",
    "angoisse",
    "anguleux",
    "animal",
    "annexer",
    "annonce",
    "annuel",
    "anodin",
    "anomalie",
    "anonyme",
    "anormal",
    "antenne",
    "antidote",
    "anxieux",
    "apaiser",
    "apéritif",
    "aplanir",
    "apologie",
    "appareil",
    "appeler",
    "apporter",
    "appuyer",
    "aquarium",
    "aqueduc",
    "arbitre",
    "arbuste",
    "ardeur",
    "ardoise",
    "argent",
    "arlequin",
    "armature",
    "armement",
    "armoire",
    "armure",
    "arpenter",
    "arracher",
    "arriver",
    "arroser",
    "arsenic",
    "artériel",
    "article",
    "aspect",
    "asphalte",
    "aspirer",
    "assaut",
    "asservir",
    "assiette",
    "associer",
    "assurer",
    "asticot",
    "astre",
    "astuce",
    "atelier",
    "atome",
    "atrium",
    "atroce",
    "attaque",
    "attentif",
    "attirer",
    "attraper",
    "aubaine",
    "auberge",
    "audace",
    "audible",
    "augurer",
    "aurore",
    "automne",
    "autruche",
    "avaler",
    "avancer",
    "avarice",
    "avenir",
    "averse",
    "aveugle",
    "aviateur",
    "avide",
    "avion",
    "aviser",
    "avoine",
    "avouer",
    "avril",
    "axial",
    "axiome",
    "badge",
    "bafouer",
    "bagage",
    "baguette",
    "baignade",
    "balancer",
    "balcon",
    "baleine",
    "balisage",
    "bambin",
    "bancaire",
    "bandage",
    "banlieue",
    "bannière",
    "banquier",
    "barbier",
    "baril",
    "baron",
    "barque",
    "barrage",
    "bassin",
    "bastion",
    "bataille",
    "bateau",
    "batterie",
    "baudrier",
    "bavarder",
    "belette",
    "bélier",
    "belote",
    "bénéfice",
    "berceau",
    "berger",
    "berline",
    "bermuda",
    "besace",
    "besogne",
    "bétail",
    "beurre",
    "biberon",
    "bicycle",
    "bidule",
    "bijou",
    "bilan",
    "bilingue",
    "billard",
    "binaire",
    "biologie",
    "biopsie",
    "biotype",
    "biscuit",
    "bison",
    "bistouri",
    "bitume",
    "bizarre",
    "blafard",
    "blague",
    "blanchir",
    "blessant",
    "blinder",
    "blond",
    "bloquer",
    "blouson",
    "bobard",
    "bobine",
    "boire",
    "boiser",
    "bolide",
    "bonbon",
    "bondir",
    "bonheur",
    "bonifier",
    "bonus",
    "bordure",
    "borne",
    "botte",
    "boucle",
    "boueux",
    "bougie",
    "boulon",
    "bouquin",
    "bourse",
    "boussole",
    "boutique",
    "boxeur",
    "branche",
    "brasier",
    "brave",
    "brebis",
    "brèche",
    "breuvage",
    "bricoler",
    "brigade",
    "brillant",
    "brioche",
    "brique",
    "brochure",
    "broder",
    "bronzer",
    "brousse",
    "broyeur",
    "brume",
    "brusque",
    "brutal",
    "bruyant",
    "buffle",
    "buisson",
    "bulletin",
    "bureau",
    "burin",
    "bustier",
    "butiner",
    "butoir",
    "buvable",
    "buvette",
    "cabanon",
    "cabine",
    "cachette",
    "cadeau",
    "cadre",
    "caféine",
    "caillou",
    "caisson",
    "calculer",
    "calepin",
    "calibre",
    "calmer",
    "calomnie",
    "calvaire",
    "camarade",
    "caméra",
    "camion",
    "campagne",
    "canal",
    "caneton",
    "canon",
    "cantine",
    "canular",
    "capable",
    "caporal",
    "caprice",
    "capsule",
    "capter",
    "capuche",
    "carabine",
    "carbone",
    "caresser",
    "caribou",
    "carnage",
    "carotte",
    "carreau",
    "carton",
    "cascade",
    "casier",
    "casque",
    "cassure",
    "causer",
    "caution",
    "cavalier",
    "caverne",
    "caviar",
    "cédille",
    "ceinture",
    "céleste",
    "cellule",
    "cendrier",
    "censurer",
    "central",
    "cercle",
    "cérébral",
    "cerise",
    "cerner",
    "cerveau",
    "cesser",
    "chagrin",
    "chaise",
    "chaleur",
    "chambre",
    "chance",
    "chapitre",
    "charbon",
    "chasseur",
    "chaton",
    "chausson",
    "chavirer",
    "chemise",
    "chenille",
    "chéquier",
    "chercher",
    "cheval",
    "chien",
    "chiffre",
    "chignon",
    "chimère",
    "chiot",
    "chlorure",
    "chocolat",
    "choisir",
    "chose",
    "chouette",
    "chrome",
    "chute",
    "cigare",
    "cigogne",
    "cimenter",
    "cinéma",
    "cintrer",
    "circuler",
    "cirer",
    "cirque",
    "citerne",
    "citoyen",
    "citron",
    "civil",
    "clairon",
    "clameur",
    "claquer",
    "classe",
    "clavier",
    "client",
    "cligner",
    "climat",
    "clivage",
    "cloche",
    "clonage",
    "cloporte",
    "cobalt",
    "cobra",
    "cocasse",
    "cocotier",
    "coder",
    "codifier",
    "coffre",
    "cogner",
    "cohésion",
    "coiffer",
    "coincer",
    "colère",
    "colibri",
    "colline",
    "colmater",
    "colonel",
    "combat",
    "comédie",
    "commande",
    "compact",
    "concert",
    "conduire",
    "confier",
    "congeler",
    "connoter",
    "consonne",
    "contact",
    "convexe",
    "copain",
    "copie",
    "corail",
    "corbeau",
    "cordage",
    "corniche",
    "corpus",
    "correct",
    "cortège",
    "cosmique",
    "costume",
    "coton",
    "coude",
    "coupure",
    "courage",
    "couteau",
    "couvrir",
    "coyote",
    "crabe",
    "crainte",
    "cravate",
    "crayon",
    "créature",
    "créditer",
    "crémeux",
    "creuser",
    "crevette",
    "cribler",
    "crier",
    "cristal",
    "critère",
    "croire",
    "croquer",
    "crotale",
    "crucial",
    "cruel",
    "crypter",
    "cubique",
    "cueillir",
    "cuillère",
    "cuisine",
    "cuivre",
    "culminer",
    "cultiver",
    "cumuler",
    "cupide",
    "curatif",
    "curseur",
    "cyanure",
    "cycle",
    "cylindre",
    "cynique",
    "daigner",
    "damier",
    "danger",
    "danseur",
    "dauphin",
    "débattre",
    "débiter",
    "déborder",
    "débrider",
    "débutant",
    "décaler",
    "décembre",
    "déchirer",
    "décider",
    "déclarer",
    "décorer",
    "décrire",
    "décupler",
    "dédale",
    "déductif",
    "déesse",
    "défensif",
    "défiler",
    "défrayer",
    "dégager",
    "dégivrer",
    "déglutir",
    "dégrafer",
    "déjeuner",
    "délice",
    "déloger",
    "demander",
    "demeurer",
    "démolir",
    "dénicher",
    "dénouer",
    "dentelle",
    "dénuder",
    "départ",
    "dépenser",
    "déphaser",
    "déplacer",
    "déposer",
    "déranger",
    "dérober",
    "désastre",
    "descente",
    "désert",
    "désigner",
    "désobéir",
    "dessiner",
    "destrier",
    "détacher",
    "détester",
    "détourer",
    "détresse",
    "devancer",
    "devenir",
    "deviner",
    "devoir",
    "diable",
    "dialogue",
    "diamant",
    "dicter",
    "différer",
    "digérer",
    "digital",
    "digne",
    "diluer",
    "dimanche",
    "diminuer",
    "dioxyde",
    "directif",
    "diriger",
    "discuter",
    "disposer",
    "dissiper",
    "distance",
    "divertir",
    "diviser",
    "docile",
    "docteur",
    "dogme",
    "doigt",
    "domaine",
    "domicile",
    "dompter",
    "donateur",
    "donjon",
    "donner",
    "dopamine",
    "dortoir",
    "dorure",
    "dosage",
    "doseur",
    "dossier",
    "dotation",
    "douanier",
    "double",
    "douceur",
    "douter",
    "doyen",
    "dragon",
    "draper",
    "dresser",
    "dribbler",
    "droiture",
    "duperie",
    "duplexe",
    "durable",
    "durcir",
    "dynastie",
    "éblouir",
    "écarter",
    "écharpe",
    "échelle",
    "éclairer",
    "éclipse",
    "éclore",
    "écluse",
    "école",
    "économie",
    "écorce",
    "écouter",
    "écraser",
    "écrémer",
    "écrivain",
    "écrou",
    "écume",
    "écureuil",
    "édifier",
    "éduquer",
    "effacer",
    "effectif",
    "effigie",
    "effort",
    "effrayer",
    "effusion",
    "égaliser",
    "égarer",
    "éjecter",
    "élaborer",
    "élargir",
    "électron",
    "élégant",
    "éléphant",
    "élève",
    "éligible",
    "élitisme",
    "éloge",
    "élucider",
    "éluder",
    "emballer",
    "embellir",
    "embryon",
    "émeraude",
    "émission",
    "emmener",
    "émotion",
    "émouvoir",
    "empereur",
    "employer",
    "emporter",
    "emprise",
    "émulsion",
    "encadrer",
    "enchère",
    "enclave",
    "encoche",
    "endiguer",
    "endosser",
    "endroit",
    "enduire",
    "énergie",
    "enfance",
    "enfermer",
    "enfouir",
    "engager",
    "engin",
    "englober",
    "énigme",
    "enjamber",
    "enjeu",
    "enlever",
    "ennemi",
    "ennuyeux",
    "enrichir",
    "enrobage",
    "enseigne",
    "entasser",
    "entendre",
    "entier",
    "entourer",
    "entraver",
    "énumérer",
    "envahir",
    "enviable",
    "envoyer",
    "enzyme",
    "éolien",
    "épaissir",
    "épargne",
    "épatant",
    "épaule",
    "épicerie",
    "épidémie",
    "épier",
    "épilogue",
    "épine",
    "épisode",
    "épitaphe",
    "époque",
    "épreuve",
    "éprouver",
    "épuisant",
    "équerre",
    "équipe",
    "ériger",
    "érosion",
    "erreur",
    "éruption",
    "escalier",
    "espadon",
    "espèce",
    "espiègle",
    "espoir",
    "esprit",
    "esquiver",
    "essayer",
    "essence",
    "essieu",
    "essorer",
    "estime",
    "estomac",
    "estrade",
    "étagère",
    "étaler",
    "étanche",
    "étatique",
    "éteindre",
    "étendoir",
    "éternel",
    "éthanol",
    "éthique",
    "ethnie",
    "étirer",
    "étoffer",
    "étoile",
    "étonnant",
    "étourdir",
    "étrange",
    "étroit",
    "étude",
    "euphorie",
    "évaluer",
    "évasion",
    "éventail",
    "évidence",
    "éviter",
    "évolutif",
    "évoquer",
    "exact",
    "exagérer",
    "exaucer",
    "exceller",
    "excitant",
    "exclusif",
    "excuse",
    "exécuter",
    "exemple",
    "exercer",
    "exhaler",
    "exhorter",
    "exigence",
    "exiler",
    "exister",
    "exotique",
    "expédier",
    "explorer",
    "exposer",
    "exprimer",
    "exquis",
    "extensif",
    "extraire",
    "exulter",
    "fable",
    "fabuleux",
    "facette",
    "facile",
    "facture",
    "faiblir",
    "falaise",
    "fameux",
    "famille",
    "farceur",
    "farfelu",
    "farine",
    "farouche",
    "fasciner",
    "fatal",
    "fatigue",
    "faucon",
    "fautif",
    "faveur",
    "favori",
    "fébrile",
    "féconder",
    "fédérer",
    "félin",
    "femme",
    "fémur",
    "fendoir",
    "féodal",
    "fermer",
    "féroce",
    "ferveur",
    "festival",
    "feuille",
    "feutre",
    "février",
    "fiasco",
    "ficeler",
    "fictif",
    "fidèle",
    "figure",
    "filature",
    "filetage",
    "filière",
    "filleul",
    "filmer",
    "filou",
    "filtrer",
    "financer",
    "finir",
    "fiole",
    "firme",
    "fissure",
    "fixer",
    "flairer",
    "flamme",
    "flasque",
    "flatteur",
    "fléau",
    "flèche",
    "fleur",
    "flexion",
    "flocon",
    "flore",
    "fluctuer",
    "fluide",
    "fluvial",
    "folie",
    "fonderie",
    "fongible",
    "fontaine",
    "forcer",
    "forgeron",
    "formuler",
    "fortune",
    "fossile",
    "foudre",
    "fougère",
    "fouiller",
    "foulure",
    "fourmi",
    "fragile",
    "fraise",
    "franchir",
    "frapper",
    "frayeur",
    "frégate",
    "freiner",
    "frelon",
    "frémir",
    "frénésie",
    "frère",
    "friable",
    "friction",
    "frisson",
    "frivole",
    "froid",
    "fromage",
    "frontal",
    "frotter",
    "fruit",
    "fugitif",
    "fuite",
    "fureur",
    "furieux",
    "furtif",
    "fusion",
    "futur",
    "gagner",
    "galaxie",
    "galerie",
    "gambader",
    "garantir",
    "gardien",
    "garnir",
    "garrigue",
    "gazelle",
    "gazon",
    "géant",
    "gélatine",
    "gélule",
    "gendarme",
    "général",
    "génie",
    "genou",
    "gentil",
    "géologie",
    "géomètre",
    "géranium",
    "germe",
    "gestuel",
    "geyser",
    "gibier",
    "gicler",
    "girafe",
    "givre",
    "glace",
    "glaive",
    "glisser",
    "globe",
    "gloire",
    "glorieux",
    "golfeur",
    "gomme",
    "gonfler",
    "gorge",
    "gorille",
    "goudron",
    "gouffre",
    "goulot",
    "goupille",
    "gourmand",
    "goutte",
    "graduel",
    "graffiti",
    "graine",
    "grand",
    "grappin",
    "gratuit",
    "gravir",
    "grenat",
    "griffure",
    "griller",
    "grimper",
    "grogner",
    "gronder",
    "grotte",
    "groupe",
    "gruger",
    "grutier",
    "gruyère",
    "guépard",
    "guerrier",
    "guide",
    "guimauve",
    "guitare",
    "gustatif",
    "gymnaste",
    "gyrostat",
    "habitude",
    "hachoir",
    "halte",
    "hameau",
    "hangar",
    "hanneton",
    "haricot",
    "harmonie",
    "harpon",
    "hasard",
    "hélium",
    "hématome",
    "herbe",
    "hérisson",
    "hermine",
    "héron",
    "hésiter",
    "heureux",
    "hiberner",
    "hibou",
    "hilarant",
    "histoire",
    "hiver",
    "homard",
    "hommage",
    "homogène",
    "honneur",
    "honorer",
    "honteux",
    "horde",
    "horizon",
    "horloge",
    "hormone",
    "horrible",
    "houleux",
    "housse",
    "hublot",
    "huileux",
    "humain",
    "humble",
    "humide",
    "humour",
    "hurler",
    "hydromel",
    "hygiène",
    "hymne",
    "hypnose",
    "idylle",
    "ignorer",
    "iguane",
    "illicite",
    "illusion",
    "image",
    "imbiber",
    "imiter",
    "immense",
    "immobile",
    "immuable",
    "impact",
    "impérial",
    "implorer",
    "imposer",
    "imprimer",
    "imputer",
    "incarner",
    "incendie",
    "incident",
    "incliner",
    "incolore",
    "indexer",
    "indice",
    "inductif",
    "inédit",
    "ineptie",
    "inexact",
    "infini",
    "infliger",
    "informer",
    "infusion",
    "ingérer",
    "inhaler",
    "inhiber",
    "injecter",
    "injure",
    "innocent",
    "inoculer",
    "inonder",
    "inscrire",
    "insecte",
    "insigne",
    "insolite",
    "inspirer",
    "instinct",
    "insulter",
    "intact",
    "intense",
    "intime",
    "intrigue",
    "intuitif",
    "inutile",
    "invasion",
    "inventer",
    "inviter",
    "invoquer",
    "ironique",
    "irradier",
    "irréel",
    "irriter",
    "isoler",
    "ivoire",
    "ivresse",
    "jaguar",
    "jaillir",
    "jambe",
    "janvier",
    "jardin",
    "jauger",
    "jaune",
    "javelot",
    "jetable",
    "jeton",
    "jeudi",
    "jeunesse",
    "joindre",
    "joncher",
    "jongler",
    "joueur",
    "jouissif",
    "journal",
    "jovial",
    "joyau",
    "joyeux",
    "jubiler",
    "jugement",
    "junior",
    "jupon",
    "juriste",
    "justice",
    "juteux",
    "juvénile",
    "kayak",
    "kimono",
    "kiosque",
    "label",
    "labial",
    "labourer",
    "lacérer",
    "lactose",
    "lagune",
    "laine",
    "laisser",
    "laitier",
    "lambeau",
    "lamelle",
    "lampe",
    "lanceur",
    "langage",
    "lanterne",
    "lapin",
    "largeur",
    "larme",
    "laurier",
    "lavabo",
    "lavoir",
    "lecture",
    "légal",
    "léger",
    "légume",
    "lessive",
    "lettre",
    "levier",
    "lexique",
    "lézard",
    "liasse",
    "libérer",
    "libre",
    "licence",
    "licorne",
    "liège",
    "lièvre",
    "ligature",
    "ligoter",
    "ligue",
    "limer",
    "limite",
    "limonade",
    "limpide",
    "linéaire",
    "lingot",
    "lionceau",
    "liquide",
    "lisière",
    "lister",
    "lithium",
    "litige",
    "littoral",
    "livreur",
    "logique",
    "lointain",
    "loisir",
    "lombric",
    "loterie",
    "louer",
    "lourd",
    "loutre",
    "louve",
    "loyal",
    "lubie",
    "lucide",
    "lucratif",
    "lueur",
    "lugubre",
    "luisant",
    "lumière",
    "lunaire",
    "lundi",
    "luron",
    "lutter",
    "luxueux",
    "machine",
    "magasin",
    "magenta",
    "magique",
    "maigre",
    "maillon",
    "maintien",
    "mairie",
    "maison",
    "majorer",
    "malaxer",
    "maléfice",
    "malheur",
    "malice",
    "mallette",
    "mammouth",
    "mandater",
    "maniable",
    "manquant",
    "manteau",
    "manuel",
    "marathon",
    "marbre",
    "marchand",
    "mardi",
    "maritime",
    "marqueur",
    "marron",
    "marteler",
    "mascotte",
    "massif",
    "matériel",
    "matière",
    "matraque",
    "maudire",
    "maussade",
    "mauve",
    "maximal",
    "méchant",
    "méconnu",
    "médaille",
    "médecin",
    "méditer",
    "méduse",
    "meilleur",
    "mélange",
    "mélodie",
    "membre",
    "mémoire",
    "menacer",
    "mener",
    "menhir",
    "mensonge",
    "mentor",
    "mercredi",
    "mérite",
    "merle",
    "messager",
    "mesure",
    "métal",
    "météore",
    "méthode",
    "métier",
    "meuble",
    "miauler",
    "microbe",
    "miette",
    "mignon",
    "migrer",
    "milieu",
    "million",
    "mimique",
    "mince",
    "minéral",
    "minimal",
    "minorer",
    "minute",
    "miracle",
    "miroiter",
    "missile",
    "mixte",
    "mobile",
    "moderne",
    "moelleux",
    "mondial",
    "moniteur",
    "monnaie",
    "monotone",
    "monstre",
    "montagne",
    "monument",
    "moqueur",
    "morceau",
    "morsure",
    "mortier",
    "moteur",
    "motif",
    "mouche",
    "moufle",
    "moulin",
    "mousson",
    "mouton",
    "mouvant",
    "multiple",
    "munition",
    "muraille",
    "murène",
    "murmure",
    "muscle",
    "muséum",
    "musicien",
    "mutation",
    "muter",
    "mutuel",
    "myriade",
    "myrtille",
    "mystère",
    "mythique",
    "nageur",
    "nappe",
    "narquois",
    "narrer",
    "natation",
    "nation",
    "nature",
    "naufrage",
    "nautique",
    "navire",
    "nébuleux",
    "nectar",
    "néfaste",
    "négation",
    "négliger",
    "négocier",
    "neige",
    "nerveux",
    "nettoyer",
    "neurone",
    "neutron",
    "neveu",
    "niche",
    "nickel",
    "nitrate",
    "niveau",
    "noble",
    "nocif",
    "nocturne",
    "noirceur",
    "noisette",
    "nomade",
    "nombreux",
    "nommer",
    "normatif",
    "notable",
    "notifier",
    "notoire",
    "nourrir",
    "nouveau",
    "novateur",
    "novembre",
    "novice",
    "nuage",
    "nuancer",
    "nuire",
    "nuisible",
    "numéro",
    "nuptial",
    "nuque",
    "nutritif",
    "obéir",
    "objectif",
    "obliger",
    "obscur",
    "observer",
    "obstacle",
    "obtenir",
    "obturer",
    "occasion",
    "occuper",
    "océan",
    "octobre",
    "octroyer",
    "octupler",
    "oculaire",
    "odeur",
    "odorant",
    "offenser",
    "officier",
    "offrir",
    "ogive",
    "oiseau",
    "oisillon",
    "olfactif",
    "olivier",
    "ombrage",
    "omettre",
    "onctueux",
    "onduler",
    "onéreux",
    "onirique",
    "opale",
    "opaque",
    "opérer",
    "opinion",
    "opportun",
    "opprimer",
    "opter",
    "optique",
    "orageux",
    "orange",
    "orbite",
    "ordonner",
    "oreille",
    "organe",
    "orgueil",
    "orifice",
    "ornement",
    "orque",
    "ortie",
    "osciller",
    "osmose",
    "ossature",
    "otarie",
    "ouragan",
    "ourson",
    "outil",
    "outrager",
    "ouvrage",
    "ovation",
    "oxyde",
    "oxygène",
    "ozone",
    "paisible",
    "palace",
    "palmarès",
    "palourde",
    "palper",
    "panache",
    "panda",
    "pangolin",
    "paniquer",
    "panneau",
    "panorama",
    "pantalon",
    "papaye",
    "papier",
    "papoter",
    "papyrus",
    "paradoxe",
    "parcelle",
    "paresse",
    "parfumer",
    "parler",
    "parole",
    "parrain",
    "parsemer",
    "partager",
    "parure",
    "parvenir",
    "passion",
    "pastèque",
    "paternel",
    "patience",
    "patron",
    "pavillon",
    "pavoiser",
    "payer",
    "paysage",
    "peigne",
    "peintre",
    "pelage",
    "pélican",
    "pelle",
    "pelouse",
    "peluche",
    "pendule",
    "pénétrer",
    "pénible",
    "pensif",
    "pénurie",
    "pépite",
    "péplum",
    "perdrix",
    "perforer",
    "période",
    "permuter",
    "perplexe",
    "persil",
    "perte",
    "peser",
    "pétale",
    "petit",
    "pétrir",
    "peuple",
    "pharaon",
    "phobie",
    "phoque",
    "photon",
    "phrase",
    "physique",
    "piano",
    "pictural",
    "pièce",
    "pierre",
    "pieuvre",
    "pilote",
    "pinceau",
    "pipette",
    "piquer",
    "pirogue",
    "piscine",
    "piston",
    "pivoter",
    "pixel",
    "pizza",
    "placard",
    "plafond",
    "plaisir",
    "planer",
    "plaque",
    "plastron",
    "plateau",
    "pleurer",
    "plexus",
    "pliage",
    "plomb",
    "plonger",
    "pluie",
    "plumage",
    "pochette",
    "poésie",
    "poète",
    "pointe",
    "poirier",
    "poisson",
    "poivre",
    "polaire",
    "policier",
    "pollen",
    "polygone",
    "pommade",
    "pompier",
    "ponctuel",
    "pondérer",
    "poney",
    "portique",
    "position",
    "posséder",
    "posture",
    "potager",
    "poteau",
    "potion",
    "pouce",
    "poulain",
    "poumon",
    "pourpre",
    "poussin",
    "pouvoir",
    "prairie",
    "pratique",
    "précieux",
    "prédire",
    "préfixe",
    "prélude",
    "prénom",
    "présence",
    "prétexte",
    "prévoir",
    "primitif",
    "prince",
    "prison",
    "priver",
    "problème",
    "procéder",
    "prodige",
    "profond",
    "progrès",
    "proie",
    "projeter",
    "prologue",
    "promener",
    "propre",
    "prospère",
    "protéger",
    "prouesse",
    "proverbe",
    "prudence",
    "pruneau",
    "psychose",
    "public",
    "puceron",
    "puiser",
    "pulpe",
    "pulsar",
    "punaise",
    "punitif",
    "pupitre",
    "purifier",
    "puzzle",
    "pyramide",
    "quasar",
    "querelle",
    "question",
    "quiétude",
    "quitter",
    "quotient",
    "racine",
    "raconter",
    "radieux",
    "ragondin",
    "raideur",
    "raisin",
    "ralentir",
    "rallonge",
    "ramasser",
    "rapide",
    "rasage",
    "ratisser",
    "ravager",
    "ravin",
    "rayonner",
    "réactif",
    "réagir",
    "réaliser",
    "réanimer",
    "recevoir",
    "réciter",
    "réclamer",
    "récolter",
    "recruter",
    "reculer",
    "recycler",
    "rédiger",
    "redouter",
    "refaire",
    "réflexe",
    "réformer",
    "refrain",
    "refuge",
    "régalien",
    "région",
    "réglage",
    "régulier",
    "réitérer",
    "rejeter",
    "rejouer",
    "relatif",
    "relever",
    "relief",
    "remarque",
    "remède",
    "remise",
    "remonter",
    "remplir",
    "remuer",
    "renard",
    "renfort",
    "renifler",
    "renoncer",
    "rentrer",
    "renvoi",
    "replier",
    "reporter",
    "reprise",
    "reptile",
    "requin",
    "réserve",
    "résineux",
    "résoudre",
    "respect",
    "rester",
    "résultat",
    "rétablir",
    "retenir",
    "réticule",
    "retomber",
    "retracer",
    "réunion",
    "réussir",
    "revanche",
    "revivre",
    "révolte",
    "révulsif",
    "richesse",
    "rideau",
    "rieur",
    "rigide",
    "rigoler",
    "rincer",
    "riposter",
    "risible",
    "risque",
    "rituel",
    "rival",
    "rivière",
    "rocheux",
    "romance",
    "rompre",
    "ronce",
    "rondin",
    "roseau",
    "rosier",
    "rotatif",
    "rotor",
    "rotule",
    "rouge",
    "rouille",
    "rouleau",
    "routine",
    "royaume",
    "ruban",
    "rubis",
    "ruche",
    "ruelle",
    "rugueux",
    "ruiner",
    "ruisseau",
    "ruser",
    "rustique",
    "rythme",
    "sabler",
    "saboter",
    "sabre",
    "sacoche",
    "safari",
    "sagesse",
    "saisir",
    "salade",
    "salive",
    "salon",
    "saluer",
    "samedi",
    "sanction",
    "sanglier",
    "sarcasme",
    "sardine",
    "saturer",
    "saugrenu",
    "saumon",
    "sauter",
    "sauvage",
    "savant",
    "savonner",
    "scalpel",
    "scandale",
    "scélérat",
    "scénario",
    "sceptre",
    "schéma",
    "science",
    "scinder",
    "score",
    "scrutin",
    "sculpter",
    "séance",
    "sécable",
    "sécher",
    "secouer",
    "sécréter",
    "sédatif",
    "séduire",
    "seigneur",
    "séjour",
    "sélectif",
    "semaine",
    "sembler",
    "semence",
    "séminal",
    "sénateur",
    "sensible",
    "sentence",
    "séparer",
    "séquence",
    "serein",
    "sergent",
    "sérieux",
    "serrure",
    "sérum",
    "service",
    "sésame",
    "sévir",
    "sevrage",
    "sextuple",
    "sidéral",
    "siècle",
    "siéger",
    "siffler",
    "sigle",
    "signal",
    "silence",
    "silicium",
    "simple",
    "sincère",
    "sinistre",
    "siphon",
    "sirop",
    "sismique",
    "situer",
    "skier",
    "social",
    "socle",
    "sodium",
    "soigneux",
    "soldat",
    "soleil",
    "solitude",
    "soluble",
    "sombre",
    "sommeil",
    "somnoler",
    "sonde",
    "songeur",
    "sonnette",
    "sonore",
    "sorcier",
    "sortir",
    "sosie",
    "sottise",
    "soucieux",
    "soudure",
    "souffle",
    "soulever",
    "soupape",
    "source",
    "soutirer",
    "souvenir",
    "spacieux",
    "spatial",
    "spécial",
    "sphère",
    "spiral",
    "stable",
    "station",
    "sternum",
    "stimulus",
    "stipuler",
    "strict",
    "studieux",
    "stupeur",
    "styliste",
    "sublime",
    "substrat",
    "subtil",
    "subvenir",
    "succès",
    "sucre",
    "suffixe",
    "suggérer",
    "suiveur",
    "sulfate",
    "superbe",
    "supplier",
    "surface",
    "suricate",
    "surmener",
    "surprise",
    "sursaut",
    "survie",
    "suspect",
    "syllabe",
    "symbole",
    "symétrie",
    "synapse",
    "syntaxe",
    "système",
    "tabac",
    "tablier",
    "tactile",
    "tailler",
    "talent",
    "talisman",
    "talonner",
    "tambour",
    "tamiser",
    "tangible",
    "tapis",
    "taquiner",
    "tarder",
    "tarif",
    "tartine",
    "tasse",
    "tatami",
    "tatouage",
    "taupe",
    "taureau",
    "taxer",
    "témoin",
    "temporel",
    "tenaille",
    "tendre",
    "teneur",
    "tenir",
    "tension",
    "terminer",
    "terne",
    "terrible",
    "tétine",
    "texte",
    "thème",
    "théorie",
    "thérapie",
    "thorax",
    "tibia",
    "tiède",
    "timide",
    "tirelire",
    "tiroir",
    "tissu",
    "titane",
    "titre",
    "tituber",
    "toboggan",
    "tolérant",
    "tomate",
    "tonique",
    "tonneau",
    "toponyme",
    "torche",
    "tordre",
    "tornade",
    "torpille",
    "torrent",
    "torse",
    "tortue",
    "totem",
    "toucher",
    "tournage",
    "tousser",
    "toxine",
    "traction",
    "trafic",
    "tragique",
    "trahir",
    "train",
    "trancher",
    "travail",
    "trèfle",
    "tremper",
    "trésor",
    "treuil",
    "triage",
    "tribunal",
    "tricoter",
    "trilogie",
    "triomphe",
    "tripler",
    "triturer",
    "trivial",
    "trombone",
    "tronc",
    "tropical",
    "troupeau",
    "tuile",
    "tulipe",
    "tumulte",
    "tunnel",
    "turbine",
    "tuteur",
    "tutoyer",
    "tuyau",
    "tympan",
    "typhon",
    "typique",
    "tyran",
    "ubuesque",
    "ultime",
    "ultrason",
    "unanime",
    "unifier",
    "union",
    "unique",
    "unitaire",
    "univers",
    "uranium",
    "urbain",
    "urticant",
    "usage",
    "usine",
    "usuel",
    "usure",
    "utile",
    "utopie",
    "vacarme",
    "vaccin",
    "vagabond",
    "vague",
    "vaillant",
    "vaincre",
    "vaisseau",
    "valable",
    "valise",
    "vallon",
    "valve",
    "vampire",
    "vanille",
    "vapeur",
    "varier",
    "vaseux",
    "vassal",
    "vaste",
    "vecteur",
    "vedette",
    "végétal",
    "véhicule",
    "veinard",
    "véloce",
    "vendredi",
    "vénérer",
    "venger",
    "venimeux",
    "ventouse",
    "verdure",
    "vérin",
    "vernir",
    "verrou",
    "verser",
    "vertu",
    "veston",
    "vétéran",
    "vétuste",
    "vexant",
    "vexer",
    "viaduc",
    "viande",
    "victoire",
    "vidange",
    "vidéo",
    "vignette",
    "vigueur",
    "vilain",
    "village",
    "vinaigre",
    "violon",
    "vipère",
    "virement",
    "virtuose",
    "virus",
    "visage",
    "viseur",
    "vision",
    "visqueux",
    "visuel",
    "vital",
    "vitesse",
    "viticole",
    "vitrine",
    "vivace",
    "vivipare",
    "vocation",
    "voguer",
    "voile",
    "voisin",
    "voiture",
    "volaille",
    "volcan",
    "voltiger",
    "volume",
    "vorace",
    "vortex",
    "voter",
    "vouloir",
    "voyage",
    "voyelle",
    "wagon",
    "xénon",
    "yacht",
    "zèbre",
    "zénith",
    "zeste",
    "zoologie"
]

},{}],28:[function(require,module,exports){
module.exports=[
    "abaco",
    "abbaglio",
    "abbinato",
    "abete",
    "abisso",
    "abolire",
    "abrasivo",
    "abrogato",
    "accadere",
    "accenno",
    "accusato",
    "acetone",
    "achille",
    "acido",
    "acqua",
    "acre",
    "acrilico",
    "acrobata",
    "acuto",
    "adagio",
    "addebito",
    "addome",
    "adeguato",
    "aderire",
    "adipe",
    "adottare",
    "adulare",
    "affabile",
    "affetto",
    "affisso",
    "affranto",
    "aforisma",
    "afoso",
    "africano",
    "agave",
    "agente",
    "agevole",
    "aggancio",
    "agire",
    "agitare",
    "agonismo",
    "agricolo",
    "agrumeto",
    "aguzzo",
    "alabarda",
    "alato",
    "albatro",
    "alberato",
    "albo",
    "albume",
    "alce",
    "alcolico",
    "alettone",
    "alfa",
    "algebra",
    "aliante",
    "alibi",
    "alimento",
    "allagato",
    "allegro",
    "allievo",
    "allodola",
    "allusivo",
    "almeno",
    "alogeno",
    "alpaca",
    "alpestre",
    "altalena",
    "alterno",
    "alticcio",
    "altrove",
    "alunno",
    "alveolo",
    "alzare",
    "amalgama",
    "amanita",
    "amarena",
    "ambito",
    "ambrato",
    "ameba",
    "america",
    "ametista",
    "amico",
    "ammasso",
    "ammenda",
    "ammirare",
    "ammonito",
    "amore",
    "ampio",
    "ampliare",
    "amuleto",
    "anacardo",
    "anagrafe",
    "analista",
    "anarchia",
    "anatra",
    "anca",
    "ancella",
    "ancora",
    "andare",
    "andrea",
    "anello",
    "angelo",
    "angolare",
    "angusto",
    "anima",
    "annegare",
    "annidato",
    "anno",
    "annuncio",
    "anonimo",
    "anticipo",
    "anzi",
    "apatico",
    "apertura",
    "apode",
    "apparire",
    "appetito",
    "appoggio",
    "approdo",
    "appunto",
    "aprile",
    "arabica",
    "arachide",
    "aragosta",
    "araldica",
    "arancio",
    "aratura",
    "arazzo",
    "arbitro",
    "archivio",
    "ardito",
    "arenile",
    "argento",
    "argine",
    "arguto",
    "aria",
    "armonia",
    "arnese",
    "arredato",
    "arringa",
    "arrosto",
    "arsenico",
    "arso",
    "artefice",
    "arzillo",
    "asciutto",
    "ascolto",
    "asepsi",
    "asettico",
    "asfalto",
    "asino",
    "asola",
    "aspirato",
    "aspro",
    "assaggio",
    "asse",
    "assoluto",
    "assurdo",
    "asta",
    "astenuto",
    "astice",
    "astratto",
    "atavico",
    "ateismo",
    "atomico",
    "atono",
    "attesa",
    "attivare",
    "attorno",
    "attrito",
    "attuale",
    "ausilio",
    "austria",
    "autista",
    "autonomo",
    "autunno",
    "avanzato",
    "avere",
    "avvenire",
    "avviso",
    "avvolgere",
    "azione",
    "azoto",
    "azzimo",
    "azzurro",
    "babele",
    "baccano",
    "bacino",
    "baco",
    "badessa",
    "badilata",
    "bagnato",
    "baita",
    "balcone",
    "baldo",
    "balena",
    "ballata",
    "balzano",
    "bambino",
    "bandire",
    "baraonda",
    "barbaro",
    "barca",
    "baritono",
    "barlume",
    "barocco",
    "basilico",
    "basso",
    "batosta",
    "battuto",
    "baule",
    "bava",
    "bavosa",
    "becco",
    "beffa",
    "belgio",
    "belva",
    "benda",
    "benevole",
    "benigno",
    "benzina",
    "bere",
    "berlina",
    "beta",
    "bibita",
    "bici",
    "bidone",
    "bifido",
    "biga",
    "bilancia",
    "bimbo",
    "binocolo",
    "biologo",
    "bipede",
    "bipolare",
    "birbante",
    "birra",
    "biscotto",
    "bisesto",
    "bisnonno",
    "bisonte",
    "bisturi",
    "bizzarro",
    "blando",
    "blatta",
    "bollito",
    "bonifico",
    "bordo",
    "bosco",
    "botanico",
    "bottino",
    "bozzolo",
    "braccio",
    "bradipo",
    "brama",
    "branca",
    "bravura",
    "bretella",
    "brevetto",
    "brezza",
    "briglia",
    "brillante",
    "brindare",
    "broccolo",
    "brodo",
    "bronzina",
    "brullo",
    "bruno",
    "bubbone",
    "buca",
    "budino",
    "buffone",
    "buio",
    "bulbo",
    "buono",
    "burlone",
    "burrasca",
    "bussola",
    "busta",
    "cadetto",
    "caduco",
    "calamaro",
    "calcolo",
    "calesse",
    "calibro",
    "calmo",
    "caloria",
    "cambusa",
    "camerata",
    "camicia",
    "cammino",
    "camola",
    "campale",
    "canapa",
    "candela",
    "cane",
    "canino",
    "canotto",
    "cantina",
    "capace",
    "capello",
    "capitolo",
    "capogiro",
    "cappero",
    "capra",
    "capsula",
    "carapace",
    "carcassa",
    "cardo",
    "carisma",
    "carovana",
    "carretto",
    "cartolina",
    "casaccio",
    "cascata",
    "caserma",
    "caso",
    "cassone",
    "castello",
    "casuale",
    "catasta",
    "catena",
    "catrame",
    "cauto",
    "cavillo",
    "cedibile",
    "cedrata",
    "cefalo",
    "celebre",
    "cellulare",
    "cena",
    "cenone",
    "centesimo",
    "ceramica",
    "cercare",
    "certo",
    "cerume",
    "cervello",
    "cesoia",
    "cespo",
    "ceto",
    "chela",
    "chiaro",
    "chicca",
    "chiedere",
    "chimera",
    "china",
    "chirurgo",
    "chitarra",
    "ciao",
    "ciclismo",
    "cifrare",
    "cigno",
    "cilindro",
    "ciottolo",
    "circa",
    "cirrosi",
    "citrico",
    "cittadino",
    "ciuffo",
    "civetta",
    "civile",
    "classico",
    "clinica",
    "cloro",
    "cocco",
    "codardo",
    "codice",
    "coerente",
    "cognome",
    "collare",
    "colmato",
    "colore",
    "colposo",
    "coltivato",
    "colza",
    "coma",
    "cometa",
    "commando",
    "comodo",
    "computer",
    "comune",
    "conciso",
    "condurre",
    "conferma",
    "congelare",
    "coniuge",
    "connesso",
    "conoscere",
    "consumo",
    "continuo",
    "convegno",
    "coperto",
    "copione",
    "coppia",
    "copricapo",
    "corazza",
    "cordata",
    "coricato",
    "cornice",
    "corolla",
    "corpo",
    "corredo",
    "corsia",
    "cortese",
    "cosmico",
    "costante",
    "cottura",
    "covato",
    "cratere",
    "cravatta",
    "creato",
    "credere",
    "cremoso",
    "crescita",
    "creta",
    "criceto",
    "crinale",
    "crisi",
    "critico",
    "croce",
    "cronaca",
    "crostata",
    "cruciale",
    "crusca",
    "cucire",
    "cuculo",
    "cugino",
    "cullato",
    "cupola",
    "curatore",
    "cursore",
    "curvo",
    "cuscino",
    "custode",
    "dado",
    "daino",
    "dalmata",
    "damerino",
    "daniela",
    "dannoso",
    "danzare",
    "datato",
    "davanti",
    "davvero",
    "debutto",
    "decennio",
    "deciso",
    "declino",
    "decollo",
    "decreto",
    "dedicato",
    "definito",
    "deforme",
    "degno",
    "delegare",
    "delfino",
    "delirio",
    "delta",
    "demenza",
    "denotato",
    "dentro",
    "deposito",
    "derapata",
    "derivare",
    "deroga",
    "descritto",
    "deserto",
    "desiderio",
    "desumere",
    "detersivo",
    "devoto",
    "diametro",
    "dicembre",
    "diedro",
    "difeso",
    "diffuso",
    "digerire",
    "digitale",
    "diluvio",
    "dinamico",
    "dinnanzi",
    "dipinto",
    "diploma",
    "dipolo",
    "diradare",
    "dire",
    "dirotto",
    "dirupo",
    "disagio",
    "discreto",
    "disfare",
    "disgelo",
    "disposto",
    "distanza",
    "disumano",
    "dito",
    "divano",
    "divelto",
    "dividere",
    "divorato",
    "doblone",
    "docente",
    "doganale",
    "dogma",
    "dolce",
    "domato",
    "domenica",
    "dominare",
    "dondolo",
    "dono",
    "dormire",
    "dote",
    "dottore",
    "dovuto",
    "dozzina",
    "drago",
    "druido",
    "dubbio",
    "dubitare",
    "ducale",
    "duna",
    "duomo",
    "duplice",
    "duraturo",
    "ebano",
    "eccesso",
    "ecco",
    "eclissi",
    "economia",
    "edera",
    "edicola",
    "edile",
    "editoria",
    "educare",
    "egemonia",
    "egli",
    "egoismo",
    "egregio",
    "elaborato",
    "elargire",
    "elegante",
    "elencato",
    "eletto",
    "elevare",
    "elfico",
    "elica",
    "elmo",
    "elsa",
    "eluso",
    "emanato",
    "emblema",
    "emesso",
    "emiro",
    "emotivo",
    "emozione",
    "empirico",
    "emulo",
    "endemico",
    "enduro",
    "energia",
    "enfasi",
    "enoteca",
    "entrare",
    "enzima",
    "epatite",
    "epilogo",
    "episodio",
    "epocale",
    "eppure",
    "equatore",
    "erario",
    "erba",
    "erboso",
    "erede",
    "eremita",
    "erigere",
    "ermetico",
    "eroe",
    "erosivo",
    "errante",
    "esagono",
    "esame",
    "esanime",
    "esaudire",
    "esca",
    "esempio",
    "esercito",
    "esibito",
    "esigente",
    "esistere",
    "esito",
    "esofago",
    "esortato",
    "esoso",
    "espanso",
    "espresso",
    "essenza",
    "esso",
    "esteso",
    "estimare",
    "estonia",
    "estroso",
    "esultare",
    "etilico",
    "etnico",
    "etrusco",
    "etto",
    "euclideo",
    "europa",
    "evaso",
    "evidenza",
    "evitato",
    "evoluto",
    "evviva",
    "fabbrica",
    "faccenda",
    "fachiro",
    "falco",
    "famiglia",
    "fanale",
    "fanfara",
    "fango",
    "fantasma",
    "fare",
    "farfalla",
    "farinoso",
    "farmaco",
    "fascia",
    "fastoso",
    "fasullo",
    "faticare",
    "fato",
    "favoloso",
    "febbre",
    "fecola",
    "fede",
    "fegato",
    "felpa",
    "feltro",
    "femmina",
    "fendere",
    "fenomeno",
    "fermento",
    "ferro",
    "fertile",
    "fessura",
    "festivo",
    "fetta",
    "feudo",
    "fiaba",
    "fiducia",
    "fifa",
    "figurato",
    "filo",
    "finanza",
    "finestra",
    "finire",
    "fiore",
    "fiscale",
    "fisico",
    "fiume",
    "flacone",
    "flamenco",
    "flebo",
    "flemma",
    "florido",
    "fluente",
    "fluoro",
    "fobico",
    "focaccia",
    "focoso",
    "foderato",
    "foglio",
    "folata",
    "folclore",
    "folgore",
    "fondente",
    "fonetico",
    "fonia",
    "fontana",
    "forbito",
    "forchetta",
    "foresta",
    "formica",
    "fornaio",
    "foro",
    "fortezza",
    "forzare",
    "fosfato",
    "fosso",
    "fracasso",
    "frana",
    "frassino",
    "fratello",
    "freccetta",
    "frenata",
    "fresco",
    "frigo",
    "frollino",
    "fronde",
    "frugale",
    "frutta",
    "fucilata",
    "fucsia",
    "fuggente",
    "fulmine",
    "fulvo",
    "fumante",
    "fumetto",
    "fumoso",
    "fune",
    "funzione",
    "fuoco",
    "furbo",
    "furgone",
    "furore",
    "fuso",
    "futile",
    "gabbiano",
    "gaffe",
    "galateo",
    "gallina",
    "galoppo",
    "gambero",
    "gamma",
    "garanzia",
    "garbo",
    "garofano",
    "garzone",
    "gasdotto",
    "gasolio",
    "gastrico",
    "gatto",
    "gaudio",
    "gazebo",
    "gazzella",
    "geco",
    "gelatina",
    "gelso",
    "gemello",
    "gemmato",
    "gene",
    "genitore",
    "gennaio",
    "genotipo",
    "gergo",
    "ghepardo",
    "ghiaccio",
    "ghisa",
    "giallo",
    "gilda",
    "ginepro",
    "giocare",
    "gioiello",
    "giorno",
    "giove",
    "girato",
    "girone",
    "gittata",
    "giudizio",
    "giurato",
    "giusto",
    "globulo",
    "glutine",
    "gnomo",
    "gobba",
    "golf",
    "gomito",
    "gommone",
    "gonfio",
    "gonna",
    "governo",
    "gracile",
    "grado",
    "grafico",
    "grammo",
    "grande",
    "grattare",
    "gravoso",
    "grazia",
    "greca",
    "gregge",
    "grifone",
    "grigio",
    "grinza",
    "grotta",
    "gruppo",
    "guadagno",
    "guaio",
    "guanto",
    "guardare",
    "gufo",
    "guidare",
    "ibernato",
    "icona",
    "identico",
    "idillio",
    "idolo",
    "idra",
    "idrico",
    "idrogeno",
    "igiene",
    "ignaro",
    "ignorato",
    "ilare",
    "illeso",
    "illogico",
    "illudere",
    "imballo",
    "imbevuto",
    "imbocco",
    "imbuto",
    "immane",
    "immerso",
    "immolato",
    "impacco",
    "impeto",
    "impiego",
    "importo",
    "impronta",
    "inalare",
    "inarcare",
    "inattivo",
    "incanto",
    "incendio",
    "inchino",
    "incisivo",
    "incluso",
    "incontro",
    "incrocio",
    "incubo",
    "indagine",
    "india",
    "indole",
    "inedito",
    "infatti",
    "infilare",
    "inflitto",
    "ingaggio",
    "ingegno",
    "inglese",
    "ingordo",
    "ingrosso",
    "innesco",
    "inodore",
    "inoltrare",
    "inondato",
    "insano",
    "insetto",
    "insieme",
    "insonnia",
    "insulina",
    "intasato",
    "intero",
    "intonaco",
    "intuito",
    "inumidire",
    "invalido",
    "invece",
    "invito",
    "iperbole",
    "ipnotico",
    "ipotesi",
    "ippica",
    "iride",
    "irlanda",
    "ironico",
    "irrigato",
    "irrorare",
    "isolato",
    "isotopo",
    "isterico",
    "istituto",
    "istrice",
    "italia",
    "iterare",
    "labbro",
    "labirinto",
    "lacca",
    "lacerato",
    "lacrima",
    "lacuna",
    "laddove",
    "lago",
    "lampo",
    "lancetta",
    "lanterna",
    "lardoso",
    "larga",
    "laringe",
    "lastra",
    "latenza",
    "latino",
    "lattuga",
    "lavagna",
    "lavoro",
    "legale",
    "leggero",
    "lembo",
    "lentezza",
    "lenza",
    "leone",
    "lepre",
    "lesivo",
    "lessato",
    "lesto",
    "letterale",
    "leva",
    "levigato",
    "libero",
    "lido",
    "lievito",
    "lilla",
    "limatura",
    "limitare",
    "limpido",
    "lineare",
    "lingua",
    "liquido",
    "lira",
    "lirica",
    "lisca",
    "lite",
    "litigio",
    "livrea",
    "locanda",
    "lode",
    "logica",
    "lombare",
    "londra",
    "longevo",
    "loquace",
    "lorenzo",
    "loto",
    "lotteria",
    "luce",
    "lucidato",
    "lumaca",
    "luminoso",
    "lungo",
    "lupo",
    "luppolo",
    "lusinga",
    "lusso",
    "lutto",
    "macabro",
    "macchina",
    "macero",
    "macinato",
    "madama",
    "magico",
    "maglia",
    "magnete",
    "magro",
    "maiolica",
    "malafede",
    "malgrado",
    "malinteso",
    "malsano",
    "malto",
    "malumore",
    "mana",
    "mancia",
    "mandorla",
    "mangiare",
    "manifesto",
    "mannaro",
    "manovra",
    "mansarda",
    "mantide",
    "manubrio",
    "mappa",
    "maratona",
    "marcire",
    "maretta",
    "marmo",
    "marsupio",
    "maschera",
    "massaia",
    "mastino",
    "materasso",
    "matricola",
    "mattone",
    "maturo",
    "mazurca",
    "meandro",
    "meccanico",
    "mecenate",
    "medesimo",
    "meditare",
    "mega",
    "melassa",
    "melis",
    "melodia",
    "meninge",
    "meno",
    "mensola",
    "mercurio",
    "merenda",
    "merlo",
    "meschino",
    "mese",
    "messere",
    "mestolo",
    "metallo",
    "metodo",
    "mettere",
    "miagolare",
    "mica",
    "micelio",
    "michele",
    "microbo",
    "midollo",
    "miele",
    "migliore",
    "milano",
    "milite",
    "mimosa",
    "minerale",
    "mini",
    "minore",
    "mirino",
    "mirtillo",
    "miscela",
    "missiva",
    "misto",
    "misurare",
    "mitezza",
    "mitigare",
    "mitra",
    "mittente",
    "mnemonico",
    "modello",
    "modifica",
    "modulo",
    "mogano",
    "mogio",
    "mole",
    "molosso",
    "monastero",
    "monco",
    "mondina",
    "monetario",
    "monile",
    "monotono",
    "monsone",
    "montato",
    "monviso",
    "mora",
    "mordere",
    "morsicato",
    "mostro",
    "motivato",
    "motosega",
    "motto",
    "movenza",
    "movimento",
    "mozzo",
    "mucca",
    "mucosa",
    "muffa",
    "mughetto",
    "mugnaio",
    "mulatto",
    "mulinello",
    "multiplo",
    "mummia",
    "munto",
    "muovere",
    "murale",
    "musa",
    "muscolo",
    "musica",
    "mutevole",
    "muto",
    "nababbo",
    "nafta",
    "nanometro",
    "narciso",
    "narice",
    "narrato",
    "nascere",
    "nastrare",
    "naturale",
    "nautica",
    "naviglio",
    "nebulosa",
    "necrosi",
    "negativo",
    "negozio",
    "nemmeno",
    "neofita",
    "neretto",
    "nervo",
    "nessuno",
    "nettuno",
    "neutrale",
    "neve",
    "nevrotico",
    "nicchia",
    "ninfa",
    "nitido",
    "nobile",
    "nocivo",
    "nodo",
    "nome",
    "nomina",
    "nordico",
    "normale",
    "norvegese",
    "nostrano",
    "notare",
    "notizia",
    "notturno",
    "novella",
    "nucleo",
    "nulla",
    "numero",
    "nuovo",
    "nutrire",
    "nuvola",
    "nuziale",
    "oasi",
    "obbedire",
    "obbligo",
    "obelisco",
    "oblio",
    "obolo",
    "obsoleto",
    "occasione",
    "occhio",
    "occidente",
    "occorrere",
    "occultare",
    "ocra",
    "oculato",
    "odierno",
    "odorare",
    "offerta",
    "offrire",
    "offuscato",
    "oggetto",
    "oggi",
    "ognuno",
    "olandese",
    "olfatto",
    "oliato",
    "oliva",
    "ologramma",
    "oltre",
    "omaggio",
    "ombelico",
    "ombra",
    "omega",
    "omissione",
    "ondoso",
    "onere",
    "onice",
    "onnivoro",
    "onorevole",
    "onta",
    "operato",
    "opinione",
    "opposto",
    "oracolo",
    "orafo",
    "ordine",
    "orecchino",
    "orefice",
    "orfano",
    "organico",
    "origine",
    "orizzonte",
    "orma",
    "ormeggio",
    "ornativo",
    "orologio",
    "orrendo",
    "orribile",
    "ortensia",
    "ortica",
    "orzata",
    "orzo",
    "osare",
    "oscurare",
    "osmosi",
    "ospedale",
    "ospite",
    "ossa",
    "ossidare",
    "ostacolo",
    "oste",
    "otite",
    "otre",
    "ottagono",
    "ottimo",
    "ottobre",
    "ovale",
    "ovest",
    "ovino",
    "oviparo",
    "ovocito",
    "ovunque",
    "ovviare",
    "ozio",
    "pacchetto",
    "pace",
    "pacifico",
    "padella",
    "padrone",
    "paese",
    "paga",
    "pagina",
    "palazzina",
    "palesare",
    "pallido",
    "palo",
    "palude",
    "pandoro",
    "pannello",
    "paolo",
    "paonazzo",
    "paprica",
    "parabola",
    "parcella",
    "parere",
    "pargolo",
    "pari",
    "parlato",
    "parola",
    "partire",
    "parvenza",
    "parziale",
    "passivo",
    "pasticca",
    "patacca",
    "patologia",
    "pattume",
    "pavone",
    "peccato",
    "pedalare",
    "pedonale",
    "peggio",
    "peloso",
    "penare",
    "pendice",
    "penisola",
    "pennuto",
    "penombra",
    "pensare",
    "pentola",
    "pepe",
    "pepita",
    "perbene",
    "percorso",
    "perdonato",
    "perforare",
    "pergamena",
    "periodo",
    "permesso",
    "perno",
    "perplesso",
    "persuaso",
    "pertugio",
    "pervaso",
    "pesatore",
    "pesista",
    "peso",
    "pestifero",
    "petalo",
    "pettine",
    "petulante",
    "pezzo",
    "piacere",
    "pianta",
    "piattino",
    "piccino",
    "picozza",
    "piega",
    "pietra",
    "piffero",
    "pigiama",
    "pigolio",
    "pigro",
    "pila",
    "pilifero",
    "pillola",
    "pilota",
    "pimpante",
    "pineta",
    "pinna",
    "pinolo",
    "pioggia",
    "piombo",
    "piramide",
    "piretico",
    "pirite",
    "pirolisi",
    "pitone",
    "pizzico",
    "placebo",
    "planare",
    "plasma",
    "platano",
    "plenario",
    "pochezza",
    "poderoso",
    "podismo",
    "poesia",
    "poggiare",
    "polenta",
    "poligono",
    "pollice",
    "polmonite",
    "polpetta",
    "polso",
    "poltrona",
    "polvere",
    "pomice",
    "pomodoro",
    "ponte",
    "popoloso",
    "porfido",
    "poroso",
    "porpora",
    "porre",
    "portata",
    "posa",
    "positivo",
    "possesso",
    "postulato",
    "potassio",
    "potere",
    "pranzo",
    "prassi",
    "pratica",
    "precluso",
    "predica",
    "prefisso",
    "pregiato",
    "prelievo",
    "premere",
    "prenotare",
    "preparato",
    "presenza",
    "pretesto",
    "prevalso",
    "prima",
    "principe",
    "privato",
    "problema",
    "procura",
    "produrre",
    "profumo",
    "progetto",
    "prolunga",
    "promessa",
    "pronome",
    "proposta",
    "proroga",
    "proteso",
    "prova",
    "prudente",
    "prugna",
    "prurito",
    "psiche",
    "pubblico",
    "pudica",
    "pugilato",
    "pugno",
    "pulce",
    "pulito",
    "pulsante",
    "puntare",
    "pupazzo",
    "pupilla",
    "puro",
    "quadro",
    "qualcosa",
    "quasi",
    "querela",
    "quota",
    "raccolto",
    "raddoppio",
    "radicale",
    "radunato",
    "raffica",
    "ragazzo",
    "ragione",
    "ragno",
    "ramarro",
    "ramingo",
    "ramo",
    "randagio",
    "rantolare",
    "rapato",
    "rapina",
    "rappreso",
    "rasatura",
    "raschiato",
    "rasente",
    "rassegna",
    "rastrello",
    "rata",
    "ravveduto",
    "reale",
    "recepire",
    "recinto",
    "recluta",
    "recondito",
    "recupero",
    "reddito",
    "redimere",
    "regalato",
    "registro",
    "regola",
    "regresso",
    "relazione",
    "remare",
    "remoto",
    "renna",
    "replica",
    "reprimere",
    "reputare",
    "resa",
    "residente",
    "responso",
    "restauro",
    "rete",
    "retina",
    "retorica",
    "rettifica",
    "revocato",
    "riassunto",
    "ribadire",
    "ribelle",
    "ribrezzo",
    "ricarica",
    "ricco",
    "ricevere",
    "riciclato",
    "ricordo",
    "ricreduto",
    "ridicolo",
    "ridurre",
    "rifasare",
    "riflesso",
    "riforma",
    "rifugio",
    "rigare",
    "rigettato",
    "righello",
    "rilassato",
    "rilevato",
    "rimanere",
    "rimbalzo",
    "rimedio",
    "rimorchio",
    "rinascita",
    "rincaro",
    "rinforzo",
    "rinnovo",
    "rinomato",
    "rinsavito",
    "rintocco",
    "rinuncia",
    "rinvenire",
    "riparato",
    "ripetuto",
    "ripieno",
    "riportare",
    "ripresa",
    "ripulire",
    "risata",
    "rischio",
    "riserva",
    "risibile",
    "riso",
    "rispetto",
    "ristoro",
    "risultato",
    "risvolto",
    "ritardo",
    "ritegno",
    "ritmico",
    "ritrovo",
    "riunione",
    "riva",
    "riverso",
    "rivincita",
    "rivolto",
    "rizoma",
    "roba",
    "robotico",
    "robusto",
    "roccia",
    "roco",
    "rodaggio",
    "rodere",
    "roditore",
    "rogito",
    "rollio",
    "romantico",
    "rompere",
    "ronzio",
    "rosolare",
    "rospo",
    "rotante",
    "rotondo",
    "rotula",
    "rovescio",
    "rubizzo",
    "rubrica",
    "ruga",
    "rullino",
    "rumine",
    "rumoroso",
    "ruolo",
    "rupe",
    "russare",
    "rustico",
    "sabato",
    "sabbiare",
    "sabotato",
    "sagoma",
    "salasso",
    "saldatura",
    "salgemma",
    "salivare",
    "salmone",
    "salone",
    "saltare",
    "saluto",
    "salvo",
    "sapere",
    "sapido",
    "saporito",
    "saraceno",
    "sarcasmo",
    "sarto",
    "sassoso",
    "satellite",
    "satira",
    "satollo",
    "saturno",
    "savana",
    "savio",
    "saziato",
    "sbadiglio",
    "sbalzo",
    "sbancato",
    "sbarra",
    "sbattere",
    "sbavare",
    "sbendare",
    "sbirciare",
    "sbloccato",
    "sbocciato",
    "sbrinare",
    "sbruffone",
    "sbuffare",
    "scabroso",
    "scadenza",
    "scala",
    "scambiare",
    "scandalo",
    "scapola",
    "scarso",
    "scatenare",
    "scavato",
    "scelto",
    "scenico",
    "scettro",
    "scheda",
    "schiena",
    "sciarpa",
    "scienza",
    "scindere",
    "scippo",
    "sciroppo",
    "scivolo",
    "sclerare",
    "scodella",
    "scolpito",
    "scomparto",
    "sconforto",
    "scoprire",
    "scorta",
    "scossone",
    "scozzese",
    "scriba",
    "scrollare",
    "scrutinio",
    "scuderia",
    "scultore",
    "scuola",
    "scuro",
    "scusare",
    "sdebitare",
    "sdoganare",
    "seccatura",
    "secondo",
    "sedano",
    "seggiola",
    "segnalato",
    "segregato",
    "seguito",
    "selciato",
    "selettivo",
    "sella",
    "selvaggio",
    "semaforo",
    "sembrare",
    "seme",
    "seminato",
    "sempre",
    "senso",
    "sentire",
    "sepolto",
    "sequenza",
    "serata",
    "serbato",
    "sereno",
    "serio",
    "serpente",
    "serraglio",
    "servire",
    "sestina",
    "setola",
    "settimana",
    "sfacelo",
    "sfaldare",
    "sfamato",
    "sfarzoso",
    "sfaticato",
    "sfera",
    "sfida",
    "sfilato",
    "sfinge",
    "sfocato",
    "sfoderare",
    "sfogo",
    "sfoltire",
    "sforzato",
    "sfratto",
    "sfruttato",
    "sfuggito",
    "sfumare",
    "sfuso",
    "sgabello",
    "sgarbato",
    "sgonfiare",
    "sgorbio",
    "sgrassato",
    "sguardo",
    "sibilo",
    "siccome",
    "sierra",
    "sigla",
    "signore",
    "silenzio",
    "sillaba",
    "simbolo",
    "simpatico",
    "simulato",
    "sinfonia",
    "singolo",
    "sinistro",
    "sino",
    "sintesi",
    "sinusoide",
    "sipario",
    "sisma",
    "sistole",
    "situato",
    "slitta",
    "slogatura",
    "sloveno",
    "smarrito",
    "smemorato",
    "smentito",
    "smeraldo",
    "smilzo",
    "smontare",
    "smottato",
    "smussato",
    "snellire",
    "snervato",
    "snodo",
    "sobbalzo",
    "sobrio",
    "soccorso",
    "sociale",
    "sodale",
    "soffitto",
    "sogno",
    "soldato",
    "solenne",
    "solido",
    "sollazzo",
    "solo",
    "solubile",
    "solvente",
    "somatico",
    "somma",
    "sonda",
    "sonetto",
    "sonnifero",
    "sopire",
    "soppeso",
    "sopra",
    "sorgere",
    "sorpasso",
    "sorriso",
    "sorso",
    "sorteggio",
    "sorvolato",
    "sospiro",
    "sosta",
    "sottile",
    "spada",
    "spalla",
    "spargere",
    "spatola",
    "spavento",
    "spazzola",
    "specie",
    "spedire",
    "spegnere",
    "spelatura",
    "speranza",
    "spessore",
    "spettrale",
    "spezzato",
    "spia",
    "spigoloso",
    "spillato",
    "spinoso",
    "spirale",
    "splendido",
    "sportivo",
    "sposo",
    "spranga",
    "sprecare",
    "spronato",
    "spruzzo",
    "spuntino",
    "squillo",
    "sradicare",
    "srotolato",
    "stabile",
    "stacco",
    "staffa",
    "stagnare",
    "stampato",
    "stantio",
    "starnuto",
    "stasera",
    "statuto",
    "stelo",
    "steppa",
    "sterzo",
    "stiletto",
    "stima",
    "stirpe",
    "stivale",
    "stizzoso",
    "stonato",
    "storico",
    "strappo",
    "stregato",
    "stridulo",
    "strozzare",
    "strutto",
    "stuccare",
    "stufo",
    "stupendo",
    "subentro",
    "succoso",
    "sudore",
    "suggerito",
    "sugo",
    "sultano",
    "suonare",
    "superbo",
    "supporto",
    "surgelato",
    "surrogato",
    "sussurro",
    "sutura",
    "svagare",
    "svedese",
    "sveglio",
    "svelare",
    "svenuto",
    "svezia",
    "sviluppo",
    "svista",
    "svizzera",
    "svolta",
    "svuotare",
    "tabacco",
    "tabulato",
    "tacciare",
    "taciturno",
    "tale",
    "talismano",
    "tampone",
    "tannino",
    "tara",
    "tardivo",
    "targato",
    "tariffa",
    "tarpare",
    "tartaruga",
    "tasto",
    "tattico",
    "taverna",
    "tavolata",
    "tazza",
    "teca",
    "tecnico",
    "telefono",
    "temerario",
    "tempo",
    "temuto",
    "tendone",
    "tenero",
    "tensione",
    "tentacolo",
    "teorema",
    "terme",
    "terrazzo",
    "terzetto",
    "tesi",
    "tesserato",
    "testato",
    "tetro",
    "tettoia",
    "tifare",
    "tigella",
    "timbro",
    "tinto",
    "tipico",
    "tipografo",
    "tiraggio",
    "tiro",
    "titanio",
    "titolo",
    "titubante",
    "tizio",
    "tizzone",
    "toccare",
    "tollerare",
    "tolto",
    "tombola",
    "tomo",
    "tonfo",
    "tonsilla",
    "topazio",
    "topologia",
    "toppa",
    "torba",
    "tornare",
    "torrone",
    "tortora",
    "toscano",
    "tossire",
    "tostatura",
    "totano",
    "trabocco",
    "trachea",
    "trafila",
    "tragedia",
    "tralcio",
    "tramonto",
    "transito",
    "trapano",
    "trarre",
    "trasloco",
    "trattato",
    "trave",
    "treccia",
    "tremolio",
    "trespolo",
    "tributo",
    "tricheco",
    "trifoglio",
    "trillo",
    "trincea",
    "trio",
    "tristezza",
    "triturato",
    "trivella",
    "tromba",
    "trono",
    "troppo",
    "trottola",
    "trovare",
    "truccato",
    "tubatura",
    "tuffato",
    "tulipano",
    "tumulto",
    "tunisia",
    "turbare",
    "turchino",
    "tuta",
    "tutela",
    "ubicato",
    "uccello",
    "uccisore",
    "udire",
    "uditivo",
    "uffa",
    "ufficio",
    "uguale",
    "ulisse",
    "ultimato",
    "umano",
    "umile",
    "umorismo",
    "uncinetto",
    "ungere",
    "ungherese",
    "unicorno",
    "unificato",
    "unisono",
    "unitario",
    "unte",
    "uovo",
    "upupa",
    "uragano",
    "urgenza",
    "urlo",
    "usanza",
    "usato",
    "uscito",
    "usignolo",
    "usuraio",
    "utensile",
    "utilizzo",
    "utopia",
    "vacante",
    "vaccinato",
    "vagabondo",
    "vagliato",
    "valanga",
    "valgo",
    "valico",
    "valletta",
    "valoroso",
    "valutare",
    "valvola",
    "vampata",
    "vangare",
    "vanitoso",
    "vano",
    "vantaggio",
    "vanvera",
    "vapore",
    "varano",
    "varcato",
    "variante",
    "vasca",
    "vedetta",
    "vedova",
    "veduto",
    "vegetale",
    "veicolo",
    "velcro",
    "velina",
    "velluto",
    "veloce",
    "venato",
    "vendemmia",
    "vento",
    "verace",
    "verbale",
    "vergogna",
    "verifica",
    "vero",
    "verruca",
    "verticale",
    "vescica",
    "vessillo",
    "vestale",
    "veterano",
    "vetrina",
    "vetusto",
    "viandante",
    "vibrante",
    "vicenda",
    "vichingo",
    "vicinanza",
    "vidimare",
    "vigilia",
    "vigneto",
    "vigore",
    "vile",
    "villano",
    "vimini",
    "vincitore",
    "viola",
    "vipera",
    "virgola",
    "virologo",
    "virulento",
    "viscoso",
    "visione",
    "vispo",
    "vissuto",
    "visura",
    "vita",
    "vitello",
    "vittima",
    "vivanda",
    "vivido",
    "viziare",
    "voce",
    "voga",
    "volatile",
    "volere",
    "volpe",
    "voragine",
    "vulcano",
    "zampogna",
    "zanna",
    "zappato",
    "zattera",
    "zavorra",
    "zefiro",
    "zelante",
    "zelo",
    "zenzero",
    "zerbino",
    "zibetto",
    "zinco",
    "zircone",
    "zitto",
    "zolla",
    "zotico",
    "zucchero",
    "zufolo",
    "zulu",
    "zuppa"
]

},{}],29:[function(require,module,exports){
module.exports=[
    "あいこくしん",
    "あいさつ",
    "あいだ",
    "あおぞら",
    "あかちゃん",
    "あきる",
    "あけがた",
    "あける",
    "あこがれる",
    "あさい",
    "あさひ",
    "あしあと",
    "あじわう",
    "あずかる",
    "あずき",
    "あそぶ",
    "あたえる",
    "あたためる",
    "あたりまえ",
    "あたる",
    "あつい",
    "あつかう",
    "あっしゅく",
    "あつまり",
    "あつめる",
    "あてな",
    "あてはまる",
    "あひる",
    "あぶら",
    "あぶる",
    "あふれる",
    "あまい",
    "あまど",
    "あまやかす",
    "あまり",
    "あみもの",
    "あめりか",
    "あやまる",
    "あゆむ",
    "あらいぐま",
    "あらし",
    "あらすじ",
    "あらためる",
    "あらゆる",
    "あらわす",
    "ありがとう",
    "あわせる",
    "あわてる",
    "あんい",
    "あんがい",
    "あんこ",
    "あんぜん",
    "あんてい",
    "あんない",
    "あんまり",
    "いいだす",
    "いおん",
    "いがい",
    "いがく",
    "いきおい",
    "いきなり",
    "いきもの",
    "いきる",
    "いくじ",
    "いくぶん",
    "いけばな",
    "いけん",
    "いこう",
    "いこく",
    "いこつ",
    "いさましい",
    "いさん",
    "いしき",
    "いじゅう",
    "いじょう",
    "いじわる",
    "いずみ",
    "いずれ",
    "いせい",
    "いせえび",
    "いせかい",
    "いせき",
    "いぜん",
    "いそうろう",
    "いそがしい",
    "いだい",
    "いだく",
    "いたずら",
    "いたみ",
    "いたりあ",
    "いちおう",
    "いちじ",
    "いちど",
    "いちば",
    "いちぶ",
    "いちりゅう",
    "いつか",
    "いっしゅん",
    "いっせい",
    "いっそう",
    "いったん",
    "いっち",
    "いってい",
    "いっぽう",
    "いてざ",
    "いてん",
    "いどう",
    "いとこ",
    "いない",
    "いなか",
    "いねむり",
    "いのち",
    "いのる",
    "いはつ",
    "いばる",
    "いはん",
    "いびき",
    "いひん",
    "いふく",
    "いへん",
    "いほう",
    "いみん",
    "いもうと",
    "いもたれ",
    "いもり",
    "いやがる",
    "いやす",
    "いよかん",
    "いよく",
    "いらい",
    "いらすと",
    "いりぐち",
    "いりょう",
    "いれい",
    "いれもの",
    "いれる",
    "いろえんぴつ",
    "いわい",
    "いわう",
    "いわかん",
    "いわば",
    "いわゆる",
    "いんげんまめ",
    "いんさつ",
    "いんしょう",
    "いんよう",
    "うえき",
    "うえる",
    "うおざ",
    "うがい",
    "うかぶ",
    "うかべる",
    "うきわ",
    "うくらいな",
    "うくれれ",
    "うけたまわる",
    "うけつけ",
    "うけとる",
    "うけもつ",
    "うける",
    "うごかす",
    "うごく",
    "うこん",
    "うさぎ",
    "うしなう",
    "うしろがみ",
    "うすい",
    "うすぎ",
    "うすぐらい",
    "うすめる",
    "うせつ",
    "うちあわせ",
    "うちがわ",
    "うちき",
    "うちゅう",
    "うっかり",
    "うつくしい",
    "うったえる",
    "うつる",
    "うどん",
    "うなぎ",
    "うなじ",
    "うなずく",
    "うなる",
    "うねる",
    "うのう",
    "うぶげ",
    "うぶごえ",
    "うまれる",
    "うめる",
    "うもう",
    "うやまう",
    "うよく",
    "うらがえす",
    "うらぐち",
    "うらない",
    "うりあげ",
    "うりきれ",
    "うるさい",
    "うれしい",
    "うれゆき",
    "うれる",
    "うろこ",
    "うわき",
    "うわさ",
    "うんこう",
    "うんちん",
    "うんてん",
    "うんどう",
    "えいえん",
    "えいが",
    "えいきょう",
    "えいご",
    "えいせい",
    "えいぶん",
    "えいよう",
    "えいわ",
    "えおり",
    "えがお",
    "えがく",
    "えきたい",
    "えくせる",
    "えしゃく",
    "えすて",
    "えつらん",
    "えのぐ",
    "えほうまき",
    "えほん",
    "えまき",
    "えもじ",
    "えもの",
    "えらい",
    "えらぶ",
    "えりあ",
    "えんえん",
    "えんかい",
    "えんぎ",
    "えんげき",
    "えんしゅう",
    "えんぜつ",
    "えんそく",
    "えんちょう",
    "えんとつ",
    "おいかける",
    "おいこす",
    "おいしい",
    "おいつく",
    "おうえん",
    "おうさま",
    "おうじ",
    "おうせつ",
    "おうたい",
    "おうふく",
    "おうべい",
    "おうよう",
    "おえる",
    "おおい",
    "おおう",
    "おおどおり",
    "おおや",
    "おおよそ",
    "おかえり",
    "おかず",
    "おがむ",
    "おかわり",
    "おぎなう",
    "おきる",
    "おくさま",
    "おくじょう",
    "おくりがな",
    "おくる",
    "おくれる",
    "おこす",
    "おこなう",
    "おこる",
    "おさえる",
    "おさない",
    "おさめる",
    "おしいれ",
    "おしえる",
    "おじぎ",
    "おじさん",
    "おしゃれ",
    "おそらく",
    "おそわる",
    "おたがい",
    "おたく",
    "おだやか",
    "おちつく",
    "おっと",
    "おつり",
    "おでかけ",
    "おとしもの",
    "おとなしい",
    "おどり",
    "おどろかす",
    "おばさん",
    "おまいり",
    "おめでとう",
    "おもいで",
    "おもう",
    "おもたい",
    "おもちゃ",
    "おやつ",
    "おやゆび",
    "およぼす",
    "おらんだ",
    "おろす",
    "おんがく",
    "おんけい",
    "おんしゃ",
    "おんせん",
    "おんだん",
    "おんちゅう",
    "おんどけい",
    "かあつ",
    "かいが",
    "がいき",
    "がいけん",
    "がいこう",
    "かいさつ",
    "かいしゃ",
    "かいすいよく",
    "かいぜん",
    "かいぞうど",
    "かいつう",
    "かいてん",
    "かいとう",
    "かいふく",
    "がいへき",
    "かいほう",
    "かいよう",
    "がいらい",
    "かいわ",
    "かえる",
    "かおり",
    "かかえる",
    "かがく",
    "かがし",
    "かがみ",
    "かくご",
    "かくとく",
    "かざる",
    "がぞう",
    "かたい",
    "かたち",
    "がちょう",
    "がっきゅう",
    "がっこう",
    "がっさん",
    "がっしょう",
    "かなざわし",
    "かのう",
    "がはく",
    "かぶか",
    "かほう",
    "かほご",
    "かまう",
    "かまぼこ",
    "かめれおん",
    "かゆい",
    "かようび",
    "からい",
    "かるい",
    "かろう",
    "かわく",
    "かわら",
    "がんか",
    "かんけい",
    "かんこう",
    "かんしゃ",
    "かんそう",
    "かんたん",
    "かんち",
    "がんばる",
    "きあい",
    "きあつ",
    "きいろ",
    "ぎいん",
    "きうい",
    "きうん",
    "きえる",
    "きおう",
    "きおく",
    "きおち",
    "きおん",
    "きかい",
    "きかく",
    "きかんしゃ",
    "ききて",
    "きくばり",
    "きくらげ",
    "きけんせい",
    "きこう",
    "きこえる",
    "きこく",
    "きさい",
    "きさく",
    "きさま",
    "きさらぎ",
    "ぎじかがく",
    "ぎしき",
    "ぎじたいけん",
    "ぎじにってい",
    "ぎじゅつしゃ",
    "きすう",
    "きせい",
    "きせき",
    "きせつ",
    "きそう",
    "きぞく",
    "きぞん",
    "きたえる",
    "きちょう",
    "きつえん",
    "ぎっちり",
    "きつつき",
    "きつね",
    "きてい",
    "きどう",
    "きどく",
    "きない",
    "きなが",
    "きなこ",
    "きぬごし",
    "きねん",
    "きのう",
    "きのした",
    "きはく",
    "きびしい",
    "きひん",
    "きふく",
    "きぶん",
    "きぼう",
    "きほん",
    "きまる",
    "きみつ",
    "きむずかしい",
    "きめる",
    "きもだめし",
    "きもち",
    "きもの",
    "きゃく",
    "きやく",
    "ぎゅうにく",
    "きよう",
    "きょうりゅう",
    "きらい",
    "きらく",
    "きりん",
    "きれい",
    "きれつ",
    "きろく",
    "ぎろん",
    "きわめる",
    "ぎんいろ",
    "きんかくじ",
    "きんじょ",
    "きんようび",
    "ぐあい",
    "くいず",
    "くうかん",
    "くうき",
    "くうぐん",
    "くうこう",
    "ぐうせい",
    "くうそう",
    "ぐうたら",
    "くうふく",
    "くうぼ",
    "くかん",
    "くきょう",
    "くげん",
    "ぐこう",
    "くさい",
    "くさき",
    "くさばな",
    "くさる",
    "くしゃみ",
    "くしょう",
    "くすのき",
    "くすりゆび",
    "くせげ",
    "くせん",
    "ぐたいてき",
    "くださる",
    "くたびれる",
    "くちこみ",
    "くちさき",
    "くつした",
    "ぐっすり",
    "くつろぐ",
    "くとうてん",
    "くどく",
    "くなん",
    "くねくね",
    "くのう",
    "くふう",
    "くみあわせ",
    "くみたてる",
    "くめる",
    "くやくしょ",
    "くらす",
    "くらべる",
    "くるま",
    "くれる",
    "くろう",
    "くわしい",
    "ぐんかん",
    "ぐんしょく",
    "ぐんたい",
    "ぐんて",
    "けあな",
    "けいかく",
    "けいけん",
    "けいこ",
    "けいさつ",
    "げいじゅつ",
    "けいたい",
    "げいのうじん",
    "けいれき",
    "けいろ",
    "けおとす",
    "けおりもの",
    "げきか",
    "げきげん",
    "げきだん",
    "げきちん",
    "げきとつ",
    "げきは",
    "げきやく",
    "げこう",
    "げこくじょう",
    "げざい",
    "けさき",
    "げざん",
    "けしき",
    "けしごむ",
    "けしょう",
    "げすと",
    "けたば",
    "けちゃっぷ",
    "けちらす",
    "けつあつ",
    "けつい",
    "けつえき",
    "けっこん",
    "けつじょ",
    "けっせき",
    "けってい",
    "けつまつ",
    "げつようび",
    "げつれい",
    "けつろん",
    "げどく",
    "けとばす",
    "けとる",
    "けなげ",
    "けなす",
    "けなみ",
    "けぬき",
    "げねつ",
    "けねん",
    "けはい",
    "げひん",
    "けぶかい",
    "げぼく",
    "けまり",
    "けみかる",
    "けむし",
    "けむり",
    "けもの",
    "けらい",
    "けろけろ",
    "けわしい",
    "けんい",
    "けんえつ",
    "けんお",
    "けんか",
    "げんき",
    "けんげん",
    "けんこう",
    "けんさく",
    "けんしゅう",
    "けんすう",
    "げんそう",
    "けんちく",
    "けんてい",
    "けんとう",
    "けんない",
    "けんにん",
    "げんぶつ",
    "けんま",
    "けんみん",
    "けんめい",
    "けんらん",
    "けんり",
    "こあくま",
    "こいぬ",
    "こいびと",
    "ごうい",
    "こうえん",
    "こうおん",
    "こうかん",
    "ごうきゅう",
    "ごうけい",
    "こうこう",
    "こうさい",
    "こうじ",
    "こうすい",
    "ごうせい",
    "こうそく",
    "こうたい",
    "こうちゃ",
    "こうつう",
    "こうてい",
    "こうどう",
    "こうない",
    "こうはい",
    "ごうほう",
    "ごうまん",
    "こうもく",
    "こうりつ",
    "こえる",
    "こおり",
    "ごかい",
    "ごがつ",
    "ごかん",
    "こくご",
    "こくさい",
    "こくとう",
    "こくない",
    "こくはく",
    "こぐま",
    "こけい",
    "こける",
    "ここのか",
    "こころ",
    "こさめ",
    "こしつ",
    "こすう",
    "こせい",
    "こせき",
    "こぜん",
    "こそだて",
    "こたい",
    "こたえる",
    "こたつ",
    "こちょう",
    "こっか",
    "こつこつ",
    "こつばん",
    "こつぶ",
    "こてい",
    "こてん",
    "ことがら",
    "ことし",
    "ことば",
    "ことり",
    "こなごな",
    "こねこね",
    "このまま",
    "このみ",
    "このよ",
    "ごはん",
    "こひつじ",
    "こふう",
    "こふん",
    "こぼれる",
    "ごまあぶら",
    "こまかい",
    "ごますり",
    "こまつな",
    "こまる",
    "こむぎこ",
    "こもじ",
    "こもち",
    "こもの",
    "こもん",
    "こやく",
    "こやま",
    "こゆう",
    "こゆび",
    "こよい",
    "こよう",
    "こりる",
    "これくしょん",
    "ころっけ",
    "こわもて",
    "こわれる",
    "こんいん",
    "こんかい",
    "こんき",
    "こんしゅう",
    "こんすい",
    "こんだて",
    "こんとん",
    "こんなん",
    "こんびに",
    "こんぽん",
    "こんまけ",
    "こんや",
    "こんれい",
    "こんわく",
    "ざいえき",
    "さいかい",
    "さいきん",
    "ざいげん",
    "ざいこ",
    "さいしょ",
    "さいせい",
    "ざいたく",
    "ざいちゅう",
    "さいてき",
    "ざいりょう",
    "さうな",
    "さかいし",
    "さがす",
    "さかな",
    "さかみち",
    "さがる",
    "さぎょう",
    "さくし",
    "さくひん",
    "さくら",
    "さこく",
    "さこつ",
    "さずかる",
    "ざせき",
    "さたん",
    "さつえい",
    "ざつおん",
    "ざっか",
    "ざつがく",
    "さっきょく",
    "ざっし",
    "さつじん",
    "ざっそう",
    "さつたば",
    "さつまいも",
    "さてい",
    "さといも",
    "さとう",
    "さとおや",
    "さとし",
    "さとる",
    "さのう",
    "さばく",
    "さびしい",
    "さべつ",
    "さほう",
    "さほど",
    "さます",
    "さみしい",
    "さみだれ",
    "さむけ",
    "さめる",
    "さやえんどう",
    "さゆう",
    "さよう",
    "さよく",
    "さらだ",
    "ざるそば",
    "さわやか",
    "さわる",
    "さんいん",
    "さんか",
    "さんきゃく",
    "さんこう",
    "さんさい",
    "ざんしょ",
    "さんすう",
    "さんせい",
    "さんそ",
    "さんち",
    "さんま",
    "さんみ",
    "さんらん",
    "しあい",
    "しあげ",
    "しあさって",
    "しあわせ",
    "しいく",
    "しいん",
    "しうち",
    "しえい",
    "しおけ",
    "しかい",
    "しかく",
    "じかん",
    "しごと",
    "しすう",
    "じだい",
    "したうけ",
    "したぎ",
    "したて",
    "したみ",
    "しちょう",
    "しちりん",
    "しっかり",
    "しつじ",
    "しつもん",
    "してい",
    "してき",
    "してつ",
    "じてん",
    "じどう",
    "しなぎれ",
    "しなもの",
    "しなん",
    "しねま",
    "しねん",
    "しのぐ",
    "しのぶ",
    "しはい",
    "しばかり",
    "しはつ",
    "しはらい",
    "しはん",
    "しひょう",
    "しふく",
    "じぶん",
    "しへい",
    "しほう",
    "しほん",
    "しまう",
    "しまる",
    "しみん",
    "しむける",
    "じむしょ",
    "しめい",
    "しめる",
    "しもん",
    "しゃいん",
    "しゃうん",
    "しゃおん",
    "じゃがいも",
    "しやくしょ",
    "しゃくほう",
    "しゃけん",
    "しゃこ",
    "しゃざい",
    "しゃしん",
    "しゃせん",
    "しゃそう",
    "しゃたい",
    "しゃちょう",
    "しゃっきん",
    "じゃま",
    "しゃりん",
    "しゃれい",
    "じゆう",
    "じゅうしょ",
    "しゅくはく",
    "じゅしん",
    "しゅっせき",
    "しゅみ",
    "しゅらば",
    "じゅんばん",
    "しょうかい",
    "しょくたく",
    "しょっけん",
    "しょどう",
    "しょもつ",
    "しらせる",
    "しらべる",
    "しんか",
    "しんこう",
    "じんじゃ",
    "しんせいじ",
    "しんちく",
    "しんりん",
    "すあげ",
    "すあし",
    "すあな",
    "ずあん",
    "すいえい",
    "すいか",
    "すいとう",
    "ずいぶん",
    "すいようび",
    "すうがく",
    "すうじつ",
    "すうせん",
    "すおどり",
    "すきま",
    "すくう",
    "すくない",
    "すける",
    "すごい",
    "すこし",
    "ずさん",
    "すずしい",
    "すすむ",
    "すすめる",
    "すっかり",
    "ずっしり",
    "ずっと",
    "すてき",
    "すてる",
    "すねる",
    "すのこ",
    "すはだ",
    "すばらしい",
    "ずひょう",
    "ずぶぬれ",
    "すぶり",
    "すふれ",
    "すべて",
    "すべる",
    "ずほう",
    "すぼん",
    "すまい",
    "すめし",
    "すもう",
    "すやき",
    "すらすら",
    "するめ",
    "すれちがう",
    "すろっと",
    "すわる",
    "すんぜん",
    "すんぽう",
    "せあぶら",
    "せいかつ",
    "せいげん",
    "せいじ",
    "せいよう",
    "せおう",
    "せかいかん",
    "せきにん",
    "せきむ",
    "せきゆ",
    "せきらんうん",
    "せけん",
    "せこう",
    "せすじ",
    "せたい",
    "せたけ",
    "せっかく",
    "せっきゃく",
    "ぜっく",
    "せっけん",
    "せっこつ",
    "せっさたくま",
    "せつぞく",
    "せつだん",
    "せつでん",
    "せっぱん",
    "せつび",
    "せつぶん",
    "せつめい",
    "せつりつ",
    "せなか",
    "せのび",
    "せはば",
    "せびろ",
    "せぼね",
    "せまい",
    "せまる",
    "せめる",
    "せもたれ",
    "せりふ",
    "ぜんあく",
    "せんい",
    "せんえい",
    "せんか",
    "せんきょ",
    "せんく",
    "せんげん",
    "ぜんご",
    "せんさい",
    "せんしゅ",
    "せんすい",
    "せんせい",
    "せんぞ",
    "せんたく",
    "せんちょう",
    "せんてい",
    "せんとう",
    "せんぬき",
    "せんねん",
    "せんぱい",
    "ぜんぶ",
    "ぜんぽう",
    "せんむ",
    "せんめんじょ",
    "せんもん",
    "せんやく",
    "せんゆう",
    "せんよう",
    "ぜんら",
    "ぜんりゃく",
    "せんれい",
    "せんろ",
    "そあく",
    "そいとげる",
    "そいね",
    "そうがんきょう",
    "そうき",
    "そうご",
    "そうしん",
    "そうだん",
    "そうなん",
    "そうび",
    "そうめん",
    "そうり",
    "そえもの",
    "そえん",
    "そがい",
    "そげき",
    "そこう",
    "そこそこ",
    "そざい",
    "そしな",
    "そせい",
    "そせん",
    "そそぐ",
    "そだてる",
    "そつう",
    "そつえん",
    "そっかん",
    "そつぎょう",
    "そっけつ",
    "そっこう",
    "そっせん",
    "そっと",
    "そとがわ",
    "そとづら",
    "そなえる",
    "そなた",
    "そふぼ",
    "そぼく",
    "そぼろ",
    "そまつ",
    "そまる",
    "そむく",
    "そむりえ",
    "そめる",
    "そもそも",
    "そよかぜ",
    "そらまめ",
    "そろう",
    "そんかい",
    "そんけい",
    "そんざい",
    "そんしつ",
    "そんぞく",
    "そんちょう",
    "ぞんび",
    "ぞんぶん",
    "そんみん",
    "たあい",
    "たいいん",
    "たいうん",
    "たいえき",
    "たいおう",
    "だいがく",
    "たいき",
    "たいぐう",
    "たいけん",
    "たいこ",
    "たいざい",
    "だいじょうぶ",
    "だいすき",
    "たいせつ",
    "たいそう",
    "だいたい",
    "たいちょう",
    "たいてい",
    "だいどころ",
    "たいない",
    "たいねつ",
    "たいのう",
    "たいはん",
    "だいひょう",
    "たいふう",
    "たいへん",
    "たいほ",
    "たいまつばな",
    "たいみんぐ",
    "たいむ",
    "たいめん",
    "たいやき",
    "たいよう",
    "たいら",
    "たいりょく",
    "たいる",
    "たいわん",
    "たうえ",
    "たえる",
    "たおす",
    "たおる",
    "たおれる",
    "たかい",
    "たかね",
    "たきび",
    "たくさん",
    "たこく",
    "たこやき",
    "たさい",
    "たしざん",
    "だじゃれ",
    "たすける",
    "たずさわる",
    "たそがれ",
    "たたかう",
    "たたく",
    "ただしい",
    "たたみ",
    "たちばな",
    "だっかい",
    "だっきゃく",
    "だっこ",
    "だっしゅつ",
    "だったい",
    "たてる",
    "たとえる",
    "たなばた",
    "たにん",
    "たぬき",
    "たのしみ",
    "たはつ",
    "たぶん",
    "たべる",
    "たぼう",
    "たまご",
    "たまる",
    "だむる",
    "ためいき",
    "ためす",
    "ためる",
    "たもつ",
    "たやすい",
    "たよる",
    "たらす",
    "たりきほんがん",
    "たりょう",
    "たりる",
    "たると",
    "たれる",
    "たれんと",
    "たろっと",
    "たわむれる",
    "だんあつ",
    "たんい",
    "たんおん",
    "たんか",
    "たんき",
    "たんけん",
    "たんご",
    "たんさん",
    "たんじょうび",
    "だんせい",
    "たんそく",
    "たんたい",
    "だんち",
    "たんてい",
    "たんとう",
    "だんな",
    "たんにん",
    "だんねつ",
    "たんのう",
    "たんぴん",
    "だんぼう",
    "たんまつ",
    "たんめい",
    "だんれつ",
    "だんろ",
    "だんわ",
    "ちあい",
    "ちあん",
    "ちいき",
    "ちいさい",
    "ちえん",
    "ちかい",
    "ちから",
    "ちきゅう",
    "ちきん",
    "ちけいず",
    "ちけん",
    "ちこく",
    "ちさい",
    "ちしき",
    "ちしりょう",
    "ちせい",
    "ちそう",
    "ちたい",
    "ちたん",
    "ちちおや",
    "ちつじょ",
    "ちてき",
    "ちてん",
    "ちぬき",
    "ちぬり",
    "ちのう",
    "ちひょう",
    "ちへいせん",
    "ちほう",
    "ちまた",
    "ちみつ",
    "ちみどろ",
    "ちめいど",
    "ちゃんこなべ",
    "ちゅうい",
    "ちゆりょく",
    "ちょうし",
    "ちょさくけん",
    "ちらし",
    "ちらみ",
    "ちりがみ",
    "ちりょう",
    "ちるど",
    "ちわわ",
    "ちんたい",
    "ちんもく",
    "ついか",
    "ついたち",
    "つうか",
    "つうじょう",
    "つうはん",
    "つうわ",
    "つかう",
    "つかれる",
    "つくね",
    "つくる",
    "つけね",
    "つける",
    "つごう",
    "つたえる",
    "つづく",
    "つつじ",
    "つつむ",
    "つとめる",
    "つながる",
    "つなみ",
    "つねづね",
    "つのる",
    "つぶす",
    "つまらない",
    "つまる",
    "つみき",
    "つめたい",
    "つもり",
    "つもる",
    "つよい",
    "つるぼ",
    "つるみく",
    "つわもの",
    "つわり",
    "てあし",
    "てあて",
    "てあみ",
    "ていおん",
    "ていか",
    "ていき",
    "ていけい",
    "ていこく",
    "ていさつ",
    "ていし",
    "ていせい",
    "ていたい",
    "ていど",
    "ていねい",
    "ていひょう",
    "ていへん",
    "ていぼう",
    "てうち",
    "ておくれ",
    "てきとう",
    "てくび",
    "でこぼこ",
    "てさぎょう",
    "てさげ",
    "てすり",
    "てそう",
    "てちがい",
    "てちょう",
    "てつがく",
    "てつづき",
    "でっぱ",
    "てつぼう",
    "てつや",
    "でぬかえ",
    "てぬき",
    "てぬぐい",
    "てのひら",
    "てはい",
    "てぶくろ",
    "てふだ",
    "てほどき",
    "てほん",
    "てまえ",
    "てまきずし",
    "てみじか",
    "てみやげ",
    "てらす",
    "てれび",
    "てわけ",
    "てわたし",
    "でんあつ",
    "てんいん",
    "てんかい",
    "てんき",
    "てんぐ",
    "てんけん",
    "てんごく",
    "てんさい",
    "てんし",
    "てんすう",
    "でんち",
    "てんてき",
    "てんとう",
    "てんない",
    "てんぷら",
    "てんぼうだい",
    "てんめつ",
    "てんらんかい",
    "でんりょく",
    "でんわ",
    "どあい",
    "といれ",
    "どうかん",
    "とうきゅう",
    "どうぐ",
    "とうし",
    "とうむぎ",
    "とおい",
    "とおか",
    "とおく",
    "とおす",
    "とおる",
    "とかい",
    "とかす",
    "ときおり",
    "ときどき",
    "とくい",
    "とくしゅう",
    "とくてん",
    "とくに",
    "とくべつ",
    "とけい",
    "とける",
    "とこや",
    "とさか",
    "としょかん",
    "とそう",
    "とたん",
    "とちゅう",
    "とっきゅう",
    "とっくん",
    "とつぜん",
    "とつにゅう",
    "とどける",
    "ととのえる",
    "とない",
    "となえる",
    "となり",
    "とのさま",
    "とばす",
    "どぶがわ",
    "とほう",
    "とまる",
    "とめる",
    "ともだち",
    "ともる",
    "どようび",
    "とらえる",
    "とんかつ",
    "どんぶり",
    "ないかく",
    "ないこう",
    "ないしょ",
    "ないす",
    "ないせん",
    "ないそう",
    "なおす",
    "ながい",
    "なくす",
    "なげる",
    "なこうど",
    "なさけ",
    "なたでここ",
    "なっとう",
    "なつやすみ",
    "ななおし",
    "なにごと",
    "なにもの",
    "なにわ",
    "なのか",
    "なふだ",
    "なまいき",
    "なまえ",
    "なまみ",
    "なみだ",
    "なめらか",
    "なめる",
    "なやむ",
    "ならう",
    "ならび",
    "ならぶ",
    "なれる",
    "なわとび",
    "なわばり",
    "にあう",
    "にいがた",
    "にうけ",
    "におい",
    "にかい",
    "にがて",
    "にきび",
    "にくしみ",
    "にくまん",
    "にげる",
    "にさんかたんそ",
    "にしき",
    "にせもの",
    "にちじょう",
    "にちようび",
    "にっか",
    "にっき",
    "にっけい",
    "にっこう",
    "にっさん",
    "にっしょく",
    "にっすう",
    "にっせき",
    "にってい",
    "になう",
    "にほん",
    "にまめ",
    "にもつ",
    "にやり",
    "にゅういん",
    "にりんしゃ",
    "にわとり",
    "にんい",
    "にんか",
    "にんき",
    "にんげん",
    "にんしき",
    "にんずう",
    "にんそう",
    "にんたい",
    "にんち",
    "にんてい",
    "にんにく",
    "にんぷ",
    "にんまり",
    "にんむ",
    "にんめい",
    "にんよう",
    "ぬいくぎ",
    "ぬかす",
    "ぬぐいとる",
    "ぬぐう",
    "ぬくもり",
    "ぬすむ",
    "ぬまえび",
    "ぬめり",
    "ぬらす",
    "ぬんちゃく",
    "ねあげ",
    "ねいき",
    "ねいる",
    "ねいろ",
    "ねぐせ",
    "ねくたい",
    "ねくら",
    "ねこぜ",
    "ねこむ",
    "ねさげ",
    "ねすごす",
    "ねそべる",
    "ねだん",
    "ねつい",
    "ねっしん",
    "ねつぞう",
    "ねったいぎょ",
    "ねぶそく",
    "ねふだ",
    "ねぼう",
    "ねほりはほり",
    "ねまき",
    "ねまわし",
    "ねみみ",
    "ねむい",
    "ねむたい",
    "ねもと",
    "ねらう",
    "ねわざ",
    "ねんいり",
    "ねんおし",
    "ねんかん",
    "ねんきん",
    "ねんぐ",
    "ねんざ",
    "ねんし",
    "ねんちゃく",
    "ねんど",
    "ねんぴ",
    "ねんぶつ",
    "ねんまつ",
    "ねんりょう",
    "ねんれい",
    "のいず",
    "のおづま",
    "のがす",
    "のきなみ",
    "のこぎり",
    "のこす",
    "のこる",
    "のせる",
    "のぞく",
    "のぞむ",
    "のたまう",
    "のちほど",
    "のっく",
    "のばす",
    "のはら",
    "のべる",
    "のぼる",
    "のみもの",
    "のやま",
    "のらいぬ",
    "のらねこ",
    "のりもの",
    "のりゆき",
    "のれん",
    "のんき",
    "ばあい",
    "はあく",
    "ばあさん",
    "ばいか",
    "ばいく",
    "はいけん",
    "はいご",
    "はいしん",
    "はいすい",
    "はいせん",
    "はいそう",
    "はいち",
    "ばいばい",
    "はいれつ",
    "はえる",
    "はおる",
    "はかい",
    "ばかり",
    "はかる",
    "はくしゅ",
    "はけん",
    "はこぶ",
    "はさみ",
    "はさん",
    "はしご",
    "ばしょ",
    "はしる",
    "はせる",
    "ぱそこん",
    "はそん",
    "はたん",
    "はちみつ",
    "はつおん",
    "はっかく",
    "はづき",
    "はっきり",
    "はっくつ",
    "はっけん",
    "はっこう",
    "はっさん",
    "はっしん",
    "はったつ",
    "はっちゅう",
    "はってん",
    "はっぴょう",
    "はっぽう",
    "はなす",
    "はなび",
    "はにかむ",
    "はぶらし",
    "はみがき",
    "はむかう",
    "はめつ",
    "はやい",
    "はやし",
    "はらう",
    "はろうぃん",
    "はわい",
    "はんい",
    "はんえい",
    "はんおん",
    "はんかく",
    "はんきょう",
    "ばんぐみ",
    "はんこ",
    "はんしゃ",
    "はんすう",
    "はんだん",
    "ぱんち",
    "ぱんつ",
    "はんてい",
    "はんとし",
    "はんのう",
    "はんぱ",
    "はんぶん",
    "はんぺん",
    "はんぼうき",
    "はんめい",
    "はんらん",
    "はんろん",
    "ひいき",
    "ひうん",
    "ひえる",
    "ひかく",
    "ひかり",
    "ひかる",
    "ひかん",
    "ひくい",
    "ひけつ",
    "ひこうき",
    "ひこく",
    "ひさい",
    "ひさしぶり",
    "ひさん",
    "びじゅつかん",
    "ひしょ",
    "ひそか",
    "ひそむ",
    "ひたむき",
    "ひだり",
    "ひたる",
    "ひつぎ",
    "ひっこし",
    "ひっし",
    "ひつじゅひん",
    "ひっす",
    "ひつぜん",
    "ぴったり",
    "ぴっちり",
    "ひつよう",
    "ひてい",
    "ひとごみ",
    "ひなまつり",
    "ひなん",
    "ひねる",
    "ひはん",
    "ひびく",
    "ひひょう",
    "ひほう",
    "ひまわり",
    "ひまん",
    "ひみつ",
    "ひめい",
    "ひめじし",
    "ひやけ",
    "ひやす",
    "ひよう",
    "びょうき",
    "ひらがな",
    "ひらく",
    "ひりつ",
    "ひりょう",
    "ひるま",
    "ひるやすみ",
    "ひれい",
    "ひろい",
    "ひろう",
    "ひろき",
    "ひろゆき",
    "ひんかく",
    "ひんけつ",
    "ひんこん",
    "ひんしゅ",
    "ひんそう",
    "ぴんち",
    "ひんぱん",
    "びんぼう",
    "ふあん",
    "ふいうち",
    "ふうけい",
    "ふうせん",
    "ぷうたろう",
    "ふうとう",
    "ふうふ",
    "ふえる",
    "ふおん",
    "ふかい",
    "ふきん",
    "ふくざつ",
    "ふくぶくろ",
    "ふこう",
    "ふさい",
    "ふしぎ",
    "ふじみ",
    "ふすま",
    "ふせい",
    "ふせぐ",
    "ふそく",
    "ぶたにく",
    "ふたん",
    "ふちょう",
    "ふつう",
    "ふつか",
    "ふっかつ",
    "ふっき",
    "ふっこく",
    "ぶどう",
    "ふとる",
    "ふとん",
    "ふのう",
    "ふはい",
    "ふひょう",
    "ふへん",
    "ふまん",
    "ふみん",
    "ふめつ",
    "ふめん",
    "ふよう",
    "ふりこ",
    "ふりる",
    "ふるい",
    "ふんいき",
    "ぶんがく",
    "ぶんぐ",
    "ふんしつ",
    "ぶんせき",
    "ふんそう",
    "ぶんぽう",
    "へいあん",
    "へいおん",
    "へいがい",
    "へいき",
    "へいげん",
    "へいこう",
    "へいさ",
    "へいしゃ",
    "へいせつ",
    "へいそ",
    "へいたく",
    "へいてん",
    "へいねつ",
    "へいわ",
    "へきが",
    "へこむ",
    "べにいろ",
    "べにしょうが",
    "へらす",
    "へんかん",
    "べんきょう",
    "べんごし",
    "へんさい",
    "へんたい",
    "べんり",
    "ほあん",
    "ほいく",
    "ぼうぎょ",
    "ほうこく",
    "ほうそう",
    "ほうほう",
    "ほうもん",
    "ほうりつ",
    "ほえる",
    "ほおん",
    "ほかん",
    "ほきょう",
    "ぼきん",
    "ほくろ",
    "ほけつ",
    "ほけん",
    "ほこう",
    "ほこる",
    "ほしい",
    "ほしつ",
    "ほしゅ",
    "ほしょう",
    "ほせい",
    "ほそい",
    "ほそく",
    "ほたて",
    "ほたる",
    "ぽちぶくろ",
    "ほっきょく",
    "ほっさ",
    "ほったん",
    "ほとんど",
    "ほめる",
    "ほんい",
    "ほんき",
    "ほんけ",
    "ほんしつ",
    "ほんやく",
    "まいにち",
    "まかい",
    "まかせる",
    "まがる",
    "まける",
    "まこと",
    "まさつ",
    "まじめ",
    "ますく",
    "まぜる",
    "まつり",
    "まとめ",
    "まなぶ",
    "まぬけ",
    "まねく",
    "まほう",
    "まもる",
    "まゆげ",
    "まよう",
    "まろやか",
    "まわす",
    "まわり",
    "まわる",
    "まんが",
    "まんきつ",
    "まんぞく",
    "まんなか",
    "みいら",
    "みうち",
    "みえる",
    "みがく",
    "みかた",
    "みかん",
    "みけん",
    "みこん",
    "みじかい",
    "みすい",
    "みすえる",
    "みせる",
    "みっか",
    "みつかる",
    "みつける",
    "みてい",
    "みとめる",
    "みなと",
    "みなみかさい",
    "みねらる",
    "みのう",
    "みのがす",
    "みほん",
    "みもと",
    "みやげ",
    "みらい",
    "みりょく",
    "みわく",
    "みんか",
    "みんぞく",
    "むいか",
    "むえき",
    "むえん",
    "むかい",
    "むかう",
    "むかえ",
    "むかし",
    "むぎちゃ",
    "むける",
    "むげん",
    "むさぼる",
    "むしあつい",
    "むしば",
    "むじゅん",
    "むしろ",
    "むすう",
    "むすこ",
    "むすぶ",
    "むすめ",
    "むせる",
    "むせん",
    "むちゅう",
    "むなしい",
    "むのう",
    "むやみ",
    "むよう",
    "むらさき",
    "むりょう",
    "むろん",
    "めいあん",
    "めいうん",
    "めいえん",
    "めいかく",
    "めいきょく",
    "めいさい",
    "めいし",
    "めいそう",
    "めいぶつ",
    "めいれい",
    "めいわく",
    "めぐまれる",
    "めざす",
    "めした",
    "めずらしい",
    "めだつ",
    "めまい",
    "めやす",
    "めんきょ",
    "めんせき",
    "めんどう",
    "もうしあげる",
    "もうどうけん",
    "もえる",
    "もくし",
    "もくてき",
    "もくようび",
    "もちろん",
    "もどる",
    "もらう",
    "もんく",
    "もんだい",
    "やおや",
    "やける",
    "やさい",
    "やさしい",
    "やすい",
    "やすたろう",
    "やすみ",
    "やせる",
    "やそう",
    "やたい",
    "やちん",
    "やっと",
    "やっぱり",
    "やぶる",
    "やめる",
    "ややこしい",
    "やよい",
    "やわらかい",
    "ゆうき",
    "ゆうびんきょく",
    "ゆうべ",
    "ゆうめい",
    "ゆけつ",
    "ゆしゅつ",
    "ゆせん",
    "ゆそう",
    "ゆたか",
    "ゆちゃく",
    "ゆでる",
    "ゆにゅう",
    "ゆびわ",
    "ゆらい",
    "ゆれる",
    "ようい",
    "ようか",
    "ようきゅう",
    "ようじ",
    "ようす",
    "ようちえん",
    "よかぜ",
    "よかん",
    "よきん",
    "よくせい",
    "よくぼう",
    "よけい",
    "よごれる",
    "よさん",
    "よしゅう",
    "よそう",
    "よそく",
    "よっか",
    "よてい",
    "よどがわく",
    "よねつ",
    "よやく",
    "よゆう",
    "よろこぶ",
    "よろしい",
    "らいう",
    "らくがき",
    "らくご",
    "らくさつ",
    "らくだ",
    "らしんばん",
    "らせん",
    "らぞく",
    "らたい",
    "らっか",
    "られつ",
    "りえき",
    "りかい",
    "りきさく",
    "りきせつ",
    "りくぐん",
    "りくつ",
    "りけん",
    "りこう",
    "りせい",
    "りそう",
    "りそく",
    "りてん",
    "りねん",
    "りゆう",
    "りゅうがく",
    "りよう",
    "りょうり",
    "りょかん",
    "りょくちゃ",
    "りょこう",
    "りりく",
    "りれき",
    "りろん",
    "りんご",
    "るいけい",
    "るいさい",
    "るいじ",
    "るいせき",
    "るすばん",
    "るりがわら",
    "れいかん",
    "れいぎ",
    "れいせい",
    "れいぞうこ",
    "れいとう",
    "れいぼう",
    "れきし",
    "れきだい",
    "れんあい",
    "れんけい",
    "れんこん",
    "れんさい",
    "れんしゅう",
    "れんぞく",
    "れんらく",
    "ろうか",
    "ろうご",
    "ろうじん",
    "ろうそく",
    "ろくが",
    "ろこつ",
    "ろじうら",
    "ろしゅつ",
    "ろせん",
    "ろてん",
    "ろめん",
    "ろれつ",
    "ろんぎ",
    "ろんぱ",
    "ろんぶん",
    "ろんり",
    "わかす",
    "わかめ",
    "わかやま",
    "わかれる",
    "わしつ",
    "わじまし",
    "わすれもの",
    "わらう",
    "われる"
]

},{}],30:[function(require,module,exports){
module.exports=[
    "가격",
    "가끔",
    "가난",
    "가능",
    "가득",
    "가르침",
    "가뭄",
    "가방",
    "가상",
    "가슴",
    "가운데",
    "가을",
    "가이드",
    "가입",
    "가장",
    "가정",
    "가족",
    "가죽",
    "각오",
    "각자",
    "간격",
    "간부",
    "간섭",
    "간장",
    "간접",
    "간판",
    "갈등",
    "갈비",
    "갈색",
    "갈증",
    "감각",
    "감기",
    "감소",
    "감수성",
    "감자",
    "감정",
    "갑자기",
    "강남",
    "강당",
    "강도",
    "강력히",
    "강변",
    "강북",
    "강사",
    "강수량",
    "강아지",
    "강원도",
    "강의",
    "강제",
    "강조",
    "같이",
    "개구리",
    "개나리",
    "개방",
    "개별",
    "개선",
    "개성",
    "개인",
    "객관적",
    "거실",
    "거액",
    "거울",
    "거짓",
    "거품",
    "걱정",
    "건강",
    "건물",
    "건설",
    "건조",
    "건축",
    "걸음",
    "검사",
    "검토",
    "게시판",
    "게임",
    "겨울",
    "견해",
    "결과",
    "결국",
    "결론",
    "결석",
    "결승",
    "결심",
    "결정",
    "결혼",
    "경계",
    "경고",
    "경기",
    "경력",
    "경복궁",
    "경비",
    "경상도",
    "경영",
    "경우",
    "경쟁",
    "경제",
    "경주",
    "경찰",
    "경치",
    "경향",
    "경험",
    "계곡",
    "계단",
    "계란",
    "계산",
    "계속",
    "계약",
    "계절",
    "계층",
    "계획",
    "고객",
    "고구려",
    "고궁",
    "고급",
    "고등학생",
    "고무신",
    "고민",
    "고양이",
    "고장",
    "고전",
    "고집",
    "고춧가루",
    "고통",
    "고향",
    "곡식",
    "골목",
    "골짜기",
    "골프",
    "공간",
    "공개",
    "공격",
    "공군",
    "공급",
    "공기",
    "공동",
    "공무원",
    "공부",
    "공사",
    "공식",
    "공업",
    "공연",
    "공원",
    "공장",
    "공짜",
    "공책",
    "공통",
    "공포",
    "공항",
    "공휴일",
    "과목",
    "과일",
    "과장",
    "과정",
    "과학",
    "관객",
    "관계",
    "관광",
    "관념",
    "관람",
    "관련",
    "관리",
    "관습",
    "관심",
    "관점",
    "관찰",
    "광경",
    "광고",
    "광장",
    "광주",
    "괴로움",
    "굉장히",
    "교과서",
    "교문",
    "교복",
    "교실",
    "교양",
    "교육",
    "교장",
    "교직",
    "교통",
    "교환",
    "교훈",
    "구경",
    "구름",
    "구멍",
    "구별",
    "구분",
    "구석",
    "구성",
    "구속",
    "구역",
    "구입",
    "구청",
    "구체적",
    "국가",
    "국기",
    "국내",
    "국립",
    "국물",
    "국민",
    "국수",
    "국어",
    "국왕",
    "국적",
    "국제",
    "국회",
    "군대",
    "군사",
    "군인",
    "궁극적",
    "권리",
    "권위",
    "권투",
    "귀국",
    "귀신",
    "규정",
    "규칙",
    "균형",
    "그날",
    "그냥",
    "그늘",
    "그러나",
    "그룹",
    "그릇",
    "그림",
    "그제서야",
    "그토록",
    "극복",
    "극히",
    "근거",
    "근교",
    "근래",
    "근로",
    "근무",
    "근본",
    "근원",
    "근육",
    "근처",
    "글씨",
    "글자",
    "금강산",
    "금고",
    "금년",
    "금메달",
    "금액",
    "금연",
    "금요일",
    "금지",
    "긍정적",
    "기간",
    "기관",
    "기념",
    "기능",
    "기독교",
    "기둥",
    "기록",
    "기름",
    "기법",
    "기본",
    "기분",
    "기쁨",
    "기숙사",
    "기술",
    "기억",
    "기업",
    "기온",
    "기운",
    "기원",
    "기적",
    "기준",
    "기침",
    "기혼",
    "기획",
    "긴급",
    "긴장",
    "길이",
    "김밥",
    "김치",
    "김포공항",
    "깍두기",
    "깜빡",
    "깨달음",
    "깨소금",
    "껍질",
    "꼭대기",
    "꽃잎",
    "나들이",
    "나란히",
    "나머지",
    "나물",
    "나침반",
    "나흘",
    "낙엽",
    "난방",
    "날개",
    "날씨",
    "날짜",
    "남녀",
    "남대문",
    "남매",
    "남산",
    "남자",
    "남편",
    "남학생",
    "낭비",
    "낱말",
    "내년",
    "내용",
    "내일",
    "냄비",
    "냄새",
    "냇물",
    "냉동",
    "냉면",
    "냉방",
    "냉장고",
    "넥타이",
    "넷째",
    "노동",
    "노란색",
    "노력",
    "노인",
    "녹음",
    "녹차",
    "녹화",
    "논리",
    "논문",
    "논쟁",
    "놀이",
    "농구",
    "농담",
    "농민",
    "농부",
    "농업",
    "농장",
    "농촌",
    "높이",
    "눈동자",
    "눈물",
    "눈썹",
    "뉴욕",
    "느낌",
    "늑대",
    "능동적",
    "능력",
    "다방",
    "다양성",
    "다음",
    "다이어트",
    "다행",
    "단계",
    "단골",
    "단독",
    "단맛",
    "단순",
    "단어",
    "단위",
    "단점",
    "단체",
    "단추",
    "단편",
    "단풍",
    "달걀",
    "달러",
    "달력",
    "달리",
    "닭고기",
    "담당",
    "담배",
    "담요",
    "담임",
    "답변",
    "답장",
    "당근",
    "당분간",
    "당연히",
    "당장",
    "대규모",
    "대낮",
    "대단히",
    "대답",
    "대도시",
    "대략",
    "대량",
    "대륙",
    "대문",
    "대부분",
    "대신",
    "대응",
    "대장",
    "대전",
    "대접",
    "대중",
    "대책",
    "대출",
    "대충",
    "대통령",
    "대학",
    "대한민국",
    "대합실",
    "대형",
    "덩어리",
    "데이트",
    "도대체",
    "도덕",
    "도둑",
    "도망",
    "도서관",
    "도심",
    "도움",
    "도입",
    "도자기",
    "도저히",
    "도전",
    "도중",
    "도착",
    "독감",
    "독립",
    "독서",
    "독일",
    "독창적",
    "동화책",
    "뒷모습",
    "뒷산",
    "딸아이",
    "마누라",
    "마늘",
    "마당",
    "마라톤",
    "마련",
    "마무리",
    "마사지",
    "마약",
    "마요네즈",
    "마을",
    "마음",
    "마이크",
    "마중",
    "마지막",
    "마찬가지",
    "마찰",
    "마흔",
    "막걸리",
    "막내",
    "막상",
    "만남",
    "만두",
    "만세",
    "만약",
    "만일",
    "만점",
    "만족",
    "만화",
    "많이",
    "말기",
    "말씀",
    "말투",
    "맘대로",
    "망원경",
    "매년",
    "매달",
    "매력",
    "매번",
    "매스컴",
    "매일",
    "매장",
    "맥주",
    "먹이",
    "먼저",
    "먼지",
    "멀리",
    "메일",
    "며느리",
    "며칠",
    "면담",
    "멸치",
    "명단",
    "명령",
    "명예",
    "명의",
    "명절",
    "명칭",
    "명함",
    "모금",
    "모니터",
    "모델",
    "모든",
    "모범",
    "모습",
    "모양",
    "모임",
    "모조리",
    "모집",
    "모퉁이",
    "목걸이",
    "목록",
    "목사",
    "목소리",
    "목숨",
    "목적",
    "목표",
    "몰래",
    "몸매",
    "몸무게",
    "몸살",
    "몸속",
    "몸짓",
    "몸통",
    "몹시",
    "무관심",
    "무궁화",
    "무더위",
    "무덤",
    "무릎",
    "무슨",
    "무엇",
    "무역",
    "무용",
    "무조건",
    "무지개",
    "무척",
    "문구",
    "문득",
    "문법",
    "문서",
    "문제",
    "문학",
    "문화",
    "물가",
    "물건",
    "물결",
    "물고기",
    "물론",
    "물리학",
    "물음",
    "물질",
    "물체",
    "미국",
    "미디어",
    "미사일",
    "미술",
    "미역",
    "미용실",
    "미움",
    "미인",
    "미팅",
    "미혼",
    "민간",
    "민족",
    "민주",
    "믿음",
    "밀가루",
    "밀리미터",
    "밑바닥",
    "바가지",
    "바구니",
    "바나나",
    "바늘",
    "바닥",
    "바닷가",
    "바람",
    "바이러스",
    "바탕",
    "박물관",
    "박사",
    "박수",
    "반대",
    "반드시",
    "반말",
    "반발",
    "반성",
    "반응",
    "반장",
    "반죽",
    "반지",
    "반찬",
    "받침",
    "발가락",
    "발걸음",
    "발견",
    "발달",
    "발레",
    "발목",
    "발바닥",
    "발생",
    "발음",
    "발자국",
    "발전",
    "발톱",
    "발표",
    "밤하늘",
    "밥그릇",
    "밥맛",
    "밥상",
    "밥솥",
    "방금",
    "방면",
    "방문",
    "방바닥",
    "방법",
    "방송",
    "방식",
    "방안",
    "방울",
    "방지",
    "방학",
    "방해",
    "방향",
    "배경",
    "배꼽",
    "배달",
    "배드민턴",
    "백두산",
    "백색",
    "백성",
    "백인",
    "백제",
    "백화점",
    "버릇",
    "버섯",
    "버튼",
    "번개",
    "번역",
    "번지",
    "번호",
    "벌금",
    "벌레",
    "벌써",
    "범위",
    "범인",
    "범죄",
    "법률",
    "법원",
    "법적",
    "법칙",
    "베이징",
    "벨트",
    "변경",
    "변동",
    "변명",
    "변신",
    "변호사",
    "변화",
    "별도",
    "별명",
    "별일",
    "병실",
    "병아리",
    "병원",
    "보관",
    "보너스",
    "보라색",
    "보람",
    "보름",
    "보상",
    "보안",
    "보자기",
    "보장",
    "보전",
    "보존",
    "보통",
    "보편적",
    "보험",
    "복도",
    "복사",
    "복숭아",
    "복습",
    "볶음",
    "본격적",
    "본래",
    "본부",
    "본사",
    "본성",
    "본인",
    "본질",
    "볼펜",
    "봉사",
    "봉지",
    "봉투",
    "부근",
    "부끄러움",
    "부담",
    "부동산",
    "부문",
    "부분",
    "부산",
    "부상",
    "부엌",
    "부인",
    "부작용",
    "부장",
    "부정",
    "부족",
    "부지런히",
    "부친",
    "부탁",
    "부품",
    "부회장",
    "북부",
    "북한",
    "분노",
    "분량",
    "분리",
    "분명",
    "분석",
    "분야",
    "분위기",
    "분필",
    "분홍색",
    "불고기",
    "불과",
    "불교",
    "불꽃",
    "불만",
    "불법",
    "불빛",
    "불안",
    "불이익",
    "불행",
    "브랜드",
    "비극",
    "비난",
    "비닐",
    "비둘기",
    "비디오",
    "비로소",
    "비만",
    "비명",
    "비밀",
    "비바람",
    "비빔밥",
    "비상",
    "비용",
    "비율",
    "비중",
    "비타민",
    "비판",
    "빌딩",
    "빗물",
    "빗방울",
    "빗줄기",
    "빛깔",
    "빨간색",
    "빨래",
    "빨리",
    "사건",
    "사계절",
    "사나이",
    "사냥",
    "사람",
    "사랑",
    "사립",
    "사모님",
    "사물",
    "사방",
    "사상",
    "사생활",
    "사설",
    "사슴",
    "사실",
    "사업",
    "사용",
    "사월",
    "사장",
    "사전",
    "사진",
    "사촌",
    "사춘기",
    "사탕",
    "사투리",
    "사흘",
    "산길",
    "산부인과",
    "산업",
    "산책",
    "살림",
    "살인",
    "살짝",
    "삼계탕",
    "삼국",
    "삼십",
    "삼월",
    "삼촌",
    "상관",
    "상금",
    "상대",
    "상류",
    "상반기",
    "상상",
    "상식",
    "상업",
    "상인",
    "상자",
    "상점",
    "상처",
    "상추",
    "상태",
    "상표",
    "상품",
    "상황",
    "새벽",
    "색깔",
    "색연필",
    "생각",
    "생명",
    "생물",
    "생방송",
    "생산",
    "생선",
    "생신",
    "생일",
    "생활",
    "서랍",
    "서른",
    "서명",
    "서민",
    "서비스",
    "서양",
    "서울",
    "서적",
    "서점",
    "서쪽",
    "서클",
    "석사",
    "석유",
    "선거",
    "선물",
    "선배",
    "선생",
    "선수",
    "선원",
    "선장",
    "선전",
    "선택",
    "선풍기",
    "설거지",
    "설날",
    "설렁탕",
    "설명",
    "설문",
    "설사",
    "설악산",
    "설치",
    "설탕",
    "섭씨",
    "성공",
    "성당",
    "성명",
    "성별",
    "성인",
    "성장",
    "성적",
    "성질",
    "성함",
    "세금",
    "세미나",
    "세상",
    "세월",
    "세종대왕",
    "세탁",
    "센터",
    "센티미터",
    "셋째",
    "소규모",
    "소극적",
    "소금",
    "소나기",
    "소년",
    "소득",
    "소망",
    "소문",
    "소설",
    "소속",
    "소아과",
    "소용",
    "소원",
    "소음",
    "소중히",
    "소지품",
    "소질",
    "소풍",
    "소형",
    "속담",
    "속도",
    "속옷",
    "손가락",
    "손길",
    "손녀",
    "손님",
    "손등",
    "손목",
    "손뼉",
    "손실",
    "손질",
    "손톱",
    "손해",
    "솔직히",
    "솜씨",
    "송아지",
    "송이",
    "송편",
    "쇠고기",
    "쇼핑",
    "수건",
    "수년",
    "수단",
    "수돗물",
    "수동적",
    "수면",
    "수명",
    "수박",
    "수상",
    "수석",
    "수술",
    "수시로",
    "수업",
    "수염",
    "수영",
    "수입",
    "수준",
    "수집",
    "수출",
    "수컷",
    "수필",
    "수학",
    "수험생",
    "수화기",
    "숙녀",
    "숙소",
    "숙제",
    "순간",
    "순서",
    "순수",
    "순식간",
    "순위",
    "숟가락",
    "술병",
    "술집",
    "숫자",
    "스님",
    "스물",
    "스스로",
    "스승",
    "스웨터",
    "스위치",
    "스케이트",
    "스튜디오",
    "스트레스",
    "스포츠",
    "슬쩍",
    "슬픔",
    "습관",
    "습기",
    "승객",
    "승리",
    "승부",
    "승용차",
    "승진",
    "시각",
    "시간",
    "시골",
    "시금치",
    "시나리오",
    "시댁",
    "시리즈",
    "시멘트",
    "시민",
    "시부모",
    "시선",
    "시설",
    "시스템",
    "시아버지",
    "시어머니",
    "시월",
    "시인",
    "시일",
    "시작",
    "시장",
    "시절",
    "시점",
    "시중",
    "시즌",
    "시집",
    "시청",
    "시합",
    "시험",
    "식구",
    "식기",
    "식당",
    "식량",
    "식료품",
    "식물",
    "식빵",
    "식사",
    "식생활",
    "식초",
    "식탁",
    "식품",
    "신고",
    "신규",
    "신념",
    "신문",
    "신발",
    "신비",
    "신사",
    "신세",
    "신용",
    "신제품",
    "신청",
    "신체",
    "신화",
    "실감",
    "실내",
    "실력",
    "실례",
    "실망",
    "실수",
    "실습",
    "실시",
    "실장",
    "실정",
    "실질적",
    "실천",
    "실체",
    "실컷",
    "실태",
    "실패",
    "실험",
    "실현",
    "심리",
    "심부름",
    "심사",
    "심장",
    "심정",
    "심판",
    "쌍둥이",
    "씨름",
    "씨앗",
    "아가씨",
    "아나운서",
    "아드님",
    "아들",
    "아쉬움",
    "아스팔트",
    "아시아",
    "아울러",
    "아저씨",
    "아줌마",
    "아직",
    "아침",
    "아파트",
    "아프리카",
    "아픔",
    "아홉",
    "아흔",
    "악기",
    "악몽",
    "악수",
    "안개",
    "안경",
    "안과",
    "안내",
    "안녕",
    "안동",
    "안방",
    "안부",
    "안주",
    "알루미늄",
    "알코올",
    "암시",
    "암컷",
    "압력",
    "앞날",
    "앞문",
    "애인",
    "애정",
    "액수",
    "앨범",
    "야간",
    "야단",
    "야옹",
    "약간",
    "약국",
    "약속",
    "약수",
    "약점",
    "약품",
    "약혼녀",
    "양념",
    "양력",
    "양말",
    "양배추",
    "양주",
    "양파",
    "어둠",
    "어려움",
    "어른",
    "어젯밤",
    "어쨌든",
    "어쩌다가",
    "어쩐지",
    "언니",
    "언덕",
    "언론",
    "언어",
    "얼굴",
    "얼른",
    "얼음",
    "얼핏",
    "엄마",
    "업무",
    "업종",
    "업체",
    "엉덩이",
    "엉망",
    "엉터리",
    "엊그제",
    "에너지",
    "에어컨",
    "엔진",
    "여건",
    "여고생",
    "여관",
    "여군",
    "여권",
    "여대생",
    "여덟",
    "여동생",
    "여든",
    "여론",
    "여름",
    "여섯",
    "여성",
    "여왕",
    "여인",
    "여전히",
    "여직원",
    "여학생",
    "여행",
    "역사",
    "역시",
    "역할",
    "연결",
    "연구",
    "연극",
    "연기",
    "연락",
    "연설",
    "연세",
    "연속",
    "연습",
    "연애",
    "연예인",
    "연인",
    "연장",
    "연주",
    "연출",
    "연필",
    "연합",
    "연휴",
    "열기",
    "열매",
    "열쇠",
    "열심히",
    "열정",
    "열차",
    "열흘",
    "염려",
    "엽서",
    "영국",
    "영남",
    "영상",
    "영양",
    "영역",
    "영웅",
    "영원히",
    "영하",
    "영향",
    "영혼",
    "영화",
    "옆구리",
    "옆방",
    "옆집",
    "예감",
    "예금",
    "예방",
    "예산",
    "예상",
    "예선",
    "예술",
    "예습",
    "예식장",
    "예약",
    "예전",
    "예절",
    "예정",
    "예컨대",
    "옛날",
    "오늘",
    "오락",
    "오랫동안",
    "오렌지",
    "오로지",
    "오른발",
    "오븐",
    "오십",
    "오염",
    "오월",
    "오전",
    "오직",
    "오징어",
    "오페라",
    "오피스텔",
    "오히려",
    "옥상",
    "옥수수",
    "온갖",
    "온라인",
    "온몸",
    "온종일",
    "온통",
    "올가을",
    "올림픽",
    "올해",
    "옷차림",
    "와이셔츠",
    "와인",
    "완성",
    "완전",
    "왕비",
    "왕자",
    "왜냐하면",
    "왠지",
    "외갓집",
    "외국",
    "외로움",
    "외삼촌",
    "외출",
    "외침",
    "외할머니",
    "왼발",
    "왼손",
    "왼쪽",
    "요금",
    "요일",
    "요즘",
    "요청",
    "용기",
    "용서",
    "용어",
    "우산",
    "우선",
    "우승",
    "우연히",
    "우정",
    "우체국",
    "우편",
    "운동",
    "운명",
    "운반",
    "운전",
    "운행",
    "울산",
    "울음",
    "움직임",
    "웃어른",
    "웃음",
    "워낙",
    "원고",
    "원래",
    "원서",
    "원숭이",
    "원인",
    "원장",
    "원피스",
    "월급",
    "월드컵",
    "월세",
    "월요일",
    "웨이터",
    "위반",
    "위법",
    "위성",
    "위원",
    "위험",
    "위협",
    "윗사람",
    "유난히",
    "유럽",
    "유명",
    "유물",
    "유산",
    "유적",
    "유치원",
    "유학",
    "유행",
    "유형",
    "육군",
    "육상",
    "육십",
    "육체",
    "은행",
    "음력",
    "음료",
    "음반",
    "음성",
    "음식",
    "음악",
    "음주",
    "의견",
    "의논",
    "의문",
    "의복",
    "의식",
    "의심",
    "의외로",
    "의욕",
    "의원",
    "의학",
    "이것",
    "이곳",
    "이념",
    "이놈",
    "이달",
    "이대로",
    "이동",
    "이렇게",
    "이력서",
    "이론적",
    "이름",
    "이민",
    "이발소",
    "이별",
    "이불",
    "이빨",
    "이상",
    "이성",
    "이슬",
    "이야기",
    "이용",
    "이웃",
    "이월",
    "이윽고",
    "이익",
    "이전",
    "이중",
    "이튿날",
    "이틀",
    "이혼",
    "인간",
    "인격",
    "인공",
    "인구",
    "인근",
    "인기",
    "인도",
    "인류",
    "인물",
    "인생",
    "인쇄",
    "인연",
    "인원",
    "인재",
    "인종",
    "인천",
    "인체",
    "인터넷",
    "인하",
    "인형",
    "일곱",
    "일기",
    "일단",
    "일대",
    "일등",
    "일반",
    "일본",
    "일부",
    "일상",
    "일생",
    "일손",
    "일요일",
    "일월",
    "일정",
    "일종",
    "일주일",
    "일찍",
    "일체",
    "일치",
    "일행",
    "일회용",
    "임금",
    "임무",
    "입대",
    "입력",
    "입맛",
    "입사",
    "입술",
    "입시",
    "입원",
    "입장",
    "입학",
    "자가용",
    "자격",
    "자극",
    "자동",
    "자랑",
    "자부심",
    "자식",
    "자신",
    "자연",
    "자원",
    "자율",
    "자전거",
    "자정",
    "자존심",
    "자판",
    "작가",
    "작년",
    "작성",
    "작업",
    "작용",
    "작은딸",
    "작품",
    "잔디",
    "잔뜩",
    "잔치",
    "잘못",
    "잠깐",
    "잠수함",
    "잠시",
    "잠옷",
    "잠자리",
    "잡지",
    "장관",
    "장군",
    "장기간",
    "장래",
    "장례",
    "장르",
    "장마",
    "장면",
    "장모",
    "장미",
    "장비",
    "장사",
    "장소",
    "장식",
    "장애인",
    "장인",
    "장점",
    "장차",
    "장학금",
    "재능",
    "재빨리",
    "재산",
    "재생",
    "재작년",
    "재정",
    "재채기",
    "재판",
    "재학",
    "재활용",
    "저것",
    "저고리",
    "저곳",
    "저녁",
    "저런",
    "저렇게",
    "저번",
    "저울",
    "저절로",
    "저축",
    "적극",
    "적당히",
    "적성",
    "적용",
    "적응",
    "전개",
    "전공",
    "전기",
    "전달",
    "전라도",
    "전망",
    "전문",
    "전반",
    "전부",
    "전세",
    "전시",
    "전용",
    "전자",
    "전쟁",
    "전주",
    "전철",
    "전체",
    "전통",
    "전혀",
    "전후",
    "절대",
    "절망",
    "절반",
    "절약",
    "절차",
    "점검",
    "점수",
    "점심",
    "점원",
    "점점",
    "점차",
    "접근",
    "접시",
    "접촉",
    "젓가락",
    "정거장",
    "정도",
    "정류장",
    "정리",
    "정말",
    "정면",
    "정문",
    "정반대",
    "정보",
    "정부",
    "정비",
    "정상",
    "정성",
    "정오",
    "정원",
    "정장",
    "정지",
    "정치",
    "정확히",
    "제공",
    "제과점",
    "제대로",
    "제목",
    "제발",
    "제법",
    "제삿날",
    "제안",
    "제일",
    "제작",
    "제주도",
    "제출",
    "제품",
    "제한",
    "조각",
    "조건",
    "조금",
    "조깅",
    "조명",
    "조미료",
    "조상",
    "조선",
    "조용히",
    "조절",
    "조정",
    "조직",
    "존댓말",
    "존재",
    "졸업",
    "졸음",
    "종교",
    "종로",
    "종류",
    "종소리",
    "종업원",
    "종종",
    "종합",
    "좌석",
    "죄인",
    "주관적",
    "주름",
    "주말",
    "주머니",
    "주먹",
    "주문",
    "주민",
    "주방",
    "주변",
    "주식",
    "주인",
    "주일",
    "주장",
    "주전자",
    "주택",
    "준비",
    "줄거리",
    "줄기",
    "줄무늬",
    "중간",
    "중계방송",
    "중국",
    "중년",
    "중단",
    "중독",
    "중반",
    "중부",
    "중세",
    "중소기업",
    "중순",
    "중앙",
    "중요",
    "중학교",
    "즉석",
    "즉시",
    "즐거움",
    "증가",
    "증거",
    "증권",
    "증상",
    "증세",
    "지각",
    "지갑",
    "지경",
    "지극히",
    "지금",
    "지급",
    "지능",
    "지름길",
    "지리산",
    "지방",
    "지붕",
    "지식",
    "지역",
    "지우개",
    "지원",
    "지적",
    "지점",
    "지진",
    "지출",
    "직선",
    "직업",
    "직원",
    "직장",
    "진급",
    "진동",
    "진로",
    "진료",
    "진리",
    "진짜",
    "진찰",
    "진출",
    "진통",
    "진행",
    "질문",
    "질병",
    "질서",
    "짐작",
    "집단",
    "집안",
    "집중",
    "짜증",
    "찌꺼기",
    "차남",
    "차라리",
    "차량",
    "차림",
    "차별",
    "차선",
    "차츰",
    "착각",
    "찬물",
    "찬성",
    "참가",
    "참기름",
    "참새",
    "참석",
    "참여",
    "참외",
    "참조",
    "찻잔",
    "창가",
    "창고",
    "창구",
    "창문",
    "창밖",
    "창작",
    "창조",
    "채널",
    "채점",
    "책가방",
    "책방",
    "책상",
    "책임",
    "챔피언",
    "처벌",
    "처음",
    "천국",
    "천둥",
    "천장",
    "천재",
    "천천히",
    "철도",
    "철저히",
    "철학",
    "첫날",
    "첫째",
    "청년",
    "청바지",
    "청소",
    "청춘",
    "체계",
    "체력",
    "체온",
    "체육",
    "체중",
    "체험",
    "초등학생",
    "초반",
    "초밥",
    "초상화",
    "초순",
    "초여름",
    "초원",
    "초저녁",
    "초점",
    "초청",
    "초콜릿",
    "촛불",
    "총각",
    "총리",
    "총장",
    "촬영",
    "최근",
    "최상",
    "최선",
    "최신",
    "최악",
    "최종",
    "추석",
    "추억",
    "추진",
    "추천",
    "추측",
    "축구",
    "축소",
    "축제",
    "축하",
    "출근",
    "출발",
    "출산",
    "출신",
    "출연",
    "출입",
    "출장",
    "출판",
    "충격",
    "충고",
    "충돌",
    "충분히",
    "충청도",
    "취업",
    "취직",
    "취향",
    "치약",
    "친구",
    "친척",
    "칠십",
    "칠월",
    "칠판",
    "침대",
    "침묵",
    "침실",
    "칫솔",
    "칭찬",
    "카메라",
    "카운터",
    "칼국수",
    "캐릭터",
    "캠퍼스",
    "캠페인",
    "커튼",
    "컨디션",
    "컬러",
    "컴퓨터",
    "코끼리",
    "코미디",
    "콘서트",
    "콜라",
    "콤플렉스",
    "콩나물",
    "쾌감",
    "쿠데타",
    "크림",
    "큰길",
    "큰딸",
    "큰소리",
    "큰아들",
    "큰어머니",
    "큰일",
    "큰절",
    "클래식",
    "클럽",
    "킬로",
    "타입",
    "타자기",
    "탁구",
    "탁자",
    "탄생",
    "태권도",
    "태양",
    "태풍",
    "택시",
    "탤런트",
    "터널",
    "터미널",
    "테니스",
    "테스트",
    "테이블",
    "텔레비전",
    "토론",
    "토마토",
    "토요일",
    "통계",
    "통과",
    "통로",
    "통신",
    "통역",
    "통일",
    "통장",
    "통제",
    "통증",
    "통합",
    "통화",
    "퇴근",
    "퇴원",
    "퇴직금",
    "튀김",
    "트럭",
    "특급",
    "특별",
    "특성",
    "특수",
    "특징",
    "특히",
    "튼튼히",
    "티셔츠",
    "파란색",
    "파일",
    "파출소",
    "판결",
    "판단",
    "판매",
    "판사",
    "팔십",
    "팔월",
    "팝송",
    "패션",
    "팩스",
    "팩시밀리",
    "팬티",
    "퍼센트",
    "페인트",
    "편견",
    "편의",
    "편지",
    "편히",
    "평가",
    "평균",
    "평생",
    "평소",
    "평양",
    "평일",
    "평화",
    "포스터",
    "포인트",
    "포장",
    "포함",
    "표면",
    "표정",
    "표준",
    "표현",
    "품목",
    "품질",
    "풍경",
    "풍속",
    "풍습",
    "프랑스",
    "프린터",
    "플라스틱",
    "피곤",
    "피망",
    "피아노",
    "필름",
    "필수",
    "필요",
    "필자",
    "필통",
    "핑계",
    "하느님",
    "하늘",
    "하드웨어",
    "하룻밤",
    "하반기",
    "하숙집",
    "하순",
    "하여튼",
    "하지만",
    "하천",
    "하품",
    "하필",
    "학과",
    "학교",
    "학급",
    "학기",
    "학년",
    "학력",
    "학번",
    "학부모",
    "학비",
    "학생",
    "학술",
    "학습",
    "학용품",
    "학원",
    "학위",
    "학자",
    "학점",
    "한계",
    "한글",
    "한꺼번에",
    "한낮",
    "한눈",
    "한동안",
    "한때",
    "한라산",
    "한마디",
    "한문",
    "한번",
    "한복",
    "한식",
    "한여름",
    "한쪽",
    "할머니",
    "할아버지",
    "할인",
    "함께",
    "함부로",
    "합격",
    "합리적",
    "항공",
    "항구",
    "항상",
    "항의",
    "해결",
    "해군",
    "해답",
    "해당",
    "해물",
    "해석",
    "해설",
    "해수욕장",
    "해안",
    "핵심",
    "핸드백",
    "햄버거",
    "햇볕",
    "햇살",
    "행동",
    "행복",
    "행사",
    "행운",
    "행위",
    "향기",
    "향상",
    "향수",
    "허락",
    "허용",
    "헬기",
    "현관",
    "현금",
    "현대",
    "현상",
    "현실",
    "현장",
    "현재",
    "현지",
    "혈액",
    "협력",
    "형부",
    "형사",
    "형수",
    "형식",
    "형제",
    "형태",
    "형편",
    "혜택",
    "호기심",
    "호남",
    "호랑이",
    "호박",
    "호텔",
    "호흡",
    "혹시",
    "홀로",
    "홈페이지",
    "홍보",
    "홍수",
    "홍차",
    "화면",
    "화분",
    "화살",
    "화요일",
    "화장",
    "화학",
    "확보",
    "확인",
    "확장",
    "확정",
    "환갑",
    "환경",
    "환영",
    "환율",
    "환자",
    "활기",
    "활동",
    "활발히",
    "활용",
    "활짝",
    "회견",
    "회관",
    "회복",
    "회색",
    "회원",
    "회장",
    "회전",
    "횟수",
    "횡단보도",
    "효율적",
    "후반",
    "후춧가루",
    "훈련",
    "훨씬",
    "휴식",
    "휴일",
    "흉내",
    "흐름",
    "흑백",
    "흑인",
    "흔적",
    "흔히",
    "흥미",
    "흥분",
    "희곡",
    "희망",
    "희생",
    "흰색",
    "힘껏"
]

},{}],31:[function(require,module,exports){
module.exports=[
    "abacate",
    "abaixo",
    "abalar",
    "abater",
    "abduzir",
    "abelha",
    "aberto",
    "abismo",
    "abotoar",
    "abranger",
    "abreviar",
    "abrigar",
    "abrupto",
    "absinto",
    "absoluto",
    "absurdo",
    "abutre",
    "acabado",
    "acalmar",
    "acampar",
    "acanhar",
    "acaso",
    "aceitar",
    "acelerar",
    "acenar",
    "acervo",
    "acessar",
    "acetona",
    "achatar",
    "acidez",
    "acima",
    "acionado",
    "acirrar",
    "aclamar",
    "aclive",
    "acolhida",
    "acomodar",
    "acoplar",
    "acordar",
    "acumular",
    "acusador",
    "adaptar",
    "adega",
    "adentro",
    "adepto",
    "adequar",
    "aderente",
    "adesivo",
    "adeus",
    "adiante",
    "aditivo",
    "adjetivo",
    "adjunto",
    "admirar",
    "adorar",
    "adquirir",
    "adubo",
    "adverso",
    "advogado",
    "aeronave",
    "afastar",
    "aferir",
    "afetivo",
    "afinador",
    "afivelar",
    "aflito",
    "afluente",
    "afrontar",
    "agachar",
    "agarrar",
    "agasalho",
    "agenciar",
    "agilizar",
    "agiota",
    "agitado",
    "agora",
    "agradar",
    "agreste",
    "agrupar",
    "aguardar",
    "agulha",
    "ajoelhar",
    "ajudar",
    "ajustar",
    "alameda",
    "alarme",
    "alastrar",
    "alavanca",
    "albergue",
    "albino",
    "alcatra",
    "aldeia",
    "alecrim",
    "alegria",
    "alertar",
    "alface",
    "alfinete",
    "algum",
    "alheio",
    "aliar",
    "alicate",
    "alienar",
    "alinhar",
    "aliviar",
    "almofada",
    "alocar",
    "alpiste",
    "alterar",
    "altitude",
    "alucinar",
    "alugar",
    "aluno",
    "alusivo",
    "alvo",
    "amaciar",
    "amador",
    "amarelo",
    "amassar",
    "ambas",
    "ambiente",
    "ameixa",
    "amenizar",
    "amido",
    "amistoso",
    "amizade",
    "amolador",
    "amontoar",
    "amoroso",
    "amostra",
    "amparar",
    "ampliar",
    "ampola",
    "anagrama",
    "analisar",
    "anarquia",
    "anatomia",
    "andaime",
    "anel",
    "anexo",
    "angular",
    "animar",
    "anjo",
    "anomalia",
    "anotado",
    "ansioso",
    "anterior",
    "anuidade",
    "anunciar",
    "anzol",
    "apagador",
    "apalpar",
    "apanhado",
    "apego",
    "apelido",
    "apertada",
    "apesar",
    "apetite",
    "apito",
    "aplauso",
    "aplicada",
    "apoio",
    "apontar",
    "aposta",
    "aprendiz",
    "aprovar",
    "aquecer",
    "arame",
    "aranha",
    "arara",
    "arcada",
    "ardente",
    "areia",
    "arejar",
    "arenito",
    "aresta",
    "argiloso",
    "argola",
    "arma",
    "arquivo",
    "arraial",
    "arrebate",
    "arriscar",
    "arroba",
    "arrumar",
    "arsenal",
    "arterial",
    "artigo",
    "arvoredo",
    "asfaltar",
    "asilado",
    "aspirar",
    "assador",
    "assinar",
    "assoalho",
    "assunto",
    "astral",
    "atacado",
    "atadura",
    "atalho",
    "atarefar",
    "atear",
    "atender",
    "aterro",
    "ateu",
    "atingir",
    "atirador",
    "ativo",
    "atoleiro",
    "atracar",
    "atrevido",
    "atriz",
    "atual",
    "atum",
    "auditor",
    "aumentar",
    "aura",
    "aurora",
    "autismo",
    "autoria",
    "autuar",
    "avaliar",
    "avante",
    "avaria",
    "avental",
    "avesso",
    "aviador",
    "avisar",
    "avulso",
    "axila",
    "azarar",
    "azedo",
    "azeite",
    "azulejo",
    "babar",
    "babosa",
    "bacalhau",
    "bacharel",
    "bacia",
    "bagagem",
    "baiano",
    "bailar",
    "baioneta",
    "bairro",
    "baixista",
    "bajular",
    "baleia",
    "baliza",
    "balsa",
    "banal",
    "bandeira",
    "banho",
    "banir",
    "banquete",
    "barato",
    "barbado",
    "baronesa",
    "barraca",
    "barulho",
    "baseado",
    "bastante",
    "batata",
    "batedor",
    "batida",
    "batom",
    "batucar",
    "baunilha",
    "beber",
    "beijo",
    "beirada",
    "beisebol",
    "beldade",
    "beleza",
    "belga",
    "beliscar",
    "bendito",
    "bengala",
    "benzer",
    "berimbau",
    "berlinda",
    "berro",
    "besouro",
    "bexiga",
    "bezerro",
    "bico",
    "bicudo",
    "bienal",
    "bifocal",
    "bifurcar",
    "bigorna",
    "bilhete",
    "bimestre",
    "bimotor",
    "biologia",
    "biombo",
    "biosfera",
    "bipolar",
    "birrento",
    "biscoito",
    "bisneto",
    "bispo",
    "bissexto",
    "bitola",
    "bizarro",
    "blindado",
    "bloco",
    "bloquear",
    "boato",
    "bobagem",
    "bocado",
    "bocejo",
    "bochecha",
    "boicotar",
    "bolada",
    "boletim",
    "bolha",
    "bolo",
    "bombeiro",
    "bonde",
    "boneco",
    "bonita",
    "borbulha",
    "borda",
    "boreal",
    "borracha",
    "bovino",
    "boxeador",
    "branco",
    "brasa",
    "braveza",
    "breu",
    "briga",
    "brilho",
    "brincar",
    "broa",
    "brochura",
    "bronzear",
    "broto",
    "bruxo",
    "bucha",
    "budismo",
    "bufar",
    "bule",
    "buraco",
    "busca",
    "busto",
    "buzina",
    "cabana",
    "cabelo",
    "cabide",
    "cabo",
    "cabrito",
    "cacau",
    "cacetada",
    "cachorro",
    "cacique",
    "cadastro",
    "cadeado",
    "cafezal",
    "caiaque",
    "caipira",
    "caixote",
    "cajado",
    "caju",
    "calafrio",
    "calcular",
    "caldeira",
    "calibrar",
    "calmante",
    "calota",
    "camada",
    "cambista",
    "camisa",
    "camomila",
    "campanha",
    "camuflar",
    "canavial",
    "cancelar",
    "caneta",
    "canguru",
    "canhoto",
    "canivete",
    "canoa",
    "cansado",
    "cantar",
    "canudo",
    "capacho",
    "capela",
    "capinar",
    "capotar",
    "capricho",
    "captador",
    "capuz",
    "caracol",
    "carbono",
    "cardeal",
    "careca",
    "carimbar",
    "carneiro",
    "carpete",
    "carreira",
    "cartaz",
    "carvalho",
    "casaco",
    "casca",
    "casebre",
    "castelo",
    "casulo",
    "catarata",
    "cativar",
    "caule",
    "causador",
    "cautelar",
    "cavalo",
    "caverna",
    "cebola",
    "cedilha",
    "cegonha",
    "celebrar",
    "celular",
    "cenoura",
    "censo",
    "centeio",
    "cercar",
    "cerrado",
    "certeiro",
    "cerveja",
    "cetim",
    "cevada",
    "chacota",
    "chaleira",
    "chamado",
    "chapada",
    "charme",
    "chatice",
    "chave",
    "chefe",
    "chegada",
    "cheiro",
    "cheque",
    "chicote",
    "chifre",
    "chinelo",
    "chocalho",
    "chover",
    "chumbo",
    "chutar",
    "chuva",
    "cicatriz",
    "ciclone",
    "cidade",
    "cidreira",
    "ciente",
    "cigana",
    "cimento",
    "cinto",
    "cinza",
    "ciranda",
    "circuito",
    "cirurgia",
    "citar",
    "clareza",
    "clero",
    "clicar",
    "clone",
    "clube",
    "coado",
    "coagir",
    "cobaia",
    "cobertor",
    "cobrar",
    "cocada",
    "coelho",
    "coentro",
    "coeso",
    "cogumelo",
    "coibir",
    "coifa",
    "coiote",
    "colar",
    "coleira",
    "colher",
    "colidir",
    "colmeia",
    "colono",
    "coluna",
    "comando",
    "combinar",
    "comentar",
    "comitiva",
    "comover",
    "complexo",
    "comum",
    "concha",
    "condor",
    "conectar",
    "confuso",
    "congelar",
    "conhecer",
    "conjugar",
    "consumir",
    "contrato",
    "convite",
    "cooperar",
    "copeiro",
    "copiador",
    "copo",
    "coquetel",
    "coragem",
    "cordial",
    "corneta",
    "coronha",
    "corporal",
    "correio",
    "cortejo",
    "coruja",
    "corvo",
    "cosseno",
    "costela",
    "cotonete",
    "couro",
    "couve",
    "covil",
    "cozinha",
    "cratera",
    "cravo",
    "creche",
    "credor",
    "creme",
    "crer",
    "crespo",
    "criada",
    "criminal",
    "crioulo",
    "crise",
    "criticar",
    "crosta",
    "crua",
    "cruzeiro",
    "cubano",
    "cueca",
    "cuidado",
    "cujo",
    "culatra",
    "culminar",
    "culpar",
    "cultura",
    "cumprir",
    "cunhado",
    "cupido",
    "curativo",
    "curral",
    "cursar",
    "curto",
    "cuspir",
    "custear",
    "cutelo",
    "damasco",
    "datar",
    "debater",
    "debitar",
    "deboche",
    "debulhar",
    "decalque",
    "decimal",
    "declive",
    "decote",
    "decretar",
    "dedal",
    "dedicado",
    "deduzir",
    "defesa",
    "defumar",
    "degelo",
    "degrau",
    "degustar",
    "deitado",
    "deixar",
    "delator",
    "delegado",
    "delinear",
    "delonga",
    "demanda",
    "demitir",
    "demolido",
    "dentista",
    "depenado",
    "depilar",
    "depois",
    "depressa",
    "depurar",
    "deriva",
    "derramar",
    "desafio",
    "desbotar",
    "descanso",
    "desenho",
    "desfiado",
    "desgaste",
    "desigual",
    "deslize",
    "desmamar",
    "desova",
    "despesa",
    "destaque",
    "desviar",
    "detalhar",
    "detentor",
    "detonar",
    "detrito",
    "deusa",
    "dever",
    "devido",
    "devotado",
    "dezena",
    "diagrama",
    "dialeto",
    "didata",
    "difuso",
    "digitar",
    "dilatado",
    "diluente",
    "diminuir",
    "dinastia",
    "dinheiro",
    "diocese",
    "direto",
    "discreta",
    "disfarce",
    "disparo",
    "disquete",
    "dissipar",
    "distante",
    "ditador",
    "diurno",
    "diverso",
    "divisor",
    "divulgar",
    "dizer",
    "dobrador",
    "dolorido",
    "domador",
    "dominado",
    "donativo",
    "donzela",
    "dormente",
    "dorsal",
    "dosagem",
    "dourado",
    "doutor",
    "drenagem",
    "drible",
    "drogaria",
    "duelar",
    "duende",
    "dueto",
    "duplo",
    "duquesa",
    "durante",
    "duvidoso",
    "eclodir",
    "ecoar",
    "ecologia",
    "edificar",
    "edital",
    "educado",
    "efeito",
    "efetivar",
    "ejetar",
    "elaborar",
    "eleger",
    "eleitor",
    "elenco",
    "elevador",
    "eliminar",
    "elogiar",
    "embargo",
    "embolado",
    "embrulho",
    "embutido",
    "emenda",
    "emergir",
    "emissor",
    "empatia",
    "empenho",
    "empinado",
    "empolgar",
    "emprego",
    "empurrar",
    "emulador",
    "encaixe",
    "encenado",
    "enchente",
    "encontro",
    "endeusar",
    "endossar",
    "enfaixar",
    "enfeite",
    "enfim",
    "engajado",
    "engenho",
    "englobar",
    "engomado",
    "engraxar",
    "enguia",
    "enjoar",
    "enlatar",
    "enquanto",
    "enraizar",
    "enrolado",
    "enrugar",
    "ensaio",
    "enseada",
    "ensino",
    "ensopado",
    "entanto",
    "enteado",
    "entidade",
    "entortar",
    "entrada",
    "entulho",
    "envergar",
    "enviado",
    "envolver",
    "enxame",
    "enxerto",
    "enxofre",
    "enxuto",
    "epiderme",
    "equipar",
    "ereto",
    "erguido",
    "errata",
    "erva",
    "ervilha",
    "esbanjar",
    "esbelto",
    "escama",
    "escola",
    "escrita",
    "escuta",
    "esfinge",
    "esfolar",
    "esfregar",
    "esfumado",
    "esgrima",
    "esmalte",
    "espanto",
    "espelho",
    "espiga",
    "esponja",
    "espreita",
    "espumar",
    "esquerda",
    "estaca",
    "esteira",
    "esticar",
    "estofado",
    "estrela",
    "estudo",
    "esvaziar",
    "etanol",
    "etiqueta",
    "euforia",
    "europeu",
    "evacuar",
    "evaporar",
    "evasivo",
    "eventual",
    "evidente",
    "evoluir",
    "exagero",
    "exalar",
    "examinar",
    "exato",
    "exausto",
    "excesso",
    "excitar",
    "exclamar",
    "executar",
    "exemplo",
    "exibir",
    "exigente",
    "exonerar",
    "expandir",
    "expelir",
    "expirar",
    "explanar",
    "exposto",
    "expresso",
    "expulsar",
    "externo",
    "extinto",
    "extrato",
    "fabricar",
    "fabuloso",
    "faceta",
    "facial",
    "fada",
    "fadiga",
    "faixa",
    "falar",
    "falta",
    "familiar",
    "fandango",
    "fanfarra",
    "fantoche",
    "fardado",
    "farelo",
    "farinha",
    "farofa",
    "farpa",
    "fartura",
    "fatia",
    "fator",
    "favorita",
    "faxina",
    "fazenda",
    "fechado",
    "feijoada",
    "feirante",
    "felino",
    "feminino",
    "fenda",
    "feno",
    "fera",
    "feriado",
    "ferrugem",
    "ferver",
    "festejar",
    "fetal",
    "feudal",
    "fiapo",
    "fibrose",
    "ficar",
    "ficheiro",
    "figurado",
    "fileira",
    "filho",
    "filme",
    "filtrar",
    "firmeza",
    "fisgada",
    "fissura",
    "fita",
    "fivela",
    "fixador",
    "fixo",
    "flacidez",
    "flamingo",
    "flanela",
    "flechada",
    "flora",
    "flutuar",
    "fluxo",
    "focal",
    "focinho",
    "fofocar",
    "fogo",
    "foguete",
    "foice",
    "folgado",
    "folheto",
    "forjar",
    "formiga",
    "forno",
    "forte",
    "fosco",
    "fossa",
    "fragata",
    "fralda",
    "frango",
    "frasco",
    "fraterno",
    "freira",
    "frente",
    "fretar",
    "frieza",
    "friso",
    "fritura",
    "fronha",
    "frustrar",
    "fruteira",
    "fugir",
    "fulano",
    "fuligem",
    "fundar",
    "fungo",
    "funil",
    "furador",
    "furioso",
    "futebol",
    "gabarito",
    "gabinete",
    "gado",
    "gaiato",
    "gaiola",
    "gaivota",
    "galega",
    "galho",
    "galinha",
    "galocha",
    "ganhar",
    "garagem",
    "garfo",
    "gargalo",
    "garimpo",
    "garoupa",
    "garrafa",
    "gasoduto",
    "gasto",
    "gata",
    "gatilho",
    "gaveta",
    "gazela",
    "gelado",
    "geleia",
    "gelo",
    "gemada",
    "gemer",
    "gemido",
    "generoso",
    "gengiva",
    "genial",
    "genoma",
    "genro",
    "geologia",
    "gerador",
    "germinar",
    "gesso",
    "gestor",
    "ginasta",
    "gincana",
    "gingado",
    "girafa",
    "girino",
    "glacial",
    "glicose",
    "global",
    "glorioso",
    "goela",
    "goiaba",
    "golfe",
    "golpear",
    "gordura",
    "gorjeta",
    "gorro",
    "gostoso",
    "goteira",
    "governar",
    "gracejo",
    "gradual",
    "grafite",
    "gralha",
    "grampo",
    "granada",
    "gratuito",
    "graveto",
    "graxa",
    "grego",
    "grelhar",
    "greve",
    "grilo",
    "grisalho",
    "gritaria",
    "grosso",
    "grotesco",
    "grudado",
    "grunhido",
    "gruta",
    "guache",
    "guarani",
    "guaxinim",
    "guerrear",
    "guiar",
    "guincho",
    "guisado",
    "gula",
    "guloso",
    "guru",
    "habitar",
    "harmonia",
    "haste",
    "haver",
    "hectare",
    "herdar",
    "heresia",
    "hesitar",
    "hiato",
    "hibernar",
    "hidratar",
    "hiena",
    "hino",
    "hipismo",
    "hipnose",
    "hipoteca",
    "hoje",
    "holofote",
    "homem",
    "honesto",
    "honrado",
    "hormonal",
    "hospedar",
    "humorado",
    "iate",
    "ideia",
    "idoso",
    "ignorado",
    "igreja",
    "iguana",
    "ileso",
    "ilha",
    "iludido",
    "iluminar",
    "ilustrar",
    "imagem",
    "imediato",
    "imenso",
    "imersivo",
    "iminente",
    "imitador",
    "imortal",
    "impacto",
    "impedir",
    "implante",
    "impor",
    "imprensa",
    "impune",
    "imunizar",
    "inalador",
    "inapto",
    "inativo",
    "incenso",
    "inchar",
    "incidir",
    "incluir",
    "incolor",
    "indeciso",
    "indireto",
    "indutor",
    "ineficaz",
    "inerente",
    "infantil",
    "infestar",
    "infinito",
    "inflamar",
    "informal",
    "infrator",
    "ingerir",
    "inibido",
    "inicial",
    "inimigo",
    "injetar",
    "inocente",
    "inodoro",
    "inovador",
    "inox",
    "inquieto",
    "inscrito",
    "inseto",
    "insistir",
    "inspetor",
    "instalar",
    "insulto",
    "intacto",
    "integral",
    "intimar",
    "intocado",
    "intriga",
    "invasor",
    "inverno",
    "invicto",
    "invocar",
    "iogurte",
    "iraniano",
    "ironizar",
    "irreal",
    "irritado",
    "isca",
    "isento",
    "isolado",
    "isqueiro",
    "italiano",
    "janeiro",
    "jangada",
    "janta",
    "jararaca",
    "jardim",
    "jarro",
    "jasmim",
    "jato",
    "javali",
    "jazida",
    "jejum",
    "joaninha",
    "joelhada",
    "jogador",
    "joia",
    "jornal",
    "jorrar",
    "jovem",
    "juba",
    "judeu",
    "judoca",
    "juiz",
    "julgador",
    "julho",
    "jurado",
    "jurista",
    "juro",
    "justa",
    "labareda",
    "laboral",
    "lacre",
    "lactante",
    "ladrilho",
    "lagarta",
    "lagoa",
    "laje",
    "lamber",
    "lamentar",
    "laminar",
    "lampejo",
    "lanche",
    "lapidar",
    "lapso",
    "laranja",
    "lareira",
    "largura",
    "lasanha",
    "lastro",
    "lateral",
    "latido",
    "lavanda",
    "lavoura",
    "lavrador",
    "laxante",
    "lazer",
    "lealdade",
    "lebre",
    "legado",
    "legendar",
    "legista",
    "leigo",
    "leiloar",
    "leitura",
    "lembrete",
    "leme",
    "lenhador",
    "lentilha",
    "leoa",
    "lesma",
    "leste",
    "letivo",
    "letreiro",
    "levar",
    "leveza",
    "levitar",
    "liberal",
    "libido",
    "liderar",
    "ligar",
    "ligeiro",
    "limitar",
    "limoeiro",
    "limpador",
    "linda",
    "linear",
    "linhagem",
    "liquidez",
    "listagem",
    "lisura",
    "litoral",
    "livro",
    "lixa",
    "lixeira",
    "locador",
    "locutor",
    "lojista",
    "lombo",
    "lona",
    "longe",
    "lontra",
    "lorde",
    "lotado",
    "loteria",
    "loucura",
    "lousa",
    "louvar",
    "luar",
    "lucidez",
    "lucro",
    "luneta",
    "lustre",
    "lutador",
    "luva",
    "macaco",
    "macete",
    "machado",
    "macio",
    "madeira",
    "madrinha",
    "magnata",
    "magreza",
    "maior",
    "mais",
    "malandro",
    "malha",
    "malote",
    "maluco",
    "mamilo",
    "mamoeiro",
    "mamute",
    "manada",
    "mancha",
    "mandato",
    "manequim",
    "manhoso",
    "manivela",
    "manobrar",
    "mansa",
    "manter",
    "manusear",
    "mapeado",
    "maquinar",
    "marcador",
    "maresia",
    "marfim",
    "margem",
    "marinho",
    "marmita",
    "maroto",
    "marquise",
    "marreco",
    "martelo",
    "marujo",
    "mascote",
    "masmorra",
    "massagem",
    "mastigar",
    "matagal",
    "materno",
    "matinal",
    "matutar",
    "maxilar",
    "medalha",
    "medida",
    "medusa",
    "megafone",
    "meiga",
    "melancia",
    "melhor",
    "membro",
    "memorial",
    "menino",
    "menos",
    "mensagem",
    "mental",
    "merecer",
    "mergulho",
    "mesada",
    "mesclar",
    "mesmo",
    "mesquita",
    "mestre",
    "metade",
    "meteoro",
    "metragem",
    "mexer",
    "mexicano",
    "micro",
    "migalha",
    "migrar",
    "milagre",
    "milenar",
    "milhar",
    "mimado",
    "minerar",
    "minhoca",
    "ministro",
    "minoria",
    "miolo",
    "mirante",
    "mirtilo",
    "misturar",
    "mocidade",
    "moderno",
    "modular",
    "moeda",
    "moer",
    "moinho",
    "moita",
    "moldura",
    "moleza",
    "molho",
    "molinete",
    "molusco",
    "montanha",
    "moqueca",
    "morango",
    "morcego",
    "mordomo",
    "morena",
    "mosaico",
    "mosquete",
    "mostarda",
    "motel",
    "motim",
    "moto",
    "motriz",
    "muda",
    "muito",
    "mulata",
    "mulher",
    "multar",
    "mundial",
    "munido",
    "muralha",
    "murcho",
    "muscular",
    "museu",
    "musical",
    "nacional",
    "nadador",
    "naja",
    "namoro",
    "narina",
    "narrado",
    "nascer",
    "nativa",
    "natureza",
    "navalha",
    "navegar",
    "navio",
    "neblina",
    "nebuloso",
    "negativa",
    "negociar",
    "negrito",
    "nervoso",
    "neta",
    "neural",
    "nevasca",
    "nevoeiro",
    "ninar",
    "ninho",
    "nitidez",
    "nivelar",
    "nobreza",
    "noite",
    "noiva",
    "nomear",
    "nominal",
    "nordeste",
    "nortear",
    "notar",
    "noticiar",
    "noturno",
    "novelo",
    "novilho",
    "novo",
    "nublado",
    "nudez",
    "numeral",
    "nupcial",
    "nutrir",
    "nuvem",
    "obcecado",
    "obedecer",
    "objetivo",
    "obrigado",
    "obscuro",
    "obstetra",
    "obter",
    "obturar",
    "ocidente",
    "ocioso",
    "ocorrer",
    "oculista",
    "ocupado",
    "ofegante",
    "ofensiva",
    "oferenda",
    "oficina",
    "ofuscado",
    "ogiva",
    "olaria",
    "oleoso",
    "olhar",
    "oliveira",
    "ombro",
    "omelete",
    "omisso",
    "omitir",
    "ondulado",
    "oneroso",
    "ontem",
    "opcional",
    "operador",
    "oponente",
    "oportuno",
    "oposto",
    "orar",
    "orbitar",
    "ordem",
    "ordinal",
    "orfanato",
    "orgasmo",
    "orgulho",
    "oriental",
    "origem",
    "oriundo",
    "orla",
    "ortodoxo",
    "orvalho",
    "oscilar",
    "ossada",
    "osso",
    "ostentar",
    "otimismo",
    "ousadia",
    "outono",
    "outubro",
    "ouvido",
    "ovelha",
    "ovular",
    "oxidar",
    "oxigenar",
    "pacato",
    "paciente",
    "pacote",
    "pactuar",
    "padaria",
    "padrinho",
    "pagar",
    "pagode",
    "painel",
    "pairar",
    "paisagem",
    "palavra",
    "palestra",
    "palheta",
    "palito",
    "palmada",
    "palpitar",
    "pancada",
    "panela",
    "panfleto",
    "panqueca",
    "pantanal",
    "papagaio",
    "papelada",
    "papiro",
    "parafina",
    "parcial",
    "pardal",
    "parede",
    "partida",
    "pasmo",
    "passado",
    "pastel",
    "patamar",
    "patente",
    "patinar",
    "patrono",
    "paulada",
    "pausar",
    "peculiar",
    "pedalar",
    "pedestre",
    "pediatra",
    "pedra",
    "pegada",
    "peitoral",
    "peixe",
    "pele",
    "pelicano",
    "penca",
    "pendurar",
    "peneira",
    "penhasco",
    "pensador",
    "pente",
    "perceber",
    "perfeito",
    "pergunta",
    "perito",
    "permitir",
    "perna",
    "perplexo",
    "persiana",
    "pertence",
    "peruca",
    "pescado",
    "pesquisa",
    "pessoa",
    "petiscar",
    "piada",
    "picado",
    "piedade",
    "pigmento",
    "pilastra",
    "pilhado",
    "pilotar",
    "pimenta",
    "pincel",
    "pinguim",
    "pinha",
    "pinote",
    "pintar",
    "pioneiro",
    "pipoca",
    "piquete",
    "piranha",
    "pires",
    "pirueta",
    "piscar",
    "pistola",
    "pitanga",
    "pivete",
    "planta",
    "plaqueta",
    "platina",
    "plebeu",
    "plumagem",
    "pluvial",
    "pneu",
    "poda",
    "poeira",
    "poetisa",
    "polegada",
    "policiar",
    "poluente",
    "polvilho",
    "pomar",
    "pomba",
    "ponderar",
    "pontaria",
    "populoso",
    "porta",
    "possuir",
    "postal",
    "pote",
    "poupar",
    "pouso",
    "povoar",
    "praia",
    "prancha",
    "prato",
    "praxe",
    "prece",
    "predador",
    "prefeito",
    "premiar",
    "prensar",
    "preparar",
    "presilha",
    "pretexto",
    "prevenir",
    "prezar",
    "primata",
    "princesa",
    "prisma",
    "privado",
    "processo",
    "produto",
    "profeta",
    "proibido",
    "projeto",
    "prometer",
    "propagar",
    "prosa",
    "protetor",
    "provador",
    "publicar",
    "pudim",
    "pular",
    "pulmonar",
    "pulseira",
    "punhal",
    "punir",
    "pupilo",
    "pureza",
    "puxador",
    "quadra",
    "quantia",
    "quarto",
    "quase",
    "quebrar",
    "queda",
    "queijo",
    "quente",
    "querido",
    "quimono",
    "quina",
    "quiosque",
    "rabanada",
    "rabisco",
    "rachar",
    "racionar",
    "radial",
    "raiar",
    "rainha",
    "raio",
    "raiva",
    "rajada",
    "ralado",
    "ramal",
    "ranger",
    "ranhura",
    "rapadura",
    "rapel",
    "rapidez",
    "raposa",
    "raquete",
    "raridade",
    "rasante",
    "rascunho",
    "rasgar",
    "raspador",
    "rasteira",
    "rasurar",
    "ratazana",
    "ratoeira",
    "realeza",
    "reanimar",
    "reaver",
    "rebaixar",
    "rebelde",
    "rebolar",
    "recado",
    "recente",
    "recheio",
    "recibo",
    "recordar",
    "recrutar",
    "recuar",
    "rede",
    "redimir",
    "redonda",
    "reduzida",
    "reenvio",
    "refinar",
    "refletir",
    "refogar",
    "refresco",
    "refugiar",
    "regalia",
    "regime",
    "regra",
    "reinado",
    "reitor",
    "rejeitar",
    "relativo",
    "remador",
    "remendo",
    "remorso",
    "renovado",
    "reparo",
    "repelir",
    "repleto",
    "repolho",
    "represa",
    "repudiar",
    "requerer",
    "resenha",
    "resfriar",
    "resgatar",
    "residir",
    "resolver",
    "respeito",
    "ressaca",
    "restante",
    "resumir",
    "retalho",
    "reter",
    "retirar",
    "retomada",
    "retratar",
    "revelar",
    "revisor",
    "revolta",
    "riacho",
    "rica",
    "rigidez",
    "rigoroso",
    "rimar",
    "ringue",
    "risada",
    "risco",
    "risonho",
    "robalo",
    "rochedo",
    "rodada",
    "rodeio",
    "rodovia",
    "roedor",
    "roleta",
    "romano",
    "roncar",
    "rosado",
    "roseira",
    "rosto",
    "rota",
    "roteiro",
    "rotina",
    "rotular",
    "rouco",
    "roupa",
    "roxo",
    "rubro",
    "rugido",
    "rugoso",
    "ruivo",
    "rumo",
    "rupestre",
    "russo",
    "sabor",
    "saciar",
    "sacola",
    "sacudir",
    "sadio",
    "safira",
    "saga",
    "sagrada",
    "saibro",
    "salada",
    "saleiro",
    "salgado",
    "saliva",
    "salpicar",
    "salsicha",
    "saltar",
    "salvador",
    "sambar",
    "samurai",
    "sanar",
    "sanfona",
    "sangue",
    "sanidade",
    "sapato",
    "sarda",
    "sargento",
    "sarjeta",
    "saturar",
    "saudade",
    "saxofone",
    "sazonal",
    "secar",
    "secular",
    "seda",
    "sedento",
    "sediado",
    "sedoso",
    "sedutor",
    "segmento",
    "segredo",
    "segundo",
    "seiva",
    "seleto",
    "selvagem",
    "semanal",
    "semente",
    "senador",
    "senhor",
    "sensual",
    "sentado",
    "separado",
    "sereia",
    "seringa",
    "serra",
    "servo",
    "setembro",
    "setor",
    "sigilo",
    "silhueta",
    "silicone",
    "simetria",
    "simpatia",
    "simular",
    "sinal",
    "sincero",
    "singular",
    "sinopse",
    "sintonia",
    "sirene",
    "siri",
    "situado",
    "soberano",
    "sobra",
    "socorro",
    "sogro",
    "soja",
    "solda",
    "soletrar",
    "solteiro",
    "sombrio",
    "sonata",
    "sondar",
    "sonegar",
    "sonhador",
    "sono",
    "soprano",
    "soquete",
    "sorrir",
    "sorteio",
    "sossego",
    "sotaque",
    "soterrar",
    "sovado",
    "sozinho",
    "suavizar",
    "subida",
    "submerso",
    "subsolo",
    "subtrair",
    "sucata",
    "sucesso",
    "suco",
    "sudeste",
    "sufixo",
    "sugador",
    "sugerir",
    "sujeito",
    "sulfato",
    "sumir",
    "suor",
    "superior",
    "suplicar",
    "suposto",
    "suprimir",
    "surdina",
    "surfista",
    "surpresa",
    "surreal",
    "surtir",
    "suspiro",
    "sustento",
    "tabela",
    "tablete",
    "tabuada",
    "tacho",
    "tagarela",
    "talher",
    "talo",
    "talvez",
    "tamanho",
    "tamborim",
    "tampa",
    "tangente",
    "tanto",
    "tapar",
    "tapioca",
    "tardio",
    "tarefa",
    "tarja",
    "tarraxa",
    "tatuagem",
    "taurino",
    "taxativo",
    "taxista",
    "teatral",
    "tecer",
    "tecido",
    "teclado",
    "tedioso",
    "teia",
    "teimar",
    "telefone",
    "telhado",
    "tempero",
    "tenente",
    "tensor",
    "tentar",
    "termal",
    "terno",
    "terreno",
    "tese",
    "tesoura",
    "testado",
    "teto",
    "textura",
    "texugo",
    "tiara",
    "tigela",
    "tijolo",
    "timbrar",
    "timidez",
    "tingido",
    "tinteiro",
    "tiragem",
    "titular",
    "toalha",
    "tocha",
    "tolerar",
    "tolice",
    "tomada",
    "tomilho",
    "tonel",
    "tontura",
    "topete",
    "tora",
    "torcido",
    "torneio",
    "torque",
    "torrada",
    "torto",
    "tostar",
    "touca",
    "toupeira",
    "toxina",
    "trabalho",
    "tracejar",
    "tradutor",
    "trafegar",
    "trajeto",
    "trama",
    "trancar",
    "trapo",
    "traseiro",
    "tratador",
    "travar",
    "treino",
    "tremer",
    "trepidar",
    "trevo",
    "triagem",
    "tribo",
    "triciclo",
    "tridente",
    "trilogia",
    "trindade",
    "triplo",
    "triturar",
    "triunfal",
    "trocar",
    "trombeta",
    "trova",
    "trunfo",
    "truque",
    "tubular",
    "tucano",
    "tudo",
    "tulipa",
    "tupi",
    "turbo",
    "turma",
    "turquesa",
    "tutelar",
    "tutorial",
    "uivar",
    "umbigo",
    "unha",
    "unidade",
    "uniforme",
    "urologia",
    "urso",
    "urtiga",
    "urubu",
    "usado",
    "usina",
    "usufruir",
    "vacina",
    "vadiar",
    "vagaroso",
    "vaidoso",
    "vala",
    "valente",
    "validade",
    "valores",
    "vantagem",
    "vaqueiro",
    "varanda",
    "vareta",
    "varrer",
    "vascular",
    "vasilha",
    "vassoura",
    "vazar",
    "vazio",
    "veado",
    "vedar",
    "vegetar",
    "veicular",
    "veleiro",
    "velhice",
    "veludo",
    "vencedor",
    "vendaval",
    "venerar",
    "ventre",
    "verbal",
    "verdade",
    "vereador",
    "vergonha",
    "vermelho",
    "verniz",
    "versar",
    "vertente",
    "vespa",
    "vestido",
    "vetorial",
    "viaduto",
    "viagem",
    "viajar",
    "viatura",
    "vibrador",
    "videira",
    "vidraria",
    "viela",
    "viga",
    "vigente",
    "vigiar",
    "vigorar",
    "vilarejo",
    "vinco",
    "vinheta",
    "vinil",
    "violeta",
    "virada",
    "virtude",
    "visitar",
    "visto",
    "vitral",
    "viveiro",
    "vizinho",
    "voador",
    "voar",
    "vogal",
    "volante",
    "voleibol",
    "voltagem",
    "volumoso",
    "vontade",
    "vulto",
    "vuvuzela",
    "xadrez",
    "xarope",
    "xeque",
    "xeretar",
    "xerife",
    "xingar",
    "zangado",
    "zarpar",
    "zebu",
    "zelador",
    "zombar",
    "zoologia",
    "zumbido"
]

},{}],32:[function(require,module,exports){
module.exports=[
    "ábaco",
    "abdomen",
    "abeja",
    "abierto",
    "abogado",
    "abono",
    "aborto",
    "abrazo",
    "abrir",
    "abuelo",
    "abuso",
    "acabar",
    "academia",
    "acceso",
    "acción",
    "aceite",
    "acelga",
    "acento",
    "aceptar",
    "ácido",
    "aclarar",
    "acné",
    "acoger",
    "acoso",
    "activo",
    "acto",
    "actriz",
    "actuar",
    "acudir",
    "acuerdo",
    "acusar",
    "adicto",
    "admitir",
    "adoptar",
    "adorno",
    "aduana",
    "adulto",
    "aéreo",
    "afectar",
    "afición",
    "afinar",
    "afirmar",
    "ágil",
    "agitar",
    "agonía",
    "agosto",
    "agotar",
    "agregar",
    "agrio",
    "agua",
    "agudo",
    "águila",
    "aguja",
    "ahogo",
    "ahorro",
    "aire",
    "aislar",
    "ajedrez",
    "ajeno",
    "ajuste",
    "alacrán",
    "alambre",
    "alarma",
    "alba",
    "álbum",
    "alcalde",
    "aldea",
    "alegre",
    "alejar",
    "alerta",
    "aleta",
    "alfiler",
    "alga",
    "algodón",
    "aliado",
    "aliento",
    "alivio",
    "alma",
    "almeja",
    "almíbar",
    "altar",
    "alteza",
    "altivo",
    "alto",
    "altura",
    "alumno",
    "alzar",
    "amable",
    "amante",
    "amapola",
    "amargo",
    "amasar",
    "ámbar",
    "ámbito",
    "ameno",
    "amigo",
    "amistad",
    "amor",
    "amparo",
    "amplio",
    "ancho",
    "anciano",
    "ancla",
    "andar",
    "andén",
    "anemia",
    "ángulo",
    "anillo",
    "ánimo",
    "anís",
    "anotar",
    "antena",
    "antiguo",
    "antojo",
    "anual",
    "anular",
    "anuncio",
    "añadir",
    "añejo",
    "año",
    "apagar",
    "aparato",
    "apetito",
    "apio",
    "aplicar",
    "apodo",
    "aporte",
    "apoyo",
    "aprender",
    "aprobar",
    "apuesta",
    "apuro",
    "arado",
    "araña",
    "arar",
    "árbitro",
    "árbol",
    "arbusto",
    "archivo",
    "arco",
    "arder",
    "ardilla",
    "arduo",
    "área",
    "árido",
    "aries",
    "armonía",
    "arnés",
    "aroma",
    "arpa",
    "arpón",
    "arreglo",
    "arroz",
    "arruga",
    "arte",
    "artista",
    "asa",
    "asado",
    "asalto",
    "ascenso",
    "asegurar",
    "aseo",
    "asesor",
    "asiento",
    "asilo",
    "asistir",
    "asno",
    "asombro",
    "áspero",
    "astilla",
    "astro",
    "astuto",
    "asumir",
    "asunto",
    "atajo",
    "ataque",
    "atar",
    "atento",
    "ateo",
    "ático",
    "atleta",
    "átomo",
    "atraer",
    "atroz",
    "atún",
    "audaz",
    "audio",
    "auge",
    "aula",
    "aumento",
    "ausente",
    "autor",
    "aval",
    "avance",
    "avaro",
    "ave",
    "avellana",
    "avena",
    "avestruz",
    "avión",
    "aviso",
    "ayer",
    "ayuda",
    "ayuno",
    "azafrán",
    "azar",
    "azote",
    "azúcar",
    "azufre",
    "azul",
    "baba",
    "babor",
    "bache",
    "bahía",
    "baile",
    "bajar",
    "balanza",
    "balcón",
    "balde",
    "bambú",
    "banco",
    "banda",
    "baño",
    "barba",
    "barco",
    "barniz",
    "barro",
    "báscula",
    "bastón",
    "basura",
    "batalla",
    "batería",
    "batir",
    "batuta",
    "baúl",
    "bazar",
    "bebé",
    "bebida",
    "bello",
    "besar",
    "beso",
    "bestia",
    "bicho",
    "bien",
    "bingo",
    "blanco",
    "bloque",
    "blusa",
    "boa",
    "bobina",
    "bobo",
    "boca",
    "bocina",
    "boda",
    "bodega",
    "boina",
    "bola",
    "bolero",
    "bolsa",
    "bomba",
    "bondad",
    "bonito",
    "bono",
    "bonsái",
    "borde",
    "borrar",
    "bosque",
    "bote",
    "botín",
    "bóveda",
    "bozal",
    "bravo",
    "brazo",
    "brecha",
    "breve",
    "brillo",
    "brinco",
    "brisa",
    "broca",
    "broma",
    "bronce",
    "brote",
    "bruja",
    "brusco",
    "bruto",
    "buceo",
    "bucle",
    "bueno",
    "buey",
    "bufanda",
    "bufón",
    "búho",
    "buitre",
    "bulto",
    "burbuja",
    "burla",
    "burro",
    "buscar",
    "butaca",
    "buzón",
    "caballo",
    "cabeza",
    "cabina",
    "cabra",
    "cacao",
    "cadáver",
    "cadena",
    "caer",
    "café",
    "caída",
    "caimán",
    "caja",
    "cajón",
    "cal",
    "calamar",
    "calcio",
    "caldo",
    "calidad",
    "calle",
    "calma",
    "calor",
    "calvo",
    "cama",
    "cambio",
    "camello",
    "camino",
    "campo",
    "cáncer",
    "candil",
    "canela",
    "canguro",
    "canica",
    "canto",
    "caña",
    "cañón",
    "caoba",
    "caos",
    "capaz",
    "capitán",
    "capote",
    "captar",
    "capucha",
    "cara",
    "carbón",
    "cárcel",
    "careta",
    "carga",
    "cariño",
    "carne",
    "carpeta",
    "carro",
    "carta",
    "casa",
    "casco",
    "casero",
    "caspa",
    "castor",
    "catorce",
    "catre",
    "caudal",
    "causa",
    "cazo",
    "cebolla",
    "ceder",
    "cedro",
    "celda",
    "célebre",
    "celoso",
    "célula",
    "cemento",
    "ceniza",
    "centro",
    "cerca",
    "cerdo",
    "cereza",
    "cero",
    "cerrar",
    "certeza",
    "césped",
    "cetro",
    "chacal",
    "chaleco",
    "champú",
    "chancla",
    "chapa",
    "charla",
    "chico",
    "chiste",
    "chivo",
    "choque",
    "choza",
    "chuleta",
    "chupar",
    "ciclón",
    "ciego",
    "cielo",
    "cien",
    "cierto",
    "cifra",
    "cigarro",
    "cima",
    "cinco",
    "cine",
    "cinta",
    "ciprés",
    "circo",
    "ciruela",
    "cisne",
    "cita",
    "ciudad",
    "clamor",
    "clan",
    "claro",
    "clase",
    "clave",
    "cliente",
    "clima",
    "clínica",
    "cobre",
    "cocción",
    "cochino",
    "cocina",
    "coco",
    "código",
    "codo",
    "cofre",
    "coger",
    "cohete",
    "cojín",
    "cojo",
    "cola",
    "colcha",
    "colegio",
    "colgar",
    "colina",
    "collar",
    "colmo",
    "columna",
    "combate",
    "comer",
    "comida",
    "cómodo",
    "compra",
    "conde",
    "conejo",
    "conga",
    "conocer",
    "consejo",
    "contar",
    "copa",
    "copia",
    "corazón",
    "corbata",
    "corcho",
    "cordón",
    "corona",
    "correr",
    "coser",
    "cosmos",
    "costa",
    "cráneo",
    "cráter",
    "crear",
    "crecer",
    "creído",
    "crema",
    "cría",
    "crimen",
    "cripta",
    "crisis",
    "cromo",
    "crónica",
    "croqueta",
    "crudo",
    "cruz",
    "cuadro",
    "cuarto",
    "cuatro",
    "cubo",
    "cubrir",
    "cuchara",
    "cuello",
    "cuento",
    "cuerda",
    "cuesta",
    "cueva",
    "cuidar",
    "culebra",
    "culpa",
    "culto",
    "cumbre",
    "cumplir",
    "cuna",
    "cuneta",
    "cuota",
    "cupón",
    "cúpula",
    "curar",
    "curioso",
    "curso",
    "curva",
    "cutis",
    "dama",
    "danza",
    "dar",
    "dardo",
    "dátil",
    "deber",
    "débil",
    "década",
    "decir",
    "dedo",
    "defensa",
    "definir",
    "dejar",
    "delfín",
    "delgado",
    "delito",
    "demora",
    "denso",
    "dental",
    "deporte",
    "derecho",
    "derrota",
    "desayuno",
    "deseo",
    "desfile",
    "desnudo",
    "destino",
    "desvío",
    "detalle",
    "detener",
    "deuda",
    "día",
    "diablo",
    "diadema",
    "diamante",
    "diana",
    "diario",
    "dibujo",
    "dictar",
    "diente",
    "dieta",
    "diez",
    "difícil",
    "digno",
    "dilema",
    "diluir",
    "dinero",
    "directo",
    "dirigir",
    "disco",
    "diseño",
    "disfraz",
    "diva",
    "divino",
    "doble",
    "doce",
    "dolor",
    "domingo",
    "don",
    "donar",
    "dorado",
    "dormir",
    "dorso",
    "dos",
    "dosis",
    "dragón",
    "droga",
    "ducha",
    "duda",
    "duelo",
    "dueño",
    "dulce",
    "dúo",
    "duque",
    "durar",
    "dureza",
    "duro",
    "ébano",
    "ebrio",
    "echar",
    "eco",
    "ecuador",
    "edad",
    "edición",
    "edificio",
    "editor",
    "educar",
    "efecto",
    "eficaz",
    "eje",
    "ejemplo",
    "elefante",
    "elegir",
    "elemento",
    "elevar",
    "elipse",
    "élite",
    "elixir",
    "elogio",
    "eludir",
    "embudo",
    "emitir",
    "emoción",
    "empate",
    "empeño",
    "empleo",
    "empresa",
    "enano",
    "encargo",
    "enchufe",
    "encía",
    "enemigo",
    "enero",
    "enfado",
    "enfermo",
    "engaño",
    "enigma",
    "enlace",
    "enorme",
    "enredo",
    "ensayo",
    "enseñar",
    "entero",
    "entrar",
    "envase",
    "envío",
    "época",
    "equipo",
    "erizo",
    "escala",
    "escena",
    "escolar",
    "escribir",
    "escudo",
    "esencia",
    "esfera",
    "esfuerzo",
    "espada",
    "espejo",
    "espía",
    "esposa",
    "espuma",
    "esquí",
    "estar",
    "este",
    "estilo",
    "estufa",
    "etapa",
    "eterno",
    "ética",
    "etnia",
    "evadir",
    "evaluar",
    "evento",
    "evitar",
    "exacto",
    "examen",
    "exceso",
    "excusa",
    "exento",
    "exigir",
    "exilio",
    "existir",
    "éxito",
    "experto",
    "explicar",
    "exponer",
    "extremo",
    "fábrica",
    "fábula",
    "fachada",
    "fácil",
    "factor",
    "faena",
    "faja",
    "falda",
    "fallo",
    "falso",
    "faltar",
    "fama",
    "familia",
    "famoso",
    "faraón",
    "farmacia",
    "farol",
    "farsa",
    "fase",
    "fatiga",
    "fauna",
    "favor",
    "fax",
    "febrero",
    "fecha",
    "feliz",
    "feo",
    "feria",
    "feroz",
    "fértil",
    "fervor",
    "festín",
    "fiable",
    "fianza",
    "fiar",
    "fibra",
    "ficción",
    "ficha",
    "fideo",
    "fiebre",
    "fiel",
    "fiera",
    "fiesta",
    "figura",
    "fijar",
    "fijo",
    "fila",
    "filete",
    "filial",
    "filtro",
    "fin",
    "finca",
    "fingir",
    "finito",
    "firma",
    "flaco",
    "flauta",
    "flecha",
    "flor",
    "flota",
    "fluir",
    "flujo",
    "flúor",
    "fobia",
    "foca",
    "fogata",
    "fogón",
    "folio",
    "folleto",
    "fondo",
    "forma",
    "forro",
    "fortuna",
    "forzar",
    "fosa",
    "foto",
    "fracaso",
    "frágil",
    "franja",
    "frase",
    "fraude",
    "freír",
    "freno",
    "fresa",
    "frío",
    "frito",
    "fruta",
    "fuego",
    "fuente",
    "fuerza",
    "fuga",
    "fumar",
    "función",
    "funda",
    "furgón",
    "furia",
    "fusil",
    "fútbol",
    "futuro",
    "gacela",
    "gafas",
    "gaita",
    "gajo",
    "gala",
    "galería",
    "gallo",
    "gamba",
    "ganar",
    "gancho",
    "ganga",
    "ganso",
    "garaje",
    "garza",
    "gasolina",
    "gastar",
    "gato",
    "gavilán",
    "gemelo",
    "gemir",
    "gen",
    "género",
    "genio",
    "gente",
    "geranio",
    "gerente",
    "germen",
    "gesto",
    "gigante",
    "gimnasio",
    "girar",
    "giro",
    "glaciar",
    "globo",
    "gloria",
    "gol",
    "golfo",
    "goloso",
    "golpe",
    "goma",
    "gordo",
    "gorila",
    "gorra",
    "gota",
    "goteo",
    "gozar",
    "grada",
    "gráfico",
    "grano",
    "grasa",
    "gratis",
    "grave",
    "grieta",
    "grillo",
    "gripe",
    "gris",
    "grito",
    "grosor",
    "grúa",
    "grueso",
    "grumo",
    "grupo",
    "guante",
    "guapo",
    "guardia",
    "guerra",
    "guía",
    "guiño",
    "guion",
    "guiso",
    "guitarra",
    "gusano",
    "gustar",
    "haber",
    "hábil",
    "hablar",
    "hacer",
    "hacha",
    "hada",
    "hallar",
    "hamaca",
    "harina",
    "haz",
    "hazaña",
    "hebilla",
    "hebra",
    "hecho",
    "helado",
    "helio",
    "hembra",
    "herir",
    "hermano",
    "héroe",
    "hervir",
    "hielo",
    "hierro",
    "hígado",
    "higiene",
    "hijo",
    "himno",
    "historia",
    "hocico",
    "hogar",
    "hoguera",
    "hoja",
    "hombre",
    "hongo",
    "honor",
    "honra",
    "hora",
    "hormiga",
    "horno",
    "hostil",
    "hoyo",
    "hueco",
    "huelga",
    "huerta",
    "hueso",
    "huevo",
    "huida",
    "huir",
    "humano",
    "húmedo",
    "humilde",
    "humo",
    "hundir",
    "huracán",
    "hurto",
    "icono",
    "ideal",
    "idioma",
    "ídolo",
    "iglesia",
    "iglú",
    "igual",
    "ilegal",
    "ilusión",
    "imagen",
    "imán",
    "imitar",
    "impar",
    "imperio",
    "imponer",
    "impulso",
    "incapaz",
    "índice",
    "inerte",
    "infiel",
    "informe",
    "ingenio",
    "inicio",
    "inmenso",
    "inmune",
    "innato",
    "insecto",
    "instante",
    "interés",
    "íntimo",
    "intuir",
    "inútil",
    "invierno",
    "ira",
    "iris",
    "ironía",
    "isla",
    "islote",
    "jabalí",
    "jabón",
    "jamón",
    "jarabe",
    "jardín",
    "jarra",
    "jaula",
    "jazmín",
    "jefe",
    "jeringa",
    "jinete",
    "jornada",
    "joroba",
    "joven",
    "joya",
    "juerga",
    "jueves",
    "juez",
    "jugador",
    "jugo",
    "juguete",
    "juicio",
    "junco",
    "jungla",
    "junio",
    "juntar",
    "júpiter",
    "jurar",
    "justo",
    "juvenil",
    "juzgar",
    "kilo",
    "koala",
    "labio",
    "lacio",
    "lacra",
    "lado",
    "ladrón",
    "lagarto",
    "lágrima",
    "laguna",
    "laico",
    "lamer",
    "lámina",
    "lámpara",
    "lana",
    "lancha",
    "langosta",
    "lanza",
    "lápiz",
    "largo",
    "larva",
    "lástima",
    "lata",
    "látex",
    "latir",
    "laurel",
    "lavar",
    "lazo",
    "leal",
    "lección",
    "leche",
    "lector",
    "leer",
    "legión",
    "legumbre",
    "lejano",
    "lengua",
    "lento",
    "leña",
    "león",
    "leopardo",
    "lesión",
    "letal",
    "letra",
    "leve",
    "leyenda",
    "libertad",
    "libro",
    "licor",
    "líder",
    "lidiar",
    "lienzo",
    "liga",
    "ligero",
    "lima",
    "límite",
    "limón",
    "limpio",
    "lince",
    "lindo",
    "línea",
    "lingote",
    "lino",
    "linterna",
    "líquido",
    "liso",
    "lista",
    "litera",
    "litio",
    "litro",
    "llaga",
    "llama",
    "llanto",
    "llave",
    "llegar",
    "llenar",
    "llevar",
    "llorar",
    "llover",
    "lluvia",
    "lobo",
    "loción",
    "loco",
    "locura",
    "lógica",
    "logro",
    "lombriz",
    "lomo",
    "lonja",
    "lote",
    "lucha",
    "lucir",
    "lugar",
    "lujo",
    "luna",
    "lunes",
    "lupa",
    "lustro",
    "luto",
    "luz",
    "maceta",
    "macho",
    "madera",
    "madre",
    "maduro",
    "maestro",
    "mafia",
    "magia",
    "mago",
    "maíz",
    "maldad",
    "maleta",
    "malla",
    "malo",
    "mamá",
    "mambo",
    "mamut",
    "manco",
    "mando",
    "manejar",
    "manga",
    "maniquí",
    "manjar",
    "mano",
    "manso",
    "manta",
    "mañana",
    "mapa",
    "máquina",
    "mar",
    "marco",
    "marea",
    "marfil",
    "margen",
    "marido",
    "mármol",
    "marrón",
    "martes",
    "marzo",
    "masa",
    "máscara",
    "masivo",
    "matar",
    "materia",
    "matiz",
    "matriz",
    "máximo",
    "mayor",
    "mazorca",
    "mecha",
    "medalla",
    "medio",
    "médula",
    "mejilla",
    "mejor",
    "melena",
    "melón",
    "memoria",
    "menor",
    "mensaje",
    "mente",
    "menú",
    "mercado",
    "merengue",
    "mérito",
    "mes",
    "mesón",
    "meta",
    "meter",
    "método",
    "metro",
    "mezcla",
    "miedo",
    "miel",
    "miembro",
    "miga",
    "mil",
    "milagro",
    "militar",
    "millón",
    "mimo",
    "mina",
    "minero",
    "mínimo",
    "minuto",
    "miope",
    "mirar",
    "misa",
    "miseria",
    "misil",
    "mismo",
    "mitad",
    "mito",
    "mochila",
    "moción",
    "moda",
    "modelo",
    "moho",
    "mojar",
    "molde",
    "moler",
    "molino",
    "momento",
    "momia",
    "monarca",
    "moneda",
    "monja",
    "monto",
    "moño",
    "morada",
    "morder",
    "moreno",
    "morir",
    "morro",
    "morsa",
    "mortal",
    "mosca",
    "mostrar",
    "motivo",
    "mover",
    "móvil",
    "mozo",
    "mucho",
    "mudar",
    "mueble",
    "muela",
    "muerte",
    "muestra",
    "mugre",
    "mujer",
    "mula",
    "muleta",
    "multa",
    "mundo",
    "muñeca",
    "mural",
    "muro",
    "músculo",
    "museo",
    "musgo",
    "música",
    "muslo",
    "nácar",
    "nación",
    "nadar",
    "naipe",
    "naranja",
    "nariz",
    "narrar",
    "nasal",
    "natal",
    "nativo",
    "natural",
    "náusea",
    "naval",
    "nave",
    "navidad",
    "necio",
    "néctar",
    "negar",
    "negocio",
    "negro",
    "neón",
    "nervio",
    "neto",
    "neutro",
    "nevar",
    "nevera",
    "nicho",
    "nido",
    "niebla",
    "nieto",
    "niñez",
    "niño",
    "nítido",
    "nivel",
    "nobleza",
    "noche",
    "nómina",
    "noria",
    "norma",
    "norte",
    "nota",
    "noticia",
    "novato",
    "novela",
    "novio",
    "nube",
    "nuca",
    "núcleo",
    "nudillo",
    "nudo",
    "nuera",
    "nueve",
    "nuez",
    "nulo",
    "número",
    "nutria",
    "oasis",
    "obeso",
    "obispo",
    "objeto",
    "obra",
    "obrero",
    "observar",
    "obtener",
    "obvio",
    "oca",
    "ocaso",
    "océano",
    "ochenta",
    "ocho",
    "ocio",
    "ocre",
    "octavo",
    "octubre",
    "oculto",
    "ocupar",
    "ocurrir",
    "odiar",
    "odio",
    "odisea",
    "oeste",
    "ofensa",
    "oferta",
    "oficio",
    "ofrecer",
    "ogro",
    "oído",
    "oír",
    "ojo",
    "ola",
    "oleada",
    "olfato",
    "olivo",
    "olla",
    "olmo",
    "olor",
    "olvido",
    "ombligo",
    "onda",
    "onza",
    "opaco",
    "opción",
    "ópera",
    "opinar",
    "oponer",
    "optar",
    "óptica",
    "opuesto",
    "oración",
    "orador",
    "oral",
    "órbita",
    "orca",
    "orden",
    "oreja",
    "órgano",
    "orgía",
    "orgullo",
    "oriente",
    "origen",
    "orilla",
    "oro",
    "orquesta",
    "oruga",
    "osadía",
    "oscuro",
    "osezno",
    "oso",
    "ostra",
    "otoño",
    "otro",
    "oveja",
    "óvulo",
    "óxido",
    "oxígeno",
    "oyente",
    "ozono",
    "pacto",
    "padre",
    "paella",
    "página",
    "pago",
    "país",
    "pájaro",
    "palabra",
    "palco",
    "paleta",
    "pálido",
    "palma",
    "paloma",
    "palpar",
    "pan",
    "panal",
    "pánico",
    "pantera",
    "pañuelo",
    "papá",
    "papel",
    "papilla",
    "paquete",
    "parar",
    "parcela",
    "pared",
    "parir",
    "paro",
    "párpado",
    "parque",
    "párrafo",
    "parte",
    "pasar",
    "paseo",
    "pasión",
    "paso",
    "pasta",
    "pata",
    "patio",
    "patria",
    "pausa",
    "pauta",
    "pavo",
    "payaso",
    "peatón",
    "pecado",
    "pecera",
    "pecho",
    "pedal",
    "pedir",
    "pegar",
    "peine",
    "pelar",
    "peldaño",
    "pelea",
    "peligro",
    "pellejo",
    "pelo",
    "peluca",
    "pena",
    "pensar",
    "peñón",
    "peón",
    "peor",
    "pepino",
    "pequeño",
    "pera",
    "percha",
    "perder",
    "pereza",
    "perfil",
    "perico",
    "perla",
    "permiso",
    "perro",
    "persona",
    "pesa",
    "pesca",
    "pésimo",
    "pestaña",
    "pétalo",
    "petróleo",
    "pez",
    "pezuña",
    "picar",
    "pichón",
    "pie",
    "piedra",
    "pierna",
    "pieza",
    "pijama",
    "pilar",
    "piloto",
    "pimienta",
    "pino",
    "pintor",
    "pinza",
    "piña",
    "piojo",
    "pipa",
    "pirata",
    "pisar",
    "piscina",
    "piso",
    "pista",
    "pitón",
    "pizca",
    "placa",
    "plan",
    "plata",
    "playa",
    "plaza",
    "pleito",
    "pleno",
    "plomo",
    "pluma",
    "plural",
    "pobre",
    "poco",
    "poder",
    "podio",
    "poema",
    "poesía",
    "poeta",
    "polen",
    "policía",
    "pollo",
    "polvo",
    "pomada",
    "pomelo",
    "pomo",
    "pompa",
    "poner",
    "porción",
    "portal",
    "posada",
    "poseer",
    "posible",
    "poste",
    "potencia",
    "potro",
    "pozo",
    "prado",
    "precoz",
    "pregunta",
    "premio",
    "prensa",
    "preso",
    "previo",
    "primo",
    "príncipe",
    "prisión",
    "privar",
    "proa",
    "probar",
    "proceso",
    "producto",
    "proeza",
    "profesor",
    "programa",
    "prole",
    "promesa",
    "pronto",
    "propio",
    "próximo",
    "prueba",
    "público",
    "puchero",
    "pudor",
    "pueblo",
    "puerta",
    "puesto",
    "pulga",
    "pulir",
    "pulmón",
    "pulpo",
    "pulso",
    "puma",
    "punto",
    "puñal",
    "puño",
    "pupa",
    "pupila",
    "puré",
    "quedar",
    "queja",
    "quemar",
    "querer",
    "queso",
    "quieto",
    "química",
    "quince",
    "quitar",
    "rábano",
    "rabia",
    "rabo",
    "ración",
    "radical",
    "raíz",
    "rama",
    "rampa",
    "rancho",
    "rango",
    "rapaz",
    "rápido",
    "rapto",
    "rasgo",
    "raspa",
    "rato",
    "rayo",
    "raza",
    "razón",
    "reacción",
    "realidad",
    "rebaño",
    "rebote",
    "recaer",
    "receta",
    "rechazo",
    "recoger",
    "recreo",
    "recto",
    "recurso",
    "red",
    "redondo",
    "reducir",
    "reflejo",
    "reforma",
    "refrán",
    "refugio",
    "regalo",
    "regir",
    "regla",
    "regreso",
    "rehén",
    "reino",
    "reír",
    "reja",
    "relato",
    "relevo",
    "relieve",
    "relleno",
    "reloj",
    "remar",
    "remedio",
    "remo",
    "rencor",
    "rendir",
    "renta",
    "reparto",
    "repetir",
    "reposo",
    "reptil",
    "res",
    "rescate",
    "resina",
    "respeto",
    "resto",
    "resumen",
    "retiro",
    "retorno",
    "retrato",
    "reunir",
    "revés",
    "revista",
    "rey",
    "rezar",
    "rico",
    "riego",
    "rienda",
    "riesgo",
    "rifa",
    "rígido",
    "rigor",
    "rincón",
    "riñón",
    "río",
    "riqueza",
    "risa",
    "ritmo",
    "rito",
    "rizo",
    "roble",
    "roce",
    "rociar",
    "rodar",
    "rodeo",
    "rodilla",
    "roer",
    "rojizo",
    "rojo",
    "romero",
    "romper",
    "ron",
    "ronco",
    "ronda",
    "ropa",
    "ropero",
    "rosa",
    "rosca",
    "rostro",
    "rotar",
    "rubí",
    "rubor",
    "rudo",
    "rueda",
    "rugir",
    "ruido",
    "ruina",
    "ruleta",
    "rulo",
    "rumbo",
    "rumor",
    "ruptura",
    "ruta",
    "rutina",
    "sábado",
    "saber",
    "sabio",
    "sable",
    "sacar",
    "sagaz",
    "sagrado",
    "sala",
    "saldo",
    "salero",
    "salir",
    "salmón",
    "salón",
    "salsa",
    "salto",
    "salud",
    "salvar",
    "samba",
    "sanción",
    "sandía",
    "sanear",
    "sangre",
    "sanidad",
    "sano",
    "santo",
    "sapo",
    "saque",
    "sardina",
    "sartén",
    "sastre",
    "satán",
    "sauna",
    "saxofón",
    "sección",
    "seco",
    "secreto",
    "secta",
    "sed",
    "seguir",
    "seis",
    "sello",
    "selva",
    "semana",
    "semilla",
    "senda",
    "sensor",
    "señal",
    "señor",
    "separar",
    "sepia",
    "sequía",
    "ser",
    "serie",
    "sermón",
    "servir",
    "sesenta",
    "sesión",
    "seta",
    "setenta",
    "severo",
    "sexo",
    "sexto",
    "sidra",
    "siesta",
    "siete",
    "siglo",
    "signo",
    "sílaba",
    "silbar",
    "silencio",
    "silla",
    "símbolo",
    "simio",
    "sirena",
    "sistema",
    "sitio",
    "situar",
    "sobre",
    "socio",
    "sodio",
    "sol",
    "solapa",
    "soldado",
    "soledad",
    "sólido",
    "soltar",
    "solución",
    "sombra",
    "sondeo",
    "sonido",
    "sonoro",
    "sonrisa",
    "sopa",
    "soplar",
    "soporte",
    "sordo",
    "sorpresa",
    "sorteo",
    "sostén",
    "sótano",
    "suave",
    "subir",
    "suceso",
    "sudor",
    "suegra",
    "suelo",
    "sueño",
    "suerte",
    "sufrir",
    "sujeto",
    "sultán",
    "sumar",
    "superar",
    "suplir",
    "suponer",
    "supremo",
    "sur",
    "surco",
    "sureño",
    "surgir",
    "susto",
    "sutil",
    "tabaco",
    "tabique",
    "tabla",
    "tabú",
    "taco",
    "tacto",
    "tajo",
    "talar",
    "talco",
    "talento",
    "talla",
    "talón",
    "tamaño",
    "tambor",
    "tango",
    "tanque",
    "tapa",
    "tapete",
    "tapia",
    "tapón",
    "taquilla",
    "tarde",
    "tarea",
    "tarifa",
    "tarjeta",
    "tarot",
    "tarro",
    "tarta",
    "tatuaje",
    "tauro",
    "taza",
    "tazón",
    "teatro",
    "techo",
    "tecla",
    "técnica",
    "tejado",
    "tejer",
    "tejido",
    "tela",
    "teléfono",
    "tema",
    "temor",
    "templo",
    "tenaz",
    "tender",
    "tener",
    "tenis",
    "tenso",
    "teoría",
    "terapia",
    "terco",
    "término",
    "ternura",
    "terror",
    "tesis",
    "tesoro",
    "testigo",
    "tetera",
    "texto",
    "tez",
    "tibio",
    "tiburón",
    "tiempo",
    "tienda",
    "tierra",
    "tieso",
    "tigre",
    "tijera",
    "tilde",
    "timbre",
    "tímido",
    "timo",
    "tinta",
    "tío",
    "típico",
    "tipo",
    "tira",
    "tirón",
    "titán",
    "títere",
    "título",
    "tiza",
    "toalla",
    "tobillo",
    "tocar",
    "tocino",
    "todo",
    "toga",
    "toldo",
    "tomar",
    "tono",
    "tonto",
    "topar",
    "tope",
    "toque",
    "tórax",
    "torero",
    "tormenta",
    "torneo",
    "toro",
    "torpedo",
    "torre",
    "torso",
    "tortuga",
    "tos",
    "tosco",
    "toser",
    "tóxico",
    "trabajo",
    "tractor",
    "traer",
    "tráfico",
    "trago",
    "traje",
    "tramo",
    "trance",
    "trato",
    "trauma",
    "trazar",
    "trébol",
    "tregua",
    "treinta",
    "tren",
    "trepar",
    "tres",
    "tribu",
    "trigo",
    "tripa",
    "triste",
    "triunfo",
    "trofeo",
    "trompa",
    "tronco",
    "tropa",
    "trote",
    "trozo",
    "truco",
    "trueno",
    "trufa",
    "tubería",
    "tubo",
    "tuerto",
    "tumba",
    "tumor",
    "túnel",
    "túnica",
    "turbina",
    "turismo",
    "turno",
    "tutor",
    "ubicar",
    "úlcera",
    "umbral",
    "unidad",
    "unir",
    "universo",
    "uno",
    "untar",
    "uña",
    "urbano",
    "urbe",
    "urgente",
    "urna",
    "usar",
    "usuario",
    "útil",
    "utopía",
    "uva",
    "vaca",
    "vacío",
    "vacuna",
    "vagar",
    "vago",
    "vaina",
    "vajilla",
    "vale",
    "válido",
    "valle",
    "valor",
    "válvula",
    "vampiro",
    "vara",
    "variar",
    "varón",
    "vaso",
    "vecino",
    "vector",
    "vehículo",
    "veinte",
    "vejez",
    "vela",
    "velero",
    "veloz",
    "vena",
    "vencer",
    "venda",
    "veneno",
    "vengar",
    "venir",
    "venta",
    "venus",
    "ver",
    "verano",
    "verbo",
    "verde",
    "vereda",
    "verja",
    "verso",
    "verter",
    "vía",
    "viaje",
    "vibrar",
    "vicio",
    "víctima",
    "vida",
    "vídeo",
    "vidrio",
    "viejo",
    "viernes",
    "vigor",
    "vil",
    "villa",
    "vinagre",
    "vino",
    "viñedo",
    "violín",
    "viral",
    "virgo",
    "virtud",
    "visor",
    "víspera",
    "vista",
    "vitamina",
    "viudo",
    "vivaz",
    "vivero",
    "vivir",
    "vivo",
    "volcán",
    "volumen",
    "volver",
    "voraz",
    "votar",
    "voto",
    "voz",
    "vuelo",
    "vulgar",
    "yacer",
    "yate",
    "yegua",
    "yema",
    "yerno",
    "yeso",
    "yodo",
    "yoga",
    "yogur",
    "zafiro",
    "zanja",
    "zapato",
    "zarza",
    "zona",
    "zorro",
    "zumo",
    "zurdo"
]

},{}],33:[function(require,module,exports){
(function (Buffer){(function (){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

var K_MAX_LENGTH = 0x7fffffff
exports.kMaxLength = K_MAX_LENGTH

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Print warning and recommend using `buffer` v4.x which has an Object
 *               implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * We report that the browser does not support typed arrays if the are not subclassable
 * using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
 * (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
 * for __proto__ and has a buggy typed array implementation.
 */
Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport()

if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== 'undefined' &&
    typeof console.error === 'function') {
  console.error(
    'This browser lacks typed array (Uint8Array) support which is required by ' +
    '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.'
  )
}

function typedArraySupport () {
  // Can typed array instances can be augmented?
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = { __proto__: Uint8Array.prototype, foo: function () { return 42 } }
    return arr.foo() === 42
  } catch (e) {
    return false
  }
}

Object.defineProperty(Buffer.prototype, 'parent', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.buffer
  }
})

Object.defineProperty(Buffer.prototype, 'offset', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.byteOffset
  }
})

function createBuffer (length) {
  if (length > K_MAX_LENGTH) {
    throw new RangeError('The value "' + length + '" is invalid for option "size"')
  }
  // Return an augmented `Uint8Array` instance
  var buf = new Uint8Array(length)
  buf.__proto__ = Buffer.prototype
  return buf
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new TypeError(
        'The "string" argument must be of type string. Received type number'
      )
    }
    return allocUnsafe(arg)
  }
  return from(arg, encodingOrOffset, length)
}

// Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
if (typeof Symbol !== 'undefined' && Symbol.species != null &&
    Buffer[Symbol.species] === Buffer) {
  Object.defineProperty(Buffer, Symbol.species, {
    value: null,
    configurable: true,
    enumerable: false,
    writable: false
  })
}

Buffer.poolSize = 8192 // not used by this implementation

function from (value, encodingOrOffset, length) {
  if (typeof value === 'string') {
    return fromString(value, encodingOrOffset)
  }

  if (ArrayBuffer.isView(value)) {
    return fromArrayLike(value)
  }

  if (value == null) {
    throw TypeError(
      'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
      'or Array-like Object. Received type ' + (typeof value)
    )
  }

  if (isInstance(value, ArrayBuffer) ||
      (value && isInstance(value.buffer, ArrayBuffer))) {
    return fromArrayBuffer(value, encodingOrOffset, length)
  }

  if (typeof value === 'number') {
    throw new TypeError(
      'The "value" argument must not be of type number. Received type number'
    )
  }

  var valueOf = value.valueOf && value.valueOf()
  if (valueOf != null && valueOf !== value) {
    return Buffer.from(valueOf, encodingOrOffset, length)
  }

  var b = fromObject(value)
  if (b) return b

  if (typeof Symbol !== 'undefined' && Symbol.toPrimitive != null &&
      typeof value[Symbol.toPrimitive] === 'function') {
    return Buffer.from(
      value[Symbol.toPrimitive]('string'), encodingOrOffset, length
    )
  }

  throw new TypeError(
    'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
    'or Array-like Object. Received type ' + (typeof value)
  )
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(value, encodingOrOffset, length)
}

// Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
// https://github.com/feross/buffer/pull/148
Buffer.prototype.__proto__ = Uint8Array.prototype
Buffer.__proto__ = Uint8Array

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be of type number')
  } else if (size < 0) {
    throw new RangeError('The value "' + size + '" is invalid for option "size"')
  }
}

function alloc (size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(size).fill(fill, encoding)
      : createBuffer(size).fill(fill)
  }
  return createBuffer(size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(size, fill, encoding)
}

function allocUnsafe (size) {
  assertSize(size)
  return createBuffer(size < 0 ? 0 : checked(size) | 0)
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(size)
}

function fromString (string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('Unknown encoding: ' + encoding)
  }

  var length = byteLength(string, encoding) | 0
  var buf = createBuffer(length)

  var actual = buf.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    buf = buf.slice(0, actual)
  }

  return buf
}

function fromArrayLike (array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  var buf = createBuffer(length)
  for (var i = 0; i < length; i += 1) {
    buf[i] = array[i] & 255
  }
  return buf
}

function fromArrayBuffer (array, byteOffset, length) {
  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('"offset" is outside of buffer bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('"length" is outside of buffer bounds')
  }

  var buf
  if (byteOffset === undefined && length === undefined) {
    buf = new Uint8Array(array)
  } else if (length === undefined) {
    buf = new Uint8Array(array, byteOffset)
  } else {
    buf = new Uint8Array(array, byteOffset, length)
  }

  // Return an augmented `Uint8Array` instance
  buf.__proto__ = Buffer.prototype
  return buf
}

function fromObject (obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    var buf = createBuffer(len)

    if (buf.length === 0) {
      return buf
    }

    obj.copy(buf, 0, 0, len)
    return buf
  }

  if (obj.length !== undefined) {
    if (typeof obj.length !== 'number' || numberIsNaN(obj.length)) {
      return createBuffer(0)
    }
    return fromArrayLike(obj)
  }

  if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
    return fromArrayLike(obj.data)
  }
}

function checked (length) {
  // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= K_MAX_LENGTH) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return b != null && b._isBuffer === true &&
    b !== Buffer.prototype // so Buffer.isBuffer(Buffer.prototype) will be false
}

Buffer.compare = function compare (a, b) {
  if (isInstance(a, Uint8Array)) a = Buffer.from(a, a.offset, a.byteLength)
  if (isInstance(b, Uint8Array)) b = Buffer.from(b, b.offset, b.byteLength)
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError(
      'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
    )
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!Array.isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (isInstance(buf, Uint8Array)) {
      buf = Buffer.from(buf)
    }
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    throw new TypeError(
      'The "string" argument must be one of type string, Buffer, or ArrayBuffer. ' +
      'Received type ' + typeof string
    )
  }

  var len = string.length
  var mustMatch = (arguments.length > 2 && arguments[2] === true)
  if (!mustMatch && len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) {
          return mustMatch ? -1 : utf8ToBytes(string).length // assume utf8
        }
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
// to detect a Buffer instance. It's not possible to use `instanceof Buffer`
// reliably in a browserify context because there could be multiple different
// copies of the 'buffer' package in use. This method works even for Buffer
// instances that were created from another copy of the `buffer` package.
// See: https://github.com/feross/buffer/issues/154
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.toLocaleString = Buffer.prototype.toString

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  str = this.toString('hex', 0, max).replace(/(.{2})/g, '$1 ').trim()
  if (this.length > max) str += ' ... '
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (isInstance(target, Uint8Array)) {
    target = Buffer.from(target, target.offset, target.byteLength)
  }
  if (!Buffer.isBuffer(target)) {
    throw new TypeError(
      'The "target" argument must be one of type Buffer or Uint8Array. ' +
      'Received type ' + (typeof target)
    )
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset // Coerce to Number.
  if (numberIsNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  var strLen = string.length

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (numberIsNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset >>> 0
    if (isFinite(length)) {
      length = length >>> 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
        : (firstByte > 0xBF) ? 2
          : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + (bytes[i + 1] * 256))
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf = this.subarray(start, end)
  // Return an augmented `Uint8Array` instance
  newBuf.__proto__ = Buffer.prototype
  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset + 3] = (value >>> 24)
  this[offset + 2] = (value >>> 16)
  this[offset + 1] = (value >>> 8)
  this[offset] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  this[offset + 2] = (value >>> 16)
  this[offset + 3] = (value >>> 24)
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!Buffer.isBuffer(target)) throw new TypeError('argument should be a Buffer')
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('Index out of range')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start

  if (this === target && typeof Uint8Array.prototype.copyWithin === 'function') {
    // Use built-in when available, missing from IE11
    this.copyWithin(targetStart, start, end)
  } else if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (var i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, end),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if ((encoding === 'utf8' && code < 128) ||
          encoding === 'latin1') {
        // Fast path: If `val` fits into a single byte, use that numeric value.
        val = code
      }
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : Buffer.from(val, encoding)
    var len = bytes.length
    if (len === 0) {
      throw new TypeError('The value "' + val +
        '" is invalid for argument "value"')
    }
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node takes equal signs as end of the Base64 encoding
  str = str.split('=')[0]
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = str.trim().replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

// ArrayBuffer or Uint8Array objects from other contexts (i.e. iframes) do not pass
// the `instanceof` check but they should be treated as of that type.
// See: https://github.com/feross/buffer/issues/166
function isInstance (obj, type) {
  return obj instanceof type ||
    (obj != null && obj.constructor != null && obj.constructor.name != null &&
      obj.constructor.name === type.name)
}
function numberIsNaN (obj) {
  // For IE11 support
  return obj !== obj // eslint-disable-line no-self-compare
}

}).call(this)}).call(this,require("buffer").Buffer)
},{"base64-js":20,"buffer":33,"ieee754":34}],34:[function(require,module,exports){
/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],35:[function(require,module,exports){
// minimal library entry point.

"use strict";
module.exports = require("./src/index-minimal");

},{"./src/index-minimal":36}],36:[function(require,module,exports){
"use strict";
var protobuf = exports;

/**
 * Build type, one of `"full"`, `"light"` or `"minimal"`.
 * @name build
 * @type {string}
 * @const
 */
protobuf.build = "minimal";

// Serialization
protobuf.Writer       = require("./writer");
protobuf.BufferWriter = require("./writer_buffer");
protobuf.Reader       = require("./reader");
protobuf.BufferReader = require("./reader_buffer");

// Utility
protobuf.util         = require("./util/minimal");
protobuf.rpc          = require("./rpc");
protobuf.roots        = require("./roots");
protobuf.configure    = configure;

/* istanbul ignore next */
/**
 * Reconfigures the library according to the environment.
 * @returns {undefined}
 */
function configure() {
    protobuf.util._configure();
    protobuf.Writer._configure(protobuf.BufferWriter);
    protobuf.Reader._configure(protobuf.BufferReader);
}

// Set up buffer utility according to the environment
configure();

},{"./reader":37,"./reader_buffer":38,"./roots":39,"./rpc":40,"./util/minimal":43,"./writer":44,"./writer_buffer":45}],37:[function(require,module,exports){
"use strict";
module.exports = Reader;

var util      = require("./util/minimal");

var BufferReader; // cyclic

var LongBits  = util.LongBits,
    utf8      = util.utf8;

/* istanbul ignore next */
function indexOutOfRange(reader, writeLength) {
    return RangeError("index out of range: " + reader.pos + " + " + (writeLength || 1) + " > " + reader.len);
}

/**
 * Constructs a new reader instance using the specified buffer.
 * @classdesc Wire format reader using `Uint8Array` if available, otherwise `Array`.
 * @constructor
 * @param {Uint8Array} buffer Buffer to read from
 */
function Reader(buffer) {

    /**
     * Read buffer.
     * @type {Uint8Array}
     */
    this.buf = buffer;

    /**
     * Read buffer position.
     * @type {number}
     */
    this.pos = 0;

    /**
     * Read buffer length.
     * @type {number}
     */
    this.len = buffer.length;
}

var create_array = typeof Uint8Array !== "undefined"
    ? function create_typed_array(buffer) {
        if (buffer instanceof Uint8Array || Array.isArray(buffer))
            return new Reader(buffer);
        throw Error("illegal buffer");
    }
    /* istanbul ignore next */
    : function create_array(buffer) {
        if (Array.isArray(buffer))
            return new Reader(buffer);
        throw Error("illegal buffer");
    };

var create = function create() {
    return util.Buffer
        ? function create_buffer_setup(buffer) {
            return (Reader.create = function create_buffer(buffer) {
                return util.Buffer.isBuffer(buffer)
                    ? new BufferReader(buffer)
                    /* istanbul ignore next */
                    : create_array(buffer);
            })(buffer);
        }
        /* istanbul ignore next */
        : create_array;
};

/**
 * Creates a new reader using the specified buffer.
 * @function
 * @param {Uint8Array|Buffer} buffer Buffer to read from
 * @returns {Reader|BufferReader} A {@link BufferReader} if `buffer` is a Buffer, otherwise a {@link Reader}
 * @throws {Error} If `buffer` is not a valid buffer
 */
Reader.create = create();

Reader.prototype._slice = util.Array.prototype.subarray || /* istanbul ignore next */ util.Array.prototype.slice;

/**
 * Reads a varint as an unsigned 32 bit value.
 * @function
 * @returns {number} Value read
 */
Reader.prototype.uint32 = (function read_uint32_setup() {
    var value = 4294967295; // optimizer type-hint, tends to deopt otherwise (?!)
    return function read_uint32() {
        value = (         this.buf[this.pos] & 127       ) >>> 0; if (this.buf[this.pos++] < 128) return value;
        value = (value | (this.buf[this.pos] & 127) <<  7) >>> 0; if (this.buf[this.pos++] < 128) return value;
        value = (value | (this.buf[this.pos] & 127) << 14) >>> 0; if (this.buf[this.pos++] < 128) return value;
        value = (value | (this.buf[this.pos] & 127) << 21) >>> 0; if (this.buf[this.pos++] < 128) return value;
        value = (value | (this.buf[this.pos] &  15) << 28) >>> 0; if (this.buf[this.pos++] < 128) return value;

        /* istanbul ignore if */
        if ((this.pos += 5) > this.len) {
            this.pos = this.len;
            throw indexOutOfRange(this, 10);
        }
        return value;
    };
})();

/**
 * Reads a varint as a signed 32 bit value.
 * @returns {number} Value read
 */
Reader.prototype.int32 = function read_int32() {
    return this.uint32() | 0;
};

/**
 * Reads a zig-zag encoded varint as a signed 32 bit value.
 * @returns {number} Value read
 */
Reader.prototype.sint32 = function read_sint32() {
    var value = this.uint32();
    return value >>> 1 ^ -(value & 1) | 0;
};

/* eslint-disable no-invalid-this */

function readLongVarint() {
    // tends to deopt with local vars for octet etc.
    var bits = new LongBits(0, 0);
    var i = 0;
    if (this.len - this.pos > 4) { // fast route (lo)
        for (; i < 4; ++i) {
            // 1st..4th
            bits.lo = (bits.lo | (this.buf[this.pos] & 127) << i * 7) >>> 0;
            if (this.buf[this.pos++] < 128)
                return bits;
        }
        // 5th
        bits.lo = (bits.lo | (this.buf[this.pos] & 127) << 28) >>> 0;
        bits.hi = (bits.hi | (this.buf[this.pos] & 127) >>  4) >>> 0;
        if (this.buf[this.pos++] < 128)
            return bits;
        i = 0;
    } else {
        for (; i < 3; ++i) {
            /* istanbul ignore if */
            if (this.pos >= this.len)
                throw indexOutOfRange(this);
            // 1st..3th
            bits.lo = (bits.lo | (this.buf[this.pos] & 127) << i * 7) >>> 0;
            if (this.buf[this.pos++] < 128)
                return bits;
        }
        // 4th
        bits.lo = (bits.lo | (this.buf[this.pos++] & 127) << i * 7) >>> 0;
        return bits;
    }
    if (this.len - this.pos > 4) { // fast route (hi)
        for (; i < 5; ++i) {
            // 6th..10th
            bits.hi = (bits.hi | (this.buf[this.pos] & 127) << i * 7 + 3) >>> 0;
            if (this.buf[this.pos++] < 128)
                return bits;
        }
    } else {
        for (; i < 5; ++i) {
            /* istanbul ignore if */
            if (this.pos >= this.len)
                throw indexOutOfRange(this);
            // 6th..10th
            bits.hi = (bits.hi | (this.buf[this.pos] & 127) << i * 7 + 3) >>> 0;
            if (this.buf[this.pos++] < 128)
                return bits;
        }
    }
    /* istanbul ignore next */
    throw Error("invalid varint encoding");
}

/* eslint-enable no-invalid-this */

/**
 * Reads a varint as a signed 64 bit value.
 * @name Reader#int64
 * @function
 * @returns {Long} Value read
 */

/**
 * Reads a varint as an unsigned 64 bit value.
 * @name Reader#uint64
 * @function
 * @returns {Long} Value read
 */

/**
 * Reads a zig-zag encoded varint as a signed 64 bit value.
 * @name Reader#sint64
 * @function
 * @returns {Long} Value read
 */

/**
 * Reads a varint as a boolean.
 * @returns {boolean} Value read
 */
Reader.prototype.bool = function read_bool() {
    return this.uint32() !== 0;
};

function readFixed32_end(buf, end) { // note that this uses `end`, not `pos`
    return (buf[end - 4]
          | buf[end - 3] << 8
          | buf[end - 2] << 16
          | buf[end - 1] << 24) >>> 0;
}

/**
 * Reads fixed 32 bits as an unsigned 32 bit integer.
 * @returns {number} Value read
 */
Reader.prototype.fixed32 = function read_fixed32() {

    /* istanbul ignore if */
    if (this.pos + 4 > this.len)
        throw indexOutOfRange(this, 4);

    return readFixed32_end(this.buf, this.pos += 4);
};

/**
 * Reads fixed 32 bits as a signed 32 bit integer.
 * @returns {number} Value read
 */
Reader.prototype.sfixed32 = function read_sfixed32() {

    /* istanbul ignore if */
    if (this.pos + 4 > this.len)
        throw indexOutOfRange(this, 4);

    return readFixed32_end(this.buf, this.pos += 4) | 0;
};

/* eslint-disable no-invalid-this */

function readFixed64(/* this: Reader */) {

    /* istanbul ignore if */
    if (this.pos + 8 > this.len)
        throw indexOutOfRange(this, 8);

    return new LongBits(readFixed32_end(this.buf, this.pos += 4), readFixed32_end(this.buf, this.pos += 4));
}

/* eslint-enable no-invalid-this */

/**
 * Reads fixed 64 bits.
 * @name Reader#fixed64
 * @function
 * @returns {Long} Value read
 */

/**
 * Reads zig-zag encoded fixed 64 bits.
 * @name Reader#sfixed64
 * @function
 * @returns {Long} Value read
 */

/**
 * Reads a float (32 bit) as a number.
 * @function
 * @returns {number} Value read
 */
Reader.prototype.float = function read_float() {

    /* istanbul ignore if */
    if (this.pos + 4 > this.len)
        throw indexOutOfRange(this, 4);

    var value = util.float.readFloatLE(this.buf, this.pos);
    this.pos += 4;
    return value;
};

/**
 * Reads a double (64 bit float) as a number.
 * @function
 * @returns {number} Value read
 */
Reader.prototype.double = function read_double() {

    /* istanbul ignore if */
    if (this.pos + 8 > this.len)
        throw indexOutOfRange(this, 4);

    var value = util.float.readDoubleLE(this.buf, this.pos);
    this.pos += 8;
    return value;
};

/**
 * Reads a sequence of bytes preceeded by its length as a varint.
 * @returns {Uint8Array} Value read
 */
Reader.prototype.bytes = function read_bytes() {
    var length = this.uint32(),
        start  = this.pos,
        end    = this.pos + length;

    /* istanbul ignore if */
    if (end > this.len)
        throw indexOutOfRange(this, length);

    this.pos += length;
    if (Array.isArray(this.buf)) // plain array
        return this.buf.slice(start, end);
    return start === end // fix for IE 10/Win8 and others' subarray returning array of size 1
        ? new this.buf.constructor(0)
        : this._slice.call(this.buf, start, end);
};

/**
 * Reads a string preceeded by its byte length as a varint.
 * @returns {string} Value read
 */
Reader.prototype.string = function read_string() {
    var bytes = this.bytes();
    return utf8.read(bytes, 0, bytes.length);
};

/**
 * Skips the specified number of bytes if specified, otherwise skips a varint.
 * @param {number} [length] Length if known, otherwise a varint is assumed
 * @returns {Reader} `this`
 */
Reader.prototype.skip = function skip(length) {
    if (typeof length === "number") {
        /* istanbul ignore if */
        if (this.pos + length > this.len)
            throw indexOutOfRange(this, length);
        this.pos += length;
    } else {
        do {
            /* istanbul ignore if */
            if (this.pos >= this.len)
                throw indexOutOfRange(this);
        } while (this.buf[this.pos++] & 128);
    }
    return this;
};

/**
 * Skips the next element of the specified wire type.
 * @param {number} wireType Wire type received
 * @returns {Reader} `this`
 */
Reader.prototype.skipType = function(wireType) {
    switch (wireType) {
        case 0:
            this.skip();
            break;
        case 1:
            this.skip(8);
            break;
        case 2:
            this.skip(this.uint32());
            break;
        case 3:
            while ((wireType = this.uint32() & 7) !== 4) {
                this.skipType(wireType);
            }
            break;
        case 5:
            this.skip(4);
            break;

        /* istanbul ignore next */
        default:
            throw Error("invalid wire type " + wireType + " at offset " + this.pos);
    }
    return this;
};

Reader._configure = function(BufferReader_) {
    BufferReader = BufferReader_;
    Reader.create = create();
    BufferReader._configure();

    var fn = util.Long ? "toLong" : /* istanbul ignore next */ "toNumber";
    util.merge(Reader.prototype, {

        int64: function read_int64() {
            return readLongVarint.call(this)[fn](false);
        },

        uint64: function read_uint64() {
            return readLongVarint.call(this)[fn](true);
        },

        sint64: function read_sint64() {
            return readLongVarint.call(this).zzDecode()[fn](false);
        },

        fixed64: function read_fixed64() {
            return readFixed64.call(this)[fn](true);
        },

        sfixed64: function read_sfixed64() {
            return readFixed64.call(this)[fn](false);
        }

    });
};

},{"./util/minimal":43}],38:[function(require,module,exports){
"use strict";
module.exports = BufferReader;

// extends Reader
var Reader = require("./reader");
(BufferReader.prototype = Object.create(Reader.prototype)).constructor = BufferReader;

var util = require("./util/minimal");

/**
 * Constructs a new buffer reader instance.
 * @classdesc Wire format reader using node buffers.
 * @extends Reader
 * @constructor
 * @param {Buffer} buffer Buffer to read from
 */
function BufferReader(buffer) {
    Reader.call(this, buffer);

    /**
     * Read buffer.
     * @name BufferReader#buf
     * @type {Buffer}
     */
}

BufferReader._configure = function () {
    /* istanbul ignore else */
    if (util.Buffer)
        BufferReader.prototype._slice = util.Buffer.prototype.slice;
};


/**
 * @override
 */
BufferReader.prototype.string = function read_string_buffer() {
    var len = this.uint32(); // modifies pos
    return this.buf.utf8Slice
        ? this.buf.utf8Slice(this.pos, this.pos = Math.min(this.pos + len, this.len))
        : this.buf.toString("utf-8", this.pos, this.pos = Math.min(this.pos + len, this.len));
};

/**
 * Reads a sequence of bytes preceeded by its length as a varint.
 * @name BufferReader#bytes
 * @function
 * @returns {Buffer} Value read
 */

BufferReader._configure();

},{"./reader":37,"./util/minimal":43}],39:[function(require,module,exports){
"use strict";
module.exports = {};

/**
 * Named roots.
 * This is where pbjs stores generated structures (the option `-r, --root` specifies a name).
 * Can also be used manually to make roots available across modules.
 * @name roots
 * @type {Object.<string,Root>}
 * @example
 * // pbjs -r myroot -o compiled.js ...
 *
 * // in another module:
 * require("./compiled.js");
 *
 * // in any subsequent module:
 * var root = protobuf.roots["myroot"];
 */

},{}],40:[function(require,module,exports){
"use strict";

/**
 * Streaming RPC helpers.
 * @namespace
 */
var rpc = exports;

/**
 * RPC implementation passed to {@link Service#create} performing a service request on network level, i.e. by utilizing http requests or websockets.
 * @typedef RPCImpl
 * @type {function}
 * @param {Method|rpc.ServiceMethod<Message<{}>,Message<{}>>} method Reflected or static method being called
 * @param {Uint8Array} requestData Request data
 * @param {RPCImplCallback} callback Callback function
 * @returns {undefined}
 * @example
 * function rpcImpl(method, requestData, callback) {
 *     if (protobuf.util.lcFirst(method.name) !== "myMethod") // compatible with static code
 *         throw Error("no such method");
 *     asynchronouslyObtainAResponse(requestData, function(err, responseData) {
 *         callback(err, responseData);
 *     });
 * }
 */

/**
 * Node-style callback as used by {@link RPCImpl}.
 * @typedef RPCImplCallback
 * @type {function}
 * @param {Error|null} error Error, if any, otherwise `null`
 * @param {Uint8Array|null} [response] Response data or `null` to signal end of stream, if there hasn't been an error
 * @returns {undefined}
 */

rpc.Service = require("./rpc/service");

},{"./rpc/service":41}],41:[function(require,module,exports){
"use strict";
module.exports = Service;

var util = require("../util/minimal");

// Extends EventEmitter
(Service.prototype = Object.create(util.EventEmitter.prototype)).constructor = Service;

/**
 * A service method callback as used by {@link rpc.ServiceMethod|ServiceMethod}.
 *
 * Differs from {@link RPCImplCallback} in that it is an actual callback of a service method which may not return `response = null`.
 * @typedef rpc.ServiceMethodCallback
 * @template TRes extends Message<TRes>
 * @type {function}
 * @param {Error|null} error Error, if any
 * @param {TRes} [response] Response message
 * @returns {undefined}
 */

/**
 * A service method part of a {@link rpc.Service} as created by {@link Service.create}.
 * @typedef rpc.ServiceMethod
 * @template TReq extends Message<TReq>
 * @template TRes extends Message<TRes>
 * @type {function}
 * @param {TReq|Properties<TReq>} request Request message or plain object
 * @param {rpc.ServiceMethodCallback<TRes>} [callback] Node-style callback called with the error, if any, and the response message
 * @returns {Promise<Message<TRes>>} Promise if `callback` has been omitted, otherwise `undefined`
 */

/**
 * Constructs a new RPC service instance.
 * @classdesc An RPC service as returned by {@link Service#create}.
 * @exports rpc.Service
 * @extends util.EventEmitter
 * @constructor
 * @param {RPCImpl} rpcImpl RPC implementation
 * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
 * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
 */
function Service(rpcImpl, requestDelimited, responseDelimited) {

    if (typeof rpcImpl !== "function")
        throw TypeError("rpcImpl must be a function");

    util.EventEmitter.call(this);

    /**
     * RPC implementation. Becomes `null` once the service is ended.
     * @type {RPCImpl|null}
     */
    this.rpcImpl = rpcImpl;

    /**
     * Whether requests are length-delimited.
     * @type {boolean}
     */
    this.requestDelimited = Boolean(requestDelimited);

    /**
     * Whether responses are length-delimited.
     * @type {boolean}
     */
    this.responseDelimited = Boolean(responseDelimited);
}

/**
 * Calls a service method through {@link rpc.Service#rpcImpl|rpcImpl}.
 * @param {Method|rpc.ServiceMethod<TReq,TRes>} method Reflected or static method
 * @param {Constructor<TReq>} requestCtor Request constructor
 * @param {Constructor<TRes>} responseCtor Response constructor
 * @param {TReq|Properties<TReq>} request Request message or plain object
 * @param {rpc.ServiceMethodCallback<TRes>} callback Service callback
 * @returns {undefined}
 * @template TReq extends Message<TReq>
 * @template TRes extends Message<TRes>
 */
Service.prototype.rpcCall = function rpcCall(method, requestCtor, responseCtor, request, callback) {

    if (!request)
        throw TypeError("request must be specified");

    var self = this;
    if (!callback)
        return util.asPromise(rpcCall, self, method, requestCtor, responseCtor, request);

    if (!self.rpcImpl) {
        setTimeout(function() { callback(Error("already ended")); }, 0);
        return undefined;
    }

    try {
        return self.rpcImpl(
            method,
            requestCtor[self.requestDelimited ? "encodeDelimited" : "encode"](request).finish(),
            function rpcCallback(err, response) {

                if (err) {
                    self.emit("error", err, method);
                    return callback(err);
                }

                if (response === null) {
                    self.end(/* endedByRPC */ true);
                    return undefined;
                }

                if (!(response instanceof responseCtor)) {
                    try {
                        response = responseCtor[self.responseDelimited ? "decodeDelimited" : "decode"](response);
                    } catch (err) {
                        self.emit("error", err, method);
                        return callback(err);
                    }
                }

                self.emit("data", response, method);
                return callback(null, response);
            }
        );
    } catch (err) {
        self.emit("error", err, method);
        setTimeout(function() { callback(err); }, 0);
        return undefined;
    }
};

/**
 * Ends this service and emits the `end` event.
 * @param {boolean} [endedByRPC=false] Whether the service has been ended by the RPC implementation.
 * @returns {rpc.Service} `this`
 */
Service.prototype.end = function end(endedByRPC) {
    if (this.rpcImpl) {
        if (!endedByRPC) // signal end to rpcImpl
            this.rpcImpl(null, null, null);
        this.rpcImpl = null;
        this.emit("end").off();
    }
    return this;
};

},{"../util/minimal":43}],42:[function(require,module,exports){
"use strict";
module.exports = LongBits;

var util = require("../util/minimal");

/**
 * Constructs new long bits.
 * @classdesc Helper class for working with the low and high bits of a 64 bit value.
 * @memberof util
 * @constructor
 * @param {number} lo Low 32 bits, unsigned
 * @param {number} hi High 32 bits, unsigned
 */
function LongBits(lo, hi) {

    // note that the casts below are theoretically unnecessary as of today, but older statically
    // generated converter code might still call the ctor with signed 32bits. kept for compat.

    /**
     * Low bits.
     * @type {number}
     */
    this.lo = lo >>> 0;

    /**
     * High bits.
     * @type {number}
     */
    this.hi = hi >>> 0;
}

/**
 * Zero bits.
 * @memberof util.LongBits
 * @type {util.LongBits}
 */
var zero = LongBits.zero = new LongBits(0, 0);

zero.toNumber = function() { return 0; };
zero.zzEncode = zero.zzDecode = function() { return this; };
zero.length = function() { return 1; };

/**
 * Zero hash.
 * @memberof util.LongBits
 * @type {string}
 */
var zeroHash = LongBits.zeroHash = "\0\0\0\0\0\0\0\0";

/**
 * Constructs new long bits from the specified number.
 * @param {number} value Value
 * @returns {util.LongBits} Instance
 */
LongBits.fromNumber = function fromNumber(value) {
    if (value === 0)
        return zero;
    var sign = value < 0;
    if (sign)
        value = -value;
    var lo = value >>> 0,
        hi = (value - lo) / 4294967296 >>> 0;
    if (sign) {
        hi = ~hi >>> 0;
        lo = ~lo >>> 0;
        if (++lo > 4294967295) {
            lo = 0;
            if (++hi > 4294967295)
                hi = 0;
        }
    }
    return new LongBits(lo, hi);
};

/**
 * Constructs new long bits from a number, long or string.
 * @param {Long|number|string} value Value
 * @returns {util.LongBits} Instance
 */
LongBits.from = function from(value) {
    if (typeof value === "number")
        return LongBits.fromNumber(value);
    if (util.isString(value)) {
        /* istanbul ignore else */
        if (util.Long)
            value = util.Long.fromString(value);
        else
            return LongBits.fromNumber(parseInt(value, 10));
    }
    return value.low || value.high ? new LongBits(value.low >>> 0, value.high >>> 0) : zero;
};

/**
 * Converts this long bits to a possibly unsafe JavaScript number.
 * @param {boolean} [unsigned=false] Whether unsigned or not
 * @returns {number} Possibly unsafe number
 */
LongBits.prototype.toNumber = function toNumber(unsigned) {
    if (!unsigned && this.hi >>> 31) {
        var lo = ~this.lo + 1 >>> 0,
            hi = ~this.hi     >>> 0;
        if (!lo)
            hi = hi + 1 >>> 0;
        return -(lo + hi * 4294967296);
    }
    return this.lo + this.hi * 4294967296;
};

/**
 * Converts this long bits to a long.
 * @param {boolean} [unsigned=false] Whether unsigned or not
 * @returns {Long} Long
 */
LongBits.prototype.toLong = function toLong(unsigned) {
    return util.Long
        ? new util.Long(this.lo | 0, this.hi | 0, Boolean(unsigned))
        /* istanbul ignore next */
        : { low: this.lo | 0, high: this.hi | 0, unsigned: Boolean(unsigned) };
};

var charCodeAt = String.prototype.charCodeAt;

/**
 * Constructs new long bits from the specified 8 characters long hash.
 * @param {string} hash Hash
 * @returns {util.LongBits} Bits
 */
LongBits.fromHash = function fromHash(hash) {
    if (hash === zeroHash)
        return zero;
    return new LongBits(
        ( charCodeAt.call(hash, 0)
        | charCodeAt.call(hash, 1) << 8
        | charCodeAt.call(hash, 2) << 16
        | charCodeAt.call(hash, 3) << 24) >>> 0
    ,
        ( charCodeAt.call(hash, 4)
        | charCodeAt.call(hash, 5) << 8
        | charCodeAt.call(hash, 6) << 16
        | charCodeAt.call(hash, 7) << 24) >>> 0
    );
};

/**
 * Converts this long bits to a 8 characters long hash.
 * @returns {string} Hash
 */
LongBits.prototype.toHash = function toHash() {
    return String.fromCharCode(
        this.lo        & 255,
        this.lo >>> 8  & 255,
        this.lo >>> 16 & 255,
        this.lo >>> 24      ,
        this.hi        & 255,
        this.hi >>> 8  & 255,
        this.hi >>> 16 & 255,
        this.hi >>> 24
    );
};

/**
 * Zig-zag encodes this long bits.
 * @returns {util.LongBits} `this`
 */
LongBits.prototype.zzEncode = function zzEncode() {
    var mask =   this.hi >> 31;
    this.hi  = ((this.hi << 1 | this.lo >>> 31) ^ mask) >>> 0;
    this.lo  = ( this.lo << 1                   ^ mask) >>> 0;
    return this;
};

/**
 * Zig-zag decodes this long bits.
 * @returns {util.LongBits} `this`
 */
LongBits.prototype.zzDecode = function zzDecode() {
    var mask = -(this.lo & 1);
    this.lo  = ((this.lo >>> 1 | this.hi << 31) ^ mask) >>> 0;
    this.hi  = ( this.hi >>> 1                  ^ mask) >>> 0;
    return this;
};

/**
 * Calculates the length of this longbits when encoded as a varint.
 * @returns {number} Length
 */
LongBits.prototype.length = function length() {
    var part0 =  this.lo,
        part1 = (this.lo >>> 28 | this.hi << 4) >>> 0,
        part2 =  this.hi >>> 24;
    return part2 === 0
         ? part1 === 0
           ? part0 < 16384
             ? part0 < 128 ? 1 : 2
             : part0 < 2097152 ? 3 : 4
           : part1 < 16384
             ? part1 < 128 ? 5 : 6
             : part1 < 2097152 ? 7 : 8
         : part2 < 128 ? 9 : 10;
};

},{"../util/minimal":43}],43:[function(require,module,exports){
(function (global){(function (){
"use strict";
var util = exports;

// used to return a Promise where callback is omitted
util.asPromise = require("@protobufjs/aspromise");

// converts to / from base64 encoded strings
util.base64 = require("@protobufjs/base64");

// base class of rpc.Service
util.EventEmitter = require("@protobufjs/eventemitter");

// float handling accross browsers
util.float = require("@protobufjs/float");

// requires modules optionally and hides the call from bundlers
util.inquire = require("@protobufjs/inquire");

// converts to / from utf8 encoded strings
util.utf8 = require("@protobufjs/utf8");

// provides a node-like buffer pool in the browser
util.pool = require("@protobufjs/pool");

// utility to work with the low and high bits of a 64 bit value
util.LongBits = require("./longbits");

/**
 * Whether running within node or not.
 * @memberof util
 * @type {boolean}
 */
util.isNode = Boolean(typeof global !== "undefined"
                   && global
                   && global.process
                   && global.process.versions
                   && global.process.versions.node);

/**
 * Global object reference.
 * @memberof util
 * @type {Object}
 */
util.global = util.isNode && global
           || typeof window !== "undefined" && window
           || typeof self   !== "undefined" && self
           || this; // eslint-disable-line no-invalid-this

/**
 * An immuable empty array.
 * @memberof util
 * @type {Array.<*>}
 * @const
 */
util.emptyArray = Object.freeze ? Object.freeze([]) : /* istanbul ignore next */ []; // used on prototypes

/**
 * An immutable empty object.
 * @type {Object}
 * @const
 */
util.emptyObject = Object.freeze ? Object.freeze({}) : /* istanbul ignore next */ {}; // used on prototypes

/**
 * Tests if the specified value is an integer.
 * @function
 * @param {*} value Value to test
 * @returns {boolean} `true` if the value is an integer
 */
util.isInteger = Number.isInteger || /* istanbul ignore next */ function isInteger(value) {
    return typeof value === "number" && isFinite(value) && Math.floor(value) === value;
};

/**
 * Tests if the specified value is a string.
 * @param {*} value Value to test
 * @returns {boolean} `true` if the value is a string
 */
util.isString = function isString(value) {
    return typeof value === "string" || value instanceof String;
};

/**
 * Tests if the specified value is a non-null object.
 * @param {*} value Value to test
 * @returns {boolean} `true` if the value is a non-null object
 */
util.isObject = function isObject(value) {
    return value && typeof value === "object";
};

/**
 * Checks if a property on a message is considered to be present.
 * This is an alias of {@link util.isSet}.
 * @function
 * @param {Object} obj Plain object or message instance
 * @param {string} prop Property name
 * @returns {boolean} `true` if considered to be present, otherwise `false`
 */
util.isset =

/**
 * Checks if a property on a message is considered to be present.
 * @param {Object} obj Plain object or message instance
 * @param {string} prop Property name
 * @returns {boolean} `true` if considered to be present, otherwise `false`
 */
util.isSet = function isSet(obj, prop) {
    var value = obj[prop];
    if (value != null && obj.hasOwnProperty(prop)) // eslint-disable-line eqeqeq, no-prototype-builtins
        return typeof value !== "object" || (Array.isArray(value) ? value.length : Object.keys(value).length) > 0;
    return false;
};

/**
 * Any compatible Buffer instance.
 * This is a minimal stand-alone definition of a Buffer instance. The actual type is that exported by node's typings.
 * @interface Buffer
 * @extends Uint8Array
 */

/**
 * Node's Buffer class if available.
 * @type {Constructor<Buffer>}
 */
util.Buffer = (function() {
    try {
        var Buffer = util.inquire("buffer").Buffer;
        // refuse to use non-node buffers if not explicitly assigned (perf reasons):
        return Buffer.prototype.utf8Write ? Buffer : /* istanbul ignore next */ null;
    } catch (e) {
        /* istanbul ignore next */
        return null;
    }
})();

// Internal alias of or polyfull for Buffer.from.
util._Buffer_from = null;

// Internal alias of or polyfill for Buffer.allocUnsafe.
util._Buffer_allocUnsafe = null;

/**
 * Creates a new buffer of whatever type supported by the environment.
 * @param {number|number[]} [sizeOrArray=0] Buffer size or number array
 * @returns {Uint8Array|Buffer} Buffer
 */
util.newBuffer = function newBuffer(sizeOrArray) {
    /* istanbul ignore next */
    return typeof sizeOrArray === "number"
        ? util.Buffer
            ? util._Buffer_allocUnsafe(sizeOrArray)
            : new util.Array(sizeOrArray)
        : util.Buffer
            ? util._Buffer_from(sizeOrArray)
            : typeof Uint8Array === "undefined"
                ? sizeOrArray
                : new Uint8Array(sizeOrArray);
};

/**
 * Array implementation used in the browser. `Uint8Array` if supported, otherwise `Array`.
 * @type {Constructor<Uint8Array>}
 */
util.Array = typeof Uint8Array !== "undefined" ? Uint8Array /* istanbul ignore next */ : Array;

/**
 * Any compatible Long instance.
 * This is a minimal stand-alone definition of a Long instance. The actual type is that exported by long.js.
 * @interface Long
 * @property {number} low Low bits
 * @property {number} high High bits
 * @property {boolean} unsigned Whether unsigned or not
 */

/**
 * Long.js's Long class if available.
 * @type {Constructor<Long>}
 */
util.Long = /* istanbul ignore next */ util.global.dcodeIO && /* istanbul ignore next */ util.global.dcodeIO.Long
         || /* istanbul ignore next */ util.global.Long
         || util.inquire("long");

/**
 * Regular expression used to verify 2 bit (`bool`) map keys.
 * @type {RegExp}
 * @const
 */
util.key2Re = /^true|false|0|1$/;

/**
 * Regular expression used to verify 32 bit (`int32` etc.) map keys.
 * @type {RegExp}
 * @const
 */
util.key32Re = /^-?(?:0|[1-9][0-9]*)$/;

/**
 * Regular expression used to verify 64 bit (`int64` etc.) map keys.
 * @type {RegExp}
 * @const
 */
util.key64Re = /^(?:[\\x00-\\xff]{8}|-?(?:0|[1-9][0-9]*))$/;

/**
 * Converts a number or long to an 8 characters long hash string.
 * @param {Long|number} value Value to convert
 * @returns {string} Hash
 */
util.longToHash = function longToHash(value) {
    return value
        ? util.LongBits.from(value).toHash()
        : util.LongBits.zeroHash;
};

/**
 * Converts an 8 characters long hash string to a long or number.
 * @param {string} hash Hash
 * @param {boolean} [unsigned=false] Whether unsigned or not
 * @returns {Long|number} Original value
 */
util.longFromHash = function longFromHash(hash, unsigned) {
    var bits = util.LongBits.fromHash(hash);
    if (util.Long)
        return util.Long.fromBits(bits.lo, bits.hi, unsigned);
    return bits.toNumber(Boolean(unsigned));
};

/**
 * Merges the properties of the source object into the destination object.
 * @memberof util
 * @param {Object.<string,*>} dst Destination object
 * @param {Object.<string,*>} src Source object
 * @param {boolean} [ifNotSet=false] Merges only if the key is not already set
 * @returns {Object.<string,*>} Destination object
 */
function merge(dst, src, ifNotSet) { // used by converters
    for (var keys = Object.keys(src), i = 0; i < keys.length; ++i)
        if (dst[keys[i]] === undefined || !ifNotSet)
            dst[keys[i]] = src[keys[i]];
    return dst;
}

util.merge = merge;

/**
 * Converts the first character of a string to lower case.
 * @param {string} str String to convert
 * @returns {string} Converted string
 */
util.lcFirst = function lcFirst(str) {
    return str.charAt(0).toLowerCase() + str.substring(1);
};

/**
 * Creates a custom error constructor.
 * @memberof util
 * @param {string} name Error name
 * @returns {Constructor<Error>} Custom error constructor
 */
function newError(name) {

    function CustomError(message, properties) {

        if (!(this instanceof CustomError))
            return new CustomError(message, properties);

        // Error.call(this, message);
        // ^ just returns a new error instance because the ctor can be called as a function

        Object.defineProperty(this, "message", { get: function() { return message; } });

        /* istanbul ignore next */
        if (Error.captureStackTrace) // node
            Error.captureStackTrace(this, CustomError);
        else
            Object.defineProperty(this, "stack", { value: new Error().stack || "" });

        if (properties)
            merge(this, properties);
    }

    CustomError.prototype = Object.create(Error.prototype, {
        constructor: {
            value: CustomError,
            writable: true,
            enumerable: false,
            configurable: true,
        },
        name: {
            get: function get() { return name; },
            set: undefined,
            enumerable: false,
            // configurable: false would accurately preserve the behavior of
            // the original, but I'm guessing that was not intentional.
            // For an actual error subclass, this property would
            // be configurable.
            configurable: true,
        },
        toString: {
            value: function value() { return this.name + ": " + this.message; },
            writable: true,
            enumerable: false,
            configurable: true,
        },
    });

    return CustomError;
}

util.newError = newError;

/**
 * Constructs a new protocol error.
 * @classdesc Error subclass indicating a protocol specifc error.
 * @memberof util
 * @extends Error
 * @template T extends Message<T>
 * @constructor
 * @param {string} message Error message
 * @param {Object.<string,*>} [properties] Additional properties
 * @example
 * try {
 *     MyMessage.decode(someBuffer); // throws if required fields are missing
 * } catch (e) {
 *     if (e instanceof ProtocolError && e.instance)
 *         console.log("decoded so far: " + JSON.stringify(e.instance));
 * }
 */
util.ProtocolError = newError("ProtocolError");

/**
 * So far decoded message instance.
 * @name util.ProtocolError#instance
 * @type {Message<T>}
 */

/**
 * A OneOf getter as returned by {@link util.oneOfGetter}.
 * @typedef OneOfGetter
 * @type {function}
 * @returns {string|undefined} Set field name, if any
 */

/**
 * Builds a getter for a oneof's present field name.
 * @param {string[]} fieldNames Field names
 * @returns {OneOfGetter} Unbound getter
 */
util.oneOfGetter = function getOneOf(fieldNames) {
    var fieldMap = {};
    for (var i = 0; i < fieldNames.length; ++i)
        fieldMap[fieldNames[i]] = 1;

    /**
     * @returns {string|undefined} Set field name, if any
     * @this Object
     * @ignore
     */
    return function() { // eslint-disable-line consistent-return
        for (var keys = Object.keys(this), i = keys.length - 1; i > -1; --i)
            if (fieldMap[keys[i]] === 1 && this[keys[i]] !== undefined && this[keys[i]] !== null)
                return keys[i];
    };
};

/**
 * A OneOf setter as returned by {@link util.oneOfSetter}.
 * @typedef OneOfSetter
 * @type {function}
 * @param {string|undefined} value Field name
 * @returns {undefined}
 */

/**
 * Builds a setter for a oneof's present field name.
 * @param {string[]} fieldNames Field names
 * @returns {OneOfSetter} Unbound setter
 */
util.oneOfSetter = function setOneOf(fieldNames) {

    /**
     * @param {string} name Field name
     * @returns {undefined}
     * @this Object
     * @ignore
     */
    return function(name) {
        for (var i = 0; i < fieldNames.length; ++i)
            if (fieldNames[i] !== name)
                delete this[fieldNames[i]];
    };
};

/**
 * Default conversion options used for {@link Message#toJSON} implementations.
 *
 * These options are close to proto3's JSON mapping with the exception that internal types like Any are handled just like messages. More precisely:
 *
 * - Longs become strings
 * - Enums become string keys
 * - Bytes become base64 encoded strings
 * - (Sub-)Messages become plain objects
 * - Maps become plain objects with all string keys
 * - Repeated fields become arrays
 * - NaN and Infinity for float and double fields become strings
 *
 * @type {IConversionOptions}
 * @see https://developers.google.com/protocol-buffers/docs/proto3?hl=en#json
 */
util.toJSONOptions = {
    longs: String,
    enums: String,
    bytes: String,
    json: true
};

// Sets up buffer utility according to the environment (called in index-minimal)
util._configure = function() {
    var Buffer = util.Buffer;
    /* istanbul ignore if */
    if (!Buffer) {
        util._Buffer_from = util._Buffer_allocUnsafe = null;
        return;
    }
    // because node 4.x buffers are incompatible & immutable
    // see: https://github.com/dcodeIO/protobuf.js/pull/665
    util._Buffer_from = Buffer.from !== Uint8Array.from && Buffer.from ||
        /* istanbul ignore next */
        function Buffer_from(value, encoding) {
            return new Buffer(value, encoding);
        };
    util._Buffer_allocUnsafe = Buffer.allocUnsafe ||
        /* istanbul ignore next */
        function Buffer_allocUnsafe(size) {
            return new Buffer(size);
        };
};

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./longbits":42,"@protobufjs/aspromise":13,"@protobufjs/base64":14,"@protobufjs/eventemitter":15,"@protobufjs/float":16,"@protobufjs/inquire":17,"@protobufjs/pool":18,"@protobufjs/utf8":19}],44:[function(require,module,exports){
"use strict";
module.exports = Writer;

var util      = require("./util/minimal");

var BufferWriter; // cyclic

var LongBits  = util.LongBits,
    base64    = util.base64,
    utf8      = util.utf8;

/**
 * Constructs a new writer operation instance.
 * @classdesc Scheduled writer operation.
 * @constructor
 * @param {function(*, Uint8Array, number)} fn Function to call
 * @param {number} len Value byte length
 * @param {*} val Value to write
 * @ignore
 */
function Op(fn, len, val) {

    /**
     * Function to call.
     * @type {function(Uint8Array, number, *)}
     */
    this.fn = fn;

    /**
     * Value byte length.
     * @type {number}
     */
    this.len = len;

    /**
     * Next operation.
     * @type {Writer.Op|undefined}
     */
    this.next = undefined;

    /**
     * Value to write.
     * @type {*}
     */
    this.val = val; // type varies
}

/* istanbul ignore next */
function noop() {} // eslint-disable-line no-empty-function

/**
 * Constructs a new writer state instance.
 * @classdesc Copied writer state.
 * @memberof Writer
 * @constructor
 * @param {Writer} writer Writer to copy state from
 * @ignore
 */
function State(writer) {

    /**
     * Current head.
     * @type {Writer.Op}
     */
    this.head = writer.head;

    /**
     * Current tail.
     * @type {Writer.Op}
     */
    this.tail = writer.tail;

    /**
     * Current buffer length.
     * @type {number}
     */
    this.len = writer.len;

    /**
     * Next state.
     * @type {State|null}
     */
    this.next = writer.states;
}

/**
 * Constructs a new writer instance.
 * @classdesc Wire format writer using `Uint8Array` if available, otherwise `Array`.
 * @constructor
 */
function Writer() {

    /**
     * Current length.
     * @type {number}
     */
    this.len = 0;

    /**
     * Operations head.
     * @type {Object}
     */
    this.head = new Op(noop, 0, 0);

    /**
     * Operations tail
     * @type {Object}
     */
    this.tail = this.head;

    /**
     * Linked forked states.
     * @type {Object|null}
     */
    this.states = null;

    // When a value is written, the writer calculates its byte length and puts it into a linked
    // list of operations to perform when finish() is called. This both allows us to allocate
    // buffers of the exact required size and reduces the amount of work we have to do compared
    // to first calculating over objects and then encoding over objects. In our case, the encoding
    // part is just a linked list walk calling operations with already prepared values.
}

var create = function create() {
    return util.Buffer
        ? function create_buffer_setup() {
            return (Writer.create = function create_buffer() {
                return new BufferWriter();
            })();
        }
        /* istanbul ignore next */
        : function create_array() {
            return new Writer();
        };
};

/**
 * Creates a new writer.
 * @function
 * @returns {BufferWriter|Writer} A {@link BufferWriter} when Buffers are supported, otherwise a {@link Writer}
 */
Writer.create = create();

/**
 * Allocates a buffer of the specified size.
 * @param {number} size Buffer size
 * @returns {Uint8Array} Buffer
 */
Writer.alloc = function alloc(size) {
    return new util.Array(size);
};

// Use Uint8Array buffer pool in the browser, just like node does with buffers
/* istanbul ignore else */
if (util.Array !== Array)
    Writer.alloc = util.pool(Writer.alloc, util.Array.prototype.subarray);

/**
 * Pushes a new operation to the queue.
 * @param {function(Uint8Array, number, *)} fn Function to call
 * @param {number} len Value byte length
 * @param {number} val Value to write
 * @returns {Writer} `this`
 * @private
 */
Writer.prototype._push = function push(fn, len, val) {
    this.tail = this.tail.next = new Op(fn, len, val);
    this.len += len;
    return this;
};

function writeByte(val, buf, pos) {
    buf[pos] = val & 255;
}

function writeVarint32(val, buf, pos) {
    while (val > 127) {
        buf[pos++] = val & 127 | 128;
        val >>>= 7;
    }
    buf[pos] = val;
}

/**
 * Constructs a new varint writer operation instance.
 * @classdesc Scheduled varint writer operation.
 * @extends Op
 * @constructor
 * @param {number} len Value byte length
 * @param {number} val Value to write
 * @ignore
 */
function VarintOp(len, val) {
    this.len = len;
    this.next = undefined;
    this.val = val;
}

VarintOp.prototype = Object.create(Op.prototype);
VarintOp.prototype.fn = writeVarint32;

/**
 * Writes an unsigned 32 bit value as a varint.
 * @param {number} value Value to write
 * @returns {Writer} `this`
 */
Writer.prototype.uint32 = function write_uint32(value) {
    // here, the call to this.push has been inlined and a varint specific Op subclass is used.
    // uint32 is by far the most frequently used operation and benefits significantly from this.
    this.len += (this.tail = this.tail.next = new VarintOp(
        (value = value >>> 0)
                < 128       ? 1
        : value < 16384     ? 2
        : value < 2097152   ? 3
        : value < 268435456 ? 4
        :                     5,
    value)).len;
    return this;
};

/**
 * Writes a signed 32 bit value as a varint.
 * @function
 * @param {number} value Value to write
 * @returns {Writer} `this`
 */
Writer.prototype.int32 = function write_int32(value) {
    return value < 0
        ? this._push(writeVarint64, 10, LongBits.fromNumber(value)) // 10 bytes per spec
        : this.uint32(value);
};

/**
 * Writes a 32 bit value as a varint, zig-zag encoded.
 * @param {number} value Value to write
 * @returns {Writer} `this`
 */
Writer.prototype.sint32 = function write_sint32(value) {
    return this.uint32((value << 1 ^ value >> 31) >>> 0);
};

function writeVarint64(val, buf, pos) {
    while (val.hi) {
        buf[pos++] = val.lo & 127 | 128;
        val.lo = (val.lo >>> 7 | val.hi << 25) >>> 0;
        val.hi >>>= 7;
    }
    while (val.lo > 127) {
        buf[pos++] = val.lo & 127 | 128;
        val.lo = val.lo >>> 7;
    }
    buf[pos++] = val.lo;
}

/**
 * Writes an unsigned 64 bit value as a varint.
 * @param {Long|number|string} value Value to write
 * @returns {Writer} `this`
 * @throws {TypeError} If `value` is a string and no long library is present.
 */
Writer.prototype.uint64 = function write_uint64(value) {
    var bits = LongBits.from(value);
    return this._push(writeVarint64, bits.length(), bits);
};

/**
 * Writes a signed 64 bit value as a varint.
 * @function
 * @param {Long|number|string} value Value to write
 * @returns {Writer} `this`
 * @throws {TypeError} If `value` is a string and no long library is present.
 */
Writer.prototype.int64 = Writer.prototype.uint64;

/**
 * Writes a signed 64 bit value as a varint, zig-zag encoded.
 * @param {Long|number|string} value Value to write
 * @returns {Writer} `this`
 * @throws {TypeError} If `value` is a string and no long library is present.
 */
Writer.prototype.sint64 = function write_sint64(value) {
    var bits = LongBits.from(value).zzEncode();
    return this._push(writeVarint64, bits.length(), bits);
};

/**
 * Writes a boolish value as a varint.
 * @param {boolean} value Value to write
 * @returns {Writer} `this`
 */
Writer.prototype.bool = function write_bool(value) {
    return this._push(writeByte, 1, value ? 1 : 0);
};

function writeFixed32(val, buf, pos) {
    buf[pos    ] =  val         & 255;
    buf[pos + 1] =  val >>> 8   & 255;
    buf[pos + 2] =  val >>> 16  & 255;
    buf[pos + 3] =  val >>> 24;
}

/**
 * Writes an unsigned 32 bit value as fixed 32 bits.
 * @param {number} value Value to write
 * @returns {Writer} `this`
 */
Writer.prototype.fixed32 = function write_fixed32(value) {
    return this._push(writeFixed32, 4, value >>> 0);
};

/**
 * Writes a signed 32 bit value as fixed 32 bits.
 * @function
 * @param {number} value Value to write
 * @returns {Writer} `this`
 */
Writer.prototype.sfixed32 = Writer.prototype.fixed32;

/**
 * Writes an unsigned 64 bit value as fixed 64 bits.
 * @param {Long|number|string} value Value to write
 * @returns {Writer} `this`
 * @throws {TypeError} If `value` is a string and no long library is present.
 */
Writer.prototype.fixed64 = function write_fixed64(value) {
    var bits = LongBits.from(value);
    return this._push(writeFixed32, 4, bits.lo)._push(writeFixed32, 4, bits.hi);
};

/**
 * Writes a signed 64 bit value as fixed 64 bits.
 * @function
 * @param {Long|number|string} value Value to write
 * @returns {Writer} `this`
 * @throws {TypeError} If `value` is a string and no long library is present.
 */
Writer.prototype.sfixed64 = Writer.prototype.fixed64;

/**
 * Writes a float (32 bit).
 * @function
 * @param {number} value Value to write
 * @returns {Writer} `this`
 */
Writer.prototype.float = function write_float(value) {
    return this._push(util.float.writeFloatLE, 4, value);
};

/**
 * Writes a double (64 bit float).
 * @function
 * @param {number} value Value to write
 * @returns {Writer} `this`
 */
Writer.prototype.double = function write_double(value) {
    return this._push(util.float.writeDoubleLE, 8, value);
};

var writeBytes = util.Array.prototype.set
    ? function writeBytes_set(val, buf, pos) {
        buf.set(val, pos); // also works for plain array values
    }
    /* istanbul ignore next */
    : function writeBytes_for(val, buf, pos) {
        for (var i = 0; i < val.length; ++i)
            buf[pos + i] = val[i];
    };

/**
 * Writes a sequence of bytes.
 * @param {Uint8Array|string} value Buffer or base64 encoded string to write
 * @returns {Writer} `this`
 */
Writer.prototype.bytes = function write_bytes(value) {
    var len = value.length >>> 0;
    if (!len)
        return this._push(writeByte, 1, 0);
    if (util.isString(value)) {
        var buf = Writer.alloc(len = base64.length(value));
        base64.decode(value, buf, 0);
        value = buf;
    }
    return this.uint32(len)._push(writeBytes, len, value);
};

/**
 * Writes a string.
 * @param {string} value Value to write
 * @returns {Writer} `this`
 */
Writer.prototype.string = function write_string(value) {
    var len = utf8.length(value);
    return len
        ? this.uint32(len)._push(utf8.write, len, value)
        : this._push(writeByte, 1, 0);
};

/**
 * Forks this writer's state by pushing it to a stack.
 * Calling {@link Writer#reset|reset} or {@link Writer#ldelim|ldelim} resets the writer to the previous state.
 * @returns {Writer} `this`
 */
Writer.prototype.fork = function fork() {
    this.states = new State(this);
    this.head = this.tail = new Op(noop, 0, 0);
    this.len = 0;
    return this;
};

/**
 * Resets this instance to the last state.
 * @returns {Writer} `this`
 */
Writer.prototype.reset = function reset() {
    if (this.states) {
        this.head   = this.states.head;
        this.tail   = this.states.tail;
        this.len    = this.states.len;
        this.states = this.states.next;
    } else {
        this.head = this.tail = new Op(noop, 0, 0);
        this.len  = 0;
    }
    return this;
};

/**
 * Resets to the last state and appends the fork state's current write length as a varint followed by its operations.
 * @returns {Writer} `this`
 */
Writer.prototype.ldelim = function ldelim() {
    var head = this.head,
        tail = this.tail,
        len  = this.len;
    this.reset().uint32(len);
    if (len) {
        this.tail.next = head.next; // skip noop
        this.tail = tail;
        this.len += len;
    }
    return this;
};

/**
 * Finishes the write operation.
 * @returns {Uint8Array} Finished buffer
 */
Writer.prototype.finish = function finish() {
    var head = this.head.next, // skip noop
        buf  = this.constructor.alloc(this.len),
        pos  = 0;
    while (head) {
        head.fn(head.val, buf, pos);
        pos += head.len;
        head = head.next;
    }
    // this.head = this.tail = null;
    return buf;
};

Writer._configure = function(BufferWriter_) {
    BufferWriter = BufferWriter_;
    Writer.create = create();
    BufferWriter._configure();
};

},{"./util/minimal":43}],45:[function(require,module,exports){
"use strict";
module.exports = BufferWriter;

// extends Writer
var Writer = require("./writer");
(BufferWriter.prototype = Object.create(Writer.prototype)).constructor = BufferWriter;

var util = require("./util/minimal");

/**
 * Constructs a new buffer writer instance.
 * @classdesc Wire format writer using node buffers.
 * @extends Writer
 * @constructor
 */
function BufferWriter() {
    Writer.call(this);
}

BufferWriter._configure = function () {
    /**
     * Allocates a buffer of the specified size.
     * @function
     * @param {number} size Buffer size
     * @returns {Buffer} Buffer
     */
    BufferWriter.alloc = util._Buffer_allocUnsafe;

    BufferWriter.writeBytesBuffer = util.Buffer && util.Buffer.prototype instanceof Uint8Array && util.Buffer.prototype.set.name === "set"
        ? function writeBytesBuffer_set(val, buf, pos) {
          buf.set(val, pos); // faster than copy (requires node >= 4 where Buffers extend Uint8Array and set is properly inherited)
          // also works for plain array values
        }
        /* istanbul ignore next */
        : function writeBytesBuffer_copy(val, buf, pos) {
          if (val.copy) // Buffer values
            val.copy(buf, pos, 0, val.length);
          else for (var i = 0; i < val.length;) // plain array values
            buf[pos++] = val[i++];
        };
};


/**
 * @override
 */
BufferWriter.prototype.bytes = function write_bytes_buffer(value) {
    if (util.isString(value))
        value = util._Buffer_from(value, "base64");
    var len = value.length >>> 0;
    this.uint32(len);
    if (len)
        this._push(BufferWriter.writeBytesBuffer, len, value);
    return this;
};

function writeStringBuffer(val, buf, pos) {
    if (val.length < 40) // plain js is faster for short strings (probably due to redundant assertions)
        util.utf8.write(val, buf, pos);
    else if (buf.utf8Write)
        buf.utf8Write(val, pos);
    else
        buf.write(val, pos);
}

/**
 * @override
 */
BufferWriter.prototype.string = function write_string_buffer(value) {
    var len = util.Buffer.byteLength(value);
    this.uint32(len);
    if (len)
        this._push(writeStringBuffer, len, value);
    return this;
};


/**
 * Finishes the write operation.
 * @name BufferWriter#finish
 * @function
 * @returns {Buffer} Finished buffer
 */

BufferWriter._configure();

},{"./util/minimal":43,"./writer":44}]},{},[2]);
