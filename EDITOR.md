# The editor: yours, and how agents can use it

**UEFN is yours.** Indie Studio's departments each work in their own copy of the island's files, in the background: they write `.verse` files and plans, and anything that has to happen in UEFN (building Verse, placing devices, imports, the version code) comes back to you as "For you" steps. The UEFN MCP (below) takes one call at a time; when you want an agent to drive the editor, say so in the request, and only one at a time.

UEFN 42.40 is on this PC: `C:\Program Files\Epic Games\Fortnite_Studio`. Islands normally live in `Documents\Fortnite Projects\<Island>`; the Verse files are under `Plugins\<Island>\Content`.

## Epic's UEFN MCP
It runs inside the open editor at `http://127.0.0.1:8000/mcp`. Its tools read, edit and compile Verse, work with Scene Graph entities, place creative devices and set their `@editable` values, start and stop play sessions, push Verse changes and read the client log.

Switch it on (the owner, in UEFN):
1. Project Settings > **Beta Access**: turn on **Python Editor Scripting** and **UEFN MCP Toolsets**. Restart UEFN. (In Sept–Oct 2026 some people couldn't find these switches at first: test this well before the jam.)
2. Put a `.mcp.json` in the island's project folder pointing at the address above (Epic's guide: https://dev.epicgames.com/documentation/en-us/fortnite/uefn-mcp).

Connect a client to it (once, in a terminal in the island's folder), if you want one to drive the editor:
- Claude Code: `claude mcp add --transport http uefn http://127.0.0.1:8000/mcp`
- Codex: add to `%USERPROFILE%\.codex\config.toml`:
  ```
  [mcp_servers.uefn]
  url = "http://127.0.0.1:8000/mcp"
  ```

Known: the editor can hitch, positions can come out on the wrong axis (check after placing), and restarting the MCP means restarting UEFN.

## Without the MCP
- Agents write `.verse` files as text; the owner presses Verse > **Build Verse Code** (or Build / Push Verse Changes in the VS Code Verse extension). There's no command-line Verse compiler, so there's no "Run check" for UEFN.
- Asset imports, publishing and the private version code are always the owner's, in the editor and the Creator Portal.

## What worked (tested 11 Nov 2026)
- Epic's built-in UEFN MCP (beta, free, no key) is registered for Claude Code as `uefn`. An agent read the level, placed and moved a prop, moved the camera and took viewport screenshots.
- The island's floor isn't at the world origin: read the actors around a spot before placing anything there.
- It can make the editor hitch: one agent drives it at a time.
-
