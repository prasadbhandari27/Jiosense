import{existsSync as r,readFileSync as b,writeFileSync as x}from"node:fs";import{resolve as u}from"node:path";import{spawnSync as h}from"node:child_process";import{npmEnvForSelectedRegistry as w}from"./registry.js";const N="https://myjiostatic.cdn.jio.com/JDS/react",j="oneui.brands.json",k="@jds4/oneui-datavis",y={jio:["myjio"]},l=["@jds4/oneui-react","@jds4/oneui-icons-jio"],v={next:"@jds4/oneui-next-plugin",vite:"@jds4/oneui-vite-plugin",webpack:"@jds4/oneui-webpack-plugin",esbuild:"@jds4/oneui-esbuild-plugin"};function S(n){const t=u(n,"package.json");if(!r(t))return null;try{return JSON.parse(b(t,"utf8"))}catch{return null}}function $(n){const t=new Set;if(!n)return t;for(const i of["dependencies","devDependencies","peerDependencies"]){const e=n[i];if(e&&typeof e=="object")for(const s of Object.keys(e))t.add(s)}return t}function o(n,t){return t.some(i=>r(u(n,i)))}function O(n){const t=S(n),i=$(t),e=[];return i.has("next")&&e.push('found "next" dependency'),o(n,["next.config.js","next.config.mjs","next.config.ts"])&&e.push("found next.config.*"),i.has("next")||o(n,["next.config.js","next.config.mjs","next.config.ts"])?{framework:"next",reasons:e}:(i.has("vite")&&e.push('found "vite" dependency'),o(n,["vite.config.js","vite.config.mjs","vite.config.ts"])&&e.push("found vite.config.*"),i.has("vite")||o(n,["vite.config.js","vite.config.mjs","vite.config.ts"])?{framework:"vite",reasons:e}:(i.has("react-scripts")&&e.push('found "react-scripts" (CRA \u2192 webpack)'),i.has("webpack")&&e.push('found "webpack" dependency'),o(n,["webpack.config.js","webpack.config.ts"])&&e.push("found webpack.config.*"),i.has("react-scripts")||i.has("webpack")||o(n,["webpack.config.js","webpack.config.ts"])?{framework:"webpack",reasons:e}:(o(n,["esbuild.config.js","esbuild.config.mjs","esbuild.config.ts","build.mjs"])&&e.push("found an esbuild build script"),r(u(n,"bun.lockb"))&&e.push("found bun.lockb"),o(n,["esbuild.config.js","esbuild.config.mjs","esbuild.config.ts","build.mjs"])||r(u(n,"bun.lockb"))?{framework:"esbuild",reasons:e}:(e.push("no framework markers found"),{framework:"unknown",reasons:e}))))}function P(n){return r(u(n,"pnpm-lock.yaml"))?"pnpm":r(u(n,"yarn.lock"))?"yarn":"npm"}function _(n,t=!1){const i=n==="unknown"?[]:[v[n]];return{runtime:t?[...l,k]:[...l],dev:i}}function D(n,t="latest"){const i={};for(const e of n){const s=y[e];i[e]=s&&s.length?{version:t,themes:s}:t}return i}function B(n,t,i=!1){const e=u(n,j);return r(e)&&!i?{written:!1,path:e,reason:"file exists \u2014 pass force=true to overwrite"}:(x(e,JSON.stringify(t,null,2)+`
`,"utf8"),{written:!0,path:e})}function M(n,t=!1){const i=["// Add at the top of your app entry (main.tsx / _app.tsx):","import '@jds4/oneui-react/styles';",...t?["import '@jds4/oneui-datavis/styles';"]:[],"import '@jds4/oneui-icons-jio';"].join(`
`);switch(n){case"next":return{configFile:"next.config.js",snippet:`${i}

// next.config.js \u2014 wrap your config with withOneui:
const { withOneui } = require('@jds4/oneui-next-plugin');

/** @type {import('next').NextConfig} */
const config = {
  // ...your existing config
};

module.exports = withOneui()(config);`};case"vite":return{configFile:"vite.config.ts",snippet:`${i}

// vite.config.ts \u2014 add the oneui plugin:
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { oneui } from '@jds4/oneui-vite-plugin';

export default defineConfig({
  plugins: [react(), oneui()],
});`};case"webpack":return{configFile:"webpack.config.js",snippet:`${i}

// webpack.config.js \u2014 add the oneui plugin:
const { oneui } = require('@jds4/oneui-webpack-plugin');

module.exports = {
  // ...your existing config
  plugins: [
    // ...your existing plugins
    oneui(),
  ],
};`};case"esbuild":return{configFile:"esbuild.config.mjs",snippet:`${i}

// esbuild build script \u2014 add the oneui plugin:
import { build } from 'esbuild';
import { oneui } from '@jds4/oneui-esbuild-plugin';

await build({
  // ...your existing options
  plugins: [
    // ...your existing plugins
    oneui(),
  ],
});`};default:return{configFile:"(unknown)",snippet:`${i}

# Couldn't detect your framework. OneUI ships plugins for Vite, Webpack,
# and Next.js. Install whichever fits your stack:
#   @jds4/oneui-vite-plugin
#   @jds4/oneui-webpack-plugin
#   @jds4/oneui-next-plugin
# Each exposes the same oneui()/withOneui() API.`}}}function U(n="jio"){return`import { BrandProvider, Container, Icon } from '@jds4/oneui-react';

export default function App() {
  return (
    <BrandProvider brand="${n}" density="default">
      <Container surface="minimal" variant="full-bleed">
        <Icon name="home" />
        {/* your app */}
      </Container>
    </BrandProvider>
  );
}`}function C(n,t,i){const e=[],s=(a,c)=>{if(a.length===0)return;const f=a.join(" ");i==="pnpm"?e.push(`pnpm add ${c?"-D ":""}${f}`):i==="yarn"?e.push(`yarn add ${c?"-D ":""}${f}`):e.push(`npm install ${c?"-D":"--save"} ${f}`)};return s(n,!1),s(t,!0),e}function L(n,t,i,e){const s=C(t,i,e),a=[...t,...i].some(p=>p.startsWith("@jds4/"))?w(n):void 0;let c=!0,f="";for(const p of s){const[g,...m]=p.split(" "),d=h(g,m,{cwd:n,encoding:"utf8",env:a});if(f+=`$ ${p}
${d.stdout??""}${d.stderr??""}
`,d.status!==0){c=!1;break}}return{ok:c,commands:s,output:f}}export{y as BRAND_DEFAULT_THEMES,k as CHARTS_PACKAGE,j as CONFIG_FILENAME,N as DEFAULT_CDN_URL,D as buildBrandsMap,C as buildInstallCommands,O as detectFramework,P as detectPackageManager,_ as installSpec,M as patchSnippets,U as providerSnippet,L as runInstall,B as writeBrandsConfig};
