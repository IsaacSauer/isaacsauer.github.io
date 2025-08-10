@echo off
REM Check if a file was dropped
if "%~1"=="" (
    echo Please drag and drop an image file onto this script.
    pause
    exit /b
)

REM Full path of the input image
set "input_image=%~1"

REM Extract the input image folder path
set "input_folder=%~dp1"

REM Extract the input image filename without extension
set "input_name=%~n1"

REM Extract the input image extension
set "input_ext=%~x1"

REM Construct output file path with _upscaled suffix
set "output_image=%input_folder%%input_name%_upscaled%input_ext%"

REM Change directory to the folder where this batch file is located
cd /d "%~dp0"

REM Run the realesrgan-ncnn-vulkan.exe command with the constructed paths
realesrgan-ncnn-vulkan.exe -i "%input_image%" -o "%output_image%"

echo Output saved as "%output_image%"

