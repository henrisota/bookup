{
  lib,
  pkgs,
  ...
}: let
  node = pkgs.nodejs_22;
  npmExe = lib.getExe' node "npm";
in {
  packages =
    [node]
    ++ (with pkgs; [
      git
      gnugrep
      jq
      pre-commit
      semver-tool
    ]);

  languages = {
    javascript.enable = true;
    typescript.enable = true;
  };

  scripts = let
    scriptsList = with pkgs; [
      rec {
        name = "build";
        command = "${npmExe} run ${name}";
      }
      rec {
        name = "install";
        command = "${npmExe} ${name}";
      }
      rec {
        name = "lint";
        command = "${lib.getExe pre-commit} run --all-files";
      }
      rec {
        name = "run";
        command = "${npmExe} run ${name}";
      }
      rec {
        name = "zip";
        command = "${npmExe} run ${name}";
      }
    ];
    generateScript = script: {
      "ext:${script.name}".exec = script.command;
    };
  in
    builtins.foldl' (acc: script: acc // generateScript script) {} scriptsList;

  git-hooks.hooks = {
    check-added-large-files.enable = true;
    check-case-conflicts.enable = true;
    check-merge-conflicts.enable = true;
    check-json.enable = true;
    check-yaml.enable = true;
    editorconfig-checker.enable = false;

    end-of-file-fixer.enable = true;
    trim-trailing-whitespace.enable = true;

    actionlint.enable = true;

    alejandra.enable = true;
    deadnix = {
      enable = true;
      args = ["--edit"];
    };
    statix = {
      enable = true;
      args = ["fix" "-i" ".devenv"];
    };

    typos.enable = true;
  };
}
