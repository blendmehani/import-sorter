import fs from 'fs';
import path from 'path';
import process from 'process';
import readline from 'readline'
import {stdin as input, stdout as output} from 'node:process';
import {FileType, Message, Sorting} from "./sort-enum";

const pathArgument = process.argv[2];
const directoryPath = path.join(path.resolve() + (pathArgument ? '/' + pathArgument : '/src'));
const question = pathArgument.includes(FileType.TS)? Message.QUESTION_FILE : Message.QUESTION_FILES;


const rl = readline.createInterface({ input, output });
rl.question(question, (answer) => {
    let sorting = Sorting.DESC;
    if (answer === 'ASC') sorting = Sorting.ASC;
    readFilesRecursively(directoryPath, sorting);
    rl.close()
    console.info(pathArgument.includes(FileType.TS)? Message.SUCCESS_FILE : Message.SUCCESS_FILES)
});


const rewriteFile = (filePath: string, sorting = 'DESC') => {
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
        if (sorting === Sorting.DESC) return b.length - a.length;
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
    let files: string[];
    if (pathArgument.includes(FileType.TS)) {
        rewriteFile(directoryPath, sorting);
        return;
    }
    else files = fs.readdirSync(directoryPath);

    files.forEach((file: string) => {
        const filePath = path.join(directoryPath, file);
        const fileStats = fs.statSync(filePath);

        if (fileStats.isFile()) {
            if (filePath.includes(FileType.TS))
                rewriteFile(filePath, sorting);
        } else if (fileStats.isDirectory()) {
            readFilesRecursively(filePath, sorting);
        }
    })
}



