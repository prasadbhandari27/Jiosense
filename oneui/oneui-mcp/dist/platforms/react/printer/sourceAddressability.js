function u(t){return"  ".repeat(t)}function e(t){return JSON.stringify(t)}function c(t,r,n){return r&&t?` data-fig=${e(t)}${n?` data-component=${e(n)}`:""}`:""}function o(t,r,n,a,i){return!n||!r||!t.trim()||t.trimStart().startsWith("{/*")?t:`${u(a)}<span data-fig=${e(r)}${i?` data-component=${e(i)}`:""} style={{ display: 'contents' }}>
${t}
${u(a)}</span>`}export{c as reactSourceFigAttr,o as wrapReactSourceAddressable};
