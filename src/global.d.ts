//This file is needed for TypeScript files to be able to import css, scss files
//To be able to use this file, you first need to install ypescript-plugin-css-modules
//and then add the following to the compilerOptions in your tsconfig.json file:
//"plugins": [{ "name": "typescript-plugin-css-modules" }]

declare module '*.module.css' {
    const classes: { [key: string]: string };
    export default classes;
}

declare module '*.module.scss' {
    const classes: { [key: string]: string };
    export default classes;
}