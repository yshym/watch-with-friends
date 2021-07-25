{ pkgs ? import <nixpkgs> { } }:

with pkgs;

mkShell {
  nativeBuildInputs = [ postgresql ];

  buildInputs = lib.optionals stdenv.isDarwin [ openssl ];
}
