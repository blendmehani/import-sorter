import fs from 'fs';
import path from 'path';
import process from 'process';
import readline from 'readline'
import { stdin as input, stdout as output } from 'node:process';


const directoryPath = path.join(path.resolve() + (process?.argv[2] ? process.argv[2] : '/src'));
const question = 'Do you want your files to be sorted ASC (yes) DESC (no)? ';


const rl = readline.createInterface({ input, output });
rl.question(question, (answer) => {
    let sorting = 'DESC';
    if (answer === 'yes') sorting = 'ASC';
    readFilesRecursively(directoryPath, sorting);
    rl.close()
    console.log('Your file has been sorted')
});


const rewriteFile = (filePath: string, sorting = 'DESC') => {
    // const filePath = path.join(path.resolve() + process.argv[2]);
    const file = fs.readFileSync(filePath).toString('utf-8');
    const seperatedFile = file.split(';');

    const imports = [];
    const valuesLength: number[] = [];

    seperatedFile.forEach((value) => {
        if (value.includes('import')) {
            imports.push(value + ';');
            valuesLength.push(value.length + 1);
        }
    });
    if (!valuesLength.length) return;
    const lastIndex = valuesLength.reduce(
        (accumulator: number, input: number): number => accumulator + input,
    );
    const removedImportsFile = file.slice(lastIndex);

    const sortedImports = imports.sort((a, b) => {
        if (sorting === 'DESC') return b.length - a.length;
        else return a.length - b.length;
    });

    for (const [index, value] of sortedImports.entries()) {
        if (
            value.startsWith('\n') ||
            value.startsWith('\r') ||
            value.startsWith('\r\n')
        )
            sortedImports[index] = sortedImports[index].replace(/(\r\n|\n|\r)/, '');
    }

    let concatenatedImports = '';
    for (const [index, value] of sortedImports.entries()) {
        let addValue: string;
        if (index === 0) addValue = value;
        else addValue = '\n' + value;
        concatenatedImports += addValue;
    }

    const modifiedFile = concatenatedImports + removedImportsFile;

    try {
        fs.writeFileSync(filePath, modifiedFile);
    } catch (err) {
        console.log(err);
    }
}



const readFilesRecursively = (directoryPath: string, sorting: string) => {
    const files = fs.readdirSync(directoryPath);

    files.forEach(file => {
        const filePath = path.join(directoryPath, file);
        const fileStats = fs.statSync(filePath);

        if (fileStats.isFile()) {
            if (filePath.includes('.ts'))
                rewriteFile(filePath, sorting);
        } else if (fileStats.isDirectory()) {
            readFilesRecursively(filePath, sorting);
        }
    })
}



