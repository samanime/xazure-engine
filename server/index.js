import { join } from 'path';
import express from 'express';
import nodeModuleCompile from './node-module-compile';

const PORT = process.env.PORT || 8000;

const ROOT = join(__dirname, '..');
const INDEX = join(__dirname, '../index.html');
const ZOMBIE_INDEX = join(__dirname, '../index-zombie.html');
const SPACE_INDEX = join(__dirname, '../index-space.html');
const NEIGHBORHOOD_INDEX = join(__dirname, '../index-neighborhood.html');
const PUBLIC = join(__dirname, '../dist');
const ASSETS = join(__dirname, '../assets');
const ZOMBIE_ASSETS = join(__dirname, '../zombie-assets');
const SPACE_ASSETS = join(__dirname, '../space-assets');
const NEIGHBORHOOD_ASSETS = join(__dirname, '../neighborhood-assets');

const app = express();

app.use('/node_modules', nodeModuleCompile(join(ROOT, 'node_modules')));
app.use('/zombie/assets', express.static(ZOMBIE_ASSETS));
app.use('/space/assets', express.static(SPACE_ASSETS));
app.use('/neighborhood/assets', express.static(NEIGHBORHOOD_ASSETS));
app.use('/public', express.static(PUBLIC));
app.use('/assets', express.static(ASSETS));

app.get('/zombie', (req, res) => res.sendFile(ZOMBIE_INDEX));
app.get('/space', (req, res) => res.sendFile(SPACE_INDEX));
app.get('/neighborhood', (req, res) => res.sendFile(NEIGHBORHOOD_INDEX));
app.get('/', (req, res) => res.sendFile(INDEX));

app.get('*', (req, res) => res.status(404).end());

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});