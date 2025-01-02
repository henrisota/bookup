{pkgs, ...}: {
  packages = with pkgs; [
    nodejs_22
  ];

  languages = {
    javascript.enable = true;
    typescript.enable = true;
  };

  tasks = let
    tasksList = [
      rec {
        name = "build";
        command = "npm run ${name}";
      }
      rec {
        name = "install";
        command = "npm ${name}";
      }
      rec {
        name = "run";
        command = "npm run ${name}";
      }
      rec {
        name = "zip";
        command = "npm run ${name}";
      }
    ];
    generateTask = task: {
      "ext:${task.name}".exec = task.command;
    };
  in
    builtins.foldl' (acc: task: acc // generateTask task) {} tasksList;

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
