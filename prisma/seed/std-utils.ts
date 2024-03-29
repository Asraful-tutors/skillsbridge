export function writeErr(str: string) {
  process.stderr.write(str);
}

export function writeLine(str: string) {
  process.stdout.write(str);
}

export function replaceLine(str: string) {
  process.stdout.clearLine(0);
  process.stdout.write("\r" + str);
}

let frameIndex = 0;
const spins = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
const red = "\x1B[31m";
const blue = "\x1B[34m";
const green = "\x1B[32m";
const reset = "\x1B[0m";

export const check = `${green}✔${reset}`;
export const cross = `${red}✘${reset}`;
export const spinner = () => `${blue}${spins[frameIndex]}${reset}`;

export function withSpinner() {
  frameIndex = (frameIndex + 1) % spins.length;
  const interval = setInterval(() => {
    process.stdout.moveCursor(0, 0);
    process.stdout.write("\r" + spinner());
  }, 44);

  return clearInterval.bind(null, interval);
}

let interval = setInterval(() => {
  frameIndex = (frameIndex + 1) % spins.length;
}, 44);

export function endSpinner() {
  clearInterval(interval);
}
