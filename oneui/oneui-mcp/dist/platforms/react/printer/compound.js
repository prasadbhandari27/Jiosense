import{relative as f,resolve as g}from"node:path";import{wrapReactSourceAddressable as m}from"./sourceAddressability.js";function a(t){return"  ".repeat(t)}function p(t){return typeof t=="string"?JSON.stringify(t):typeof t=="boolean"||typeof t=="number"?`{${t}}`:`{${JSON.stringify(t)}}`}function y(t,n){const r=g(n.projectRoot,t);let e=f(n.screenDir,r);e.startsWith(".")||(e=`./${e}`);let o=n.imageImports.get(e);return o||(o=`img${n.imageImports.size}`,n.imageImports.set(e,o)),o}function v(t,n,r,e){const o=[],c=t.slots.media?.nodes[0];if(c){const i=c.resolvedVisualFamily?.family==="Image"?c.resolvedVisualFamily.props:c.resolvedProps??{},l=typeof i.src=="string"?i.src:"",u=typeof i.alt=="string"?i.alt:"",$=l?`{${y(l,n)}}`:"{''}";o.push(`${a(r+1)}<Carousel.Slide.Image src=${$} alt=${JSON.stringify(u)}${t.scrim?" scrim={true}":""} contentAlignment="${t.contentAlignment}" />`)}if(t.slots.badges.nodes.length){const i=t.slots.badges.nodes.map(l=>n.renderNode(l,r+3,"row")).join(`
`);o.push(`${a(r+1)}<Carousel.Slide.Corner placement="start">
${i}
${a(r+1)}</Carousel.Slide.Corner>`)}if(t.slots.content.nodes.length){const i=t.slots.content.nodes.map(l=>n.renderNode(l,r+2,"column",{transparentSurfaceContext:!0})).join(`
`);o.push(`${a(r+1)}<Carousel.Slide.Content content={true} contentAlignment="${t.contentAlignment}" contentWidth="${t.contentWidth}">
${i}
${a(r+1)}</Carousel.Slide.Content>`)}const s=[`aria-label=${JSON.stringify(`Slide ${e+1}`)}`,...t.surface?[`surface="${t.surface}"`]:[],...t.slots.badges.nodes.length?["badgesStart"]:[]].join(" ");return o.length?`${a(r)}<Carousel.Slide ${s}>
${o.join(`
`)}
${a(r)}</Carousel.Slide>`:`${a(r)}<Carousel.Slide ${s} />`}function N(t,n,r){const e=t.resolvedCarousel;if(!e||e.platform!=="react")throw new Error("Carousel reached the React printer without resolved Carousel IR.");n.imports.add("Carousel");const o=[`aria-label=${JSON.stringify(e.ariaLabel)}`,`aspectRatio="${e.aspectRatio}"`,...e.followsAspectRatio===!1?["followsAspectRatio={false}"]:[],...e.followsAspectRatio===!1&&typeof e.height=="number"?[`height={${e.height}}`]:[],...e.fullWidth?["fullWidth"]:[],...e.peek==="both"?["opts={{ peek: 'both' }}"]:[],...e.defaultActivePage?[`defaultActivePage={${e.defaultActivePage}}`]:[],...typeof e.width=="number"?[`style={{ width: ${e.width}, flexShrink: 0 }}`]:[]].join(" "),c=e.slides.map((i,l)=>v(i,n,r+3,l)).join(`
`),s=[];if(e.slides.length&&s.push(`${a(r+1)}<Carousel.Viewport${e.peek==="both"?' peek="both"':""}>
${a(r+2)}<Carousel.Track>
${c}
${a(r+2)}</Carousel.Track>
${a(r+1)}</Carousel.Viewport>`),e.controls){const i=e.controls.appearance!=="auto"?` appearance="${e.controls.appearance}"`:"";s.push(`${a(r+1)}<Carousel.Controls placement="${e.controls.placement}" layout="${e.controls.layout}">
${a(r+2)}<Carousel.IndicatorList${i} />
${a(r+1)}</Carousel.Controls>`)}return s.length?`${a(r)}<Carousel.Root ${o}>
${s.join(`
`)}
${a(r)}</Carousel.Root>`:`${a(r)}<Carousel.Root ${o} />`}function d(t,n,r){if(!t?.length)return;const e=t.map(o=>n.renderNode(o,r+1,"row")).join(`
`);return t.length===1?e.trim():`<>
${e}
${a(r)}</>`}function b(t,n,r){const e=t.props.type;if(typeof e!="string")throw new Error("Resolved SecondaryNav IR is missing a contract-valid type.");const o=['aria-label="Secondary navigation"',`type=${p(e)}`,...typeof t.props.activeValue=="string"?[`activeValue=${p(t.props.activeValue)}`]:[],...t.props.secondaryNavItems===!1?["secondaryNavItems={false}"]:[]].join(" "),c=t.items.map(s=>{const i=[`value=${p(s.value)}`,...s.props.active===!0?["active"]:[],...typeof s.props.attention=="string"?[`attention=${p(s.props.attention)}`]:[],...s.props.visuallyAlignToStart===!0?["visuallyAlignToStart"]:[]].join(" "),l=`${a(r+1)}<WebHeader.Item ${i}>{${JSON.stringify(s.text)}}</WebHeader.Item>`;return m(l,s.sourceFigId,n.sourceAddressability,r+1,"WebHeader.Item")}).join(`
`);return`${a(r)}<WebHeader.SecondaryNav ${o}>
${c}
${a(r)}</WebHeader.SecondaryNav>
`}function h(t,n,r){n.imports.add("WebHeader");const e=t.resolvedHeader;if(!e||e.targetComponent!=="WebHeader")return n.warnings.push("WebHeader reached the printer without resolved Header IR."),`${a(r)}{/* unresolved WebHeader */}`;const o=e.primaryNavProps??{};if(typeof o.type!="string"||typeof o.middle!="string"||typeof e.props.breakpoint!="string")throw new Error("Resolved WebHeader IR is missing required compound printer data.");const c=d(e.logo?.nodes,n,r+1),s=d(e.trailing?.nodes,n,r+1),i=d(e.avatar?.nodes,n,r+1),l=['aria-label="Primary navigation"',`type="${o.type}"`,`middle="${o.middle}"`,`searchInput="${typeof o.searchInput=="string"?o.searchInput:"none"}"`,`primaryNavItems={${o.primaryNavItems===!0}}`,`startActions={${o.startActions===!0}}`,...typeof o.title=="string"?[`title=${p(o.title)}`]:[],...typeof o.searchPlaceholder=="string"?[`searchPlaceholder=${p(o.searchPlaceholder)}`]:[],...typeof o.divider=="boolean"?[`divider={${o.divider}}`]:[],...o.showAvatar===!1?["showAvatar={false}"]:[],...c?[`logo={${c}}`]:[],...s?[`end={${s}}`]:[],...i?[`avatar={${i}}`]:[]].join(" "),u=e.secondaryNav?b(e.secondaryNav,n,r+1):"";return`${a(r)}<WebHeader breakpoint="${e.props.breakpoint}" secondaryNav={${e.props.secondaryNav===!0}} dividerPrimaryNav={${e.props.dividerPrimaryNav===!0}} dividerSecondaryNav={${e.props.dividerSecondaryNav!==!1}}>
${a(r+1)}<WebHeader.PrimaryNav ${l} />
`+u+`${a(r)}</WebHeader>`}export{N as renderResolvedReactCarousel,h as renderResolvedReactHeader};
