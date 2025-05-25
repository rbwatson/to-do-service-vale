#!/usr/bin/env node

const fs = require('fs');

/**
 * Formats diagnostics from a JSON file and outputs them sorted by line/column.
 * Usage: node lint-format.js <json-file>
 *        node lint-format.js --help
 */

/**
 * Safely extracts the diagnostic code as a string.
 * @param {any} codeField
 * @returns {string}
 */
function extractCode(codeField) {
    if (typeof codeField === 'string') return codeField;
    if (codeField && typeof codeField.value === 'string') return codeField.value;
    return 'unknown';
}

function printHelp() {
    console.error('Usage: node lint-format.js <json-file> [options]');
    console.error('Example: node lint-format.js diagnostics.json');
    console.error('Options:');
    console.error('  -h, --help      Show this help message');
    console.error('  -s, --summary   Show summary output');
    console.error('  -m, --markdown  Format output for Markdown');
    console.error('  -c, --code      Enclose output in a plain text code fence');
    console.error('                  (-m and -c are mutually exclusive)');
}

// Utility to replace whitespace characters with a space
function cleanWhitespace(str) {
    return typeof str === 'string' ? str.replace(/[\r\n\t\f\v]+/g, ' ') : str;
}

function main() {
    // Check command line arguments
    const args = process.argv.slice(2);
    const showSummary = args.includes('-s') || args.includes('--summary');
    const markdown = args.includes('-m') || args.includes('--markdown');
    const codeFence = args.includes('-c') || args.includes('--code');
    const helpRequested = args.includes('-h') || args.includes('--help');

    // Check for mutually exclusive options
    if (markdown && codeFence) {
        console.error('Error: -m/--markdown and -c/--code options are mutually exclusive.');
        printHelp();
        process.exit(1);
    }

    // Remove flags to get the file path
    const filePath = args.find(arg => !arg.startsWith('-'));

    if (!filePath || helpRequested) {
        printHelp();
        process.exit(!filePath ? 1 : 0);
    }

    // Check if file exists
    if (!fs.existsSync(filePath)) {
        console.error(`Error: File '${filePath}' not found.`);
        process.exit(1);
    }

    try {
        // Read and parse JSON file
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const diagnostics = JSON.parse(fileContent);

        // Validate that we have an array
        if (!Array.isArray(diagnostics)) {
            console.error('Error: JSON file must contain an array of diagnostics.');
            process.exit(1);
        }

        // Validate required fields
        const validDiagnostics = diagnostics.filter(diagnostic => {
            return diagnostic.startLineNumber !== undefined &&
                   diagnostic.startColumn !== undefined &&
                   diagnostic.message !== undefined;
        });

        if (validDiagnostics.length === 0) {
            console.error('Error: No valid diagnostics found in file.');
            process.exit(1);
        }

        // Sort by startLineNumber, then by startColumn
        const sorted = validDiagnostics.sort((a, b) => {
            if (a.startLineNumber !== b.startLineNumber) {
                return a.startLineNumber - b.startLineNumber;
            }
            return a.startColumn - b.startColumn;
        });

        // Remove duplicates based on line, column, code, and message
        const unique = [];
        const seen = new Set();

        sorted.forEach(diagnostic => {
            const code = extractCode(diagnostic.code);
            const key = `${diagnostic.startLineNumber}-${diagnostic.startColumn}-${code}-${diagnostic.message}`;
            if (!seen.has(key)) {
                seen.add(key);
                unique.push(diagnostic);
            }
        });

        // Prepare output lines
        let outputLines = unique.map(diagnostic => {
            const line = diagnostic.startLineNumber;
            const column = diagnostic.startColumn;
            const code = diagnostic.code !== undefined ? extractCode(diagnostic.code) : ' ';
            // Clean whitespace in code and message
            const cleanCode = cleanWhitespace(code);
            const message = cleanWhitespace(diagnostic.message);
            if (markdown) {
                // Markdown table row
                return `| ${line} | ${column} | \`${cleanCode}\` | ${message} |`;
            } else {
                // Plain text
                return `[${line}, ${column}](${cleanCode}) ${message}`;
            }
        });

        // Output
        if (markdown) {
            // Markdown table header
            console.log('| Line | Column | Code | Message |');
            console.log('|------|--------|------|---------|');
            outputLines.forEach(line => console.log(line));
        } else if (codeFence) {
            console.log('```\n' + outputLines.join('\n') + '\n```');
        } else {
            outputLines.forEach(line => console.log(line));
        }

        // Output summary only if -s or --summary is present
        if (showSummary) {
            console.error(`\nProcessed ${unique.length} unique diagnostics from ${diagnostics.length} total entries.`);
        }

    } catch (error) {
        if (error instanceof SyntaxError) {
            console.error(`Error: Invalid JSON in file '${filePath}'.`);
            console.error(error.message);
        } else {
            console.error(`Error reading file '${filePath}':`, error.message);
        }
        process.exit(1);
    }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('Unexpected error:', error.message);
    process.exit(1);
});

// Run the program
main();