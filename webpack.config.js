const path = require('path');

module.exports = {
    entry: './src/index.ts', // Punkt wejścia dla biblioteki
    output: {
        path: path.resolve(__dirname, 'dist'), // Katalog wyjściowy
        filename: 'widget-library.js', // Nazwa pliku wynikowego
        library: 'X', // Nazwa globalnej zmiennej, która będzie dostępna w przeglądarce
        libraryTarget: 'umd', // Format UMD, aby można było używać w Node.js, AMD i jako globalny skrypt w przeglądarce
        globalObject: 'this', // Potrzebne dla poprawnego działania w Node.js
    },
    module: {
        rules: [
            {
                test: /\.ts$/, // Reguła dla plików .ts
                use: 'ts-loader', // Użycie ts-loader do kompilacji TypeScriptu
                exclude: /node_modules/, // Wykluczenie node_modules
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'], // Możliwe rozszerzenia do zaimportowania
    },
    devtool: 'source-map', // Wygenerowanie mapy źródeł do debugowania
    mode: 'production', // Tryb produkcyjny
};
