import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  // Register for both Ruby files and Rakefiles
  const selector = [
    { language: "ruby" },
    { pattern: "**/Rakefile" },
    { pattern: "**/*.rake" },
  ];

  const provider = new RakeTaskCodeLensProvider();

  context.subscriptions.push(
    vscode.languages.registerCodeLensProvider(selector, provider),
    vscode.commands.registerCommand("rake-runner.executeTask", runRakeTask)
  );
}

class RakeTaskCodeLensProvider implements vscode.CodeLensProvider {
  provideCodeLenses(document: vscode.TextDocument): vscode.CodeLens[] {
    const codeLenses: vscode.CodeLens[] = [];
    const text = document.getText();

    // regex to match various task formats
    const taskRegex =
      /(?:^task\s+|^[ \t]*desc\s+['"].+?['"]\s*\n\s*task\s+)(\(?[:'"]?([\w]+)(?::['"]?)?\)?)/gm;

    let match;
    while ((match = taskRegex.exec(text)) !== null) {
      const taskName = match[2];
      const line = document.positionAt(match.index).line;
      const range = new vscode.Range(
        new vscode.Position(line, 0),
        new vscode.Position(line, match[0].length)
      );

      codeLenses.push(
        new vscode.CodeLens(range, {
          title: "▶ Run Rake Task",
          command: "rake-runner.executeTask",
          arguments: [taskName, document.fileName, line],
          tooltip: `Run ${taskName}`,
        })
      );
    }

    return codeLenses;
  }
}

async function runRakeTask(taskName: string, filePath: string, line: number) {
  const workspaceFolder = vscode.workspace.getWorkspaceFolder(
    vscode.Uri.file(filePath)
  );
  if (!workspaceFolder) {
    vscode.window.showErrorMessage("No workspace folder found");
    return;
  }

  try {
    const document = await vscode.workspace.openTextDocument(filePath);

    // Extract namespace from the file
    let namespace = "";
    const text = document.getText();
    const namespaceMatch = text.match(/namespace\s+:(\w+)/);
    if (namespaceMatch && namespaceMatch[1]) {
      namespace = namespaceMatch[1];
    }

    // Collect all commands from comments above the task
    const commands: string[] = [];
    for (let i = line - 1; i >= 0; i--) {
      const lineText = document.lineAt(i).text.trim();
      if (lineText.startsWith("#")) {
        const potentialCommand = lineText.substring(1).trim();
        if (potentialCommand.includes("bundle exec rake")) {
          commands.unshift(potentialCommand); // Add to the beginning to maintain order from top to bottom
        }
      } else {
        break; // Stop if we hit a non-comment line
      }
    }

    // If no commands found in comments, construct the default command with namespace
    if (commands.length === 0 && namespace) {
      commands.push(`bundle exec rake ${namespace}:${taskName}`);
    } else if (commands.length === 0) {
      commands.push(`bundle exec rake ${taskName}`); // Fallback without namespace
    }

    // Execute each command in the terminal
    const terminal = vscode.window.createTerminal({
      name: `Rake: ${taskName}`,
      cwd: workspaceFolder.uri.fsPath,
    });

    for (const command of commands) {
      terminal.sendText(command);
      await new Promise(resolve => setTimeout(resolve, 500)); // Small delay to ensure commands run sequentially
    }

    terminal.show();
    vscode.window.showInformationMessage(`Running: ${commands.join(", ")}`);
  } catch (error) {
    vscode.window.showErrorMessage(`Failed to run task: ${error}`);
  }
}

export function deactivate() {}