import os

root_dir = "."

def build_file_tree(path):
    tree = {}
    for dirpath, dirnames, filenames in os.walk(path):
        rel_dir = os.path.relpath(dirpath, root_dir)
        if rel_dir == ".":
            rel_dir = ""
        subtree = tree
        if rel_dir:
            for part in rel_dir.split(os.sep):
                subtree = subtree.setdefault(part, {})
        for f in filenames:
            if f.endswith(".html") and f != "index.html":
                subtree[f] = None
    return tree

def prune_empty(tree):
    """Remove empty folders that have no .html files inside."""
    keys_to_delete = []
    for key, value in tree.items():
        if value is not None:  # directory
            prune_empty(value)
            if not value:
                keys_to_delete.append(key)
    for k in keys_to_delete:
        del tree[k]

def render_tree(tree, prefix="", nested=True):
    # Root call: nested=False, children: nested=True
    ul_class = " class='nested'" if nested else ""
    html = f"<ul{ul_class}>\n"
    for name, content in sorted(tree.items()):
        if content is None:  # file
            filepath = os.path.join(prefix, name).replace("\\", "/")
            html += f'  <li><a class="file" href="{filepath}">{name}</a></li>\n'
        else:  # directory
            html += f'  <li class=""><div class="folder"><span class="caret"></span>{name}/</div>\n'
            html += render_tree(content, os.path.join(prefix, name), nested=True)
            html += "  </li>\n"
    html += "</ul>\n"
    return html

file_tree = build_file_tree(root_dir)
prune_empty(file_tree)

html_content = """<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Project Index</title>
  <style>
    :root {
      --bg-color: #f9fafb;
      --text-color: #333;
      --card-bg: #fff;
      --link-color: #007bff;
      --link-hover-bg: #007bff;
      --link-hover-color: #fff;
    }
    body.dark {
      --bg-color: #1e1e1e;
      --text-color: #e0e0e0;
      --card-bg: #2c2c2c;
      --link-color: #4ea3ff;
      --link-hover-bg: #4ea3ff;
      --link-hover-color: #000;
    }
    body {
      font-family: "Segoe UI", Roboto, Arial, sans-serif;
      background: var(--bg-color);
      color: var(--text-color);
      padding: 40px;
      display: flex;
      flex-direction: column;
      align-items: center;
      transition: background 0.3s, color 0.3s;
    }
    h1 {
      margin-bottom: 20px;
      font-size: 2rem;
      text-align: center;
      transition: color 0.3s;
    }
    .theme-toggle {
      margin-bottom: 20px;
      padding: 8px 16px;
      border: none;
      border-radius: 6px;
      background: var(--link-color);
      color: var(--link-hover-color);
      font-size: 0.9rem;
      cursor: pointer;
      transition: background 0.2s, color 0.2s;
    }
    .theme-toggle:hover {
      background: var(--link-hover-bg);
      color: var(--link-hover-color);
    }
    .tree-container {
      background: var(--card-bg);
      padding: 20px 30px;
      border-radius: 10px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      min-width: 300px;
      max-width: 600px;
      transition: background 0.3s;
    }
    ul {
      list-style: none;
      padding-left: 20px;
      margin: 0;
    }
    li {
      margin: 5px 0;
      line-height: 1.6;
      position: relative;
    }
    a {
      color: var(--link-color);
      text-decoration: none;
      padding: 2px 4px;
      border-radius: 4px;
      transition: background 0.2s, color 0.2s;
    }
    a:hover {
      background: var(--link-hover-bg);
      color: var(--link-hover-color);
    }
    .folder {
      cursor: pointer;
      font-weight: 600;
      display: flex;
      align-items: center;
      user-select: none;
      transition: color 0.3s;
    }
    .folder::before {
      content: "📂";
      margin-right: 6px;
    }
    .file::before {
      content: "📄";
      margin-right: 6px;
    }
    .nested {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s ease-out;
    }
    .open > .nested {
      max-height: 500px;
      transition: max-height 0.5s ease-in;
    }
    .caret::after {
      content: "▶";
      font-size: 0.8rem;
      margin-left: 6px;
      transition: transform 0.2s;
    }
    .open > .folder .caret::after {
      transform: rotate(90deg);
    }
  </style>
</head>
<body>
  <h1>📂 Project Index</h1>
  <button class="theme-toggle" onclick="toggleTheme()">🌙 Toggle Dark Mode</button>
  <div class="tree-container">
"""

# Render root without "nested"
html_content += render_tree(file_tree, nested=False)

html_content += """
  </div>
  <script>
    // Collapsible folders
    document.querySelectorAll(".folder").forEach(folder => {
      folder.addEventListener("click", function(e) {
        e.stopPropagation();
        const parent = this.parentElement;
        parent.classList.toggle("open");
      });
    });

    // Dark mode toggle
    function toggleTheme() {
      document.body.classList.toggle("dark");
      localStorage.setItem("theme", 
        document.body.classList.contains("dark") ? "dark" : "light");
    }

    // Load saved theme
    if (localStorage.getItem("theme") === "dark") {
      document.body.classList.add("dark");
    }
  </script>
</body>
</html>
"""

with open("menu.html", "w", encoding="utf-8") as f:
    f.write(html_content)

print("✅ menu.html generated and now root is visible!")
