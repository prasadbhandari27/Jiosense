import{mkdirSync as Y,writeFileSync as _}from"node:fs";import{isAbsolute as J,relative as L,resolve as P}from"node:path";import{dartString as f,dartWidgetName as V,sanitizeFlutterClassName as Q}from"../../../lib/flutterFigma.js";import{resolveSemanticIconName as B}from"../../../lib/iconSemanticName.js";const Z="  ",i=e=>Z.repeat(e),D=new Set(["children","child","key","style","className","testID","accessibilityRole"]);function q(e){const n={};for(const t of[e.props,e.resolvedProps])if(t)for(const[u,c]of Object.entries(t))(typeof c=="string"||typeof c=="number"||typeof c=="boolean")&&(n[u]=c);return n}function nn(e){return typeof e=="boolean"?e?"true":"false":typeof e=="number"?String(e):f(e)}function en(e,n){return n==="bold"||n==="subtle"||n==="ghost"?n:e==="high"?"bold":e==="medium"?"subtle":e==="low"?"ghost":n}const tn=new Set(["high","medium","low"]),on=new Set(["image","icon","text"]),F=/^[A-Za-z]{1,3}$/;function rn(e,n,t,u){const c=i(t+1),$=typeof e.content=="string"?e.content.trim().toLowerCase():"image";let r=on.has($)?$:"image";const l=(typeof e.size=="string"?e.size.trim().toLowerCase():"m")||"m",g=typeof e.attention=="string"?e.attention.trim().toLowerCase():"medium",m=tn.has(g)?g:"medium",y=typeof e.appearance=="string"?e.appearance.trim():"",b=typeof e.src=="string"?e.src.trim():"",h=typeof e.fallback=="string"?e.fallback.trim():"";let o=typeof e.alt=="string"?e.alt.trim():(n.text??"").trim();r==="image"&&!b&&(u.push(`OneUiAvatar content=image without src (fig ${n.figId??n.name??"?"}) \u2014 emitting text/icon, not a fake image.`),r=h||o?"text":"icon"),r==="text"&&F.test(h)&&(!o||o.toLowerCase().includes("avatar"))&&(o=h.toUpperCase()),r==="text"&&!o&&(o=h||"User");const a=[];return r==="text"?(a.push(`${c}content: OneUiAvatarContent.text,`),a.push(`${c}alt: ${f(o)},`)):r==="icon"?(a.push(`${c}content: OneUiAvatarContent.icon,`),a.push(`${c}alt: ${f(o||"Avatar")},`)):(a.push(`${c}content: OneUiAvatarContent.image,`),a.push(`${c}src: ${f(b)},`),a.push(`${c}alt: ${f(o||"Avatar")},`),F.test(h)&&a.push(`${c}fallback: Text(${f(h.toUpperCase())}),`)),a.push(`${c}size: ${f(l)},`),a.push(`${c}attention: OneUiAvatarAttention.${m},`),y&&y!=="auto"&&a.push(`${c}appearance: ${f(y)},`),a}function k(e){if(!e)return;const n=e.split("/").pop()||e,t=n.toLowerCase();return t==="margin"?"Margin":t==="gutter"?"Gutter":n}const sn=["brand-bg","primary","secondary","neutral","sparkle","positive","negative","warning","informative"],an=["default","ghost","minimal","subtle","moderate","bold","elevated"];function cn(e){if(!e)return;const n=e.trim().toLowerCase();for(const t of sn)if(n===t||n.includes(`${t}-`)||n.includes(`/${t}/`)||n.includes(`${t}/`))return t}function ln(e){if(!e)return;const n=e.trim().toLowerCase();for(const t of an)if(n.includes(t))return t}function z(e){return e.layout?.absolute===!0&&!!e.layout.absoluteBox}function E(e){if(!(typeof e!="number"||e<=0))return`BorderRadius.circular(${e})`}function G(e,n){if(e?.direction!=="row"||e.wrap)return!1;const t=e.absoluteBox?.w;if(!t||!n.length)return!1;let u=0;for(const c of n){const $=c.layout?.absoluteBox?.w;if(typeof $!="number")return!1;u+=$}return u>t*1.05}function C(e){return`_oneUiScale(context, ${e})`}function W(e,n){return`${i(n)}SingleChildScrollView(
${i(n+1)}scrollDirection: Axis.horizontal,
${i(n+1)}child:
${e},
${i(n)})`}function H(e,n,t,u,c){const $=e.layout?.absoluteBox??{},r=typeof $.x=="number"?$.x-(c?.x??0):void 0,s=typeof $.y=="number"?$.y-(c?.y??0):void 0,l=O(e,n+1,t,u),g=[];return typeof r=="number"&&g.push(`${i(n+1)}left: ${C(r)},`),typeof s=="number"&&g.push(`${i(n+1)}top: ${C(s)},`),typeof $.w=="number"&&g.push(`${i(n+1)}width: ${C($.w)},`),typeof $.h=="number"&&g.push(`${i(n+1)}height: ${C($.h)},`),`${i(n)}Positioned(
${g.join(`
`)}
${i(n+1)}child:
${l},
${i(n)}),`}function un(e,n){switch(e){case"start":return"CrossAxisAlignment.start";case"center":return"CrossAxisAlignment.center";case"end":return"CrossAxisAlignment.end";case"baseline":return"CrossAxisAlignment.baseline";default:return n?"CrossAxisAlignment.stretch":"CrossAxisAlignment.start"}}const j={horizontal:!1,vertical:!1};function fn(e){return e==="row"?"horizontal":"vertical"}function $n(e){return e==="row"?"vertical":"horizontal"}function M(e,n){return n?{...e,horizontal:!0}:e}function K(e,n,t=j){const u=(e.kind==="node"||e.kind==="surface")&&e.layout?.direction==="row"?"row":"column";if(t[$n(u)])return!0;if(!n||n.wrap)return!1;const c=n.direction==="row"?"row":"column";return u===c?!1:!X(e.box,n)}function mn(e){switch(e){case"center":return"MainAxisAlignment.center";case"end":return"MainAxisAlignment.end";case"between":return"MainAxisAlignment.spaceBetween";default:return"MainAxisAlignment.start"}}function pn(e){switch(e){case"center":return"WrapCrossAlignment.center";case"end":return"WrapCrossAlignment.end";default:return"WrapCrossAlignment.start"}}function X(e,n,t=!1){if(!e||n?.wrap||t)return!1;const u=n?.direction??"column";return u==="row"&&e.sizeH==="fill"||u==="column"&&e.sizeV==="fill"}function R(e,n,t,u,c,$=j){const r=c?.direction==="row"?"row":"column",s=X(e.box,c,$[fn(c?.direction)]),l=!s&&!c?.wrap,g=l&&r==="row"&&e.box?.sizeH==="fixed"&&typeof e.box.w=="number"&&e.box.w>0?e.box.w:void 0,m=l&&r==="column"&&e.box?.sizeV==="fixed"&&typeof e.box.h=="number"&&e.box.h>0?e.box.h:void 0,y={horizontal:$.horizontal&&g===void 0,vertical:$.vertical&&m===void 0};let b=O(e,n,t,u,c,y);return s?`${i(n)}Expanded(
${i(n+1)}child:
${b},
${i(n)}),`:(g!==void 0?b=`${i(n)}SizedBox(
${i(n+1)}width: ${C(g)},
${i(n+1)}child:
${b},
${i(n)})`:m!==void 0&&(b=`${i(n)}SizedBox(
${i(n+1)}height: ${C(m)},
${i(n+1)}child:
${b},
${i(n)})`),`${b},`)}function gn(e,n,t,u){const c=i(n+1),$=e.children??[];if(!$.length)return u.push(`Tabs (fig ${e.figId??e.name??"?"}) has no children \u2014 emitting an empty OneUiTabGroup; hand-author real tab items.`),`${i(n)}OneUiTabGroup(
${c}defaultValue: 'tab-0',
${c}children: const [],
${i(n)})`;t.add("OneUiTabItem");const r=$.map((s,l)=>{const g=`tab-${l}`,m=O(s,n+2,t,u);return`${c}OneUiTabItem(
${i(n+2)}value: ${f(g)},
${i(n+2)}child:
${m},
${c}),`}).join(`
`);return`${i(n)}OneUiTabGroup(
${c}defaultValue: ${f("tab-0")},
${c}children: [
${r}
${c}],
${i(n)})`}function bn(e,n,t,u){const c=i(n+1),$=(e.text??e.name??"Carousel").trim()||"Carousel",r=e.children??[];if(!r.length)return u.push(`Carousel (fig ${e.figId??e.name??"?"}) has no children \u2014 emitting an empty OneUiCarouselRoot; hand-author real slides.`),`${i(n)}OneUiCarouselRoot(
${c}ariaLabel: ${f($)},
${c}children: const [],
${i(n)})`;t.add("OneUiCarouselItem");const s=r.map(l=>{const g=O(l,n+2,t,u);return`${c}OneUiCarouselItem(
${i(n+2)}child:
${g},
${c}),`}).join(`
`);return`${i(n)}OneUiCarouselRoot(
${c}ariaLabel: ${f($)},
${c}children: [
${s}
${c}],
${i(n)})`}function dn(e,n,t,u){const c=i(n+1),$=(e.children??[]).filter(m=>m.kind==="component"&&m.component==="Chip"),r=[],s=e.props?.defaultValue??e.resolvedProps?.defaultValue;if(Array.isArray(s)&&s.every(m=>typeof m=="string")&&r.push(`${c}defaultValue: [${s.map(m=>f(m)).join(", ")}],`),(e.props?.multiple===!0||e.resolvedProps?.multiple===!0)&&r.push(`${c}multiple: true,`),!$.length)return u.push(`ChipGroup (fig ${e.figId??e.name??"?"}) has no Chip children \u2014 emitting an empty OneUiChipGroup; hand-author real chips.`),r.push(`${c}children: const [],`),`${i(n)}OneUiChipGroup(
${r.join(`
`)}
${i(n)})`;const g=$.map(m=>`${O(m,n+1,t,u)},`).join(`
`);return r.push(`${c}children: [
${g}
${c}],`),`${i(n)}OneUiChipGroup(
${r.join(`
`)}
${i(n)})`}function T(e,n,t,u=!0){const c=n?.direction==="row"?"Row":"Column",$=e.length?e:[`${i(t+1)}const SizedBox.shrink(),`],r=k(n?.gap),s=[];$.forEach((o,a)=>{if(s.push(o),r&&a<$.length-1){const p=c==="Row"?"width":"height";s.push(`${i(t+1)}SizedBox(${p}: _oneUiSpacingPx(context, ${f(r)})),`)}});const l=s.join(`
`);let g;if(n?.wrap){const o=r?`_oneUiSpacingPx(context, ${f(r)})`:"0.0";g=`${i(t)}Wrap(
${i(t+1)}direction: Axis.${c==="Row"?"horizontal":"vertical"},
${i(t+1)}spacing: ${o},
${i(t+1)}runSpacing: ${o},
${i(t+1)}crossAxisAlignment: ${pn(n?.align)},
${i(t+1)}children: [
${l}
${i(t+1)}],
${i(t)})`}else g=`${i(t)}${c}(
${i(t+1)}mainAxisAlignment: ${mn(n?.justify)},
${i(t+1)}crossAxisAlignment: ${un(n?.align,u)},
${i(t+1)}children: [
${l}
${i(t+1)}],
${i(t)})`;const m=k(n?.paddingTop),y=k(n?.paddingRight),b=k(n?.paddingBottom),h=k(n?.paddingLeft);if(m||y||b||h){const o=[];m&&o.push(`top: _oneUiSpacingPx(context, ${f(m)})`),y&&o.push(`right: _oneUiSpacingPx(context, ${f(y)})`),b&&o.push(`bottom: _oneUiSpacingPx(context, ${f(b)})`),h&&o.push(`left: _oneUiSpacingPx(context, ${f(h)})`),g=`${i(t)}Padding(
${i(t+1)}padding: EdgeInsets.only(${o.join(", ")}),
${i(t+1)}child:
${g},
${i(t)})`}return g}function O(e,n,t,u,c,$=j){if(e.kind==="surface"){t.add("OneUiSurface");const o=(e.children??[]).filter(w=>!z(w)),a=(e.children??[]).filter(z),p=o.length>0&&G(e.layout,o),d=M($,p),S=o.map(w=>R(w,n+2,t,u,e.layout,d));let U=S.length?T(S,e.layout,n+1,!K(e,c,d)):`${i(n+1)}const SizedBox.shrink()`;if(p&&(U=W(U,n+1)),a.length){const w=a.map(N=>H(N,n+2,t,u,e.layout?.absoluteBox)).join(`
`);U=`${i(n+1)}Stack(
${i(n+2)}children: [
${U},
${w}
${i(n+2)}],
${i(n+1)})`}const A=e.mode??"default",x=[`${i(n+1)}mode: ${f(A)},`],v=e.resolvedProps?.appearance??e.resolvedSemanticProps?.appearance;typeof v=="string"&&v&&v!=="auto"&&x.push(`${i(n+1)}appearance: ${f(v)},`);const I=E(e.layout?.cornerRadius);return I&&x.push(`${i(n+1)}borderRadius: ${I},`),x.push(`${i(n+1)}child:
${U},`),`${i(n)}OneUiSurface(
${x.join(`
`)}
${i(n)})`}if(e.kind==="node"){const o=(e.children??[]).filter(x=>!z(x)),a=(e.children??[]).filter(z),p=o.length>0&&G(e.layout,o),d=M($,p),S=o.map(x=>R(x,n+1,t,u,e.layout,d));let U=T(S,e.layout,n,!K(e,c,d));if(p&&(U=W(U,n)),a.length){const x=a.map(v=>H(v,n+1,t,u,e.layout?.absoluteBox)).join(`
`);U=`${i(n)}Stack(
${i(n+1)}children: [
${U},
${x}
${i(n+1)}],
${i(n)})`}const A=e.fillEvidence;if(A&&!A.hidden&&!A.occluded&&!A.image){const x=cn(A.boundVar);if(x){t.add("OneUiSurface");const v=ln(A.boundVar)??"subtle",I=x==="brand-bg"?"":`
${i(n+1)}appearance: ${f(x)},`,w=E(e.layout?.cornerRadius),N=w?`
${i(n+1)}borderRadius: ${w},`:"";U=`${i(n)}OneUiSurface(
${i(n+1)}mode: ${f(v)},${I}${N}
${i(n+1)}child:
${U},
${i(n)})`}}return U}const r=V(e.component);t.add(r);const s=q(e),l=[];if(r==="OneUiAvatar")return t.add("OneUiAvatar"),l.push(...rn(s,e,n,u)),`${i(n)}${r}(
${l.join(`
`)}
${i(n)})`;if(r==="OneUiTabs")return t.add("OneUiTabGroup"),gn(e,n,t,u);if(r==="OneUiCarousel")return t.add("OneUiCarouselRoot"),bn(e,n,t,u);if(r==="OneUiChipGroup")return t.add("OneUiChipGroup"),dn(e,n,t,u);const g=en(typeof s.attention=="string"?s.attention:void 0,typeof s.variant=="string"?s.variant:void 0);g&&r==="OneUiButton"&&l.push(`${i(n+1)}variant: OneUiButtonVariant.${g},`),typeof s.appearance=="string"&&s.appearance&&s.appearance!=="auto"&&l.push(`${i(n+1)}appearance: ${f(s.appearance)},`);const m=typeof s.label=="string"&&s.label||typeof s.children=="string"&&s.children||e.text||"";if(r==="OneUiText"&&(m||e.text)?l.push(`${i(n+1)}text: ${f(m||e.text||"")},`):m&&(r==="OneUiButton"||r==="OneUiChip")?l.push(`${i(n+1)}label: ${f(m)},`):m&&r==="OneUiBadge"&&l.push(`${i(n+1)}child: ${f(m)},`),r==="OneUiChip"&&typeof s.value=="string"&&s.value&&l.push(`${i(n+1)}value: ${f(s.value)},`),r==="OneUiSlider"){const o=e.props?.defaultValue??e.resolvedProps?.defaultValue;Array.isArray(o)&&o.every(p=>typeof p=="number")?l.push(`${i(n+1)}defaultValue: [${o.join(", ")}],`):typeof o=="number"&&l.push(`${i(n+1)}defaultValue: ${o},`);for(const p of["min","max","step","largeStep"]){const d=s[p];typeof d=="number"&&l.push(`${i(n+1)}${p}: ${d},`)}const a=e.slots??{};for(const p of["start","end"]){const d=a[p];if(d?.length){const S=O(d[0],n+2,t,u);l.push(`${i(n+1)}${p}:
${S},`)}}}if(r==="OneUiImage"){const o=typeof s.src=="string"?s.src:"",a=typeof s.alt=="string"&&s.alt||e.text||"Image";if(!o){const p=e.figId??e.name??"?";return u.push(`OneUiImage missing src (fig ${p}) \u2014 image asset failed to download; node omitted.`),`${i(n)}const SizedBox.shrink() /* TODO(image): asset for fig ${p} was not downloaded */`}l.push(`${i(n+1)}src: ${f(o)},`),l.push(`${i(n+1)}alt: ${f(a)},`),typeof e.box?.w=="number"&&e.box.w>0&&l.push(`${i(n+1)}width: ${C(e.box.w)},`),typeof e.box?.h=="number"&&e.box.h>0&&l.push(`${i(n+1)}height: ${C(e.box.h)},`)}if(r==="OneUiIconButton"){const o=typeof s.icon=="string"&&B(s.icon)||typeof e.resolvedVisualFamily?.iconName=="string"&&e.resolvedVisualFamily.iconName||"placeholder",a=typeof s.semanticsLabel=="string"&&s.semanticsLabel||typeof s.accessibilityLabel=="string"&&s.accessibilityLabel||m||"Icon";l.push(`${i(n+1)}icon: ${f(o)},`),l.push(`${i(n+1)}semanticsLabel: ${f(a)},`)}if(r==="OneUiIcon"){const o=typeof s.icon=="string"&&B(s.icon)||typeof e.resolvedVisualFamily?.iconName=="string"&&e.resolvedVisualFamily.iconName||"placeholder";l.push(`${i(n+1)}icon: ${f(o)},`)}if(r==="OneUiLogo"){const o=typeof s.alt=="string"&&s.alt||m||e.name||"";l.push(`${i(n+1)}alt: ${f(o)},`)}if(r==="OneUiBottomNavItem"){const o=typeof s.icon=="string"&&B(s.icon)||typeof e.resolvedVisualFamily?.iconName=="string"&&e.resolvedVisualFamily.iconName||"placeholder";l.push(`${i(n+1)}icon: ${f(o)},`);const a=typeof s.semanticsLabel=="string"&&s.semanticsLabel||typeof s.accessibilityLabel=="string"&&s.accessibilityLabel||m||"Nav item";l.push(`${i(n+1)}semanticsLabel: ${f(a)},`)}if(r==="OneUiInput"){m&&l.push(`${i(n+1)}label: ${f(m)},`);const o=typeof s.placeholder=="string"?s.placeholder:"";if(o&&l.push(`${i(n+1)}placeholder: ${f(o)},`),typeof s.icon=="string"&&s.icon){const a=B(s.icon);l.push(`${i(n+1)}start:
${i(n+2)}OneUiIcon(
${i(n+3)}icon: ${f(a)},
${i(n+2)}),`),t.add("OneUiIcon")}l.push(`${i(n+1)}onChanged: (_) {},`)}if(r==="OneUiCheckbox"&&m&&l.push(`${i(n+1)}label: ${f(m)},`),r==="OneUiButton"){const o=e.slots??{};for(const a of["start","end"]){const p=o[a];if(p?.length){const d=O(p[0],n+2,t,u);l.push(`${i(n+1)}${a}:
${d},`)}}}if(r==="OneUiLinearProgressIndicator"||r==="OneUiCircularProgressIndicator"){const o=r==="OneUiLinearProgressIndicator"?["value","type","roundCaps"]:["value","min","max","variant","content"];for(const a of o){const p=s[a];p!==void 0&&l.push(`${i(n+1)}${a}: ${nn(p)},`)}}(r==="OneUiButton"||r==="OneUiIconButton"||r.includes("Button"))&&l.push(`${i(n+1)}onPressed: () {},`);for(const[o,a]of Object.entries(s))if(!D.has(o)&&!["label","children","text","src","alt","attention","variant","appearance","onPress","onClick","onPressed","onChanged","placeholder","icon","semanticsLabel","accessibilityLabel"].includes(o)){if(o==="disabled"||o==="loading"||o==="fullWidth"||o==="contained"||o==="condensed"){a===!0&&l.push(`${i(n+1)}${o}: true,`);continue}if(o==="size"&&(typeof a=="number"||typeof a=="string")){typeof a=="number"?l.push(`${i(n+1)}size: ${a},`):r==="OneUiIconButton"?l.push(`${i(n+1)}sizeAlias: ${f(a)},`):l.push(`${i(n+1)}size: ${f(a)},`);continue}o==="mode"&&typeof a=="string"&&l.push(`${i(n+1)}mode: ${f(a)},`)}const y={...e.props??{},...e.resolvedProps??{}};for(const[o,a]of Object.entries(y))D.has(o)||o in s||["label","children","text","src","alt","attention","variant","appearance","onPress","onClick","onPressed","onChanged","placeholder","icon","semanticsLabel","accessibilityLabel","value","defaultValue"].includes(o)||(Array.isArray(a)?a.every(p=>typeof p=="string")?l.push(`${i(n+1)}${o}: [${a.map(p=>f(p)).join(", ")}],`):a.every(p=>typeof p=="number")?l.push(`${i(n+1)}${o}: [${a.join(", ")}],`):a.length&&u.push(`${r} (fig ${e.figId??e.name??"?"}) has non-scalar prop "${o}" with mixed/unsupported item types \u2014 omitted, hand-author if needed.`):a!==null&&typeof a=="object"&&u.push(`${r} (fig ${e.figId??e.name??"?"}) has object-valued prop "${o}" \u2014 omitted, hand-author if needed.`));const b=e.children??[],h=r==="OneUiText"||r==="OneUiImage"||r==="OneUiButton"||r==="OneUiIconButton"||r==="OneUiInput"||r==="OneUiCheckbox"||r==="OneUiChip"||r==="OneUiAvatar";if(r==="OneUiBottomNavigation"){const o=b.map(a=>`${O(a,n+2,t,u)},`).join(`
`);l.push(`${i(n+1)}children: [
${o}
${i(n+1)}],`)}else if(b.length&&!h){const o=b.map(a=>R(a,n+2,t,u,e.layout));l.push(`${i(n+1)}child:
${T(o,e.layout,n+2)},`)}return l.length?`${i(n)}${r}(
${l.join(`
`)}
${i(n)})`:`${i(n)}${r}()`}function hn(e){if(!e||e.kind!=="surface"&&e.kind!=="node"||!e.children?.length)return{tree:e};let n;const t=e.children.filter(u=>!n&&u.kind==="component"&&V(u.component)==="OneUiBottomNavigation"?(n=u,!1):!0);return n?{tree:{...e,children:t},bottomNav:n}:{tree:e}}function An(e,n){const t=Q(n.screenName??e.tree?.name??"Screen"),u=new Set(["OneUiSurface"]),c=[],{tree:$,bottomNav:r}=hn(e.tree),s=$?O($,5,u,c,void 0,{horizontal:!1,vertical:!0}):`${i(5)}const SizedBox.shrink()`,l=r?O(r,4,u,c):void 0,m=s.includes("_oneUiSpacingPx(")||(l?.includes("_oneUiSpacingPx(")??!1)?["","/// Resolves a Figma-captured spacing/gap/padding token to a runtime px value","/// via the current brand/platform/density \u2014 never a hardcoded literal.","double _oneUiSpacingPx(BuildContext context, String token) {","  final scope = OneUiScope.of(context);","  return getSpacingTokenPx(","    spacingName: token,","    platform: scope.platformId,","    density: scope.density,","    platformsConfig: scope.platformsFoundationConfig,","  );","}"]:[],y=$?.box?.w??402,h=s.includes("_oneUiScale(")||(l?.includes("_oneUiScale(")??!1)?["","/// Figma frame width this screen was captured at \u2014 see _oneUiScale below.",`const double _kOneUiDesignWidth = ${y};`,"","/// Scales a Figma-measured pixel dimension by the current device width so","/// the screen stays proportional to the design across real device sizes","/// instead of clipping/gapping when the device differs from the capture width.","double _oneUiScale(BuildContext context, num px) {","  return px * MediaQuery.of(context).size.width / _kOneUiDesignWidth;","}"]:[],o=["import 'package:flutter/material.dart';","import 'package:ui_flutter/ui_flutter.dart';",...m,...h,"","/// Generated by figma_to_code (platform=flutter). Tokens only \u2014 no literal Color/hex/EdgeInsets.",`class ${t} extends StatelessWidget {`,`  const ${t}({super.key});`,"","  @override","  Widget build(BuildContext context) {","    return Scaffold(","      body: OneUiSurface(","        mode: 'default',","        child: SingleChildScrollView(","          child:",s+",","        ),","      ),",...l?["      bottomNavigationBar: OneUiSurface(","        mode: 'default',","        child:",l+",","      ),"]:[],"    );","  }","}",""].join(`
`),a=J(n.outDir)?n.outDir:P(n.projectRoot,n.outDir);Y(a,{recursive:!0});const p=P(a,`${t}.dart`),d=P(a,`${t}.json`);return _(p,o,"utf8"),_(d,JSON.stringify(n.rawHierarchy??e.tree??{},null,2),"utf8"),{file:p,relPath:L(n.projectRoot,p),jsonFile:d,jsonRelPath:L(n.projectRoot,d),code:o,componentName:t,components:[...u].sort(),warnings:c}}export{An as generateFlutterScreen};
