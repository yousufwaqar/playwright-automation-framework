import os
import sys
import time
from rich.console import Console
from rich.panel import Panel
from rich.table import Table
from rich.progress import Progress, SpinnerColumn, TextColumn
from rich.live import Live
from rich.prompt import Prompt, Confirm

# Setup path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from agent.orchestrator import SDETAgentOrchestrator
from agent import tools

console = Console()

def print_header():
    console.clear()
    console.print(Panel.fit(
        "[bold cyan]🤖 AI SDET WORKBENCH & AGENT ENGINE[/bold cyan]\n"
        "[dim]Powered by Custom Lightweight Python Agent Architecture[/dim]",
        border_style="cyan"
    ))

def display_status(is_live: bool):
    status_str = "[bold green]LIVE LLM MODE[/bold green]" if is_live else "[bold yellow]SIMULATION & DRY-RUN MODE[/bold yellow]"
    console.print(f"Engine Status: {status_str}\n")

def list_recipes_table():
    recipes = tools.get_recipes()
    table = Table(title="Available SDET Action Recipes", border_style="cyan")
    table.add_column("ID", style="yellow")
    table.add_column("Description", style="white")
    table.add_column("Filename", style="dim cyan")
    
    # Add our built-in scenarios as options too
    table.add_row("fix_test", "Auto-Fix a Locator Drift (Simulates live failure & fixes file)", "Built-in Simulator")
    table.add_row("create_page", "Create a new Page Object & smoke test module", "Built-in Simulator")
    table.add_row("add_a11y", "Integrate automated accessibility check using Axe-core", "Built-in Simulator")

    for r in recipes:
        # Avoid duplicate ids
        if r['id'] not in ("fix_test", "create_page", "add_a11y"):
            table.add_row(r['id'], r['description'], r['filename'])
    
    console.print(table)

def main():
    orchestrator = SDETAgentOrchestrator()
    print_header()
    display_status(orchestrator.is_live)
    list_recipes_table()
    
    choice = Prompt.ask(
        "\nSelect a Recipe ID or enter your custom task details", 
        default="fix_test"
    )
    
    task_desc = choice
    scenario_id = None
    
    if choice in ("fix_test", "create_page", "add_a11y"):
        scenario_id = choice
        if choice == "fix_test":
            task_desc = "Fix the locator drift on the Login Page"
        elif choice == "create_page":
            task_desc = "Create a new settings page object and smoke test"
        elif choice == "add_a11y":
            task_desc = "Add an accessibility audit for the dashboard page"
            
    console.print(f"\n[bold green]🚀 Launching Agent Task:[/bold green] '{task_desc}'\n")
    
    with Progress(
        SpinnerColumn(),
        TextColumn("[progress.description]{task.description}"),
        transient=True
    ) as progress:
        task_id = progress.add_task(description="Starting agent loop...", total=None)
        
        for step in orchestrator.run_task(task_desc, scenario_id=scenario_id):
            if step["type"] == "status":
                progress.update(task_id, description=f"[bold cyan]{step['message']}[/bold cyan]")
                time.sleep(1)
            elif step["type"] == "thought":
                # Print thought nicely outside progress
                progress.stop()
                console.print(Panel(step["text"], title="🤔 Agent Thinking", border_style="yellow", expand=False))
                progress.start()
            elif step["type"] == "tool_call":
                progress.stop()
                console.print(f"🛠️ [bold cyan]Tool Call:[/bold cyan] [green]{step['tool']}[/green] with args: [dim]{step['arguments']}[/dim]")
                progress.start()
            elif step["type"] == "tool_result":
                progress.stop()
                output_preview = step["output"]
                if len(output_preview) > 300:
                    output_preview = output_preview[:300] + "\n... (truncated)"
                console.print(Panel(output_preview, title=f"📥 Tool Result ({step['tool']})", border_style="blue", expand=False))
                progress.start()
            elif step["type"] == "error":
                progress.stop()
                console.print(f"❌ [bold red]Error:[/bold red] {step['message']}")
                progress.start()
            elif step["type"] == "summary":
                progress.stop()
                console.print("\n" + Panel(step["message"], title="🏁 Agent Execution Summary", border_style="green", expand=False))
                progress.start()

    console.print("\n[bold green]✨ Agent execution loop finished successfully![/bold green]\n")

if __name__ == "__main__":
    main()
