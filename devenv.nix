{
  lib,
  pkgs,
  ...
}: let
  inherit (lib) getExe;

  wxt = let
    pname = "wxt";
    version = "v0.19.23";
  in
    with pkgs;
      stdenv.mkDerivation (final: {
        inherit pname version;

        src = pkgs.fetchFromGitHub {
          owner = "wxt-dev";
          repo = pname;
          rev = "wxt-${version}";
          sha256 = "sha256-qr4ON2EPU00rVHF7OgWL2WxRaIaWHbYHpj+HlQ/2600=";
        };

        pnpmDeps = pnpm_9.fetchDeps {
          inherit (final) pname version src;
          hash = "sha256-pOq1ftXVriFMopU6Ypg8aRV9sGJUl9jVQjsy0c3j+so=";
        };

        nativeBuildInputs = [
          makeWrapper
          nodejs_22
          pnpm_9.configHook
        ];

        buildInputs = with pkgs; [
          nodejs_22
        ];

        buildPhase = ''
          runHook preBuild

          pnpm --filter=wxt build

          runHook postBuild
        '';

        installPhase = ''
          runHook preInstall

          mkdir -p "$out/bin" "$out/lib/node_modules/wxt"
          cp -r packages node_modules "$out/lib/node_modules/wxt"

          makeWrapper "${lib.getExe nodejs_22}" "$out/bin/wxt" \
            --inherit-argv0 \
            --prefix NODE_PATH : $out/lib/node_modules/wxt/node_modules \
            --prefix NODE_PATH : $out/lib/node_modules/wxt/packages/wxt/node_modules \
            --add-flags "$out/lib/node_modules/wxt/packages/wxt/bin/wxt.mjs"

          runHook postInstall
        '';

        meta = {
          description = "Next-gen Web Extension Framework";
          homepage = "https://github.com/wxt-dev/wxt";
          license = lib.licenses.mit;
          mainProgram = pname;
        };
      });
in {
  packages = [
    pkgs.web-ext
    wxt
  ];

  languages.javascript.enable = true;

  tasks = let
    web-ext = getExe pkgs.web-ext;
    webExtTasksList = [
      {
        name = "build";
        args = [
          "--artifacts-dir"
          "artifacts"
          "--overwrite-dest"
        ];
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
