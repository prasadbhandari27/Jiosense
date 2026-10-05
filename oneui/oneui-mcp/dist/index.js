#!/usr/bin/env node
import{StdioServerTransport as i}from"@modelcontextprotocol/sdk/server/stdio.js";import{createServer as n}from"./server.js";import{installWorkflowRules as a}from"./lib/installRules.js";import{bootstrapEnv as c}from"./lib/bootstrapEnv.js";import{buildIdentityLine as p,isDistStale as d}from"./lib/buildInfo.js";import{checkForMcpUpdate as l,renderStartupUpdateAdvisory as m}from"./lib/mcpUpdateCheck.js";import{isAssistComposeEnabled as u}from"./platforms/react/assist/featureFlag.js";c();async function f(){if(process.argv.includes("--install-rules")){const{path:e,changed:r}=a(void 0,{assistComposeEnabled:u()});process.stdout.write(`[oneui-mcp] workflow rule ${r?"installed at":"already up to date at"} ${e}
`);return}if(d()===!0)throw new Error("MCP dist is stale relative to local source. Rebuild before connecting the client.");const t=l(),o=n(),s=new i;await o.connect(s),process.stderr.write(`[oneui-mcp] ready on stdio \xB7 ${p()}
`);try{const e=await t,r=m(e);r&&process.stderr.write(`${r}
`)}catch{}}f().catch(t=>{process.stderr.write(`[oneui-mcp] fatal: ${t instanceof Error?t.stack:String(t)}
`),process.exit(1)});
