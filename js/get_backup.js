// Copyright 2019 Shift Cryptosecurity AG
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

const Backup = Protobuf.Backup;
const BackupData = Protobuf.BackupData;

function deserializeThis(messageBytes) {
    const err = Backup.verify(messageBytes);
    if (err) {
        alert("Error verifying the backup serialization. Pleaes try using another file: ", err);
        return;
    }
    const backup = Backup.decode(new Uint8Array(messageBytes));
    const backupData = BackupData.decode(new Uint8Array(backup.backupV1.content.data));
    const seedwords = bip39.entropyToMnemonic(backupData.seed);
    document.getElementById("backup-bip39").value = seedwords;
    const date = new Date(backupData.birthdate*1000)
    document.getElementById("seed-timestamp").innerText = date;
    document.getElementById("firmware-version").innerText = backupData.generator;
}

document.getElementById("the-file-input").addEventListener("input", function () {
    // get the file instance. The file has a blob prototype that can be read
    const file = this.files[0];

    // test reading as array buffer
    const fileReader = new FileReader();
    fileReader.onloadend = function(event) {
        deserializeThis(event.target.result);
    }
    fileReader.readAsArrayBuffer(file);
});


