{
  lib,
  pkgs,
  ...
}: let
  inherit (lib) getExe;
in {
  packages = [pkgs.web-ext];

  languages.javascript.enable = true;

  tasks = let
    web-ext = getExe pkgs.web-ext;
    webExtTasksList = [
      {
        name = "build";
        args = ["--overwrite-dest"];
      }
      {
        name = "lint";
        args = [];
      }
      {
        name = "run";
        args = [];
      }
    ];
    generateWebExtTask = task: {
      "ext:${task.name}".exec = "${web-ext} ${task.name} ${builtins.concatStringsSep " " task.args}";
    };
  in
    builtins.foldl' (acc: task: acc // generateWebExtTask task) {} webExtTasksList;

  pre-commit.hooks = {
    editorconfig-checker.enable = false;
    end-of-file-fixer.enable = true;
    trim-trailing-whitespace.enable = true;

    treefmt = {
      enable = true;
      name = "formatter";
      settings = {
        formatters = [
          pkgs.alejandra
          pkgs.deadnix
          pkgs.statix

          pkgs.prettierd

          pkgs.taplo
        ];
      };
    };
  };
}
