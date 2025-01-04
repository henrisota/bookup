{pkgs, ...}: {
  packages = with pkgs; [
    git
    gnugrep
    jq
    nodejs_22
    semver-tool
  ];

  languages.typescript.enable = true;

  scripts = let
    scriptsList = [
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
    generateScript = script: {
      "ext:${script.name}".exec = script.command;
    };
  in
    builtins.foldl' (acc: script: acc // generateScript script) {} scriptsList;

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

          pkgs.taplo
        ];
      };
    };
  };
}
