const r={"01 Appearance":"neutral","03 Surface":"default","10 Colour mode":"light","15 Brand":"Jio","13.2 Theme (A\u2013M) [Jio]":"MyJio","09 Platform":"S \u2013 360","11 Density":"default"},i={"01 Appearance":"neutral","03 Surface":"default","10 Colour mode":"light","15 Brand":"Jio","13.2 Theme (A\u2013M) [Jio]":"MyJio"},o=["JioType Var","Noto Sans","JetBrains Mono","PP Object Sans"],n=`
const norm=function(s){return (s||'').replace(/[\\u2010-\\u2015\\u2212]/g,'-').replace(/\\s+/g,' ').trim().toLowerCase();};
async function mainOf(node){
  try{ return await node.getMainComponentAsync(); }catch(e){ try{ return node.mainComponent; }catch(e2){ return null; } }
}
`.trim();function a(e,t=6e3){return`
${n}
const ROOT_ID=${JSON.stringify(e)}, MAX_NODES=${t};
const root=await figma.getNodeByIdAsync(ROOT_ID);
if(!root) return { error:'node_not_found', nodeId:ROOT_ID };

const instances=[], texts=[], images=[];
let visited=0, truncated=false, maxDepth=0;

function walk(node,depth,path){
  if(visited>=MAX_NODES){truncated=true;return;}
  visited++;
  if(depth>maxDepth)maxDepth=depth;
  try{
    if(node.type==='INSTANCE' && !node.id.includes(';')) instances.push({node:node,depth:depth,path:path});
    if(node.type==='TEXT') texts.push({id:node.id,chars:node.characters,visible:node.visible});
    const fills=node.fills;
    if(Array.isArray(fills)) for(const p of fills) if(p&&p.type==='IMAGE'&&p.imageHash)
      images.push({id:node.id,name:node.name,imageHash:p.imageHash,w:Math.round(node.width),h:Math.round(node.height)});
  }catch(e){}
  const kids=('children' in node)?node.children:[];
  for(let i=0;i<kids.length;i++) walk(kids[i],depth+1,path.concat([i]));
}
walk(root,0,[]);

const out=[];
for(const rec of instances){
  const n=rec.node;
  let props=null;
  try{
    const cp=n.componentProperties||{};
    props={};
    for(const k of Object.keys(cp)) props[k]=cp[k]&&cp[k].value!==undefined?cp[k].value:null;
  }catch(e){props=null;}
  const main=await mainOf(n);
  let key=null, setKey=null, mainName=null, libName=null;
  try{ setKey=n.componentSetKey||null; }catch(e){}
  if(main){
    try{ key=main.key||null; }catch(e){}
    try{ mainName=main.name||null; }catch(e){}
    try{ if(main.parent&&main.parent.type==='COMPONENT_SET'){ setKey=setKey||main.parent.key||null; mainName=main.parent.name||mainName; } }catch(e){}
    try{ libName=main.remote?'remote':'local'; }catch(e){}
  }
  out.push({
    id:n.id, name:n.name, depth:rec.depth, path:rec.path, visible:n.visible,
    componentKey:key, componentSetKey:setKey, mainName:mainName, origin:libName,
    props:props,
    x:Math.round(n.x), y:Math.round(n.y), w:Math.round(n.width), h:Math.round(n.height),
    unresolved: main?false:true
  });
}

// Distinct main-component keys = the legacy fingerprint / denylist.
const byKey={};
for(const i of out){
  const k=i.componentSetKey||i.componentKey;
  if(!k)continue;
  if(!byKey[k]) byKey[k]={key:k,name:i.mainName||i.name,count:0,visibleCount:0};
  byKey[k].count++;
  if(i.visible) byKey[k].visibleCount++;
}

return {
  rootId:ROOT_ID,
  rootName:root.name,
  rootType:root.type,
  frame:{x:Math.round(root.x),y:Math.round(root.y),w:Math.round(root.width),h:Math.round(root.height)},
  page:(function(){var p=root;while(p&&p.type!=='PAGE')p=p.parent;return p?{id:p.id,name:p.name}:null;})(),
  nodesVisited:visited, maxDepth:maxDepth, truncated:truncated,
  instances:out,
  keyFingerprint:Object.keys(byKey).map(function(k){return byKey[k];}).sort(function(a,b){return b.count-a.count;}),
  textCount:texts.length,
  images:images,
  unresolvedInstances:out.filter(function(i){return i.unresolved;}).length
};
`.trim()}function s(e){return`
${n}
const ROOT_ID=${JSON.stringify(e.rootId)};
const FRAME_NAME=${JSON.stringify(e.frameName)};
const OFFSET_Y=${e.offsetY};
const MODES=${JSON.stringify(e.modes)};
const FAMILIES=${JSON.stringify(o)};

const src=await figma.getNodeByIdAsync(ROOT_ID);
if(!src) return { error:'node_not_found', nodeId:ROOT_ID };
if(typeof src.clone!=='function') return { error:'not_cloneable', nodeType:src.type };

// Preload fonts BEFORE any mode write (see doc comment).
const wanted=new Set(FAMILIES);
let fontsLoaded=0, fontErrors=[];
try{
  const avail=await figma.listAvailableFontsAsync();
  const todo=avail.filter(function(f){return wanted.has(f.fontName.family);});
  for(const f of todo){
    try{ await figma.loadFontAsync(f.fontName); fontsLoaded++; }
    catch(e){ fontErrors.push(f.fontName.family+' '+f.fontName.style); }
  }
}catch(e){ fontErrors.push('listAvailableFontsAsync: '+String(e&&e.message||e)); }

const clone=src.clone();
clone.name=FRAME_NAME;
if(src.parent) src.parent.appendChild(clone);
clone.x=src.x;
clone.y=src.y+src.height+OFFSET_Y;

// Resolve collections BY NAME \u2014 libraryKey comes back undefined in practice,
// so key-based filtering matches zero collections.
let collections=[];
try{ collections=await figma.variables.getLocalVariableCollectionsAsync(); }catch(e){}
if(collections.length===0){
  try{
    const libs=await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync();
    collections=libs||[];
  }catch(e){}
}

const setLog=[];
for(const wantName of Object.keys(MODES)){
  const wantMode=MODES[wantName];
  const coll=collections.find(function(c){return norm(c.name)===norm(wantName);});
  if(!coll){ setLog.push({collection:wantName,mode:wantMode,result:'SKIP_NO_COLLECTION'}); continue; }
  let resolvedColl=coll;
  // A team-library collection must be imported before its modes are usable.
  if(!coll.modes){
    try{
      const local=await figma.variables.getLocalVariableCollectionsAsync();
      resolvedColl=local.find(function(c){return norm(c.name)===norm(wantName);})||coll;
    }catch(e){}
  }
  const modes=resolvedColl.modes||[];
  const mode=modes.find(function(m){return norm(m.name)===norm(wantMode);});
  if(!mode){ setLog.push({collection:wantName,mode:wantMode,result:'SKIP_NO_MODE',available:modes.map(function(m){return m.name;})}); continue; }
  try{
    clone.setExplicitVariableModeForCollection(resolvedColl,mode.modeId);
    setLog.push({collection:wantName,mode:wantMode,result:'SET'});
  }catch(e){
    setLog.push({collection:wantName,mode:wantMode,result:'ERROR',error:String(e&&e.message||e)});
  }
}

return {
  cloneId:clone.id,
  cloneName:clone.name,
  position:{x:Math.round(clone.x),y:Math.round(clone.y),w:Math.round(clone.width),h:Math.round(clone.height)},
  fontsLoaded:fontsLoaded, fontErrors:fontErrors,
  collectionsSeen:collections.map(function(c){return c.name;}),
  modeLog:setLog
};
`.trim()}function c(e,t){return`
${n}
const CLONE_ID=${JSON.stringify(e)};
const DIRECTIVES=${JSON.stringify(t)};
const importCache={};

const cloneRoot=await figma.getNodeByIdAsync(CLONE_ID);
if(!cloneRoot) return { error:'clone_not_found', cloneId:CLONE_ID };

// clone() preserves child order, so the source's child-index path locates the
// corresponding node in the clone exactly. Matching by node id cannot work:
// every cloned node gets a fresh id.
function atPath(path){
  let node=cloneRoot;
  for(const idx of path){
    const kids=('children' in node)?node.children:[];
    if(idx<0||idx>=kids.length) return null;
    node=kids[idx];
  }
  return node;
}

async function importSet(key){
  if(key in importCache) return importCache[key];
  let entry={set:null,component:null,via:null,error:null};
  try{
    entry.set=await figma.importComponentSetByKeyAsync(key);
    entry.via='componentSet';
  }catch(setErr){
    try{
      entry.component=await figma.importComponentByKeyAsync(key);
      entry.via='component';
    }catch(compErr){
      entry.error='set: '+String(setErr&&setErr.message||setErr)+' | component: '+String(compErr&&compErr.message||compErr);
    }
  }
  importCache[key]=entry;
  return entry;
}

function pickVariant(set,props){
  const kids=set.children||[];
  if(!props||Object.keys(props).length===0) return set.defaultVariant||kids[0]||null;
  const want=Object.keys(props).map(function(k){return k+'='+props[k];}).sort().join(', ');
  const exact=kids.find(function(c){return c.name.split(', ').sort().join(', ')===want;});
  if(exact) return exact;
  // Best-effort: the variant satisfying the most requested pairs.
  let best=null,bestScore=-1;
  for(const c of kids){
    const parts=new Set(c.name.split(', '));
    let score=0;
    for(const k of Object.keys(props)) if(parts.has(k+'='+props[k])) score++;
    if(score>bestScore){bestScore=score;best=c;}
  }
  return best||set.defaultVariant||kids[0]||null;
}

const results=[];
for(const d of DIRECTIVES){
  const old=atPath(d.path);
  if(!old){ results.push({nodeId:d.nodeId,path:d.path,status:'MISSING_IN_CLONE'}); continue; }
  // Guard the path lookup: if the clone diverged, the node at this path is not
  // the instance we inventoried, and swapping it would corrupt the frame.
  if(old.type!=='INSTANCE'||old.name!==d.expectName){
    results.push({nodeId:d.nodeId,path:d.path,status:'PATH_MISMATCH',found:old.type+':'+old.name,expected:'INSTANCE:'+d.expectName});
    continue;
  }
  const imported=await importSet(d.figmaKey);
  if(imported.error){ results.push({nodeId:d.nodeId,status:'IMPORT_FAILED',component:d.componentName,error:imported.error}); continue; }

  let inst=null, variantName=null;
  try{
    if(imported.set){
      const variant=pickVariant(imported.set,d.variantProps||null);
      if(!variant){ results.push({nodeId:d.nodeId,status:'NO_VARIANT',component:d.componentName}); continue; }
      variantName=variant.name;
      inst=variant.createInstance();
    } else {
      variantName=imported.component.name;
      inst=imported.component.createInstance();
    }
  }catch(e){
    results.push({nodeId:d.nodeId,status:'CREATE_FAILED',component:d.componentName,error:String(e&&e.message||e)});
    continue;
  }

  try{
    const parent=old.parent;
    const idx=parent.children.indexOf(old);
    parent.insertChild(idx,inst);
    inst.x=old.x; inst.y=old.y;
    // Preserve hidden state \u2014 a fresh instance is always visible (see doc).
    inst.visible=old.visible;
    try{ if(old.layoutSizingHorizontal==='FILL') inst.layoutSizingHorizontal='FILL'; }catch(e){}
    try{ if(old.layoutGrow) inst.layoutGrow=old.layoutGrow; }catch(e){}
    old.remove();
    results.push({
      nodeId:d.nodeId, path:d.path, status:'SWAPPED', component:d.componentName,
      newId:inst.id, variant:variantName, via:imported.via, visible:inst.visible
    });
  }catch(e){
    try{ inst.remove(); }catch(e2){}
    results.push({nodeId:d.nodeId,status:'REPLACE_FAILED',component:d.componentName,error:String(e&&e.message||e)});
  }
}

const counts={};
for(const r of results) counts[r.status]=(counts[r.status]||0)+1;
return { results:results, counts:counts };
`.trim()}function l(e,t){return`
${n}
const ROOT_ID=${JSON.stringify(e)};
const ALLOWED=new Set(${JSON.stringify(t)});
const root=await figma.getNodeByIdAsync(ROOT_ID);
if(!root) return { error:'node_not_found', nodeId:ROOT_ID };

let scanned=0, maxDepth=0;
const violations=[], unresolved=[], allowed=[];
const stack=[{n:root,d:0}];
while(stack.length){
  const cur=stack.pop();
  const node=cur.n, depth=cur.d;
  if(depth>maxDepth)maxDepth=depth;
  if(node.type==='INSTANCE' && !node.id.includes(';')){
    scanned++;
    const main=await mainOf(node);
    let k=null;
    try{ k=node.componentSetKey||null; }catch(e){}
    if(main&&!k){ try{ k=(main.parent&&main.parent.type==='COMPONENT_SET')?main.parent.key:main.key; }catch(e){} }
    if(!main||!k) unresolved.push({id:node.id,name:node.name,visible:node.visible});
    else if(ALLOWED.has(k)) allowed.push(k);
    else violations.push({id:node.id,name:node.name,key:k,visible:node.visible,mainName:(function(){try{return main.name;}catch(e){return null;}})()});
  }
  const kids=('children' in node)?node.children:[];
  for(const c of kids) stack.push({n:c,d:depth+1});
}

return {
  scanIntegrity:(scanned>0&&maxDepth>1)?'OK':'FAILED_SCAN',
  instancesScanned:scanned, maxDepth:maxDepth,
  allowedCount:allowed.length,
  violations:violations, unresolvedCount:unresolved.length, unresolved:unresolved.slice(0,40)
};
`.trim()}export{r as MOBILE_ROOT_MODES,i as WEB_ROOT_MODES,s as buildApplySnippet,l as buildAuditSnippet,a as buildInventorySnippet,c as buildSwapSnippet};
