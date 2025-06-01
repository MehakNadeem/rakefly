# 🚀 RakeFly - The Ultimate Rake Task Runner for VS Code

RakeFly is a powerful, lightweight Visual Studio Code extension that lets you **discover**, **view**, and **execute** Ruby Rake tasks directly from your editor. Boost your productivity and never switch between terminal and code again—**run your Ruby tasks with a single click!**

## ✨ Features

- 🔍 **Smart Detection** - Automatically identifies Rake tasks in `.rake` files and Ruby files
- 💡 **CodeLens Integration** - Displays convenient "▶ Run Rake Task" buttons above each task definition
- 🧠 **Namespace Support** - Intelligently detects and combines namespaces with task names
- 🔄 **Multiple Task Formats** - Supports various task definition styles:
  - `task :name`
  - `task 'name'`
  - `task(:name)`
  - `task :name => :dependency`
  - Tasks with descriptions: `desc "description"` followed by `task :name`
- 💬 **Custom Commands** - Reads custom `bundle exec rake ...` commands from comments above tasks
- 💻 **Integrated Terminal** - Executes tasks in VS Code's terminal with workspace context awareness
- 📂 **Multi-root Support** - Works properly with multi-root workspaces, executing tasks in the correct folder

## 📸 Preview

Here's RakeFly in action:

```ruby
namespace :greeting do
  # bundle exec rake greeting:hello VERBOSE=true
  desc "Say Hello to the World"
  task hello: :environment do
    puts "Hello, Rake Runner!"
  end
end
```

🔼 A **"▶ Run Rake Task"** button appears above the task definition, and clicking it will:
1. Use the custom command from the comment if present (`bundle exec rake greeting:hello VERBOSE=true`)
2. Otherwise, intelligently construct a command with namespace (`bundle exec rake greeting:hello`)
3. Fall back to a simple command if no namespace is detected (`bundle exec rake hello`)

## 🛠️ Installation

### Via VS Code Marketplace

- Open VS Code
- Go to Extensions (Ctrl+Shift+X / Cmd+Shift+X)
- Search for **RakeFly**
- Click **Install**
- Reload VS Code when prompted

## ⚙️ Usage Guide

### Basic Usage

1. Open any Ruby file, or `.rake` file in VS Code
2. Look for the CodeLens "▶ Run Rake Task" button above task definitions
3. Click the button to execute the task in an integrated terminal

### Task Discovery

RakeFly detects tasks using a sophisticated regex pattern that supports:

- Basic task definitions: `task :name`
- Quoted task names: `task "name"` or `task 'name'`
- Tasks in parentheses: `task(:name)`
- Tasks with dependencies: `task :name => :dependency`
- Tasks with descriptions using `desc`

### Namespace Handling

RakeFly intelligently detects when a task is defined inside a namespace block and combines them when executing:

```ruby
namespace :deploy do
  task :staging do
    # When you click ▶ Run Rake Task, it executes: bundle exec rake deploy:staging
  end
end
```

### Custom Commands

Add custom rake commands in comments right above your task definition:

```ruby
# ACTIVE=true bundle exec rake custom_migrate
# TENANT_OVERRIDE-true bundle exec rake custom_migrate
task :custom_migrate do
  # ...
end
```

When you click the run button, the exact command from the comments will be executed.

## 📝 Troubleshooting

### Task Not Detected

If your task isn't being detected, check that:
- The file has proper Ruby syntax highlighting
- The task format matches one of the supported patterns
- The line starts with `task` or has a `desc` followed by a `task`

### Command Execution Issues

If tasks don't execute correctly:
- Make sure `bundle` is installed and in your PATH
- Check terminal output for error messages
- Verify that your task is defined properly in the Rake context

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. [Fork the repository](https://github.com/mehaknadeem/rakefly/fork)
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add a new feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request

## 📊 Release Notes

### 0.0.1
- Initial release of RakeFly
- Task detection and execution via CodeLens
- Namespace support
- Custom command detection from comments

---

**Enjoy running your Rake tasks with ease! 🚀**

