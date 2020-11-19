# BitBox02 Backup Recovery Tool

This tool can be used to restore a BIP39 wallet seed phrase from a BitBox02 backup.
Open the `backup.html` file with your browser, select the file from the SD card in the
tool and it will generate a BIP39 seed for you.

## Developing

### Re-Generating the Protobuf Messages

Install the protobufjs tool globally with:

    npm install -g protobuf.js

Then run:

    pbjs -t static-module -w commonjs -o ./js/protobuf_backup_messages.js ./messages/backup.proto

### Bundling for web view

On first use download the node modules while in the project's root directory with:

    npm install

Also install browserify globally:

    npm install -g browserify

The protobuf generated `js/protobuf_backup_messages.js` file is then bundled with the
protobuf and bip39 dependencies into the `js/get_backup.js` file with browserify:

    browserify js/get_backup.js -o js/get_backup_bundled.js

The generated `js/get_backup_bundled.js` script is the only included script in
`backup.html`.
