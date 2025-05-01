import times, os, strutils, sequtils, random, streams

const
  width  = 40
  height = 20

type
  Grid = array[0..height-1, array[0..width-1, bool]]

proc initGrid(): Grid =
  var g: Grid
  for y in 0..<height:
    for x in 0..<width:
      g[y][x] = rand(2) == 0
  return g

proc neighbours*(g: Grid; y, x: int): int =
  var c = 0
  for dy in -1..1:
    for dx in -1..1:
      if dy != 0 or dx != 0:
        let yy = (y + dy + height) mod height
        let xx = (x + dx + width) mod width
        if g[yy][xx]: c.inc
  return c

proc step*(g: Grid): Grid =
  var newG: Grid
  for y in 0..<height:
    for x in 0..<width:
      let n = g.neighbours(y, x)
      newG[y][x] = (g[y][x] and (n == 2 or n == 3)) or (not g[y][x] and n == 3)
  return newG

proc draw(g: Grid) =
  stdout.write("\x1B[H") # move cursor to top-left
  for y in 0..<height:
    for x in 0..<width:
      stdout.write(if g[y][x]: "█" else: " ")
    stdout.write("\n")
  flushFile stdout

proc main() =
  randomize()
  var world = initGrid()
  stdout.write("\x1B[2J") # clear screen
  while true:
    draw(world)
    world = step(world)
    sleep(100) # milliseconds

when isMainModule:
  main()
