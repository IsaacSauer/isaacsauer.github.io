import os
import sys
import tkinter as tk
from tkinter import filedialog, messagebox, ttk
import subprocess
import threading

def resource_path(relative_path):
    """Get absolute path to resource, works for dev and PyInstaller"""
    if hasattr(sys, "_MEIPASS"):
        return os.path.join(sys._MEIPASS, relative_path)
    return os.path.abspath(relative_path)

def run_upscaler(file_path, progress_bar, btn):
    try:
        input_folder = os.path.dirname(file_path)
        input_name, input_ext = os.path.splitext(os.path.basename(file_path))
        output_image = os.path.join(input_folder, f"{input_name}_upscaled{input_ext}")

        exe_path = resource_path("realesrgan-ncnn-vulkan.exe")

        if not os.path.isfile(exe_path):
            messagebox.showerror("Error", f"Upscaler executable not found:\n{exe_path}")
            return

        subprocess.run([exe_path, "-i", file_path, "-o", output_image], check=True)
        messagebox.showinfo("Done", f"Image processed successfully.\nSaved as:\n{output_image}")
    except subprocess.CalledProcessError as e:
        messagebox.showerror("Error", f"Upscaling failed.\n{e}")
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

    btn.config(state=tk.DISABLED)
    progress_bar.grid(row=1, column=0, padx=20, pady=10)
    progress_bar.start(10)

    threading.Thread(target=run_upscaler, args=(file_path, progress_bar, btn), daemon=True).start()

if __name__ == "__main__":
    root = tk.Tk()
    root.title("Run Image Upscaler")
    root.geometry("300x120")

    btn = tk.Button(root, text="Select Image to Upscale", command=select_and_run)
    btn.grid(row=0, column=0, padx=20, pady=20)

    progress_bar = ttk.Progressbar(root, mode="indeterminate")
    progress_bar.grid(row=1, column=0, padx=20, pady=10)
    progress_bar.grid_remove()

    root.mainloop()
