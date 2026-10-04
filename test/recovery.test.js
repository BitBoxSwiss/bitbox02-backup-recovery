// SPDX-License-Identifier: Apache-2.0

const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');
const Protobuf = require('../js/protobuf_backup_messages');
const hasValidChecksum = require('../js/checksum');

// Independently calculated SHA-256 vectors for the firmware's fixed-width layout:
// <uint32 timestamp, uint8 mode, name[64], uint32 seed_length, seed[32],
//  uint32 birthdate, generator[20], uint32 length>, with little-endian integers.
const checksums = {
    16: '481374a9eb5ee4b86f8179ebe44213792186e454b81a84f944ece963b3efef69',
    24: '1f5d3703421fc4564fecc388eb74039457621e0579d5d3f97eb93fce12b8b3b6',
    32: '0e198f12c4e4a6d5a858ddf7bcbc8563f685be3f230274d262ddb3dd407f0701',
};

function fixture(seedLength = 32) {
    const seed = Buffer.alloc(32);
    seed.fill(0xa5, 0, seedLength);
    return {
        content: Protobuf.BackupContent.create({
            metadata: { timestamp: 1700000000, mode: 0, name: 'Recovery café' },
            checksum: Buffer.from(checksums[seedLength], 'hex'),
            length: 0,
        }),
        data: Protobuf.BackupData.create({
            seedLength, seed, birthdate: 1600000000, generator: 'v9.27.1',
        }),
    };
}

function encode({ content, data }) {
    content.data = Protobuf.BackupData.encode(data).finish();
    return Protobuf.Backup.encode({ backupV1: { content } }).finish();
}

// Exercise the actual shipped bundle through its file-input handler. Only the
// browser's DOM/FileReader surface is stubbed; decoding, hashing and BIP39 are real.
function recoveryPage() {
    let onInput;
    const elements = {
        'the-file-input': { addEventListener: (event, handler) => { onInput = handler; } },
        'backup-warning': { hidden: true },
        'backup-bip39': { value: '' },
        'seed-timestamp': {},
        'firmware-version': {},
        'backup-name': {},
    };
    class FileReader {
        readAsArrayBuffer(bytes) {
            this.onloadend({ target: { result: Uint8Array.from(bytes).buffer } });
        }
    }
    vm.runInNewContext(readFileSync(path.join(__dirname, '../js/get_backup_bundled.js'), 'utf8'), {
        document: { getElementById: id => elements[id] },
        FileReader, Uint8Array, ArrayBuffer, TextEncoder, setTimeout, clearTimeout,
    });
    return { elements, load: backup => onInput.call({ files: [encode(backup)] }) };
}

for (const seedLength of [16, 24, 32]) {
    test(`valid ${seedLength}-byte seed: matching checksum and no warning`, () => {
        const backup = fixture(seedLength);
        assert.equal(hasValidChecksum(backup.content, backup.data), true);
        const page = recoveryPage();
        page.load(backup);
        assert.equal(page.elements['backup-warning'].hidden, true);
        assert.equal(page.elements['backup-bip39'].value.split(' ').length, seedLength * 3 / 4);
    });
}

const changes = {
    timestamp: b => { b.content.metadata.timestamp++; },
    mode: b => { b.content.metadata.mode = 1; },
    name: b => { b.content.metadata.name = 'Changed'; },
    seedLength: b => { b.data.seedLength = 24; },
    seed: b => { b.data.seed[0] ^= 1; },
    birthdate: b => { b.data.birthdate++; },
    generator: b => { b.data.generator = 'Other'; },
    length: b => { b.content.length = 1; },
    checksum: b => { b.content.checksum[0] ^= 1; },
    missingChecksum: b => { b.content.checksum = Buffer.alloc(0); },
    shortChecksum: b => { b.content.checksum = b.content.checksum.subarray(1); },
    shortSeedField: b => { b.data.seed = b.data.seed.subarray(0, 16); b.data.seedLength = 16; },
    longSeedField: b => { b.data.seed = Buffer.concat([b.data.seed, Buffer.alloc(1)]); },
    missingMetadata: b => { b.content.metadata = null; },
    overlongName: b => { b.content.metadata.name = 'é'.repeat(33); },
    overlongGenerator: b => { b.data.generator = 'x'.repeat(21); },
};

for (const [field, change] of Object.entries(changes)) {
    test(`${field}: warn but still display the seed`, () => {
        const backup = fixture();
        change(backup);
        assert.equal(hasValidChecksum(backup.content, backup.data), false);
        const page = recoveryPage();
        page.load(backup);
        assert.equal(page.elements['backup-warning'].hidden, false);
        assert.notEqual(page.elements['backup-bip39'].value, '');
    });
}

test('metadata damage preserves the seed, and the next valid file clears the warning', () => {
    const page = recoveryPage();
    page.load(fixture());
    const phrase = page.elements['backup-bip39'].value;
    const damaged = fixture();
    damaged.content.metadata.name += '!';
    page.load(damaged);
    assert.equal(page.elements['backup-warning'].hidden, false);
    assert.equal(page.elements['backup-bip39'].value, phrase);
    page.load(fixture());
    assert.equal(page.elements['backup-warning'].hidden, true);
    assert.equal(page.elements['backup-bip39'].value, phrase);
});
