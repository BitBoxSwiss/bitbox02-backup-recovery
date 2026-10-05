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
