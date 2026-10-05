import{existsSync as a,mkdirSync as l,mkdtempSync as k,readFileSync as g,rmSync as d,writeFileSync as f}from"node:fs";import{tmpdir as F}from"node:os";import{dirname as v,join as i,resolve as u}from"node:path";import{spawnSync as o}from"node:child_process";import{ensureBrandSubBrand as y}from"./brandsConfig.js";import{FLUTTER_DART_PACKAGE as x,FLUTTER_NPM_PACKAGE as h,FLUTTER_VENDOR_REL as c,packFlutterTarball as E,queryFlutterLatestVersion as $}from"./flutterRegistry.js";const P=`import 'package:flutter/material.dart';
import 'package:ui_flutter/ui_flutter.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await JioIconCatalog.instance.ensureLoaded();
  await ensureOneUiBrandDefaultsLoaded();
  runApp(
    MaterialApp(
      home: OneUiBrandProvider(
        mode: 'light',
        child: OneUiSurface(
          mode: 'default',
          child: OneUiButton(
            variant: OneUiButtonVariant.bold,
            onPressed: () {},
            label: 'Continue',
          ),
        ),
      ),
    ),
  );
}
`;function w(e,n=c){const t=`  ${x}:
    path: ${n}
`;let r=e;return/^\s*ui_flutter:/m.test(r)?r=r.replace(/^\s*ui_flutter:\s*\n(?:\s{2,}.*\n)*/m,t):/^dependencies:\s*$/m.test(r)||/^dependencies:\s*\n/m.test(r)?r=r.replace(/^dependencies:\s*\n/m,`dependencies:
${t}`):r=`${r.trimEnd()}

dependencies:
${t}`,T(r)}function T(e){return/assets\/figma\//.test(e)?e:/^flutter:\s*\n/m.test(e)||/^flutter:\s*$/m.test(e)?/uses-material-design:\s*true/.test(e)?/\n  assets:\s*\n/.test(e)?e.replace(/\n  assets:\s*\n/,`
  assets:
    - assets/figma/
`):e.replace(/uses-material-design:\s*true/,`uses-material-design: true
  assets:
    - assets/figma/`):e.replace(/^flutter:\s*\n/m,`flutter:
  assets:
    - assets/figma/
`):`${e.trimEnd()}
flutter:
  uses-material-design: true
  assets:
    - assets/figma/
`}function _(e,n=c){const t=u(e,"pubspec.yaml");if(!a(t))throw new Error(`No pubspec.yaml at ${t}`);const r=w(g(t,"utf8"),n);return f(t,r,"utf8"),t}function A(e,n){const t=u(e,c);l(u(e,"vendor"),{recursive:!0});const r=k(i(F(),"oneui-flutter-pack-"));try{const s=o("tar",["-xzf",n,"-C",r],{encoding:"utf8"});if(s.status!==0)throw new Error(`tar extract failed: ${(s.stderr||s.stdout||"").trim()}`);const p=i(r,"package");if(!a(i(p,"pubspec.yaml")))throw new Error("npm pack layout missing package/pubspec.yaml");d(t,{recursive:!0,force:!0}),l(v(t),{recursive:!0});const m=o("cp",["-R",p,t],{encoding:"utf8"});if(m.status!==0)throw new Error(`copy vendor failed: ${(m.stderr||m.stdout||"").trim()}`)}finally{d(r,{recursive:!0,force:!0})}return t}function N(e,n){const t=n??$(e);if(!t)return{ok:!1,version:null,vendorPath:null,message:`Could not resolve ${h} version from the Flutter Azure feed.`};const r=E(e,t);if(!r.ok||!r.tgz)return{ok:!1,version:t,vendorPath:null,message:r.message};try{const s=A(e,r.tgz);try{d(r.tgz,{force:!0})}catch{}return _(e,c),l(u(e,"assets","figma"),{recursive:!0}),{ok:!0,version:t,vendorPath:s,message:`Vendored ${h}@${t} \u2192 ${c}`}}catch(s){return{ok:!1,version:t,vendorPath:null,message:s instanceof Error?s.message:String(s)}}}function O(e,n,t){return y(e,n,t)}function R(e,n=!1){const t=u(e,"lib","main.dart");return a(t)&&!n?null:(l(v(t),{recursive:!0}),f(t,P,"utf8"),t)}function D(e){const n=o("flutter",["pub","get"],{cwd:e,encoding:"utf8",env:process.env}),t=`${n.stdout??""}${n.stderr??""}`.trim();return{ok:n.status===0,output:t}}function M(){const e=o("flutter",["--version"],{encoding:"utf8"}),n=o("node",["--version"],{encoding:"utf8"});return e.status!==0?{ok:!1,message:"Flutter SDK not found on PATH. Install Flutter \u2265 3.24 and retry."}:n.status!==0?{ok:!1,message:"Node.js not found on PATH. Install Node \u2265 18 (needed for Azure npm pack)."}:{ok:!0,message:`Flutter + Node available (${(n.stdout??"").trim()}).`}}function V(e,n,t=!1){const r=u(e,n);if(a(r)&&!t)return{ok:!1,appDir:r,message:`Directory already exists: ${r} (pass force: true to overwrite).`};a(r)&&t&&d(r,{recursive:!0,force:!0});const s=o("flutter",["create","--project-name",n.replace(/-/g,"_"),n],{cwd:e,encoding:"utf8",env:process.env});return s.status!==0?(l(i(r,"lib"),{recursive:!0}),f(i(r,"pubspec.yaml"),`name: ${n.replace(/-/g,"_")}
description: OneUI Flutter app
publish_to: "none"
environment:
  sdk: ">=3.5.0 <4.0.0"
dependencies:
  flutter:
    sdk: flutter
flutter:
  uses-material-design: true
`,"utf8"),{ok:!0,appDir:r,message:`flutter create failed (${(s.stderr??"").trim().slice(0,200)||"not on PATH"}); wrote a minimal pubspec instead.`}):(U(r),{ok:!0,appDir:r,message:`Created Flutter app at ${r}`})}const S=`
  <style>
    flt-semantics, flt-semantics-placeholder,
    flt-semantics a, flt-semantics-placeholder a {
      text-decoration: none !important;
      color: inherit !important;
    }
  </style>
</head>`;function U(e){const n=i(e,"web","index.html");if(!a(n))return;const t=g(n,"utf8");t.includes("flt-semantics-placeholder")||f(n,t.replace("</head>",S),"utf8")}export{P as FLUTTER_MAIN_SNIPPET,V as createFlutterAppSkeleton,O as ensureFlutterBrand,T as ensureFlutterFigmaAssets,A as extractTarballToVendor,D as flutterPubGet,w as patchPubspecUiFlutter,U as patchWebIndexHtmlUnderlineReset,M as preflightFlutterSdk,N as vendorFlutterFromFeed,R as writeFlutterMainIfMissing,_ as writePubspecUiFlutter};
