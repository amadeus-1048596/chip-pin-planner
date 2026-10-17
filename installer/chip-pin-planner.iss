; 芯片引脚规划器 安装脚本（Inno Setup 6）。CI 编译：
;   iscc /DVersion=vX.Y /DSrc=<abs>\dist\site installer\chip-pin-planner.iss
; 说明：不捆绑运行时、不做应用壳，只安装静态文件夹 + 快捷方式 + 标准卸载。
#ifndef Src
  #define Src "..\dist\site"
#endif
#ifndef Version
  #define Version "0.0"
#endif

[Setup]
AppId={{8F2C1D74-9B3A-4E52-A6D0-5C7E91B2F4A8}
AppName=芯片引脚规划器
AppVersion={#Version}
AppPublisher=amadeus-1048596
DefaultDirName={localappdata}\Programs\chip-pin-planner
DisableProgramGroupPage=yes
PrivilegesRequired=lowest
OutputDir=..\dist
OutputBaseFilename=chip-pin-planner-setup-{#Version}
Compression=lzma2/max
UninstallDisplayName=芯片引脚规划器

[Files]
Source: "{#Src}\*"; DestDir: "{app}"; Flags: recursesubdirs createallsubdirs ignoreversion

[Tasks]
Name: "desktopicon"; Description: "创建桌面快捷方式"; Flags: checkedonce

[Icons]
Name: "{autoprograms}\芯片引脚规划器"; Filename: "{app}\index.html"
Name: "{autodesktop}\芯片引脚规划器"; Filename: "{app}\index.html"; Tasks: desktopicon

[Run]
Filename: "{app}\index.html"; Description: "立即打开"; Flags: postinstall shellexec nowait
