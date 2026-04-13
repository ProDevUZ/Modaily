const fs = require("fs");
const path = require("path");

const clientDir = path.join(process.cwd(), "node_modules", "@prisma", "client");

if (!fs.existsSync(clientDir)) {
  process.exit(0);
}

const realClientDir = fs.realpathSync(clientDir);
const packageNodeModulesDir = path.dirname(path.dirname(realClientDir));
const localPrismaDir = path.join(packageNodeModulesDir, ".prisma");
const targetLink = path.join(realClientDir, ".prisma");

if (!fs.existsSync(localPrismaDir) || fs.existsSync(targetLink)) {
  process.exit(0);
}

const relativeTarget = path.relative(realClientDir, localPrismaDir);
fs.symlinkSync(relativeTarget, targetLink, "dir");
