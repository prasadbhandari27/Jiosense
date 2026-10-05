import{pascalCase as a}from"./androidScaffold.js";function t(r){const e=a(r??"");return e?/^[A-Za-z]/.test(e)?e:`Screen${e}`:"Screen"}export{t as sanitizeAndroidClassName};
