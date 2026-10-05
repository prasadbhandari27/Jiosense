const o="ONEUI_MCP_ENABLE_ASSIST_COMPOSE";function s(e=process.env){return e[o]?.trim().toLowerCase()==="true"}export{o as ASSIST_COMPOSE_ENV,s as isAssistComposeEnabled};
