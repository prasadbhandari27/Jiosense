function s(o){return o.replace(/\{\s*\/\*[\s\S]*?\*\/\s*\}/g,"").replace(/\/\*[\s\S]*?\*\//g,"").split(`
`).map(t=>t.replace(/[ \t]+$/,"")).filter(t=>t.trim()!==""&&!t.trimStart().startsWith("//")).join(`
`).trim()}function m(o,n){return s(o)===s(n)}export{m as equalModuloComments,s as stripComments};
