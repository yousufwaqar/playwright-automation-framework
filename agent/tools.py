import os
import subprocess
from typing import Dict, Any, List

REPO_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def resolve_path(relative_path: str) -> str:
    """Resolve a path relative to the repository root and ensure it is safe."""
    abs_path = os.path.abspath(os.path.join(REPO_DIR, relative_path))
    if not abs_path.startswith(os.path.abspath(REPO_DIR)):
        raise ValueError(f"Path escape attempt detected: {relative_path}")
    return abs_path

def list_files(dir_path: str = ".") -> List[str]:
    """List files in the given directory relative to the repo root."""
    resolved = resolve_path(dir_path)
    if not os.path.isdir(resolved):
        return []
    
    file_list = []
    for root, dirs, files in os.walk(resolved):
        # Exclude directories like .git, node_modules, dist, etc.
        dirs[:] = [d for d in dirs if d not in (".git", "node_modules", "dist", "playwright-report", "test-results")]
        for f in files:
            rel = os.path.relpath(os.path.join(root, f), REPO_DIR)
            file_list.append(rel)
    return sorted(file_list)

def read_file(file_path: str) -> str:
    """Read a file's content relative to the repo root."""
    resolved = resolve_path(file_path)
    if not os.path.isfile(resolved):
        raise FileNotFoundError(f"File not found: {file_path}")
    with open(resolved, "r", encoding="utf-8") as f:
        return f.read()

def write_file(file_path: str, content: str) -> str:
    """Create or overwrite a file relative to the repo root."""
    resolved = resolve_path(file_path)
    os.makedirs(os.path.dirname(resolved), exist_ok=True)
    with open(resolved, "w", encoding="utf-8") as f:
        f.write(content)
    return f"Successfully wrote {len(content)} chars to {file_path}"

def edit_file_patch(file_path: str, search: str, replace: str) -> str:
    """Replace content in a file relative to the repo root."""
    resolved = resolve_path(file_path)
    if not os.path.isfile(resolved):
        raise FileNotFoundError(f"File not found: {file_path}")
    
    with open(resolved, "r", encoding="utf-8") as f:
        content = f.read()
    
    if search not in content:
        raise ValueError(f"Could not find exact text match to replace in {file_path}")
    
    new_content = content.replace(search, replace, 1)
    with open(resolved, "w", encoding="utf-8") as f:
        f.write(new_content)
    return f"Successfully updated {file_path}"

def run_command(cmd: str) -> Dict[str, Any]:
    """Run an npm/npx or git command in the repository context."""
    # Ensure commands are safe (mainly allow npm, npx, tsc, git)
    allowed_commands = ["npm", "npx", "git", "node"]
    base_cmd = cmd.strip().split()[0]
    if base_cmd not in allowed_commands:
        return {
            "exit_code": -1,
            "stdout": "",
            "stderr": f"Command not allowed: {base_cmd}. Only {allowed_commands} are permitted."
        }
    
    try:
        # Run with a timeout of 60 seconds
        result = subprocess.run(
            cmd,
            shell=True,
            cwd=REPO_DIR,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            timeout=60
        )
        return {
            "exit_code": result.returncode,
            "stdout": result.stdout,
            "stderr": result.stderr
        }
    except subprocess.TimeoutExpired:
        return {
            "exit_code": -2,
            "stdout": "",
            "stderr": "Command execution timed out (60s limit)"
        }
    except Exception as e:
        return {
            "exit_code": -3,
            "stdout": "",
            "stderr": str(e)
        }

def get_recipes() -> List[Dict[str, Any]]:
    """List available agent recipes and prompt templates."""
    prompts_dir = resolve_path(".github/prompts")
    recipes = []
    if os.path.isdir(prompts_dir):
        for f in os.listdir(prompts_dir):
            if f.endswith(".prompt.md"):
                path = os.path.join(prompts_dir, f)
                with open(path, "r", encoding="utf-8") as file:
                    content = file.read()
                
                # Simple YAML front-matter parser
                description = ""
                if content.startswith("---"):
                    parts = content.split("---", 2)
                    if len(parts) >= 3:
                        front_matter = parts[1]
                        for line in front_matter.split("\n"):
                            if line.startswith("description:"):
                                description = line.replace("description:", "").strip()
                
                recipes.append({
                    "id": f.replace(".prompt.md", ""),
                    "filename": f,
                    "description": description or f"Execute {f} recipe",
                    "content": content
                })
    return recipes
