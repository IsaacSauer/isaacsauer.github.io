import tkinter as tk
from tkinter import filedialog, messagebox
from tkinter import ttk
import subprocess
import os
import threading

def run_batch(bat_path, file_path, progress_bar, btn):
    try:
        subprocess.run([bat_path, file_path], check=True)
        messagebox.showinfo("Done", "Image processed successfully.")
    except subprocess.CalledProcessError as e:
        messagebox.showerror("Error", f"Failed to run batch file.\n{e}")
    finally:
        progress_bar.stop()
        progress_bar.grid_remove()
        btn.config(state=tk.NORMAL)

def select_and_run():
    file_path = filedialog.askopenfilename(
        title="Select an image",
        filetypes=[("Image files", "*.png;*.jpg;*.jpeg;*.bmp;*.tiff;*.gif;"), ("All files", "*.*")]
    )
    if not file_path:
        return

    bat_path = os.path.abspath("DropHere.bat")

    if not os.path.isfile(bat_path):
        messagebox.showerror("Error", f"Batch file not found:\n{bat_path}")
        return

    # Disable button and show progress bar
    btn.config(state=tk.DISABLED)
    progress_bar.grid(row=1, column=0, padx=20, pady=10)
    progress_bar.start(10)

    # Run batch in background thread
    threading.Thread(target=run_batch, args=(bat_path, file_path, progress_bar, btn), daemon=True).start()

if __name__ == "__main__":
    root = tk.Tk()
    root.title("Run Image Upscaler")
    root.geometry("300x120")

    btn = tk.Button(root, text="Select Image to Upscale", command=select_and_run)
    btn.grid(row=0, column=0, padx=20, pady=20)

    progress_bar = ttk.Progressbar(root, mode="indeterminate")
    # Initially hidden
    progress_bar.grid(row=1, column=0, padx=20, pady=10)
    progress_bar.grid_remove()

    root.mainloop()
