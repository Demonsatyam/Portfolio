#!/bin/zsh
# dev review: renders a 3x3 contact sheet. usage: scripts/contact.sh out.jpg '[[1,2],[1,9],...]'
npx remotion still Contact "$1" --props="{\"tiles\": $2}" --log=error
