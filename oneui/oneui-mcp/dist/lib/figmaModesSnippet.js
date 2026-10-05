import{CAPTURE_SCHEMA_VERSION as d,CAPTURE_V2_BUDGETS as t}from"./captureSchema.js";import{getComponentContractRegistry as s}from"./componentContracts.js";import{resolveOpaqueIdentityAuthority as c}from"./opaqueIdentityAuthority.js";function y(i,n){const e=s(n?.platform??"reactnative").contracts;return l(i,e,n)}function l(i,n,e){const a={maxNodes:e?.maxNodes??t.maxNodes,maxDepth:e?.maxDepth??t.maxDepth,maxSerializedBytes:e?.maxSerializedBytes??t.maxSerializedBytes,maxChildrenPerNode:e?.maxChildrenPerNode??t.maxChildrenPerNode,maxVectorEvidence:e?.maxVectorEvidence??t.maxVectorEvidence,maxImageEvidence:e?.maxImageEvidence??t.maxImageEvidence},o=c({contracts:n,requestedMainComponentKeys:e?.narrowOpaqueMainComponentKeys,observedLibraryVersion:e?.observedLibraryVersion}),r=o.effectiveMainComponentKeys;return`
const ROOT_ID=${JSON.stringify(i)}, CAPTURE_SCHEMA_VERSION=${d};
const CAPTURE_STARTED=${e?.includeTimingTelemetry?"Date.now()":"null"};
const BUDGETS=${JSON.stringify(a)};
const EXACT_FIRST_PARTY_KEYS=new Set(${JSON.stringify(r)});
const OPAQUE_AUTHORITY_DIAGNOSTIC=${JSON.stringify(o.diagnostic??null)};
// Variable collections we care about (Dev-mode "Modes") -> normalized keys.
const KEY={'01 Appearance':'appearance','03 Surface':'surface','15 Brand':'brand','10 Colour mode':'colourMode','02 Accent':'accent','11 Density':'density'};
const collCache={};
async function coll(id){ if(!(id in collCache)){ try{collCache[id]=await figma.variables.getVariableCollectionByIdAsync(id);}catch(e){collCache[id]=null;} } return collCache[id]; }
async function keyModes(node,which){
  const src=node[which]||{}; const out={};
  for(const cid of Object.keys(src)){ const c=await coll(cid); if(!c||!(c.name in KEY))continue; const mn=(c.modes.find(m=>m.modeId===src[cid])||{}).name; out[KEY[c.name]]=mn; }
  return out;
}
function clean(k){ return k.split('#')[0].replace(/[\\u200B-\\u200D\\uFEFF\\u2068\\u2069\\u202A-\\u202E]/g,'').replace(/\u21B3/g,'').trim(); }
function propVals(node){ const cp=node.componentProperties; if(!cp)return undefined; const o={}; for(const k of Object.keys(cp)){ const v=cp[k]; o[clean(k)]=(v&&typeof v==='object')?(('value'in v)?v.value:v.type):v; } return Object.keys(o).length?o:undefined; }
function variantVals(node){ try{ const vp=node.variantProperties; if(!vp)return undefined; const o={}; for(const k of Object.keys(vp)){ const v=vp[k]; if(typeof v==='string')o[clean(k)]=v; } return Object.keys(o).length?o:undefined; }catch(e){ return undefined; } }
// True when the node (or a shallow descendant) paints with an IMAGE fill \u2014 used
// to flag nodes whose rendered pixels must be downloaded as an asset.
function hasImageFill(node){
  try{ const f=node.fills; if(Array.isArray(f)&&f.some(function(p){return p&&p.type==='IMAGE'&&p.visible!==false;})) return true; }catch(e){}
  return false;
}
function rgbToHex(c){ if(!c||typeof c.r!=='number')return undefined; function h(x){var n=Math.round(Math.min(1,Math.max(0,x))*255);var s=n.toString(16);return s.length<2?'0'+s:s;} return '#'+h(c.r)+h(c.g)+h(c.b); }
async function bgFillInfo(node){
  try{
    const f=node.fills;
    if(!Array.isArray(f)||!f.length)return undefined;
    const vis=f.filter(function(p){return p&&p.visible!==false&&!(typeof p.opacity==='number'&&p.opacity<=0);});
    const top=vis[vis.length-1];
    const bound=vis.filter(function(p){return p.type==='SOLID'&&p.boundVariables&&p.boundVariables.color;}).pop();
    const hiddenBound=f.filter(function(p){return p&&p.type==='SOLID'&&(p.visible===false||(typeof p.opacity==='number'&&p.opacity<=0))&&p.boundVariables&&p.boundVariables.color;}).pop();
    const paint=bound||hiddenBound||top;
    if(!paint)return undefined;
    const o={type:paint.type};
    if(hiddenBound&&paint===hiddenBound)o.hidden=true;
    if(bound&&top&&bound!==top)o.occluded=true;
    if(typeof paint.opacity==='number'&&paint.opacity<1)o.opacity=paint.opacity;
    if(paint.type==='SOLID'){
      const bv=paint.boundVariables&&paint.boundVariables.color;
      if(bv&&bv.id){ const nm=await varName(bv.id); if(nm)o.var=nm; }
      const hx=rgbToHex(paint.color); if(hx)o.hex=hx;
    } else if(paint.type==='IMAGE'){
      if(imageEvidenceCount<BUDGETS.maxImageEvidence){o.image=true;imageEvidenceCount++;}
      else{ o.image=true;o.imageEvidenceTruncated=true;diagnostics.push({code:'NODE_TRUNCATED',severity:'warning',figId:node.id||'capture-path:unknown',confidence:'NONE',message:'Capture budget truncated image evidence.',evidence:{nodeType:node.type,exceededBudget:'maxImageEvidence',limit:BUDGETS.maxImageEvidence,recoverableFrom:'live Figma source'},provenance:['capture-v2','maxImageEvidence']});coverage.truncatedEvidence++;telemetry.omittedOrTruncatedSubtrees++;telemetry.truncationsByBudgetFamily.maxImageEvidence=(telemetry.truncationsByBudgetFamily.maxImageEvidence||0)+1; }
      if(typeof paint.imageHash==='string'&&paint.imageHash)o.imageHash=paint.imageHash;
    }
    else if(typeof paint.type==='string'&&paint.type.indexOf('GRADIENT')===0){ o.gradient=true; }
    return (o.var||o.hex||o.image||o.gradient)?o:undefined;
  }catch(e){ return undefined; }
}
const PRIMITIVES=new Set(['VECTOR','RECTANGLE','ELLIPSE','LINE','BOOLEAN_OPERATION','GROUP','STAR','POLYGON','SLICE']);
const varCache={};
async function varName(id){ if(!(id in varCache)){ try{const v=await figma.variables.getVariableByIdAsync(id);varCache[id]=v?v.name:undefined;}catch(e){varCache[id]=undefined;} } return varCache[id]; }
const styleCache={};
async function styleName(id){ if(!(id in styleCache)){ try{const s=await figma.getStyleByIdAsync(id);styleCache[id]=s?s.name:undefined;}catch(e){styleCache[id]=undefined;} } return styleCache[id]; }
// Auto-layout geometry + the dimension-scale variable bound to each spacing value
// (so codegen can resolve to a spacing TOKEN instead of a literal px), plus
// cornerRadius + absoluteBox captured for every kept node.
async function layoutInfo(node){
  const lm=node.layoutMode;
  const auto=lm&&lm!=='NONE';
  const bv=node.boundVariables||{};
  async function space(prop){
    const px=(typeof node[prop]==='number')?node[prop]:undefined;
    let token; const b=bv[prop]; if(b&&b.id){ token=await varName(b.id); }
    if(px===undefined&&token===undefined)return undefined;
    return {px:px,token:token};
  }
  const o={};
  if(auto){
    o.mode=lm;
    o.primaryAxisAlignItems=node.primaryAxisAlignItems;
    o.counterAxisAlignItems=node.counterAxisAlignItems;
    if(node.layoutWrap==='WRAP') o.wrap=true;
    o.itemSpacing=await space('itemSpacing');
    o.paddingTop=await space('paddingTop'); o.paddingRight=await space('paddingRight');
    o.paddingBottom=await space('paddingBottom'); o.paddingLeft=await space('paddingLeft');
    // Native Figma "Grid" auto-layout (layoutMode 'GRID') carries its own row/column
    // gap + track count instead of itemSpacing. This is a newer, less-stable part of
    // the Plugin API, so every read is typeof-guarded \u2014 an older API build or a
    // renamed field just yields "no grid data" here rather than throwing, and
    // mapLayout() downstream falls back to treating the frame as a plain stack.
    if(lm==='GRID'){
      try{
        const g={};
        const rowGap=await space('gridRowGap');
        const columnGap=await space('gridColumnGap');
        if(rowGap) g.rowGap=rowGap;
        if(columnGap) g.columnGap=columnGap;
        if(typeof node.gridRowCount==='number') g.rowCount=node.gridRowCount;
        if(typeof node.gridColumnCount==='number') g.columnCount=node.gridColumnCount;
        if(Object.keys(g).length) o.grid=g;
      }catch(e){}
    }
  }
  if(typeof node.cornerRadius==='number'&&node.cornerRadius) o.cornerRadius=Math.round(node.cornerRadius);
  try{ const b=node.absoluteBoundingBox; if(b) o.absoluteBox={x:Math.round(b.x),y:Math.round(b.y),w:Math.round(b.width),h:Math.round(b.height)}; }catch(e){}
  // Absolute overlay within an auto-layout parent (Figma "Ignore auto layout").
  // Capture the flag + pin constraints so codegen can re-pin the child by its own
  // constraints instead of sweeping it into the parent's flex flow; absoluteBox
  // (above) supplies the offsets. Constraints only matter for absolute children.
  if(node.layoutPositioning==='ABSOLUTE'){ o.absolute=true; try{ const c=node.constraints; if(c) o.constraints={horizontal:c.horizontal,vertical:c.vertical}; }catch(e){} }
  return Object.keys(o).length?o:undefined;
}
// Font properties for TEXT nodes so codegen can map a Text variant/size/weight
// (the refined tree otherwise drops all typography \u2192 flat hierarchy). Guard
// against figma.mixed (returned when a text node has multiple style runs).
async function typographyInfo(node){
  if(node.type!=='TEXT')return undefined;
  const o={};
  if(typeof node.fontSize==='number') o.fontSize=Math.round(node.fontSize);
  if(typeof node.fontWeight==='number') o.fontWeight=node.fontWeight;
  if(node.fontName&&typeof node.fontName==='object'){ o.fontFamily=node.fontName.family; o.fontStyle=node.fontName.style; }
  // AUTHORITATIVE variant/size: the bound text style name (e.g. "title/M",
  // "Headline-L", "label/S"). This beats px inference because a style's resolved
  // fontSize varies by theme/density mode (title/M is 16px under MyJio, 18 base).
  // Prefer the text-style name; fall back to the bound fontSize variable name
  // (e.g. "typography/fontSize/title-M") which also encodes variant+size.
  try{
    const sid=node.textStyleId;
    if(sid&&typeof sid==='string'){ const nm=await styleName(sid); if(nm) o.styleName=nm; }
    if(!o.styleName){ const bv=node.boundVariables&&node.boundVariables.fontSize; if(bv&&bv.id){ const nm=await varName(bv.id); if(nm) o.styleName=nm; } }
  }catch(e){}
  // Truncation \u2192 codegen maps to maxLines. ENDING = ellipsis clamp; an explicit
  // maxLines wins, otherwise a clamped single-line node defaults to 1.
  if(node.textTruncation==='ENDING') o.truncate=true;
  if(typeof node.maxLines==='number'&&node.maxLines>0) o.maxLines=node.maxLines;
  // Single-line detection: if the text box is only one line tall, it is meant to
  // stay on one line \u2192 codegen emits maxLines={1}. Many designs never set Figma's
  // textTruncation, so this geometry signal recovers the intended clamp. Multi-line
  // boxes (height >= ~2 lines) are left unclamped. lineHeight may be AUTO/%/px.
  try{
    var lh=node.lineHeight, fs=(typeof o.fontSize==='number')?o.fontSize:undefined, lhpx;
    if(lh&&lh.unit==='PIXELS') lhpx=lh.value;
    else if(lh&&lh.unit==='PERCENT'&&fs) lhpx=fs*lh.value/100;
    else if(fs) lhpx=fs*1.25;
    if(lhpx&&typeof node.height==='number'&&node.height<=lhpx*1.5) o.singleLine=true;
  }catch(e){}
  // Text fill opacity + bound colour-variable name \u2192 codegen maps low-emphasis
  // copy (reduced opacity or a "secondary" colour token) to attention="low".
  try{
    const f=node.fills;
    if(Array.isArray(f)){
      const solid=f.find(function(p){return p&&p.type==='SOLID'&&p.visible!==false;});
      if(solid){
        const nodeOp=(typeof node.opacity==='number')?node.opacity:1;
        const fillOp=(typeof solid.opacity==='number')?solid.opacity:1;
        o.fillOpacity=Math.round(nodeOp*fillOp*100)/100;
        const bv=solid.boundVariables&&solid.boundVariables.color;
        if(bv&&bv.id){ const nm=await varName(bv.id); if(nm) o.fillVar=nm; }
      }
    }
  }catch(e){}
  return Object.keys(o).length?o:undefined;
}
let count=0,byteEstimate=0,imageEvidenceCount=0;
const diagnostics=[];
const coverage={representedNodes:0,exactFirstPartyOpaqueSubtrees:0,foreignPrimitives:0,fullyCapturedUnknownRegions:0,truncatedEvidence:0};
const telemetry={totalVisitedNodesBeforeBudgeting:0,representedNodes:0,captureOnlyNodes:0,omittedOrTruncatedSubtrees:0,actualSerializedBytes:0,estimatedSerializedBytes:0,estimationErrorBytes:0,maximumDepth:0,depthDistribution:{},p95Depth:0,childrenPerNodeDistribution:{},p95ChildrenPerNode:0,vectorEvidenceSizes:[],imageEvidenceCount:0,truncationsByBudgetFamily:{},captureDurationMs:null,captureDurationPolicy:${JSON.stringify(e?.includeTimingTelemetry?"measured":"disabled-for-determinism")},exactSubtreeCount:0,compatibilitySubtreeCount:0,unresolvedSubtreeCount:0};
if(OPAQUE_AUTHORITY_DIAGNOSTIC)diagnostics.push({code:'OPAQUE_IDENTITY_VERSION_MISMATCH',severity:'error',figId:'document:root',confidence:'NONE',message:'Opaque subtree capture disabled because the Figma library version does not match ComponentContract identity provenance.',evidence:OPAQUE_AUTHORITY_DIAGNOSTIC,provenance:['capture-v2','ComponentContract']});
function nodeAddress(node,path){ return (node&&typeof node.id==='string'&&node.id)||'capture-path:'+path; }
function estimate(value){ try{return JSON.stringify(value).length;}catch(e){return 128;} }
function truncate(node,path,budget,details){
  const figId=nodeAddress(node,path);
  diagnostics.push({code:'NODE_TRUNCATED',severity:'warning',figId:figId,confidence:'NONE',message:'Capture budget truncated node evidence.',evidence:Object.assign({nodeType:node&&node.type||'UNKNOWN',exceededBudget:budget,recoverableFrom:'live Figma source'},details||{}),provenance:['capture-v2',budget]});
  coverage.truncatedEvidence++;
  telemetry.omittedOrTruncatedSubtrees++;telemetry.truncationsByBudgetFamily[budget]=(telemetry.truncationsByBudgetFamily[budget]||0)+1;
  return {id:node&&node.id,name:node&&node.name,type:node&&node.type||'UNKNOWN',captureState:'truncated',truncation:{budget:budget,retainedSummary:true}};
}
function primitiveInfo(node,path){
  if(!PRIMITIVES.has(node.type))return undefined;
  const o={kind:node.type};
  try{
    if(node.type==='VECTOR'||node.type==='BOOLEAN_OPERATION'){
      const network=node.vectorNetwork;
      const summary=network?{vertices:Array.isArray(network.vertices)?network.vertices.length:0,segments:Array.isArray(network.segments)?network.segments.length:0,regions:Array.isArray(network.regions)?network.regions.length:0}:undefined;
      if(summary)o.vectorSummary=summary;
      const paths=typeof node.vectorPaths==='string'?node.vectorPaths:undefined;
      if(paths){telemetry.vectorEvidenceSizes.push(paths.length);o.vectorPath=paths.slice(0,BUDGETS.maxVectorEvidence);if(paths.length>BUDGETS.maxVectorEvidence){o.vectorEvidenceTruncated=true;diagnostics.push({code:'NODE_TRUNCATED',severity:'warning',figId:nodeAddress(node,path),confidence:'NONE',message:'Capture budget truncated vector evidence.',evidence:{nodeType:node.type,exceededBudget:'maxVectorEvidence',retainedCharacters:BUDGETS.maxVectorEvidence,totalCharacters:paths.length,recoverableFrom:'live Figma source'},provenance:['capture-v2','maxVectorEvidence']});coverage.truncatedEvidence++;telemetry.omittedOrTruncatedSubtrees++;telemetry.truncationsByBudgetFamily.maxVectorEvidence=(telemetry.truncationsByBudgetFamily.maxVectorEvidence||0)+1;}}
    }
  }catch(e){}
  return o;
}
async function build(node,inherited,depth,path){
  if(depth>BUDGETS.maxDepth)return [truncate(node,path,'maxDepth',{depth:depth,limit:BUDGETS.maxDepth})];
  if(count>=BUDGETS.maxNodes)return [truncate(node,path,'maxNodes',{nodeCount:count,limit:BUDGETS.maxNodes})];
  if(byteEstimate>=BUDGETS.maxSerializedBytes)return [truncate(node,path,'maxSerializedBytes',{byteEstimate:byteEstimate,limit:BUDGETS.maxSerializedBytes})];
  if(node.visible===false||typeof node.opacity==='number'&&node.opacity<=0.01){
    coverage.representedNodes++;
    return [{id:node.id,name:node.name,type:node.type,captureState:'non-rendering',visible:node.visible!==false,opacity:typeof node.opacity==='number'?node.opacity:undefined}];
  }
  const expl=await keyModes(node,'explicitVariableModes');
  const eff=Object.assign({},inherited,expl);
  const isComp=node.type==='INSTANCE'||node.type==='COMPONENT';
  const hasOverride=Object.keys(expl).length>0;
  // Keep structural auto-layout frames so the hierarchy stays intact for layout.
  const hasAutoLayout=node.type==='FRAME'&&node.layoutMode&&node.layoutMode!=='NONE';
  // Keep visible TEXT nodes so their content survives to codegen (product names,
  // prices, headings, segmented-control labels). Without this, all text is dropped.
  const isText=node.type==='TEXT'&&typeof node.characters==='string'&&node.characters.trim().length>0;
  // Keep non-auto-layout frames too (so tab bars / absolutely-arranged groups
  // survive and their children's absoluteBox can drive row inference downstream).
  const isFrame=node.type==='FRAME'||node.type==='COMPONENT_SET';
  const isPrimitive=PRIMITIVES.has(node.type);
  const legacyKeep=isComp||hasAutoLayout||isText||isFrame||hasOverride;
  const keep=true;
  let main=null,identity;
  if(node.type==='INSTANCE'){
    try{
      const mc=await node.getMainComponentAsync();
      if(mc){
        const set=(mc.parent&&mc.parent.type==='COMPONENT_SET')?mc.parent:null;
        main=set?set.name:mc.name;
        const i={};
        if(typeof mc.key==='string'&&mc.key)i.mainComponentKey=mc.key;
        if(set&&typeof set.key==='string'&&set.key)i.componentSetKey=set.key;
        if(typeof mc.id==='string')i.mainComponentId=mc.id;
        if(typeof mc.remote==='boolean')i.remote=mc.remote;
        const variants=variantVals(node)||variantVals(mc);
        if(variants)i.variantProperties=variants;
        if(Object.keys(i).length)identity=i;
      }
    }catch(e){}
  }
  const exactOpaque=!!(identity&&identity.mainComponentKey&&EXACT_FIRST_PARTY_KEYS.has(identity.mainComponentKey));
  let self=null;
  if(keep){ count++;
    self={ id:node.id, name:node.name, type:node.type, component:main||undefined, identity:identity,
      appearance:eff.appearance, surface:eff.surface,
      visible:node.visible!==false, opacity:(typeof node.opacity==='number')?node.opacity:undefined,
      props:propVals(node), image:hasImageFill(node)||undefined,
      fill:isText?undefined:await bgFillInfo(node),
      chars:isText?node.characters.trim():undefined,
      typography:isText?await typographyInfo(node):undefined,
      layout:await layoutInfo(node),
      w:(typeof node.width==='number')?Math.round(node.width):undefined,
      h:(typeof node.height==='number')?Math.round(node.height):undefined,
      sizeH:node.layoutSizingHorizontal, sizeV:node.layoutSizingVertical,
      absolute:(node.layoutPositioning==='ABSOLUTE')||undefined,
      primitiveEvidence:primitiveInfo(node,path),
      captureOnly:!legacyKeep||undefined,
      captureState:exactOpaque?'opaque-exact-first-party':'captured',
      modeOverrides:hasOverride?expl:undefined, children:[] };
    const ownBytes=estimate(self);byteEstimate+=ownBytes;coverage.representedNodes++;
    telemetry.representedNodes++;if(!legacyKeep)telemetry.captureOnlyNodes++;
    if(isPrimitive)coverage.foreignPrimitives++;
    if(exactOpaque){coverage.exactFirstPartyOpaqueSubtrees++;telemetry.exactSubtreeCount++;}
    if(node.type==='INSTANCE'&&!identity){coverage.fullyCapturedUnknownRegions++;telemetry.unresolvedSubtreeCount++;}
  }
  if(exactOpaque){delete self.children;return [self];}
  const kids=('children'in node)?node.children:[];
  const bucket=self?self.children:[];
  const retained=kids.slice(0,BUDGETS.maxChildrenPerNode);
  for(let i=0;i<retained.length;i++){
    const ch=retained[i];
    if(count>=BUDGETS.maxNodes||byteEstimate>=BUDGETS.maxSerializedBytes){
      const budget=count>=BUDGETS.maxNodes?'maxNodes':'maxSerializedBytes';
      bucket.push(truncate(ch,path+'.'+i,budget,{omittedSubtreeCount:retained.length-i,limit:BUDGETS[budget],nodeCount:count,byteEstimate:byteEstimate}));
      break;
    }
    const arr=await build(ch,eff,depth+1,path+'.'+i); for(const c of arr)bucket.push(c);
  }
  if(kids.length>retained.length)bucket.push(truncate(node,path,'maxChildrenPerNode',{firstOmittedChildId:kids[retained.length]&&kids[retained.length].id,omittedChildCount:kids.length-retained.length,limit:BUDGETS.maxChildrenPerNode,parentFigId:nodeAddress(node,path)}));
  if(self){ if(self.children.length===0)delete self.children; return [self]; }
  return bucket;
}
const root=await figma.getNodeByIdAsync(ROOT_ID);
if(!root)return { error:'node_not_found', nodeId:ROOT_ID };
function scan(node,depth){telemetry.totalVisitedNodesBeforeBudgeting++;telemetry.maximumDepth=Math.max(telemetry.maximumDepth,depth);telemetry.depthDistribution[String(depth)]=(telemetry.depthDistribution[String(depth)]||0)+1;const kids=('children'in node)?node.children:[];telemetry.childrenPerNodeDistribution[String(kids.length)]=(telemetry.childrenPerNodeDistribution[String(kids.length)]||0)+1;try{const fills=node.fills;if(Array.isArray(fills))telemetry.imageEvidenceCount+=fills.filter(function(p){return p&&p.type==='IMAGE';}).length;}catch(e){}for(const child of kids)scan(child,depth+1);}
function percentile(hist,p){const values=[];for(const key of Object.keys(hist))for(let i=0;i<hist[key];i++)values.push(Number(key));values.sort(function(a,b){return a-b;});return values.length?values[Math.min(values.length-1,Math.ceil(values.length*p)-1)]:0;}
scan(root,0);telemetry.p95Depth=percentile(telemetry.depthDistribution,.95);telemetry.p95ChildrenPerNode=percentile(telemetry.childrenPerNodeDistribution,.95);
const base=await keyModes(root,'resolvedVariableModes');
const arr=await build(root,base,0,'0');
diagnostics.sort(function(a,b){return a.figId.localeCompare(b.figId)||a.code.localeCompare(b.code);});
telemetry.estimatedSerializedBytes=byteEstimate;telemetry.actualSerializedBytes=JSON.stringify({tree:arr[0]||null,diagnostics:diagnostics}).length;telemetry.estimationErrorBytes=telemetry.actualSerializedBytes-byteEstimate;if(CAPTURE_STARTED!==null)telemetry.captureDurationMs=Date.now()-CAPTURE_STARTED;
return { captureSchemaVersion:CAPTURE_SCHEMA_VERSION,rootId:ROOT_ID,base:base,budgets:BUDGETS,nodeCount:count,serializedByteEstimate:byteEstimate,tree:arr[0]||null,diagnostics:diagnostics,coverage:coverage,telemetry:telemetry };
`.trim()}export{y as buildModesSnippet,l as buildModesSnippetForContracts};
