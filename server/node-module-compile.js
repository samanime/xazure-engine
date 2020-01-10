import { existsSync } from 'fs';
import { join } from 'path';
import { transformFileSync } from '@babel/core';

const transformOptions = {
  ...require('../src/.babelrc.js'),
  sourceMaps: false
};

export default (nodeModulesDir, pathRoot) => (req, res, next) => {
  const filePath = join(nodeModulesDir, req.path.replace(pathRoot, ''));

  if (existsSync(filePath)) {
    const code = transformFileSync(filePath, transformOptions).code
      .replace(/process\.env\.NODE_ENV/g, `"${process.env.NODE_ENV || 'development'}"`);

    res.header('Content-Type', 'application/javascript')
      .send(code);
  } else {
    res.sendStatus(404).end();
  }

  next();
};