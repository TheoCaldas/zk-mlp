import fs from "fs";
import util from "util";
import path from "path";

export const configLog = () => {
    if (!fs.existsSync('logs')) {
        fs.mkdirSync('logs', { recursive: true });
    }
    const logStream = fs.createWriteStream('logs/log - ' + new Date(Date.now()).toISOString(), { flags: 'a' }); 
    const originalConsoleLog = console.log;
    console.log = (...args: any[]) => {
        originalConsoleLog(...args);           
        logStream.write(util.format(...args) + '\n');  
    };
    const originalConsoleError = console.error;
    console.error = (...args: any[]) => {
        originalConsoleError(...args);
        logStream.write(util.format(...args) + '\n');
    }
};

export const readSourceFile = (pathToFile: string): string => {
  return fs.readFileSync(path.resolve(pathToFile), "utf-8");
};

export const readInputFile = (filePath: string): any => {
  try {
    const jsonContent = fs.readFileSync(path.resolve(filePath), "utf-8");
    return JSON.parse(jsonContent);
  } catch (error) {
    console.error(`[ERROR] Error reading or parsing ${filePath}:`, error);
    process.exit(1);
  }
};

export const writeToJsonFile = (filePath: string, data: any) => {
    fs.writeFileSync(path.resolve(filePath), JSON.stringify(data, null, 2), 'utf-8');
};