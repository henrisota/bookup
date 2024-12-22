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
  in {
    "ext:lint".exec = "${web-ext} lint";
    "ext:run".exec = "${web-ext} run";
  };

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
